import { useState, useCallback } from 'react';
import { supabase } from '../supabase';
import { analyzeNR12Document } from '../services/aiService';
import { useUI } from '../components/ui/UIContext';

/**
 * Hook para gerenciar dados secundários de uma máquina (Docs, Ações, Imagens).
 */
export function useMachineExtraData(selectedMachine, onRefreshMachines) {
  const [extraData, setExtraData] = useState({ documents: [], parts: [], images: [], gaps: [] });
  const [analyzingDocId, setAnalyzingDocId] = useState(null);
  const [batchProgress, setBatchProgress] = useState(null);
  const { addToast } = useUI();

  const fetchExtraData = useCallback(async (machineId) => {
    if (!machineId) return;
    try {
      const [docs, parts, imgs, gaps] = await Promise.all([
        supabase.from('machine_documents').select('*').eq('machine_id', machineId).order('created_at', { ascending: false }),
        supabase.from('machine_parts').select('*').eq('machine_id', machineId).order('created_at', { ascending: true }),
        supabase.from('machine_images').select('*').eq('machine_id', machineId).order('created_at', { ascending: false }),
        supabase.from('document_gaps').select('*').eq('machine_id', machineId).eq('resolved', false).order('severity', { ascending: false })
      ]);
      setExtraData({
        documents: docs.data || [],
        parts: parts.data || [],
        images: imgs.data || [],
        gaps: gaps.data || []
      });
    } catch (err) {
      console.error('Error fetching extra data:', err);
    }
  }, []);

  /**
   * Determina a severidade do gap baseado no título (Regras do Bloco 4)
   */
  function inferSeverity(title) {
    const t = title.toLowerCase();
    if (t.includes('elétrico') || t.includes('hardwiring') || t.includes('apr') || t.includes('loto')) return 'critico';
    if (t.includes('hidráulico') || t.includes('pneumático') || t.includes('proteção')) return 'alto';
    return 'medio';
  }

  /**
   * Insere um gap com deduplicação
   */
  async function createGapIfMissing(machineId, machineName, gapTitle, source = 'ia') {
    // 1. Verifica se já existe
    const { data: existing } = await supabase
      .from('document_gaps')
      .select('id')
      .eq('machine_id', machineId)
      .eq('title', gapTitle)
      .eq('resolved', false)
      .limit(1);

    if (existing && existing.length > 0) return;

    // 2. Insere
    await supabase.from('document_gaps').insert([{
      machine_id: machineId,
      machine_name: machineName,
      title: gapTitle,
      severity: inferSeverity(gapTitle),
      source: source,
      resolved: false
    }]);
  }

  /**
   * Executa análise individual ou como parte de um lote
   */
  async function runAIAnalysis(doc, machineName) {
    if (!doc || !doc.id) return;
    setAnalyzingDocId(doc.id);
    
    // Feedback opcional no console para debug
    console.log(`Iniciando análise técnica via Gemini para: ${doc.title}`);
    
    try {
      const result = await analyzeNR12Document(doc.title, doc.file_url);
      
      // Atualiza o documento no banco de dados
      const { error } = await supabase
        .from('machine_documents')
        .update({ 
          ai_summary: result.executive_summary,
          ai_risk_flags: result,
          ai_analyzed_at: new Date(),
          ai_gaps_detected: (result.missing_documents?.length > 0)
        })
        .eq('id', doc.id);
      
      if (error) throw error;

      // Gera os gaps automáticos com lógica de deduplicação aprimorada
      if (result.missing_documents && result.missing_documents.length > 0) {
        const gapPromises = result.missing_documents.map(gap => 
          createGapIfMissing(doc.machine_id, machineName || 'Máquina', gap.title, 'ia')
        );
        await Promise.all(gapPromises);
      }

      // Atualiza o estado local para refletir as mudanças imediatamente
      await fetchExtraData(doc.machine_id);
      addToast(`Análise concluída: ${doc.title}`, 'success');
      
      return result;
    } catch (err) {
      console.error('Falha na análise de IA:', err);
      addToast(`Não foi possível analisar o documento "${doc.title}".`, 'error');
      throw err;
    } finally {
      setAnalyzingDocId(null);
    }
  }

  /**
   * FASE 1: ANÁLISE BATCH (Auto-Scan)
   */
  async function runAutoScan() {
    // 1. Buscar docs pendentes
    const { data: pendingDocs } = await supabase
      .from('machine_documents')
      .select('*, machines(name)')
      .is('ai_analyzed_at', null);

    if (!pendingDocs || pendingDocs.length === 0) {
      addToast('Nenhum documento pendente de análise.', 'info');
      return;
    }

    setBatchProgress({ current: 0, total: pendingDocs.length, status: 'Iniciando...' });

    for (let i = 0; i < pendingDocs.length; i++) {
      const doc = pendingDocs[i];
      setBatchProgress({ 
        current: i + 1, 
        total: pendingDocs.length, 
        status: `Analisando ${doc.doc_number || doc.title}...` 
      });
      
      try {
        await runAIAnalysis(doc, doc.machines?.name);
      } catch (e) {
        console.error(`Erro ao analisar doc ${doc.id}`, e);
      }
    }

    setBatchProgress(null);
    addToast('Análise em lote concluída!', 'success');
  }


  async function setAsCover(url) {
    if (!selectedMachine) return;
    try {
      const { error } = await supabase.from('machines').update({ cover_image_url: url }).eq('id', selectedMachine.id);
      if (error) throw error;
      onRefreshMachines();
      return true;
    } catch (err) { console.error(err); return false; }
  }

  return { 
    extraData, 
    fetchExtraData, 
    setAsCover, 
    runAIAnalysis, 
    runAutoScan,
    analyzingDocId,
    batchProgress 
  };
}
