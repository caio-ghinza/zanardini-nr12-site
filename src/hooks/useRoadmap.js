import { useState, useCallback } from 'react';
import { supabase } from '../supabase';

const getSupabaseErrorDetails = (err) => ({
  message: err?.message || 'Erro desconhecido',
  code: err?.code || null,
  details: err?.details || null,
  hint: err?.hint || null
});

const priorityFallbacks = (priority) => {
  const value = (priority || '').trim();
  const candidates = [
    value,
    value.toLowerCase(),
    value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
  ].filter(Boolean);
  return [...new Set(candidates)];
};

export function useRoadmap() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('roadmap_tasks')
        .select('*')
        .order('week_number', { ascending: true })
        .order('created_at', { ascending: true });

      if (error) throw error;
      setTasks(data || []);
    } catch (err) {
      console.error('Error fetching roadmap tasks:', getSupabaseErrorDetails(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const addTask = async (task) => {
    const attempts = priorityFallbacks(task?.priority);
    const payloads = attempts.length > 0
      ? attempts.map((priority) => ({ ...task, priority }))
      : [task];

    try {
      for (const payload of payloads) {
        const { data, error } = await supabase
          .from('roadmap_tasks')
          .insert([payload])
          .select();

        if (!error) {
          fetchTasks();
          return { data, error: null };
        }

        const isPriorityConstraint = error?.code === '23514' && (error?.message || '').includes('roadmap_tasks_priority_check');
        if (!isPriorityConstraint) throw error;

        console.warn('Retrying roadmap task insert with normalized priority:', payload.priority);
      }

      throw new Error('Não foi possível inserir a tarefa: prioridade incompatível com a constraint do banco.');
    } catch (err) {
      console.error('Error adding roadmap task:', getSupabaseErrorDetails(err));
      return { data: null, error: err };
    }
  };

  const updateTask = async (id, updates) => {
    try {
      const { error } = await supabase
        .from('roadmap_tasks')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
      fetchTasks();
      return { error: null };
    } catch (err) {
      console.error('Error updating roadmap task:', getSupabaseErrorDetails(err));
      return { error: err };
    }
  };

  const deleteTask = async (id) => {
    try {
      const { error } = await supabase
        .from('roadmap_tasks')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchTasks();
      return { error: null };
    } catch (err) {
      console.error('Error deleting roadmap task:', getSupabaseErrorDetails(err));
      return { error: err };
    }
  };

  return {
    tasks,
    loading,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask
  };
}
