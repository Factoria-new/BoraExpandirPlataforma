import { ReactNode } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import { admSidebarGroups } from "../../sidebar-groups";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <>
      <Sidebar groups={admSidebarGroups} />
      <main className="ml-64 p-6 bg-background min-h-screen">
        {children}
      </main>
    </>
  );
}
