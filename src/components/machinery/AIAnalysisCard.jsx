import React from 'react';
import { Sparkles, BrainCircuit, FileQuestion, ShieldAlert, Tag, FileText, Search, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { severityConfig, priorityConfig } from '../../utils/machineryConstants';
import { parseAiSummary } from '../../utils/aiSummaryParser';

export default function AIAnalysisCard({ document: doc, onAnalyze }) {
  if (!doc.ai_summary) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-borderBrand rounded-2xl p-10 md:p-12 flex flex-col items-center justify-center text-center gap-4 shadow-sm"
      >
         <div className="w-16 h-16 bg-surfaceSubtle rounded-full flex items-center justify-center text-textMuted group-hover:scale-110 transition-transform duration-300">
            <FileQuestion size={32} />
         </div>
         <div>
            <p className="font-bold text-textPrimary uppercase tracking-widest text-[10px] mb-1">Nenhuma análise disponível</p>
            <p className="text-xs text-textMuted max-w-[280px]">Este documento ainda não foi processado pela auditoria digital NR-12.</p>
         </div>
         <button 
           onClick={onAnalyze}
           className="mt-2 px-8 py-3.5 bg-textPrimary text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-accentAmber transition-all flex items-center gap-2 active:scale-95 shadow-lg shadow-black/5"
         >
            <BrainCircuit size={16} />
            Analisar com IA
         </button>
      </motion.div>
    );
  }

  const isRelevant = doc.ai_risk_flags?.is_relevant !== false;
  const flags = Array.isArray(doc.ai_risk_flags?.critical_alerts) ? doc.ai_risk_flags.critical_alerts : [];
  const priority = priorityConfig[doc.ai_risk_flags?.usage_priority] || priorityConfig.media;

  const sections = parseAiSummary(doc.ai_summary);
  const iconMap = {
    tag: Tag,
    file: FileText,
    search: Search,
    alert: AlertTriangle
  };

  // ESTADO: DOCUMENTO IRRELEVANTE (ALERTA DE CONTEXTO)
  if (!isRelevant) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#FAF8F5] border-2 border-dashed border-[#EF4444]/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
      >
        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center text-[#EF4444] animate-pulse">
          <ShieldAlert size={28} />
        </div>
        <div className="space-y-2">
          <p className="font-bold font-mono text-[#EF4444] uppercase tracking-[0.25em] text-[10px]">
            Bloqueio de Contexto
          </p>
          <p className="text-sm text-[#6B6560] leading-relaxed max-w-md">
            {doc.ai_summary || "⚠️ ALERTA DE CONTEXTO: Documento não relacionado a engenharia industrial ou segurança NR-12."}
          </p>
        </div>
        <button 
           onClick={onAnalyze}
           className="mt-2 text-[10px] font-bold uppercase tracking-widest text-textMuted hover:text-textPrimary transition-colors underline underline-offset-4"
        >
          Tentar Reanalisar
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-borderBrand rounded-2xl p-6 md:p-8 flex flex-col gap-6 shadow-sm font-['IBM_Plex_Sans'] text-left transition-all hover:shadow-md"
    >
      <div className="flex justify-between items-center">
        <span className="flex items-center gap-2 text-[11px] md:text-[12px] font-bold text-[#6B6560] uppercase tracking-[0.15em] md:tracking-wider">
          <Sparkles size={16} className="text-[#D97706]" />
          Parecer Técnico IA
        </span>
        <span className="text-[9px] md:text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider shadow-sm border border-transparent" style={{ background: priority.bg, color: priority.text }}>
          {priority.label}
        </span>
      </div>

      {/* AI SUMMARY SECTIONS */}
      <div className="flex flex-col gap-4">
        {sections.length > 0 ? (
          sections.map((section, idx) => {
            const Icon = iconMap[section.icon] || FileText;
            return (
              <motion.div 
                key={idx} 
                whileHover={{ scale: 1.005 }}
                className="bg-white border border-[#E5E1D8] rounded-xl p-3.5 flex gap-3.5 shadow-sm hover:border-accentAmber/30 transition-all group"
              >
                <div className="shrink-0 p-2 bg-surfaceSubtle rounded-lg text-textSecondary group-hover:text-accentAmber transition-colors h-fit">
                  <Icon size={16} />
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-[#9C9590]">
                    {section.title}
                  </span>
                  
                  {section.isList ? (
                    <ul className="list-disc list-inside space-y-1">
                      {section.listItems.map((item, i) => (
                        <li key={i} className="text-[12.5px] text-[#1A1A1A] leading-relaxed pl-0.5">
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[12.5px] text-[#1A1A1A] leading-relaxed whitespace-pre-wrap">
                      {section.content}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="bg-[#FAF8F5] border-l-[4px] border-[#D97706] rounded-r-xl p-5 text-[13px] md:text-[14px] text-[#1A1A1A] leading-relaxed whitespace-pre-wrap font-medium shadow-inner">
            {doc.ai_summary}
          </div>
        )}
      </div>

      {flags.length > 0 && (
        <div className="flex flex-col gap-4 mt-2">
          <div className="flex items-center gap-3">
            <span className="text-[10px] md:text-[11px] font-bold text-[#9C9590] uppercase tracking-[0.2em]">
              Flags de Conformidade
            </span>
            <div className="h-px flex-1 bg-[#E5E1D8]" />
          </div>

          <div className="grid gap-3">
            {flags.map((flag, i) => {
              const cfg = severityConfig[flag.severity] || severityConfig.informativo;
              const Icon = cfg.icon;

              return (
                <motion.div 
                  key={i} 
                  whileHover={{ x: 4 }}
                  className="bg-white border border-[#E5E1D8] rounded-xl p-4 flex gap-4 hover:border-[#D97706] transition-all group shadow-sm hover:shadow-md cursor-default"
                >
                  <div className="mt-1 shrink-0">
                    <Icon size={18} style={{ color: cfg.iconColor }} />
                  </div>
                  <div className="flex-1 flex flex-col gap-1.5">
                    <div className="flex justify-between items-start gap-3">
                      <span className="text-[13px] md:text-[14px] font-bold text-[#1A1A1A] font-['Sora'] tracking-tight leading-tight">{flag.title}</span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-md uppercase border whitespace-nowrap" style={{ background: cfg.badgeBg, color: cfg.badgeText, borderColor: cfg.badgeBorder }}>
                        {cfg.label}
                      </span>
                    </div>
                    <span className="text-[12px] text-[#6B6560] leading-relaxed">{flag.description}</span>
                    {flag.nr12_reference && (
                      <div className="flex items-center gap-2 mt-2 py-1 px-2.5 bg-accentAmber/5 rounded-lg w-fit border border-accentAmber/10">
                        <span className="text-[10px] font-bold text-[#D97706] uppercase tracking-wider">Ref. Normativa:</span>
                        <span className="text-[10px] font-bold text-[#D97706]">{flag.nr12_reference}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#E5E1D8]">
        <div className="flex items-center gap-2 text-[10px] text-textMuted font-bold uppercase tracking-widest">
           <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
           Auditoria Digital Ativa
        </div>
        <span className="text-[10px] text-[#9C9590] font-medium italic">
          {doc.ai_risk_flags?.model_used || "Llama 3.3"} • {new Date(doc.ai_analyzed_at).toLocaleString("pt-BR", {
            day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
          })}
        </span>
      </div>
    </motion.div>
  );
}
