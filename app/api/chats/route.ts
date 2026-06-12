import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  let query = supabase.from('chats').select(`
    id,
    sender_id,
    receiver_id,
    text,
    created_at,
    profiles!chats_sender_id_fkey(name, role)
  `).order('created_at', { ascending: true });

  if (userId) {
    query = query.or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const formattedData = data.map((c: any) => ({
    id: c.id,
    senderId: c.sender_id,
    receiverId: c.receiver_id,
    text: c.text,
    timestamp: c.created_at,
    senderName: c.profiles?.name || 'User',
    senderRole: c.profiles?.role || 'mahasiswa'
  }));

  return NextResponse.json(formattedData);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { data, error } = await supabase.from('chats').insert({
      sender_id: body.senderId,
      receiver_id: body.receiverId,
      text: body.text
    }).select().single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
