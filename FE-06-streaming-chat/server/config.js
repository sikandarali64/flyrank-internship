// ============================================================
// AI config: yahan se provider, model aur system prompt badlo.
// Baqi code ko touch karne ki zaroorat nahi.
// ============================================================

// Provider ka OpenAI-compatible endpoint. Do free options:
//   OpenRouter: https://openrouter.ai/api/v1
//   Gemini:     https://generativelanguage.googleapis.com/v1beta/openai
export const BASE_URL = process.env.AI_BASE_URL || "https://openrouter.ai/api/v1";

// Model ka naam. OpenRouter pe free models ke naam ":free" pe khatam hote hain,
// list yahan: https://openrouter.ai/models?max_price=0
// Gemini ke liye e.g. "gemini-2.0-flash"
export const MODEL = process.env.AI_MODEL || "meta-llama/llama-3.3-70b-instruct:free";

// API key SIRF server pe rehti hai (.env file), frontend ko kabhi nahi milti.
export const API_KEY = process.env.AI_API_KEY;

// AI ki shakhsiyat aur rules.
export const SYSTEM_PROMPT =
  "You are a helpful, concise assistant. Reply in the same language the user writes in. " +
  "Keep answers short unless the user asks for detail.";

// Itne aakhri messages hi model ko bhejo (cost aur speed ke liye).
export const MAX_HISTORY = 20;
