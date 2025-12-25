import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  const { id, status } = await req.json();
  const supabase = supabaseServer();

  const { error } = await supabase
    .from("returns")
    .update({ status })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ ok: false, error }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
