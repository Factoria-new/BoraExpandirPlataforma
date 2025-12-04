import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Home, FolderOpen, FileSearch, CheckSquare, DollarSign, Settings } from "lucide-react";
import { Sidebar } from "../../components/ui/Sidebar";
import type { SidebarGroup } from "../../components/ui/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { ProcessQueue } from "./components/ProcessQueue";
import { ReviewPanel } from "./components/ReviewPanel";

const MeusProcessos = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold">Meus Processos</h1>
    <p className="text-muted-foreground mt-2">Em desenvolvimento...</p>
  </div>
);

const Tarefas = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold">Tarefas</h1>
    <p className="text-muted-foreground mt-2">Em desenvolvimento...</p>
  </div>
);

const Financeiro = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold">Financeiro</h1>
    <p className="text-muted-foreground mt-2">Em desenvolvimento...</p>
  </div>
);

const Configuracoes = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold">Configurações</h1>
    <p className="text-muted-foreground mt-2">Em desenvolvimento...</p>
  </div>
);

const Index = () => {
  const [selectedProcess, setSelectedProcess] = useState<{
    clientName: string;
    visaType: string;
  } | null>(null);

  // Configuração da sidebar seguindo o padrão do projeto
  const sidebarGroups: SidebarGroup[] = [
    {
      label: "Menu Principal",
      items: [
        { label: "Início", to: "/juridico", icon: Home },
        { label: "Meus Processos", to: "/juridico/processos", icon: FolderOpen },
        { label: "Fila de Análise", to: "/juridico/analise", icon: FileSearch },
        { label: "Tarefas", to: "/juridico/tarefas", icon: CheckSquare },
      ],
    },
    {
      label: "Sistema",
      items: [
        { label: "Financeiro", to: "/juridico/financeiro", icon: DollarSign },
        { label: "Configurações", to: "/juridico/configuracoes", icon: Settings },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Sidebar groups={sidebarGroups} />

      <main className="ml-64 p-6">
        {selectedProcess && (
          <div className="border-b bg-muted/30 p-4 -m-6 mb-6">
            <button
              onClick={() => setSelectedProcess(null)}
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2"
            >
              ← Voltar para Fila de Análise
            </button>
          </div>
        )}

        {selectedProcess ? (
          <ReviewPanel
            clientName={selectedProcess.clientName}
            visaType={selectedProcess.visaType}
          />
        ) : (
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="processos" element={<MeusProcessos />} />
            <Route
              path="analise"
              element={
                <ProcessQueue
                  onSelectProcess={(process) =>
                    setSelectedProcess({
                      clientName: process.clientName,
                      visaType: process.serviceType,
                    })
                  }
                />
              }
            />
            <Route path="tarefas" element={<Tarefas />} />
            <Route path="financeiro" element={<Financeiro />} />
            <Route path="configuracoes" element={<Configuracoes />} />
            <Route path="*" element={<Navigate to="." replace />} />
          </Routes>
        )}
      </main>
    </div>
  );
};

export { Index as JuridicoApp };
export default Index;
