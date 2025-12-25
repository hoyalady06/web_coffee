import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");

  const supabase = supabaseServer();

  let query = supabase
    .from("orders")
    .select(`
      id,
      status,
      total,
      created_at,
      order_items (
        id,
        product_name,
        image
      )
    `)
    .order("created_at", { ascending: false });

  if (date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    query = query
      .gte("created_at", start.toISOString())
      .lte("created_at", end.toISOString());
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true, orders: data || [] });
}
