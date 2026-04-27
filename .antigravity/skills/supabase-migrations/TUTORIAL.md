# 📖 Tutorial: Skill de Migrações Supabase no Antigravity

## O que é essa skill?

Essa skill ensina o Antigravity a **gerar arquivos SQL de migração** de forma segura
sempre que você pedir uma mudança no seu banco de dados Supabase. Em vez de você
escrever SQL na mão ou usar o painel do Supabase diretamente, o Antigravity vai:

1. Analisar as migrações que já existem no projeto
2. Criar um novo arquivo `.sql` numerado e organizado
3. Usar técnicas seguras que não quebram se o banco já tiver dados

---

## 📁 Instalação da Skill

### Passo 1 — Localizar a pasta de skills do Antigravity

No Antigravity (como no Cursor), as skills/regras ficam normalmente em:

```
seu-projeto/
└── .antigravity/
    └── skills/         ← coloque aqui
```

> Se a pasta não existir, crie ela na raiz do projeto.

### Passo 2 — Copiar os arquivos da skill

Copie a pasta `supabase-migrations/` para dentro de `.antigravity/skills/`:

```
seu-projeto/
└── .antigravity/
    └── skills/
        └── supabase-migrations/
            ├── SKILL.md              ← arquivo principal da skill
            └── references/
                └── exemplos.md       ← exemplos de migrações
```

### Passo 3 — Criar a pasta de migrações no projeto

Na raiz do seu projeto, crie a pasta onde as migrações serão salvas:

```
seu-projeto/
└── supabase/           ← aqui ficam os arquivos .sql
```

---

## 🚀 Como usar

### Exemplos de pedidos que ativam a skill automaticamente:

```
"Cria uma tabela de pedidos com status e valor total"
```
```
"Adiciona uma coluna de foto de perfil no usuário"
```
```
"Quero uma nova opção de modo escuro salva no banco"
```
```
"Cria um enum com os tipos de pagamento: pix, cartão, boleto"
```
```
"Só o dono deve ver seus próprios dados"
```
```
"Popula o banco com as categorias iniciais"
```

### O que o Antigravity vai fazer:

1. **Ler** todos os arquivos em `/supabase/` para entender o estado atual
2. **Criar** um novo arquivo `NN_descricao.sql` com o número correto
3. **Escrever** SQL seguro (com `IF NOT EXISTS`, tratamento de erros, etc.)
4. **Salvar** o arquivo em `/supabase/` na raiz do projeto

---

## 📂 Estrutura de arquivos gerada

Após alguns pedidos, sua pasta `/supabase/` vai ficar assim:

```
supabase/
├── 01_tabela-maquinas.sql
├── 02_adiciona-localizacao-maquina.sql
├── 03_enum-status-maquina.sql
├── 04_tabela-categorias-e-relacao.sql
├── 05_politica-rls-maquinas.sql
└── 06_seed-categorias-padrao.sql
```

Cada arquivo é **independente** e pode ser aplicado no Supabase.

---

## ▶️ Como aplicar as migrações no Supabase

### Opção A — Pelo painel (mais simples)

1. Abra o [painel do Supabase](https://supabase.com)
2. Vá em **SQL Editor**
3. Copie o conteúdo do arquivo `.sql` gerado
4. Cole e clique em **Run**

### Opção B — Pelo CLI (recomendado para projetos maiores)

```bash
# Instalar o CLI do Supabase (se ainda não tiver)
npm install -g supabase

# Inicializar o projeto (só na primeira vez)
supabase init

# Aplicar todas as migrações pendentes
supabase db push
```

---

## ✅ Boas práticas

| ✅ Faça | ❌ Não faça |
|--------|------------|
| Peça uma mudança por vez | Não altere tabelas direto no painel sem gerar migração |
| Rode as migrações em ordem | Não pule números na sequência |
| Faça backup antes de rodar em produção | Não edite arquivos de migração já aplicados |
| Use o CLI do Supabase em produção | Não delete arquivos de migração antigos |

---

## 🔄 Fluxo recomendado de trabalho

```
Você pede uma mudança no banco
        ↓
Antigravity lê /supabase/ e entende o contexto
        ↓
Antigravity gera /supabase/NN_descricao.sql
        ↓
Você revisa o arquivo gerado
        ↓
Você aplica no Supabase (painel ou CLI)
        ↓
Commit no Git (o histórico de migrações fica salvo!)
```

---

## ❓ Dúvidas frequentes

**P: O que acontece se eu rodar a mesma migração duas vezes?**
R: Nada quebra! A skill usa `IF NOT EXISTS` e blocos de exceção para tornar tudo seguro.

**P: Posso editar um arquivo de migração depois de criar?**
R: Antes de aplicar no banco, sim. Depois de aplicado, crie um novo arquivo com a correção.

**P: E se eu precisar desfazer uma migração?**
R: Peça ao Antigravity: *"Cria uma migração para desfazer a XX_descricao.sql"*. Ele vai gerar o SQL de rollback.

**P: Posso usar para seeds (dados iniciais)?**
R: Sim! Use `ON CONFLICT DO NOTHING` para seeds idempotentes (que não duplicam).
