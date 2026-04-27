-- NR-12 Industrial Control Panel - Database Schema (Updated v2)
-- Run this in the Supabase SQL Editor

-- 1. Table: machines
CREATE TABLE IF NOT EXISTS machines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  manufacturer text,
  model text,
  machine_type text CHECK (machine_type IN ('sopradora', 'prensa_mecanica', 'prensa_hidraulica', 'dobradeira', 'robo', 'alimentador', 'solda', 'outro')),
  sector text,
  risk_level text CHECK (risk_level IN ('extremo', 'alto', 'medio', 'baixo')),
  plr_required text,
  anomaly text,
  action_required text,
  compliance_pct integer DEFAULT 0 CHECK (compliance_pct >= 0 AND compliance_pct <= 100),
  status text DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_progresso', 'concluido')),
  notes text,
  cover_image_url text,
  open_gaps_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Table: machine_images
CREATE TABLE IF NOT EXISTS machine_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  machine_id uuid REFERENCES machines(id) ON DELETE CASCADE,
  url text NOT NULL,
  caption text,
  uploaded_at timestamptz DEFAULT now()
);

-- 3. Table: machine_documents
CREATE TABLE IF NOT EXISTS machine_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  machine_id uuid REFERENCES machines(id) ON DELETE CASCADE,
  doc_number text,
  title text NOT NULL,
  category text CHECK (category IN ('manual_fabricante', 'desenho_tecnico', 'diagrama_eletrico', 'diagrama_hidraulico', 'diagrama_pneumatico', 'lista_pecas', 'analise_risco', 'laudo', 'procedimento', 'treinamento', 'certificacao', 'outro')),
  language text,
  file_url text,
  ai_summary text,
  ai_analyzed_at timestamptz,
  ai_risk_flags jsonb,
  ai_gaps_detected boolean DEFAULT false,
  file_size_kb integer,
  uploaded_at timestamptz DEFAULT now()
);

-- 4. Table: document_gaps (NEW)
CREATE TABLE IF NOT EXISTS document_gaps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  machine_id uuid REFERENCES machines(id) ON DELETE CASCADE,
  machine_name text,
  title text NOT NULL,
  severity text CHECK (severity IN ('critico', 'alto', 'medio', 'informativo')),
  source text DEFAULT 'manual' CHECK (source IN ('ia', 'manual')),
  resolved boolean DEFAULT false,
  resolved_at timestamptz,
  doc_id uuid REFERENCES machine_documents(id) ON DELETE SET NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- 5. Table: machine_parts
CREATE TABLE IF NOT EXISTS machine_parts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  machine_id uuid REFERENCES machines(id) ON DELETE CASCADE,
  part_name text NOT NULL,
  part_code text,
  quantity integer DEFAULT 1,
  unit_price_brl decimal(10,2),
  status text DEFAULT 'pendente' CHECK (status IN ('pendente', 'cotado', 'comprado', 'instalado')),
  supplier text,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- INDEXES
CREATE UNIQUE INDEX IF NOT EXISTS idx_doc_number_per_machine
  ON machine_documents(machine_id, doc_number)
  WHERE doc_number IS NOT NULL;

-- VIEWS
CREATE OR REPLACE VIEW next_doc_number_per_machine AS
SELECT
  m.id   AS machine_id,
  m.name AS machine_name,
  COALESCE(MAX(
    CAST(
      SPLIT_PART(md.doc_number, '-', 2)
    AS integer)
  ), 0) + 1 AS next_number
FROM machines m
LEFT JOIN machine_documents md
  ON md.machine_id = m.id
  AND md.doc_number IS NOT NULL
  AND md.doc_number ~ '^[A-Z0-9]+-[0-9]+$'
GROUP BY m.id, m.name;

-- TRIGGERS & FUNCTIONS
CREATE OR REPLACE FUNCTION update_machine_gaps_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    UPDATE machines
    SET open_gaps_count = (
      SELECT COUNT(*) FROM document_gaps
      WHERE machine_id = OLD.machine_id AND resolved = false
    )
    WHERE id = OLD.machine_id;
    RETURN OLD;
  ELSE
    UPDATE machines
    SET open_gaps_count = (
      SELECT COUNT(*) FROM document_gaps
      WHERE machine_id = NEW.machine_id AND resolved = false
    )
    WHERE id = NEW.machine_id;
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_gaps_count ON document_gaps;
CREATE TRIGGER trg_update_gaps_count
AFTER INSERT OR UPDATE OR DELETE ON document_gaps
FOR EACH ROW EXECUTE FUNCTION update_machine_gaps_count();

-- RLS
ALTER TABLE machines ENABLE ROW LEVEL SECURITY;
ALTER TABLE machine_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE machine_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_gaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE machine_parts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for authenticated" ON machines FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated" ON machine_images FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated" ON machine_documents FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated" ON document_gaps FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated" ON machine_parts FOR ALL TO authenticated USING (true);

-- STORAGE POLICIES
-- Certifique-se de que os buckets 'machine-images' e 'machine-docs' existem.
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id IN ('machine-images', 'machine-docs'));
CREATE POLICY "Allow Upload for All" ON storage.objects FOR INSERT WITH CHECK (bucket_id IN ('machine-images', 'machine-docs'));
CREATE POLICY "Allow Update for All" ON storage.objects FOR UPDATE WITH CHECK (bucket_id IN ('machine-images', 'machine-docs'));
CREATE POLICY "Allow Delete for All" ON storage.objects FOR DELETE USING (bucket_id IN ('machine-images', 'machine-docs'));
