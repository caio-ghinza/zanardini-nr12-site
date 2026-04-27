import { useState, useCallback } from 'react';
import { supabase } from '../supabase';

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
      console.error('Error fetching roadmap tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addTask = async (task) => {
    try {
      const { data, error } = await supabase
        .from('roadmap_tasks')
        .insert([task])
        .select();
      if (error) throw error;
      fetchTasks();
      return { data, error: null };
    } catch (err) {
      console.error('Error adding roadmap task:', err);
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
      console.error('Error updating roadmap task:', err);
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
      console.error('Error deleting roadmap task:', err);
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
