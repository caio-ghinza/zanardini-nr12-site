import { useState, useEffect } from 'react';
import { 
  FileText, 
  FilePlus, 
  Eye, 
  Cpu, 
  AlertCircle, 
  CheckCircle2,
  ChevronDown,
  Download,
  Filter
} from 'lucide-react';
import { supabase } from '../../supabase';
import DocumentUploadModal from '../machinery/DocumentUploadModal';

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
      const { data, error } = await supabase
        .from('machine_documents')
        .select(`
          *,
          machines (
            name
          )
        `)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setDocuments(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Estatísticas Dinâmicas
  const stats = {
    total: documents.length,
    analyzed: documents.filter(d => d.ai_analyzed_at).length,
    flags: documents.reduce((acc, d) => acc + (d.ai_risk_flags?.critical_alerts?.length || 0), 0),
    gaps: documents.reduce((acc, d) => acc + (d.ai_risk_flags?.missing_documents?.length || 0), 0),
  };

  const analyzedPercentage = stats.total > 0 
    ? Math.round((stats.analyzed / stats.total) * 100) 
    : 0;

  const categories = [
    { id: 'all', label: "Todos os Arquivos" },
    { id: 'diagrama_hidraulico', label: "Diagramas Hidráulicos" },
    { id: 'diagrama_eletrico', label: "Diagramas Elétricos" },
    { id: 'manual_fabricante', label: "Manuais Técnicos" },
    { id: 'laudo_apr', label: "APR / Laudos" }
  ];

  const filteredDocuments = documents.filter(doc => 
    filterCategory === 'all' || doc.category === filterCategory
  );

  return (
    <div className="space-y-8">
      <DocumentUploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} onUploadSuccess={fetchDocuments} />
      
      {/* HEADER STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: "Documentos Totais", value: stats.total.toString().padStart(2, '0'), icon: FileText, color: "text-textSecondary" },
          { label: "Analisados por IA", value: `${analyzedPercentage}%`, icon: Cpu, color: "text-accentBlue" },
          { label: "Flags de Risco IA", value: stats.flags.toString().padStart(2, '0'), icon: AlertCircle, color: "text-accentRed" },
          { label: "Gaps Identificados", value: stats.gaps.toString().padStart(2, '0'), icon: Filter, color: "text-accentAmber" },
        ].map((stat, i) => (
          <div key={i} className="bento-card p-4 md:p-6 border-b-4 border-b-borderBrand" style={{ borderBottomColor: stat.label === 'Flags de Risco IA' && stats.flags > 0 ? 'var(--tw-accentRed)' : '' }}>
            <div className="flex items-center gap-3 mb-2">
              <stat.icon size={14} className={`${stat.color} md:w-4 md:h-4`} />
              <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-textMuted">{stat.label}</span>
            </div>
            <h4 className="text-xl md:text-2xl font-bold">{stat.value}</h4>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6 md:gap-8">
        {/* DOCUMENT LIBRARY */}
        <div className="col-span-12">
          <div className="bento-card min-h-[500px] md:min-h-[600px] flex flex-col shadow-sm border border-borderBrand/50 bg-white">
            <div className="p-5 md:p-8 border-b border-borderBrand flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
               <div className="border-l-4 border-accentAmber pl-4">
                  <h3 className="text-lg md:text-xl font-bold text-textPrimary font-sora tracking-tight">Biblioteca Técnica</h3>
                  <p className="text-xs md:text-sm text-textMuted mt-1">Conformidade e auditoria centralizada</p>
               </div>
               <div className="flex gap-3 w-full md:w-auto">
                 <button 
                   onClick={() => setIsUploadOpen(true)}
                   className="flex-1 md:flex-none py-3 px-6 bg-accentAmber text-white text-[10px] font-bold uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-accentAmber/20 hover:bg-accentAmberHover transition-all active:scale-95"
                 >
                   <FilePlus size={16} />
                   Upload
                 </button>
               </div>
            </div>

            <div className="p-3 md:p-4 border-b border-borderBrand bg-surfaceSubtle/10 flex gap-2 md:gap-3 overflow-x-auto whitespace-nowrap scrollbar-hide">
               {categories.map(cat => (
                 <button 
                   key={cat.id} 
                   onClick={() => setFilterCategory(cat.id)}
                   className={`px-4 md:px-5 py-2 rounded-xl text-[9px] md:text-[10px] font-bold uppercase tracking-widest border transition-all ${filterCategory === cat.id ? 'bg-white border-accentAmber text-accentAmber shadow-sm' : 'border-borderBrand/50 text-textMuted hover:bg-white hover:border-borderStrong'}`}
                 >
                   {cat.label}
                 </button>
               ))}
            </div>

            <div className="flex-1 overflow-x-auto">
               <table className="w-full text-left border-collapse min-w-[800px] md:min-w-0">
                 <thead>
                   <tr className="bg-surfaceSubtle/20 border-b border-borderBrand">
                     <th className="p-4 md:p-6 text-[9px] font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] text-textMuted">ID</th>
                     <th className="p-4 md:p-6 text-[9px] font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] text-textMuted">Ativo</th>
                     <th className="p-4 md:p-6 text-[9px] font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] text-textMuted">Documento</th>
                     <th className="p-4 md:p-6 text-[9px] font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] text-textMuted">Status</th>
                     <th className="p-4 md:p-6 text-[9px] font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] text-textMuted text-right">Ações</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-borderBrand/50">
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="p-20 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <div className="w-8 h-8 border-4 border-accentAmber/20 border-t-accentAmber rounded-full animate-spin mb-4" />
                            <p className="text-xs font-bold uppercase tracking-widest text-textMuted">Carregando documentos...</p>
                          </div>
                        </td>
                      </tr>
                    ) : filteredDocuments.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="p-20 text-center">
                          <div className="flex flex-col items-center justify-center opacity-20">
                            <FileText size={48} className="mb-4" />
                            <p className="text-xs font-bold uppercase tracking-widest text-textMuted">
                              {filterCategory === 'all' ? 'Nenhum documento técnico encontrado' : 'Nenhum arquivo nesta categoria'}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredDocuments.map((doc) => (
                        <tr key={doc.id} className="hover:bg-surfaceSubtle/50 transition-all group">
                          <td className="p-6 text-xs font-mono font-bold text-textMuted">
                            {doc.id.substring(0, 8)}...
                          </td>
                          <td className="p-6">
                            <span className="px-2.5 py-1 rounded-md bg-white border border-borderBrand text-[10px] font-bold text-textPrimary group-hover:border-accentAmber transition-all shadow-sm">
                              {doc.machines?.name || 'Geral'}
                            </span>
                          </td>
                          <td className="p-6">
                            <p className="text-sm font-bold text-textPrimary group-hover:text-accentAmber transition-colors leading-snug">{doc.title}</p>
                            <div className="flex gap-2 mt-1.5">
                              <span className="text-[9px] text-textMuted uppercase font-bold tracking-tighter bg-surfaceSubtle px-1.5 py-0.5 rounded">{doc.category || 'Dossiê'}</span>
                              <span className="text-[9px] text-textMuted uppercase font-bold tracking-tighter">| {doc.file_type || 'PDF'}</span>
                              <span className="text-[9px] text-textMuted uppercase font-bold tracking-tighter">
                                {doc.file_size_kb != null
                                   ? `| ${(doc.file_size_kb / 1024).toFixed(1)} MB`
                                   : ''}
                              </span>
                            </div>
                          </td>
                          <td className="p-6">
                            <div className="flex items-center gap-2.5">
                              {doc.ai_analyzed_at ? (
                                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-accentGreen/5 border border-accentGreen/10">
                                  <CheckCircle2 size={12} className="text-accentGreen" />
                                  <span className="text-[9px] font-bold uppercase text-accentGreen tracking-wider">Auditado</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-accentAmber/5 border border-accentAmber/10">
                                  <div className="w-2 h-2 rounded-full border-2 border-accentAmber/30 border-t-accentAmber animate-spin" />
                                  <span className="text-[9px] font-bold uppercase text-accentAmber tracking-wider">Aguardando</span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="p-6 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                               <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white rounded-xl border border-borderBrand hover:border-accentAmber hover:text-accentAmber shadow-sm transition-all" title="Visualizar">
                                  <Eye size={14} />
                               </a>
                               <a href={doc.file_url} download className="p-2.5 bg-white rounded-xl border border-borderBrand hover:border-accentAmber hover:text-accentAmber shadow-sm transition-all" title="Download">
                                  <Download size={14} />
                               </a>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                 </tbody>
               </table>
            </div>

            <div className="p-6 border-t border-borderBrand flex justify-between items-center bg-surfaceSubtle/20">
               <p className="text-[10px] text-textMuted font-bold uppercase tracking-widest">Exibindo {filteredDocuments.length} registros técnicos</p>
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
