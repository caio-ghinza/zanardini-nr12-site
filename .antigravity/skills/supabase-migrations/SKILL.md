---
name: supabase-migrations
description: >
  Use esta skill SEMPRE que o usuário pedir para criar, alterar ou remover qualquer
  estrutura no banco de dados Supabase: tabelas, colunas, índices, políticas RLS,
  funções, triggers, enums, tipos, relacionamentos, seeds de dados ou qualquer
  outra operação DDL/DML. Disparar também quando o usuário mencionar "nova opção",
  "novo campo", "novo modo", "nova tabela", "novo enum", "quero salvar X no banco",
  "adicionar coluna", "criar relação", "permissão no banco" ou qualquer variação.
  Esta skill garante que as migrações sejam seguras, sequenciais e versionadas
  corretamente na pasta /supabase da raiz do projeto.
---

# Supabase Migration Skill

## Objetivo

Gerar arquivos de migração SQL seguros, incrementais e bem documentados para projetos
que usam Supabase como banco de dados. Cada mudança no banco **deve** ser um arquivo
de migração — nunca alterar tabelas diretamente pelo painel do Supabase.

---

## Passo 1 — Avaliar o contexto atual do banco

Antes de escrever qualquer SQL, você DEVE entender o estado atual do banco. Faça isso:

1. **Leia todos os arquivos existentes** em `/supabase/` (ordenados pelo prefixo numérico)
2. **Liste as tabelas já criadas**, colunas, tipos e relacionamentos mencionados nas migrações anteriores
3. **Identifique o próximo número de sequência** (ex: se o último arquivo é `04_...`, o próximo é `05_`)
4. **Verifique conflitos**: a mudança pedida já existe? Vai quebrar algo existente?

```
Exemplo de leitura do contexto:
- /supabase/01_tabela-maquinas.sql        → cria tabela `maquinas`
- /supabase/02_tabela-usuarios.sql        → cria tabela `usuarios`
- /supabase/03_relacao-maquinas-users.sql → adiciona FK entre as duas
- Próximo arquivo: 04_...
```

---

## Passo 2 — Nomear o arquivo corretamente

O padrão de nomenclatura é obrigatório:

```
{NN}_{descricao-em-kebab-case}.sql
```

- `NN` = número sequencial com 2 dígitos (01, 02, 03, ...)
- `descricao` = descrição curta em português ou inglês, sem espaços, usando `-`

**Exemplos válidos:**
```
01_tabela-maquinas.sql
02_adiciona-coluna-status.sql
03_enum-tipo-usuario.sql
04_politica-rls-pedidos.sql
05_seed-categorias.sql
```

**Destino:** sempre `/supabase/{nome-do-arquivo}.sql` na raiz do projeto.

---

## Passo 3 — Escrever o SQL com segurança

### Estrutura obrigatória de todo arquivo de migração:

```sql
-- ============================================================
-- Migration: {NN}_{descricao}.sql
-- Descrição: {O que esta migração faz em linguagem natural}
-- Depende de: {arquivos anteriores que devem existir, ou "nenhum"}
-- Criado em: {data}
-- ============================================================

-- [ 1. VERIFICAÇÕES DE SEGURANÇA ]
-- Garante que a migração não quebre se rodar duas vezes

-- [ 2. CORPO DA MIGRAÇÃO ]
-- O SQL principal aqui

-- [ 3. VERIFICAÇÃO FINAL ]
-- Comentário confirmando o que foi criado/alterado
```

---

### Regras de segurança SQL obrigatórias:

#### Para criar tabelas:
```sql
CREATE TABLE IF NOT EXISTS nome_tabela (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now() NOT NULL,
  -- demais colunas
);
```

#### Para adicionar colunas:
```sql
ALTER TABLE nome_tabela
  ADD COLUMN IF NOT EXISTS nova_coluna tipo_de_dado;
```

#### Para criar índices:
```sql
CREATE INDEX IF NOT EXISTS idx_tabela_coluna ON tabela(coluna);
```

#### Para criar enums:
```sql
DO $$ BEGIN
  CREATE TYPE nome_enum AS ENUM ('valor1', 'valor2', 'valor3');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
```

#### Para políticas RLS:
```sql
-- Habilitar RLS na tabela
ALTER TABLE nome_tabela ENABLE ROW LEVEL SECURITY;

-- Remover política antes de recriar (evita erro se já existe)
DROP POLICY IF EXISTS "nome_politica" ON nome_tabela;

CREATE POLICY "nome_politica"
  ON nome_tabela
  FOR SELECT  -- ou INSERT, UPDATE, DELETE, ALL
  TO authenticated  -- ou anon, service_role
  USING (auth.uid() = user_id);  -- condição
```

#### Para funções/triggers:
```sql
CREATE OR REPLACE FUNCTION nome_funcao()
RETURNS trigger AS $$
BEGIN
  -- lógica aqui
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS nome_trigger ON nome_tabela;
CREATE TRIGGER nome_trigger
  BEFORE INSERT OR UPDATE ON nome_tabela
  FOR EACH ROW EXECUTE FUNCTION nome_funcao();
```

---

## Passo 4 — Checklist antes de salvar o arquivo

Confirme cada item antes de gerar o arquivo final:

- [ ] O número sequencial está correto (verificou os arquivos existentes)?
- [ ] O nome do arquivo segue o padrão `NN_descricao-kebab-case.sql`?
- [ ] Todos os `CREATE` usam `IF NOT EXISTS`?
- [ ] Todos os `ADD COLUMN` usam `IF NOT EXISTS`?
- [ ] Enums usam o bloco `DO $$ BEGIN ... EXCEPTION ... END $$`?
- [ ] Políticas RLS usam `DROP POLICY IF EXISTS` antes do `CREATE POLICY`?
- [ ] O arquivo tem o cabeçalho com descrição e dependências?
- [ ] A migração é reversível? (Se sim, considere adicionar bloco `-- ROLLBACK:`)
- [ ] Não há `DROP TABLE` sem `IF EXISTS`?

---

## Passo 5 — Comunicar ao usuário

Após gerar o arquivo, informe:

```
✅ Migração criada: /supabase/NN_descricao.sql

O que essa migração faz:
- [lista do que foi criado/alterado]

Para aplicar no Supabase:
1. Acesse o painel do Supabase → SQL Editor
2. Cole o conteúdo do arquivo e execute
   — OU —
   Use o CLI: supabase db push

⚠️ Sempre faça backup antes de rodar em produção.
```

---

## Referência rápida de tipos Supabase/PostgreSQL

| Tipo          | Uso                                      |
|---------------|------------------------------------------|
| `uuid`        | IDs (use `gen_random_uuid()` como default) |
| `text`        | Strings sem limite                       |
| `varchar(n)`  | Strings com limite                       |
| `integer`     | Números inteiros                         |
| `bigint`      | Números inteiros grandes                 |
| `numeric`     | Decimais precisos (dinheiro)             |
| `boolean`     | true/false                               |
| `timestamptz` | Data+hora com fuso (padrão recomendado)  |
| `jsonb`       | JSON indexável                           |
| `text[]`      | Array de strings                         |

---

## Exemplos completos

Veja exemplos detalhados em: `references/exemplos.md`

---

## ⚠️ O que NUNCA fazer

- ❌ Nunca escrever `DROP TABLE nome_tabela` sem `IF EXISTS`
- ❌ Nunca usar `CREATE TABLE` sem `IF NOT EXISTS`
- ❌ Nunca modificar migrações antigas já aplicadas — crie uma nova
- ❌ Nunca hardcodar UUIDs de usuários reais em seeds
- ❌ Nunca colocar senhas ou chaves de API no SQL
- ❌ Nunca pular números na sequência (se deletou um arquivo, mantenha o número)
