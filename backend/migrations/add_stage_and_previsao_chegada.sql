-- Migration: Add stage and previsao_chegada columns to clientes table
-- Created: 2026-02-09

-- Step 1: Create ENUM type for process stages
DO $$ BEGIN
    CREATE TYPE cliente_stage AS ENUM (
        'formularios',
        'aguardando_consultoria',
        'clientes_c2',
        'aguardando_assessoria',
        'assessoria_andamento',
        'assessoria_finalizada',
        'cancelado'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Step 2: Add stage column to clientes table
ALTER TABLE clientes 
ADD COLUMN IF NOT EXISTS stage cliente_stage DEFAULT 'formularios';

-- Step 3: Add previsao_chegada column to clientes table
ALTER TABLE clientes 
ADD COLUMN IF NOT EXISTS previsao_chegada DATE;

-- Step 4: Update existing records to map current status to stage
-- This maps the old 'status' field to the new 'stage' field
UPDATE clientes 
SET stage = CASE 
    WHEN status = 'cadastrado' THEN 'assessoria_andamento'::cliente_stage
    WHEN status = 'em_conversa' THEN 'aguardando_consultoria'::cliente_stage
    WHEN status = 'proposta_enviada' THEN 'aguardando_assessoria'::cliente_stage
    WHEN status = 'fechado_pago' THEN 'assessoria_andamento'::cliente_stage
    ELSE 'formularios'::cliente_stage
END
WHERE stage IS NULL;

-- Step 5: Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_clientes_stage ON clientes(stage);
CREATE INDEX IF NOT EXISTS idx_clientes_previsao_chegada ON clientes(previsao_chegada);

-- Optional: Add comment to document the column
COMMENT ON COLUMN clientes.stage IS 'Estágio atual do processo de assessoria do cliente';
COMMENT ON COLUMN clientes.previsao_chegada IS 'Data prevista de chegada do cliente em Portugal';
