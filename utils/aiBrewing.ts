import { AIBrewingPlan } from '../types';

// System Prompt remains the same
const SYSTEM_PROMPT = `
# Role
You are a world-class Tea Master (AI Chashi). You possess deep knowledge of tea chemistry, thermodynamics, and the philosophy of Wabi-sabi.

# Task
Receive a user's tea description (name, origin, age, mood, etc.) and generate a precise, custom brewing recipe.

# Output Requirement
You must output ONLY valid JSON. No markdown formatting, no code blocks, no intro text.

# JSON Structure
{
  "tea_type": "Name of tea",
  "grade": "AI_Custom",
  "description": "Elegant, poetic description (max 30 words)",
  "parameters": {
    "water_temperature": 80,
    "leaf_amount": 4,
    "water_amount": 100
  },
  "steeps": [
    { "duration": 60, "note": "Brief instruction" }
  ]
}
`;

const MOCK_PLAN: AIBrewingPlan = {
  tea_type: "Kyoto Old Growth (Mock)",
  grade: "AI_Custom",
  description: "Time has settled in these leaves. We use gentle heat to awaken the dormant spirit within.",
  parameters: {
    water_temperature: 82,
    leaf_amount: 4.5,
    water_amount: 120
  },
  steeps: [
    { duration: 45, note: "Rinse quickly, then let the leaves breathe." },
    { duration: 25, note: "A flash steep to capture the rising aroma." },
    { duration: 60, note: "Deep extraction of the aged mellow sweetness." }
  ]
};

// --- Helper to get Key from multiple sources ---
export const getApiKey = (provider: 'zhipu' | 'gemini'): string | null => {
  // 1. Try Local Storage (User entered via UI)
  const localKey = localStorage.getItem(`TEAFLOW_${provider.toUpperCase()}_KEY`);
  if (localKey) return localKey;

  // 2. Try Environment Variables (Build time injection)
  // Note: Vite replaces import.meta.env.* with string literals at build time
  if (provider === 'zhipu') {
    return (import.meta as any).env?.VITE_ZHIPU_API_KEY || null;
  }
  if (provider === 'gemini') {
    return process.env.API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY || null;
  }
  
  return null;
};

// --- JWT Generation for ZhipuAI (Client-Side) ---
async function generateZhipuToken(apiKey: string): Promise<string> {
  const [id, secret] = apiKey.split('.');
  if (!id || !secret) throw new Error("Invalid Zhipu API Key format");

  const now = Date.now();
  const exp = now + 3600 * 1000; // 1 hour expiration

  const header = { alg: 'HS256', sign_type: 'SIGN' };
  const payload = { api_key: id, exp, timestamp: now };

  const encoder = new TextEncoder();
  
  const base64UrlEncode = (data: Uint8Array): string => {
    return btoa(String.fromCharCode(...data))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  };

  const stringToUrlBase64 = (str: string): string => {
    return base64UrlEncode(encoder.encode(str));
  };

  const encodedHeader = stringToUrlBase64(JSON.stringify(header));
  const encodedPayload = stringToUrlBase64(JSON.stringify(payload));
  const dataToSign = `${encodedHeader}.${encodedPayload}`;

  const keyData = encoder.encode(secret);
  const cryptoKey = await window.crypto.subtle.importKey(
    'raw', 
    keyData, 
    { name: 'HMAC', hash: 'SHA-256' }, 
    false, 
    ['sign']
  );

  const signature = await window.crypto.subtle.sign(
    'HMAC', 
    cryptoKey, 
    encoder.encode(dataToSign)
  );

  const encodedSignature = base64UrlEncode(new Uint8Array(signature));
  return `${dataToSign}.${encodedSignature}`;
}

// --- Main Fetch Function ---

export const fetchBrewingPlan = async (
  teaDescription: string
): Promise<AIBrewingPlan> => {
  
  // 1. Try ZhipuAI (BigModel) first
  const zhipuKey = getApiKey('zhipu');

  if (zhipuKey) {
    try {
      const token = await generateZhipuToken(zhipuKey);
      
      const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          model: 'glm-4-plus',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: teaDescription }
          ],
          temperature: 0.7,
          top_p: 0.95,
          max_tokens: 1024
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Zhipu API Error:", errorData);
        throw new Error(`Zhipu API Error: ${response.status}`);
      }

      const data = await response.json();
      let content = data.choices[0]?.message?.content;

      // Clean markdown code blocks if present
      content = content.replace(/```json\n?|\n?```/g, '').trim();
      
      return JSON.parse(content) as AIBrewingPlan;

    } catch (error) {
      console.error("Failed to fetch from ZhipuAI:", error);
      // Fallback to mock if API fails
      return MOCK_PLAN;
    }
  }

  // 2. Fallback: Check for Google Gemini Key
  const geminiKey = getApiKey('gemini');
  
  if (geminiKey) {
     // Dynamic import to avoid loading Google SDK if not needed
     const { GoogleGenAI } = await import('@google/genai');
     
     const ai = new GoogleGenAI({ apiKey: geminiKey });
     try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: teaDescription,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          responseMimeType: 'application/json',
           // Gemini Schema... (omitted for brevity)
        }
      });
      if (response.text) return JSON.parse(response.text) as AIBrewingPlan;
     } catch (e) { console.error(e); }
  }

  // 3. Final Fallback: Mock Data
  console.warn("No API Keys found (LocalStorage or Env). Using Mock Data.");
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_PLAN), 2000); 
  });
};