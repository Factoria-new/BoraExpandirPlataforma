import { Copy, Share2, Users, TrendingUp, DollarSign } from "lucide-react";
import React, { useState } from "react";

type LeadRow = {
  client: string;
  date: string;
  status: "Fechado/Pago" | "Proposta Enviada" | "Em Conversa" | "Aguardando Contato";
  value: string;
};

const leads: LeadRow[] = [
  { client: "Empresa XYZ", date: "15/01/2024", status: "Fechado/Pago", value: "R$ 150,00" },
  { client: "Loja ABC Comércio", date: "18/01/2024", status: "Proposta Enviada", value: "R$ 200,00" },
  { client: "Tech Solutions Ltda", date: "22/01/2024", status: "Em Conversa", value: "R$ 175,00" },
  { client: "Indústria Beta", date: "25/01/2024", status: "Aguardando Contato", value: "R$ 300,00" },
];

function StatusBadge({ status }: { status: LeadRow["status"] }) {
  const map: Record<LeadRow["status"], string> = {
    "Fechado/Pago": "bg-green-50 text-green-700 border-green-200",
    "Proposta Enviada": "bg-orange-50 text-orange-700 border-orange-200",
    "Em Conversa": "bg-blue-50 text-blue-700 border-blue-200",
    "Aguardando Contato": "bg-gray-100 text-gray-700 border-gray-200",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${map[status]}`}>
      {status}
    </span>
  );
}

export function PartnerDashboard() {
  const [refLink] = useState("app.empresa.com/r/joao-silva");

  const onCopy = async () => {
    try { await navigator.clipboard.writeText(refLink); } catch {}
  };

  const onShareWhats = () => {
    const msg = encodeURIComponent(`Conheça: ${refLink}`);
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-6xl mx-auto bg-background px-6 py-8 text-foreground">
     
      

        {/* Hero Section */}
        <section className="mb-8 rounded-xl border border-gray-100 bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Seu Link de Indicação</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Compartilhe este link para começar a ganhar comissões
          </p>
          <div className="mt-4 flex flex-col gap-3 md:flex-row">
            <input
              readOnly
              value={refLink}
              className="flex-1 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-foreground"
            />
            <div className="flex gap-3">
              <button
                onClick={onCopy}
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                <Copy className="h-4 w-4" /> Copiar Link
              </button>
              <button
                onClick={onShareWhats}
                className="inline-flex items-center gap-2 rounded-md border border-green-500 bg-white px-4 py-2 text-sm font-medium text-green-600 hover:bg-green-50 dark:bg-card"
              >
                <Share2 className="h-4 w-4" /> Compartilhar no WhatsApp
              </button>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-gray-100 bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Indicações Totais</p>
                <p className="mt-1 text-2xl font-bold">12</p>
              </div>
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="rounded-xl border border-gray-100 bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Em Negociação</p>
                <p className="mt-1 text-2xl font-bold">4</p>
              </div>
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="rounded-xl border border-gray-100 bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Comissão a Receber</p>
                <p className="mt-1 text-2xl font-bold">R$ 450,00</p>
              </div>
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </section>

        {/* Table Section */}
        <section className="rounded-xl border border-gray-100 bg-card p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Acompanhamento de Indicações</h3>
            <p className="text-sm text-muted-foreground">
              Veja o status de todas as suas indicações em tempo real
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-muted-foreground">
                  <th className="px-3 py-2">Cliente</th>
                  <th className="px-3 py-2">Data</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Comissão</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((row, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="px-3 py-3 font-medium text-foreground">{row.client}</td>
                    <td className="px-3 py-3 text-muted-foreground">{row.date}</td>
                    <td className="px-3 py-3"><StatusBadge status={row.status} /></td>
                    <td className="px-3 py-3 font-medium text-foreground">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      
    </div>
  );
}

export default PartnerDashboard;
