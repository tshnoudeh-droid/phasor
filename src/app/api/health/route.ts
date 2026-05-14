import { NextResponse } from "next/server";

export async function GET() {
  const groqKey = process.env.GROQ_API_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  return NextResponse.json({
    groq: groqKey ? `set (${groqKey.slice(0, 8)}...)` : "MISSING",
    supabase: supabaseUrl ? `set (${supabaseUrl.slice(0, 30)}...)` : "MISSING",
    clerk: clerkKey ? `set (${clerkKey.slice(0, 8)}...)` : "MISSING",
  });
}
