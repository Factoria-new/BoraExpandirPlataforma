import React from 'react'
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, PieChart, Wallet, HandCoins, BarChart, Settings } from 'lucide-react'
import { FinancialProcessList } from './pages/FinancialProcessList'
import Comissoes from './pages/Comissoes'
import { FinancialDashboard } from './pages/VisaoGeral'
import { ThemeToggle } from '@/components/ThemeToggle'

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  const { pathname } = useLocation()
  const active = pathname.startsWith(`/financeiro/${to}`) || (to === '' && pathname === '/financeiro')
  return (
    <Link className={`flex items-center gap-2 px-3 py-2 rounded ${active ? 'bg-neutral-200 font-medium' : 'hover:bg-neutral-100'}`} to={to}>
      {children}
    </Link>
  )
}

function FinanceiroLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <aside className="w-[var(--sidebar-w)] bg-card border-r border-border">
        <div className="p-4 font-semibold flex items-center justify-between">
          <span>Portal Financeiro</span>
          <ThemeToggle />
        </div>
        <nav className="px-2 space-y-3 text-sm">
          <div>
            <div className="px-3 text-muted-foreground text-xs mb-1">Operacional</div>
            <NavLink to=""><LayoutDashboard size={18}/>Início</NavLink>
          </div>
          <div>
            <div className="px-3 text-muted-foreground text-xs mb-1">Financeiro</div>
            <NavLink to="visao-geral"><PieChart size={18}/>Visão Geral</NavLink>
            <NavLink to="contas-receber"><Wallet size={18}/>Contas a Receber</NavLink>
            <NavLink to="comissoes"><HandCoins size={18}/>Comissões</NavLink>
          </div>
          <div>
            <div className="px-3 text-muted-foreground text-xs mb-1">Sistema</div>
            <NavLink to="relatorios"><BarChart size={18}/>Relatórios</NavLink>
            <NavLink to="configuracoes"><Settings size={18}/>Configurações</NavLink>
          </div>
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}

const Inicio = () => <div><h2 className="text-xl font-semibold mb-2">Início</h2><p>Dashboard financeiro.</p></div>
const VisaoGeral = () => <div><h2 className="text-xl font-semibold mb-2">Visão Geral</h2><p>Resumo financeiro.</p></div>
const ContasReceber = () => <FinancialProcessList />
const Relatorios = () => <div><h2 className="text-xl font-semibold mb-2">Relatórios</h2></div>
const Config = () => <div><h2 className="text-xl font-semibold mb-2">Configurações</h2></div>

export function FinanceiroApp() {
  return (
    <FinanceiroLayout>
      <Routes>
        <Route index element={<Inicio />} />
        <Route path="visao-geral" element={<FinancialDashboard />} />
        <Route path="contas-receber" element={<ContasReceber />} />
        <Route path="comissoes" element={<Comissoes />} />
        <Route path="relatorios" element={<Relatorios />} />
        <Route path="configuracoes" element={<Config />} />
        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </FinanceiroLayout>
  )
}
