import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  const body = await req.json();

  const { order_id, order_item_id, user_id, qty, reason } = body;

  if (!order_id || !order_item_id || !user_id || !qty)
    return NextResponse.json({ ok: false, error: "missing_fields" });

  const { data, error } = await supabase
    .from("returns")
    .insert({
      order_id,
      order_item_id,
      user_id,
      qty,
      reason,
      status: "pending",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ ok: false, error });

  return NextResponse.json({ ok: true, return_request: data });
}
