"use client"
import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity,
  BookOpen,
  Bot,
  ClipboardCheck,
  CloudLightning,
  CloudRain,
  CloudSun,
  LayoutDashboard,
  Calendar,
  CalendarDays,
  Sun,
  HelpCircle,
  LogOutIcon,
  CheckCircle2,
  Clock,
  AlertTriangle
} from 'lucide-react';

// --- DATA DUMMY ---
const dummyTriageData = [
  { id: 1, name: "Budi Santoso", nim: "205150201111001", fakultas: "FILKOM", score: 85, status: "merah", mood: "⛈️", lastAbsence: "Hari ini", issue: "Potensi krisis" },
  { id: 2, name: "Siti Rahma", nim: "205150201111002", fakultas: "FIA", score: 65, status: "kuning", mood: "🌧️", lastAbsence: "Kemarin", issue: "Stres akademik berulang" },
  { id: 3, name: "Agus Pratama", nim: "205150201111003", fakultas: "FT", score: 45, status: "kuning", mood: "⛅", lastAbsence: "Hari ini", issue: "Kelelahan" },
  { id: 4, name: "Dina Nabila", nim: "205150201111004", fakultas: "FEB", score: 15, status: "hijau", mood: "☀️", lastAbsence: "Hari ini", issue: "Stabil" },
];

const facultiesData = [
  { name: "FILKOM", score: 62, trend: "naik" },
  { name: "FT", score: 58, trend: "naik" },
  { name: "FEB", score: 45, trend: "turun" },
  { name: "FIA", score: 40, trend: "stabil" },
  { name: "FH", score: 35, trend: "turun" },
];

// --- GLOBAL TACTILE DESIGN SYSTEM CSS ---
const GlobalStyles = () => (
  <style dangerouslySetInnerHTML={{__html: `
    @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;700&family=Plus+Jakarta+Sans:wght@700;800&display=swap');

    :root {
      --bg-color: #faf9f9;
      --surface-color: #ffffff;
      
      --primary: #1cb0f6;
      --primary-dark: #006590;
      --primary-text: #00405d;
      
      --secondary: #fec700;
      --secondary-dark: #755b00;
      --secondary-text: #6e5400;
      
      --border-light: #e3e2e2;
      --border-dark: #dadada;
      --text-main: #1a1c1c;
      --text-muted: #6e7881;
    }

    body {
      font-family: 'Be Vietnam Pro', sans-serif;
      background-color: var(--bg-color);
      color: var(--text-main);
    }

    h1, h2, h3, h4, h5, h6, .font-heading {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 800;
      letter-spacing: -0.02em;
    }

    /* Tactile Cards */
    .card-tactile {
      background-color: var(--surface-color);
      border: 2px solid var(--border-light);
      border-bottom: 4px solid var(--border-dark);
      border-radius: 1.5rem;
      padding: 1.5rem;
    }

    .card-tactile-sm {
      background-color: var(--surface-color);
      border: 2px solid var(--border-light);
      border-bottom: 3px solid var(--border-dark);
      border-radius: 1rem;
      padding: 1rem;
    }

    /* Tactile Buttons */
    .btn-primary {
      background-color: var(--primary);
      color: var(--primary-text);
      border: 2px solid var(--primary-dark);
      border-bottom: 4px solid var(--primary-dark);
      border-radius: 1rem;
      font-weight: 700;
      text-transform: uppercase;
      font-family: 'Be Vietnam Pro', sans-serif;
      letter-spacing: 0.05em;
      transition: all 0.1s ease;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    .btn-primary:active:not(:disabled) {
      transform: translateY(2px);
      border-bottom-width: 2px;
    }
    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
      border-bottom-width: 4px;
    }

    .btn-outline {
      background-color: transparent;
      color: var(--primary-dark);
      border: 2px solid var(--primary-dark);
      border-bottom: 4px solid var(--primary-dark);
      border-radius: 1rem;
      font-weight: 700;
      text-transform: uppercase;
      font-family: 'Be Vietnam Pro', sans-serif;
      letter-spacing: 0.05em;
      transition: all 0.1s ease;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    /* Side Nav Button */
    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem 1rem;
      border-radius: 1rem;
      font-weight: 700;
      transition: all 0.1s ease;
      border: 2px solid transparent;
      border-bottom-width: 4px;
      width: 100%;
      text-align: left;
    }
    .nav-item.active {
      background-color: var(--primary);
      color: var(--primary-text);
      border-color: var(--primary-dark);
    }
    .nav-item:not(.active) {
      background-color: var(--surface-color);
      color: var(--text-main);
      border-color: var(--border-light);
      border-bottom-color: var(--border-dark);
    }
    .nav-item:not(.active):active {
      transform: translateY(2px);
      border-bottom-width: 2px;
    }

    /* Custom Input */
    .input-tactile {
      border: 2px solid var(--border-light);
      border-bottom: 4px solid var(--border-dark);
      border-radius: 1rem;
      transition: all 0.1s ease;
      font-family: inherit;
    }
    .input-tactile:focus {
      outline: none;
      border-color: var(--primary);
      border-bottom-color: var(--primary-dark);
    }
  `}} />
);


export default function MahasiswaPage() {
  return (
    <>
      <GlobalStyles />
      <MahasiswaView onLogout={() => { try { localStorage.removeItem('pulih_role'); } catch(e){}; window.location.href = '/login'; }} />
    </>
  );
}

function MahasiswaView({ onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const [presensiStep, setPresensiStep] = useState('list'); 

  const handleMoodSelect = (moodId) => {
    setSelectedMood(moodId);
    setHasCheckedInToday(true);
    if (activeTab === 'presensi' && presensiStep === 'mood_modal') {
      setTimeout(() => setPresensiStep('response'), 600);
    }
  };

  const handlePresensi = () => {
    if (!hasCheckedInToday) {
      setPresensiStep('mood_modal');
    } else {
      setPresensiStep('response');
    }
  };

  const moodOptions = [
    { id: 'very_bad', label: 'Sangat Buruk', icon: <CloudLightning className="w-10 h-10 mb-2 text-[#ba1a1a]" strokeWidth={2.5}/> },
    { id: 'bad', label: 'Buruk', icon: <CloudRain className="w-10 h-10 mb-2 text-[#006590]" strokeWidth={2.5}/> },
    { id: 'neutral', label: 'Biasa', icon: <CloudSun className="w-10 h-10 mb-2 text-[#755b00]" strokeWidth={2.5}/> },
    { id: 'good', label: 'Baik', icon: <Sun className="w-10 h-10 mb-2 text-[#2b6c00]" strokeWidth={2.5}/> },
  ];

  return (
    <div className="flex w-full min-h-screen flex-col md:flex-row bg-[#faf9f9]">
      {/* SIDEBAR */}
      <div className="hidden md:flex flex-col w-[280px] bg-[#f4f3f3] border-r-2 border-[#e3e2e2] p-6 h-screen sticky top-0 shrink-0">
        <div className="flex items-center gap-2 mb-8">
          <span className="font-heading text-2xl text-[#006590]">PULIH</span>
          <span className="text-xs font-bold text-[#6e7881] uppercase tracking-wide">Portal Mahasiswa</span>
        </div>

        {/* Profile Card */}
        <div className="bg-[#006590] rounded-2xl p-5 mb-6 text-white border-2 border-[#004c6e] border-b-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-5 rounded-full -mr-8 -mt-8"></div>
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="w-12 h-12 bg-[#fec700] rounded-full flex items-center justify-center font-bold text-lg text-[#6e5400] border-2 border-[#755b00]">DR</div>
            <div>
              <p className="font-bold text-[#ffffff] font-heading leading-tight text-lg">Daffa Rizky</p>
              <p className="text-sm text-[#88ceff]">205150200111xxx</p>
            </div>
          </div>
          <div className="bg-[#00405d] p-2 rounded-xl text-[10px] font-bold flex items-center gap-2 border border-[#001e2e] relative z-10">
            <BookOpen className="w-4 h-4 text-[#88ceff]" /> FAKULTAS ILMU KOMPUTER
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-3 flex-1 overflow-y-auto pr-2">
          <button onClick={() => { setActiveTab('dashboard'); setPresensiStep('list'); }} className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}>
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </button>
          <button onClick={() => { setActiveTab('presensi'); setPresensiStep('list'); }} className={`nav-item ${activeTab === 'presensi' ? 'active' : ''}`}>
            <ClipboardCheck className="w-5 h-5" /> Presensi
          </button>
          <button onClick={() => setActiveTab('jadwal')} className={`nav-item ${activeTab === 'jadwal' ? 'active' : ''}`}>
            <CalendarDays className="w-5 h-5" /> Jadwal Kuliah
          </button>
          <button onClick={() => setActiveTab('chatbot')} className={`nav-item ${activeTab === 'chatbot' ? 'bg-[#ffdf92] text-[#594400] border-[#f4bf00]' : ''}`}>
            <Bot className="w-5 h-5" /> Chat TEMAN
          </button>
        </nav>

        {/* Bantuan Button */}
        <div className="mt-auto pt-6 border-t-2 border-[#e3e2e2]">
          <button onClick={() => setActiveTab('bantuan')} className={`nav-item ${activeTab === 'bantuan' ? 'bg-[#fec700] text-[#6e5400] border-[#755b00]' : ''}`}>
            <HelpCircle className="w-5 h-5" /> Bantuan
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-5xl mx-auto">
        {/* Desktop Header */}
        <div className="hidden md:flex justify-end items-center mb-8 pb-4 border-b-2 border-[#e3e2e2]">
          <div className="text-right mr-4">
            <p className="font-heading font-bold text-lg text-[#1a1c1c]">Daffa Rizky</p>
            <p className="text-sm font-bold text-[#6e7881]">Akses: Mahasiswa</p>
          </div>
          <button onClick={onLogout} className="p-3 bg-[#f4f3f3] border-2 border-[#e3e2e2] border-b-4 rounded-xl text-[#3e4850] hover:bg-[#e9e8e8] active:border-b-2 active:translate-y-[2px] transition-all">
            <LogOutIcon className="w-6 h-6" />
          </button>
        </div>

        {/* --- TAB CONTENT --- */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Welcome Card */}
            <div className="card-tactile flex flex-col md:flex-row items-center gap-6 overflow-hidden relative">
              <div className="flex-1 z-10">
                <h2 className="text-2xl md:text-3xl font-heading mb-3 text-[#1a1c1c]">Selamat Datang di SIAM</h2>
                <p className="text-lg text-[#3e4850] mb-8 max-w-xl">
                  Ringkasan aktivitas akademikmu hari ini. Tetap semangat belajarnya!
                </p>
                <div className="flex flex-wrap gap-4">
                  <button onClick={() => setActiveTab('presensi')} className="btn-primary py-3 px-6">PRESENSI SEKARANG</button>
                  <button onClick={() => setActiveTab('jadwal')} className="btn-outline py-3 px-6">LIHAT JADWAL</button>
                </div>
              </div>
              <div className="shrink-0 w-32 md:w-48 flex justify-center items-center opacity-90 relative z-10">
                <div className="bg-[#fec700] p-6 rounded-3xl border-4 border-[#755b00]">
                  <Bot className="w-16 h-16 md:w-20 md:h-20 text-[#6e5400]" />
                </div>
              </div>
            </div>

            {/* Mood Check-in Widget */}
            {!hasCheckedInToday ? (
              <div className="card-tactile">
                <h3 className="text-xl font-heading flex items-center gap-3 mb-2 text-[#1a1c1c]">
                  <Activity className="w-6 h-6 text-[#006590]" />
                  Bagaimana perasaanmu hari ini?
                </h3>
                <p className="text-[#3e4850] mb-6">Check-in harianmu membantu kami mendukung kesejahteraanmu.</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {moodOptions.map((mood) => (
                    <button
                      key={mood.id}
                      onClick={() => handleMoodSelect(mood.id)}
                      className={`flex flex-col items-center justify-center p-6 bg-white border-2 border-[#e3e2e2] border-b-4 border-b-[#dadada] rounded-2xl transition-all active:border-b-2 active:translate-y-[2px] hover:bg-[#f4f3f3]`}
                    >
                      {mood.icon}
                      <span className="font-bold text-[#3e4850] mt-2">{mood.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <MoodResponseVibrant mood={selectedMood} onOpenChatbot={() => setActiveTab('chatbot')} />
            )}

            {/* Bottom Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card-tactile">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-heading text-[#1a1c1c]">Jadwal Terdekat</h3>
                  <button onClick={() => setActiveTab('jadwal')} className="text-xs font-bold text-[#006590] uppercase tracking-wider hover:underline">Lihat Semua</button>
                </div>
                <div className="space-y-4">
                  <div className="bg-[#f4f3f3] border-2 border-[#e3e2e2] rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:border-[#1cb0f6] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="bg-[#c8e6ff] text-[#004c6e] p-3 rounded-xl text-center min-w-[60px] border border-[#88ceff]">
                        <p className="text-[10px] font-bold uppercase leading-none mb-1">Sen</p>
                        <p className="text-lg font-heading leading-none">08</p>
                      </div>
                      <div>
                        <p className="font-bold text-[#1a1c1c] text-lg">Pemrograman Dasar</p>
                        <p className="text-sm text-[#6e7881]">08:00 - 10:30 • Ruang A2.1</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-tactile bg-[#eeeeed] border-[#dadada] border-b-[#bdc8d2]">
                <h3 className="text-xl font-heading text-[#1a1c1c] mb-6">Progress Akademik</h3>
                <div className="space-y-5">
                  <div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'presensi' && (
          <div className="animate-in fade-in duration-300">
            <h2 className="text-3xl font-heading text-[#1a1c1c] mb-6">Presensi Kelas</h2>
            
            {presensiStep === 'list' && (
              <div className="space-y-4 max-w-3xl">
                <div className="card-tactile bg-[#e6f4ff] border-[#88ceff] flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <span className="bg-[#1cb0f6] text-[#00405d] text-[10px] font-bold px-2 py-1 rounded-lg mb-2 inline-block uppercase border border-[#006590]">Sedang Berlangsung</span>
                    <h3 className="font-heading text-[#00405d] text-xl">Pemrograman Dasar (A)</h3>
                    <p className="text-sm text-[#006590] flex items-center gap-1 mt-1 font-medium"><Clock className="w-4 h-4"/> 08:00 - 10:30 • Ruang A2.1</p>
                  </div>
                  <button onClick={handlePresensi} className="btn-primary py-3 px-6 shrink-0">
                    <CheckCircle2 className="w-5 h-5" /> Hadir
                  </button>
                </div>

                <div className="card-tactile bg-[#f4f3f3] opacity-75 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <span className="bg-[#dadada] text-[#3e4850] text-[10px] font-bold px-2 py-1 rounded-lg mb-2 inline-block uppercase border border-[#6e7881]">Mendatang</span>
                    <h3 className="font-heading text-[#1a1c1c] text-xl">Matematika Komputasi (C)</h3>
                    <p className="text-sm text-[#6e7881] flex items-center gap-1 mt-1 font-medium"><Clock className="w-4 h-4"/> 13:00 - 15:30 • Lab Jaringan</p>
                  </div>
                  <button disabled className="btn-outline py-3 px-6 shrink-0 border-[#dadada] text-[#6e7881]">Belum Mulai</button>
                </div>
              </div>
            )}

            {presensiStep === 'mood_modal' && (
              <div className="card-tactile bg-[#ffdad6] border-[#ba1a1a] max-w-2xl mx-auto text-center py-10 mt-8">
                <div className="bg-[#ba1a1a] w-16 h-16 rounded-2xl mx-auto flex items-center justify-center border-b-4 border-[#93000a] mb-6">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-heading text-[#93000a] mb-2">Tunggu Sebentar!</h3>
                <p className="text-[#ba1a1a] mb-8 font-medium">Kamu belum mengisi check-in perasaanmu hari ini di Dashboard. Silakan pilih di bawah ini untuk melanjutkan:</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-4">
                  {moodOptions.map((mood) => (
                    <button key={mood.id} onClick={() => handleMoodSelect(mood.id)} className="flex flex-col items-center justify-center p-4 bg-white border-2 border-[#e3e2e2] border-b-4 border-b-[#dadada] rounded-2xl active:border-b-2 active:translate-y-[2px]">
                      {mood.icon}
                      <span className="font-bold text-[#3e4850] mt-2 text-sm">{mood.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {presensiStep === 'response' && (
              <div className="max-w-2xl mx-auto space-y-6 mt-8 animate-in slide-in-from-bottom-4">
                <div className="card-tactile bg-[#87fe45] border-[#51bd00] flex items-center gap-6">
                  <div className="bg-[#2b6c00] rounded-2xl p-4 shrink-0 border-b-4 border-[#194500]">
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="font-heading text-2xl text-[#082100] mb-1">Presensi Berhasil!</h3>
                    <p className="text-[#1f5100] font-bold">Pemrograman Dasar (A) - Hadir</p>
                  </div>
                </div>

                <MoodResponseVibrant mood={selectedMood} onOpenChatbot={() => setActiveTab('chatbot')} />

                <div className="text-center mt-6">
                  <button onClick={() => setPresensiStep('list')} className="btn-outline py-3 px-6">Kembali ke Daftar Presensi</button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'jadwal' && (
          <div className="animate-in fade-in duration-300 max-w-3xl">
            <h2 className="text-3xl font-heading text-[#1a1c1c] mb-6">Jadwal Kuliah Mingguan</h2>
            <div className="space-y-6">
              <div className="card-tactile">
                <h3 className="font-heading text-xl text-[#006590] mb-4 flex items-center gap-2"><Calendar className="w-5 h-5"/> Senin</h3>
                <div className="space-y-3">
                  <div className="bg-[#f4f3f3] p-4 rounded-xl border-2 border-[#e3e2e2] flex justify-between items-center">
                    <div>
                      <p className="font-bold text-[#1a1c1c] text-lg">Pemrograman Dasar</p>
                      <p className="text-sm text-[#6e7881] mt-1 font-medium">08:00 - 10:30 • Ruang A2.1</p>
                    </div>
                  </div>
                  <div className="bg-[#f4f3f3] p-4 rounded-xl border-2 border-[#e3e2e2] flex justify-between items-center">
                    <div>
                      <p className="font-bold text-[#1a1c1c] text-lg">Matematika Komputasi</p>
                      <p className="text-sm text-[#6e7881] mt-1 font-medium">13:00 - 15:30 • Lab Jaringan</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-tactile">
                <h3 className="font-heading text-xl text-[#006590] mb-4 flex items-center gap-2"><Calendar className="w-5 h-5"/> Selasa</h3>
                <div className="bg-[#f4f3f3] p-4 rounded-xl border-2 border-[#e3e2e2] flex justify-between items-center">
                  <div>
                    <p className="font-bold text-[#1a1c1c] text-lg">Basis Data</p>
                    <p className="text-sm text-[#6e7881] mt-1 font-medium">09:30 - 12:00 • Ruang B1.2</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chatbot' && (
          <div className="h-[calc(100vh-120px)] max-h-[800px] max-w-3xl mx-auto flex flex-col">
            <ChatbotTEMAN />
          </div>
        )}

        {activeTab === 'bantuan' && (
          <div className="card-tactile max-w-3xl mx-auto text-center py-16 animate-in fade-in duration-300">
            <h3 className="font-heading text-2xl">Bantuan & Kontak</h3>
            <p className="mt-4">Informasi bantuan tersedia di sini.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function MoodResponseVibrant({ mood, onOpenChatbot }) {
  if (mood === 'very_good' || mood === 'good') {
    return (
      <div className="card-tactile bg-[#ffdf92] border-[#f4bf00] flex items-center gap-6 animate-in zoom-in-95 duration-300">
        <div className="text-6xl">{mood === 'very_good' ? '☀️' : '🌤️'}</div>
        <div>
          <h3 className="text-2xl font-heading text-[#594400] mb-2">Senang mendengarnya!</h3>
          <p className="text-[#6e5400] font-medium">Semoga harimu berjalan lancar dan penuh produktivitas.</p>
        </div>
      </div>
    );
  }
  
  if (mood === 'neutral') {
    return (
      <div className="card-tactile bg-[#eeeeed] border-[#dadada] flex items-center gap-6 animate-in zoom-in-95 duration-300">
        <div className="text-6xl drop-shadow-md">⛅</div>
        <div>
          <h3 className="text-2xl font-heading text-[#1a1c1c] mb-2">Ambil jeda sejenak</h3>
          <button className="btn-outline py-2 px-4 text-xs bg-white">Mulai Latihan Napas</button>
        </div>
      </div>
    );
  }

  if (mood === 'bad') {
    return (
      <div className="card-tactile bg-[#c8e6ff] border-[#88ceff] flex flex-col md:flex-row items-center md:items-start gap-6 animate-in zoom-in-95 duration-300">
        <div className="text-6xl mt-2 drop-shadow-md">🌧️</div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-2xl font-heading text-[#004c6e] mb-2">Sedang merasa berat?</h3>
          <p>Jika butuh bicara, buka chatbot TEMAN atau hubungi layanan konseling.</p>
        </div>
      </div>
    );
  }

  if (mood === 'very_bad') {
    return (
      <div className="card-tactile bg-[#ffdad6] border-[#ba1a1a] flex flex-col md:flex-row items-center md:items-start gap-6 animate-in zoom-in-95 duration-300">
        <div className="text-6xl mt-2 drop-shadow-md animate-pulse">⛈️</div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-2xl font-heading text-[#93000a] mb-2">Kamu tidak sendirian.</h3>
          <p>Jika merasa krisis, segera hubungi layanan darurat atau konselor.</p>
        </div>
      </div>
    );
  }

  return null;
}

function ChatbotTEMAN() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Halo Daffa. Aku TEMAN, asisten virtual kesejahteraanmu. Ceritakan saja apa yang sedang membebanimu hari ini, aku di sini untuk mendengarkan.' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const userMsg = { id: Date.now(), sender: 'user', text: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);
    
    // Hard-stop crisis detection
    const isCrisis = ['depresi', 'mati', 'bunuh diri', 'menyerah', 'putus asa'].some(keyword => userMsg.text.toLowerCase().includes(keyword));

    setTimeout(() => {
      setIsTyping(false);
      if (isCrisis) setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', isCrisis: true, text: 'Daffa, aku menangkap bahwa kamu sedang mengalami masa yang sangat berat. Keselamatanmu sangat penting bagi kami. Aku ingin menghubungkanmu dengan konselor profesional.' }]);
      else setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: 'Terima kasih sudah berbagi. Wajar jika kamu merasa seperti itu, kamu sudah berusaha keras. Coba ambil waktu istirahat sejenak hari ini ya.' }]);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-[#ffdf92] text-[#6e5400] p-4 flex items-center gap-3 border-b-4 border-[#f4bf00] shrink-0 rounded-t-[1.3rem]">
        <div className="bg-white p-2 rounded-xl border-2 border-[#f4bf00]">
          <Bot className="w-6 h-6 text-[#755b00]" />
        </div>
        <div>
          <h2 className="font-heading text-lg leading-tight">TEMAN Chatbot</h2>
          <p className="text-xs font-bold uppercase tracking-wide">Asisten Mahasiswa</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#faf9f9]">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-xl ${msg.sender === 'user' ? 'bg-white border-2 border-[#e3e2e2]' : 'bg-white border-2 border-[#f4bf00]'}`}>
              <div className="text-sm">{msg.text}</div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-start">
            <div className="bg-white p-3 rounded-xl border-2 border-[#f4bf00]">...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t-2 border-[#e3e2e2] rounded-b-[1.3rem] shrink-0">
        <form onSubmit={handleSend} className="flex gap-3">
          <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Tulis pesanmu..." className="input-tactile flex-1 px-4 py-3 bg-[#faf9f9]" />
          <button className="btn-primary py-3 px-4">Kirim</button>
        </form>
      </div>
    </div>
  );
}
