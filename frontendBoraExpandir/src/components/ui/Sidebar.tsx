import React from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'

export type SidebarItem = {
  label: string
  to: string
  icon?: React.ComponentType<{ className?: string }>
  badge?: React.ReactNode
  disabled?: boolean
}

export type SidebarGroup = {
  label?: string
  items: SidebarItem[]
}

type SidebarProps = {
  groups: SidebarGroup[]
}

export function Sidebar({ groups }: SidebarProps) {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const userName = (typeof window !== 'undefined' && localStorage.getItem('userName')) || 'Usuário'

  const handleLogout = () => {
    try {
      localStorage.removeItem('authToken')
      localStorage.removeItem('userName')
    } catch {}
    navigate('/', { replace: true })
  }

  return (
    <aside className={cn('h-screen w-64 shrink-0 border-r bg-sidebar background border-sidebar-border text-sidebar-foreground flex flex-col')}
      style={{} as React.CSSProperties}
    >
      {/* Header padrão */}
      <div className="px-3 py-3 border-b border-sidebar-border flex items-center gap-3">
        <img
          src="/logo.svg"
          alt="BoraExpandir"
          className="h-6 w-6 rounded-sm bg-sidebar-accent"
          onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')}
        />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold truncate">BoraExpandir</div>
          <div className="text-xs text-muted-foreground truncate">{userName}</div>
        </div>
      </div>

      {/* Navegação */}
      <nav className="flex-1 overflow-y-auto py-2">
        {groups.map((group, gi) => (
          <div key={gi} className="px-2">
            {group.label && (
              <div className="px-2 py-2 text-xs uppercase tracking-wide text-muted-foreground">{group.label}</div>
            )}
            <ul className="space-y-1">
              {group.items.map((item, ii) => {
                const Icon = item.icon
                const active = pathname === item.to || pathname.startsWith(item.to + '/')
                return (
                  <li key={`${gi}-${ii}`}>
                    <NavLink
                      to={item.to}
                      className={cn(
                        'group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition',
                        'hover:bg-sidebar-accent',
                        active ? 'bg-sidebar-accent text-sidebar-primary' : 'text-foreground',
                        item.disabled && 'opacity-50 pointer-events-none'
                      )}
                    >
                      {Icon && (
                        <Icon className={cn('h-4 w-4', active ? 'text-sidebar-primary' : 'text-muted-foreground')} />
                      )}
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.badge}
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer padrão */}
      <div className="px-3 py-3 border-t border-sidebar-border mt-auto">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full rounded-md px-3 py-2 text-sm bg-destructive/15 text-destructive hover:bg-destructive/25 transition"
        >
          Sair
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
