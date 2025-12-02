import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from '@/components/ui/Sidebar'
import { parceiroSidebarGroups } from './sidebar-groups'
import PartnerDashboard from './PartnerDashboard'
import CadastroParceiro from './CadastroParceiro'

export default function ParceiroApp() {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar groups={parceiroSidebarGroups} />
      <main className="flex-1 p-4 md:p-6">
        <Routes>
          <Route path="/" element={<PartnerDashboard />} />
          
        </Routes>
      </main>
    </div>
  )
}
