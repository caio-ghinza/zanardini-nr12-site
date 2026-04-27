import { supabase } from '../supabase.js';
import seedData from '../data/seedData.json' assert { type: 'json' };

async function seed() {
  console.log('🚀 Iniciando semeadura do banco de dados...');

  // 1. Limpar dados existentes (Opcional, cuidado!)
  // await supabase.from('machines').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  // 2. Inserir Máquinas
  console.log('📦 Inserindo máquinas...');
  const { data: machines, error: mError } = await supabase
    .from('machines')
    .insert(seedData.machines.map(m => ({
      name: m.name,
      manufacturer: m.manufacturer,
      model: m.model,
      machine_type: m.machine_type,
      risk_level: m.risk_level,
      compliance_pct: m.compliance_pct,
      plr_required: m.plr_required,
      anomaly: m.anomaly,
      action_required: m.action_required
    })))
    .select();

  if (mError) console.error('Erro máquinas:', mError);

  // 3. Inserir Itens Financeiros
  console.log('💰 Inserindo financeiro...');
  const { error: fError } = await supabase
    .from('budget_items')
    .insert(seedData.budget.map(b => ({
      category: b.category,
      item_name: b.item_name,
      quantity: b.quantity,
      unit_price_brl: b.unit_price_brl,
      status: b.status
    })));

  if (fError) console.error('Erro financeiro:', fError);

  // 4. Inserir Comunicações
  console.log('💬 Inserindo comunicações...');
  const { error: cError } = await supabase
    .from('audit_communications')
    .insert(seedData.communications.map(c => ({
      type: c.type,
      subject: c.subject,
      from_entity: c.from_entity,
      status: c.status,
      body: c.body
    })));

  if (cError) console.error('Erro comunicações:', cError);

  console.log('✅ Semeadura concluída!');
}

seed();
