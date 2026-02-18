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
import { Textarea } from './ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select';
import { ClipboardCheck, Loader2 } from 'lucide-react';
import { requestRequirement } from '../services/juridicoService';
import { toast } from './ui/sonner';

interface RequirementRequestModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    clienteId: string;
    processoId?: string;
    onSuccess?: () => void;
}

const REQUIREMENT_TYPES = [
    { value: 'apostilamento', label: 'Apostilamento' },
    { value: 'traducao_juramentada', label: 'Tradução Juramentada' },
    { value: 'retificacao', label: 'Retificação de Certidão' },
    { value: 'busca_documento', label: 'Busca de Documento na Itália' },
    { value: 'cnn', label: 'Certidão Negativa de Naturalização (CNN)' },
    { value: 'outro', label: 'Outro' },
];

export function RequirementRequestModal({
    isOpen,
    onOpenChange,
    clienteId,
    processoId,
    onSuccess
}: RequirementRequestModalProps) {
    const [tipo, setTipo] = useState<string>('');
    const [outroTipo, setOutroTipo] = useState<string>('');
    const [observacoes, setObservacoes] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const tipoFinal = tipo === 'outro' ? outroTipo : REQUIREMENT_TYPES.find(t => t.value === tipo)?.label || tipo;
        
        if (!tipoFinal) {
            toast.error('Selecione ou informe o tipo de requerimento');
            return;
        }

        try {
            setIsSubmitting(true);
            await requestRequirement({
                clienteId,
                tipo: tipoFinal,
                processoId,
                observacoes
            });
            
            toast.success('Solicitação de requerimento criada com sucesso!');
            onOpenChange(false);
            if (onSuccess) onSuccess();
            
            // Reset form
            setTipo('');
            setOutroTipo('');
            setObservacoes('');
        } catch (error) {
            console.error('Erro ao solicitar requerimento:', error);
            toast.error('Falha ao criar solicitação de requerimento');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <ClipboardCheck className="h-5 w-5 text-purple-600" />
                            Solicitar Requerimento
                        </DialogTitle>
                        <DialogDescription>
                            Selecione o tipo de requerimento necessário para este processo. Isso será enviado ao backend para processamento.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="tipo">Tipo de Requerimento</Label>
                            <Select value={tipo} onValueChange={setTipo}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o tipo..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {REQUIREMENT_TYPES.map((req) => (
                                        <SelectItem key={req.value} value={req.value}>
                                            {req.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {tipo === 'outro' && (
                            <div className="grid gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                                <Label htmlFor="outro">Especifique o tipo</Label>
                                <Input 
                                    id="outro" 
                                    placeholder="Ex: Assinatura de documento X" 
                                    value={outroTipo}
                                    onChange={(e) => setOutroTipo(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        )}

                        <div className="grid gap-2">
                            <Label htmlFor="observacoes">Observações (Opcional)</Label>
                            <Textarea 
                                id="observacoes"
                                placeholder="Detalhes adicionais sobre o requerimento..."
                                value={observacoes}
                                onChange={(e) => setObservacoes(e.target.value)}
                                className="min-h-[100px]"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="bg-purple-600 hover:bg-purple-700 text-white">
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Enviando...
                                </>
                            ) : (
                                'Confirmar Solicitação'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
