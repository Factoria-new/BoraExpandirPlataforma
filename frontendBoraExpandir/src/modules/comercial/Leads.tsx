import React, { useState, useMemo } from 'react'
import { Plus, Trash2, Mail, Phone, Building2, Filter, X, Search } from 'lucide-react'
import type { Lead } from '../../types/comercial'
import { Badge } from '../../components/ui/Badge'
import { TimeRangeFilter, filterByTimeRange, type TimeRange } from '../../components/ui/TimeRangeFilter'
import { SortControl, sortData, type SortDirection, type SortOption } from '../../components/ui/SortControl'

const mockLeads: Lead[] = [
  {
    id: '1',
    nome: 'Empresa Tech Solutions',
    email: 'contato@techsolutions.com',
    telefone: '(11) 98765-4321',
    empresa: 'Tech Solutions LTDA',
    status: 'qualificado',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    nome: 'João Empreendedor',
    email: 'joao@startup.com',
    telefone: '(21) 99876-5432',
    empresa: 'Startup Innovation',
    status: 'contatado',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    nome: 'Maria Consultora',
    email: 'maria@consultoria.com',
    telefone: '(31) 97654-3210',
    empresa: 'Consultoria Brasil',
    status: 'convertido',
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    nome: 'Carlos da Distribuição',
    email: 'carlos@distribuicao.com',
    telefone: '(41) 96543-2109',
    empresa: 'Distribuição Central',
    status: 'pendente',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    nome: 'Ana Gerenciadora',
    email: 'ana@logistica.com',
    telefone: '(51) 95432-1098',
    empresa: 'Logística Premium',
    status: 'perdido',
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '6',
    nome: 'Roberto Financeiro',
    email: 'roberto@financeiro.com',
    telefone: '(61) 94321-0987',
    empresa: 'Soluções Financeiras',
    status: 'qualificado',
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '7',
    nome: 'Patricia Marketing',
    email: 'patricia@marketing.com',
    telefone: '(85) 93210-9876',
    empresa: 'Marketing Digital Pro',
    status: 'contatado',
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '8',
    nome: 'Thiago Desenvolvimento',
    email: 'thiago@desenvolvimento.com',
    telefone: '(47) 92109-8765',
    empresa: 'Dev Solutions',
    status: 'pendente',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

const statusConfig: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'; label: string }> = {
  pendente: {
    variant: 'warning',
    label: 'Pendente',
  },
  contatado: {
    variant: 'default',
    label: 'Contatado',
  },
  qualificado: {
    variant: 'success',
    label: 'Qualificado',
  },
  convertido: {
    variant: 'success',
    label: 'Convertido',
  },
  perdido: {
    variant: 'destructive',
    label: 'Perdido',
  },
}

const sortOptions: SortOption[] = [
  { value: 'nome', label: 'Nome' },
  { value: 'created_at', label: 'Data de Cadastro' },
  { value: 'updated_at', label: 'Última Atualização' },
  { value: 'status', label: 'Status' },
]

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(mockLeads)
  const [searchTerm, setSearchTerm] = useState('')
  const [timeRange, setTimeRange] = useState<TimeRange>('current_month')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [showFilters, setShowFilters] = useState(false)

  const filteredLeads = useMemo(() => {
    // First filter by search term
    let filtered = leads.filter(
      lead =>
        lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Then filter by time range
    filtered = filterByTimeRange(filtered, timeRange)

    // Finally sort
    return sortData(filtered, sortBy, sortDirection)
  }, [leads, searchTerm, timeRange, sortBy, sortDirection])

  const handleDeleteLead = (id: string) => {
    setLeads(prev => prev.filter(lead => lead.id !== id))
  }

  const handleSortChange = (newSortBy: string, newDirection: SortDirection) => {
    setSortBy(newSortBy)
    setSortDirection(newDirection)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Leads</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gerencie seus leads e acompanhe o status de cada um
        </p>
      </div>

      {/* Barra de Ações */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        {/* Campo de Busca */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome, email ou empresa..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-colors ${
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
          
          <button className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors whitespace-nowrap">
            <Plus className="h-5 w-5" />
            <span className="hidden sm:inline">Novo Lead</span>
          </button>
        </div>
      </div>

      {/* Painel de Filtros Colapsável */}
      {showFilters && (
        <div className="mb-6 p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-800 dark:to-neutral-800/50 rounded-xl border border-gray-200 dark:border-neutral-700 shadow-sm animate-in slide-in-from-top-2 duration-200">
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

      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 overflow-hidden">
        {filteredLeads.length === 0 ? (
          <div className="p-12 text-center">
            <Building2 className="h-12 w-12 text-gray-300 dark:text-neutral-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
              Nenhum lead encontrado
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm ? 'Tente refinar sua busca' : 'Comece adicionando novos leads'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-700/50">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Contato
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                {filteredLeads.map(lead => (
                  <tr
                    key={lead.id}
                    className="hover:bg-gray-50 dark:hover:bg-neutral-700/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{lead.nome}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">ID: {lead.id}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Mail className="h-4 w-4" />
                          <a
                            href={`mailto:${lead.email}`}
                            className="hover:text-emerald-600 dark:hover:text-emerald-400"
                          >
                            {lead.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Phone className="h-4 w-4" />
                          <a
                            href={`tel:${lead.telefone}`}
                            className="hover:text-emerald-600 dark:hover:text-emerald-400"
                          >
                            {lead.telefone}
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={statusConfig[lead.status]?.variant || 'secondary'}>
                        {statusConfig[lead.status]?.label || lead.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDeleteLead(lead.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Deletar lead"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {filteredLeads.length > 0 && (
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Exibindo {filteredLeads.length} de {leads.length} leads
        </div>
      )}
    </div>
  )
}
