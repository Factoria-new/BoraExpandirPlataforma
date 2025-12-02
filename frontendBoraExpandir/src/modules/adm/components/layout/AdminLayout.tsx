import { ReactNode } from "react";
import Sidebar from "@/components/ui/Sidebar";
import { admSidebarGroups } from "../../sidebar-groups";
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar groups={admSidebarGroups} />
        
        <div className="flex-1 flex flex-col">
          <header className="h-14 border-b border-border bg-card flex items-center justify-between px-6 gap-3">
            <SidebarTrigger />
            <ThemeToggle />
          </header>
          
          <main className="flex-1 p-6 bg-admin-content">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
