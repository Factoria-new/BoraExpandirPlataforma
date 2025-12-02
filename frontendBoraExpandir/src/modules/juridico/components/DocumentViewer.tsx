import { useState, useEffect } from "react";
import { FileText, Loader2 } from "lucide-react";

interface DocumentViewerProps {
  filePath: string;
}

export function DocumentViewer({ filePath }: DocumentViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Simula o carregamento de URL segura
  useEffect(() => {
    setIsLoading(true);
    setError(false);

    // Simula a chamada ao Supabase Storage
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Em produção, aqui seria:
      // const { data } = await supabase.storage
      //   .from('documentos_privados')
      //   .createSignedUrl(filePath, 60);
    }, 800);

    return () => clearTimeout(timer);
  }, [filePath]);

  const isPdf = filePath.endsWith(".pdf");

  if (isLoading) {
    return (
      <div className="h-[600px] border-2 border-dashed rounded-lg bg-muted/30 flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
          A carregar documento seguro...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[600px] border-2 border-dashed rounded-lg bg-destructive-light flex flex-col items-center justify-center gap-4">
        <FileText className="h-12 w-12 text-destructive" />
        <div className="text-center">
          <p className="font-medium text-destructive">Erro ao carregar documento</p>
          <p className="text-sm text-muted-foreground mt-1">
            Verifique a conexão ou contacte o suporte
          </p>
        </div>
      </div>
    );
  }

  // Por agora, mostra um placeholder visual do tipo de documento
  return (
    <div className="h-[600px] border-2 rounded-lg overflow-hidden shadow-inner bg-card">
      {isPdf ? (
        <div className="h-full w-full bg-muted/20 flex flex-col items-center justify-center gap-4 p-8">
          <FileText className="h-16 w-16 text-primary" />
          <div className="text-center space-y-2">
            <p className="font-semibold text-lg">Visualizador de PDF</p>
            <p className="text-sm text-muted-foreground max-w-md">
              Em produção, este componente exibirá o PDF usando uma URL assinada
              temporária do Supabase Storage que expira em 60 segundos.
            </p>
            <code className="text-xs bg-muted px-3 py-1 rounded block mt-4">
              {filePath}
            </code>
          </div>
        </div>
      ) : (
        <div className="h-full w-full bg-muted/20 flex flex-col items-center justify-center gap-4 p-8">
          <FileText className="h-16 w-16 text-primary" />
          <div className="text-center space-y-2">
            <p className="font-semibold text-lg">Visualizador de Imagem</p>
            <p className="text-sm text-muted-foreground max-w-md">
              Em produção, este componente exibirá a imagem usando uma URL assinada
              temporária do Supabase Storage.
            </p>
            <code className="text-xs bg-muted px-3 py-1 rounded block mt-4">
              {filePath}
            </code>
          </div>
        </div>
      )}
    </div>
  );
}
