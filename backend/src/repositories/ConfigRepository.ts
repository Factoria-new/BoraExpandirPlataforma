import { supabase } from '../config/SupabaseClient'

class ConfigRepository {
  async get(chave: string) {
    const { data, error } = await supabase
      .from('configuracoes')
      .select('valor')
      .eq('chave', chave)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // No rows found
      console.error(`Erro ao buscar config ${chave}:`, error)
      return null
    }

    return data.valor
  }

  async set(chave: string, valor: any) {
    const { data, error } = await supabase
      .from('configuracoes')
      .upsert({ chave, valor: String(valor), atualizado_em: new Date() })
      .select()
      .single()

    if (error) {
      console.error(`Erro ao salvar config ${chave}:`, error)
      throw error
    }

    return data
  }
}

export default new ConfigRepository()
