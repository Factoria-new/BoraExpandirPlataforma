export type RegisterParceiroDTO = {
  nome: string
  email: string
  telefone?: string
  documento?: string
  [key: string]: unknown
}

export type Parceiro = {
  id: string
  nome: string
  email: string
  telefone?: string
  documento?: string
  criadoEm: Date
  atualizadoEm: Date
}
