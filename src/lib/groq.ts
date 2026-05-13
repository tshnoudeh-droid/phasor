import Groq from "groq-sdk";

// Server-side only — never import in client components
let _client: Groq | null = null;

export function getGroqClient(): Groq {
  if (!_client) {
    const key = process.env.GROQ_API_KEY;
    if (!key) throw new Error("GROQ_API_KEY not set");
    _client = new Groq({ apiKey: key });
  }
  return _client;
}

export const GROQ_MODEL = "llama-3.3-70b-versatile";
