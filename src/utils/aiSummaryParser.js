/**
 * Utilitário para transformar o ai_summary textual (Markdown) em um array estruturado de seções.
 */
export function parseAiSummary(text) {
  if (!text || typeof text !== 'string') return [];

  // Padrão: **Título:** Conteúdo
  const sectionRegex = /\*\*(.*?):\*\*\s*([\s\S]*?)(?=\*\*|$)/g;
  const sections = [];
  let match;

  while ((match = sectionRegex.exec(text)) !== null) {
    const title = match[1].trim();
    let content = match[2].trim();

    // Identifica ícone baseado no título
    let icon = 'file';
    if (title.toLowerCase().includes('classificação')) icon = 'tag';
    if (title.toLowerCase().includes('resumo')) icon = 'file';
    if (title.toLowerCase().includes('análise') || title.toLowerCase().includes('específica')) icon = 'search';
    if (title.toLowerCase().includes('risco') || title.toLowerCase().includes('flag')) icon = 'alert';

    // Trata listas de bullets (- )
    const lines = content.split('\n').map(line => line.trim()).filter(line => line !== '');
    const isList = lines.every(line => line.startsWith('-'));

    sections.push({
      title,
      content,
      isList,
      listItems: isList ? lines.map(line => line.replace(/^-\s*/, '')) : [],
      icon
    });
  }

  return sections;
}

// Teste rápido no console (descomente para debug se necessário)
// const testText = "**Classificação do Documento:** [A]\n\n**Resumo Executivo:**\nO documento...\n\n**Análise Específica:**\n- Tensão: 24V\n- Componentes: X";
// console.log("Parser Test:", parseAiSummary(testText));
