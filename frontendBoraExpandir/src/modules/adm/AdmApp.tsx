import { Routes, Route } from "react-router-dom";
import { AdminLayout } from "./components/layout/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import ServiceCatalog from "./pages/admin/ServiceCatalog";
import AuditLogs from "./pages/admin/AuditLogs";
import Settings from "./pages/admin/Settings";
import CockpitDoDoNo from "./pages/admin/CockpitDoDoNo";
import AuditoriaAprovacoes from "./pages/admin/AuditoriaAprovacoes";

const NotFound = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold">Página não encontrada</h1>
    <p className="text-muted-foreground mt-2">A página que você procura não existe.</p>
  </div>
);

const App = () => (
  <AdminLayout>
    <Routes>
      <Route index element={<Dashboard />} />
      <Route path="team" element={<UserManagement />} />
      <Route path="services" element={<ServiceCatalog />} />
      <Route path="audit" element={<AuditLogs />} />
      <Route path="settings" element={<Settings />} />
      <Route path="cockpit" element={<CockpitDoDoNo />} />
      <Route path="approvals" element={<AuditoriaAprovacoes />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </AdminLayout>
);

export default App;
