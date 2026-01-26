import { useState, useMemo } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { Button } from './ui/button'
import { ScrollArea } from '../../shared/components/ui/scroll-area'
import { Document, RequiredDocument } from '../types'
import { FileText, Upload, CheckCircle, AlertCircle, Trash2, Loader2, Filter } from 'lucide-react'
import { Badge } from './ui/badge'
import { formatDate } from '../lib/utils'

interface FamilyMemberModalProps {
    isOpen: boolean
    onClose: () => void
    member: { id: string, name: string, type: string }
    documents: Document[]
    requiredDocuments: RequiredDocument[]
    onUpload: (file: File, documentType: string, memberId: string) => Promise<void>
    onDelete: (documentId: string) => void
}

const statusConfig = {
    pending: { label: 'Pendente', color: 'text-gray-600', bg: 'bg-gray-100', badge: 'secondary' as const },
    analyzing: { label: 'Em Análise', color: 'text-yellow-600', bg: 'bg-yellow-100', badge: 'warning' as const },
    approved: { label: 'Aprovado', color: 'text-green-600', bg: 'bg-green-100', badge: 'success' as const },
    rejected: { label: 'Rejeitado', color: 'text-red-600', bg: 'bg-red-100', badge: 'destructive' as const },
    sent_for_apostille: { label: 'Enviado p/ Apostila', color: 'text-purple-600', bg: 'bg-purple-100', badge: 'secondary' as const },
}

export function FamilyMemberModal({
    isOpen,
    onClose,
    member,
    documents,
    requiredDocuments,
    onUpload,
    onDelete
}: FamilyMemberModalProps) {
    const [uploadingType, setUploadingType] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<'todos' | 'action_required' | 'analyzing' | 'approved'>('todos')

    // Filter documents for this member
    const memberDocs = useMemo(() => documents.filter(d => d.memberId === member.id), [documents, member.id])

    // Calculate Stats
    const stats = useMemo(() => {
        const rejected = memberDocs.filter(d => d.status === 'rejected').length
        const analyzing = memberDocs.filter(d => d.status === 'analyzing').length
        const approved = memberDocs.filter(d => d.status === 'approved').length
        const totalRequired = requiredDocuments.length
        // Pending = not in memberDocs (if required) or status pending
        // Ideally we check if required doc is missing in memberDocs
        const sentTypes = memberDocs.map(d => d.type)
        const missingCount = requiredDocuments.filter(req => !sentTypes.includes(req.type)).length
        const pendingTotal = missingCount + memberDocs.filter(d => d.status === 'pending').length

        return { rejected, analyzing, approved, pendingTotal, totalRequired }
    }, [memberDocs, requiredDocuments])

    // Helper to find document for this member and type
    const getDocument = (type: string) => {
        return memberDocs.find(doc => doc.type === type)
    }

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            setUploadingType(type)
            await onUpload(file, type, member.id)
        } catch (error) {
            console.error("Upload failed", error)
        } finally {
            setUploadingType(null)
            e.target.value = ''
        }
    }

    // Filter Logic
    const filteredRequiredDocs = requiredDocuments.filter(reqDoc => {
        const doc = getDocument(reqDoc.type)

        if ((activeTab as string) === 'todos') return true

        if ((activeTab as string) === 'pendentes') {
            return !doc || doc.status === 'pending'
        }

        if ((activeTab as string) === 'analyzing') {
            return doc?.status === 'analyzing' || doc?.status === 'sent_for_apostille'
        }

        if ((activeTab as string) === 'rejected') {
            return doc?.status === 'rejected'
        }

        if ((activeTab as string) === 'apostille') {
            // Approved but NOT apostilled
            return doc?.status === 'approved' && !doc.isApostilled
        }

        if ((activeTab as string) === 'translation') {
            // Approved AND apostilled but NOT translated
            return doc?.status === 'approved' && doc.isApostilled && !doc.isTranslated
        }

        if ((activeTab as string) === 'approved') {
            // Approved AND apostilled AND translated (Completed)
            return doc?.status === 'approved' && doc.isApostilled && doc.isTranslated
        }

        return true
    })

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[900px]">
                <DialogHeader className="border-b pb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <DialogTitle className="text-xl">Documentos: {member.name}</DialogTitle>
                            <DialogDescription>
                                Gestão de documentos para {member.type}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {/* Dashboard Header */}
                <div className="flex gap-4 py-2 overflow-x-auto pb-4">
                    <div className="min-w-[140px] bg-gray-50 dark:bg-gray-900/10 p-3 rounded-lg border border-gray-200 dark:border-gray-900/20">
                        <p className="text-xs text-gray-600 uppercase font-bold flex items-center gap-1">
                            Pendentes
                        </p>
                        <p className="text-2xl font-bold text-gray-700 dark:text-gray-400">{stats.pendingTotal}</p>
                    </div>
                    <div className="min-w-[140px] bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded-lg border border-yellow-100 dark:border-yellow-900/20">
                        <p className="text-xs text-yellow-600 uppercase font-bold">Em Análise</p>
                        <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">{stats.analyzing}</p>
                    </div>
                    <div className="min-w-[140px] bg-red-50 dark:bg-red-900/10 p-3 rounded-lg border border-red-100 dark:border-red-900/20">
                        <p className="text-xs text-red-600 uppercase font-bold flex items-center gap-1">
                            Rejeitados
                        </p>
                        <p className="text-2xl font-bold text-red-700 dark:text-red-400">{stats.rejected}</p>
                    </div>
                    <div className="min-w-[140px] bg-amber-50 dark:bg-amber-900/10 p-3 rounded-lg border border-amber-100 dark:border-amber-900/20">
                        <p className="text-xs text-amber-600 uppercase font-bold">Para Apostilar</p>
                        <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">{stats.toApostille}</p>
                    </div>
                    <div className="min-w-[140px] bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg border border-blue-100 dark:border-blue-900/20">
                        <p className="text-xs text-blue-600 uppercase font-bold">Para Traduzir</p>
                        <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{stats.toTranslate}</p>
                    </div>
                    <div className="min-w-[140px] bg-green-50 dark:bg-green-900/10 p-3 rounded-lg border border-green-100 dark:border-green-900/20">
                        <p className="text-xs text-green-600 uppercase font-bold">Aprovados</p>
                        <p className="text-2xl font-bold text-green-700 dark:text-green-400">{stats.completed}</p>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-2 mb-2 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('todos')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${activeTab === 'todos' ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'}`}
                    >
                        Todos
                    </button>
                    <button
                        onClick={() => setActiveTab('pendentes')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${activeTab === 'pendentes' ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Pendentes
                        <span className="ml-2 bg-gray-200 text-gray-700 text-[10px] px-1.5 rounded-full">{stats.pendingTotal}</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('analyzing')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${activeTab === 'analyzing' ? 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' : 'text-gray-500 hover:text-yellow-600'}`}
                    >
                        Em Análise
                        <span className="ml-2 bg-yellow-100 text-yellow-700 text-[10px] px-1.5 rounded-full">{stats.analyzing}</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('rejected')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${activeTab === 'rejected' ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400' : 'text-gray-500 hover:text-red-600'}`}
                    >
                        Rejeitados
                        {stats.rejected > 0 && <span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 rounded-full">{stats.rejected}</span>}
                    </button>
                    <button
                        onClick={() => setActiveTab('apostille')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${activeTab === 'apostille' ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400' : 'text-gray-500 hover:text-amber-600'}`}
                    >
                        Para Apostilar
                        {stats.toApostille > 0 && <span className="ml-2 bg-amber-100 text-amber-700 text-[10px] px-1.5 rounded-full">{stats.toApostille}</span>}
                    </button>
                    <button
                        onClick={() => setActiveTab('translation')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${activeTab === 'translation' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' : 'text-gray-500 hover:text-blue-600'}`}
                    >
                        Para Traduzir
                        {stats.toTranslate > 0 && <span className="ml-2 bg-blue-100 text-blue-700 text-[10px] px-1.5 rounded-full">{stats.toTranslate}</span>}
                    </button>
                    <button
                        onClick={() => setActiveTab('approved')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${activeTab === 'approved' ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'text-gray-500 hover:text-green-600'}`}
                    >
                        Aprovados
                        <span className="ml-2 bg-green-100 text-green-700 text-[10px] px-1.5 rounded-full">{stats.completed}</span>
                    </button>
                </div>

                <div className="py-2">
                    <ScrollArea className="h-[350px] pr-4">
                        <div className="space-y-3">
                            {filteredRequiredDocs.length === 0 ? (
                                <div className="text-center py-10 text-gray-400 text-sm">
                                    Nenhum documento encontrado neste filtro.
                                </div>
                            ) : (
                                filteredRequiredDocs.map((reqDoc) => {
                                    const uploadedDoc = getDocument(reqDoc.type)
                                    const status = uploadedDoc ? statusConfig[uploadedDoc.status] : statusConfig.pending
                                    const inputId = `file-upload-${member.id}-${reqDoc.type}`
                                    const isUploading = uploadingType === reqDoc.type
                                    const isRejected = uploadedDoc?.status === 'rejected'

                                    return (
                                        <div
                                            key={reqDoc.type}
                                            className={`
                                                relative p-4 rounded-lg border transition-all
                                                ${isRejected
                                                    ? 'border-red-200 bg-red-50/20 dark:border-red-900/50 dark:bg-red-900/5'
                                                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                                }
                                            `}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 min-w-0 mr-4">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className={`font-medium text-sm ${isRejected ? 'text-red-700 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                                                            {reqDoc.name}
                                                        </h4>
                                                        {reqDoc.required && !uploadedDoc && <Badge variant="secondary" className="text-[10px] h-5">Obrigatório</Badge>}
                                                    </div>

                                                    <p className="text-xs text-gray-500 mb-2 truncate">
                                                        {reqDoc.description}
                                                    </p>

                                                    {uploadedDoc && (
                                                        <div className="flex items-center gap-2 text-xs text-gray-500 bg-white dark:bg-black/20 p-1.5 rounded inline-block">
                                                            <FileText className="h-3 w-3" />
                                                            <span className="truncate max-w-[150px] font-mono">{uploadedDoc.fileName}</span>
                                                            <span className="text-gray-300">|</span>
                                                            <span>{formatDate(uploadedDoc.uploadDate)}</span>
                                                        </div>
                                                    )}

                                                    {/* Rejection Reason Box */}
                                                    {isRejected && (
                                                        <div className="mt-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 text-xs p-3 rounded-md flex items-start gap-2">
                                                            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                                                            <div>
                                                                <span className="font-bold block mb-0.5">Motivo da recusa:</span>
                                                                {uploadedDoc.rejectionReason}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex flex-col items-end gap-2">
                                                    {/* Status Badge */}
                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide
                                                        ${uploadedDoc ? status.bg + ' ' + status.color : 'bg-gray-100 text-gray-500'}
                                                    `}>
                                                        {status.label}
                                                    </span>

                                                    {/* Action Button */}
                                                    <div className="mt-1">
                                                        <input
                                                            type="file"
                                                            id={inputId}
                                                            className="hidden"
                                                            onChange={(e) => handleFileSelect(e, reqDoc.type)}
                                                            disabled={isUploading || uploadedDoc?.status === 'approved'}
                                                        />

                                                        {(!uploadedDoc || uploadedDoc.status === 'rejected' || uploadedDoc.status === 'pending') && (
                                                            <Button
                                                                size="sm"
                                                                className={`
                                                                    h-8 text-xs gap-1.5 shadow-sm
                                                                    ${isRejected
                                                                        ? 'bg-red-600 hover:bg-red-700 text-white w-full'
                                                                        : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300'
                                                                    }
                                                                `}
                                                                onClick={() => document.getElementById(inputId)?.click()}
                                                                disabled={isUploading}
                                                            >
                                                                {isUploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
                                                                {isRejected ? 'Corrigir Agora' : (uploadedDoc ? 'Reenviar' : 'Enviar Arquivo')}
                                                            </Button>
                                                        )}

                                                        {uploadedDoc && uploadedDoc.status !== 'approved' && uploadedDoc.status !== 'analyzing' && uploadedDoc.status !== 'sent_for_apostille' && !isRejected && (
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 ml-1"
                                                                onClick={() => onDelete(uploadedDoc.id)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        )}

                                                        {uploadedDoc?.status === 'approved' && (
                                                            <div className="flex flex-col items-end gap-1">
                                                                {!uploadedDoc.isApostilled ? (
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        className="h-7 text-[10px] bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:text-amber-800"
                                                                        onClick={() => console.log('Solicitar Apostilamento', uploadedDoc.id)}
                                                                    >
                                                                        Solicitar Apostilamento
                                                                    </Button>
                                                                ) : !uploadedDoc.isTranslated ? (
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-[10px] text-green-600 font-medium flex items-center gap-0.5">
                                                                            <CheckCircle className="h-3 w-3" /> Apostilado
                                                                        </span>
                                                                        <Button
                                                                            size="sm"
                                                                            variant="outline"
                                                                            className="h-7 text-[10px] bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:text-blue-800"
                                                                            onClick={() => console.log('Solicitar Tradução', uploadedDoc.id)}
                                                                        >
                                                                            Solicitar Tradução
                                                                        </Button>
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex flex-col items-end">
                                                                        <div className="flex items-center gap-1 text-green-600 text-xs font-medium px-2 py-0.5">
                                                                            <CheckCircle className="h-4 w-4" />
                                                                            <span>Verificado</span>
                                                                        </div>
                                                                        <span className="text-[9px] text-gray-400">Apostilado & Traduzido</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    )
}
