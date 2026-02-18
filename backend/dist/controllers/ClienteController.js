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
const ClienteRepository_1 = __importDefault(require("../repositories/ClienteRepository"));
const JuridicoRepository_1 = __importDefault(require("../repositories/JuridicoRepository"));
const documentosConfig_1 = require("../config/documentosConfig");
class ClienteController {
    // GET /cliente/:clienteId/documentos-requeridos
    // Retorna os documentos necessários baseado nos processos do cliente
    async getDocumentosRequeridos(req, res) {
        try {
            const { clienteId } = req.params;
            if (!clienteId) {
                return res.status(400).json({ message: 'clienteId é obrigatório' });
            }
            // Buscar os processos do cliente
            const processos = await ClienteRepository_1.default.getProcessosByClienteId(clienteId);
            if (!processos || processos.length === 0) {
                return res.status(200).json({
                    message: 'Cliente não possui processos ativos',
                    data: [],
                    processos: []
                });
            }
            // Para cada processo, buscar os documentos requeridos baseado no tipo_servico
            const documentosRequeridos = [];
            for (const processo of processos) {
                const docsDoServico = (0, documentosConfig_1.getDocumentosPorTipoServico)(processo.tipo_servico);
                // Adicionar cada documento com as informações do processo
                for (const doc of docsDoServico) {
                    documentosRequeridos.push({
                        ...doc,
                        processoId: processo.id,
                        processoTipo: processo.tipo_servico,
                        processoStatus: processo.status,
                        processoEtapa: processo.etapa_atual
                    });
                }
            }
            return res.status(200).json({
                message: 'Documentos requeridos recuperados com sucesso',
                data: documentosRequeridos,
                processos: processos.map(p => ({
                    id: p.id,
                    tipoServico: p.tipo_servico,
                    status: p.status,
                    etapaAtual: p.etapa_atual
                })),
                totalDocumentos: documentosRequeridos.length
            });
        }
        catch (error) {
            console.error('Erro ao buscar documentos requeridos:', error);
            return res.status(500).json({
                message: 'Erro ao buscar documentos requeridos',
                error: error.message
            });
        }
    }
    // GET /cliente/by-parceiro/:parceiroId
    async getByParceiro(req, res) {
        try {
            const { parceiroId } = req.params;
            if (!parceiroId) {
                return res.status(400).json({ message: 'Parâmetro parceiroId é obrigatório' });
            }
            const data = await ClienteRepository_1.default.getClientByParceiroId(parceiroId);
            return res.status(200).json(data ?? []);
        }
        catch (err) {
            console.error('Erro inesperado ao consultar clientes:', err);
            return res.status(500).json({ message: 'Erro inesperado ao consultar clientes', error: err.message });
        }
    }
    // GET /cliente/:clienteId/dependentes
    async getDependentes(req, res) {
        try {
            const { clienteId } = req.params;
            if (!clienteId) {
                return res.status(400).json({ message: 'clienteId é obrigatório' });
            }
            console.log('Controller: Recebendo request getDependentes para:', clienteId);
            const dependentes = await ClienteRepository_1.default.getDependentesByClienteId(clienteId);
            return res.status(200).json({
                message: 'Dependentes recuperados com sucesso',
                data: dependentes
            });
        }
        catch (error) {
            console.error('Erro ao buscar dependentes:', error);
            return res.status(500).json({
                message: 'Erro ao buscar dependentes',
                error: error.message
            });
        }
    }
    // GET /cliente/:clienteId/processos
    async getProcessos(req, res) {
        try {
            const { clienteId } = req.params;
            if (!clienteId) {
                return res.status(400).json({ message: 'clienteId é obrigatório' });
            }
            const processos = await ClienteRepository_1.default.getProcessosByClienteId(clienteId);
            return res.status(200).json({
                message: 'Processos recuperados com sucesso',
                data: processos
            });
        }
        catch (error) {
            console.error('Erro ao buscar processos:', error);
            return res.status(500).json({
                message: 'Erro ao buscar processos',
                error: error.message
            });
        }
    }
    // GET /cliente/:clienteId
    async getCliente(req, res) {
        try {
            const { clienteId } = req.params;
            if (!clienteId) {
                return res.status(400).json({ message: 'clienteId é obrigatório' });
            }
            const cliente = await ClienteRepository_1.default.getClienteById(clienteId);
            return res.status(200).json({
                message: 'Cliente recuperado com sucesso',
                data: cliente
            });
        }
        catch (error) {
            console.error('Erro ao buscar cliente:', error);
            return res.status(500).json({
                message: 'Erro ao buscar cliente',
                error: error.message
            });
        }
    }
    async register(req, res) {
        try {
            const { nome, email, whatsapp, parceiro_id, status } = req.body;
            const Cliente = { nome, email, whatsapp, parceiro_id, status };
            const createdData = await ClienteRepository_1.default.register(Cliente);
            return res.status(201).json(createdData);
        }
        catch (error) {
            throw error;
        }
    }
    async AttStatusClientebyWpp(req, res) {
        try {
            const { wppNumber, status } = req.body;
            const cliente = await ClienteRepository_1.default.getClienteByWppNumber(wppNumber);
            if (!cliente) {
                return res.status(404).json({ message: 'Cliente não encontrado' });
            }
            const updatedData = await ClienteRepository_1.default.attStatusById(cliente.id, status);
            return res.status(200).json(updatedData);
        }
        catch (error) {
            throw error;
        }
    }
    async uploadDoc(req, res) {
        try {
            const { clienteId, documentType, processoId, documentoId } = req.body;
            const file = req.file;
            // Logs de debug
            console.log('========== UPLOAD DOC DEBUG ==========');
            console.log('req.body:', req.body);
            console.log('clienteId:', clienteId);
            console.log('processoId:', processoId);
            console.log('documentoId:', documentoId);
            console.log('memberId:', req.body.memberId);
            console.log('documentType:', documentType);
            console.log('file:', file ? {
                originalname: file.originalname,
                mimetype: file.mimetype,
                size: file.size
            } : 'undefined');
            console.log('=======================================');
            if (!file) {
                return res.status(400).json({ message: 'Nenhum arquivo enviado' });
            }
            if (!clienteId && !documentoId) {
                return res.status(400).json({ message: 'clienteId ou documentoId é obrigatório' });
            }
            if (!documentType && !documentoId) {
                return res.status(400).json({ message: 'documentType é obrigatório para novos documentos' });
            }
            // Gerar nome único para o arquivo
            const timestamp = Date.now();
            const memberId = req.body.memberId;
            const fileExtension = file.originalname.split('.').pop();
            const fileName = `${documentType || 'doc'}_${timestamp}.${fileExtension}`;
            // Construir o caminho do arquivo
            let filePath = '';
            if (processoId) {
                filePath += `${processoId}/`;
            }
            else {
                filePath += `sem_processo/`;
            }
            const targetId = memberId || clienteId || 'desconhecido';
            filePath += `${targetId}`;
            filePath += `/${documentType || 'upgrade'}/${fileName}`;
            console.log('FilePath gerado:', filePath);
            // Upload para o Supabase Storage via Repository
            const uploadResult = await ClienteRepository_1.default.uploadDocument({
                filePath,
                fileBuffer: file.buffer,
                contentType: file.mimetype
            });
            console.log('Upload result:', uploadResult);
            let documentoRecord;
            if (documentoId) {
                // Lógica de upgrade: Se já existe um documento, vamos determinar o novo status
                // Se o status era WAITING_APOSTILLE, muda para ANALYZING_APOSTILLE
                // Se era WAITING_TRANSLATION, muda para ANALYZING_TRANSLATION
                // Caso contrário, assume ANALYZING
                // Para simplificar, poderíamos buscar o documento antes, mas vamos usar uma lógica baseada em flags ou status esperado
                // Por enquanto, vamos inferir do status atual no banco ou via parâmetro extra.
                // Como o Repository.updateDocumentoStatus já lida com status, vamos apenas atualizar o arquivo aqui.
                // Buscar status atual para decidir o próximo
                const docs = await ClienteRepository_1.default.getDocumentosByClienteId(clienteId);
                const docAtual = docs.find(d => d.id === documentoId);
                let novoStatus = 'ANALYZING';
                if (docAtual?.status === 'WAITING_APOSTILLE') {
                    novoStatus = 'ANALYZING_APOSTILLE';
                }
                else if (docAtual?.status === 'WAITING_TRANSLATION') {
                    novoStatus = 'ANALYZING_TRANSLATION';
                }
                documentoRecord = await ClienteRepository_1.default.updateDocumentoFile(documentoId, {
                    nomeOriginal: file.originalname,
                    nomeArquivo: fileName,
                    storagePath: filePath,
                    publicUrl: uploadResult.publicUrl,
                    contentType: file.mimetype,
                    tamanho: file.size,
                    status: novoStatus
                });
            }
            else {
                // Criar novo registro
                documentoRecord = await ClienteRepository_1.default.createDocumento({
                    clienteId,
                    processoId: processoId || undefined,
                    tipo: documentType,
                    nomeOriginal: file.originalname,
                    nomeArquivo: fileName,
                    storagePath: filePath,
                    publicUrl: uploadResult.publicUrl,
                    contentType: file.mimetype,
                    tamanho: file.size,
                    status: 'ANALYZING',
                    dependenteId: (memberId && memberId !== clienteId) ? memberId : undefined
                });
            }
            console.log('Documento processado no banco:', documentoRecord.id);
            return res.status(200).json({
                message: documentoId ? 'Documento atualizado com sucesso' : 'Documento enviado com sucesso',
                data: {
                    id: documentoRecord.id,
                    ...uploadResult,
                    fileName: file.originalname,
                    documentType: documentoRecord.tipo,
                    clienteId: documentoRecord.cliente_id,
                    processoId: documentoRecord.processo_id,
                    status: documentoRecord.status
                }
            });
        }
        catch (error) {
            console.error('Erro inesperado no upload:', error);
            return res.status(500).json({
                message: 'Erro ao fazer upload do documento',
                error: error.message
            });
        }
    }
    // GET /cliente/:clienteId/documentos
    async getDocumentos(req, res) {
        try {
            const { clienteId } = req.params;
            if (!clienteId) {
                return res.status(400).json({ message: 'clienteId é obrigatório' });
            }
            const documentos = await ClienteRepository_1.default.getDocumentosByClienteId(clienteId);
            return res.status(200).json({
                message: 'Documentos recuperados com sucesso',
                data: documentos
            });
        }
        catch (error) {
            console.error('Erro ao buscar documentos:', error);
            return res.status(500).json({
                message: 'Erro ao buscar documentos',
                error: error.message
            });
        }
    }
    // GET /cliente/processo/:processoId/documentos
    async getDocumentosByProcesso(req, res) {
        try {
            const { processoId } = req.params;
            if (!processoId) {
                return res.status(400).json({ message: 'processoId é obrigatório' });
            }
            const documentos = await ClienteRepository_1.default.getDocumentosByProcessoId(processoId);
            return res.status(200).json({
                message: 'Documentos do processo recuperados com sucesso',
                data: documentos,
                total: documentos.length
            });
        }
        catch (error) {
            console.error('Erro ao buscar documentos do processo:', error);
            return res.status(500).json({
                message: 'Erro ao buscar documentos do processo',
                error: error.message
            });
        }
    }
    // DELETE /cliente/documento/:documentoId
    async deleteDocumento(req, res) {
        try {
            const { documentoId } = req.params;
            if (!documentoId) {
                return res.status(400).json({ message: 'documentoId é obrigatório' });
            }
            await ClienteRepository_1.default.deleteDocumento(documentoId);
            return res.status(200).json({
                message: 'Documento deletado com sucesso'
            });
        }
        catch (error) {
            console.error('Erro ao deletar documento:', error);
            return res.status(500).json({
                message: 'Erro ao deletar documento',
                error: error.message
            });
        }
    }
    // PATCH /cliente/documento/:documentoId/status
    async updateDocumentoStatus(req, res) {
        try {
            const { documentoId } = req.params;
            const { status, motivoRejeicao, analisadoPor } = req.body;
            if (!documentoId) {
                return res.status(400).json({ message: 'documentoId é obrigatório' });
            }
            const validStatuses = [
                'PENDING', 'ANALYZING', 'WAITING_APOSTILLE', 'ANALYZING_APOSTILLE',
                'WAITING_TRANSLATION', 'ANALYZING_TRANSLATION', 'WAITING_TRANSLATION_QUOTE',
                'WAITING_ADM_APPROVAL', 'WAITING_QUOTE_APPROVAL', 'APPROVED', 'REJECTED',
                'solicitado', 'em_analise', 'disponivel'
            ];
            if (!status || !validStatuses.includes(status)) {
                return res.status(400).json({ message: 'Status inválido' });
            }
            // Lógica de side-effects (atualizar flags booleanas baseado na etapa)
            let apostilado = undefined;
            let traduzido = undefined;
            // Se passou da análise inicial e foi para apostilamento, nada muda (já é false por padrão)
            // Se passou da análise do apostilamento e foi para tradução
            if (['WAITING_TRANSLATION', 'ANALYZING_TRANSLATION'].includes(status)) {
                apostilado = true;
            }
            // Se foi aprovado totalmente
            else if (status === 'APPROVED') {
                apostilado = true;
                traduzido = true;
            }
            const documento = await ClienteRepository_1.default.updateDocumentoStatus(documentoId, status, motivoRejeicao, analisadoPor, apostilado, traduzido);
            return res.status(200).json({
                message: 'Status do documento atualizado com sucesso',
                data: documento
            });
        }
        catch (error) {
            console.error('Erro ao atualizar status do documento:', error);
            return res.status(500).json({
                message: `Erro ao atualizar status do documento: ${error.message} (ID: ${req.params.documentoId}, Status: ${req.body.status})`,
                error: error.message,
                documentoId: req.params.documentoId,
                status: req.body.status
            });
        }
    }
    // GET /cliente/processo/:processoId/formularios
    // Retorna todos os formulários/declarações para um processo
    async getFormularios(req, res) {
        try {
            const { processoId } = req.params;
            const { memberId } = req.params; // Optional
            if (!processoId) {
                return res.status(400).json({ message: 'processoId é obrigatório' });
            }
            const formularios = await ClienteRepository_1.default.getFormulariosByProcessoId(processoId, memberId);
            return res.status(200).json({
                message: 'Formulários recuperados com sucesso',
                data: formularios
            });
        }
        catch (error) {
            console.error('Erro ao buscar formulários:', error);
            return res.status(500).json({
                message: 'Erro ao buscar formulários',
                error: error.message
            });
        }
    }
    // POST /cliente/processo/:processoId/formularios
    // Upload de formulário pelo jurídico
    async uploadFormulario(req, res) {
        try {
            const { processoId } = req.params;
            const { clienteId, memberId } = req.body;
            const file = req.file;
            console.log('========== UPLOAD FORMULARIO DEBUG ==========');
            console.log('processoId:', processoId);
            console.log('clienteId:', clienteId);
            console.log('memberId:', memberId);
            console.log('file:', file ? { originalname: file.originalname, size: file.size } : 'undefined');
            console.log('=============================================');
            if (!file) {
                return res.status(400).json({ message: 'Nenhum arquivo enviado' });
            }
            if (!processoId || !clienteId || !memberId) {
                return res.status(400).json({ message: 'processoId, clienteId e memberId são obrigatórios' });
            }
            // Gerar nome único
            const timestamp = Date.now();
            const fileExtension = file.originalname.split('.').pop();
            const fileName = `formulario_${timestamp}.${fileExtension}`;
            // Construir caminho: processoId/formularios/memberId/filename
            const filePath = `${processoId}/formularios/${memberId}/${fileName}`;
            // Upload para o Supabase
            const uploadResult = await ClienteRepository_1.default.uploadDocument({
                filePath,
                fileBuffer: file.buffer,
                contentType: file.mimetype,
                bucket: 'formularios-juridico'
            });
            // Criar registro na tabela de formulários
            const formularioRecord = await ClienteRepository_1.default.createFormulario({
                processoId,
                clienteId,
                memberId,
                nomeOriginal: file.originalname,
                nomeArquivo: fileName,
                storagePath: filePath,
                publicUrl: uploadResult.publicUrl,
                contentType: file.mimetype,
                tamanho: file.size
            });
            return res.status(200).json({
                message: 'Formulário enviado com sucesso',
                data: {
                    id: formularioRecord.id,
                    name: file.originalname.replace(/\.[^/.]+$/, ''),
                    fileName: file.originalname,
                    fileSize: file.size,
                    uploadDate: new Date(),
                    memberId,
                    downloadUrl: uploadResult.publicUrl
                }
            });
        }
        catch (error) {
            console.error('Erro ao upload de formulário:', error);
            return res.status(500).json({
                message: 'Erro ao enviar formulário',
                error: error.message
            });
        }
    }
    // DELETE /cliente/processo/:processoId/formularios/:formularioId
    async deleteFormulario(req, res) {
        try {
            const { formularioId } = req.params;
            if (!formularioId) {
                return res.status(400).json({ message: 'formularioId é obrigatório' });
            }
            await ClienteRepository_1.default.deleteFormulario(formularioId);
            return res.status(200).json({
                message: 'Formulário deletado com sucesso'
            });
        }
        catch (error) {
            console.error('Erro ao deletar formulário:', error);
            return res.status(500).json({
                message: 'Erro ao deletar formulário',
                error: error.message
            });
        }
    }
    // POST /cliente/formularios/:formularioId/response
    async uploadFormularioResponse(req, res) {
        try {
            const { formularioId } = req.params;
            const file = req.file;
            console.log('====== UPLOAD FORMULARIO RESPONSE ======');
            console.log('formularioId:', formularioId);
            console.log('file:', file ? { originalname: file.originalname, size: file.size } : 'undefined');
            console.log('========================================');
            if (!file) {
                return res.status(400).json({ message: 'Nenhum arquivo enviado' });
            }
            if (!formularioId) {
                return res.status(400).json({ message: 'formularioId é obrigatório' });
            }
            // Get the original juridico form to extract cliente_id and membro_id
            const { data: originalForm, error: fetchError } = await (await Promise.resolve().then(() => __importStar(require('../config/SupabaseClient')))).supabase
                .from('formularios_juridico')
                .select('cliente_id, membro_id')
                .eq('id', formularioId)
                .single();
            if (fetchError || !originalForm) {
                console.error('Erro ao buscar formulário original:', fetchError);
                return res.status(404).json({ message: 'Formulário original não encontrado' });
            }
            const { cliente_id: clienteId, membro_id: membroId } = originalForm;
            // Generate unique filename
            const timestamp = Date.now();
            const fileExtension = file.originalname.split('.').pop();
            const fileName = `signed_${timestamp}.${fileExtension}`;
            // Build storage path: clienteId/cliente/memberId_or_titular/filename
            const targetMember = membroId || 'titular';
            const filePath = `${clienteId}/cliente/${targetMember}/${fileName}`;
            console.log('========== CLIENT RESPONSE PATH ==========');
            console.log('Bucket: formularios-juridico');
            console.log('Target Member (Folder):', targetMember);
            console.log('Generated FileName:', fileName);
            console.log('FULL PATH (filePath):', filePath);
            console.log('=========================================');
            // Upload to formularios-juridico bucket (cliente folder)
            const uploadResult = await ClienteRepository_1.default.uploadFormularioClienteResponse({
                filePath,
                fileBuffer: file.buffer,
                contentType: file.mimetype
            });
            // Create database record
            const formularioRecord = await ClienteRepository_1.default.createFormularioClienteResponse({
                formularioJuridicoId: formularioId,
                clienteId,
                membroId,
                nomeOriginal: file.originalname,
                nomeArquivo: fileName,
                storagePath: uploadResult.path,
                publicUrl: uploadResult.publicUrl,
                contentType: file.mimetype,
                tamanho: file.size
            });
            console.log('Resposta de formulário criada com sucesso:', formularioRecord.id);
            return res.status(201).json({
                message: 'Resposta de formulário enviada com sucesso',
                data: {
                    id: formularioRecord.id,
                    formulario_juridico_id: formularioId,
                    publicUrl: uploadResult.publicUrl
                }
            });
        }
        catch (error) {
            console.error('Erro ao enviar resposta de formulário:', error);
            return res.status(500).json({
                message: 'Erro ao enviar resposta de formulário',
                error: error.message
            });
        }
    }
    // GET /cliente/:clienteId/formulario-responses
    async getFormularioResponses(req, res) {
        try {
            const { clienteId } = req.params;
            if (!clienteId) {
                return res.status(400).json({ message: 'clienteId é obrigatório' });
            }
            const responses = await ClienteRepository_1.default.getFormularioClienteResponsesByCliente(clienteId);
            return res.status(200).json({
                message: 'Respostas de formulários recuperadas com sucesso',
                data: responses
            });
        }
        catch (error) {
            console.error('Erro ao buscar respostas de formulários:', error);
            return res.status(500).json({
                message: 'Erro ao buscar respostas de formulários',
                error: error.message
            });
        }
    }
    // POST /cliente/profile-photo
    async uploadProfilePhoto(req, res) {
        try {
            const { clienteId } = req.body;
            const file = req.file;
            if (!file) {
                return res.status(400).json({ message: 'Nenhum arquivo enviado' });
            }
            if (!clienteId) {
                return res.status(400).json({ message: 'clienteId é obrigatório' });
            }
            const result = await ClienteRepository_1.default.upsertProfilePhoto({
                clienteId,
                fileBuffer: file.buffer,
                contentType: file.mimetype,
                fileName: file.originalname
            });
            return res.status(200).json({
                message: 'Foto de perfil atualizada com sucesso',
                data: result
            });
        }
        catch (error) {
            console.error('Erro ao atualizar foto de perfil:', error);
            return res.status(500).json({
                message: 'Erro ao atualizar foto de perfil',
                error: error.message
            });
        }
    }
    // GET /cliente/clientes
    async getAllClientes(req, res) {
        try {
            const clientes = await ClienteRepository_1.default.getAllClientes();
            return res.status(200).json({
                message: 'Clientes recuperados com sucesso',
                data: clientes,
                total: clientes.length
            });
        }
        catch (error) {
            console.error('Erro ao buscar todos os clientes:', error);
            return res.status(500).json({
                message: 'Erro ao buscar todos os clientes',
                error: error.message
            });
        }
    }
    // GET /cliente/:clienteId/notificacoes
    async getNotificacoes(req, res) {
        try {
            const { clienteId } = req.params;
            if (!clienteId) {
                return res.status(400).json({ message: 'clienteId é obrigatório' });
            }
            const notificacoes = await ClienteRepository_1.default.getNotificacoes(clienteId);
            return res.status(200).json({
                message: 'Notificações recuperadas com sucesso',
                data: notificacoes
            });
        }
        catch (error) {
            console.error('Erro ao buscar notificações:', error);
            return res.status(500).json({
                message: 'Erro ao buscar notificações',
                error: error.message
            });
        }
    }
    // GET /cliente/:clienteId/requerimentos
    async getRequerimentosByCliente(req, res) {
        try {
            const { clienteId } = req.params;
            if (!clienteId) {
                return res.status(400).json({ message: 'clienteId é obrigatório' });
            }
            const requerimentos = await JuridicoRepository_1.default.getRequerimentosByClienteId(clienteId);
            return res.status(200).json({
                message: 'Requerimentos recuperados com sucesso',
                data: requerimentos
            });
        }
        catch (error) {
            console.error('Erro ao buscar requerimentos:', error);
            return res.status(500).json({
                message: 'Erro ao buscar requerimentos',
                error: error.message
            });
        }
    }
}
exports.default = new ClienteController();
