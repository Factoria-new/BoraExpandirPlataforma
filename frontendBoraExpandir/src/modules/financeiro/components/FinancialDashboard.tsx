import { TrendingUp, DollarSign, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const kpiData = [
  {
    title: "Receita Confirmada (Mês)",
    value: "R$ 45.200,00",
    icon: DollarSign,
    trend: "up",
    bgClass: "bg-success/10",
    textClass: "text-success",
  },
  {
    title: "A Receber (Próx. 7 dias)",
    value: "R$ 12.500,00",
    icon: TrendingUp,
    trend: "neutral",
    bgClass: "bg-kpi-yellow-bg",
    textClass: "text-kpi-yellow",
  },
  {
    title: "Inadimplência (Atrasados)",
    value: "R$ 3.200,00",
    icon: AlertCircle,
    trend: "down",
    bgClass: "bg-destructive/10",
    textClass: "text-destructive",
  },
];

const chartData = [
  { month: "Jan", previsto: 42000, realizado: 40000 },
  { month: "Fev", previsto: 38000, realizado: 41000 },
  { month: "Mar", previsto: 45000, realizado: 43000 },
  { month: "Abr", previsto: 50000, realizado: 48000 },
  { month: "Mai", previsto: 47000, realizado: 45200 },
];

export function FinancialDashboard() {
  return (
    <main className="flex-1 overflow-y-auto bg-background">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Visão Geral - Financeiro</h1>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {kpiData.map((kpi) => (
            <Card key={kpi.title} className={kpi.bgClass}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {kpi.title}
                </CardTitle>
                <kpi.icon className={`h-5 w-5 ${kpi.textClass}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold font-mono ${kpi.textClass}`}>
                  {kpi.value}
                </div>
                {kpi.trend === "up" && (
                  <p className="text-xs text-success mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +8% vs mês anterior
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Cash Flow Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Fluxo de Caixa: Previsto vs Realizado</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-sm" />
                <YAxis className="text-sm" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => `R$ ${Number(value).toLocaleString("pt-BR")}`}
                />
                <Legend />
                <Bar dataKey="previsto" fill="hsl(var(--muted-foreground))" name="Previsto" />
                <Bar dataKey="realizado" fill="hsl(var(--success))" name="Realizado" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
