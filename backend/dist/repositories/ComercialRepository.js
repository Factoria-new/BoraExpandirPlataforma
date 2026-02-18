"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SupabaseClient_1 = require("../config/SupabaseClient");
class ComercialRepository {
    async createAgendamento(agendamento) {
        console.log('Tentando criar agendamento no banco:', agendamento);
        const { data: createdData, error } = await SupabaseClient_1.supabase
            .from('agendamentos')
            .insert([agendamento])
            .select()
            .single();
        if (error) {
            console.error('Erro do Supabase ao criar agendamento:', error);
            throw error;
        }
        console.log('Agendamento criado com sucesso:', createdData);
        return createdData;
    }
    async getAgendamentosByIntervalo(data_hora_inicio, data_hora_fim) {
        console.log('Buscando agendamentos no intervalo:', data_hora_inicio, 'até', data_hora_fim);
        const { data: agendamentos, error } = await SupabaseClient_1.supabase
            .from('agendamentos')
            .select('*')
            .neq('status', 'cancelado')
            .gte('data_hora', data_hora_inicio)
            .lt('data_hora', data_hora_fim);
        if (error) {
            console.error('Erro ao buscar agendamentos:', error);
            throw error;
        }
        return agendamentos || [];
    }
    async getAgendamentosByData(data) {
        console.log('Buscando agendamentos para data:', data);
        const { data: agendamentos, error } = await SupabaseClient_1.supabase
            .from('agendamentos')
            .select('*')
            .neq('status', 'cancelado')
            .gte('data_hora', `${data}T00:00:00`)
            .lt('data_hora', `${data}T23:59:59`)
            .order('data_hora', { ascending: true });
        if (error) {
            console.error('Erro ao buscar agendamentos:', error);
            throw error;
        }
        return agendamentos || [];
    }
}
exports.default = new ComercialRepository();
