import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  const { order_id, new_status } = await req.json();

  const supabase = supabaseServer();

  await supabase
    .from("orders")
    .update({ status: new_status })
    .eq("id", order_id);

  return NextResponse.json({ ok: true });
}
