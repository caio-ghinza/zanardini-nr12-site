import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * Gera um relatório técnico profissional em PDF para uma máquina específica.
 * Inclui dados do inventário, documentos anexados e gaps identificados por IA.
 */
export const generateMachineReport = (machine, extraData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const primaryColor = [217, 119, 6]; // #D97706 (Amber)
  const secondaryColor = [26, 26, 26]; // #1A1A1A (Dark)

  // --- CABEÇALHO ---
  doc.setFillColor(...secondaryColor);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('ZANARDINI ENGENHARIA', 20, 25);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('RELATÓRIO TÉCNICO DE CONFORMIDADE NR-12', 20, 32);
  
  const today = new Date().toLocaleDateString('pt-BR');
  doc.text(`DATA: ${today}`, pageWidth - 60, 32);

  // --- DADOS DA MÁQUINA ---
  let cursorY = 55;
  doc.setTextColor(...secondaryColor);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(machine.name || 'Nome da Máquina não definido', 20, cursorY);
  
  cursorY += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`MODELO: ${machine.model || 'N/A'}`, 20, cursorY);
  doc.text(`TIPO: ${machine.machine_type || 'N/A'}`, 80, cursorY);
  doc.text(`NÍVEL DE RISCO: ${String(machine.risk_level || 'N/A').toUpperCase()}`, 140, cursorY);

  cursorY += 15;
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(20, cursorY, pageWidth - 20, cursorY);

  // --- TABELA DE DOCUMENTOS (DOSSIÊ) ---
  cursorY += 15;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('1. DOSSIÊ TÉCNICO (DOCUMENTOS)', 20, cursorY);

  const docRows = (extraData.documents || []).map(d => [
    d.doc_number || 'N/A',
    d.title,
    String(d.category || 'LAUDO').toUpperCase(),
    d.ai_analyzed_at ? 'ANALISADO' : 'PENDENTE'
  ]);

  doc.autoTable({
    startY: cursorY + 5,
    head: [['DOC #', 'TÍTULO', 'CATEGORIA', 'STATUS IA']],
    body: docRows.length > 0 ? docRows : [['-', 'Nenhum documento anexado', '-', '-']],
    headStyles: { fillColor: primaryColor },
    margin: { left: 20, right: 20 },
    theme: 'striped'
  });

  cursorY = doc.lastAutoTable.finalY + 20;

  // --- TABELA DE GAPS (AUDITORIA) ---
  if (cursorY > 240) { doc.addPage(); cursorY = 20; }
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('2. AUDITORIA DE LACUNAS (GAPS)', 20, cursorY);

  const gapRows = (extraData.gaps || []).map(g => [
    g.title,
    String(g.severity || 'MÉDIO').toUpperCase(),
    String(g.source || 'IA').toUpperCase(),
    g.resolved ? 'RESOLVIDO' : 'ABERTO'
  ]);

  doc.autoTable({
    startY: cursorY + 5,
    head: [['DESCRIÇÃO DO GAP', 'SEVERIDADE', 'ORIGEM', 'STATUS']],
    body: gapRows.length > 0 ? gapRows : [['-', 'Nenhum gap identificado', '-', '-']],
    headStyles: { fillColor: [220, 38, 38] }, // Red for Gaps
    margin: { left: 20, right: 20 },
    theme: 'grid'
  });

  // --- RODAPÉ DE PÁGINAS ---
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Página ${i} de ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
    doc.text('Gerado automaticamente pelo Sistema DocView / Zanardini Engenharia', 20, doc.internal.pageSize.getHeight() - 10);
  }

  doc.save(`Relatorio_${machine.name.replace(/\s+/g, '_')}_${Date.now()}.pdf`);
};
