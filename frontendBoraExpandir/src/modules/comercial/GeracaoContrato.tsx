import React, { useState, useMemo } from 'react'
import { X, Save, FileText, DollarSign, Plus, Trash2 } from 'lucide-react'
import type { ContratoFormData, Cliente } from '../../types/comercial'
import { CONTRATOS_TEMPLATES, FORMAS_PAGAMENTO, type ParcelaPagamento } from '../../types/templates'

interface GeracaoContratoProps {
  onClose: () => void
  onSave: (contrato: ContratoFormData) => Promise<void>
  clientes: Cliente[]
}

interface FormState {
  cliente_id: string
  template_id: string
  valores_template: Record<string, string>
  valor_total: number
  parcelas: ParcelaPagamento[]
}

export default function GeracaoContrato({ onClose, onSave, clientes }: GeracaoContratoProps) {
  const [formData, setFormData] = useState<FormState>({
    cliente_id: '',
    template_id: '',
    valores_template: {},
    valor_total: 0,
    parcelas: [],
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<'template' | 'valores' | 'pagamento'>('template')

  const templateSelecionado = useMemo(() => 
    CONTRATOS_TEMPLATES.find(t => t.id === formData.template_id),
    [formData.template_id]
  )

  const clienteSelecionado = useMemo(() =>
    clientes.find(c => c.id === formData.cliente_id),
    [formData.cliente_id, clientes]
  )

  const conteudoProcessado = useMemo(() => {
    if (!templateSelecionado) return ''
    
    let html = templateSelecionado.conteudoHtml
    
    // Substituir valores do cliente
    html = html.replace('[CLIENTE_NOME]', clienteSelecionado?.nome || '___________')
    
    // Substituir valores do template
    Object.entries(formData.valores_template).forEach(([chave, valor]) => {
      const regex = new RegExp(`\\[${chave.toUpperCase()}\\]`, 'g')
      html = html.replace(regex, valor)
    })

    // Substituir valor total
    html = html.replace('[VALOR_TOTAL]', formData.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 }))
    html = html.replace('[CONDICOES_PAGAMENTO]', gerarCondicoesPagamento() || 'A ser definido')

    return html
  }, [templateSelecionado, formData.valores_template, formData.valor_total, clienteSelecionado, formData.parcelas])

  const handleTemplateChange = (templateId: string) => {
    setFormData(prev => ({
      ...prev,
      template_id: templateId,
      valores_template: {},
    }))
    setStep('valores')
  }

  const handleValorTemplateChange = (campo: string, valor: string) => {
    setFormData(prev => ({
      ...prev,
      valores_template: {
        ...prev.valores_template,
        [campo.toLowerCase()]: valor
      }
    }))
  }

  const handleValorTotalChange = (valor: number) => {
    setFormData(prev => ({
      ...prev,
      valor_total: valor,
      // Auto-gerar primeira parcela se não existir
      parcelas: prev.parcelas.length === 0 
        ? [{ numero: 1, valor, forma: 'dinheiro' }]
        : prev.parcelas
    }))
  }

  const adicionarParcela = () => {
    const proximoNumero = Math.max(...formData.parcelas.map(p => p.numero), 0) + 1
    setFormData(prev => ({
      ...prev,
      parcelas: [
        ...prev.parcelas,
        { numero: proximoNumero, valor: 0, forma: 'dinheiro' }
      ]
    }))
  }

  const removerParcela = (numero: number) => {
    setFormData(prev => ({
      ...prev,
      parcelas: prev.parcelas.filter(p => p.numero !== numero)
    }))
  }

  const atualizarParcela = (numero: number, campo: string, valor: any) => {
    setFormData(prev => ({
      ...prev,
      parcelas: prev.parcelas.map(p =>
        p.numero === numero
          ? { ...p, [campo]: valor }
          : p
      )
    }))
  }

  const totalParcelas = formData.parcelas.reduce((acc, p) => acc + p.valor, 0)
  const diferenca = formData.valor_total - totalParcelas

  const gerarCondicoesPagamento = () => {
    if (formData.parcelas.length === 0) return ''
    
    let texto = `Condições de pagamento:\n`
    formData.parcelas.forEach(parcela => {
      const forma = FORMAS_PAGAMENTO.find(f => f.tipo === parcela.forma)
      texto += `\n- Parcela ${parcela.numero}: R$ ${parcela.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (${forma?.nome || 'Não definido'})`
      if (parcela.dataPagamento) {
        texto += ` - Vencimento: ${new Date(parcela.dataPagamento).toLocaleDateString('pt-BR')}`
      }
    })
    return texto
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.cliente_id || !templateSelecionado) {
      setError('Preencha todos os campos obrigatórios')
      return
    }

    if (formData.valor_total <= 0) {
      setError('Valor total deve ser maior que zero')
      return
    }

    if (formData.parcelas.length === 0 || diferenca !== 0) {
      setError('Parcelas devem somar exatamente o valor total')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const contratoData: ContratoFormData = {
        cliente_id: formData.cliente_id,
        titulo: templateSelecionado.nome,
        descricao: `${templateSelecionado.descricao} - Valor: R$ ${formData.valor_total.toLocaleString('pt-BR')}`,
        valor: formData.valor_total,
        template_tipo: templateSelecionado.tipo,
        conteudo_html: conteudoProcessado,
      }

      await onSave(contratoData)
      onClose()
    } catch (err: any) {
      setError(err.message || 'Erro ao gerar contrato')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-900">Gerar Novo Contrato</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Step Indicators */}
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => setStep('template')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                step === 'template'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              1. Template
            </button>
            <button
              type="button"
              onClick={() => setStep('valores')}
              disabled={!formData.template_id}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                step === 'valores'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50'
              }`}
            >
              2. Valores
            </button>
            <button
              type="button"
              onClick={() => setStep('pagamento')}
              disabled={!formData.template_id || formData.valor_total <= 0}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                step === 'pagamento'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50'
              }`}
            >
              3. Pagamento
            </button>
          </div>

          {/* STEP 1: Template Selection */}
          {step === 'template' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Selecione o Cliente e Template</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cliente *
                </label>
                <select
                  value={formData.cliente_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, cliente_id: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  required
                >
                  <option value="">Selecione um cliente</option>
                  {clientes.map(cliente => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template de Contrato *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {CONTRATOS_TEMPLATES.map(template => (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => handleTemplateChange(template.id)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        formData.template_id === template.id
                          ? 'border-emerald-600 bg-emerald-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <h4 className="font-semibold text-gray-900 mb-1">{template.nome}</h4>
                      <p className="text-sm text-gray-600">{template.descricao}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Template Values */}
          {step === 'valores' && templateSelecionado && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Preencha os Valores</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templateSelecionado.campos.map(campo => (
                  <div key={campo.id}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {campo.nome} *
                    </label>
                    {campo.tipo === 'textarea' ? (
                      <textarea
                        value={formData.valores_template[campo.id] || ''}
                        onChange={(e) => handleValorTemplateChange(campo.id, e.target.value)}
                        placeholder={campo.placeholder}
                        rows={3}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
                        required
                      />
                    ) : (
                      <input
                        type={campo.tipo}
                        value={formData.valores_template[campo.id] || ''}
                        onChange={(e) => handleValorTemplateChange(campo.id, e.target.value)}
                        placeholder={campo.placeholder}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        required
                      />
                    )}
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor Total do Contrato (R$) *
                  </label>
                  <input
                    type="number"
                    value={formData.valor_total || ''}
                    onChange={(e) => handleValorTotalChange(parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Pré-visualização</h4>
                <div 
                  className="text-sm text-blue-800 max-h-48 overflow-y-auto"
                  dangerouslySetInnerHTML={{ __html: conteudoProcessado }}
                />
              </div>
            </div>
          )}

          {/* STEP 3: Payment */}
          {step === 'pagamento' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Configurar Formas de Pagamento</h3>

              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-emerald-900 font-medium mb-1">Valor Total: R$ {formData.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                <p className="text-sm text-emerald-700">Saldo a alocar: <strong>R$ {diferenca.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong></p>
              </div>

              {/* Parcelas */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">Parcelas</h4>
                  <button
                    type="button"
                    onClick={adicionarParcela}
                    disabled={diferenca <= 0}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 flex items-center gap-1 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.parcelas.length === 0 ? (
                    <p className="text-gray-500 text-sm">Nenhuma parcela adicionada. Clique em "Adicionar" para começar.</p>
                  ) : (
                    formData.parcelas.map(parcela => (
                      <div key={parcela.numero} className="bg-gray-50 p-4 rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <h5 className="font-medium text-gray-900">Parcela #{parcela.numero}</h5>
                          <button
                            type="button"
                            onClick={() => removerParcela(parcela.numero)}
                            className="p-1 hover:bg-red-100 text-red-600 rounded transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Valor (R$)
                            </label>
                            <input
                              type="number"
                              value={parcela.valor || ''}
                              onChange={(e) => atualizarParcela(parcela.numero, 'valor', parseFloat(e.target.value) || 0)}
                              placeholder="0.00"
                              step="0.01"
                              min="0"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Forma de Pagamento
                            </label>
                            <select
                              value={parcela.forma}
                              onChange={(e) => atualizarParcela(parcela.numero, 'forma', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
                            >
                              {FORMAS_PAGAMENTO.map(forma => (
                                <option key={forma.id} value={forma.tipo}>
                                  {forma.icone} {forma.nome}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Data de Vencimento
                            </label>
                            <input
                              type="date"
                              value={parcela.dataPagamento || ''}
                              onChange={(e) => atualizarParcela(parcela.numero, 'dataPagamento', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Resumo */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
                <h4 className="font-semibold text-gray-900">Resumo das Condições</h4>
                <div className="text-sm text-gray-600 whitespace-pre-line max-h-32 overflow-y-auto">
                  {gerarCondicoesPagamento() || 'Nenhuma parcela configurada'}
                </div>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4 sticky bottom-0 bg-white">
            {step !== 'template' && (
              <button
                type="button"
                onClick={() => setStep(step === 'valores' ? 'template' : 'valores')}
                className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                ← Anterior
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>

            {step !== 'pagamento' && (
              <button
                type="button"
                onClick={() => setStep(step === 'template' ? 'valores' : 'pagamento')}
                disabled={
                  (step === 'template' && (!formData.cliente_id || !formData.template_id)) ||
                  (step === 'valores' && formData.valor_total <= 0)
                }
                className="flex-1 px-4 py-2.5 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 disabled:opacity-60 transition-colors"
              >
                Próximo →
              </button>
            )}

            {step === 'pagamento' && (
              <button
                type="submit"
                disabled={loading || diferenca !== 0}
                className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
              >
                <Save className="h-4 w-4" />
                {loading ? 'Gerando...' : 'Gerar Contrato'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
