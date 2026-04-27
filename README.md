# Dashboard Industrial NR-12

Este projeto é um painel de controle executivo para gestão de adequação de máquinas (NR-12), focado em plantas industriais com maquinário importado.

## Tecnologias
- React 18 + Vite
- Tailwind CSS (Design System Light Industrial)
- Framer Motion (Animações)
- Lucide React (Ícones)
- Recharts (Dashboards Financeiros)
- Supabase (Backend as a Service)

## Configuração do Supabase
1. Crie um projeto no Supabase.
2. Execute o script `supabase_schema.sql` no Editor SQL do Supabase.
3. Crie um arquivo `.env` na raiz com suas credenciais:
   ```env
   VITE_SUPABASE_URL=seu_url
   VITE_SUPABASE_ANON_KEY=sua_key
   ```

## Popular o Banco (Seed)
Para inserir os dados iniciais de exemplo no seu banco Supabase, você pode usar o script de seed. Como é um projeto Vite, você pode criar uma página temporária ou executar via Node (se configurado com pacotes compatíveis). Atualmente, as abas possuem um fallback automático que carrega dados de `seedData.json` se o banco estiver vazio.

## Guia Visual
- **Overview**: KPIs de multa evitada e semáforo de conformidade.
- **Maquinário**: Inventário técnico com Wizard de Adição.
- **Documentos**: Mapa de Gaps e status de análise IA.
- **Financeiro**: Distribuição de CAPEX (Orçamento R$ 180k).
- **Roadmap**: Cronograma de 12 semanas.
