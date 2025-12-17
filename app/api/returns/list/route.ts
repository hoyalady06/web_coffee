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
      orders!inner (
        user_id
      ),
      order_items (
        qty,
        price,
        products (
          name,
          image
        )
      )
    `)
    .eq("orders.user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error });
  }

  // 🔄 формат под frontend
  const formatted = data.map((r: any) => ({
    id: r.id,
    status: r.status,
    reason: r.reason,
    created_at: r.created_at,
    items: r.order_items.map((i: any) => ({
      qty: i.qty,
      price: i.price,
      product_name: i.products.name,
      image: i.products.image,
    })),
  }));

  return NextResponse.json({
    ok: true,
    returns: formatted,
  });
}
