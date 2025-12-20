import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ ok: false, error: "missing_user_id" });
  }

  const { data, error } = await supabase
    .from("returns")
    .select(`
      id,
      qty,
      reason,
      status,
      created_at,
      order_items (
        qty,
        price,
        product_name,
        image
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error });
  }

  const formatted = data.map((r: any) => ({
    id: r.id,
    status: r.status,
    reason: r.reason,
    created_at: r.created_at,
    items: r.order_items
      ? [
          {
            qty: r.order_items.qty,
            price: r.order_items.price,
            product_name: r.order_items.product_name,
            image: r.order_items.image,
          },
        ]
      : [],
  }));

  return NextResponse.json({
    ok: true,
    returns: formatted,
  });
}
