import { supabase } from '../config/SupabaseClient'
import type { ClienteDTO } from '../types/parceiro';
import ComercialRepository from '../repositories/ComercialRepository';


class ComercialController {
    async createAgendamento(req: any, res: any) {
        try {
            const { nome, email, telefone, data_hora, produto_id, duracao_minutos, status } = req.body
            
            // Validação básica
            if (!nome || !email || !telefone || !data_hora || !produto_id) {
                return res.status(400).json({ 
                    message: 'Campos obrigatórios: nome, email, telefone, data_hora, produto_id' 
                })
            }

            // Normaliza data_hora para UTC (evita falsos negativos na checagem)
            const dataHoraIso = data_hora?.endsWith('Z') ? data_hora : `${data_hora}Z`

            // Verifica disponibilidade do horário
            const duracao = duracao_minutos || 60
            const disponibilidade = await this.verificarDisponibilidade(dataHoraIso, duracao)
            console.log('Disponibilidade verificada:', disponibilidade)

            if (!disponibilidade.disponivel) {
                return res.status(409).json({ 
                    message: 'Horário indisponível',
                    conflitos: disponibilidade.agendamentos 
                })
            }

            const agendamento = { 
                nome, 
                email, 
                telefone, 
                data_hora: dataHoraIso, 
                produto_id, 
                duracao_minutos: duracao,
                status: status || 'agendado'
            }
            
            console.log('Criando agendamento:', agendamento)     
            const createdData = await ComercialRepository.createAgendamento(agendamento)  
            return res.status(201).json(createdData)   
            
        } catch (error: any) {
            console.error('Erro ao criar agendamento:', error)
            return res.status(500).json({ 
                message: 'Erro ao criar agendamento', 
                error: error.message 
            })
        }
    }

    async verificarDisponibilidade(data_hora: string, duracao_minutos: number) {
        console.log('Verificando disponibilidade para:', data_hora, duracao_minutos)
        
        // Garante parsing em UTC
        const inicioUTC = data_hora.endsWith('Z') ? data_hora : `${data_hora}Z`
        const inicio = new Date(inicioUTC)
        const fim = new Date(inicio.getTime() + duracao_minutos * 60000)
        
        const inicioIso = inicio.toISOString()
        const fimIso = fim.toISOString()
        
        // Busca agendamentos conflitantes no repository (intervalo fechado no início, aberto no fim)
        const agendamentos = await ComercialRepository.getAgendamentosByIntervalo(
            inicioIso,
            fimIso
        )
        
        // Se encontrou algum agendamento, o horário está ocupado
        const disponivel = agendamentos.length === 0
        
        console.log('Disponibilidade:', disponivel, 'Conflitos:', agendamentos.length)
        
        return {
            disponivel,
            agendamentos
        }
    }

    async checkDisponibilidade(req: any, res: any) {
        try {
            const { data_hora, duracao_minutos } = req.query
            
            if (!data_hora) {
                return res.status(400).json({ message: 'data_hora é obrigatório' })
            }

            const dataHoraIso = (data_hora as string)?.endsWith('Z')
                ? (data_hora as string)
                : `${data_hora as string}Z`

            const resultado = await this.verificarDisponibilidade(
                dataHoraIso,
                parseInt(duracao_minutos as string) || 60
            )

            return res.status(200).json(resultado)
            
        } catch (error: any) {
            console.error('Erro ao verificar disponibilidade:', error)
            return res.status(500).json({ 
                message: 'Erro ao verificar disponibilidade', 
                error: error.message 
            })
        }
    }

    async getAgendamentosByData(req: any, res: any) {
        try {
            const { data } = req.params
            
            if (!data) {
                return res.status(400).json({ message: 'data é obrigatório' })
            }

            const agendamentos = await ComercialRepository.getAgendamentosByData(data)

            return res.status(200).json(agendamentos)
            
        } catch (error: any) {
            console.error('Erro ao buscar agendamentos:', error)
            return res.status(500).json({ 
                message: 'Erro ao buscar agendamentos', 
                error: error.message 
            })
        }
    }

}

export default new ComercialController()