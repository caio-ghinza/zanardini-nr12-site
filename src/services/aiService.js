const API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const MODEL_PRIMARY = "llama-3.3-70b-versatile";
const MODEL_FALLBACK = "llama-3.1-8b-instant";

/**
 * Realiza análise técnica de documentos NR-12 usando Groq API.
 */
export async function analyzeNR12Document(title, fileUrl) {
  if (!API_KEY) {
    throw new Error("VITE_GROQ_API_KEY não configurada.");
  }

  const prompt = `
    Você é um Auditor Documental Técnico especialista em Engenharia e Segurança do Trabalho (NR-12). 
    Sua função é analisar o documento técnico fornecido e extrair fatos baseados EXCLUSIVAMENTE no texto.

    REGRAS ESTRITAS DE SOBREVIVÊNCIA:
    1. ZERO ALUCINAÇÃO: É proibido inventar informações. Se não estiver no texto, use "Não informado no documento".
    2. FILTRO DE CONTEXTO: Se o documento não for relacionado a máquinas, diagramas ou engenharia NR-12, defina "is_relevant": false.
    3. FORMATO DE SAÍDA: Responda APENAS em JSON estrito.

    DOCUMENTO: "${title}"
    URL: ${fileUrl}

    ESTRUTURA JSON OBRIGATÓRIA:
    {
      "is_relevant": boolean,
      "classification": "A | B | C | D | E",
      "executive_summary": "Texto formatado contendo: Classificação, Resumo Executivo (1 parágrafo) e Análise Específica detalhada seguindo o protocolo de campos para a categoria selecionada (A, B, C, D ou E). Use Markdown para negritos e quebras de linha.",
      "usage_priority": "altissima" | "alta" | "media" | "baixa",
      "critical_alerts": [
        {
          "severity": "critico" | "alto" | "medio" | "informativo",
          "title": "string",
          "description": "string",
          "nr12_reference": "string or null"
        }
      ],
      "missing_documents": [
        { "title": "Nome do documento ausente (ex: Diagrama Lógico)" }
      ]
    }

    CRITÉRIOS DE PRIORIDADE:
    - altissima: Riscos iminentes, falta de dispositivos de parada de emergência ou proteção física.
    - alta: Falhas graves em diagramas elétricos/hidráulicos ou falta de redundância (duplo canal).
    - media: Documentação técnica incompleta ou manuais desatualizados.
    - baixa: Documentos informativos, certificados ou ARTs de conformidade.

    CATEGORIAS DE CLASSIFICAÇÃO:
    [A] Diagrama Elétrico (As-Built)
    [B] Diagrama Hidráulico e Pneumático
    [C] Manual de Operação e Instalação
    [D] Manual de Manutenção
    [E] Outro / Documento Técnico Genérico
  `;

  try {
    return await callGroqAPI(prompt, MODEL_PRIMARY);
  } catch (error) {
    console.warn("Falha no modelo principal, tentando fallback...", error);
    return await callGroqAPI(prompt, MODEL_FALLBACK);
  }
}

async function callGroqAPI(prompt, model) {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.1
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "Erro na API Groq");
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  const result = JSON.parse(text);
  
  return { ...result, model_used: model };
}

/**
 * Identifica a categoria técnica de um documento (Laudo, ART, Manual, etc).
 */
export async function categorizeDocument(title) {
  if (!API_KEY) return 'laudo';
  
  const prompt = `
    Analise o título do documento e retorne apenas UMA palavra com a categoria: 
    "laudo", "art", "manual", "desenho" ou "certificado".
    
    Título: "${title}"
    
    JSON: { "category": "string" }
  `;

  try {
    const res = await callGroqAPI(prompt, MODEL_PRIMARY);
    return res.category?.toLowerCase() || 'laudo';
  } catch {
    return 'laudo';
  }
}
