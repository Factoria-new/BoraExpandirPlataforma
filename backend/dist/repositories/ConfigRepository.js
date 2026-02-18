"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SupabaseClient_1 = require("../config/SupabaseClient");
class ConfigRepository {
    async get(chave) {
        const { data, error } = await SupabaseClient_1.supabase
            .from('configuracoes')
            .select('valor')
            .eq('chave', chave)
            .single();
        if (error) {
            if (error.code === 'PGRST116')
                return null; // No rows found
            console.error(`Erro ao buscar config ${chave}:`, error);
            return null;
        }
        return data.valor;
    }
    async set(chave, valor) {
        const { data, error } = await SupabaseClient_1.supabase
            .from('configuracoes')
            .upsert({ chave, valor: String(valor), atualizado_em: new Date() })
            .select()
            .single();
        if (error) {
            console.error(`Erro ao salvar config ${chave}:`, error);
            throw error;
        }
        return data;
    }
}
exports.default = new ConfigRepository();
