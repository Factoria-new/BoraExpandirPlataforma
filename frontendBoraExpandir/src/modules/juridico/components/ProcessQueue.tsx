import { useState } from 'react'
import { Clock, FileText, User, ChevronRight, Folder, Users, ArrowBigLeft, ChevronLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from '../../../components/ui/Badge';
import { Card } from "../../cliente/components/ui/card";
import { mockFamilyMembers } from '../../cliente/lib/mock-data';
import { ProcessAnalysis, JuridicoDocument } from './ProcessAnalysis';

const mockJuridicoDocs: JuridicoDocument[] = [
  {
    id: '1',
    name: 'Passaporte',
    type: 'passaporte',
    url: '',
    status: 'analyzing',
    currentStage: 'initial_analysis',
    uploadDate: '2024-01-20',
    history: []
  },
  {
    id: '2',
    name: 'Certidão de Nascimento',
    type: 'certidao',
    url: '',
    status: 'waiting_apostille',
    currentStage: 'apostille_check',
    uploadDate: '2024-01-22',
    history: []
  },
  {
    id: '3',
    name: 'Antecedentes Criminais',
    type: 'antecedentes',
    url: '',
    status: 'waiting_translation',
    currentStage: 'translation_check',
    uploadDate: '2024-01-25',
    history: []
  }
];

export interface Process {
  id: string;
  clientName: string;
  clientId: string;
  serviceType: string;
  currentStage: string;
  totalStages: number;
  status: "new" | "pending_client" | "ready";
  waitingTime: number;
  documentsTotal: number;
  documentsApproved: number;
  documentsPending: number;
  documentsAnalyzing: number;
  documentsApostilled: number;
  documentsTranslated: number;
}

// Dados mock para demonstração
const mockProcesses: Process[] = [
  {
    id: "1",
    clientName: "João Silva",
    clientId: "CLI001",
    serviceType: "Visto D7",
    currentStage: "2",
    totalStages: 4,
    status: "new",
    waitingTime: 2,
    documentsTotal: 12,
    documentsApproved: 3,
    documentsPending: 5,
    documentsAnalyzing: 4,
    documentsApostilled: 2,
    documentsTranslated: 1
  },
  {
    id: "2",
    clientName: "Maria Santos",
    clientId: "CLI002",
    serviceType: "Nómada Digital",
    currentStage: "1",
    totalStages: 4,
    status: "pending_client",
    waitingTime: 28,
    documentsTotal: 6,
    documentsApproved: 2,
    documentsPending: 4,
    documentsAnalyzing: 0,
    documentsApostilled: 0,
    documentsTranslated: 0
  },
  {
    id: "3",
    clientName: "Carlos Oliveira",
    clientId: "CLI003",
    serviceType: "Visto D2",
    currentStage: "3",
    totalStages: 4,
    status: "ready",
    waitingTime: 1,
    documentsTotal: 8,
    documentsApproved: 8,
    documentsPending: 0,
    documentsAnalyzing: 0,
    documentsApostilled: 4,
    documentsTranslated: 3
  },
  {
      id: "4",
      clientName: "Ana Paula Souza",
      clientId: "CLI004",
      serviceType: "Cidadania Portuguesa",
      currentStage: "1",
      totalStages: 5,
      status: "new",
      waitingTime: 5,
      documentsTotal: 15,
      documentsApproved: 0,
      documentsPending: 10,
      documentsAnalyzing: 5,
      documentsApostilled: 0,
      documentsTranslated: 0
    },
];

const StatusBadge = ({ status }: { status: Process["status"] }) => {
  const variants = {
    new: { label: "Novo", variant: "destructive" as const },
    pending_client: { label: "Pendente", variant: "warning" as const },
    ready: { label: "Pronto", variant: "success" as const },
  };

  const { label, variant } = variants[status];
  return <Badge variant={variant} className="absolute top-3 right-3">{label}</Badge>;
};



interface ProcessQueueProps {
  onSelectProcess?: (process: Process) => void;
}

export function ProcessQueue({ onSelectProcess }: ProcessQueueProps) {
  const [selectedFolder, setSelectedFolder] = useState<Process | null>(null);
  const [selectedMember, setSelectedMember] = useState<{name: string} | null>(null);

  if (selectedMember && selectedFolder) {
    return (
      <ProcessAnalysis 
        clientName={selectedFolder.clientName}
        memberName={selectedMember.name}
        documents={mockJuridicoDocs} // In real app, filter by member/process
        onBack={() => setSelectedMember(null)}
        onUpdateDocument={(id, updates) => {
            console.log('Update doc', id, updates)
            // Here update state/backend
        }}
      />
    )
  }

  if (selectedFolder) {
    return (
        <div className="space-y-6 p-8">
            <div className="flex items-center gap-4 mb-6">
                 <Button 
                    variant="ghost" 
                    size="sm" 
                    className="-ml-2 text-muted-foreground hover:text-foreground"
                    onClick={() => setSelectedFolder(null)}
                >
                    <ChevronLeft className="h-5 w-5 mr-1" />
                    Voltar para Fila
                </Button>
                <div>
                     <h1 className="text-2xl font-bold tracking-tight">{selectedFolder.clientName}</h1>
                     <p className="text-muted-foreground text-sm flex items-center gap-2">
                        {selectedFolder.serviceType}
                        <span className="w-1 h-1 rounded-full bg-gray-400" />
                        ID: {selectedFolder.clientId}
                     </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Mocking family members as sub-folders */}
                {/* Normally we would filter members by this process ID */}
                {[
                    { name: selectedFolder.clientName, type: "Titular", docs: 5, pending: 2 },
                    { name: "Maria " + selectedFolder.clientName.split(' ')[1], type: "Cônjuge", docs: 3, pending: 1 },
                    { name: "Pedro " + selectedFolder.clientName.split(' ')[1], type: "Filho", docs: 2, pending: 0 }
                ].map((member, idx) => (
                     <Card 
                        key={idx}
                        className="p-6 cursor-pointer hover:shadow-md transition-all border-l-4 border-l-blue-500 group relative overflow-hidden"
                        onClick={() => setSelectedMember(member)}
                     >

                        
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <Badge variant="outline">{member.type}</Badge>
                        </div>

                        <h3 className="text-lg font-bold mb-1">{member.name}</h3>
                        <p className="text-sm text-gray-500 mb-4">{member.docs} Documentos no total</p>

                        <div className="space-y-2">
                             <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Pendentes de Upload</span>
                                <span className="font-medium text-orange-600">{member.pending}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Para Análise</span>
                                <span className="font-medium text-blue-600">
                                    {member.docs - member.pending}
                                </span>
                            </div>
                        </div>

                        <Button className="w-full mt-4 bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-700 border-none justify-between group-hover:translate-x-1 transition-all">
                             Ver Documentos
                             <ChevronRight className="h-4 w-4" />
                        </Button>
                     </Card>
                ))}
            </div>
        </div>
    )
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fila de Trabalho</h1>
          <p className="text-muted-foreground mt-1">
            Processos aguardando revisão jurídica
          </p>
        </div>
        <div className="flex gap-3">
            <Badge variant="outline" className="text-base px-4 py-2">
            {mockProcesses.length} processos
            </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockProcesses.map((process) => (
          <Card
            key={process.id}
            className="group relative cursor-pointer hover:shadow-lg transition-all duration-300 border-t-4 border-t-primary overflow-visible"
            onClick={() => setSelectedFolder(process)}
          >
            <div className="p-6">
                <StatusBadge status={process.status} />
                
                <div className="mb-6 mt-2">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                         <Folder className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg leading-tight mb-1">{process.clientName}</h3>
                     <p className="text-sm text-muted-foreground">{process.serviceType}</p>
                     <p className="text-xs text-muted-foreground mt-1 font-mono">ID: {process.clientId}</p>
                </div>

                <div className="space-y-3 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5" /> Total
                        </span>
                        <span className="font-medium">{process.documentsTotal} docs</span>
                    </div>
                    
                    <div className="h-px bg-gray-200 dark:bg-gray-700" />
                    
                    <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                             <span className="block text-blue-600 font-bold text-lg">{process.documentsAnalyzing}</span>
                             <span className="text-muted-foreground">Em Análise</span>
                        </div>
                         <div>
                             <span className="block text-green-600 font-bold text-lg">{process.documentsApproved}</span>
                             <span className="text-muted-foreground">Aprovados</span>
                        </div>
                        <div>
                             <span className="block text-amber-600 font-bold text-lg">{process.documentsApostilled}</span>
                             <span className="text-muted-foreground">Apostilados</span>
                        </div>
                         <div>
                             <span className="block text-purple-600 font-bold text-lg">{process.documentsTranslated}</span>
                             <span className="text-muted-foreground">Traduzidos</span>
                        </div>
                    </div>
                </div>

            </div>
            
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
          </Card>
        ))}
      </div>
    </div>
  );
}
