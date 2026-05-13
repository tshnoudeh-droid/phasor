import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { generateSlug } from "@/lib/slugify";
import { checkRateLimit } from "@/lib/rateLimit";

const SaveRequestSchema = z.object({
  systemType: z.enum(["spring_mass", "pendulum", "projectile", "pid", "rc_circuit"]),
  parameters: z.record(z.string(), z.number().finite()),
  conversation: z
    .array(z.object({ role: z.string(), content: z.string().max(2000) }))
    .max(50)
    .optional(),
  userId: z.string().max(200).optional(),
});

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  if (!checkRateLimit(ip, 10, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = SaveRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { systemType, parameters, conversation, userId } = parsed.data;
  const slug = generateSlug();

  try {
    const { error } = await supabase.from("simulations").insert({
      slug,
      system_type: systemType,
      parameters,
      conversation: conversation ?? [],
      user_id: userId ?? null,
    });

    if (error) {
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }

    return NextResponse.json({ slug });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
