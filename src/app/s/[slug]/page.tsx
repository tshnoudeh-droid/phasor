import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import SharedSimViewer from "./SharedSimViewer";
import type { SystemType } from "@/types/simulation";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function SharedSimPage({ params }: Props) {
  const { slug } = await params;

  const { data, error } = await supabase
    .from("simulations")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) notFound();

  return (
    <SharedSimViewer
      systemType={data.system_type as SystemType}
      parameters={data.parameters as Record<string, number>}
      slug={slug}
    />
  );
}
