import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '../supabase';
import seedData from '../data/seedData.json';

/**
 * Hook principal para gerenciar o inventário de máquinas e filtros.
 */
export function useMachinery() {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');

  const fetchMachines = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('machines')
        .select(`
          *,
          document_gaps (
            id, title, severity, resolved
          )
        `)
        .order('name', { ascending: true });

      if (error) throw error;
      
      // Filtra gaps resolvidos no mapeamento para manter apenas abertos
      const processed = (data || []).map(m => ({
        ...m,
        document_gaps: (m.document_gaps || []).filter(g => !g.resolved)
      }));
      
      setMachines(processed.length > 0 ? processed : seedData.machines);
    } catch (err) {
      console.error('Error fetching machines:', err);
      setMachines(seedData.machines);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMachines();

    // Inscrição em tempo real para atualizações de máquinas e gaps
    const channel = supabase
      .channel('machinery-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'machines' }, () => fetchMachines())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'document_gaps' }, () => fetchMachines())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchMachines]);

  async function deleteMachine(id) {
    if (!confirm('Deseja realmente remover esta máquina?')) return false;
    try {
      const { error } = await supabase.from('machines').delete().eq('id', id);
      if (error) throw error;
      fetchMachines();
      return true;
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir registro.');
      return false;
    }
  }

  async function updateMachine(id, updates) {
    try {
      const { error } = await supabase
        .from('machines')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      fetchMachines();
      return true;
    } catch (err) {
      console.error('Update error:', err);
      alert('Erro ao atualizar máquina.');
      return false;
    }
  }

  const filteredMachines = useMemo(() => {
    return machines.filter(m => {
      const matchesSearch = (m.name || '').toLowerCase().includes(search.toLowerCase()) || 
                           (m.model || '').toLowerCase().includes(search.toLowerCase());
      const matchesType = filterType === 'all' || m.machine_type === filterType;
      return matchesSearch && matchesType;
    });
  }, [machines, search, filterType]);

  return {
    machines,
    loading,
    search,
    setSearch,
    filterType,
    setFilterType,
    filteredMachines,
    fetchMachines,
    deleteMachine,
    updateMachine
  };
}

