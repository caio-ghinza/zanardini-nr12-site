import { useState, useCallback } from 'react';
import { supabase } from '../supabase';

export function useAgenda() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('agenda_events')
        .select('*')
        .order('event_date', { ascending: true })
        .order('event_time', { ascending: true });
      if (error) throw error;
      setEvents(data || []);
    } catch (err) {
      console.error('Error fetching agenda events:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addEvent = async (event) => {
    try {
      const { data, error } = await supabase
        .from('agenda_events')
        .insert([event])
        .select();
      if (error) throw error;
      fetchEvents();
      return { data, error: null };
    } catch (err) {
      console.error('Error adding agenda event:', err);
      return { data: null, error: err };
    }
  };

  const deleteEvent = async (id) => {
    try {
      const { error } = await supabase
        .from('agenda_events')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchEvents();
      return { error: null };
    } catch (err) {
      console.error('Error deleting agenda event:', err);
      return { error: err };
    }
  };

  return {
    events,
    loading,
    fetchEvents,
    addEvent,
    deleteEvent
  };
}
