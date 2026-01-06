import React, { useMemo, useState } from 'react'
import { DollarSign, Copy, CheckCircle, TrendingUp, FileCheck, User, Bot, Download, Eye, X, FileText } from 'lucide-react'
import type { TraducaoItem } from '../types'
import { Badge } from '../../../components/ui/Badge'
import { calcularComissao, getLabelOrigem, type OrigemVenda } from '../../../services/comissaoService'

interface PagamentosPageProps {
  traducoes: TraducaoItem[]
}

interface Pagamento {
  id: string
  traducaoId: string
  documentoNome: string
  clienteNome: string
  valorServico: number  // Valor total do serviço
  origem_venda: OrigemVenda  // 'propria' = 12%, 'bot' = 8%
  status: 'pendente' | 'processando' | 'pago'
  dataEntrega: string
  dataPagamento?: string  // Data em que foi pago
  comprovante?: string    // URL ou ID do comprovante (só para status 'pago')
}

const mockPagamentos: Pagamento[] = [
  // Mês atual - Pendentes e Processando
  {
    id: '1',
    traducaoId: '1',
    documentoNome: 'Certidão de Nascimento',
    clienteNome: 'João Silva',
    valorServico: 1500.00,
    origem_venda: 'propria',
    status: 'pendente',
    dataEntrega: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    traducaoId: '2',
    documentoNome: 'Contrato Comercial Internacional',
    clienteNome: 'Maria Santos',
    valorServico: 4500.00,
    origem_venda: 'bot',
    status: 'processando',
    dataEntrega: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    traducaoId: '3',
    documentoNome: 'Diploma Universitário',
    clienteNome: 'Carlos Oliveira',
    valorServico: 800.00,
    origem_venda: 'propria',
    status: 'pendente',
    dataEntrega: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  // Mês atual - Pagos
  {
    id: '4',
    traducaoId: '4',
    documentoNome: 'Manual Técnico - Volume 1',
    clienteNome: 'Ana Costa',
    valorServico: 6500.00,
    origem_venda: 'propria',
    status: 'pago',
    dataEntrega: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    dataPagamento: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    comprovante: 'COMP-2026-0004',
  },
  {
    id: '5',
    traducaoId: '5',
    documentoNome: 'Certidão de Casamento',
    clienteNome: 'Pedro Almeida',
    valorServico: 1200.00,
    origem_venda: 'bot',
    status: 'pago',
    dataEntrega: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    dataPagamento: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    comprovante: 'COMP-2026-0005',
  },
  {
    id: '6',
    traducaoId: '6',
    documentoNome: 'Histórico Escolar',
    clienteNome: 'Fernanda Lima',
    valorServico: 950.00,
    origem_venda: 'propria',
    status: 'pago',
    dataEntrega: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    dataPagamento: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    comprovante: 'COMP-2026-0006',
  },
  // Mês passado
  {
    id: '7',
    traducaoId: '7',
    documentoNome: 'Contrato de Trabalho',
    clienteNome: 'Roberto Souza',
    valorServico: 2800.00,
    origem_venda: 'bot',
    status: 'pago',
    dataEntrega: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    dataPagamento: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toISOString(),
    comprovante: 'COMP-2025-0007',
  },
  {
    id: '8',
    traducaoId: '8',
    documentoNome: 'Procuração',
    clienteNome: 'Juliana Martins',
    valorServico: 1800.00,
    origem_venda: 'propria',
    status: 'pago',
    dataEntrega: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    dataPagamento: new Date(Date.now() - 37 * 24 * 60 * 60 * 1000).toISOString(),
    comprovante: 'COMP-2025-0008',
  },
  {
    id: '9',
    traducaoId: '9',
    documentoNome: 'Parecer Jurídico',
    clienteNome: 'Marcos Pereira',
    valorServico: 5500.00,
    origem_venda: 'propria',
    status: 'pago',
    dataEntrega: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    dataPagamento: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString(),
    comprovante: 'COMP-2025-0009',
  },
  // 2-3 meses atrás
  {
    id: '10',
    traducaoId: '10',
    documentoNome: 'Estatuto Social',
    clienteNome: 'Luciana Rodrigues',
    valorServico: 3200.00,
    origem_venda: 'bot',
    status: 'pago',
    dataEntrega: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString(),
    dataPagamento: new Date(Date.now() - 62 * 24 * 60 * 60 * 1000).toISOString(),
    comprovante: 'COMP-2025-0010',
  },
  {
    id: '11',
    traducaoId: '11',
    documentoNome: 'Balanço Patrimonial',
    clienteNome: 'Ricardo Gomes',
    valorServico: 4800.00,
    origem_venda: 'propria',
    status: 'pago',
    dataEntrega: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(),
    dataPagamento: new Date(Date.now() - 72 * 24 * 60 * 60 * 1000).toISOString(),
    comprovante: 'COMP-2025-0011',
  },
  {
    id: '12',
    traducaoId: '12',
    documentoNome: 'Laudo Médico',
    clienteNome: 'Beatriz Fernandes',
    valorServico: 2200.00,
    origem_venda: 'bot',
    status: 'pago',
    dataEntrega: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000).toISOString(),
    dataPagamento: new Date(Date.now() - 82 * 24 * 60 * 60 * 1000).toISOString(),
    comprovante: 'COMP-2025-0012',
  },
  // 4-5 meses atrás
  {
    id: '13',
    traducaoId: '13',
    documentoNome: 'Contrato de Locação',
    clienteNome: 'Gustavo Alves',
    valorServico: 1600.00,
    origem_venda: 'propria',
    status: 'pago',
    dataEntrega: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    dataPagamento: new Date(Date.now() - 117 * 24 * 60 * 60 * 1000).toISOString(),
    comprovante: 'COMP-2025-0013',
  },
  {
    id: '14',
    traducaoId: '14',
    documentoNome: 'Carta de Recomendação',
    clienteNome: 'Patricia Mendes',
    valorServico: 650.00,
    origem_venda: 'bot',
    status: 'pago',
    dataEntrega: new Date(Date.now() - 135 * 24 * 60 * 60 * 1000).toISOString(),
    dataPagamento: new Date(Date.now() - 132 * 24 * 60 * 60 * 1000).toISOString(),
    comprovante: 'COMP-2025-0014',
  },
  {
    id: '15',
    traducaoId: '15',
    documentoNome: 'Relatório Financeiro Anual',
    clienteNome: 'Eduardo Santos',
    valorServico: 8500.00,
    origem_venda: 'propria',
    status: 'pago',
    dataEntrega: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
    dataPagamento: new Date(Date.now() - 147 * 24 * 60 * 60 * 1000).toISOString(),
    comprovante: 'COMP-2025-0015',
  },
]

export default function PagamentosPage({ traducoes }: PagamentosPageProps) {
  // Estado para o modal de comprovante
  const [comprovanteModal, setComprovanteModal] = useState<{
    isOpen: boolean
    pagamento: typeof pagamentosComComissao[0] | null
  }>({ isOpen: false, pagamento: null })

  // Transforma pagamentos e calcula comissões automaticamente
  const pagamentosComComissao = useMemo(() => {
    return mockPagamentos
      .map(p => {
        const { percentual, valorComissao } = calcularComissao(p.valorServico, p.origem_venda)
        return {
          ...p,
          percentual_comissao: percentual,
          valor_comissao: valorComissao,
          origem_label: getLabelOrigem(p.origem_venda)
        }
      })
      .sort((a, b) => new Date(b.dataEntrega).getTime() - new Date(a.dataEntrega).getTime())
  }, [])

  const totalPendente = pagamentosComComissao
    .filter(p => p.status === 'pendente' || p.status === 'processando')
    .reduce((sum, p) => sum + p.valor_comissao, 0)

  const totalPago = pagamentosComComissao
    .filter(p => p.status === 'pago')
    .reduce((sum, p) => sum + p.valor_comissao, 0)

  const totalGanhos = pagamentosComComissao.reduce((sum, p) => sum + p.valor_comissao, 0)
  
  const traducoesRealizadas = pagamentosComComissao.length

  const statusConfig: Record<'pendente' | 'pago' | 'processando', { variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'; label: string }> = {
    pendente: { variant: 'warning', label: 'Pendente' },
    pago: { variant: 'success', label: 'Pago' },
    processando: { variant: 'default', label: 'Processando' },
  }

  // Função para visualizar comprovante
  const handleViewComprovante = (pagamento: typeof pagamentosComComissao[0]) => {
    setComprovanteModal({ isOpen: true, pagamento })
  }

  // Função para baixar comprovante (simulado)
  const handleDownloadComprovante = (pagamento: typeof pagamentosComComissao[0]) => {
    // Simula o download de um PDF
    // Em produção, isso seria uma chamada à API para gerar/recuperar o PDF
    const content = `
COMPROVANTE DE PAGAMENTO DE COMISSÃO
=====================================

Nº do Comprovante: ${pagamento.comprovante}
Data de Pagamento: ${pagamento.dataPagamento ? new Date(pagamento.dataPagamento).toLocaleDateString('pt-BR') : '-'}

DADOS DO SERVIÇO:
- Documento: ${pagamento.documentoNome}
- Cliente: ${pagamento.clienteNome}
- Data de Entrega: ${new Date(pagamento.dataEntrega).toLocaleDateString('pt-BR')}

VALORES:
- Valor do Serviço: R$ ${pagamento.valorServico.toFixed(2).replace('.', ',')}
- Percentual de Comissão: ${pagamento.percentual_comissao}%
- Valor da Comissão: R$ ${pagamento.valor_comissao.toFixed(2).replace('.', ',')}

=====================================
Bora Expandir - Traduções Juramentadas
    `.trim()

    // Cria um blob e faz o download
    const blob = new Blob([content], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `comprovante_${pagamento.comprovante}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Pagamentos</h1>
        <p className="text-gray-600 dark:text-gray-400">Acompanhe seus pagamentos por tradução</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Ganhos */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-500/10 dark:to-blue-500/5 p-6 rounded-xl shadow-sm border border-blue-200 dark:border-blue-500/30">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300">Total Ganhos</h3>
            <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
            R$ {totalGanhos.toFixed(2).replace('.', ',')}
          </p>
          <p className="text-xs text-blue-700 dark:text-blue-400 mt-2">
            Soma de todos os pagamentos
          </p>
        </div>

        {/* Traduções Realizadas */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-500/10 dark:to-purple-500/5 p-6 rounded-xl shadow-sm border border-purple-200 dark:border-purple-500/30">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-purple-900 dark:text-purple-300">Traduções Realizadas</h3>
            <div className="p-2 bg-purple-100 dark:bg-purple-500/20 rounded-lg">
              <FileCheck className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">
            {traducoesRealizadas}
          </p>
          <p className="text-xs text-purple-700 dark:text-purple-400 mt-2">
            Total de documentos traduzidos
          </p>
        </div>

        {/* Pendente */}
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Pendente</h3>
            <div className="p-2 bg-yellow-50 dark:bg-yellow-500/10 rounded-lg">
              <DollarSign className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            R$ {totalPendente.toFixed(2).replace('.', ',')}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Aguardando pagamento
          </p>
        </div>

        {/* Pago */}
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Pago</h3>
            <div className="p-2 bg-green-50 dark:bg-green-500/10 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            R$ {totalPago.toFixed(2).replace('.', ',')}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Pagamentos recebidos
          </p>
        </div>
      </div>

      {/* Pagamentos Table */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-neutral-700/50 border-b border-gray-200 dark:border-neutral-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">Documento</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">Origem</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">Valor Serviço</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">Comissão</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">Data Entrega</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">Status</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">Comprovante</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
              {pagamentosComComissao.map(pagamento => (
                <tr key={pagamento.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900 dark:text-white">{pagamento.documentoNome}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {pagamento.clienteNome}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {pagamento.origem_venda === 'propria' ? (
                        <User className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      )}
                      <span className={`text-sm font-medium ${
                        pagamento.origem_venda === 'propria' 
                          ? 'text-emerald-600 dark:text-emerald-400' 
                          : 'text-blue-600 dark:text-blue-400'
                      }`}>
                        {pagamento.origem_label}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                    R$ {pagamento.valorServico.toFixed(2).replace('.', ',')}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    R$ {pagamento.valor_comissao.toFixed(2).replace('.', ',')}
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                      ({pagamento.percentual_comissao}%)
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {new Date(pagamento.dataEntrega).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={statusConfig[pagamento.status].variant}>
                      {statusConfig[pagamento.status].label}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    {pagamento.status === 'pago' && pagamento.comprovante ? (
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewComprovante(pagamento)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition"
                          title="Visualizar comprovante"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDownloadComprovante(pagamento)}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition"
                          title="Baixar comprovante"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 dark:text-gray-500">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Comprovante */}
      {comprovanteModal.isOpen && comprovanteModal.pagamento && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
            {/* Header do Modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-neutral-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg">
                  <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Comprovante de Pagamento
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {comprovanteModal.pagamento.comprovante}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setComprovanteModal({ isOpen: false, pagamento: null })}
                className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg transition"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-6 space-y-6">
              {/* Detalhes do Serviço */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                  Dados do Serviço
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Documento</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {comprovanteModal.pagamento.documentoNome}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Cliente</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {comprovanteModal.pagamento.clienteNome}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Data de Entrega</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {new Date(comprovanteModal.pagamento.dataEntrega).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Data de Pagamento</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {comprovanteModal.pagamento.dataPagamento 
                        ? new Date(comprovanteModal.pagamento.dataPagamento).toLocaleDateString('pt-BR')
                        : '-'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Valores */}
              <div className="bg-gray-50 dark:bg-neutral-700/50 rounded-xl p-4 space-y-3">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                  Valores
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Valor do Serviço</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      R$ {comprovanteModal.pagamento.valorServico.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Percentual de Comissão</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {comprovanteModal.pagamento.percentual_comissao}%
                    </span>
                  </div>
                  <div className="h-px bg-gray-200 dark:bg-neutral-600 my-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Valor da Comissão</span>
                    <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                      R$ {comprovanteModal.pagamento.valor_comissao.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                <Badge variant="success">Pago</Badge>
              </div>
            </div>

            {/* Footer do Modal */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-700/30">
              <button
                onClick={() => setComprovanteModal({ isOpen: false, pagamento: null })}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-600 rounded-lg transition"
              >
                Fechar
              </button>
              <button
                onClick={() => handleDownloadComprovante(comprovanteModal.pagamento!)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition"
              >
                <Download className="h-4 w-4" />
                Baixar Comprovante
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
