import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export function useDashboardKPIs() {
  const [metrics, setMetrics] = useState({
    riskyMachines: 0,
    avoidedFines: 'R$ 0',
    remainingCapex: 'R$ 0',
    loading: true
  });

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const { data, error } = await supabase
          .from('dashboard_kpis')
          .select('*')
          .single();

        if (error) throw error;

        if (data) {
          setMetrics({
            riskyMachines: data.risky_machines_count || 0,
            avoidedFines: `R$ ${(data.avoided_fines_value / 1000).toLocaleString('pt-BR')}k+`,
            remainingCapex: data.remaining_capex_value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
            loading: false
          });
        }
      } catch (err) {
        console.error('Error fetching KPIs from view:', err);
        setMetrics(prev => ({ ...prev, loading: false }));
      }
    }

    fetchMetrics();
    
    // Realtime subscription
    const channel = supabase.channel('kpi-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'machines' }, () => fetchMetrics())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'budget_items' }, () => fetchMetrics())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return metrics;
}
