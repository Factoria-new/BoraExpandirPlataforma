-- Migration to add requerimento_id to documentos table
-- This allows linking individual document requests to a specific requirement container.

ALTER TABLE IF EXISTS public.documentos 
ADD COLUMN IF NOT EXISTS requerimento_id UUID REFERENCES public.requerimentos(id) ON DELETE SET NULL;

-- Create an index for better performance when fetching documents by requirement
CREATE INDEX IF NOT EXISTS idx_documentos_requerimento_id ON public.documentos(requerimento_id);

-- Refresh PostgREST schema cache (if applicable/needed)
NOTIFY pgrst, 'reload schema';
