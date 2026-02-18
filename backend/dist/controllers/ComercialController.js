"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ComercialRepository_1 = __importDefault(require("../repositories/ComercialRepository"));
class ComercialController {
    async createAgendamento(req, res) {
        try {
            const { nome, email, telefone, data_hora, produto_id, duracao_minutos, status } = req.body;
            // Validação básica
            if (!nome || !email || !telefone || !data_hora || !produto_id) {
                return res.status(400).json({
                    message: 'Campos obrigatórios: nome, email, telefone, data_hora, produto_id'
                });
            }
            // Normaliza data_hora para UTC (evita falsos negativos na checagem)
            const dataHoraIso = data_hora?.endsWith('Z') ? data_hora : `${data_hora}Z`;
            // Verifica disponibilidade do horário
            const duracao = duracao_minutos || 60;
            const disponibilidade = await this.verificarDisponibilidade(dataHoraIso, duracao);
            console.log('Disponibilidade verificada:', disponibilidade);
            if (!disponibilidade.disponivel) {
                return res.status(409).json({
                    message: 'Horário indisponível',
                    conflitos: disponibilidade.agendamentos
                });
            }
            const agendamento = {
                nome,
                email,
                telefone,
                data_hora: dataHoraIso,
                produto_id,
                duracao_minutos: duracao,
                status: status || 'agendado'
            };
            console.log('Criando agendamento:', agendamento);
            const createdData = await ComercialRepository_1.default.createAgendamento(agendamento);
            return res.status(201).json(createdData);
        }
        catch (error) {
            console.error('Erro ao criar agendamento:', error);
            return res.status(500).json({
                message: 'Erro ao criar agendamento',
                error: error.message
            });
        }
    }
    /**
     * Cria sessão de checkout do MercadoPago e retorna o link
     * O agendamento será criado pelo webhook após confirmação do pagamento
     */
    async createAgendamentoMercadoPago(req, res) {
        try {
            const { nome, email, telefone, data_hora, produto_id, produto_nome, valor, duracao_minutos } = req.body;
            // Validação básica
            if (!nome || !email || !telefone || !data_hora || !produto_id || !produto_nome || !valor) {
                return res.status(400).json({
                    message: 'Campos obrigatórios: nome, email, telefone, data_hora, produto_id, produto_nome, valor'
                });
            }
            // Normaliza data_hora para UTC
            const dataHoraIso = data_hora?.endsWith('Z') ? data_hora : `${data_hora}Z`;
            // Verifica disponibilidade do horário antes de criar o checkout
            const duracao = duracao_minutos || 60;
            const disponibilidade = await this.verificarDisponibilidade(dataHoraIso, duracao);
            if (!disponibilidade.disponivel) {
                return res.status(409).json({
                    message: 'Horário indisponível',
                    conflitos: disponibilidade.agendamentos
                });
            }
            // Cria a preferência de checkout no MercadoPago
            const MercadoPagoService = (await Promise.resolve().then(() => __importStar(require('../services/MercadoPagoService')))).default;
            const checkout = await MercadoPagoService.createCheckoutPreference({
                nome,
                email,
                telefone,
                data_hora: dataHoraIso,
                produto_id,
                produto_nome,
                valor,
                duracao_minutos: duracao
            });
            console.log('Checkout MercadoPago criado:', checkout.preferenceId);
            return res.status(200).json({
                checkoutUrl: checkout.checkoutUrl,
                preferenceId: checkout.preferenceId,
                message: 'Checkout criado. Aguardando pagamento para confirmar agendamento.'
            });
        }
        catch (error) {
            console.error('Erro ao criar checkout MercadoPago:', error);
            return res.status(500).json({
                message: 'Erro ao criar checkout',
                error: error.message
            });
        }
    }
    /**
     * Cria sessão de checkout do Stripe e retorna o link
     * O agendamento será criado pelo webhook após confirmação do pagamento
     */
    async createAgendamentoStripe(req, res) {
        try {
            const { nome, email, telefone, data_hora, produto_id, produto_nome, valor, duracao_minutos, isEuro } = req.body;
            // Validação básica
            if (!nome || !email || !telefone || !data_hora || !produto_id || !produto_nome || !valor) {
                return res.status(400).json({
                    message: 'Campos obrigatórios: nome, email, telefone, data_hora, produto_id, produto_nome, valor'
                });
            }
            // Normaliza data_hora para UTC
            const dataHoraIso = data_hora?.endsWith('Z') ? data_hora : `${data_hora}Z`;
            // Verifica disponibilidade do horário antes de criar o checkout
            const duracao = duracao_minutos || 60;
            const disponibilidade = await this.verificarDisponibilidade(dataHoraIso, duracao);
            if (!disponibilidade.disponivel) {
                return res.status(409).json({
                    message: 'Horário indisponível',
                    conflitos: disponibilidade.agendamentos
                });
            }
            // Cria a sessão de checkout no Stripe
            const StripeService = (await Promise.resolve().then(() => __importStar(require('../services/StripeService')))).default;
            const checkout = await StripeService.createCheckoutSession({
                nome,
                email,
                telefone,
                data_hora: dataHoraIso,
                produto_id,
                produto_nome,
                valor: Math.round(valor * 100), // Converte para centavos (Stripe espera o menor valor da moeda)
                duracao_minutos: duracao,
                isEuro: isEuro ?? true
            });
            console.log('Checkout Stripe criado:', checkout.sessionId);
            console.log('Checkout Stripe criado:', checkout.checkoutUrl);
            return res.status(200).json({
                checkoutUrl: checkout.checkoutUrl,
                sessionId: checkout.sessionId,
                message: 'Checkout criado. Aguardando pagamento para confirmar agendamento.'
            });
        }
        catch (error) {
            console.error('Erro ao criar checkout Stripe:', error);
            return res.status(500).json({
                message: 'Erro ao criar checkout',
                error: error.message
            });
        }
    }
    /**
     * Processa o webhook do Stripe para confirmar agendamento após o pagamento
     */
    async handleStripeWebhook(req, res) {
        const sig = req.headers['stripe-signature'];
        const StripeService = (await Promise.resolve().then(() => __importStar(require('../services/StripeService')))).default;
        let event;
        try {
            // req.body deve ser o RAW body para validação da assinatura
            event = StripeService.validateWebhookSignature(req.body, sig);
        }
        catch (err) {
            console.error('Erro na validação do Webhook Stripe:', err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }
        // Handle the event
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                const metadata = session.metadata;
                if (metadata && metadata.tipo === 'agendamento') {
                    try {
                        console.log('Pagamento Stripe confirmado. Criando agendamento:', metadata.email);
                        const agendamento = {
                            nome: metadata.nome,
                            email: metadata.email,
                            telefone: metadata.telefone,
                            data_hora: metadata.data_hora,
                            produto_id: metadata.produto_id,
                            duracao_minutos: parseInt(metadata.duracao_minutos) || 60,
                            status: 'agendado'
                        };
                        await ComercialRepository_1.default.createAgendamento(agendamento);
                        console.log('Agendamento criado com sucesso via Webhook Stripe');
                    }
                    catch (error) {
                        console.error('Erro ao criar agendamento via Webhook Stripe:', error);
                        return res.status(500).json({ message: 'Erro ao processar agendamento' });
                    }
                }
                else if (metadata && metadata.tipo === 'orcamento') {
                    try {
                        const documentoIds = metadata.documentoIds?.split(',') || [];
                        console.log('Pagamento Stripe confirmado para orçamentos:', documentoIds);
                        const TraducoesRepository = (await Promise.resolve().then(() => __importStar(require('../repositories/TraducoesRepository')))).default;
                        for (const docId of documentoIds) {
                            const orcamento = await TraducoesRepository.getOrcamentoByDocumento(docId);
                            if (orcamento) {
                                await TraducoesRepository.aprovarOrcamento(orcamento.id, docId);
                            }
                        }
                        console.log('Orçamentos aprovados com sucesso via Webhook Stripe');
                    }
                    catch (error) {
                        console.error('Erro ao aprovar orçamentos via Webhook Stripe:', error);
                        return res.status(500).json({ message: 'Erro ao processar aprovação de orçamentos' });
                    }
                }
                break;
            }
            default:
                console.log(`Evento Stripe não processado: ${event.type}`);
        }
        // Return a 200 response to acknowledge receipt of the event
        res.json({ received: true });
    }
    async verificarDisponibilidade(data_hora, duracao_minutos) {
        console.log('Verificando disponibilidade para:', data_hora, duracao_minutos);
        // Garante parsing em UTC
        const inicioUTC = data_hora.endsWith('Z') ? data_hora : `${data_hora}Z`;
        const inicio = new Date(inicioUTC);
        const fim = new Date(inicio.getTime() + duracao_minutos * 60000);
        const inicioIso = inicio.toISOString();
        const fimIso = fim.toISOString();
        // Busca agendamentos conflitantes no repository (intervalo fechado no início, aberto no fim)
        const agendamentos = await ComercialRepository_1.default.getAgendamentosByIntervalo(inicioIso, fimIso);
        // Se encontrou algum agendamento, o horário está ocupado
        const disponivel = agendamentos.length === 0;
        console.log('Disponibilidade:', disponivel, 'Conflitos:', agendamentos.length);
        return {
            disponivel,
            agendamentos
        };
    }
    async checkDisponibilidade(req, res) {
        try {
            const { data_hora, duracao_minutos } = req.query;
            if (!data_hora) {
                return res.status(400).json({ message: 'data_hora é obrigatório' });
            }
            const dataHoraIso = data_hora?.endsWith('Z')
                ? data_hora
                : `${data_hora}Z`;
            const resultado = await this.verificarDisponibilidade(dataHoraIso, parseInt(duracao_minutos) || 60);
            return res.status(200).json(resultado);
        }
        catch (error) {
            console.error('Erro ao verificar disponibilidade:', error);
            return res.status(500).json({
                message: 'Erro ao verificar disponibilidade',
                error: error.message
            });
        }
    }
    async getAgendamentosByData(req, res) {
        try {
            const { data } = req.params;
            if (!data) {
                return res.status(400).json({ message: 'data é obrigatório' });
            }
            const agendamentos = await ComercialRepository_1.default.getAgendamentosByData(data);
            return res.status(200).json(agendamentos);
        }
        catch (error) {
            console.error('Erro ao buscar agendamentos:', error);
            return res.status(500).json({
                message: 'Erro ao buscar agendamentos',
                error: error.message
            });
        }
    }
}
exports.default = new ComercialController();
