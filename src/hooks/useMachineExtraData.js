import { useState, useCallback } from 'react';
import { supabase } from '../supabase';
import { analyzeNR12Document } from '../services/aiService';
import { useUI } from '../components/ui/UIContext';

export function useMachineExtraData(selectedMachine, onRefreshMachines) {
  const [extraData, setExtraData] = useState({ documents: [], parts: [], images: [], gaps: [], verifications: {} });
  const [analyzingDocId, setAnalyzingDocId] = useState(null);
  const [batchProgress, setBatchProgress] = useState(null);
  const { addToast } = useUI();

  const fetchExtraData = useCallback(async (machineId) => {
    if (!machineId) return;
    try {
      const [docs, parts, imgs, gaps, machineInfo] = await Promise.all([
        supabase.from('machine_documents').select('*').eq('machine_id', machineId).order('created_at', { ascending: false }),
        supabase.from('machine_parts').select('*').eq('machine_id', machineId).order('created_at', { ascending: true }),
        supabase.from('machine_images').select('*').eq('machine_id', machineId).order('created_at', { ascending: false }),
        supabase.from('document_gaps').select('*').eq('machine_id', machineId).eq('resolved', false).order('severity', { ascending: false }),
        supabase.from('machines').select('technical_verifications').eq('id', machineId).single()
      ]);
      setExtraData({
        documents: docs.data || [],
        parts: parts.data || [],
        images: imgs.data || [],
        gaps: gaps.data || [],
        verifications: machineInfo.data?.technical_verifications || {}
      });
    } catch (err) {
      console.error('Error fetching extra data:', err);
    }
  }, []);

  function inferSeverity(title) {
    if (!title) return 'medio';
    const t = title.toLowerCase();
    if (t.includes('elétrico') || t.includes('hardwiring') || t.includes('apr') || t.includes('loto')) return 'critico';
    if (t.includes('hidráulico') || t.includes('pneumático') || t.includes('proteção')) return 'alto';
    return 'medio';
  }

  async function createGapIfMissing(machineId, machineName, gapTitle, source = 'ia') {
    const { data: existing } = await supabase
      .from('document_gaps')
      .select('id')
      .eq('machine_id', machineId)
      .eq('title', gapTitle)
      .eq('resolved', false)
      .limit(1);

    if (existing && existing.length > 0) return;

    await supabase.from('document_gaps').insert([{
      machine_id: machineId,
      machine_name: machineName,
      title: gapTitle,
      severity: inferSeverity(gapTitle),
      source: source,
      resolved: false
    }]);
  }

  async function runAIAnalysis(doc, machineName) {
    if (!doc || !doc.id) return;
    setAnalyzingDocId(doc.id);
    try {
      const result = await analyzeNR12Document(doc.title, doc.file_url);
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

      if (result.missing_documents && result.missing_documents.length > 0) {
        const gapPromises = result.missing_documents
          .filter(gap => gap && gap.title)
          .map(gap => createGapIfMissing(doc.machine_id, machineName || 'Máquina', gap.title, 'ia'));
        await Promise.all(gapPromises);
      }

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

  async function updateVerifications(newVerifications) {
    if (!selectedMachine?.id) return false;
    
    // Backup para rollback em caso de erro
    const previousVerifications = extraData.verifications;
    
    // Atualização Otimista (Interface responde instantaneamente)
    setExtraData(prev => ({ ...prev, verifications: newVerifications }));

    try {
      const { error } = await supabase
        .from('machines')
        .update({ technical_verifications: newVerifications })
        .eq('id', selectedMachine.id);
      
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error updating verifications:', err);
      // Reverte para o estado anterior em caso de falha
      setExtraData(prev => ({ ...prev, verifications: previousVerifications }));
      addToast('Não foi possível salvar as verificações. Sincronização falhou.', 'error');
      return false;
    }
  }

  async function addMachineAction(partName) {
    if (!selectedMachine?.id) return false;
    const sanitizedName = (partName || '').trim();
    if (!sanitizedName) return false;

    try {
      const { error } = await supabase.from('machine_parts').insert([{
        machine_id: selectedMachine.id,
        part_name: sanitizedName,
        status: 'pendente'
      }]);
      if (error) throw error;
      await fetchExtraData(selectedMachine.id);
      addToast('Ação técnica adicionada.', 'success');
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async function togglePartStatus(part) {
    if (!selectedMachine?.id || !part?.id) return false;
    const nextStatus = part.status === 'instalado' ? 'pendente' : 'instalado';
    try {
      const { error } = await supabase.from('machine_parts').update({ status: nextStatus }).eq('id', part.id);
      if (error) throw error;
      await fetchExtraData(selectedMachine.id);
      return true;
    } catch (err) { return false; }
  }

  async function deletePart(partId) {
    if (!selectedMachine?.id || !partId) return false;
    try {
      const { error } = await supabase.from('machine_parts').delete().eq('id', partId);
      if (error) throw error;
      await fetchExtraData(selectedMachine.id);
      return true;
    } catch (err) { return false; }
  }

  async function deleteDocument(docId) {
    if (!selectedMachine?.id || !docId) return false;
    try {
      const { error } = await supabase.from('machine_documents').delete().eq('id', docId);
      if (error) throw error;
      await fetchExtraData(selectedMachine.id);
      addToast('Documento removido.', 'success');
      return true;
    } catch (err) { return false; }
  }

  async function setAsCover(url) {
    if (!selectedMachine) return;
    try {
      const { error } = await supabase.from('machines').update({ cover_image_url: url }).eq('id', selectedMachine.id);
      if (error) throw error;
      onRefreshMachines();
      return true;
    } catch (err) { return false; }
  }

  async function runAutoScan() {
    const { data: pendingDocs } = await supabase.from('machine_documents').select('*, machines(name)').is('ai_analyzed_at', null);
    if (!pendingDocs || pendingDocs.length === 0) return;
    setBatchProgress({ current: 0, total: pendingDocs.length, status: 'Iniciando...' });
    for (let i = 0; i < pendingDocs.length; i++) {
      setBatchProgress({ current: i + 1, total: pendingDocs.length, status: `Analisando ${pendingDocs[i].title}...` });
      try { await runAIAnalysis(pendingDocs[i], pendingDocs[i].machines?.name); } catch (e) {}
    }
    setBatchProgress(null);
    addToast('Análise em lote concluída!', 'success');
  }

  return { 
    extraData, fetchExtraData, addMachineAction, togglePartStatus, deletePart,
    setAsCover, runAIAnalysis, runAutoScan, deleteDocument, updateVerifications,
    analyzingDocId, batchProgress 
  };
}
