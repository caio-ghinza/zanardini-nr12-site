import React from 'react';
import { FileText, Eye, Zap, BrainCircuit, CheckCircle } from 'lucide-react';
import AIAnalysisCard from '../AIAnalysisCard';

export default function DossierTab({ 
  extraData, 
  uploading, 
  handleFileUpload, 
  setIsPdfOpen, 
  analyzingDocId, 
  runAIAnalysis 
}) {
  return (
    <div className="max-w-3xl mx-auto space-y-4 text-left">
      <div className="p-6 bg-surfaceSubtle rounded-2xl border border-borderBrand flex flex-col gap-4">
         <p className="text-[10px] font-bold uppercase tracking-widest text-textMuted">Upload de Novo Documento</p>
         <div className="flex gap-4">
           <input id="docTitle" type="text" placeholder="Título do documento..." className="flex-1 p-3 rounded-xl border border-borderBrand outline-none text-xs font-bold" />
           <label className={`px-6 py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all ${uploading ? 'bg-textMuted' : 'bg-textPrimary hover:bg-accentAmber'} text-white`}>
              <FileText size={18} />
              <span className="text-[10px] font-bold uppercase tracking-widest">{uploading ? 'Enviando...' : 'Selecionar PDF'}</span>
              <input 
                type="file" 
                className="hidden" 
                accept=".pdf"
                disabled={uploading}
                onChange={(e) => {
                  const titleInput = document.getElementById('docTitle');
                  handleFileUpload(e.target.files[0], 'doc', titleInput.value);
                  titleInput.value = '';
                }}
              />
           </label>
         </div>
      </div>

      {extraData.documents.map((d, i) => (
        <div 
          key={d.id || i} 
          className="p-5 rounded-2xl border border-brand hover:border-accentAmber group transition-all bg-white shadow-sm hover:shadow-md flex flex-col gap-4" 
        >
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-surfaceSubtle rounded-xl flex items-center justify-center text-accentAmber border border-borderBrand">
                   <FileText size={24} />
                </div>
                <div>
                   <div className="flex items-center gap-2">
                     <p className="text-sm font-bold text-textPrimary leading-tight">{d.title}</p>
                   </div>
                   <p className="text-[9px] text-textMuted uppercase font-bold tracking-widest">{d.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                 <button 
                   onClick={() => setIsPdfOpen(d.file_url)}
                   title="Visualizar PDF"
                   className="p-2.5 opacity-0 group-hover:opacity-100 transition-all hover:bg-accentAmberLight rounded-xl text-accentAmber border border-borderBrand"
                 >
                    <Eye size={20} />
                 </button>
                 <button 
                   disabled={analyzingDocId === d.id}
                   title={d.ai_analyzed_at ? "Reanalisar com IA" : "Analisar com IA"}
                   onClick={(e) => { e.stopPropagation(); runAIAnalysis(d); }}
                   className={`p-2.5 opacity-0 group-hover:opacity-100 transition-all rounded-xl border border-borderBrand flex items-center gap-2 ${analyzingDocId === d.id ? 'bg-surfaceSubtle animate-pulse' : (d.ai_analyzed_at ? 'bg-accentGreenLight text-accentGreen' : 'hover:bg-accentAmberLight text-accentAmber')}`}
                 >
                    {analyzingDocId === d.id ? <Zap size={18} className="animate-spin" /> : (d.ai_analyzed_at ? <CheckCircle size={18} /> : <BrainCircuit size={18} />)}
                 </button>
              </div>
           </div>

           <AIAnalysisCard document={d} onAnalyze={() => runAIAnalysis(d)} />
        </div>
      ))}
      
      {extraData.documents.length === 0 && (
        <div className="py-20 text-center opacity-30">
          <FileText size={64} className="mx-auto mb-4" />
          <p className="text-sm font-bold uppercase tracking-widest">Nenhum documento anexado ao dossiê</p>
        </div>
      )}
    </div>
  );
}
