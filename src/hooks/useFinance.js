import { useState, useCallback } from 'react';
import { supabase } from '../supabase';

export function useFinance() {
  const [budgetItems, setBudgetItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBudget = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('budget_items')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setBudgetItems(data || []);
    } catch (err) {
      console.error('Error fetching budget:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addBudgetItem = async (newItem) => {
    try {
      const { data, error } = await supabase
        .from('budget_items')
        .insert([newItem])
        .select();
      if (error) throw error;
      fetchBudget();
      return { data, error: null };
    } catch (err) {
      console.error('Error adding budget item:', err);
      return { data: null, error: err };
    }
  };

  const updateBudgetItem = async (id, updates) => {
    try {
      const { error } = await supabase
        .from('budget_items')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
      fetchBudget();
      return { error: null };
    } catch (err) {
      console.error('Error updating budget item:', err);
      return { error: err };
    }
  };

  const deleteBudgetItem = async (id) => {
    try {
      const { error } = await supabase
        .from('budget_items')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchBudget();
      return { error: null };
    } catch (err) {
      console.error('Error deleting budget item:', err);
      return { error: err };
    }
  };

  return {
    budgetItems,
    loading,
    fetchBudget,
    addBudgetItem,
    updateBudgetItem,
    deleteBudgetItem
  };
}
