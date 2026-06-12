import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

// CRON JOB / Scheduler endpoint untuk mengevaluasi trigger secara berkala (misal: setiap tengah malam)
export async function GET(request: Request) {
  try {
    // Ambil data semua mahasiswa (profil)
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const today = new Date();
    const updates = [];

    for (const profile of profiles || []) {
      let newStatus = profile.status || 'hijau';
      let triggerReason = '';

      // 1. Trigger Berbasis Ketidakhadiran (5 hari berturut-turut tidak check-in)
      if (profile.last_checkin) {
        const lastCheckinDate = new Date(profile.last_checkin);
        const diffTime = Math.abs(today.getTime() - lastCheckinDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

        if (diffDays >= 5) {
          // Sinyal pasif kuat, memerlukan perhatian
          if (newStatus !== 'merah') {
            newStatus = 'kuning'; // Atau eskalasi yang sesuai
            triggerReason = 'Ketidakhadiran 5 hari berturut-turut';
          }
        }
      }

      // 2. Trigger Berbasis Lonjakan Mendadak (>30 poin dalam 3 hari)
      // Asumsi ada tabel atau array score_history: [{ date: '...', score: 50 }, ...]
      // Ini adalah simulasi logika jika field history tersedia:
      if (profile.score_history && Array.isArray(profile.score_history)) {
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

        const recentScores = profile.score_history.filter((h: any) => new Date(h.date) >= threeDaysAgo);
        
        if (recentScores.length > 0) {
          const minScore = Math.min(...recentScores.map((h: any) => h.score));
          const currentScore = profile.risk_score || 0;
          
          if (currentScore - minScore > 30) {
            // Lonjakan > 30 poin, indikasi deteriorasi cepat
            newStatus = 'merah';
            triggerReason = 'Lonjakan risk score > 30 poin dalam 3 hari';
          }
        }
      }

      // Simpan update jika ada eskalasi
      if (triggerReason !== '') {
        updates.push(
          supabase
            .from('profiles')
            .update({ 
              status: newStatus,
              // opsional: simpan log trigger ke tabel notifikasi/log
            })
            .eq('id', profile.id)
        );
      }
    }

    // Jalankan semua update
    await Promise.all(updates);

    return NextResponse.json({ 
      success: true, 
      message: 'Evaluasi trigger berhasil dijalankan',
      escalated_count: updates.length 
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
