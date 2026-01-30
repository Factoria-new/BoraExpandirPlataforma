import { useState } from 'react';
import { 
  ArrowLeft, 
  Download, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  FileText, 
  ChevronRight,
  Eye,
  Send,
  Stamp,
  Languages,
  Loader2
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from '../../../components/ui/Badge';
import { Card } from '../../cliente/components/ui/card';
import { cn } from '../../cliente/lib/utils';
import { ScrollArea } from './ui/scroll-area';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';

// Tipos para o fluxo de análise
export type AnalysisStage = 'initial_analysis' | 'apostille_check' | 'translation_check' | 'completed';

export interface JuridicoDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  status: 'analyzing' | 'rejected' | 'waiting_apostille' | 'analyzing_apostille' | 'waiting_translation' | 'analyzing_translation' | 'approved';
  currentStage: AnalysisStage;
  // ... rest of interface
  uploadDate: string;
  history: {
    stage: AnalysisStage;
    status: 'pending' | 'approved' | 'rejected' | 'skipped';
    date?: string;
    notes?: string;
  }[];
}

interface ProcessAnalysisProps {
  clientName: string;
  memberName: string;
  documents: JuridicoDocument[];
  onBack: () => void;
  onUpdateDocument: (docId: string, updates: Partial<JuridicoDocument>) => void;
}

const STAGES = [
  { id: 'initial_analysis', label: 'Análise Técnica', icon: Eye },
  { id: 'apostille_check', label: 'Apostilamento', icon: Stamp },
  { id: 'translation_check', label: 'Tradução', icon: Languages },
];

export function ProcessAnalysis({ 
  clientName, 
  memberName, 
  documents: initialDocs, 
  onBack,
  onUpdateDocument 
}: ProcessAnalysisProps) {
  const [selectedDocId, setSelectedDocId] = useState<string>(initialDocs[0]?.id);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [customReason, setCustomReason] = useState<string>('');
  
  const selectedDoc = initialDocs.find(d => d.id === selectedDocId) || initialDocs[0];

  const PREDEFINED_REASONS = [
    { value: 'ilegivel', label: 'Documento Ilegível' },
    { value: 'invalido', label: 'Documento Inválido/Expirado' },
    { value: 'incompleto', label: 'Documento Incompleto' },
    { value: 'errado', label: 'Documento Incorreto (Outro tipo enviado)' },
    { value: 'outros', label: 'Outros (Especificar)' }
  ];

  const handleConfirmRejection = () => {
    if (!selectedDoc) return;
    
    const finalReason = rejectionReason === 'outros' ? customReason : PREDEFINED_REASONS.find(r => r.value === rejectionReason)?.label;

    onUpdateDocument(selectedDoc.id, {
        status: 'rejected',
        currentStage: 'initial_analysis',
        // In a real app we would save the rejection reason in history or a field
        // reason: finalReason
    });
    setRejectModalOpen(false);
    setRejectionReason('');
    setCustomReason('');
  };

  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const confirmApproval = async () => {
      if (!selectedDoc) return;
      setIsUpdatingStatus(true);
      
      let updates: Partial<JuridicoDocument> = {};
      
      if (selectedDoc.currentStage === 'initial_analysis') {
        updates = { 
            currentStage: 'apostille_check',
            status: 'waiting_apostille' 
        };
      } else if (selectedDoc.currentStage === 'apostille_check') {
        updates = { 
            currentStage: 'translation_check',
            status: 'waiting_translation'
        };
      } else if (selectedDoc.currentStage === 'translation_check') {
        updates = { 
          currentStage: 'completed', 
          status: 'approved' 
        };
      }

      await onUpdateDocument(selectedDoc.id, updates);
      setIsUpdatingStatus(false);
      setApproveModalOpen(false);
  };

  const handleAction = (action: 'reject' | 'request_action' | 'next') => {
    if (!selectedDoc) return;

    if (action === 'reject') {
      setRejectModalOpen(true);
    } 
    else if (action === 'next') {
      setApproveModalOpen(true);
    } 
    else if (action === 'request_action') {
      let updates: Partial<JuridicoDocument> = {};
      // Solicitar ação da etapa (meio)
      if (selectedDoc.currentStage === 'apostille_check') {
        updates = { status: 'waiting_apostille' };
        // Notifica cliente para apostilar
      } else if (selectedDoc.currentStage === 'translation_check') {
        updates = { status: 'waiting_translation' };
        // Notifica cliente para traduzir
      }
      onUpdateDocument(selectedDoc.id, updates);
    }
  };

  const getStageIndex = (stage: AnalysisStage) => {
    if (stage === 'completed') return 3;
    return STAGES.findIndex(s => s.id === stage);
  };

  const currentStageIndex = selectedDoc ? getStageIndex(selectedDoc.currentStage) : 0;

  return (
    <>
    <div className="flex flex-col h-[calc(100vh-3rem)] border rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-900 shadow-sm">
      {/* Top Navigation */}
      <div className="h-14 border-b bg-white dark:bg-gray-800 flex items-center px-4 justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              {memberName}
            </h1>
            <p className="text-xs text-gray-500">
              Processo de {clientName}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Document List */}
        <div className="w-80 border-r bg-white dark:bg-gray-800 flex flex-col shrink-0">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Documentos</h2>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-3 space-y-2">
              {initialDocs.map(doc => (
                <div 
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  className={cn(
                    "p-3 rounded-lg cursor-pointer transition-all border text-sm",
                    selectedDocId === doc.id 
                      ? "bg-blue-50 border-blue-200 shadow-sm ring-1 ring-blue-200 dark:bg-blue-900/20 dark:border-blue-800" 
                      : "hover:bg-gray-50 border-transparent hover:border-gray-200 dark:hover:bg-gray-700/50"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <FileText className={cn(
                      "h-5 w-5 mt-0.5",
                      selectedDocId === doc.id ? "text-blue-600" : "text-gray-400"
                    )} />
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "font-medium truncate",
                        selectedDocId === doc.id ? "text-blue-900 dark:text-blue-100" : "text-gray-700 dark:text-gray-300"
                      )}>
                        {doc.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 capitalize">
                        Status: {doc.status.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Main Content - Review Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-gray-100 dark:bg-gray-900/50">
          {selectedDoc ? (
            <>
              {/* Document Header & Progress */}
              <div className="bg-white dark:bg-gray-800 p-6 border-b shrink-0 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedDoc.name}</h2>
                        <p className="text-sm text-gray-500">Enviado em {selectedDoc.uploadDate}</p>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                        <Download className="h-4 w-4" />
                        Download Original
                    </Button>
                </div>

                {/* Progress Bar */}
                <div className="relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 -z-0 rounded-full" />
                    <div 
                        className="absolute top-1/2 left-0 h-1 bg-green-500 -z-0 rounded-full transition-all duration-500" 
                        style={{ width: `${(currentStageIndex / (STAGES.length - 1)) * 100}%` }}
                    />
                    
                    <div className="flex justify-between relative z-10">
                        {STAGES.map((stage, idx) => {
                            const isCompleted = idx < currentStageIndex || selectedDoc.currentStage === 'completed';
                            const isCurrent = idx === currentStageIndex && selectedDoc.currentStage !== 'completed';
                            const Icon = stage.icon;

                            return (
                                <div key={stage.id} className="flex flex-col items-center gap-2">
                                    <div className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 bg-white dark:bg-gray-800",
                                        isCompleted ? "border-green-500 text-green-500 bg-green-50 dark:bg-green-900/20" :
                                        isCurrent ? "border-blue-500 text-blue-500 ring-4 ring-blue-100 dark:ring-blue-900/30 scale-110" :
                                        "border-gray-300 text-gray-300"
                                    )}>
                                        {isCompleted ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                                    </div>
                                    <span className={cn(
                                        "text-xs font-semibold uppercase tracking-wider",
                                        isCompleted ? "text-green-600" :
                                        isCurrent ? "text-blue-600" :
                                        "text-gray-400"
                                    )}>
                                        {stage.label}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>
              </div>

              {/* Document Preview (Mock) */}
              <div className="flex-1 p-6 overflow-hidden flex items-center justify-center">
                <div className="w-full h-full max-w-4xl bg-white dark:bg-gray-800 shadow-xl rounded-xl border flex flex-col items-center justify-center text-gray-400">
                    <FileText className="h-24 w-24 mb-4 opacity-20" />
                    <p>Visualização do Documento</p>
                    <p className="text-sm opacity-60">(Integração com visualizador de PDF aqui)</p>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 bg-white dark:bg-gray-800 border-t flex items-center justify-between gap-4 shrink-0">
                <Button 
                    variant="destructive" 
                    className="flex-1 h-12 text-base shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
                    onClick={() => handleAction('reject')}
                    disabled={selectedDoc.currentStage === 'completed'}
                >
                    <XCircle className="w-5 h-5 mr-2" />
                    Rejeitar Documento
                </Button>

                <Button 
                    variant="secondary"
                    className="flex-1 h-12 text-base border-2 bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-700 dark:bg-gray-700 dark:text-white dark:border-gray-600 active:scale-[0.98]"
                    onClick={() => handleAction('request_action')}
                    disabled={selectedDoc.currentStage === 'initial_analysis' || selectedDoc.currentStage === 'completed'}
                >
                    <AlertCircle className="w-5 h-5 mr-2" />
                    {selectedDoc.currentStage === 'apostille_check' ? 'Solicitar Apostilamento' :
                     selectedDoc.currentStage === 'translation_check' ? 'Solicitar Tradução' :
                     'Solicitar Ação'}
                </Button>

                <Button 
                    className="flex-1 h-12 text-base bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-green-200 dark:hover:shadow-none active:scale-[0.98]"
                    onClick={() => handleAction('next')}
                    disabled={selectedDoc.currentStage === 'completed'}
                >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    {selectedDoc.currentStage === 'completed' ? 'Finalizado' : 'Aprovar / Próxima Etapa'}
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Selecione um documento pare revisar
            </div>
          )}
        </div>
      </div>
    </div>

    <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Rejeitar Documento</DialogTitle>
                <DialogDescription>
                    Por favor, informe o motivo da rejeição para que o cliente possa corrigir.
                </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="reason">Motivo da Rejeição</Label>
                    <Select value={rejectionReason} onValueChange={setRejectionReason}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione um motivo" />
                        </SelectTrigger>
                        <SelectContent>
                            {PREDEFINED_REASONS.map(reason => (
                                <SelectItem key={reason.value} value={reason.value}>
                                    {reason.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {rejectionReason === 'outros' && (
                    <div className="space-y-2">
                        <Label htmlFor="custom-reason">Descreva o motivo</Label>
                        <Textarea 
                            id="custom-reason"
                            placeholder="Digite o motivo detalhado..."
                            value={customReason}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCustomReason(e.target.value)}
                        />
                    </div>
                )}
            </div>

            <DialogFooter>
                <Button variant="outline" onClick={() => setRejectModalOpen(false)}>Cancelar</Button>
                <Button 
                    variant="destructive" 
                    onClick={handleConfirmRejection}
                    disabled={!rejectionReason || (rejectionReason === 'outros' && !customReason.trim())}
                >
                    Confirmar Rejeição
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>

    <Dialog open={approveModalOpen} onOpenChange={setApproveModalOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Confirmar Aprovação</DialogTitle>
                <DialogDescription>
                    {selectedDoc?.currentStage === 'initial_analysis'
                        ? 'Este documento será aprovado na etapa de Análise Técnica. O próximo passo será aguardar o cliente realizar o apostilamento.'
                        : selectedDoc?.currentStage === 'apostille_check'
                        ? 'Este documento será aprovado na etapa de Apostilamento. O próximo passo será aguardar o cliente enviar a tradução juramentada.'
                        : 'Este documento será aprovado na etapa de Tradução. Isso concluirá o ciclo de validação deste documento.'}
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button variant="outline" onClick={() => setApproveModalOpen(false)} disabled={isUpdatingStatus}>
                    Cancelar
                </Button>
                <Button onClick={confirmApproval} className="bg-green-600 hover:bg-green-700 text-white" disabled={isUpdatingStatus}>
                     {isUpdatingStatus && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Confirmar
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    </>
  );
}
