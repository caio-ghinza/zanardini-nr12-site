# Exemplos de Migrações Supabase

## Exemplo 1 — Criar tabela simples

**Pedido do usuário:** "Cria uma tabela de máquinas"

**Arquivo:** `/supabase/01_tabela-maquinas.sql`

```sql
-- ============================================================
-- Migration: 01_tabela-maquinas.sql
-- Descrição: Cria a tabela principal de máquinas do sistema
-- Depende de: nenhum
-- Criado em: 2025-01-15
-- ============================================================

CREATE TABLE IF NOT EXISTS maquinas (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  nome        text        NOT NULL,
  descricao   text,
  status      text        NOT NULL DEFAULT 'ativa',
  created_at  timestamptz DEFAULT now() NOT NULL,
  updated_at  timestamptz DEFAULT now() NOT NULL
);

-- Índice para buscas por status
CREATE INDEX IF NOT EXISTS idx_maquinas_status ON maquinas(status);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_maquinas_updated_at ON maquinas;
CREATE TRIGGER trg_maquinas_updated_at
  BEFORE UPDATE ON maquinas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ✅ Resultado: tabela `maquinas` com id, nome, descricao, status, timestamps
```

---

## Exemplo 2 — Adicionar coluna a tabela existente

**Pedido do usuário:** "Quero guardar a localização de cada máquina"

**Arquivo:** `/supabase/02_adiciona-localizacao-maquina.sql`

```sql
-- ============================================================
-- Migration: 02_adiciona-localizacao-maquina.sql
-- Descrição: Adiciona coluna de localização à tabela maquinas
-- Depende de: 01_tabela-maquinas.sql
-- Criado em: 2025-01-16
-- ============================================================

ALTER TABLE maquinas
  ADD COLUMN IF NOT EXISTS localizacao text,
  ADD COLUMN IF NOT EXISTS latitude    numeric(10, 7),
  ADD COLUMN IF NOT EXISTS longitude   numeric(10, 7);

-- ✅ Resultado: maquinas agora tem localizacao, latitude, longitude
```

---

## Exemplo 3 — Enum para opções fixas

**Pedido do usuário:** "O status da máquina deve ser: ativa, inativa, manutenção"

**Arquivo:** `/supabase/03_enum-status-maquina.sql`

```sql
-- ============================================================
-- Migration: 03_enum-status-maquina.sql
-- Descrição: Cria enum de status e aplica na tabela maquinas
-- Depende de: 01_tabela-maquinas.sql
-- Criado em: 2025-01-17
-- ============================================================

-- Criar o enum (seguro se já existir)
DO $$ BEGIN
  CREATE TYPE status_maquina AS ENUM ('ativa', 'inativa', 'manutencao');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Converter coluna existente para o enum
ALTER TABLE maquinas
  ALTER COLUMN status TYPE status_maquina
  USING status::status_maquina;

-- Atualizar o valor padrão
ALTER TABLE maquinas
  ALTER COLUMN status SET DEFAULT 'ativa'::status_maquina;

-- ✅ Resultado: coluna status agora usa o tipo enum status_maquina
```

---

## Exemplo 4 — Tabela com relacionamento (FK)

**Pedido do usuário:** "Cada máquina pertence a uma categoria"

**Arquivo:** `/supabase/04_tabela-categorias-e-relacao.sql`

```sql
-- ============================================================
-- Migration: 04_tabela-categorias-e-relacao.sql
-- Descrição: Cria tabela de categorias e relaciona com maquinas
-- Depende de: 01_tabela-maquinas.sql
-- Criado em: 2025-01-18
-- ============================================================

-- Criar tabela de categorias
CREATE TABLE IF NOT EXISTS categorias (
  id    uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nome  text NOT NULL UNIQUE,
  icone text
);

-- Adicionar FK em maquinas
ALTER TABLE maquinas
  ADD COLUMN IF NOT EXISTS categoria_id uuid REFERENCES categorias(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_maquinas_categoria ON maquinas(categoria_id);

-- ✅ Resultado: tabela categorias criada; maquinas.categoria_id aponta para ela
```

---

## Exemplo 5 — Políticas RLS

**Pedido do usuário:** "Só o dono pode ver e editar suas máquinas"

**Arquivo:** `/supabase/05_politica-rls-maquinas.sql`

```sql
-- ============================================================
-- Migration: 05_politica-rls-maquinas.sql
-- Descrição: Habilita RLS e cria políticas de acesso em maquinas
-- Depende de: 01_tabela-maquinas.sql
-- Criado em: 2025-01-19
-- ============================================================

-- Adicionar coluna de dono (se não existir)
ALTER TABLE maquinas
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Habilitar Row Level Security
ALTER TABLE maquinas ENABLE ROW LEVEL SECURITY;

-- Política: usuário vê apenas suas próprias máquinas
DROP POLICY IF EXISTS "usuario_ve_suas_maquinas" ON maquinas;
CREATE POLICY "usuario_ve_suas_maquinas"
  ON maquinas FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Política: usuário cria máquinas vinculadas ao seu ID
DROP POLICY IF EXISTS "usuario_cria_suas_maquinas" ON maquinas;
CREATE POLICY "usuario_cria_suas_maquinas"
  ON maquinas FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Política: usuário edita apenas suas máquinas
DROP POLICY IF EXISTS "usuario_edita_suas_maquinas" ON maquinas;
CREATE POLICY "usuario_edita_suas_maquinas"
  ON maquinas FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Política: usuário deleta apenas suas máquinas
DROP POLICY IF EXISTS "usuario_deleta_suas_maquinas" ON maquinas;
CREATE POLICY "usuario_deleta_suas_maquinas"
  ON maquinas FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ✅ Resultado: RLS ativo, cada usuário acessa apenas seus próprios registros
```

---

## Exemplo 6 — Seed de dados iniciais

**Pedido do usuário:** "Popula as categorias padrão do sistema"

**Arquivo:** `/supabase/06_seed-categorias-padrao.sql`

```sql
-- ============================================================
-- Migration: 06_seed-categorias-padrao.sql
-- Descrição: Insere categorias padrão (idempotente)
-- Depende de: 04_tabela-categorias-e-relacao.sql
-- Criado em: 2025-01-20
-- ============================================================

INSERT INTO categorias (nome, icone) VALUES
  ('Produção',    '🏭'),
  ('Logística',   '🚚'),
  ('Manutenção',  '🔧'),
  ('Escritório',  '🖥️')
ON CONFLICT (nome) DO NOTHING;  -- Não duplica se já existir

-- ✅ Resultado: 4 categorias padrão inseridas (ou ignoradas se já existirem)
```
