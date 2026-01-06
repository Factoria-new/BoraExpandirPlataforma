/**
 * Serviço de Cálculo de Comissão e Markup
 * 
 * Regras atuais (configuráveis futuramente pelo Super Admin):
 * - Venda própria (prospecção do funcionário): 12%
 * - Venda do bot (funcionário só conclui): 8%
 * - Markup da plataforma sobre orçamentos: 30%
 */

// Tipos de origem da venda
export type OrigemVenda = 'propria' | 'bot'

// Configuração das regras de comissão (futuramente vem do Super Admin)
export const regrasComissao = {
  propria: {
    percentual: 12,
    descricao: 'Venda própria (prospecção)'
  },
  bot: {
    percentual: 8,
    descricao: 'Venda do bot (conclusão)'
  }
} as const

// Configuração do markup da plataforma (futuramente vem do Super Admin)
export const configPlataforma = {
  markupPercentual: 30, // Percentual de lucro da plataforma sobre o valor do tradutor
  descricao: 'Markup da plataforma sobre orçamentos'
} as const

/**
 * Calcula o valor da comissão com base no valor da venda e origem
 */
export function calcularComissao(valorVenda: number, origem: OrigemVenda): {
  percentual: number
  valorComissao: number
  descricao: string
} {
  const regra = regrasComissao[origem]
  const valorComissao = (valorVenda * regra.percentual) / 100

  return {
    percentual: regra.percentual,
    valorComissao: Math.round(valorComissao * 100) / 100, // Arredonda para 2 casas decimais
    descricao: regra.descricao
  }
}

/**
 * Calcula o valor final para o cliente com markup da plataforma
 * @param valorTradutor - Valor que o tradutor está cobrando
 * @returns Objeto com valor final ao cliente, markup aplicado e percentual
 */
export function calcularValorComMarkup(valorTradutor: number): {
  valorTradutor: number
  valorMarkup: number
  valorFinalCliente: number
  percentualMarkup: number
} {
  const percentual = configPlataforma.markupPercentual
  const valorMarkup = (valorTradutor * percentual) / 100
  const valorFinalCliente = valorTradutor + valorMarkup

  return {
    valorTradutor: Math.round(valorTradutor * 100) / 100,
    valorMarkup: Math.round(valorMarkup * 100) / 100,
    valorFinalCliente: Math.round(valorFinalCliente * 100) / 100,
    percentualMarkup: percentual
  }
}

/**
 * Retorna o percentual de markup atual da plataforma
 */
export function getMarkupPercentual(): number {
  return configPlataforma.markupPercentual
}

/**
 * Retorna o percentual de comissão com base na origem
 */
export function getPercentualComissao(origem: OrigemVenda): number {
  return regrasComissao[origem].percentual
}

/**
 * Retorna a descrição da origem da venda
 */
export function getDescricaoOrigem(origem: OrigemVenda): string {
  return regrasComissao[origem].descricao
}

/**
 * Retorna o label amigável para a origem
 */
export function getLabelOrigem(origem: OrigemVenda): string {
  switch (origem) {
    case 'propria':
      return 'Venda Própria'
    case 'bot':
      return 'Via Bot'
    default:
      return 'Desconhecido'
  }
}

/**
 * Gera a data com X dias à frente (útil para prazos padrão)
 */
export function getDataPrazoPadrao(diasAFrente: number = 5): string {
  const data = new Date()
  data.setDate(data.getDate() + diasAFrente)
  return data.toISOString().split('T')[0]
}
