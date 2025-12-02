import { useState } from "react";
import { SidebarProvider } from "./components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";
import { Dashboard } from "./components/Dashboard";
import { ProcessQueue } from "./components/ProcessQueue";
import { ReviewPanel } from "./components/ReviewPanel";

const Index = () => {
  const [activeView, setActiveView] = useState("home");
  const [selectedProcess, setSelectedProcess] = useState<{
    clientName: string;
    visaType: string;
  } | null>(null);

  const renderContent = () => {
    if (selectedProcess) {
      return (
        <ReviewPanel
          clientName={selectedProcess.clientName}
          visaType={selectedProcess.visaType}
        />
      );
    }

    switch (activeView) {
      case "home":
        return <Dashboard />;
      case "analysis":
        return (
          <ProcessQueue
            onSelectProcess={(process) =>
              setSelectedProcess({
                clientName: process.clientName,
                visaType: process.serviceType,
              })
            }
          />
        );
      case "processes":
        return (
          <div className="p-8">
            <h1 className="text-3xl font-bold">Meus Processos</h1>
            <p className="text-muted-foreground mt-2">Em desenvolvimento...</p>
          </div>
        );
      case "tasks":
        return (
          <div className="p-8">
            <h1 className="text-3xl font-bold">Tarefas</h1>
            <p className="text-muted-foreground mt-2">Em desenvolvimento...</p>
          </div>
        );
      case "finance":
        return (
          <div className="p-8">
            <h1 className="text-3xl font-bold">Financeiro</h1>
            <p className="text-muted-foreground mt-2">Em desenvolvimento...</p>
          </div>
        );
      case "settings":
        return (
          <div className="p-8">
            <h1 className="text-3xl font-bold">Configurações</h1>
            <p className="text-muted-foreground mt-2">Em desenvolvimento...</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar activeView={activeView} onViewChange={setActiveView} />
        
        <main className="flex-1 overflow-auto">
          {selectedProcess && (
            <div className="border-b bg-muted/30 p-4">
              <button
                onClick={() => setSelectedProcess(null)}
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2"
              >
                ← Voltar para {activeView === "analysis" ? "Fila de Análise" : "Início"}
              </button>
            </div>
          )}
          {renderContent()}
        </main>
      </div>
    </SidebarProvider>
  );
};

export { Index as JuridicoApp };
export default Index;
