import { useState, useEffect } from 'react'
import { Clock, FileText, User, ChevronRight, Folder, ChevronLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from '../../../components/ui/Badge';
import { Card } from "../../cliente/components/ui/card";
import { ProcessAnalysis, JuridicoDocument, AnalysisStage } from './ProcessAnalysis';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

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

interface BackendProcess {
    id: string;
    client_id: string;
    client?: {
        id: string;
        full_name: string;
        email: string;
    };
    tipo_servico: string;
    status: string;
    etapa_atual: number;
    criado_em: string;
    // ... add other fields as needed
}

const StatusBadge = ({ status }: { status: Process["status"] }) => {
  const variants = {
    new: { label: "Novo", variant: "destructive" as const },
    pending_client: { label: "Pendente", variant: "warning" as const },
    ready: { label: "Pronto", variant: "success" as const },
  };

  const { label, variant } = variants[status] || { label: status, variant: "secondary" };
  return <Badge variant={variant} className="absolute top-3 right-3">{label}</Badge>;
};

interface ProcessQueueProps {
  onSelectProcess?: (process: Process) => void;
}

export function ProcessQueue({ onSelectProcess }: ProcessQueueProps) {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<Process | null>(null);
  const [selectedFolderDocs, setSelectedFolderDocs] = useState<any[]>([]); // Raw backend documents
  const [selectedMember, setSelectedMember] = useState<{name: string, id?: string} | null>(null);
  const [loading, setLoading] = useState(false);

  // Mock Data para Apresentação
  const MOCK_PROCESSES: Process[] = [
    {
      id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      clientName: 'João Carlos Silva',
      clientId: 'cli-001',
      serviceType: 'Cidadania Italiana',
      currentStage: '2',
      totalStages: 4,
      status: 'new',
      waitingTime: 2,
      documentsTotal: 18,
      documentsApproved: 5,
      documentsPending: 4,
      documentsAnalyzing: 6,
      documentsApostilled: 2,
      documentsTranslated: 1
    },
    {
      id: 'proc-002',
      clientName: 'Maria Fernanda Costa',
      clientId: 'cli-002',
      serviceType: 'Cidadania Portuguesa',
      currentStage: '3',
      totalStages: 4,
      status: 'pending_client',
      waitingTime: 5,
      documentsTotal: 12,
      documentsApproved: 8,
      documentsPending: 2,
      documentsAnalyzing: 1,
      documentsApostilled: 1,
      documentsTranslated: 0
    },
    {
      id: 'proc-003',
      clientName: 'Roberto Mendes Junior',
      clientId: 'cli-003',
      serviceType: 'Cidadania Italiana',
      currentStage: '4',
      totalStages: 4,
      status: 'ready',
      waitingTime: 0,
      documentsTotal: 22,
      documentsApproved: 20,
      documentsPending: 0,
      documentsAnalyzing: 0,
      documentsApostilled: 2,
      documentsTranslated: 0
    },
    {
      id: 'proc-004',
      clientName: 'Ana Paula Rodrigues',
      clientId: 'cli-004',
      serviceType: 'Cidadania Espanhola',
      currentStage: '1',
      totalStages: 4,
      status: 'new',
      waitingTime: 1,
      documentsTotal: 15,
      documentsApproved: 0,
      documentsPending: 8,
      documentsAnalyzing: 7,
      documentsApostilled: 0,
      documentsTranslated: 0
    },
    {
      id: 'proc-005',
      clientName: 'Carlos Eduardo Pereira',
      clientId: 'cli-005',
      serviceType: 'Cidadania Italiana',
      currentStage: '2',
      totalStages: 4,
      status: 'pending_client',
      waitingTime: 3,
      documentsTotal: 20,
      documentsApproved: 12,
      documentsPending: 3,
      documentsAnalyzing: 2,
      documentsApostilled: 2,
      documentsTranslated: 1
    },
    {
      id: 'proc-006',
      clientName: 'Beatriz Santos Lima',
      clientId: 'cli-006',
      serviceType: 'Cidadania Portuguesa',
      currentStage: '3',
      totalStages: 4,
      status: 'new',
      waitingTime: 4,
      documentsTotal: 16,
      documentsApproved: 10,
      documentsPending: 1,
      documentsAnalyzing: 3,
      documentsApostilled: 1,
      documentsTranslated: 1
    },
    {
      id: 'proc-007',
      clientName: 'Fernando Oliveira Campos',
      clientId: 'cli-007',
      serviceType: 'Cidadania Italiana',
      currentStage: '4',
      totalStages: 4,
      status: 'ready',
      waitingTime: 0,
      documentsTotal: 25,
      documentsApproved: 23,
      documentsPending: 0,
      documentsAnalyzing: 0,
      documentsApostilled: 2,
      documentsTranslated: 0
    },
    {
      id: 'proc-008',
      clientName: 'Luciana Martins Alves',
      clientId: 'cli-008',
      serviceType: 'Cidadania Espanhola',
      currentStage: '2',
      totalStages: 4,
      status: 'pending_client',
      waitingTime: 6,
      documentsTotal: 14,
      documentsApproved: 6,
      documentsPending: 5,
      documentsAnalyzing: 2,
      documentsApostilled: 1,
      documentsTranslated: 0
    }
  ];

  // Usando mock para apresentação
  useEffect(() => {
    setLoading(true);
    // Simula delay de carregamento
    setTimeout(() => {
      setProcesses(MOCK_PROCESSES);
      setLoading(false);
    }, 500);
  }, []);

  // Fetch Documents when Folder Selected
  useEffect(() => {
    if (!selectedFolder) return;

    const fetchDocs = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/cliente/${selectedFolder.clientId}/documentos`);
            if (!response.ok) throw new Error('Falha ao buscar documentos');
            const result = await response.json();
            const docs = result.data || [];
            setSelectedFolderDocs(docs);
            
            // Recalculate stats for the selected folder (optional if we want to update the view)
        } catch (error) {
            console.error(error);
        }
    }
    fetchDocs();
  }, [selectedFolder]);


  // Derived Members from Documents
  const members = selectedFolderDocs.reduce((acc: any[], doc: any) => {
      // Logic to extract member name (e.g. from storage_path or memberId)
      // Assuming storage_path: clientID/MemberName/type/file
      let memberName = selectedFolder?.clientName || 'Titular';
      let memberType = 'Titular';

      if (doc.member_id) {
          // If we had member names map... 
          // For now try to parse from storage_path if name not available?
           if (doc.storage_path) {
              const parts = doc.storage_path.split('/');
              if (parts.length > 2) {
                  // Removing underscores might be nice
                  memberName = parts[1].replace(/_/g, ' '); 
              }
          }
      } else if (doc.storage_path) {
          const parts = doc.storage_path.split('/');
          if (parts.length > 2) {
              memberName = parts[1].replace(/_/g, ' ');
          }
      }

      const existing = acc.find(m => m.name === memberName);
      const isPending = doc.status === 'PENDING' || !doc.status;
      const isAnalyzing = doc.status === 'ANALYZING' || doc.status?.startsWith('ANALYZING_'); 

      if (existing) {
          existing.docs++;
          if (isPending) existing.pending++;
          existing.status.push(doc.status);
      } else {
           acc.push({
               name: memberName,
               type: memberType, // Logic to determine type?
               docs: 1,
               pending: isPending ? 1 : 0,
               status: [doc.status],
               id: doc.member_id // Store member ID if available
           });
      }
      return acc;
  }, []);

  const getFilteredDocsForMember = (memberName: string): JuridicoDocument[] => {
      // Filter raw docs and map to JuridicoDocument
       return selectedFolderDocs
        .filter(doc => {
            let docMember = selectedFolder?.clientName || 'Titular';
             if (doc.storage_path) {
                const parts = doc.storage_path.split('/');
                if (parts.length > 2) docMember = parts[1].replace(/_/g, ' ');
            }
            return docMember === memberName;
        })
        .map(doc => {
            // Map Backend Status directly to lower case or specific logic
            const status = doc.status ? doc.status.toLowerCase() : 'pending';
            
            let stage: AnalysisStage = 'initial_analysis';
            if (status.includes('apostille')) stage = 'apostille_check';
            if (status.includes('translation')) stage = 'translation_check';
            if (status === 'approved') stage = 'completed';

            return {
                id: doc.id,
                name: doc.nome_original || doc.tipo,
                type: doc.tipo,
                url: doc.public_url || '',
                status: status as any,
                currentStage: stage,
                uploadDate: new Date(doc.criado_em).toLocaleDateString(),
                history: []
            }
        });
  };

  if (selectedMember && selectedFolder) {
    const memberDocs = getFilteredDocsForMember(selectedMember.name);
    
    return (
      <ProcessAnalysis 
        clientName={selectedFolder.clientName}
        memberName={selectedMember.name}
        documents={memberDocs} 
        onBack={() => setSelectedMember(null)}
        onUpdateDocument={async (id, updates) => {
             // Optimistic update
             const newStatus = updates.status?.toUpperCase();
             try {
                // Determine rejection reason
                // In updates we might have reason if we passed it in
                // But ProcessAnalysis only calls onUpdateDocument(id, {status...})
                // The actual backend call needs to happen here.
                
                await fetch(`${API_BASE_URL}/cliente/documento/${id}/status`, {
                    method: 'PATCH',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        status: newStatus,
                        motivoRejeicao: updates.status === 'rejected' ? 'Rejeitado pelo jurídico' : undefined // Would need to pass reason from component
                    })
                });

                // Update local list
                 const updatedRaw = selectedFolderDocs.map(d => d.id === id ? {...d, status: newStatus} : d);
                 setSelectedFolderDocs(updatedRaw);

             } catch (e) {
                 console.error("Failed to update status", e);
             }
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
                {members.length > 0 ? members.map((member, idx) => (
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
                )) : (
                    <div className="col-span-full py-12 text-center text-muted-foreground">
                        Nenhum documento encontrado para este processo.
                    </div>
                )}
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
             {loading && <span className="text-sm text-muted-foreground animate-pulse">Carregando...</span>}
            <Badge variant="outline" className="text-base px-4 py-2">
            {processes.length} processos
            </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {processes.map((process) => (
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
                     <p className="text-xs text-muted-foreground mt-1 font-mono">ID: {process.clientId.substring(0,8)}...</p>
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
        {!loading && processes.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground">
                Nenhum processo encontrado na fila.
            </div>
        )}
      </div>
    </div>
  );
}
