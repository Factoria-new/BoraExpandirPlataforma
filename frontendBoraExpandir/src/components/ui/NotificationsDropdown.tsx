import React, { useState, useRef, useEffect } from 'react'
import {
  Bell,
  X,
  ChevronRight,
  FileWarning,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
} from 'lucide-react'

// Interface e dados de notificações
interface Notificacao {
  id: string
  tipo: 'vencido' | 'urgente' | 'aviso' | 'info'
  titulo: string
  descricao: string
  valor?: number
  data: string
  lida: boolean
}

const mockNotificacoes: Notificacao[] = [
  {
    id: '1',
    tipo: 'vencido',
    titulo: 'Encontros Vencidos',
    descricao: '3 pagamentos de clientes estão vencidos há mais de 30 dias',
    valor: 24000,
    data: '2026-01-07',
    lida: false,
  },
  {
    id: '2',
    tipo: 'urgente',
    titulo: 'Comissões Pendentes',
    descricao: 'Existem comissões aguardando aprovação para pagamento',
    valor: 8750,
    data: '2026-01-06',
    lida: false,
  },
  {
    id: '3',
    tipo: 'vencido',
    titulo: 'Fatura Vencida - Empresa ABC',
    descricao: 'Fatura #2024-0892 vencida há 15 dias',
    valor: 5500,
    data: '2026-01-05',
    lida: false,
  },
  {
    id: '4',
    tipo: 'aviso',
    titulo: 'Meta de Vendas',
    descricao: 'A meta de vendas está em 45% - acelere a prospecção',
    data: '2026-01-05',
    lida: false,
  },
  {
    id: '5',
    tipo: 'urgente',
    titulo: 'Vendedores Abaixo da Meta',
    descricao: '2 vendedores estão abaixo da meta - considere contato motivacional',
    data: '2026-01-04',
    lida: true,
  },
  {
    id: '6',
    tipo: 'info',
    titulo: 'Relatório Mensal Disponível',
    descricao: 'O relatório financeiro de dezembro está pronto para download',
    data: '2026-01-03',
    lida: true,
  },
]

// Configuração visual por tipo
const tipoConfig = {
  vencido: {
    icon: FileWarning,
    bgIcon: 'bg-red-100 dark:bg-red-900/30',
    colorIcon: 'text-red-600 dark:text-red-400',
    badgeBg: 'bg-red-100 text-red-700 border-red-200',
    badgeText: 'VENCIDO',
  },
  urgente: {
    icon: AlertTriangle,
    bgIcon: 'bg-orange-100 dark:bg-orange-900/30',
    colorIcon: 'text-orange-600 dark:text-orange-400',
    badgeBg: 'bg-orange-100 text-orange-700 border-orange-200',
    badgeText: 'URGENTE',
  },
  aviso: {
    icon: AlertCircle,
    bgIcon: 'bg-yellow-100 dark:bg-yellow-900/30',
    colorIcon: 'text-yellow-600 dark:text-yellow-400',
    badgeBg: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    badgeText: 'AVISO',
  },
  info: {
    icon: Bell,
    bgIcon: 'bg-blue-100 dark:bg-blue-900/30',
    colorIcon: 'text-blue-600 dark:text-blue-400',
    badgeBg: 'bg-blue-100 text-blue-700 border-blue-200',
    badgeText: 'INFO',
  },
}

export function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [notificacoes, setNotificacoes] = useState(mockNotificacoes)
  const panelRef = useRef<HTMLDivElement>(null)

  const naoLidas = notificacoes.filter(n => !n.lida).length
  const vencidos = notificacoes.filter(n => n.tipo === 'vencido').length
  const urgentes = notificacoes.filter(n => n.tipo === 'urgente').length

  // Fechar ao pressionar ESC
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const marcarTodasComoLidas = () => {
    setNotificacoes(prev => prev.map(n => ({ ...n, lida: true })))
  }

  const dispensarNotificacao = (id: string) => {
    setNotificacoes(prev => prev.filter(n => n.id !== id))
  }

  const marcarComoLida = (id: string) => {
    setNotificacoes(prev => prev.map(n => 
      n.id === id ? { ...n, lida: true } : n
    ))
  }

  return (
    <>
      {/* Botão do Sino */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-lg transition-all duration-200 ${
          isOpen 
            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' 
            : 'hover:bg-gray-100 dark:hover:bg-neutral-700'
        }`}
        title="Notificações"
      >
        <Bell className={`h-5 w-5 ${
          naoLidas > 0 ? 'text-gray-700 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'
        }`} />
        
        {/* Badge de contagem */}
        {naoLidas > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-xs font-bold text-white bg-red-500 rounded-full animate-pulse">
            {naoLidas > 9 ? '9+' : naoLidas}
          </span>
        )}
      </button>

      {/* Overlay para fechar */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 dark:bg-black/40 md:bg-transparent"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Painel de Notificações - Abre para dentro da tela */}
      <div
        ref={panelRef}
        className={`
          fixed z-50 bg-white dark:bg-neutral-900 shadow-2xl overflow-hidden
          transition-all duration-300 ease-in-out
          
          /* Mobile: Full screen de baixo para cima */
          inset-x-0 bottom-0 rounded-t-2xl
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}
          max-h-[85vh]
          
          /* Desktop: Painel lateral fixo à esquerda do conteúdo */
          md:inset-auto md:left-64 md:top-0 md:bottom-0 md:rounded-none md:max-h-full
          md:w-96 md:border-r md:border-gray-200 md:dark:border-neutral-700
          ${isOpen ? 'md:translate-x-0' : 'md:-translate-x-full'}
        `}
      >
        {/* Header do Painel */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Bell className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">Central de Alertas</h3>
                <p className="text-sm text-white/80">
                  {naoLidas} notificações não lidas
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={marcarTodasComoLidas}
                className="text-xs text-white/90 hover:text-white font-medium transition-colors px-2 py-1 rounded hover:bg-white/10"
              >
                Marcar lidas
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Lista de Notificações */}
        <div className="flex-1 divide-y divide-gray-100 dark:divide-neutral-700 overflow-y-auto max-h-[calc(85vh-140px)] md:max-h-[calc(100vh-140px)]">
          {notificacoes.length === 0 ? (
            <div className="p-8 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400 font-medium">Tudo em dia!</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">Nenhuma notificação pendente</p>
            </div>
          ) : (
            notificacoes.map((notificacao) => {
              const config = tipoConfig[notificacao.tipo]
              const IconComponent = config.icon

              return (
                <div 
                  key={notificacao.id}
                  onClick={() => marcarComoLida(notificacao.id)}
                  className={`p-4 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer ${
                    !notificacao.lida ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Ícone */}
                    <div className={`p-2.5 rounded-lg flex-shrink-0 ${config.bgIcon}`}>
                      <IconComponent className={`h-5 w-5 ${config.colorIcon}`} />
                    </div>

                    {/* Conteúdo */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h4 className={`font-semibold text-sm text-gray-900 dark:text-white ${
                          !notificacao.lida ? '' : 'opacity-70'
                        }`}>
                          {notificacao.titulo}
                        </h4>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold border ${config.badgeBg}`}>
                          {config.badgeText}
                        </span>
                        {!notificacao.lida && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {notificacao.descricao}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        {notificacao.valor && (
                          <span className="text-sm font-bold text-gray-900 dark:text-white">
                            R$ {notificacao.valor.toLocaleString('pt-BR')}
                          </span>
                        )}
                        <span className="text-xs text-gray-500">
                          {new Date(notificacao.data).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'short',
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Ação Dispensar */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        dispensarNotificacao(notificacao.id)
                      }}
                      className="p-1.5 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors flex-shrink-0"
                      title="Dispensar"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer do Painel */}
        {notificacoes.length > 0 && (
          <div className="p-4 border-t border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1.5 text-red-600">
                  <FileWarning className="h-4 w-4" />
                  {vencidos} vencidos
                </span>
                <span className="flex items-center gap-1.5 text-orange-600">
                  <AlertTriangle className="h-4 w-4" />
                  {urgentes} urgentes
                </span>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors">
                Configurações
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default NotificationsDropdown
