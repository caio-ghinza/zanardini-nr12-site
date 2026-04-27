import { useState } from 'react';
import { supabase } from '../supabase';
import { compressImage } from '../utils/imageUtils';
import { categorizeDocument } from '../services/aiService';
import { useUI } from '../components/ui/UIContext';

/**
 * Funções auxiliares para numeração DOC #
 */
const getMachineSlug = (machine) =>
  (machine.model || machine.name)
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase()
    .slice(0, 6);

const formatDocNumber = (machine, seq) =>
  `${getMachineSlug(machine)}-${String(seq).padStart(3, '0')}`;

/**
 * Hook para gerenciar uploads de documentos e imagens para o Supabase Storage.
 */
export function useMachineUpload(selectedMachine, onUploadSuccess) {
  const [uploading, setUploading] = useState(false);
  const { addToast } = useUI();

  async function handleFileUpload(file, type, title = '') {
    if (!file || !selectedMachine || !selectedMachine.id) {
      addToast('Selecione uma máquina válida para anexar arquivos.', 'error');
      return;
    }
    
    let fileToUpload = file;
    // Comprime se for imagem e tiver mais de 1MB
    if (type === 'image' && file.size > 1024 * 1024) {
      setUploading(true);
      fileToUpload = await compressImage(file);
    }

    setUploading(true);
    
    // Configurações do Upload
    const bucket = type === 'doc' ? 'machine-docs' : 'machine-images';
    const fileExt = fileToUpload.name.split('.').pop();
    const fileName = `${selectedMachine.id}/${Date.now()}.${fileExt}`;

    try {
      // 1. Categorização Inteligente se for DOC
      let category = 'laudo';
      if (type === 'doc') {
        category = await categorizeDocument(title || file.name);
      }

      // 2. Upload para o Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, fileToUpload);

      if (uploadError) throw uploadError;

      // 3. Obter URL Pública
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      // 4. Gerar DOC # se for documento
      let docNumber = null;
      if (type === 'doc') {
        const { data: seqData, error: seqError } = await supabase
          .from('next_doc_number_per_machine')
          .select('next_number')
          .eq('machine_id', selectedMachine.id)
          .single();

        if (seqError && seqError.code !== 'PGRST116') throw seqError;
        const nextSeq = seqData?.next_number || 1;
        docNumber = formatDocNumber(selectedMachine, nextSeq);
      }

      // 5. Salvar no Banco de Dados
      const table = type === 'doc' ? 'machine_documents' : 'machine_images';
      const dbPayload = type === 'doc' 
        ? { 
            machine_id: selectedMachine.id, 
            title: title || file.name, 
            file_url: publicUrl, 
            category: category,
            doc_number: docNumber 
          }
        : { 
            machine_id: selectedMachine.id, 
            url: publicUrl 
          };

      const { error: dbError } = await supabase.from(table).insert([dbPayload]);
      if (dbError) throw dbError;

      if (type === 'doc') {
        addToast(`Documento salvo: ${docNumber}`, 'success');
      } else {
        addToast('Imagem anexada com sucesso!', 'success');
      }

      if (onUploadSuccess) onUploadSuccess(selectedMachine.id);
    } catch (err) {
      console.error('Upload Error:', err);
      addToast('Erro no upload: ' + (err.message || 'Erro desconhecido.'), 'error');
    } finally {
      setUploading(false);
    }
  }

  return { uploading, handleFileUpload };
}

