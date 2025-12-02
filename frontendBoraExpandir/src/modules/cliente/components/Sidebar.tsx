import { useState } from 'react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { 
  Home, 
  Upload, 
  FileText, 
  Bell, 
  Clock, 
  User, 
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { cn } from '../lib/utils'
import { Client } from '../types'
import { ThemeToggle } from '@/components/ThemeToggle'

interface SidebarProps {
  client: Client
  unreadNotifications: number
  currentPage: string
  onNavigate: (page: string) => void
  onLogout: () => void
}

const navigation = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: Home,
  },
  {
    id: 'process',
    name: 'Andamento',
    icon: Clock,
  },
  {
    id: 'documents',
    name: 'Documentos',
    icon: FileText,
  },
  {
    id: 'upload',
    name: 'Upload',
    icon: Upload,
  },
  {
    id: 'notifications',
    name: 'Notificações',
    icon: Bell,
    badge: true,
  },
]

export function Sidebar({ 
  client, 
  unreadNotifications, 
  currentPage, 
  onNavigate, 
  onLogout 
}: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Portal do Cliente</h1>
            <p className="text-sm text-muted-foreground">BoraExpandir</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
            <button className="md:hidden" onClick={() => setIsMobileOpen(false)}>
              <X className="h-6 w-6 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* Client Info */}
      <div className="p-6 border-b border-border bg-admin-surface">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {client.name}
            </p>
            <p className="text-sm text-muted-foreground truncate">
              {client.email}
            </p>
          </div>
        </div>
      
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            const showBadge = item.badge && unreadNotifications > 0
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => {
                    onNavigate(item.id)
                    setIsMobileOpen(false)
                  }}
                  className={cn(
                    "w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                  {showBadge && (
                    <Badge 
                      variant="destructive" 
                      className={cn(
                        "text-xs ml-auto",
                        isActive && "bg-primary-foreground text-primary"
                      )}
                    >
                      {unreadNotifications}
                    </Badge>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-border bg-card">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={onLogout}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sair
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileOpen(true)}
          className="bg-white shadow-md"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-80 md:flex-col md:fixed md:inset-y-0 bg-card border-r border-border">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <div className={cn(
        "md:hidden fixed inset-y-0 left-0 z-50 w-80 bg-card transform transition-transform duration-300 ease-in-out",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <SidebarContent />
      </div>
    </>
  )
}
