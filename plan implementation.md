# Plano de Implementacao - Estabilizacao do Painel NR-12

## Objetivo

Estabilizar o site NR-12 da Zanardini Engenharia para uso operacional com foco em seguranca, confiabilidade, consistencia de dados e qualidade percebida. Este plano parte da leitura tecnica feita em 2026-04-30 e organiza as correcoes em etapas executaveis, com validacao ao final de cada fase.

## Principios de Execucao

- Corrigir primeiro riscos de seguranca e bugs de runtime.
- Manter mudancas pequenas, testaveis e rastreaveis.
- Evitar refatoracoes esteticas antes de estabilizar fluxos criticos.
- Preservar dados existentes no Supabase.
- Validar cada fase com `npm run build`, `npm run lint` quando aplicavel e teste manual do fluxo afetado.

## Fase 0 - Preparacao e Baseline

### 0.1 Registrar estado atual

- Rodar `git status --short --branch`.
- Confirmar quais arquivos ja possuem alteracoes locais.
- Nao reverter alteracoes existentes sem decisao explicita.
- Rodar `npm run build` e salvar o resultado esperado: build passa com aviso de chunk grande.
- Rodar `npm run lint` e salvar os principais grupos de erro.

### 0.2 Criar checklist de validacao manual

- Login como admin.
- Login como cliente.
- Abrir aba Maquinas.
- Abrir modal de uma maquina.
- Usar abas Resumo, Verificacoes, Acoes, Dossie e Galeria.
- Abrir aba Documentos.
- Abrir aba Roadmap.
- Abrir aba Financeiro como admin.
- Abrir painel de gestao de contas como admin.

## Fase 1 - Bugs de Runtime Criticos

### 1.1 Corrigir IA indefinida no modal de maquina

Problema:

- `MachineryModal.jsx` usa `runAIAnalysis`, mas a prop nao esta declarada no destructuring do componente.
- Isso pode quebrar a aba Dossie ao renderizar ou ao tentar analisar documento.

Passos:

- Adicionar `runAIAnalysis` na assinatura de props de `MachineryModal`.
- Confirmar que `MachineryTab` ja passa essa prop para o modal.
- Testar abertura do modal e aba Dossie.
- Testar botao "Analisar com IA" com chave configurada ou validar erro controlado sem chave.

Validacao:

- `npm run build`
- Abrir modal de maquina sem erro no console.

### 1.2 Corrigir hook condicional em DetailsTab

Problema:

- `DetailsTab.jsx` chama `useMemo` depois de um retorno condicional.
- Isso viola a regra de ordem dos hooks.

Passos:

- Mover o guard `if (!selectedMachine) return null` para depois de todos os hooks, ou garantir que hooks sejam chamados sempre.
- Manter o calculo de `stats` resiliente quando `selectedMachine` for nulo.

Validacao:

- `npm run lint` deve deixar de acusar `react-hooks/rules-of-hooks` nesse arquivo.
- Abrir modal de maquina e verificar status global.

### 1.3 Corrigir metrica e tamanho na aba Documentos

Problema:

- `DocumentsTab.jsx` le `ai_analysis`, mas a IA grava em `ai_risk_flags`.
- O tamanho usa `doc.file_size`, mas o schema indica `file_size_kb`.
- Isso pode gerar metricas zeradas ou `NaN MB`.

Passos:

- Trocar metricas para usar `ai_risk_flags.critical_alerts` e `ai_risk_flags.missing_documents`.
- Calcular tamanho a partir de `file_size_kb` quando existir.
- Exibir fallback claro quando o tamanho nao estiver salvo.

Validacao:

- Aba Documentos renderiza sem `NaN`.
- Contadores de flags/gaps refletem documentos analisados.

## Fase 2 - Seguranca e RBAC

### 2.1 Unificar gestao de usuarios na Edge Function segura

Problema:

- `AdminPanel.jsx` chama `create-user` e `delete-user`.
- Essas Edge Functions usam `SERVICE_ROLE_KEY` sem validar se o chamador e admin.
- Existe uma funcao mais segura, `admin-users`, que verifica token, perfil admin e conta ativa.

Passos:

- Atualizar `AdminPanel.jsx` para usar `admin-users` via action:
  - `list_users`
  - `create_user`
  - futura acao `delete_user` ou desativacao por RPC segura.
- Preferir desativar usuarios a deletar permanentemente.
- Se delecao for realmente necessaria, implementar `delete_user` dentro de `admin-users` com as mesmas validacoes.
- Remover ou deixar de usar `create-user` e `delete-user`.
- Ajustar interface para usar `is_active` quando aplicavel.

Validacao:

- Cliente nao ve painel admin.
- Admin lista usuarios.
- Admin cria usuario.
- Admin nao consegue remover/desativar a si mesmo.
- Requisicoes sem token ou com cliente retornam 403.

### 2.2 Corrigir lockout de login

Problema:

- `handleFailedAttempt` existe em `useAuth.js`, mas nao e chamado quando `signInWithPassword` falha.
- `reset_auth_attempts` tambem nao e chamado apos login bem-sucedido.

Passos:

- Antes do login, chamar `checkServerLockout(email)`.
- Em erro de credenciais, chamar `handleFailedAttempt(email)`.
- Em login bem-sucedido, chamar `reset_auth_attempts(email)`.
- Ajustar `isLockedOut` para nao depender de `Date.now()` diretamente no retorno do hook, ou controlar o tempo no componente.

Validacao:

- Apos falhas consecutivas, login bloqueia pelo tempo configurado.
- Apos sucesso, tentativas antigas sao limpas.
- `npm run lint` nao acusa pureza em `useAuth.js`.

### 2.3 Revisar politicas de Storage

Problema:

- Uploads usam `getPublicUrl`, o que pressupoe acesso publico ou URLs acessiveis.
- As policies atuais permitem leitura autenticada, mas URLs publicas podem conflitar com expectativa de privacidade.

Passos:

- Decidir modelo:
  - Buckets publicos para simplicidade operacional.
  - Ou buckets privados com signed URLs para seguranca documental.
- Se manter privado, substituir `getPublicUrl` por signed URLs com expiracao.
- Verificar exibicao de PDFs e imagens no app.

Validacao:

- Cliente autenticado consegue visualizar documentos.
- Usuario nao autenticado nao acessa arquivos tecnicos se o modelo privado for adotado.

## Fase 3 - IA, CSP e Integracoes Externas

### 3.1 Ajustar Content Security Policy

Problema:

- `netlify.toml` nao libera conexao com Groq.
- Fallback de imagem do Unsplash tambem pode ser bloqueado por `img-src`.

Passos:

- Adicionar `https://api.groq.com` em `connect-src`, se a IA continuar no frontend.
- Adicionar dominios de imagem realmente usados em `img-src`, ou remover fallback externo.
- Preferir mover chamadas de IA para uma Edge Function para nao expor chave no frontend.

Validacao:

- Analise IA funciona em deploy.
- Imagens de fallback carregam ou foram substituidas por asset local.

### 3.2 Reduzir exposicao da chave Groq

Problema:

- `VITE_GROQ_API_KEY` no frontend expoe a chave ao usuario final.

Passos:

- Criar Edge Function Supabase `analyze-document`.
- Guardar chave Groq no ambiente da Edge Function.
- Frontend chama a Edge Function autenticado.
- Edge Function valida usuario ativo e, idealmente, admin para reanalise.
- Manter o contrato JSON atual para reduzir impacto no UI.

Validacao:

- Chave Groq nao aparece no bundle.
- Analise continua gravando `ai_summary`, `ai_risk_flags`, `ai_analyzed_at` e gaps.

## Fase 4 - Consistencia de Schema e Dados

### 4.1 Sincronizar README e migrations

Problema:

- README aponta `supabase_schema.sql` na raiz, mas o arquivo atual esta em `supabase/supabase_schema.sql`.
- Existem varias migrations incrementais, e pode haver divergencia entre schema consolidado e migrations.

Passos:

- Atualizar README com ordem correta das migrations.
- Indicar fluxo recomendado para ambiente novo.
- Confirmar tabelas/colunas usadas pelo frontend:
  - `machines`
  - `machine_documents`
  - `machine_images`
  - `machine_parts`
  - `document_gaps`
  - `budget_items`
  - `roadmap_tasks`
  - `profiles`
  - `auth_attempts`
- Garantir que `technical_verifications` exista em `machines`, pois o frontend usa essa coluna.

Validacao:

- Ambiente novo consegue ser criado seguindo README.
- App nao consulta colunas ausentes.

### 4.2 Normalizar campos de documentos

Problema:

- Upload salva `file_url`, `category`, `doc_number`, mas nao salva sempre `file_size_kb`, `file_type` ou metadados usados na listagem.

Passos:

- No upload, gravar `file_size_kb`.
- Gravar `file_type` apenas se a coluna existir; caso contrario remover uso da UI.
- Padronizar categorias entre `inferDocCategory`, filtros da aba Documentos e constraints SQL.

Validacao:

- Novo upload aparece corretamente na aba Documentos.
- Filtros retornam documentos esperados.

## Fase 5 - Lint, Qualidade e Manutenibilidade

### 5.1 Limpar erros reais de lint

Prioridade:

- `no-undef`
- `rules-of-hooks`
- `immutability`
- parsing error em `seedDatabase.js`
- variaveis usadas antes da declaracao em hooks/componentes

Passos:

- Corrigir `MachineryModal`, `DetailsTab`, `DocumentUploadModal`, `UIContext` e `seedDatabase.js`.
- Ajustar callbacks com `useCallback` quando necessario.
- Corrigir blocos `catch` vazios.

Validacao:

- `npm run lint` sem erros criticos funcionais.

### 5.2 Limpar imports e codigo morto

Problema:

- Muitos imports `React`, `motion`, icones e variaveis nao usados.
- Existem componentes possivelmente abandonados como `DashboardGrid` e `UserManagementPanel`.

Passos:

- Remover imports nao usados.
- Decidir se `DashboardGrid` voltara como Overview ou sera removido.
- Decidir se `UserManagementPanel` substitui ou morre em favor de `AdminPanel`.
- Remover componentes mortos somente apos confirmacao.

Validacao:

- `npm run lint` reduzido a zero ou apenas warnings aceitos.
- Build segue passando.

### 5.3 Corrigir encoding de textos

Problema:

- Muitos textos aparecem com encoding quebrado, por exemplo palavras como maquina, acao e dossie renderizadas de forma ilegivel.

Passos:

- Garantir que arquivos sejam UTF-8.
- Corrigir textos visiveis ao usuario.
- Corrigir README e comentarios principais.
- Evitar mexer em strings tecnicas ou chaves de banco sem necessidade.

Validacao:

- Interface em portugues renderiza acentos corretamente.
- README legivel.

## Fase 6 - UX Operacional

### 6.1 Corrigir busca global decorativa

Problema:

- Busca no `Navigation` nao esta conectada ao estado de maquinas.

Passos:

- Remover campo se nao houver busca global real.
- Ou implementar busca global com navegacao para Maquinas e filtro aplicado.

Validacao:

- Campo de busca sempre produz efeito claro, ou deixa de existir.

### 6.2 Melhorar estados de permissao

Problema:

- Cliente ve alguns estados vazios sem indicacao de leitura apenas.
- Financeiro some para cliente, mas outras acoes admin ficam apenas ocultas.

Passos:

- Manter `AdminOnly` para acoes destrutivas.
- Adicionar estados read-only sutis em verificacoes, documentos e acoes.
- Garantir que o backend bloqueia mesmo se o cliente tentar chamar API manualmente.

Validacao:

- Cliente consegue consultar sem editar.
- Admin consegue operar.

### 6.3 Revisar mobile dos modais principais

Passos:

- Testar login, modal de maquina, upload de documento e roadmap em viewport mobile.
- Corrigir textos truncados indevidos.
- Garantir botoes de rodape acessiveis.

Validacao:

- Fluxos principais usaveis em celular.

## Fase 7 - Performance e Deploy

### 7.1 Reduzir bundle grande

Problema:

- Build gera chunk principal acima de 1.4 MB.

Passos:

- Lazy-load abas pesadas:
  - Financeiro/Recharts.
  - Relatorio PDF/jsPDF.
  - IA card se necessario.
- Importar `jspdf` apenas no momento de exportar.

Validacao:

- Build reduz chunk principal.
- Exportacao PDF continua funcionando.

### 7.2 Teste em ambiente de deploy

Passos:

- Deploy em preview Netlify.
- Testar CSP, Supabase, Auth, Storage e IA.
- Validar headers de seguranca.

Validacao:

- Nenhum erro de CSP nos fluxos esperados.
- Login, uploads e visualizacao de documentos funcionando.

## Ordem Recomendada de Implementacao

1. Fase 1.1, 1.2 e 1.3: corrigir runtime visivel.
2. Fase 2.1 e 2.2: fechar seguranca de usuarios e login.
3. Fase 3.1 e 3.2: estabilizar IA e CSP.
4. Fase 4.1 e 4.2: alinhar schema e documentos.
5. Fase 5.1, 5.2 e 5.3: limpar lint, codigo morto e encoding.
6. Fase 6: lapidar experiencia operacional.
7. Fase 7: otimizar bundle e validar deploy.

## Criterios de Pronto

- `npm run build` passa.
- `npm run lint` passa ou tem somente excecoes documentadas e aceitas.
- Admin e cliente possuem permissoes coerentes na UI e no backend.
- Fluxo de maquinas funciona do card ao relatorio PDF.
- Fluxo de documentos funciona com upload, visualizacao e analise IA.
- Gestao de usuarios nao usa Edge Functions inseguras.
- README permite subir um ambiente novo sem adivinhacao.
- Textos em portugues aparecem com acentos corretos.
