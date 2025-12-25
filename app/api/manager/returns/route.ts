import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const supabase = supabaseServer();
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json(
        { ok: false, error: "missing_fields" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("returns")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("SUPABASE ERROR:", error);
      return NextResponse.json(
        { ok: false, error: "db_error" },
        { status: 500 }
      );
    }

    // ✅ КРИТИЧНО: возвращаем JSON
    return NextResponse.json({ ok: true });

  } catch (e) {
    console.error("API ERROR:", e);
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500 }
    );
  }
}
