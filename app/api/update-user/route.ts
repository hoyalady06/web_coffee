import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const { id, name, phone, gender, birthday } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Missing user id" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("users")
      .update({
        name,
        phone,
        gender,
        birthday,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.log("SUPABASE ERROR:", error);
      return NextResponse.json(
        { error: "db error" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, user: data });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "server crash" },
      { status: 500 }
    );
  }
}
