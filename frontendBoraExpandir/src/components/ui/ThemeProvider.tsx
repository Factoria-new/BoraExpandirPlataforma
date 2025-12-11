import { useEffect } from 'react'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Inicializar tema ao carregar a aplicação
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    const html = document.documentElement
    
    if (savedTheme === 'dark') {
      html.classList.add('dark')
    } else {
      // Garantir que está em modo claro por padrão
      html.classList.remove('dark')
    }
  }, [])

  return <>{children}</>
}
