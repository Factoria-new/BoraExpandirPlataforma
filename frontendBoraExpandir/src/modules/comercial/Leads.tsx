import React, { useState, useMemo } from 'react'
import { Plus, Trash2, Mail, Phone, Building2, Filter, X, Search, Edit2, Bot } from 'lucide-react'
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
    origem_ia: false,
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
    origem_ia: false,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    nome: 'Maria Consultora',
    email: null, // Email não capturado pela IA
    telefone: '(31) 97654-3210',
    empresa: 'Consultoria Brasil',
    status: 'pendente',
    origem_ia: true,
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
    origem_ia: false,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    nome: 'Ana Gerenciadora',
    email: null, // Email não capturado pela IA
    telefone: '(51) 95432-1098',
    empresa: 'Logística Premium',
    status: 'pendente',
    origem_ia: true,
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
    origem_ia: false,
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '7',
    nome: 'Patricia Marketing',
    email: null, // Email não capturado pela IA
    telefone: '(85) 93210-9876',
    empresa: 'Marketing Digital Pro',
    status: 'contatado',
    origem_ia: true,
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
    origem_ia: false,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '9',
    nome: 'Fernanda Comercial',
    email: null, // Email não capturado pela IA
    telefone: '(19) 98888-7777',
    empresa: 'Comércio Atacado',
    status: 'pendente',
    origem_ia: true,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
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
  const [showModal, setShowModal] = useState(false)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    empresa: '',
  })

  const filteredLeads = useMemo(() => {
    // First filter by search term
    let filtered = leads.filter(
      lead =>
        lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase()))
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

  const handleOpenModal = (lead?: Lead) => {
    if (lead) {
      setEditingLead(lead)
      setFormData({
        nome: lead.nome,
        email: lead.email || '',
        telefone: lead.telefone,
        empresa: lead.empresa || '',
      })
    } else {
      setEditingLead(null)
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        empresa: '',
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingLead(null)
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      empresa: '',
    })
  }

  const handleSaveLead = () => {
    if (!formData.nome || !formData.telefone) {
      alert('Nome e telefone são obrigatórios!')
      return
    }

    if (editingLead) {
      // Atualizar lead existente
      setLeads(prev =>
        prev.map(lead =>
          lead.id === editingLead.id
            ? {
                ...lead,
                nome: formData.nome,
                email: formData.email || undefined,
                telefone: formData.telefone,
                empresa: formData.empresa || undefined,
                updated_at: new Date().toISOString(),
              }
            : lead
        )
      )
    } else {
      // Criar novo lead
      const newLead: Lead = {
        id: Date.now().toString(),
        nome: formData.nome,
        email: formData.email || undefined,
        telefone: formData.telefone,
        empresa: formData.empresa || undefined,
        status: 'pendente',
        origem_ia: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setLeads(prev => [newLead, ...prev])
    }

    handleCloseModal()
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
          
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors whitespace-nowrap"
          >
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
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900 dark:text-white">{lead.nome}</p>
                          {lead.origem_ia && (
                            <Badge variant="outline" className="flex items-center gap-1 text-xs">
                              <Bot className="h-3 w-3" />
                              IA
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">ID: {lead.id}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        {lead.email ? (
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Mail className="h-4 w-4" />
                            <a
                              href={`mailto:${lead.email}`}
                              className="hover:text-emerald-600 dark:hover:text-emerald-400"
                            >
                              {lead.email}
                            </a>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                            <Mail className="h-4 w-4" />
                            <span className="italic">E-mail não informado</span>
                          </div>
                        )}
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
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenModal(lead)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                          title="Editar lead"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteLead(lead.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Deletar lead"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
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

      {/* Modal de Cadastro/Edição */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-lg bg-white dark:bg-neutral-900 rounded-xl shadow-2xl border border-gray-200 dark:border-neutral-700 p-6 relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {editingLead ? 'Editar Lead' : 'Novo Lead'}
              </h3>
              {editingLead?.origem_ia && (
                <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-3 py-2 rounded-lg">
                  <Bot className="h-4 w-4" />
                  <span>Lead capturado pela IA - Complete as informações faltantes</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nome <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={e => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Nome do lead"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  E-mail {editingLead?.origem_ia && !formData.email && <span className="text-red-500">* (Preencher durante contato)</span>}
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 ${
                    editingLead?.origem_ia && !formData.email
                      ? 'border-red-500 dark:border-red-500 focus:ring-red-500 ring-2 ring-red-200 dark:ring-red-500/30'
                      : 'border-gray-300 dark:border-neutral-600 focus:ring-emerald-500'
                  }`}
                  placeholder="email@exemplo.com"
                />
                {editingLead?.origem_ia && !formData.email && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                    ⚠️ E-mail não foi capturado pela IA. Preencha durante o contato com o lead.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Telefone/WhatsApp <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.telefone}
                  onChange={e => setFormData({ ...formData, telefone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Empresa
                </label>
                <input
                  type="text"
                  value={formData.empresa}
                  onChange={e => setFormData({ ...formData, empresa: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Nome da empresa"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveLead}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
              >
                {editingLead ? 'Salvar Alterações' : 'Criar Lead'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
