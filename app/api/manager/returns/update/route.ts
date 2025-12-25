import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function POST(req: Request) {
  const supabase = supabaseServer();
  const { id, status, admin_comment } = await req.json();

  if (!id || !status) {
    return NextResponse.json({ ok: false, error: 'missing_data' });
  }

  const { error } = await supabase
    .from('returns')
    .update({
      status,
      admin_comment,
    })
    .eq('id', id);

  if (error) {
    return NextResponse.json({ ok: false, error });
  }

  return NextResponse.json({ ok: true });
}
