import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from './ui/dialog';
import { Button } from '@/components/ui/Button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select';
import { 
    ClipboardCheck, 
    Loader2, 
    Plus, 
    Trash2, 
    FileText, 
    User,
    ChevronRight
} from 'lucide-react';
import { requestRequirement, requestDocument } from '../services/juridicoService';
import { toast } from './ui/sonner';
import { ScrollArea } from './ui/scroll-area';

interface RequirementRequestModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    clienteId: string;
    processoId?: string;
    members?: { id: string, name: string, type: string, isTitular: boolean }[];
    onSuccess?: () => void;
}

const REQUIREMENT_TYPES = [
    { value: 'apostilamento', label: 'Apostilamento' },
    { value: 'traducao_juramentada', label: 'Tradução Juramentada' },
    { value: 'buscas_certidao', label: 'Buscas de Certidão' },
    { value: 'montagem_pasta', label: 'Montagem de Pasta' },
    { value: 'outro', label: 'Outro' },
];

const DOCUMENT_TYPES = [
    { value: 'passaporte', label: 'Passaporte' },
    { value: 'rg', label: 'RG / Identidade' },
    { value: 'certidao_nascimento', label: 'Certidão de Nascimento' },
    { value: 'certidao_casamento', label: 'Certidão de Casamento' },
    { value: 'comprovante_residencia', label: 'Comprovante de Residência' },
    { value: 'outro', label: 'Outro' },
];

export function RequirementRequestModal({
    isOpen,
    onOpenChange,
    clienteId,
    processoId,
    members = [],
    onSuccess
}: RequirementRequestModalProps) {
    const [tipo, setTipo] = useState<string>('');
    const [nomeExtra, setNomeExtra] = useState<string>('');
    const [observacoes, setObservacoes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // List of documents to request within this requirement
    const [documentsToRequest, setDocumentsToRequest] = useState<{ id: string, type: string, memberId: string }[]>([]);
    const [newDocType, setNewDocType] = useState('');
    const [newDocMemberId, setNewDocMemberId] = useState(members.find(m => m.isTitular)?.id || clienteId);

    const handleAddDocument = () => {
        if (!newDocType) {
            toast.error('Selecione o tipo de documento');
            return;
        }
        
        const docLabel = DOCUMENT_TYPES.find(d => d.value === newDocType)?.label || newDocType;
        const memberName = members.find(m => m.id === newDocMemberId)?.name || 'Membro';

        setDocumentsToRequest([
            ...documentsToRequest,
            { id: Math.random().toString(36).substr(2, 9), type: docLabel, memberId: newDocMemberId }
        ]);
        setNewDocType('');
    };

    const handleRemoveDocument = (id: string) => {
        setDocumentsToRequest(documentsToRequest.filter(d => d.id !== id));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!tipo) {
            toast.error('Selecione o tipo de requerimento');
            return;
        }

        try {
            setIsSubmitting(true);
            
            const reqLabel = REQUIREMENT_TYPES.find(r => r.value === tipo)?.label || tipo;
            const finalNome = nomeExtra ? `${reqLabel}: ${nomeExtra}` : reqLabel;

            // 1. Create Requirement Entity
            const reqResponse = await requestRequirement({
                clienteId,
                tipo: finalNome,
                processoId,
                observacoes: observacoes || undefined
            });

            const requirementId = reqResponse.data?.id;

            // 2. Create associated Document Requests
            if (documentsToRequest.length > 0 && requirementId) {
                const docPromises = documentsToRequest.map(doc => 
                    requestDocument({
                        clienteId,
                        tipo: doc.type,
                        processoId,
                        membroId: doc.memberId,
                        requerimentoId: requirementId,
                        notificar: true,
                        prazo: 7
                    })
                );
                await Promise.all(docPromises);
            }
            
            toast.success('Requerimento e solicitações criados com sucesso!');
            onOpenChange(false);
            if (onSuccess) onSuccess();
            
            // Reset form
            setTipo('');
            setNomeExtra('');
            setObservacoes('');
            setDocumentsToRequest([]);
        } catch (error) {
            console.error('Erro ao solicitar requerimento:', error);
            toast.error('Falha ao criar requerimento');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl bg-background">
                <form onSubmit={handleSubmit} className="flex flex-col max-h-[90vh]">
                    <DialogHeader className="p-8 bg-gradient-to-br from-purple-600/10 to-blue-600/5 border-b border-border/50">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-border/50">
                                <ClipboardCheck className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-black tracking-tight text-foreground">
                                    Novo Requerimento
                                </DialogTitle>
                                <DialogDescription className="text-muted-foreground font-medium">
                                    Crie um container de requerimento e anexe solicitações de documentos.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    
                    <ScrollArea className="flex-1 p-8">
                        <div className="grid gap-8">
                            {/* Main Info Section */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                        <ChevronRight className="h-3 w-3 text-purple-500" />
                                        Espécie de Requerimento
                                    </Label>
                                    <Select value={tipo} onValueChange={setTipo}>
                                        <SelectTrigger className="h-12 rounded-xl bg-muted/30 border-none shadow-inner ring-offset-background focus:ring-2 focus:ring-purple-500">
                                            <SelectValue placeholder="Selecione o tipo..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {REQUIREMENT_TYPES.map((req) => (
                                                <SelectItem key={req.value} value={req.value} className="rounded-lg">
                                                    {req.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                        <ChevronRight className="h-3 w-3 text-purple-500" />
                                        Identificador (Nome)
                                    </Label>
                                    <Input 
                                        placeholder="Ex: Pasta Itália 2024" 
                                        value={nomeExtra}
                                        onChange={(e) => setNomeExtra(e.target.value)}
                                        className="h-12 rounded-xl bg-muted/30 border-none shadow-inner focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                            </div>

                            {/* Document Request Section */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                        <FileText className="h-3 w-3 text-blue-500" />
                                        Solicitações Acopladas ({documentsToRequest.length})
                                    </Label>
                                </div>

                                <div className="bg-muted/30 border border-dashed border-border p-4 rounded-2xl">
                                    <div className="flex gap-2">
                                        <div className="w-[180px]">
                                            <Select value={newDocMemberId} onValueChange={setNewDocMemberId}>
                                                <SelectTrigger className="h-10 rounded-lg text-xs bg-white border-border/50">
                                                    <SelectValue placeholder="Membro..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {members.map(m => (
                                                        <SelectItem key={m.id} value={m.id} className="text-xs">
                                                            {m.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="flex-1">
                                            <Select value={newDocType} onValueChange={setNewDocType}>
                                                <SelectTrigger className="h-10 rounded-lg text-xs bg-white border-border/50">
                                                    <SelectValue placeholder="Documento a solicitar..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {DOCUMENT_TYPES.map(d => (
                                                        <SelectItem key={d.value} value={d.value} className="text-xs">
                                                            {d.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <Button 
                                            type="button" 
                                            size="sm" 
                                            onClick={handleAddDocument}
                                            className="h-10 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/10"
                                        >
                                            <Plus className="h-4 w-4 mr-1" /> Add
                                        </Button>
                                    </div>

                                    {documentsToRequest.length > 0 && (
                                        <div className="mt-4 space-y-2">
                                            {documentsToRequest.map((doc) => {
                                                const m = members.find(m => m.id === doc.memberId);
                                                return (
                                                    <div 
                                                        key={doc.id} 
                                                        className="flex items-center justify-between p-3 bg-card rounded-xl border border-border animate-in slide-in-from-left-2"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
                                                                <FileText className="h-3.5 w-3.5" />
                                                            </div>
                                                            <div className="flex flex-col text-left">
                                                                <span className="text-xs font-bold leading-none">{doc.type}</span>
                                                                <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                                                                    <User className="h-2 w-2" />
                                                                    {m?.name} ({m?.type})
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <Button 
                                                            type="button" 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            onClick={() => handleRemoveDocument(doc.id)}
                                                            className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <ChevronRight className="h-3 w-3 text-purple-500" />
                                    Observações Adicionais
                                </Label>
                                <Input 
                                    placeholder="Instruções para a equipe técnica..." 
                                    value={observacoes}
                                    onChange={(e) => setObservacoes(e.target.value)}
                                    className="h-12 rounded-xl bg-muted/30 border-none shadow-inner focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                        </div>
                    </ScrollArea>

                    <DialogFooter className="p-8 bg-muted/10 border-t border-border/50">
                        <div className="flex items-center justify-between w-full">
                            <Button 
                                type="button" 
                                variant="ghost" 
                                onClick={() => onOpenChange(false)}
                                disabled={isSubmitting}
                                className="rounded-xl px-6 font-bold text-muted-foreground hover:bg-muted"
                            >
                                Cancelar
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={isSubmitting || !tipo}
                                className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-10 shadow-xl shadow-purple-500/20 py-6 transition-all active:scale-95 disabled:grayscale"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                                        Processando...
                                    </>
                                ) : (
                                    <>
                                        <ClipboardCheck className="mr-2 h-5 w-5" />
                                        Criar Requerimento
                                    </>
                                )}
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
