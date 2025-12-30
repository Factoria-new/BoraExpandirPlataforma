import { useMemo, useState } from 'react'
import { DollarSign, TrendingUp, Calendar, Award, Filter, X } from 'lucide-react'
import { Badge } from '../../components/ui/Badge'
import { TimeRangeFilter, filterByTimeRange, type TimeRange } from '../../components/ui/TimeRangeFilter'
import { SortControl, sortData, type SortDirection, type SortOption } from '../../components/ui/SortControl'

// Mock data - substituir por dados reais do backend
// Dados distribuídos nos últimos 6 meses para testar filtros
const mockComissoes = [
  // Mês atual
  {
    id: '1',
    cliente_nome: 'João Silva',
    servico: 'Consultoria Jurídica - Contrato Comercial',
    valor_servico: 5000.00,
    percentual_comissao: 10,
    valor_comissao: 500.00,
    status: 'pago',
    data_venda: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    data_pagamento: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    cliente_nome: 'Maria Santos',
    servico: 'Parecer Jurídico - Propriedade Intelectual',
    valor_servico: 3500.00,
    percentual_comissao: 10,
    valor_comissao: 350.00,
    status: 'pendente',
    data_venda: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    data_pagamento: null,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    cliente_nome: 'Carlos Oliveira',
    servico: 'Assessoria Contratual - M&A',
    valor_servico: 15000.00,
    percentual_comissao: 12,
    valor_comissao: 1800.00,
    status: 'pago',
    data_venda: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    data_pagamento: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    cliente_nome: 'Ana Costa',
    servico: 'Consultoria - Direito Trabalhista',
    valor_servico: 4000.00,
    percentual_comissao: 10,
    valor_comissao: 400.00,
    status: 'processando',
    data_venda: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    data_pagamento: null,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    cliente_nome: 'Pedro Almeida',
    servico: 'Análise de Conformidade - LGPD',
    valor_servico: 6000.00,
    percentual_comissao: 10,
    valor_comissao: 600.00,
    status: 'pago',
    data_venda: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    data_pagamento: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  // Mês passado
  {
    id: '6',
    cliente_nome: 'Fernanda Lima',
    servico: 'Contrato de Prestação de Serviços',
    valor_servico: 7500.00,
    percentual_comissao: 10,
    valor_comissao: 750.00,
    status: 'pago',
    data_venda: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    data_pagamento: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '7',
    cliente_nome: 'Roberto Souza',
    servico: 'Consultoria Empresarial',
    valor_servico: 8000.00,
    percentual_comissao: 12,
    valor_comissao: 960.00,
    status: 'pago',
    data_venda: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    data_pagamento: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '8',
    cliente_nome: 'Juliana Martins',
    servico: 'Revisão Contratual',
    valor_servico: 2500.00,
    percentual_comissao: 10,
    valor_comissao: 250.00,
    status: 'cancelado',
    data_venda: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    data_pagamento: null,
    created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
  // 2-3 meses atrás
  {
    id: '9',
    cliente_nome: 'Marcos Pereira',
    servico: 'Assessoria Jurídica - Licitações',
    valor_servico: 12000.00,
    percentual_comissao: 15,
    valor_comissao: 1800.00,
    status: 'pago',
    data_venda: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString(),
    data_pagamento: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '10',
    cliente_nome: 'Luciana Rodrigues',
    servico: 'Consultoria Tributária',
    valor_servico: 9000.00,
    percentual_comissao: 10,
    valor_comissao: 900.00,
    status: 'pago',
    data_venda: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(),
    data_pagamento: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '11',
    cliente_nome: 'Ricardo Gomes',
    servico: 'Due Diligence',
    valor_servico: 18000.00,
    percentual_comissao: 12,
    valor_comissao: 2160.00,
    status: 'pago',
    data_venda: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000).toISOString(),
    data_pagamento: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000).toISOString(),
  },
  // 4-5 meses atrás
  {
    id: '12',
    cliente_nome: 'Beatriz Fernandes',
    servico: 'Contrato de Locação Comercial',
    valor_servico: 3000.00,
    percentual_comissao: 10,
    valor_comissao: 300.00,
    status: 'pago',
    data_venda: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    data_pagamento: new Date(Date.now() - 115 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '13',
    cliente_nome: 'Gustavo Alves',
    servico: 'Consultoria em Compliance',
    valor_servico: 10000.00,
    percentual_comissao: 12,
    valor_comissao: 1200.00,
    status: 'pago',
    data_venda: new Date(Date.now() - 135 * 24 * 60 * 60 * 1000).toISOString(),
    data_pagamento: new Date(Date.now() - 130 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 135 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '14',
    cliente_nome: 'Patricia Mendes',
    servico: 'Assessoria em Fusões',
    valor_servico: 25000.00,
    percentual_comissao: 15,
    valor_comissao: 3750.00,
    status: 'pago',
    data_venda: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
    data_pagamento: new Date(Date.now() - 145 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
  },
  // 6 meses atrás
  {
    id: '15',
    cliente_nome: 'Eduardo Santos',
    servico: 'Consultoria Jurídica - Startups',
    valor_servico: 5500.00,
    percentual_comissao: 10,
    valor_comissao: 550.00,
    status: 'pago',
    data_venda: new Date(Date.now() - 170 * 24 * 60 * 60 * 1000).toISOString(),
    data_pagamento: new Date(Date.now() - 165 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 170 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

const statusConfig = {
  pago: { variant: 'success' as const, label: 'Pago' },
  pendente: { variant: 'warning' as const, label: 'Pendente' },
  processando: { variant: 'default' as const, label: 'Processando' },
  cancelado: { variant: 'destructive' as const, label: 'Cancelado' },
}

const sortOptions: SortOption[] = [
  { value: 'data_venda', label: 'Data da Venda' },
  { value: 'valor_comissao', label: 'Valor da Comissão' },
  { value: 'cliente_nome', label: 'Nome do Cliente' },
  { value: 'status', label: 'Status' },
]

export default function Ganhos() {
  const [timeRange, setTimeRange] = useState<TimeRange>('current_month')
  const [sortBy, setSortBy] = useState('data_venda')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [showFilters, setShowFilters] = useState(false)

  const filteredComissoes = useMemo(() => {
    // Filter by time range
    let filtered = filterByTimeRange(mockComissoes, timeRange)

    // Sort
    return sortData(filtered, sortBy, sortDirection)
  }, [timeRange, sortBy, sortDirection])

  const handleSortChange = (newSortBy: string, newDirection: SortDirection) => {
    setSortBy(newSortBy)
    setSortDirection(newDirection)
  }

  // Calcular totais
  const totais = useMemo(() => {
    const total = filteredComissoes.reduce((acc, c) => acc + c.valor_comissao, 0)
    const pago = filteredComissoes
      .filter(c => c.status === 'pago')
      .reduce((acc, c) => acc + c.valor_comissao, 0)
    const pendente = filteredComissoes
      .filter(c => c.status === 'pendente' || c.status === 'processando')
      .reduce((acc, c) => acc + c.valor_comissao, 0)
    const totalVendas = filteredComissoes.reduce((acc, c) => acc + c.valor_servico, 0)

    return { total, pago, pendente, totalVendas, quantidade: filteredComissoes.length }
  }, [filteredComissoes])

  return (
    <div className="space-y-6">
      {/* Cabeçalho com Título e Botão de Filtros */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Ganhos e Comissões</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Acompanhe suas comissões e ganhos por vendas realizadas
          </p>
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-colors whitespace-nowrap ${
            showFilters
              ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500 text-emerald-700 dark:text-emerald-300'
              : 'bg-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700'
          }`}
        >
          {showFilters ? (
            <>
              <X className="h-5 w-5" />
              <span className="hidden sm:inline">Fechar</span>
            </>
          ) : (
            <>
              <Filter className="h-5 w-5" />
              <span className="hidden sm:inline">Filtros</span>
            </>
          )}
        </button>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-emerald-600 dark:bg-emerald-600 rounded-lg p-5 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-white">Total de Comissões</h2>
            <div className="p-2 bg-white/20 rounded-lg">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">
            R$ {totais.total.toFixed(2)}
          </p>
          <p className="mt-2 text-xs text-white/80">
            {totais.quantidade} vendas no período
          </p>
        </div>

        <div className="bg-blue-600 dark:bg-blue-600 rounded-lg p-5 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-white">Comissões Pagas</h2>
            <div className="p-2 bg-white/20 rounded-lg">
              <Award className="h-5 w-5 text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">
            R$ {totais.pago.toFixed(2)}
          </p>
          <p className="mt-2 text-xs text-white/80">
            Já recebido
          </p>
        </div>

        <div className="bg-amber-500 dark:bg-amber-500 rounded-lg p-5 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-white">A Receber</h2>
            <div className="p-2 bg-white/20 rounded-lg">
              <Calendar className="h-5 w-5 text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">
            R$ {totais.pendente.toFixed(2)}
          </p>
          <p className="mt-2 text-xs text-white/80">
            Pendente/Processando
          </p>
        </div>

        <div className="bg-purple-600 dark:bg-purple-600 rounded-lg p-5 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-white">Total em Vendas</h2>
            <div className="p-2 bg-white/20 rounded-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">
            R$ {totais.totalVendas.toFixed(2)}
          </p>
          <p className="mt-2 text-xs text-white/80">
            Valor total vendido
          </p>
        </div>
      </div>

      {/* Painel de Filtros Colapsável */}
      {showFilters && (
        <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-800 dark:to-neutral-800/50 rounded-xl border border-gray-200 dark:border-neutral-700 shadow-sm animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TimeRangeFilter
              value={timeRange}
              onChange={setTimeRange}
            />
            <SortControl
              sortBy={sortBy}
              sortDirection={sortDirection}
              onSortChange={handleSortChange}
              options={sortOptions}
            />
          </div>
        </div>
      )}

      {/* Tabela de Comissões */}
      <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-neutral-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Histórico de Comissões</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-neutral-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Serviço
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Valor Venda
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Comissão
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Data Venda
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
              {filteredComissoes.map((comissao) => {
                const statusInfo = statusConfig[comissao.status as keyof typeof statusConfig]
                return (
                  <tr key={comissao.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700/50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {comissao.cliente_nome}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {comissao.servico}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">
                      R$ {comissao.valor_servico.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                      R$ {comissao.valor_comissao.toFixed(2)}
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                        ({comissao.percentual_comissao}%)
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={statusInfo.variant}>
                        {statusInfo.label}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {new Date(comissao.data_venda).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contador */}
      {filteredComissoes.length > 0 && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Exibindo {filteredComissoes.length} de {mockComissoes.length} comissões
        </div>
      )}
    </div>
  )
}
