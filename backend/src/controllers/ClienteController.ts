import { supabase } from '../config/SupabaseClient'

class ClienteController {
  // GET /cliente/by-parceiro/:parceiroId
  async getByParceiro(req: any, res: any) {
    try {
      const { parceiroId } = req.params
      if (!parceiroId) {
        return res.status(400).json({ message: 'Parâmetro parceiroId é obrigatório' })
      }

      // Ajuste o nome da coluna conforme seu schema (ex.: parceiro_id)
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('parceiro_id', parceiroId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao consultar clientes por parceiro:', error)
        return res.status(500).json({ message: 'Erro ao consultar clientes', error: error.message })
      }

      // Retorna diretamente os registros; se quiser, mapeie para camelCase aqui
      return res.status(200).json(data ?? [])
    } catch (err: any) {
      console.error('Erro inesperado ao consultar clientes:', err)
      return res.status(500).json({ message: 'Erro inesperado ao consultar clientes', error: err.message })
    }
  }

  async register(req: any, res: any) {
    try {
      const { nome, email, whatsapp, parceiro_id } = req.body
      const { data: createdData, error } = await supabase
        .from('clientes')
        .insert([{ nome, email, whatsapp, parceiro_id }])
        .select()
        .single()    
    return res.status(201).json(createdData)   
    } catch (error) {
      throw error
    }
  }
}

export default new ClienteController()