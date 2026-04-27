import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  FilePlus, 
  Search, 
  Filter, 
  Eye, 
  Cpu, 
  AlertCircle, 
  CheckCircle2,
  ChevronDown,
  Download
} from 'lucide-react';
import { supabase } from '../../supabase';
import seedData from '../../data/seedData.json';import DocumentUploadModal from '../machinery/DocumentUploadModal';

export default function DocumentsTab() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('all');
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  async function fetchDocuments() {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('machine_documents').select('*');
      if (error) throw error;
      setDocuments(data && data.length > 0 ? data : [
        { id: "DOC_001", machine: "DKB6L", title: "P39 液压系统图 — Diagrama Hidráulico", cat: "diagrama_hidraulico", lang: "zh/pt", size: "2.4MB", ai: "Analyzed" },
        { id: "DOC_002", machine: "Chin Fong GTX", title: "GTX-250 Safety Interlock Layout", cat: "desenho_tecnico", lang: "en", size: "5.1MB", ai: "Pending" },
        { id: "DOC_003", machine: "Jifu MD10", title: "Robot Controller IO Mapping", cat: "diagrama_eletrico", lang: "en", size: "1.2MB", ai: "Analyzed" },
        { id: "DOC_004", machine: "Seyu OCP", title: "Manual de Instruções Operacionais", cat: "manual_fabricante", lang: "pt", size: "12.8MB", ai: "Analyzed" },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const gaps = [
    { machine: "DKB6L / SPB65D", doc: "Diagramas Elétricos As-Built", impact: "CRÍTICO", color: "text-accentRed" },
    { machine: "DKB6L / SPB65D", doc: "APR — NBR ISO 12100", impact: "CRÍTICO", color: "text-accentRed" },
    { machine: "Prensa SEYI", doc: "Diagrama Unifilar Painel", impact: "ALTO", color: "text-accentAmber" },
    { machine: "Prensa Viradeira", doc: "Diagrama Hidráulico Completo", impact: "ALTO", color: "text-accentAmber" },
    { machine: "Prensa Hidr. 4C", doc: "Manual Técnico Completo", impact: "ALTO", color: "text-accentAmber" },
    { machine: "Todas", doc: "Procedimentos LOTO", impact: "CRÍTICO", color: "text-accentRed" },
  ];


  return (
    <div className="space-y-8">
      <DocumentUploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
      
      {/* HEADER STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Documentos Totais", value: "32", icon: FileText, color: "text-textSecondary" },
          { label: "Analisados por IA", value: "68%", icon: Cpu, color: "text-accentBlue" },
          { label: "Flags de Risco IA", value: "12", icon: AlertCircle, color: "text-accentRed" },
          { label: "Gaps Identificados", value: "06", icon: Filter, color: "text-accentAmber" },
        ].map((stat, i) => (
          <div key={i} className="bento-card p-6 border-b-4 border-b-borderBrand" style={{ borderBottomColor: stat.label === 'Flags de Risco IA' ? 'var(--tw-accentRed)' : '' }}>
            <div className="flex items-center gap-3 mb-2">
              <stat.icon size={16} className={stat.color} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-textMuted">{stat.label}</span>
            </div>
            <h4 className="text-2xl font-bold">{stat.value}</h4>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* DOCUMENT LIBRARY */}
        <div className="col-span-12">
          <div className="bento-card min-h-[600px] flex flex-col shadow-sm border border-borderBrand/50 bg-white">
            <div className="p-8 border-b border-borderBrand flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
               <div className="border-l-4 border-accentAmber pl-4">
                  <h3 className="text-xl font-bold text-textPrimary font-sora tracking-tight">Biblioteca Técnica de Documentos</h3>
                  <p className="text-sm text-textMuted mt-1">Gestão centralizada de conformidade e auditoria</p>
               </div>
               <div className="flex gap-3 w-full md:w-auto">
                 <button 
                   onClick={() => setIsUploadOpen(true)}
                   className="flex-1 md:flex-none py-2.5 px-6 bg-accentAmber text-white text-[10px] font-bold uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-accentAmber/20 hover:bg-accentAmberHover transition-all"
                 >
                   <FilePlus size={16} />
                   Upload Documento
                 </button>
               </div>
            </div>

            <div className="p-4 border-b border-borderBrand bg-surfaceSubtle/10 flex gap-3 overflow-x-auto whitespace-nowrap scrollbar-hide">
               {["Todos os Arquivos", "Diagramas Hidráulicos", "Diagramas Elétricos", "Manuais Técnicos", "APR / Laudos"].map(cat => (
                 <button key={cat} className={`px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${cat === 'Todos os Arquivos' ? 'bg-white border-accentAmber text-accentAmber shadow-sm' : 'border-borderBrand/50 text-textMuted hover:bg-white hover:border-borderStrong'}`}>
                   {cat}
                 </button>
               ))}
            </div>

            <div className="flex-1 overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="bg-surfaceSubtle/20 border-b border-borderBrand">
                     <th className="p-6 text-[9px] font-bold uppercase tracking-[0.2em] text-textMuted">ID</th>
                     <th className="p-6 text-[9px] font-bold uppercase tracking-[0.2em] text-textMuted">Ativo Vinculado</th>
                     <th className="p-6 text-[9px] font-bold uppercase tracking-[0.2em] text-textMuted">Especificação do Documento</th>
                     <th className="p-6 text-[9px] font-bold uppercase tracking-[0.2em] text-textMuted">Validação Digital</th>
                     <th className="p-6 text-[9px] font-bold uppercase tracking-[0.2em] text-textMuted text-right">Ações</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-borderBrand/50">
                   {documents.map((doc, i) => (
                     <tr key={doc.id} className="hover:bg-surfaceSubtle/50 transition-all group">
                       <td className="p-6 text-xs font-mono font-bold text-textMuted">{doc.id}</td>
                       <td className="p-6">
                         <span className="px-2.5 py-1 rounded-md bg-white border border-borderBrand text-[10px] font-bold text-textPrimary group-hover:border-accentAmber transition-all shadow-sm">{doc.machine}</span>
                       </td>
                       <td className="p-6">
                         <p className="text-sm font-bold text-textPrimary group-hover:text-accentAmber transition-colors leading-snug">{doc.title}</p>
                         <div className="flex gap-2 mt-1.5">
                           <span className="text-[9px] text-textMuted uppercase font-bold tracking-tighter bg-surfaceSubtle px-1.5 py-0.5 rounded">{doc.cat}</span>
                           <span className="text-[9px] text-textMuted uppercase font-bold tracking-tighter">| {doc.lang}</span>
                           <span className="text-[9px] text-textMuted uppercase font-bold tracking-tighter">| {doc.size}</span>
                         </div>
                       </td>
                       <td className="p-6">
                         <div className="flex items-center gap-2.5">
                           {doc.ai === 'Analyzed' ? (
                             <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-accentGreen/5 border border-accentGreen/10">
                               <CheckCircle2 size={12} className="text-accentGreen" />
                               <span className="text-[9px] font-bold uppercase text-accentGreen tracking-wider">Auditado</span>
                             </div>
                           ) : (
                             <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-accentAmber/5 border border-accentAmber/10">
                               <div className="w-2 h-2 rounded-full border-2 border-accentAmber/30 border-t-accentAmber animate-spin" />
                               <span className="text-[9px] font-bold uppercase text-accentAmber tracking-wider">Analisando</span>
                             </div>
                           )}
                         </div>
                       </td>
                       <td className="p-6 text-right">
                         <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            <button className="p-2.5 bg-white rounded-xl border border-borderBrand hover:border-accentAmber hover:text-accentAmber shadow-sm transition-all" title="Visualizar">
                               <Eye size={14} />
                            </button>
                            <button className="p-2.5 bg-white rounded-xl border border-borderBrand hover:border-accentAmber hover:text-accentAmber shadow-sm transition-all" title="Análise IA">
                               <Cpu size={14} />
                            </button>
                            <button className="p-2.5 bg-white rounded-xl border border-borderBrand hover:border-accentAmber hover:text-accentAmber shadow-sm transition-all" title="Download">
                               <Download size={14} />
                            </button>
                         </div>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
            </div>

            <div className="p-6 border-t border-borderBrand flex justify-between items-center bg-surfaceSubtle/20">
               <p className="text-[10px] text-textMuted font-bold uppercase tracking-widest">Exibindo {documents.length} registros técnicos</p>
               <div className="flex gap-3">
                 <button className="p-2.5 bg-white border border-borderBrand rounded-xl disabled:opacity-30 hover:border-accentAmber transition-colors" disabled>
                    <ChevronDown size={14} className="rotate-90" />
                 </button>
                 <button className="p-2.5 bg-white border border-borderBrand rounded-xl hover:border-accentAmber transition-colors">
                    <ChevronDown size={14} className="-rotate-90" />
                 </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
