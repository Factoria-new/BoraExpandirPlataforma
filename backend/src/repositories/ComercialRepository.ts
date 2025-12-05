import { supabase } from '../config/SupabaseClient'

class ComercialRepository {

    async createAgendamento(agendamento: any) {   
        console.log('Tentando criar agendamento no banco:', agendamento)
        
        const { data: createdData, error } = await supabase
            .from('agendamentos')
            .insert([agendamento])
            .select()
            .single()
        
        if (error) {
            console.error('Erro do Supabase ao criar agendamento:', error)
            throw error
        }
        
        console.log('Agendamento criado com sucesso:', createdData)
        return createdData
    }

    async getAgendamentosByIntervalo(data_hora_inicio: string, data_hora_fim: string) {
        console.log('Buscando agendamentos no intervalo:', data_hora_inicio, 'até', data_hora_fim)
        
        const { data: agendamentos, error } = await supabase
            .from('agendamentos')
            .select('*')
            .neq('status', 'cancelado')
            .gte('data_hora', data_hora_inicio)
            .lt('data_hora', data_hora_fim)
        
        if (error) {
            console.error('Erro ao buscar agendamentos:', error)
            throw error
        }
        
        return agendamentos || []
    }

    async getAgendamentosByData(data: string) {
        console.log('Buscando agendamentos para data:', data)
        
        const { data: agendamentos, error } = await supabase
            .from('agendamentos')
            .select('*')
            .neq('status', 'cancelado')
            .gte('data_hora', `${data}T00:00:00`)
            .lt('data_hora', `${data}T23:59:59`)
            .order('data_hora', { ascending: true })
        
        if (error) {
            console.error('Erro ao buscar agendamentos:', error)
            throw error
        }
        
        return agendamentos || []
    }
}

export default new ComercialRepository()