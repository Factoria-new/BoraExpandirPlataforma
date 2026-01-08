import React, { useState, useMemo } from 'react'
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Target,
  AlertCircle,
  Clock,
  Trophy,
  Medal,
  Award,
  CheckCircle2,
  Filter,
  Briefcase,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

interface VendedorInfo {
  nome: string
  vendas: number
  meta: number
  comissao: number
  status: 'acima' | 'dentro' | 'abaixo'
  servico: string
}

// Tipos de serviço disponíveis
const tiposServico = [
  { value: 'todos', label: 'Todos os Serviços' },
  { value: 'consultoria', label: 'Consultoria' },
  { value: 'visto_d7', label: 'Visto D7' },
  { value: 'cidadania_portuguesa', label: 'Cidadania Portuguesa' },
  { value: 'cidadania_italiana', label: 'Cidadania Italiana' },
  { value: 'green_card', label: 'Green Card' },
  { value: 'visto_e2', label: 'Visto E-2' },
]

// Mock data com segmentação por serviço
const mockMetricasPorServico = {
  todos: {
    metaVendas: { atual: 145000, total: 200000, percentual: 72.5 },
    novosClientes: { mes: 42, mesAnterior: 35, crescimento: 20 },
    faturamentoMensal: { valor: 287500, mesAnterior: 242000, crescimento: 18.8 },
    contasReceber: { total: 456000, vencidas: 54000, proximasVencer: 85000 },
    comissoes: { aRealizar: 28750, paga: 165200, total: 193950 },
  },
  consultoria: {
    metaVendas: { atual: 25000, total: 40000, percentual: 62.5 },
    novosClientes: { mes: 8, mesAnterior: 6, crescimento: 33.3 },
    faturamentoMensal: { valor: 45000, mesAnterior: 38000, crescimento: 18.4 },
    contasReceber: { total: 72000, vencidas: 8000, proximasVencer: 15000 },
    comissoes: { aRealizar: 4500, paga: 28000, total: 32500 },
  },
  visto_d7: {
    metaVendas: { atual: 35000, total: 45000, percentual: 77.8 },
    novosClientes: { mes: 12, mesAnterior: 10, crescimento: 20 },
    faturamentoMensal: { valor: 68000, mesAnterior: 55000, crescimento: 23.6 },
    contasReceber: { total: 98000, vencidas: 12000, proximasVencer: 22000 },
    comissoes: { aRealizar: 6800, paga: 42000, total: 48800 },
  },
  cidadania_portuguesa: {
    metaVendas: { atual: 28000, total: 35000, percentual: 80 },
    novosClientes: { mes: 7, mesAnterior: 8, crescimento: -12.5 },
    faturamentoMensal: { valor: 56000, mesAnterior: 62000, crescimento: -9.7 },
    contasReceber: { total: 85000, vencidas: 15000, proximasVencer: 18000 },
    comissoes: { aRealizar: 5600, paga: 32000, total: 37600 },
  },
  cidadania_italiana: {
    metaVendas: { atual: 22000, total: 30000, percentual: 73.3 },
    novosClientes: { mes: 6, mesAnterior: 4, crescimento: 50 },
    faturamentoMensal: { valor: 42000, mesAnterior: 35000, crescimento: 20 },
    contasReceber: { total: 65000, vencidas: 8000, proximasVencer: 12000 },
    comissoes: { aRealizar: 4200, paga: 25000, total: 29200 },
  },
  green_card: {
    metaVendas: { atual: 18000, total: 25000, percentual: 72 },
    novosClientes: { mes: 5, mesAnterior: 4, crescimento: 25 },
    faturamentoMensal: { valor: 48000, mesAnterior: 32000, crescimento: 50 },
    contasReceber: { total: 78000, vencidas: 6000, proximasVencer: 10000 },
    comissoes: { aRealizar: 4800, paga: 22000, total: 26800 },
  },
  visto_e2: {
    metaVendas: { atual: 17000, total: 25000, percentual: 68 },
    novosClientes: { mes: 4, mesAnterior: 3, crescimento: 33.3 },
    faturamentoMensal: { valor: 28500, mesAnterior: 20000, crescimento: 42.5 },
    contasReceber: { total: 58000, vencidas: 5000, proximasVencer: 8000 },
    comissoes: { aRealizar: 2850, paga: 16200, total: 19050 },
  },
}

// Vendedores com serviço associado
const mockVendedores: VendedorInfo[] = [
  { nome: 'João Silva', vendas: 28000, meta: 25000, comissao: 2800, status: 'acima', servico: 'visto_d7' },
  { nome: 'Maria Santos', vendas: 22000, meta: 25000, comissao: 1650, status: 'abaixo', servico: 'cidadania_portuguesa' },
  { nome: 'Pedro Costa', vendas: 26500, meta: 25000, comissao: 2650, status: 'acima', servico: 'consultoria' },
  { nome: 'Ana Oliveira', vendas: 11000, meta: 25000, comissao: 825, status: 'abaixo', servico: 'green_card' },
  { nome: 'Carlos Ferreira', vendas: 25000, meta: 25000, comissao: 2500, status: 'dentro', servico: 'cidadania_italiana' },
  { nome: 'Lucia Mendes', vendas: 30000, meta: 25000, comissao: 3000, status: 'acima', servico: 'visto_e2' },
  { nome: 'Roberto Lima', vendas: 32000, meta: 25000, comissao: 3200, status: 'acima', servico: 'visto_d7' },
  { nome: 'Fernanda Alves', vendas: 18000, meta: 25000, comissao: 1350, status: 'abaixo', servico: 'consultoria' },
]

const corPorStatus = {
  acima: 'bg-green-600',
  dentro: 'bg-blue-600',
  abaixo: 'bg-orange-600',
}

const corTextoStatus = {
  acima: 'text-green-200',
  dentro: 'text-blue-200',
  abaixo: 'text-orange-200',
}

const corBarraStatus = {
  acima: 'bg-green-100',
  dentro: 'bg-blue-100',
  abaixo: 'bg-orange-100',
}

// Ícones para posições do ranking
const positionIcons = [
  { icon: Trophy, color: 'text-yellow-500' },
  { icon: Medal, color: 'text-gray-400' },
  { icon: Award, color: 'text-amber-600' },
]

export function Dashboard() {
  const [periodo, setPeriodo] = useState('mes')
  const [servicoFiltro, setServicoFiltro] = useState('todos')
  const [filtroAberto, setFiltroAberto] = useState(false)

  // Métricas baseadas no filtro de serviço
  const mockMetricas = useMemo(() => {
    return mockMetricasPorServico[servicoFiltro as keyof typeof mockMetricasPorServico] || mockMetricasPorServico.todos
  }, [servicoFiltro])

  // Vendedores filtrados por serviço
  const vendedoresFiltrados = useMemo(() => {
    if (servicoFiltro === 'todos') return mockVendedores
    return mockVendedores.filter(v => v.servico === servicoFiltro)
  }, [servicoFiltro])

  // Cálculos
  const percentualMeta = useMemo(() => {
    return Math.round((mockMetricas.metaVendas.atual / mockMetricas.metaVendas.total) * 100)
  }, [mockMetricas])

  const faturamentoPorcentagem = useMemo(() => {
    return (
      ((mockMetricas.faturamentoMensal.valor - mockMetricas.faturamentoMensal.mesAnterior) /
        mockMetricas.faturamentoMensal.mesAnterior) *
      100
    ).toFixed(1)
  }, [mockMetricas])

  const statusMeta = useMemo(() => {
    if (percentualMeta >= 100) return 'acima'
    if (percentualMeta >= 75) return 'dentro'
    return 'abaixo'
  }, [percentualMeta])

  const statusClientesNovos = mockMetricas.novosClientes.crescimento >= 0 ? 'up' : 'down'

  // Ranking de vendedores ordenado por performance
  const vendedoresRanking = useMemo(() => {
    return [...vendedoresFiltrados]
      .map(v => ({
        ...v,
        percentual: (v.vendas / v.meta) * 100,
        metaBatida: v.vendas >= v.meta,
      }))
      .sort((a, b) => b.percentual - a.percentual)
  }, [vendedoresFiltrados])

  // Contagem de metas batidas vs pendentes
  const metasResumo = useMemo(() => {
    const batidas = vendedoresRanking.filter(v => v.metaBatida).length
    const pendentes = vendedoresRanking.length - batidas
    return {
      batidas,
      pendentes,
      total: vendedoresRanking.length,
      percentualBatidas: vendedoresRanking.length > 0 ? Math.round((batidas / vendedoresRanking.length) * 100) : 0,
    }
  }, [vendedoresRanking])

  // Obter nome do serviço selecionado
  const servicoSelecionadoLabel = tiposServico.find(s => s.value === servicoFiltro)?.label || 'Todos'

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Financeiro</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setPeriodo('semana')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                periodo === 'semana'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Semana
            </button>
            <button
              onClick={() => setPeriodo('mes')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                periodo === 'mes'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Mês
            </button>
            <button
              onClick={() => setPeriodo('ano')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                periodo === 'ano'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Ano
            </button>
          </div>
        </div>

        {/* Linha com descrição e filtro de serviço */}
        <div className="flex items-center justify-between">
          <p className="text-gray-600">Visão geral das métricas financeiras e desempenho de vendas</p>
          
          {/* Botão de Filtro por Serviço */}
          <div className="relative">
            <button
              onClick={() => setFiltroAberto(!filtroAberto)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                servicoFiltro !== 'todos'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Filter className="h-4 w-4" />
              {servicoFiltro === 'todos' ? 'Filtrar Serviço' : servicoSelecionadoLabel}
              {filtroAberto ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>

            {/* Dropdown de Serviços */}
            {filtroAberto && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
                <div className="p-2">
                  {tiposServico.map((servico) => (
                    <button
                      key={servico.value}
                      onClick={() => {
                        setServicoFiltro(servico.value)
                        setFiltroAberto(false)
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        servicoFiltro === servico.value
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {servico.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Métricas Principais - Grid 2x2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Meta de Vendas */}
        <div className="bg-green-600 rounded-xl p-6 shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-white/90 mb-1">Meta de Vendas</p>
              <h3 className="text-3xl font-bold text-white">
                {mockMetricas.metaVendas.percentual}%
              </h3>
              <p className="text-xs text-white/80 mt-1">
                R$ {mockMetricas.metaVendas.atual.toLocaleString('pt-BR')} de R${' '}
                {mockMetricas.metaVendas.total.toLocaleString('pt-BR')}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-white/20">
              <Target className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="w-full bg-white/30 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-500"
              style={{ width: `${Math.min(percentualMeta, 100)}%` }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs font-medium text-white">
              {statusMeta === 'acima'
                ? '✓ Acima da meta'
                : statusMeta === 'dentro'
                  ? '◐ Dentro da meta'
                  : '⚠ Abaixo da meta'}
            </span>
            <span className="text-xs text-white/80">
              Faltam R$ {(mockMetricas.metaVendas.total - mockMetricas.metaVendas.atual).toLocaleString('pt-BR')}
            </span>
          </div>
        </div>

        {/* Faturamento Mensal */}
        <div className="bg-blue-600 rounded-xl p-6 shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-white/90 mb-1">Faturamento Mensal</p>
              <h3 className="text-3xl font-bold text-white">
                R$ {(mockMetricas.faturamentoMensal.valor / 1000).toFixed(1)}k
              </h3>
              <p className="text-xs text-white/80 mt-1">
                Mês anterior: R$ {(mockMetricas.faturamentoMensal.mesAnterior / 1000).toFixed(1)}k
              </p>
            </div>
            <div className="p-3 rounded-lg bg-white/20">
              <DollarSign className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-white" />
            <span className="text-sm font-medium text-white">+{faturamentoPorcentagem}% vs mês anterior</span>
          </div>
        </div>

        {/* Novos Clientes */}
        <div className="bg-purple-600 rounded-xl p-6 shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-white/90 mb-1">Novos Clientes</p>
              <h3 className="text-3xl font-bold text-white">
                {mockMetricas.novosClientes.mes}
              </h3>
              <p className="text-xs text-white/80 mt-1">
                Mês anterior: {mockMetricas.novosClientes.mesAnterior} clientes
              </p>
            </div>
            <div className="p-3 rounded-lg bg-white/20">
              <Users className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            {statusClientesNovos === 'up' && <TrendingUp className="h-4 w-4 text-white" />}
            {statusClientesNovos === 'down' && <TrendingDown className="h-4 w-4 text-white" />}
            <span className="text-sm font-medium text-white">
              {statusClientesNovos === 'down' ? '' : '+'}{mockMetricas.novosClientes.crescimento}%
            </span>
          </div>
        </div>

        {/* Contas a Receber */}
        <div className="bg-red-600 rounded-xl p-6 shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-white/90 mb-1">Contas a Receber</p>
              <h3 className="text-3xl font-bold text-white">
                R$ {(mockMetricas.contasReceber.total / 1000).toFixed(0)}k
              </h3>
            </div>
            <div className="p-3 rounded-lg bg-white/20">
              <AlertCircle className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-white/90 font-medium">Vencidas:</span>
              <span className="font-bold text-white">
                R$ {mockMetricas.contasReceber.vencidas.toLocaleString('pt-BR')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/90 font-medium">Próximas vencer:</span>
              <span className="font-bold text-white">
                R$ {mockMetricas.contasReceber.proximasVencer.toLocaleString('pt-BR')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Resumo de Metas - Cards de Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metas Batidas */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-lg bg-white/20">
              <CheckCircle2 className="h-8 w-8 text-white" />
            </div>
            <span className="text-4xl font-bold text-white">{metasResumo.batidas}</span>
          </div>
          <h3 className="text-lg font-semibold text-white">Metas Batidas</h3>
          <p className="text-sm text-white/80 mt-1">
            {metasResumo.percentualBatidas}% dos vendedores
          </p>
        </div>

        {/* Metas Pendentes */}
        <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-lg bg-white/20">
              <Clock className="h-8 w-8 text-white" />
            </div>
            <span className="text-4xl font-bold text-white">{metasResumo.pendentes}</span>
          </div>
          <h3 className="text-lg font-semibold text-white">Metas Pendentes</h3>
          <p className="text-sm text-white/80 mt-1">
            {100 - metasResumo.percentualBatidas}% dos vendedores
          </p>
        </div>

        {/* Total Vendedores */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-lg bg-white/20">
              <Users className="h-8 w-8 text-white" />
            </div>
            <span className="text-4xl font-bold text-white">{metasResumo.total}</span>
          </div>
          <h3 className="text-lg font-semibold text-white">Total Vendedores</h3>
          <p className="text-sm text-white/80 mt-1">
            Equipe completa
          </p>
        </div>
      </div>

      {/* Comissões */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Comissões</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-600 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-white/90">Paga</span>
              <span className="text-sm text-white">✓</span>
            </div>
            <p className="text-2xl font-bold text-white">
              R$ {mockMetricas.comissoes.paga.toLocaleString('pt-BR')}
            </p>
          </div>

          <div className="bg-orange-500 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-white/90">A Realizar</span>
              <Clock className="h-4 w-4 text-white" />
            </div>
            <p className="text-2xl font-bold text-white">
              R$ {mockMetricas.comissoes.aRealizar.toLocaleString('pt-BR')}
            </p>
          </div>

          <div className="bg-gray-700 rounded-lg p-4 shadow-sm">
            <p className="text-xs text-white/80 mb-1">Total de Comissões</p>
            <p className="text-2xl font-bold text-white">
              R$ {mockMetricas.comissoes.total.toLocaleString('pt-BR')}
            </p>
          </div>
        </div>
      </div>


      {/* Ranking de Metas - Tabela Completa */}
      <div className="border border-gray-200 rounded-xl bg-white shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6">
          <div className="flex items-center gap-3">
            <Trophy className="h-7 w-7 text-yellow-400" />
            <h2 className="text-xl font-bold text-white">Ranking de Metas</h2>
          </div>
          <p className="text-gray-300 text-sm mt-1">Performance dos vendedores ordenada por % de meta atingida</p>
        </div>
        
        <div className="divide-y divide-gray-100">
          {vendedoresRanking.map((vendedor, idx) => {
            const PositionIcon = idx < 3 ? positionIcons[idx].icon : null
            const positionColor = idx < 3 ? positionIcons[idx].color : 'text-gray-400'
            
            return (
              <div 
                key={idx} 
                className={`p-5 flex items-center gap-4 transition-colors hover:bg-gray-50 ${
                  idx === 0 ? 'bg-yellow-50/50' : ''
                }`}
              >
                {/* Posição */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  idx === 0 ? 'bg-yellow-100' : 
                  idx === 1 ? 'bg-gray-100' : 
                  idx === 2 ? 'bg-amber-100' : 'bg-gray-50'
                }`}>
                  {PositionIcon ? (
                    <PositionIcon className={`h-6 w-6 ${positionColor}`} />
                  ) : (
                    <span className="text-lg font-bold text-gray-500">{idx + 1}º</span>
                  )}
                </div>

                {/* Info do Vendedor */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-semibold text-gray-900 truncate">{vendedor.nome}</h4>
                    {/* Badge de Status */}
                    {vendedor.metaBatida ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        META BATIDA
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700 border border-orange-200">
                        <Clock className="h-3.5 w-3.5" />
                        META PENDENTE
                      </span>
                    )}
                  </div>
                  
                  {/* Barra de Progresso */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          vendedor.metaBatida ? 'bg-green-500' : 'bg-orange-400'
                        }`}
                        style={{ width: `${Math.min(vendedor.percentual, 100)}%` }}
                      />
                    </div>
                    <span className={`text-sm font-bold min-w-[50px] text-right ${
                      vendedor.metaBatida ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      {vendedor.percentual.toFixed(0)}%
                    </span>
                  </div>
                </div>

                {/* Valores */}
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-900">
                      R$ {vendedor.vendas.toLocaleString('pt-BR')}
                    </span>
                    <span className="text-gray-400"> / R$ {vendedor.meta.toLocaleString('pt-BR')}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Comissão: <span className="font-medium text-gray-700">R$ {vendedor.comissao.toLocaleString('pt-BR')}</span>
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
