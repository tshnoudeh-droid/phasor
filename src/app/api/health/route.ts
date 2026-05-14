import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function GET() {
  const groqKey = process.env.GROQ_API_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  // Test real Groq connection
  let groqStatus = "not tested";
  if (groqKey) {
    try {
      const client = new Groq({ apiKey: groqKey });
      const res = await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: "Reply with the word OK only." }],
        max_tokens: 5,
      });
      groqStatus = `ok — model replied: "${res.choices[0]?.message?.content?.trim()}"`;
    } catch (err) {
      groqStatus = `ERROR: ${err instanceof Error ? err.message : String(err)}`;
    }
  } else {
    groqStatus = "MISSING KEY";
  }

  return NextResponse.json({
    groqKey: groqKey ? `set (${groqKey.slice(0, 8)}...)` : "MISSING",
    groqConnection: groqStatus,
    supabase: supabaseUrl ? `set (${supabaseUrl.slice(0, 30)}...)` : "MISSING",
    clerk: clerkKey ? `set (${clerkKey.slice(0, 8)}...)` : "MISSING",
  });
}
