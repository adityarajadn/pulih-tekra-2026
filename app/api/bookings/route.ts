import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const counselorId = searchParams.get('counselorId');
  const mahasiswaId = searchParams.get('mahasiswaId');

  let query = supabase.from('bookings').select(`
    id,
    slot,
    status,
    created_at,
    mahasiswa_id,
    counselor_id,
    profiles!bookings_mahasiswa_id_fkey(name)
  `);

  if (counselorId) query = query.eq('counselor_id', counselorId);
  if (mahasiswaId) query = query.eq('mahasiswa_id', mahasiswaId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const formattedData = data.map((b: any) => ({
    id: b.id,
    slot: b.slot,
    status: b.status,
    createdAt: b.created_at,
    mahasiswaId: b.mahasiswa_id,
    counselorId: b.counselor_id,
    mahasiswaName: b.profiles?.name || 'Mahasiswa'
  }));

  return NextResponse.json(formattedData);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const DAILY_LIMIT = 5; // Batas mahasiswa per hari
    let targetDate = body.date || new Date().toISOString().split('T')[0];
    const targetTime = body.slot; // e.g., "09:00"
    
    // Fetch existing active bookings for this counselor
    const { data: existingBookings, error: fetchError } = await supabase
      .from('bookings')
      .select('slot, status')
      .eq('counselor_id', body.counselorId)
      .neq('status', 'rejected');

    if (fetchError) throw fetchError;

    // Filter by date
    let bookingsOnTargetDate = existingBookings.filter((b: any) => b.slot.startsWith(targetDate));
    let isShifted = false;

    // If full, shift to nearest available date
    if (bookingsOnTargetDate.length >= DAILY_LIMIT) {
      let daysToAdd = 1;
      while (true) {
        const nextDateObj = new Date(targetDate);
        nextDateObj.setDate(nextDateObj.getDate() + daysToAdd);
        const nextDateString = nextDateObj.toISOString().split('T')[0];
        
        const bookingsOnNextDate = existingBookings.filter((b: any) => b.slot.startsWith(nextDateString));
        if (bookingsOnNextDate.length < DAILY_LIMIT) {
          targetDate = nextDateString;
          isShifted = true;
          break;
        }
        daysToAdd++;
        if (daysToAdd > 30) throw new Error("Jadwal konselor penuh untuk 30 hari ke depan.");
      }
    }

    const finalSlot = `${targetDate} ${targetTime}`;

    const { data, error } = await supabase.from('bookings').insert({
      mahasiswa_id: body.mahasiswaId || 'mhs-1',
      counselor_id: body.counselorId,
      slot: finalSlot,
      status: body.status || 'pending'
    }).select().single();

    if (error) throw error;

    let notifMessageMahasiswa = "";
    if (body.createdBy === 'konselor') {
      notifMessageMahasiswa = `Konselor telah menjadwalkan sesi konseling untuk Anda pada tanggal ${targetDate} pukul ${targetTime}.`;
    } else {
      notifMessageMahasiswa = isShifted 
        ? `Jadwal penuh! Booking Anda otomatis digeser ke tanggal terdekat yang kosong: ${targetDate} pukul ${targetTime}.`
        : `Booking berhasil dikirim untuk tanggal ${targetDate} pukul ${targetTime}. Menunggu konfirmasi.`;
    }

    if (notifMessageMahasiswa && body.createdBy !== 'konselor') {
        // We still want to notify the mahasiswa about the status of their request, especially if it was shifted.
        // Wait, the original code didn't notify mahasiswa if body.createdBy !== 'konselor'. 
        // We should notify them if it was shifted.
        if (isShifted) {
            await supabase.from('notifications').insert({
              user_id: body.mahasiswaId || 'mhs-1',
              message: notifMessageMahasiswa,
              read: false
            });
        }
    } else if (body.createdBy === 'konselor') {
        await supabase.from('notifications').insert({
          user_id: body.mahasiswaId,
          message: notifMessageMahasiswa,
          read: false
        });
    }

    if (body.createdBy !== 'konselor') {
      await supabase.from('notifications').insert({
        user_id: body.counselorId,
        message: `Mahasiswa ${body.mahasiswaName || 'baru'} telah mengajukan permintaan booking sesi pada ${finalSlot}.`,
        read: false
      });
    }

    return NextResponse.json({ ...data, isShifted, newSlot: finalSlot });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    const updateData: any = { status: body.status };
    if (body.newSlot) {
      updateData.slot = body.newSlot;
    }
    
    const { data: booking, error: updateError } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', body.id)
      .select()
      .single();

    if (updateError || !booking) throw updateError || new Error("Not found");

    let message = "";
    if (body.status === 'confirmed') {
      if (body.newSlot) {
        message = `Booking konseling telah DIKONFIRMASI dengan perubahan jadwal ke: ${booking.slot}.`;
      } else {
        message = `Booking konseling pada pukul ${booking.slot} telah DIKONFIRMASI.`;
      }
    } else if (body.status === 'rejected') {
      message = `Booking konseling pada pukul ${booking.slot} DITOLAK. Silakan pilih slot lain.`;
    }

    if (message) {
      const { error: notifError } = await supabase.from('notifications').insert({
        user_id: booking.mahasiswa_id,
        message,
        read: false
      });
      if (notifError) throw notifError;
    }

    return NextResponse.json({
        id: booking.id,
        slot: booking.slot,
        status: booking.status,
        mahasiswaId: booking.mahasiswa_id,
        counselorId: booking.counselor_id
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
