import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ ok: false, error: "missing_id" });
  }

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
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ ok: false, error }, { status: 500 });
  }

  return NextResponse.json({ ok: true, return: data });
}
