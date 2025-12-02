import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Switch } from "../../components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { Plus, Trash2, GripVertical } from "lucide-react";

interface Document {
  id: string;
  name: string;
  stage: string;
  required: boolean;
}

interface Service {
  id: string;
  name: string;
  basePrice: string;
  documents: Document[];
}

const mockServices: Service[] = [
  {
    id: "1",
    name: "Visto D7",
    basePrice: "3500.00",
    documents: [
      { id: "1", name: "Passaporte", stage: "1", required: true },
      { id: "2", name: "Certidão de Antecedentes", stage: "1", required: true },
      { id: "3", name: "Comprovante de Renda", stage: "2", required: true },
    ],
  },
  {
    id: "2",
    name: "Cidadania Italiana",
    basePrice: "5000.00",
    documents: [],
  },
];

export default function ServiceCatalog() {
  const [selectedService, setSelectedService] = useState<Service>(mockServices[0]);
  const [documents, setDocuments] = useState<Document[]>(selectedService.documents);

  const addDocument = () => {
    const newDoc: Document = {
      id: Math.random().toString(),
      name: "",
      stage: "1",
      required: true,
    };
    setDocuments([...documents, newDoc]);
  };

  const removeDocument = (id: string) => {
    setDocuments(documents.filter((doc) => doc.id !== id));
  };

  const updateDocument = (id: string, field: keyof Document, value: string | boolean) => {
    setDocuments(
      documents.map((doc) => (doc.id === id ? { ...doc, [field]: value } : doc))
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Catálogo de Serviços</h1>
        <p className="text-muted-foreground mt-2">
          Configure serviços, preços e documentos necessários
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Services List */}
        <Card className="bg-card border-border lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-foreground">Serviços Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockServices.map((service) => (
                <button
                  key={service.id}
                  onClick={() => {
                    setSelectedService(service);
                    setDocuments(service.documents);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    selectedService.id === service.id
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "bg-muted/50 text-foreground hover:bg-muted"
                  }`}
                >
                  <div className="font-medium">{service.name}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    €{service.basePrice}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Service Editor */}
        <Card className="bg-card border-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-foreground">Editor de Serviço</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="service-name" className="text-foreground">
                  Nome do Serviço
                </Label>
                <Input
                  id="service-name"
                  value={selectedService.name}
                  className="bg-input border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="base-price" className="text-foreground">
                  Preço Base (€)
                </Label>
                <Input
                  id="base-price"
                  type="number"
                  value={selectedService.basePrice}
                  className="bg-input border-border text-foreground"
                />
              </div>
            </div>

            <Separator className="bg-border" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Checklist de Documentos
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Configure os documentos necessários por etapa
                  </p>
                </div>
                <Button
                  onClick={addDocument}
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar
                </Button>
              </div>

              <div className="space-y-3">
                {documents.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum documento configurado. Clique em "Adicionar" para começar.
                  </div>
                ) : (
                  documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center gap-3 p-4 rounded-lg bg-admin-surface border border-border"
                    >
                      <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />

                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Input
                          placeholder="Nome do documento"
                          value={doc.name}
                          onChange={(e) => updateDocument(doc.id, "name", e.target.value)}
                          className="bg-input border-border text-foreground"
                        />

                        <Select
                          value={doc.stage}
                          onValueChange={(value) => updateDocument(doc.id, "stage", value)}
                        >
                          <SelectTrigger className="bg-input border-border text-foreground">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border-border">
                            <SelectItem value="1">Etapa 1</SelectItem>
                            <SelectItem value="2">Etapa 2</SelectItem>
                            <SelectItem value="3">Etapa 3</SelectItem>
                            <SelectItem value="4">Etapa 4</SelectItem>
                          </SelectContent>
                        </Select>

                        <div className="flex items-center gap-2">
                          <Switch
                            checked={doc.required}
                            onCheckedChange={(checked) =>
                              updateDocument(doc.id, "required", checked)
                            }
                          />
                          <span className="text-sm text-foreground">Obrigatório</span>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeDocument(doc.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" className="border-border text-foreground">
                Descartar
              </Button>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Salvar Alterações
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
