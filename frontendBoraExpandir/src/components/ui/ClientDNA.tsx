import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
    User,
    FileText,
    History,
    Briefcase,
    Calendar,
    Copy,
    Check,
    ExternalLink,
    Phone,
    Mail,
    MapPin,
    Clock,
    CheckCircle,
    AlertCircle,
    ArrowLeft,
    Search,
    ClipboardList,
    FolderOpen,
    Plane,
    CheckSquare,
    Flag,
    XCircle,
    Users,
    ChevronDown
} from 'lucide-react'
import { cn } from '@/lib/utils'

export type ClientNote = {
    id: string
    text: string
    author: string
    createdAt: string
    stageId?: string // Associar nota a uma etapa específica
}

// ... (ClientDNAData remains same)

export type ClientDNAData = {
    id: string
    nome: string
    email?: string
    telefone?: string
    endereco?: string
    tipoAssessoria: string
    contratoAtivo: boolean
    dataContrato?: string
    previsaoChegada?: string
    deadline?: string // ISO date or localized string
    faseAtual?: string
    categoria: string
    priority: 'high' | 'medium' | 'low'
    notes?: ClientNote[]
    historico?: {
        data: string
        evento: string
        responsavel?: string
        tipo?: 'info' | 'success' | 'warning' | 'error'
    }[]
}

type DNACategory = {
    id: string
    label: string
    icon: React.ReactNode
    color: string
    count: number
}

const CATEGORIAS_LIST: Omit<DNACategory, 'count'>[] = [
    { id: 'formularios', label: '1-Formulários Consultoria Imigração', icon: <ClipboardList className="h-6 w-6" />, color: 'bg-gray-500' },
    { id: 'aguardando_consultoria', label: '2-CRM de Clientes Aguardando Consultoria', icon: <FolderOpen className="h-6 w-6" />, color: 'bg-amber-600' },
    { id: 'clientes_c2', label: '3- CRM Clientes C2', icon: <ClipboardList className="h-6 w-6" />, color: 'bg-slate-600' },
    { id: 'aguardando_assessoria', label: '4-CRM Clientes Aguardando Assessoria', icon: <CheckSquare className="h-6 w-6 text-green-500" />, color: 'bg-green-600' },
    { id: 'assessoria_andamento', label: '5-CRM de Clientes Assessoria em Andamento', icon: <Plane className="h-6 w-6 text-blue-500" />, color: 'bg-blue-600' },
    { id: 'assessoria_finalizada', label: '6- CRM de Clientes Assessorias Finalizadas', icon: <Flag className="h-6 w-6" />, color: 'bg-slate-700' },
    { id: 'cancelado', label: '7-CRM de Clientes Cancelados/Desistiu', icon: <XCircle className="h-6 w-6 text-red-500" />, color: 'bg-red-600' },
];

/**
 * Lista de clientes unificada com Dashboard e Filtros de Etapa
 */
function DNAClientListView({
    clientes,
    onSelectClient
}: {
    clientes: ClientDNAData[]
    onSelectClient: (client: ClientDNAData) => void
}) {
    const [searchTerm, setSearchTerm] = useState('')
    const [filters, setFilters] = useState({
        id: '',
        nome: '',
        tipoServico: '',
        status: 'todos' as 'todos' | 'ativo' | 'inativo',
        prioridade: 'todos' as 'todos' | 'high' | 'medium' | 'low',
        prazos: 'todos' as 'todos' | 'critico' | 'normal'
    })

    // Categorias do DNA dinâmicas
    const dnaCategories: DNACategory[] = useMemo(() => 
        CATEGORIAS_LIST.map(cat => ({
            ...cat,
            count: clientes.filter(c => c.categoria === cat.id).length
        })), [clientes])

    const serviceTypes = useMemo(() => Array.from(new Set(clientes.map(c => c.tipoAssessoria))), [clientes])

    const highPriorityClients = useMemo(() => clientes.filter(c => 
        c.priority === 'high' || 
        (c.deadline && new Date(c.deadline) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
    ), [clientes])

    const filteredClientes = useMemo(() => clientes.filter(c => {
        const matchesSearch = 
            c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.id.toLowerCase().includes(searchTerm.toLowerCase())
        
        const matchesId = !filters.id || c.id.toLowerCase().includes(filters.id.toLowerCase())
        const matchesNome = !filters.nome || c.nome.toLowerCase().includes(filters.nome.toLowerCase())
        const matchesServico = filters.tipoServico === '' || c.tipoAssessoria === filters.tipoServico
        const matchesStatus = filters.status === 'todos' || (filters.status === 'ativo' ? c.contratoAtivo : !c.contratoAtivo)
        const matchesPriority = filters.prioridade === 'todos' || c.priority === filters.prioridade
        
        let matchesPrazo = true
        if (filters.prazos === 'critico') {
            matchesPrazo = !!(c.deadline && new Date(c.deadline) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
        }

        return matchesSearch && matchesId && matchesNome && matchesServico && matchesStatus && matchesPriority && matchesPrazo
    }), [clientes, searchTerm, filters])

    return (
        <div className="p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">DNA do Cliente</h1>
                        <p className="text-muted-foreground mt-1">Gestão centralizada e acompanhamento de etapas</p>
                    </div>
                </div>

                {/* Dashboard de Destaques */}
                

                {/* Área de Filtros Seletores (Sempre Visível) */}
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">ID Cliente</label>
                            <input
                                value={filters.id}
                                onChange={e => setFilters(f => ({ ...f, id: e.target.value }))}
                                placeholder="Ex: 001"
                                className="w-full bg-muted/30 border border-border px-3 py-2 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Nome</label>
                            <input
                                value={filters.nome}
                                onChange={e => setFilters(f => ({ ...f, nome: e.target.value }))}
                                placeholder="Filtrar por nome..."
                                className="w-full bg-muted/30 border border-border px-3 py-2 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Serviço</label>
                            <select
                                value={filters.tipoServico}
                                onChange={e => setFilters(f => ({ ...f, tipoServico: e.target.value }))}
                                className="w-full bg-muted/30 border border-border px-3 py-2 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer"
                            >
                                <option value="">Todos os Serviços</option>
                                {serviceTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Status</label>
                            <select
                                value={filters.status}
                                onChange={e => setFilters(f => ({ ...f, status: e.target.value as any }))}
                                className="w-full bg-muted/30 border border-border px-3 py-2 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer"
                            >
                                <option value="todos">Todos os Status</option>
                                <option value="ativo">Ativo</option>
                                <option value="inativo">Inativo</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Prioridade</label>
                            <select
                                value={filters.prioridade}
                                onChange={e => setFilters(f => ({ ...f, prioridade: e.target.value as any }))}
                                className="w-full bg-muted/30 border border-border px-3 py-2 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer"
                            >
                                <option value="todos">Todas</option>
                                <option value="high">Alta</option>
                                <option value="medium">Média</option>
                                <option value="low">Baixa</option>
                            </select>
                        </div>
                    </div>

                    {/* Barra de Pesquisa Integrada abaixo dos seletores */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground opacity-50" />
                        <input
                            type="text"
                            placeholder="Busca rápida universal..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-muted/50 border-2 border-transparent focus:border-primary/20 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 shadow-inner text-base"
                        />
                        {(searchTerm || filters.id || filters.nome || filters.tipoServico !== '' || filters.status !== 'todos' || filters.prioridade !== 'todos') && (
                            <button 
                                onClick={() => {
                                    setSearchTerm('')
                                    setFilters({ id: '', nome: '', tipoServico: '', status: 'todos', prioridade: 'todos', prazos: 'todos' })
                                }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-primary hover:underline"
                            >
                                Limpar Busca
                            </button>
                        )}
                    </div>
                </div>
                {highPriorityClients.length > 0 && (
                    <div className="bg-red-50/50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/10 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                            <h2 className="text-lg font-semibold text-red-900 dark:text-red-400">Destaques e Prazos Críticos</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {highPriorityClients.slice(0, 3).map(cliente => (
                                <button
                                    key={cliente.id}
                                    onClick={() => onSelectClient(cliente)}
                                    className="flex items-center gap-3 p-3 bg-card border border-red-200/50 dark:border-red-500/20 rounded-xl hover:shadow-md transition-all text-left group"
                                >
                                    <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center shrink-0">
                                        <Clock className="h-4 w-4 text-red-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-bold text-foreground truncate">{cliente.nome}</div>
                                        <div className="text-[10px] text-red-600 font-medium uppercase tracking-wider">
                                            Vence: {cliente.deadline ? new Date(cliente.deadline).toLocaleDateString('pt-BR') : 'Urgente'}
                                        </div>
                                    </div>
                                    <ArrowLeft className="h-4 w-4 text-red-400 rotate-180 group-hover:translate-x-1 transition-transform" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Lista de clientes */}
                <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                    <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b bg-muted/30 text-[10px] uppercase font-bold text-muted-foreground tracking-widest text-center">
                        <div className="col-span-1">ID</div>
                        <div className="col-span-3 text-left">Cliente</div>
                        <div className="col-span-3">Serviço / Etapa</div>
                        <div className="col-span-2">Previsão</div>
                        <div className="col-span-1">Status</div>
                        <div className="col-span-2">Ações</div>
                    </div>

                    {filteredClientes.length === 0 ? (
                        <div className="p-12 text-center text-center">
                            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
                            <p className="text-muted-foreground">Nenhum cliente encontrado com os critérios selecionados</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {filteredClientes.map((cliente) => (
                                <div
                                    key={cliente.id}
                                    className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-muted/30 transition-colors"
                                >
                                    <div className="col-span-1 text-center">
                                        <span className="text-xs font-mono text-muted-foreground">{cliente.id.replace('CLI-', '')}</span>
                                    </div>
                                    <div className="col-span-3 flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            <User className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-sm font-semibold text-foreground flex items-center gap-2">
                                                {cliente.nome}
                                                {cliente.priority === 'high' && (
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                                                )}
                                            </div>
                                            <div className="text-xs text-muted-foreground truncate">{cliente.email}</div>
                                        </div>
                                    </div>
                                    <div className="col-span-3 text-center">
                                        <div className="text-xs font-medium text-foreground">{cliente.tipoAssessoria}</div>
                                        <div className="text-[10px] text-muted-foreground">
                                            {CATEGORIAS_LIST.find(cat => cat.id === cliente.categoria)?.label.split('-')[1] || cliente.categoria}
                                        </div>
                                    </div>
                                    <div className="col-span-2 text-center text-xs font-medium text-foreground">
                                        {cliente.previsaoChegada || '---'}
                                    </div>
                                    <div className="col-span-1 text-center">
                                        <span className={cn(
                                            'text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider',
                                            cliente.contratoAtivo
                                                ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'
                                                : 'bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-400'
                                        )}>
                                            {cliente.contratoAtivo ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </div>
                                    <div className="col-span-2 flex justify-center">
                                        <button
                                            onClick={() => onSelectClient(cliente)}
                                            className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition shadow-sm"
                                        >
                                            Ver Detalhes
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

/**
 * Detalhes do cliente - Resumo e Notas
 */
function DNAClientDetailView({
    client,
    onBack
}: {
    client: ClientDNAData
    onBack: () => void
}) {
    const [copiedId, setCopiedId] = useState(false)
    const [noteStageId, setNoteStageId] = useState<string | null>(null)
    const [newNote, setNewNote] = useState('')
    const [notes, setNotes] = useState<ClientNote[]>(client.notes || [])
    const [expandedStages, setExpandedStages] = useState<Set<string>>(new Set([client.categoria]))

    const toggleStage = (stageId: string) => {
        const next = new Set(expandedStages)
        if (next.has(stageId)) next.delete(stageId)
        else next.add(stageId)
        setExpandedStages(next)
    }

    const handleCopyId = async () => {
        await navigator.clipboard.writeText(client.id)
        setCopiedId(true)
        setTimeout(() => setCopiedId(false), 2000)
    }

    const handleAddNote = (e: React.FormEvent, stageId?: string) => {
        e.preventDefault()
        if (!newNote.trim()) return

        const note: ClientNote = {
            id: Math.random().toString(36).substr(2, 9),
            text: newNote,
            author: 'Usuário Logado', // Simulado
            createdAt: new Date().toISOString(),
            stageId: stageId || noteStageId || undefined
        }

        setNotes([note, ...notes])
        setNewNote('')
        setNoteStageId(null)
    }

    const currentStageIndex = CATEGORIAS_LIST.findIndex(cat => cat.id === client.categoria)

    return (
        <div className="p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between bg-card p-6 border border-border rounded-2xl shadow-sm">
                    <div className="flex items-center gap-5">
                        <button
                            onClick={onBack}
                            className="p-3 hover:bg-muted rounded-xl transition-all border border-transparent hover:border-border"
                        >
                            <ArrowLeft className="h-6 w-6" />
                        </button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold text-foreground">{client.nome}</h1>
                                <span className={cn(
                                    'px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider',
                                    client.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                )}>
                                    {client.priority}
                                </span>
                            </div>
                            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1.5"><Mail className="h-4 w-4" /> {client.email}</span>
                                <span className="flex items-center gap-1.5"><Phone className="h-4 w-4" /> {client.telefone}</span>
                                <div className="flex items-center gap-2 bg-muted px-2 py-0.5 rounded font-mono text-xs">
                                    {client.id}
                                    <button onClick={handleCopyId} className="hover:text-primary transition-colors">
                                        {copiedId ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Linha do Tempo (Timeline) */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-card border border-border rounded-2xl p-8 relative">
                            <h3 className="text-xl font-bold text-foreground mb-8 flex items-center gap-3">
                                <History className="h-6 w-6 text-primary" />
                                Timeline do Processo
                            </h3>

                            <div className="space-y-0 relative ml-4">
                                {/* Linha vertical decorativa */}
                                <div className="absolute left-[15px] top-2 bottom-6 w-0.5 bg-border" />

                                {CATEGORIAS_LIST.map((stage, index) => {
                                    const isCurrent = stage.id === client.categoria
                                    const isCompleted = index < currentStageIndex
                                    const isFuture = index > currentStageIndex
                                    const stageNotes = notes.filter(n => n.stageId === stage.id)

                                    return (
                                        <div key={stage.id} className="relative pl-12 pb-10 group last:pb-0">
                                            {/* Dot / Indicator */}
                                            <div className={cn(
                                                "absolute left-0 top-1 w-8 h-8 rounded-full border-4 z-10 flex items-center justify-center transition-all",
                                                isCurrent ? "bg-primary border-primary-foreground shadow-[0_0_10px_rgba(var(--primary),0.5)] animate-pulse" : 
                                                isCompleted ? "bg-green-500 border-green-200" : "bg-muted border-card"
                                            )}>
                                                {isCompleted ? <Check className="h-4 w-4 text-white" /> : 
                                                 isCurrent ? <Clock className="h-4 w-4 text-white" /> : 
                                                 <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />}
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center justify-between">
                                                    <h4 className={cn(
                                                        "font-bold transition-colors",
                                                        isCurrent ? "text-primary text-lg" : 
                                                        isCompleted ? "text-foreground" : "text-muted-foreground"
                                                    )}>
                                                        {stage.label.split('-')[1] || stage.label}
                                                    </h4>
                                                    
                                                    <div className="flex items-center gap-2">
                                                        {stageNotes.length > 0 && (
                                                            <button 
                                                                onClick={() => toggleStage(stage.id)}
                                                                className={cn(
                                                                    "flex items-center gap-1 px-2 py-1 rounded-lg transition-all border border-transparent hover:bg-muted font-bold text-[10px]",
                                                                    expandedStages.has(stage.id) ? "text-primary bg-primary/5 border-primary/10" : "text-muted-foreground"
                                                                )}
                                                            >
                                                                <ChevronDown className={cn(
                                                                    "h-3.5 w-3.5 transition-transform duration-300",
                                                                    expandedStages.has(stage.id) && "rotate-180"
                                                                )} />
                                                                {stageNotes.length} {stageNotes.length === 1 ? 'Nota' : 'Notas'}
                                                            </button>
                                                        )}

                                                        <button 
                                                            onClick={() => setNoteStageId(stage.id === noteStageId ? null : stage.id)}
                                                            className="text-xs font-semibold text-primary hover:bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/20 transition-all flex items-center gap-1.5"
                                                        >
                                                            <FileText className="h-3.5 w-3.5" />
                                                            Adicionar Nota
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Form de Nota para esta etapa */}
                                                {noteStageId === stage.id && (
                                                    <form 
                                                        onSubmit={(e) => {
                                                            handleAddNote(e, stage.id)
                                                            if (!expandedStages.has(stage.id)) toggleStage(stage.id)
                                                        }}
                                                        className="mt-4 bg-muted/30 p-4 rounded-xl border border-primary/10 animate-in zoom-in-95 duration-200"
                                                    >
                                                        <textarea
                                                            autoFocus
                                                            value={newNote}
                                                            onChange={(e) => setNewNote(e.target.value)}
                                                            placeholder={`Detalhes para a etapa: ${stage.label}...`}
                                                            className="w-full bg-card border border-border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[80px] resize-none"
                                                        />
                                                        <div className="flex justify-end gap-2 mt-3">
                                                            <button 
                                                                type="button"
                                                                onClick={() => setNoteStageId(null)}
                                                                className="px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-muted rounded-lg"
                                                            >
                                                                Cancelar
                                                            </button>
                                                            <button 
                                                                type="submit"
                                                                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-bold hover:bg-primary/90 shadow-sm"
                                                            >
                                                                Salvar na Etapa
                                                            </button>
                                                        </div>
                                                    </form>
                                                )}

                                                {/* Notas desta etapa (Colapsáveis) */}
                                                {(stageNotes.length > 0 && expandedStages.has(stage.id)) && (
                                                    <div className="mt-3 space-y-3 animate-in slide-in-from-top-2 duration-300">
                                                        {stageNotes.map(note => (
                                                            <div key={note.id} className="bg-muted/30 border border-border/50 rounded-xl p-4 text-sm relative">
                                                                <div className="flex justify-between items-center mb-2 opacity-70">
                                                                    <span className="font-bold flex items-center gap-1.5"><User className="h-3 w-3" /> {note.author}</span>
                                                                    <span className="text-[10px]">{new Date(note.createdAt).toLocaleDateString('pt-BR')}</span>
                                                                </div>
                                                                <p className="text-foreground/90 leading-relaxed italic border-l-2 border-primary/20 pl-3">
                                                                    "{note.text}"
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Coluna Direita: Informações Extras */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-card border border-border rounded-2xl p-6 space-y-6 shadow-sm">
                            <div>
                                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">Informações do Serviço</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                                        <span className="text-xs text-muted-foreground">Tipo de Assessoria</span>
                                        <span className="text-sm font-bold text-primary">{client.tipoAssessoria}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                                        <span className="text-xs text-muted-foreground">Previsão de Chegada</span>
                                        <span className="text-sm font-bold">{client.previsaoChegada || '---'}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                                        <span className="text-xs text-muted-foreground">Contrato</span>
                                        <span className={cn(
                                            "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase",
                                            client.contratoAtivo ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"
                                        )}>
                                            {client.contratoAtivo ? 'Vigente' : 'Inativo'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-muted/50 rounded-xl border border-border">
                                <h4 className="text-xs font-bold text-foreground mb-3 flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4 text-amber-500" />
                                    Ações Recomendadas
                                </h4>
                                <div className="space-y-2">
                                    <button className="w-full text-left p-3 text-xs bg-card hover:bg-muted border border-border rounded-lg transition-colors flex justify-between items-center group">
                                        Solicitar Documentos
                                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                    <button className="w-full text-left p-3 text-xs bg-card hover:bg-muted border border-border rounded-lg transition-colors flex justify-between items-center group">
                                        Agendar Consultoria
                                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Notas Gerais (sem etapa) */}
                        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">Notas Gerais</h3>
                            <div className="space-y-3">
                                {notes.filter(n => !n.stageId).length === 0 ? (
                                    <p className="text-xs text-muted-foreground text-center py-4 italic">Nenhuma nota geral</p>
                                ) : (
                                    notes.filter(n => !n.stageId).map(note => (
                                        <div key={note.id} className="bg-muted/30 border border-border/50 rounded-xl p-3 text-xs">
                                            <p className="text-foreground/90">{note.text}</p>
                                            <div className="flex justify-between mt-2 opacity-50">
                                                <span>{note.author}</span>
                                                <span>{new Date(note.createdAt).toLocaleDateString('pt-BR')}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

/**
 * Componente principal - DNA do Cliente
 * Gerencia a navegação entre: Lista Unificada -> Detalhes
 */
type DNAView = 'list' | 'detail'

export function ClientDNAPage() {
    const [view, setView] = useState<DNAView>('list')
    const [selectedClient, setSelectedClient] = useState<ClientDNAData | null>(null)
    const [clientes, setClientes] = useState<ClientDNAData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchClientes = useCallback(async () => {
        try {
            setLoading(true)
            const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'
            const response = await fetch(`${baseUrl}/cliente/clientes`)
            const result = await response.json()

            if (result.data) {
                const mappedClientes: ClientDNAData[] = result.data.map((item: any) => ({
                    id: item.client_id || item.id,
                    nome: item.nome || 'Sem nome',
                    email: item.email || 'Sem e-mail',
                    telefone: item.whatsapp || '',
                    tipoAssessoria: 'Assessoria', // Poderia vir do backend se tivesse campo
                    contratoAtivo: item.status !== 'cancelado',
                    categoria: item.stage || (item.status === 'cadastrado' ? 'assessoria_andamento' : (item.status || 'formularios')),
                    previsaoChegada: item.previsao_chegada || '',
                    priority: 'medium',
                    notes: [],
                    historico: []
                }))
                setClientes(mappedClientes)
            }
            setError(null)
        } catch (err) {
            console.error('Erro ao buscar clientes:', err)
            setError('Falha ao carregar lista de clientes.')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchClientes()
    }, [fetchClientes])

    const handleSelectClient = (client: ClientDNAData) => {
        setSelectedClient(client)
        setView('detail')
    }

    const handleBackToList = () => {
        setSelectedClient(null)
        setView('list')
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="text-muted-foreground animate-pulse">Carregando DNA dos Clientes...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-8 text-center max-w-xl mx-auto">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-red-900 mb-2">Ops! Algo deu errado</h2>
                    <p className="text-red-700 mb-6">{error}</p>
                    <button 
                        onClick={fetchClientes}
                        className="bg-red-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-red-700 transition"
                    >
                        Tentar Novamente
                    </button>
                </div>
            </div>
        )
    }

    switch (view) {
        case 'list':
            return <DNAClientListView clientes={clientes} onSelectClient={handleSelectClient} />
        case 'detail':
            return (
                <DNAClientDetailView
                    client={selectedClient!}
                    onBack={handleBackToList}
                />
            )
    }
}

export default ClientDNAPage
