import { LayoutDashboard, Users, FolderCog, FileText, CheckCircle2, Settings, Gauge } from "lucide-react";
import type { SidebarGroup } from "@/components/ui/Sidebar";

export const admSidebarGroups: SidebarGroup[] = [
  {
    label: "Controle",
    items: [
      { label: "Dashboard", to: "/adm", icon: LayoutDashboard },
      { label: "Gestão de Equipe", to: "/adm/team", icon: Users },
      { label: "Catálogo de Serviços", to: "/adm/services", icon: FolderCog },
    ],
  },
  {
    label: "Administração",
    items: [
      { label: "Auditoria", to: "/adm/audit", icon: FileText },
      { label: "Aprovações", to: "/adm/approvals", icon: CheckCircle2 },
      { label: "Cockpit do Dono", to: "/adm/cockpit", icon: Gauge },
      { label: "Configurações", to: "/adm/settings", icon: Settings },
    ],
  },
];
