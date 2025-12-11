import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { LayoutDashboard, PieChart, Wallet, HandCoins, BarChart, Settings } from 'lucide-react'
import { Sidebar } from '../../components/ui/Sidebar'
import type { SidebarGroup } from '../../components/ui/Sidebar'
import { Dashboard } from './components/Dashboard'
import { FinancialProcessList } from './pages/FinancialProcessList'
import Comissoes from './pages/Comissoes'
import { FinancialDashboard } from './pages/VisaoGeral'
import { Config } from '../../components/ui/Config'

const Relatorios = () => <div><h2 className="text-xl font-semibold mb-2">Relatórios</h2></div>

export function FinanceiroApp() {
  // Configuração da sidebar seguindo o padrão do projeto
  const sidebarGroups: SidebarGroup[] = [
    {
      label: 'Operacional',
      items: [
        { label: 'Início', to: '/financeiro', icon: LayoutDashboard },
      ],
    },
    {
      label: 'Financeiro',
      items: [
        { label: 'Visão Geral', to: '/financeiro/visao-geral', icon: PieChart },
        { label: 'Contas a Receber', to: '/financeiro/contas-receber', icon: Wallet },
        { label: 'Comissões', to: '/financeiro/comissoes', icon: HandCoins },
      ],
    },
    {
      label: 'Sistema',
      items: [
        { label: 'Relatórios', to: '/financeiro/relatorios', icon: BarChart },
        { label: 'Configurações', to: '/financeiro/configuracoes', icon: Settings },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Sidebar groups={sidebarGroups} />
      
      <main className="ml-64 p-6">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="visao-geral" element={<FinancialDashboard />} />
          <Route path="contas-receber" element={<FinancialProcessList />} />
          <Route path="comissoes" element={<Comissoes />} />
          <Route path="relatorios" element={<Relatorios />} />
          <Route path="configuracoes" element={<Config />} />
          <Route path="*" element={<Navigate to="." replace />} />
        </Routes>
      </main>
    </div>
  )
}
