import React from "react";
import Sidebar from "@/components/ui/Sidebar";
import { parceiroSidebarGroups } from "./sidebar-groups";
import PartnerDashboard from "./PartnerDashboard";

export default function Parceiro() {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar groups={parceiroSidebarGroups} />
      <main className="flex-1">
        <PartnerDashboard />
      </main>
    </div>
  );
}
