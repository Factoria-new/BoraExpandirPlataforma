import { Request, Response } from 'express'
import TraducoesRepository from '../repositories/TraducoesRepository'

class TraducoesController {
  async getOrcamentosPendentes(req: Request, res: Response) {
    try {
      const orcamentos = await TraducoesRepository.getOrcamentosPendentes()
      console.log(orcamentos)
      return res.status(200).json(orcamentos)
    } catch (error) {
      console.error('[TraducoesController.getOrcamentosPendentes] Error:', error)
      return res.status(500).json({ error: 'Erro ao buscar orçamentos pendentes' })
    }
  }

  async responderOrcamento(req: Request, res: Response) {
    try {
      const { documentoId, valorOrcamento, prazoEntrega, observacoes } = req.body

      if (!documentoId || !valorOrcamento || !prazoEntrega) {
        return res.status(400).json({ error: 'Campos obrigatórios ausentes' })
      }

      const orcamento = await TraducoesRepository.saveOrcamento({
        documentoId,
        valorOrcamento,
        prazoEntrega,
        observacoes
      })

      return res.status(201).json(orcamento)
    } catch (error) {
      console.error('[TraducoesController.responderOrcamento] Error:', error)
      return res.status(500).json({ error: 'Erro ao salvar resposta do orçamento' })
    }
  }

  async getOrcamentoByDocumento(req: Request, res: Response) {
    try {
      const { documentoId } = req.params
      const orcamento = await TraducoesRepository.getOrcamentoByDocumento(documentoId)
      
      if (!orcamento) {
        return res.status(404).json({ error: 'Orçamento não encontrado' })
      }

      return res.status(200).json(orcamento)
    } catch (error) {
      console.error('[TraducoesController.getOrcamentoByDocumento] Error:', error)
      return res.status(500).json({ error: 'Erro ao buscar orçamento' })
    }
  }
}

export default new TraducoesController()
