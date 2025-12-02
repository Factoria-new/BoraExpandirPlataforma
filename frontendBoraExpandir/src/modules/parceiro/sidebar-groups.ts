import { LayoutDashboard, DollarSign, Settings } from "lucide-react";
import type { SidebarGroup } from "@/components/ui/Sidebar";

export const parceiroSidebarGroups: SidebarGroup[] = [
  {
    label: "Navegação",
    items: [
      { label: "Dashboard", to: "/parceiro", icon: LayoutDashboard },
   
    ],
  },
];
