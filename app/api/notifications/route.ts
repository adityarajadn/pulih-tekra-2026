import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  let query = supabase.from('notifications').select('*').order('created_at', { ascending: false });

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const formattedData = data.map((n: any) => ({
    id: n.id,
    userId: n.user_id,
    message: n.message,
    read: n.read,
    createdAt: n.created_at
  }));

  return NextResponse.json(formattedData);
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', body.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
