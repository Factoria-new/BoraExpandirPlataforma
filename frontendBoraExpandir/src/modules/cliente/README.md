# Módulo Cliente - Portal do Cliente

Portal completo para acompanhamento de processos de documentação e imigração.

## 📁 Estrutura

```
cliente/
├── ClienteApp.tsx          # Componente principal (rota raiz)
├── components/
│   ├── ui/                 # Componentes base
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── progress.tsx
│   ├── Dashboard.tsx       # Página principal
│   ├── DocumentStatus.tsx  # Listagem e filtros de documentos
│   ├── DocumentUpload.tsx  # Upload com drag & drop
│   ├── DocumentModal.tsx   # Modal de visualização
│   ├── Notifications.tsx   # Centro de notificações
│   ├── ProcessTimeline.tsx # Timeline do processo
│   └── Sidebar.tsx        # Navegação lateral
├── lib/
│   ├── mock-data.ts       # Dados de demonstração
│   └── utils.ts           # Funções utilitárias
└── types/
    └── index.ts           # Definições TypeScript
```

## ✅ Funcionalidades Implementadas

### Dashboard
- Visão geral do progresso
- Estatísticas de documentos
- Lista de documentos recentes
- Alertas de ações necessárias

### Gestão de Documentos
- Upload com drag & drop
- Status em tempo real (Pendente, Análise, Aprovado, Rejeitado)
- Filtros por status
- Modal de visualização detalhada
- Sistema de rejeição com motivos

### Timeline do Processo
- 4 etapas visuais
- Barra de progresso
- Status de cada fase
- Datas de conclusão

### Notificações
- 4 tipos: info, warning, error, success
- Marcar como lida (individual/massa)
- Filtros (Todas/Não Lidas)
- Contador de não lidas

### Controle de Acesso
- Verificação de pagamento
- Tela de bloqueio com feedback
- Preparado para webhook

## 🚀 Como Usar

O `ClienteApp.tsx` é o ponto de entrada. Ele gerencia:
- Estado global (documentos, notificações)
- Navegação entre páginas
- Lógica de upload/exclusão
- Controle de acesso

### Rotas
- `/cliente` → Redireciona para dashboard
- `/cliente/dashboard` → Dashboard
- `/cliente/process` → Timeline do processo  
- `/cliente/documents` → Status dos documentos
- `/cliente/upload` → Upload de documentos
- `/cliente/notifications` → Centro de notificações

## 📝 Dados Mock

Atualmente usa `mock-data.ts` com:
- Cliente exemplo (João Silva)
- 4 documentos com diferentes status
- Processo de 4 etapas
- 3 notificações
- 4 tipos de documentos requeridos

## 🔧 Próximos Passos

1. **Backend Integration**
   - Conectar com API real
   - Upload real de arquivos
   - WebSocket para atualizações

2. **Autenticação**
   - Sistema de login
   - Proteção de rotas
   - Sessões persistentes

3. **Webhook de Pagamento**
   - Integração Stripe/Mercado Pago
   - Atualização automática de acesso

## 💡 Notas Técnicas

- **Estado Local**: Usa `useState` do React
- **Navegação**: Gerenciada via estado (não react-router dentro do módulo)
- **Responsivo**: Layout mobile-first
- **Acessibilidade**: Suporte parcial (pode melhorar)
- **Performance**: Sem otimizações avançadas ainda
