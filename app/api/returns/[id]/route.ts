import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const returnId = params.id;

  const { data, error } = await supabase
    .from("returns")
    .select(`
      id,
      order_id,
      order_item_id,
      qty,
      reason,
      status,
      created_at,
      order_item:order_items (
        product_name,
        image
      )
    `)
    .eq("id", returnId)
    .single();

  if (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error });
  }

  return NextResponse.json({
    ok: true,
    return: data,
  });
}
//Goooo