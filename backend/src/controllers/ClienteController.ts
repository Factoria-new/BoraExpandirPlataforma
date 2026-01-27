import type { ClienteDTO } from '../types/parceiro';
import ClienteRepository from '../repositories/ClienteRepository';
import { getDocumentosPorTipoServico, DocumentoRequeridoConfig } from '../config/documentosConfig';

// Interface para o documento requerido com informações do processo
interface DocumentoRequeridoComProcesso extends DocumentoRequeridoConfig {
  processoId: string;
  processoTipo: string;
  processoStatus: string;
  processoEtapa: number;
}

class ClienteController {
  // GET /cliente/:clienteId/documentos-requeridos
  // Retorna os documentos necessários baseado nos processos do cliente
  async getDocumentosRequeridos(req: any, res: any) {
    try {
      const { clienteId } = req.params

      if (!clienteId) {
        return res.status(400).json({ message: 'clienteId é obrigatório' })
      }

      // Buscar os processos do cliente
      const processos = await ClienteRepository.getProcessosByClienteId(clienteId)

      if (!processos || processos.length === 0) {
        return res.status(200).json({
          message: 'Cliente não possui processos ativos',
          data: [],
          processos: []
        })
      }

      // Para cada processo, buscar os documentos requeridos baseado no tipo_servico
      const documentosRequeridos: DocumentoRequeridoComProcesso[] = []

      for (const processo of processos) {
        const docsDoServico = getDocumentosPorTipoServico(processo.tipo_servico)

        // Adicionar cada documento com as informações do processo
        for (const doc of docsDoServico) {
          documentosRequeridos.push({
            ...doc,
            processoId: processo.id,
            processoTipo: processo.tipo_servico,
            processoStatus: processo.status,
            processoEtapa: processo.etapa_atual
          })
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
      })
    } catch (error: any) {
      console.error('Erro ao buscar documentos requeridos:', error)
      return res.status(500).json({
        message: 'Erro ao buscar documentos requeridos',
        error: error.message
      })
    }
  }

  // GET /cliente/by-parceiro/:parceiroId
  async getByParceiro(req: any, res: any) {
    try {
      const { parceiroId } = req.params
      if (!parceiroId) {
        return res.status(400).json({ message: 'Parâmetro parceiroId é obrigatório' })
      }
      const data = await ClienteRepository.getClientByParceiroId(parceiroId)

      return res.status(200).json(data ?? [])
    } catch (err: any) {
      console.error('Erro inesperado ao consultar clientes:', err)
      return res.status(500).json({ message: 'Erro inesperado ao consultar clientes', error: err.message })
    }
  }

  async register(req: any, res: any) {
    try {

      const { nome, email, whatsapp, parceiro_id, status } = req.body
      const Cliente = { nome, email, whatsapp, parceiro_id, status } as ClienteDTO
      const createdData = await ClienteRepository.register(Cliente)
      return res.status(201).json(createdData)
    } catch (error) {
      throw error
    }
  }
  async AttStatusClientebyWpp(req: any, res: any) {
    try {
      const { wppNumber, status } = req.body
      const cliente = await ClienteRepository.getClienteByWppNumber(wppNumber)


      if (!cliente) {
        return res.status(404).json({ message: 'Cliente não encontrado' })
      }

      const updatedData = await ClienteRepository.attStatusById(cliente.id, status)


      return res.status(200).json(updatedData)
    } catch (error) {
      throw error
    }
  }

  async uploadDoc(req: any, res: any) {
    try {
      const { clienteId, documentType, processoId } = req.body
      const file = req.file

      // Logs de debug
      console.log('========== UPLOAD DOC DEBUG ==========')
      console.log('req.body:', req.body)
      console.log('clienteId:', clienteId)
      console.log('processoId:', processoId)
      console.log('memberId:', req.body.memberId)
      console.log('memberName:', req.body.memberName)
      console.log('documentType:', documentType)
      console.log('file:', file ? {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size
      } : 'undefined')
      console.log('=======================================')

      if (!file) {
        return res.status(400).json({ message: 'Nenhum arquivo enviado' })
      }

      if (!clienteId) {
        return res.status(400).json({ message: 'clienteId é obrigatório' })
      }

      if (!documentType) {
        return res.status(400).json({ message: 'documentType é obrigatório' })
      }

      // Gerar nome único para o arquivo
      const timestamp = Date.now()
      const memberId = req.body.memberId
      const memberName = req.body.memberName
      const fileExtension = file.originalname.split('.').pop()
      const fileName = `${documentType}_${timestamp}.${fileExtension}`

      // Construir o caminho do arquivo com memberId se disponível
      let filePath = `${clienteId}`

      if (processoId) {
        filePath += `/${processoId}`
      }

      if (memberName) {
        // Sanitize memberName to prevent "Invalid key" errors in Supabase Storage
        // Remove accents, special characters and replace spaces
        const safeMemberName = memberName
          .normalize('NFD') // Decompose combined graphemes (e.g. 'é' -> 'e' + '´')
          .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks
          .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special chars
          .trim()
          .replace(/\s+/g, '_'); // Replace spaces with underscore

        filePath += `/${safeMemberName}`
      } else if (memberId) {
        filePath += `/${memberId}`
      }

      filePath += `/${documentType}/${fileName}`

      console.log('FilePath gerado:', filePath)

      // Upload para o Supabase Storage via Repository
      const uploadResult = await ClienteRepository.uploadDocument({
        filePath,
        fileBuffer: file.buffer,
        contentType: file.mimetype
      })

      // Criar registro do documento no banco de dados (com processoId se fornecido)
      const documentoRecord = await ClienteRepository.createDocumento({
        clienteId,
        processoId: processoId || undefined,  // Associa ao processo se fornecido
        tipo: documentType,
        nomeOriginal: file.originalname,
        nomeArquivo: fileName,
        storagePath: filePath,
        publicUrl: uploadResult.publicUrl,
        contentType: file.mimetype,
        tamanho: file.size,
        status: 'ANALYZING'
      })

      console.log('Documento registrado no banco:', documentoRecord.id)

      return res.status(200).json({
        message: 'Documento enviado com sucesso',
        data: {
          id: documentoRecord.id,
          ...uploadResult,
          fileName: file.originalname,
          documentType,
          clienteId,
          processoId: processoId || null,
          status: documentoRecord.status
        }
      })
    } catch (error: any) {
      console.error('Erro inesperado no upload:', error)
      return res.status(500).json({
        message: 'Erro ao fazer upload do documento',
        error: error.message
      })
    }
  }

  // GET /cliente/:clienteId/documentos
  async getDocumentos(req: any, res: any) {
    try {
      const { clienteId } = req.params

      if (!clienteId) {
        return res.status(400).json({ message: 'clienteId é obrigatório' })
      }

      const documentos = await ClienteRepository.getDocumentosByClienteId(clienteId)

      return res.status(200).json({
        message: 'Documentos recuperados com sucesso',
        data: documentos
      })
    } catch (error: any) {
      console.error('Erro ao buscar documentos:', error)
      return res.status(500).json({
        message: 'Erro ao buscar documentos',
        error: error.message
      })
    }
  }

  // GET /cliente/processo/:processoId/documentos
  async getDocumentosByProcesso(req: any, res: any) {
    try {
      const { processoId } = req.params

      if (!processoId) {
        return res.status(400).json({ message: 'processoId é obrigatório' })
      }

      const documentos = await ClienteRepository.getDocumentosByProcessoId(processoId)

      return res.status(200).json({
        message: 'Documentos do processo recuperados com sucesso',
        data: documentos,
        total: documentos.length
      })
    } catch (error: any) {
      console.error('Erro ao buscar documentos do processo:', error)
      return res.status(500).json({
        message: 'Erro ao buscar documentos do processo',
        error: error.message
      })
    }
  }

  // DELETE /cliente/documento/:documentoId
  async deleteDocumento(req: any, res: any) {
    try {
      const { documentoId } = req.params

      if (!documentoId) {
        return res.status(400).json({ message: 'documentoId é obrigatório' })
      }

      await ClienteRepository.deleteDocumento(documentoId)

      return res.status(200).json({
        message: 'Documento deletado com sucesso'
      })
    } catch (error: any) {
      console.error('Erro ao deletar documento:', error)
      return res.status(500).json({
        message: 'Erro ao deletar documento',
        error: error.message
      })
    }
  }

  // PATCH /cliente/documento/:documentoId/status
  async updateDocumentoStatus(req: any, res: any) {
    try {
      const { documentoId } = req.params
      const { status, motivoRejeicao, analisadoPor } = req.body

      if (!documentoId) {
        return res.status(400).json({ message: 'documentoId é obrigatório' })
      }

      if (!status || !['PENDING', 'ANALYZING', 'APPROVED', 'REJECTED'].includes(status)) {
        return res.status(400).json({ message: 'status é obrigatório e deve ser PENDING, ANALYZING, APPROVED ou REJECTED' })
      }

      const documento = await ClienteRepository.updateDocumentoStatus(documentoId, status, motivoRejeicao, analisadoPor)

      return res.status(200).json({
        message: 'Status do documento atualizado com sucesso',
        data: documento
      })
    } catch (error: any) {
      console.error('Erro ao atualizar status do documento:', error)
      return res.status(500).json({
        message: 'Erro ao atualizar status do documento',
        error: error.message
      })
    }
  }
}

export default new ClienteController()