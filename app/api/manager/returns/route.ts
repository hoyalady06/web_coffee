import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET() {
  const supabase = supabaseServer();

  const { data, error } = await supabase
    .from("returns")
    .select(`
      *,
      users (
        name,
        phone
      ),
      order_items (
        product_name,
        price,
        image
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("RETURNS ERROR:", error);
    return NextResponse.json({ ok: false, error }, { status: 500 });
  }

  return NextResponse.json({ ok: true, returns: data });
}
