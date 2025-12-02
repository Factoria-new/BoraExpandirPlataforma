/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string
  // adicione outras variáveis VITE_ aqui conforme necessário
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
