import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get('role');

  let query = supabase.from('profiles').select('*');

  if (role) {
    query = query.eq('role', role);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const { userId, mood } = await request.json();
    if (!userId || !mood) {
      return NextResponse.json({ error: "userId and mood required" }, { status: 400 });
    }

    // Fetch profil saat ini untuk mendapatkan risk_score sebelumnya
    const { data: profileData, error: fetchError } = await supabase
      .from('profiles')
      .select('risk_score')
      .eq('user_id', userId)
      .single();

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    const currentScore = profileData?.risk_score || 0;
    
    // Tentukan delta (perubahan skor) berdasarkan perasaan
    let delta = 0;
    switch (mood) {
      case "very_bad": delta = 20; break;     // Sangat buruk -> tambah 20
      case "bad": delta = 10; break;          // Buruk -> tambah 10
      case "neutral": delta = 0; break;       // Biasa -> tidak ada perubahan
      case "good": delta = -10; break;        // Baik -> kurang 10
      case "very_good": delta = -20; break;   // Sangat baik -> kurang 20
    }

    // Hitung skor baru, pastikan tetap dalam rentang 0 - 100
    const newScore = Math.max(Math.min(currentScore + delta));

    // Update database
    const { data, error } = await supabase
      .from('profiles')
      .update({ risk_score: newScore, current_mood: mood })
      .eq('user_id', userId)
      .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
