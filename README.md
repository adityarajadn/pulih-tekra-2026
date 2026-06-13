# PULIH - Sistem Kesejahteraan Mahasiswa

ACCESS NOW!!
https://pulih-tekra-2026-zn12.vercel.app/login

Aplikasi manajemen kesejahteraan dan kesehatan mental mahasiswa berbasis web menggunakan Next.js (App Router), Tailwind CSS, dan Supabase. Sistem ini dilengkapi dengan sistem deteksi dini (Early Warning System), triase pasien untuk konselor, dan Chatbot AI terintegrasi.

## Anggota Kelompok / Author

- **Aditya Rajadana Hernadi**
- **Mohammad Rahardian Atsil Qushoyyi**
- **Ayu Amirah K.A.**

## Fitur Utama

Aplikasi ini dibagi menjadi 4 Dashboard utama berdasarkan hak akses:

1. **Dashboard Mahasiswa**
   - Check-in Perasaan/Mood harian.
   - Presensi Kehadiran Kuliah.
   - **Chat TEMAN (AI):** Chatbot asisten virtual untuk dukungan kesehatan mental pertama menggunakan model AI.
   - Manajemen & Booking Jadwal Konseling.

2. **Dashboard Konselor**
   - Sistem Triase Pasien (mengurutkan mahasiswa berdasarkan tingkat risiko kesejahteraan: Merah, Kuning, Hijau).
   - Manajemen Jadwal (Menyetujui/menggeser jadwal konseling dari mahasiswa).
   - Sistem Notifikasi Peringatan Dini.

3. **Dashboard Pimpinan (Admin)**
   - **Heatmap Risiko Fakultas:** Memantau skor kesejahteraan rata-rata per fakultas secara _real-time_.
   - **Early Warning System (EWS):** Notifikasi otomatis jika ada fakultas dengan indikator stres atau kelelahan (burnout) yang tinggi.
   - Fitur Ekspor Laporan menjadi PDF satu halaman.

4. **Dashboard Tim DTI (IT)**
   - Monitoring Status Sistem (Uptime, API Latency).
   - Log Aktivitas & Keamanan Database.

## Cara Menjalankan

1. Clone repository ini ke komputer Anda:

   ```bash
   git clone https://github.com/adityarajadn/pulih-tekra-2026.git
   cd pulih-tekra-2026
   ```

2. Install dependency:

   ```bash
   npm install
   ```

3. Buat file `.env.local` di _root folder_ dan isi dengan konfigurasi Supabase & AI API Key:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://<your-supabase-id>.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<your-supabase-anon-key>
   OPENROUTER_API_KEY=<your-openrouter-api-key>
   ```

4. Jalankan _development server_:

   ```bash
   npm run dev
   ```

5. Buka [http://localhost:3000](http://localhost:3000) di browser. Gunakan halaman `/login` untuk masuk ke masing-masing dashboard.

## Folder Structure

```text
pulih-tekra-2026/
├── app/
│   ├── admin/       # Dashboard Pimpinan
│   ├── api/         # Endpoint API (Supabase & Chatbot AI)
│   ├── dti/         # Dashboard Tim IT
│   ├── konselor/    # Dashboard Psikolog/Konselor
│   ├── login/       # Halaman Autentikasi
│   ├── mahasiswa/   # Dashboard Mahasiswa
│   ├── layout.tsx   # Root Layout
│   └── page.tsx     # Landing/Redirect Page
├── components/      # Komponen Reusable (Modal, Chart, Styles)
└── lib/             # Konfigurasi Supabase Client
```

## API Documentation

- `GET /api/profiles`: Mengambil daftar profil pengguna beserta risk score dan mood.
- `POST /api/profiles`: Memperbarui skor dan mood mahasiswa saat melakukan check-in.
- `GET /api/bookings`: Mengambil daftar booking konseling.
- `PUT /api/bookings`: Memperbarui status booking (confirm, reschedule, reject).
- `POST /api/chatbot-teman`: Mengirim pesan ke AI OpenRouter (Gemini-2.5-Flash) dan menerima balasan.

## Teknologi (Tech Stack)

- **Frontend:** Next.js 15 (React 19), Tailwind CSS, Lucide React (Icons)
- **Backend/Database:** Supabase (PostgreSQL), Next.js API Routes
- **AI Integration:** OpenRouter API (Google Gemini Flash)

## License

MIT License
