import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  const { data, error } = await supabase
    .from("orders")
    .select("items, created_at")
    .eq("user_id", userId)
    .eq("status", "delivered")   // ❗ только доставленные
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ ok: false, error });

  return NextResponse.json({ ok: true, orders: data });
}
