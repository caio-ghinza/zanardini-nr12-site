import React from 'react';
import { Sparkles, BrainCircuit, FileQuestion } from 'lucide-react';
import { severityConfig, priorityConfig } from '../../utils/machineryConstants';

/**
 * Componente premium para visualização da auditoria digital realizada pelo Gemini.
 */
export default function AIAnalysisCard({ document: doc, onAnalyze }) {
  if (!doc.ai_summary) {
    return (
      <div className="bg-white border border-borderBrand rounded-2xl p-12 flex flex-col items-center justify-center text-center gap-4">
         <div className="w-16 h-16 bg-surfaceSubtle rounded-full flex items-center justify-center text-textMuted">
            <FileQuestion size={32} />
         </div>
         <div>
            <p className="font-bold text-textPrimary uppercase tracking-widest text-[10px] mb-1">Nenhuma análise disponível</p>
            <p className="text-xs text-textMuted">Este documento ainda não foi processado pela auditoria digital.</p>
         </div>
         <button 
           onClick={onAnalyze}
           className="mt-2 px-6 py-3 bg-textPrimary text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-accentAmber transition-all flex items-center gap-2"
         >
            <BrainCircuit size={16} />
            Analisar com IA
         </button>
      </div>
    );
  }

  const flags = Array.isArray(doc.ai_risk_flags?.critical_alerts) ? doc.ai_risk_flags.critical_alerts : [];
  const priority = priorityConfig[doc.ai_risk_flags?.usage_priority] || priorityConfig.media;

  return (
    <div className="bg-white border border-borderBrand rounded-2xl p-6 flex flex-col gap-5 shadow-sm font-['IBM_Plex_Sans'] text-left">
      <div className="flex justify-between items-center">
        <span className="flex items-center gap-2 text-[12px] font-semibold text-[#6B6560] uppercase tracking-wider">
          <Sparkles size={14} className="text-[#D97706]" />
          Parecer Técnico IA
        </span>
        <span className="text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider" style={{ background: priority.bg, color: priority.text }}>
          {priority.label}
        </span>
      </div>

      <div className="bg-[#FAF8F5] border-l-[3px] border-[#D97706] rounded-r-lg p-4 text-[13px] text-[#1A1A1A] leading-relaxed">
        {doc.ai_summary}
      </div>

      {flags.length > 0 && <hr className="border-none border-t border-[#E5E1D8] m-0" />}

      {flags.length > 0 && (
        <div className="flex flex-col gap-3">
          <span className="text-[11px] font-semibold text-[#9C9590] uppercase tracking-widest">
            Flags Identificadas
          </span>

          {flags.map((flag, i) => {
            const cfg = severityConfig[flag.severity] || severityConfig.informativo;
            const Icon = cfg.icon;

            return (
              <div key={i} className="bg-white border border-[#E5E1D8] rounded-lg p-3 flex gap-3 hover:border-[#D97706] transition-all group">
                <Icon size={16} style={{ color: cfg.iconColor, marginTop: 2, flexShrink: 0 }} />
                <div className="flex-1 flex flex-col gap-1">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[13px] font-semibold text-[#1A1A1A] font-['Sora']">{flag.title}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase border" style={{ background: cfg.badgeBg, color: cfg.badgeText, borderColor: cfg.badgeBorder }}>
                      {cfg.label}
                    </span>
                  </div>
                  <span className="text-[12px] text-[#6B6560] leading-relaxed">{flag.description}</span>
                  {flag.nr12_reference && (
                    <span className="text-[11px] text-[#D97706] font-medium mt-1">📋 {flag.nr12_reference}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <span className="text-[11px] text-[#9C9590] text-right mt-2">
        Analisado por {doc.ai_risk_flags?.model_used || "Gemini"} • {new Date(doc.ai_analyzed_at).toLocaleString("pt-BR", {
          day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
        })}
      </span>
    </div>
  );
}
