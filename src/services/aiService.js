const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL_PRIMARY = "gemini-2.5-flash";
const MODEL_FALLBACK = "gemini-1.5-pro";

/**
 * Realiza análise técnica de documentos NR-12 usando Gemini AI.
 */
export async function analyzeNR12Document(title, fileUrl) {
  if (!API_KEY) {
    throw new Error("VITE_GEMINI_API_KEY não configurada.");
  }

  const prompt = `
    Você é um auditor sênior de segurança do trabalho especializado na norma brasileira NR-12.
    Analise o documento técnico abaixo e forneça um parecer profissional.

    DOCUMENTO: "${title}"
    URL: ${fileUrl}

    REGRAS DE RESPOSTA:
    1. Forneça o resultado estritamente em JSON.
    2. Use linguagem técnica e formal, mas evite caixa alta (All Caps) desnecessária.
    3. O resumo executivo deve ser conciso e focado em riscos.

    FORMATO JSON ESPERADO:
    {
      "executive_summary": "string",
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
        {
          "title": "string",
          "reason": "Por que este documento é necessário para conformidade NR-12",
          "nr12_reference": "string or null"
        }
      ],
      "model_used": "string"
    }
  `;

  try {
    return await callGeminiAPI(prompt, MODEL_PRIMARY);
  } catch (error) {
    console.warn("Falha no modelo Flash, tentando fallback para Pro...", error);
    return await callGeminiAPI(prompt, MODEL_FALLBACK);
  }
}

async function callGeminiAPI(prompt, model) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          response_mime_type: "application/json",
        },
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "Erro na API Gemini");
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
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
    const res = await callGeminiAPI(prompt, MODEL_PRIMARY);
    return res.category?.toLowerCase() || 'laudo';
  } catch {
    return 'laudo';
  }
}
