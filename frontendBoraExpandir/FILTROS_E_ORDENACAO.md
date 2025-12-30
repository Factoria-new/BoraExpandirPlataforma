# Componentes de Filtros e Ordenação

Este documento explica como usar os componentes reutilizáveis de filtros
temporais e ordenação em qualquer tela de listagem.

## Componentes Disponíveis

### 1. TimeRangeFilter

Componente de filtro temporal com opções pré-definidas.

**Localização:** `src/components/ui/TimeRangeFilter.tsx`

**Opções disponíveis:**

- `current_month` - Mês Atual
- `last_month` - Mês Passado
- `last_90_days` - Últimos 90 dias
- `last_6_months` - Últimos 6 meses
- `current_year` - Ano Atual
- `all` - Todos os registros

### 2. SortControl

Componente de controle de ordenação com seleção de campo e direção.

**Localização:** `src/components/ui/SortControl.tsx`

## Como Usar

### Passo 1: Importar os componentes

```tsx
import {
    filterByTimeRange,
    type TimeRange,
    TimeRangeFilter,
} from "../../components/ui/TimeRangeFilter";
import {
    SortControl,
    sortData,
    type SortDirection,
    type SortOption,
} from "../../components/ui/SortControl";
```

### Passo 2: Definir estados

```tsx
const [timeRange, setTimeRange] = useState<TimeRange>("current_month");
const [sortBy, setSortBy] = useState("created_at");
const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
```

### Passo 3: Definir opções de ordenação

```tsx
const sortOptions: SortOption[] = [
    { value: "nome", label: "Nome" },
    { value: "created_at", label: "Data de Cadastro" },
    { value: "updated_at", label: "Última Atualização" },
    { value: "status", label: "Status" },
];
```

### Passo 4: Aplicar filtros e ordenação

```tsx
const filteredData = useMemo(() => {
    // Primeiro filtra por busca
    let filtered = data.filter((item) =>
        item.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Depois filtra por período
    filtered = filterByTimeRange(filtered, timeRange);

    // Por fim ordena
    return sortData(filtered, sortBy, sortDirection);
}, [data, searchTerm, timeRange, sortBy, sortDirection]);
```

### Passo 5: Renderizar os componentes

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-neutral-800/50 rounded-lg border border-gray-200 dark:border-neutral-700">
    <TimeRangeFilter
        value={timeRange}
        onChange={setTimeRange}
    />
    <SortControl
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortChange={(newSortBy, newDirection) => {
            setSortBy(newSortBy);
            setSortDirection(newDirection);
        }}
        options={sortOptions}
    />
</div>;
```

## Exemplo Completo: Tela de Clientes

```tsx
import React, { useMemo, useState } from "react";
import {
    filterByTimeRange,
    type TimeRange,
    TimeRangeFilter,
} from "../../components/ui/TimeRangeFilter";
import {
    SortControl,
    sortData,
    type SortDirection,
    type SortOption,
} from "../../components/ui/SortControl";

interface Cliente {
    id: string;
    nome: string;
    email: string;
    telefone: string;
    created_at: string;
    updated_at: string;
    status: string;
}

const sortOptions: SortOption[] = [
    { value: "nome", label: "Nome" },
    { value: "created_at", label: "Data de Cadastro" },
    { value: "email", label: "E-mail" },
    { value: "status", label: "Status" },
];

export default function ClientesPage() {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [timeRange, setTimeRange] = useState<TimeRange>("current_month");
    const [sortBy, setSortBy] = useState("created_at");
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

    const filteredClientes = useMemo(() => {
        let filtered = clientes.filter((cliente) =>
            cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
        );

        filtered = filterByTimeRange(filtered, timeRange);
        return sortData(filtered, sortBy, sortDirection);
    }, [clientes, searchTerm, timeRange, sortBy, sortDirection]);

    const handleSortChange = (
        newSortBy: string,
        newDirection: SortDirection,
    ) => {
        setSortBy(newSortBy);
        setSortDirection(newDirection);
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Clientes
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Gerencie seus clientes cadastrados
                </p>
            </div>

            {/* Filtros */}
            <div className="mb-6 space-y-4">
                <div className="flex gap-4 items-center">
                    <input
                        type="text"
                        placeholder="Buscar por nome ou email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-neutral-800/50 rounded-lg border border-gray-200 dark:border-neutral-700">
                    <TimeRangeFilter
                        value={timeRange}
                        onChange={setTimeRange}
                    />
                    <SortControl
                        sortBy={sortBy}
                        sortDirection={sortDirection}
                        onSortChange={handleSortChange}
                        options={sortOptions}
                    />
                </div>
            </div>

            {/* Tabela de clientes */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700">
                {/* ... conteúdo da tabela ... */}
            </div>

            {/* Contador */}
            {filteredClientes.length > 0 && (
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                    Exibindo {filteredClientes.length} de {clientes.length}{" "}
                    clientes
                </div>
            )}
        </div>
    );
}
```

## Requisitos

### Estrutura de Dados

Para que os filtros funcionem corretamente, seus dados devem ter:

- `created_at`: string (ISO 8601 date format) - **Obrigatório** para filtros
  temporais
- Outros campos podem ser usados para ordenação

### TypeScript

Os componentes são totalmente tipados. Certifique-se de:

- Importar os tipos `TimeRange`, `SortDirection`, e `SortOption`
- Usar `useMemo` para otimizar performance em listas grandes

## Personalização

### Adicionar novas opções de período

Edite `timeRangeOptions` em `TimeRangeFilter.tsx`:

```tsx
const timeRangeOptions: TimeRangeOption[] = [
    // ... opções existentes
    {
        value: "last_year",
        label: "Ano Passado",
        description: "Todo o ano anterior",
    },
];
```

### Customizar estilos

Todos os componentes usam classes Tailwind e suportam dark mode automaticamente.

## Benefícios

✅ **Reutilizável**: Use em qualquer tela de listagem ✅ **Consistente**: Mesma
UX em todo o sistema ✅ **Performático**: Usa `useMemo` para evitar recálculos
desnecessários ✅ **Acessível**: Labels e aria-labels apropriados ✅
**Responsivo**: Layout adaptável para mobile ✅ **Dark Mode**: Suporte completo
a tema escuro
