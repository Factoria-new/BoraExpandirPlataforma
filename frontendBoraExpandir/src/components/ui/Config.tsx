import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'

interface ConfigProps {
  onClose?: () => void
}

export function Config({ onClose }: ConfigProps) {
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
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Configurações
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Personalize sua experiência
        </p>
      </div>

      {/* Theme Section */}
      <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-gray-200 dark:border-neutral-700 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Tema
        </h2>

        {/* Theme Toggle */}
        <div className="space-y-3">
          {/* Light Theme Button */}
          <button
            onClick={() => toggleTheme('light')}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
              theme === 'light'
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
            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
              theme === 'dark'
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

        {/* Theme Preview */}
        <div className="mt-6 p-4 rounded-lg bg-gray-100 dark:bg-neutral-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Pré-visualização:
          </p>
          <div
            className={`p-4 rounded-lg text-center font-medium transition-colors ${
              theme === 'light'
                ? 'bg-white text-gray-900'
                : 'bg-neutral-800 text-white'
            }`}
          >
            {theme === 'light' ? '☀️ Modo Claro' : '🌙 Modo Escuro'}
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-lg p-4">
        <p className="text-sm text-blue-900 dark:text-blue-200">
          💡 O tema escolhido será salvo automaticamente em seu navegador.
        </p>
      </div>

      {/* Close Button (para modal) */}
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
