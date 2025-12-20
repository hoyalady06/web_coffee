import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  const { id, status } = await req.json();

  const { error } = await supabase
    .from("returns")
    .update({ status })
    .eq("id", id);

  if (error) return NextResponse.json({ ok: false, error });

  return NextResponse.json({ ok: true });
}
