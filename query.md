# Database Schema (Supabase / PostgreSQL)

Berikut adalah *SQL Query* lengkap untuk membangun struktur *database* di Supabase yang sesuai dengan fitur *backend* simulasi kita sebelumnya (Booking, Notifikasi, Chat). 

Query ini mencakup pembuatan tabel (`profiles`, `bookings`, `notifications`, `chats`) beserta relasi antar tabel (Foreign Keys) dan data simulasi awal (Dummy Data) sesuai akun yang ada.

Salin kode di bawah ini dan jalankan di menu **SQL Editor** pada *dashboard* Supabase Anda.

```sql
-- Mengaktifkan ekstensi UUID (Jika belum aktif)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. CREATE TABLES
-- ============================================================================

-- Tabel Profiles (Menyimpan data pengguna: Mahasiswa, Konselor, Admin, DTI)
-- Jika menggunakan Supabase Auth (auth.users), tabel ini bisa dihubungkan via Foreign Key.
-- Namun untuk kasus ini, kita gunakan varchar sebagai referensi custom ID kita.
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(50) UNIQUE NOT NULL, -- ID custom (contoh: 'mhs-1', 'rani')
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('mahasiswa', 'konselor', 'admin', 'dti')),
    fakultas VARCHAR(100),
    jurusan VARCHAR(100),
    risk_score INT DEFAULT 0,
    current_mood VARCHAR(50) DEFAULT 'neutral',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabel Bookings (Sistem Booking Konseling)
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mahasiswa_id VARCHAR(50) NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    counselor_id VARCHAR(50) NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    slot VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabel Notifications (Notifikasi Status Booking dll)
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(50) NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabel Chats (Fitur Pesan Real-Time)
CREATE TABLE public.chats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id VARCHAR(50) NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    receiver_id VARCHAR(50) NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 2. SETUP ROW LEVEL SECURITY (RLS) - Opsional namun disarankan
-- ============================================================================

-- Aktifkan RLS untuk keamanan (Bisa dilewati jika belum butuh security ketat)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;

-- Beri akses public sementara (Untuk mempermudah integrasi tanpa token auth dulu)
-- HAPUS baris ini di tahap produksi!
CREATE POLICY "Enable all access for all" ON public.profiles FOR ALL USING (true);
CREATE POLICY "Enable all access for all" ON public.bookings FOR ALL USING (true);
CREATE POLICY "Enable all access for all" ON public.notifications FOR ALL USING (true);
CREATE POLICY "Enable all access for all" ON public.chats FOR ALL USING (true);


-- ============================================================================
-- 3. INSERT DUMMY DATA (Sesuai dengan UI)
-- ============================================================================

INSERT INTO public.profiles (user_id, name, role, fakultas, jurusan) VALUES
-- Mahasiswa
('mhs-1', 'Aditya Rajadana Hernadi', 'mahasiswa', 'FILKOM', 'Teknik Informatika'),
('mhs-2', 'Budi Santoso', 'mahasiswa', 'FIA', 'Ilmu Administrasi Bisnis'),
('mhs-3', 'Siti Rahma', 'mahasiswa', 'FT', 'Teknik Elektro'),
('mhs-4', 'Ayu Amira', 'mahasiswa', 'FEB', 'Akuntansi'),

-- Konselor
('rani', 'Rani Wulandari, M.Psi.', 'konselor', NULL, NULL),
('dimas', 'Dimas Pratama, S.Psi.', 'konselor', NULL, NULL),
('sinta', 'Sinta Maharani, M.Psi.', 'konselor', NULL, NULL),

-- Pimpinan & DTI
('admin-1', 'Pimpinan Universitas', 'admin', NULL, NULL),
('dti-1', 'Tim DTI', 'dti', NULL, NULL);

-- (Opsional) Insert 1 dummy booking agar langsung muncul di kalender
INSERT INTO public.bookings (mahasiswa_id, counselor_id, slot, status) VALUES 
('mhs-1', 'rani', '10:30', 'pending');

-- (Opsional) Insert dummy chat agar riwayat chat tidak kosong
INSERT INTO public.chats (sender_id, receiver_id, text) VALUES 
('mhs-1', 'rani', 'Halo Ibu Rani, saya ingin berkonsultasi tentang stres perkuliahan.');

```

## Cara Menghubungkan Supabase dengan Next.js:

1. Buat *project* baru di [Supabase](https://supabase.com/).
2. Masuk ke menu **SQL Editor**, buat *New Query*, lalu *paste* dan jalankan (*Run*) seluruh kode SQL di atas.
3. Masuk ke **Settings > API**, lalu *copy* `Project URL` dan `anon/public API Key`.
4. Tambahkan pada `.env.local` proyek ini:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=url_project_anda
   NEXT_PUBLIC_SUPABASE_ANON_KEY=key_anon_anda
   ```
5. Install *client* Supabase via terminal:
   ```bash
   npm install @supabase/supabase-js
   ```
6. Ganti logika *fetch* `/api/bookings` dll yang menggunakan `data.json` dengan pemanggilan fungsi SDK Supabase (`supabase.from('bookings').select('*')`).

---

## Update Schema (Jika tabel sudah terlanjur dibuat sebelumnya)
Jika Anda sudah menjalankan query di atas sebelumnya dan baru menyadari ada penambahan kolom `fakultas` dan `jurusan`, silakan jalankan *script* berikut di SQL Editor:

```sql
ALTER TABLE public.profiles ADD COLUMN fakultas VARCHAR(100);
ALTER TABLE public.profiles ADD COLUMN jurusan VARCHAR(100);
ALTER TABLE public.profiles ADD COLUMN risk_score INT DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN current_mood VARCHAR(50) DEFAULT 'neutral';

-- Update data yang sudah ada (Opsional, agar sesuai dummy)
UPDATE public.profiles SET fakultas = 'FILKOM', jurusan = 'Teknik Informatika', risk_score = 85, current_mood = 'very_bad' WHERE user_id = 'mhs-1';
UPDATE public.profiles SET fakultas = 'FIA', jurusan = 'Ilmu Administrasi Bisnis', risk_score = 65, current_mood = 'bad' WHERE user_id = 'mhs-2';
UPDATE public.profiles SET fakultas = 'FT', jurusan = 'Teknik Elektro', risk_score = 45, current_mood = 'neutral' WHERE user_id = 'mhs-3';
UPDATE public.profiles SET fakultas = 'FEB', jurusan = 'Akuntansi', risk_score = 15, current_mood = 'very_good' WHERE user_id = 'mhs-4';
```
