import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, File, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../../supabase';
import { useMachineUpload } from '../../hooks/useMachineUpload';
import { useUI } from '../ui/UIContext';

export default function DocumentUploadModal({ isOpen, onClose }) {
  const [machines, setMachines] = useState([]);
  const [selectedMachineId, setSelectedMachineId] = useState('');
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const { addToast } = useUI();

  const selectedMachine = machines.find(m => m.id === selectedMachineId);
  
  const { uploading, handleFileUpload } = useMachineUpload(selectedMachine, () => {
    // Success
    setFile(null);
    setTitle('');
    onClose();
  });

  useEffect(() => {
    if (isOpen) {
      fetchMachines();
    }
  }, [isOpen]);

  async function fetchMachines() {
    setIsFetching(true);
    try {
      const { data, error } = await supabase.from('machines').select('id, name, model');
      if (error) throw error;
      setMachines(data || []);
    } catch (err) {
      console.error('Error fetching machines:', err);
      addToast('Erro ao carregar máquinas.', 'error');
    } finally {
      setIsFetching(false);
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMachineId || !file) {
      addToast('Selecione uma máquina e um arquivo.', 'warning');
      return;
    }
    await handleFileUpload(file, 'doc', title);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-borderBrand/60 overflow-hidden"
        >
          <div className="p-6 border-b border-borderBrand flex justify-between items-center bg-surfaceSubtle/20">
            <div>
              <h2 className="text-xl font-bold font-sora text-textPrimary">Upload de Documento</h2>
              <p className="text-[11px] text-textMuted uppercase font-bold tracking-widest mt-1">Anexe PDFs ou manuais técnicos</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-surfaceSubtle rounded-xl transition-colors">
              <X size={20} className="text-textMuted" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-textMuted">Máquina Vinculada</label>
              <select 
                value={selectedMachineId} 
                onChange={(e) => setSelectedMachineId(e.target.value)}
                className="w-full bg-white border border-borderBrand rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accentAmber/20 focus:border-accentAmber"
                disabled={uploading || isFetching}
              >
                <option value="">Selecione um ativo...</option>
                {machines.map(m => (
                  <option key={m.id} value={m.id}>{m.name} {m.model ? `(${m.model})` : ''}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-textMuted">Título do Documento (Opcional)</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Manual de Manutenção"
                className="w-full bg-white border border-borderBrand rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accentAmber/20 focus:border-accentAmber"
                disabled={uploading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-textMuted">Arquivo</label>
              <div className="border-2 border-dashed border-borderBrand rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-accentAmber/50 hover:bg-accentAmber/5 transition-colors group relative cursor-pointer">
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploading}
                />
                
                {file ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-accentAmber/10 flex items-center justify-center text-accentAmber">
                      <File size={24} />
                    </div>
                    <p className="text-sm font-bold text-textPrimary">{file.name}</p>
                    <p className="text-[10px] font-mono text-textMuted">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-surfaceSubtle flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Upload size={20} className="text-textSecondary group-hover:text-accentAmber" />
                    </div>
                    <p className="text-sm font-bold text-textPrimary">Clique ou arraste um arquivo</p>
                    <p className="text-xs text-textMuted mt-1">PDF, DOC, XLS (máx. 50MB)</p>
                  </>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-borderBrand flex gap-3">
              <button 
                type="button" 
                onClick={onClose}
                className="flex-1 px-4 py-3 text-sm font-bold text-textSecondary hover:bg-surfaceSubtle rounded-xl transition-colors"
                disabled={uploading}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="flex-1 px-4 py-3 bg-accentAmber text-white text-sm font-bold rounded-xl shadow-lg shadow-accentAmber/20 hover:bg-accentAmberHover transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                disabled={uploading || !file || !selectedMachineId}
              >
                {uploading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Upload size={18} />
                    Salvar Documento
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
