import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../supabase';

export function useGlobalDocuments() {
  const [documents, setDocuments] = useState([]);
  const [gaps, setGaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalDocs: 0,
    aiAnalyzedPct: 0,
    riskFlags: 0,
    totalGaps: 0
  });

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [docsRes, gapsRes] = await Promise.all([
        supabase.from('machine_documents').select('*'),
        supabase.from('document_gaps').select('*').eq('resolved', false)
      ]);

      const docs = docsRes.data || [];
      const openGaps = gapsRes.data || [];

      setDocuments(docs);
      setGaps(openGaps);

      // Calculate Metrics
      const totalDocs = docs.length;
      const analyzedCount = docs.filter(d => d.ai_analyzed_at).length;
      const aiAnalyzedPct = totalDocs > 0 ? Math.round((analyzedCount / totalDocs) * 100) : 0;
      const riskFlags = openGaps.filter(g => g.severity === 'alto' || g.severity === 'critico').length;
      const totalGaps = openGaps.length;

      setMetrics({
        totalDocs,
        aiAnalyzedPct,
        riskFlags,
        totalGaps
      });

    } catch (err) {
      console.error('Error fetching global documents/gaps:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    documents,
    gaps,
    metrics,
    loading,
    refresh: fetchAll
  };
}
