import { useState, useEffect } from 'react'
import { Sun, Moon, User, Mail, Phone, MapPin } from 'lucide-react'
import { Client } from '../../modules/cliente/types'
import { useSearchParams } from 'react-router-dom'

interface ConfigProps {
  onClose?: () => void
  client?: Client
}

export function Config({ onClose, client }: ConfigProps) {
  const [searchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') === 'meus-dados' ? 'meus-dados' : 'tema'
  const [activeTab, setActiveTab] = useState<'tema' | 'meus-dados'>(initialTab)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  // Carregar tema salvo ao montar
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (savedTheme) {
      setTheme(savedTheme)
      applyTheme(savedTheme)
    } else {
      // Se não tem tema salvo, garantir que está em modo claro
      applyTheme('light')
    }
  }, [])

  // Atualizar aba se a URL mudar
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab === 'meus-dados') {
      setActiveTab('meus-dados')
    }
  }, [searchParams])

  // Aplicar tema ao documento
  const applyTheme = (newTheme: 'light' | 'dark') => {
    const html = document.documentElement

    // Remove qualquer classe de tema antiga
    html.classList.remove('light', 'dark')

    // Adiciona a nova classe
    if (newTheme === 'dark') {
      html.classList.add('dark')
      html.style.colorScheme = 'dark'
    } else {
      html.classList.remove('dark')
      html.style.colorScheme = 'light'
    }

    // Salva no localStorage
    localStorage.setItem('theme', newTheme)

    // Force re-render
    window.dispatchEvent(new Event('themechange'))
  }

  // Alternar tema
  const toggleTheme = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme)
    applyTheme(newTheme)
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Configurações
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gerencie seus dados e preferências
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-gray-200 dark:border-neutral-700">
        <button
          onClick={() => setActiveTab('tema')}
          className={`pb-4 px-2 font-medium transition-colors relative ${activeTab === 'tema'
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
        >
          Aparência
          {activeTab === 'tema' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400" />
          )}
        </button>
        {client && (
          <button
            onClick={() => setActiveTab('meus-dados')}
            className={`pb-4 px-2 font-medium transition-colors relative ${activeTab === 'meus-dados'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
          >
            Meus Dados
            {activeTab === 'meus-dados' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400" />
            )}
          </button>
        )}
      </div>

      <div className="grid gap-6">
        {activeTab === 'tema' && (
          <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-gray-200 dark:border-neutral-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Tema do Sistema
            </h2>

            {/* Theme Toggle */}
            <div className="space-y-3">
              {/* Light Theme Button */}
              <button
                onClick={() => toggleTheme('light')}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${theme === 'light'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10'
                    : 'border-gray-200 dark:border-neutral-600 bg-gray-50 dark:bg-neutral-700'
                  }`}
              >
                <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-500/20">
                  <Sun className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900 dark:text-white">
                    Claro
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Tema claro com tons brancos
                  </p>
                </div>
                {theme === 'light' && (
                  <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </button>

              {/* Dark Theme Button */}
              <button
                onClick={() => toggleTheme('dark')}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${theme === 'dark'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10'
                    : 'border-gray-200 dark:border-neutral-600 bg-gray-50 dark:bg-neutral-700'
                  }`}
              >
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-500/20">
                  <Moon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900 dark:text-white">
                    Escuro
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Tema escuro com tons suaves
                  </p>
                </div>
                {theme === 'dark' && (
                  <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </button>
            </div>

            <div className="mt-6 p-4 rounded-lg bg-gray-100 dark:bg-neutral-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Pré-visualização:
              </p>
              <div
                className={`p-4 rounded-lg text-center font-medium transition-colors ${theme === 'light'
                    ? 'bg-white text-gray-900'
                    : 'bg-neutral-800 text-white'
                  }`}
              >
                {theme === 'light' ? '☀️ Modo Claro' : '🌙 Modo Escuro'}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'meus-dados' && client && (
          <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-gray-200 dark:border-neutral-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Informações Pessoais
            </h2>

            <div className="flex flex-col md:flex-row gap-8">
              {/* Avatar Section */}
              <div className="flex flex-col items-center space-y-4">
                <div className="w-32 h-32 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center border-4 border-white dark:border-neutral-700 shadow-lg">
                  <User className="w-16 h-16 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-gray-900 dark:text-white">{client.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Cliente</p>
                </div>
              </div>

              {/* Data Grid */}
              <div className="flex-1 grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Nome Completo
                  </label>
                  <div className="p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg text-gray-900 dark:text-white border border-gray-200 dark:border-neutral-600">
                    {client.name}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <div className="p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg text-gray-900 dark:text-white border border-gray-200 dark:border-neutral-600">
                    {client.email}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Telefone
                  </label>
                  <div className="p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg text-gray-900 dark:text-white border border-gray-200 dark:border-neutral-600">
                    {client.phone}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Tipo de Serviço
                  </label>
                  <div className="p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg text-gray-900 dark:text-white border border-gray-200 dark:border-neutral-600">
                    {client.serviceType}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-neutral-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Para alterar seus dados, entre em contato com o suporte.
              </p>
            </div>
          </div>
        )}
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="w-full mt-6 py-3 px-4 bg-gray-200 dark:bg-neutral-700 text-gray-900 dark:text-white rounded-xl hover:bg-gray-300 dark:hover:bg-neutral-600 transition-colors font-medium"
        >
          Fechar
        </button>
      )}
    </div>
  )
}
