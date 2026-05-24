"use client"
import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  LogOutIcon,
  AlertTriangle,
  Users,
  CheckCircle2,
  MessageSquare,
  Clock,
  Calendar,
  FileEdit,
  PlusCircle,
  FileText,
  ExternalLink,
  Send,
  X
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

    .card-tactile { background-color: var(--surface-color); border: 2px solid var(--border-light); border-bottom: 4px solid var(--border-dark); border-radius: 1.5rem; padding: 1.5rem; }
    .card-tactile-sm { background-color: var(--surface-color); border: 2px solid var(--border-light); border-bottom: 3px solid var(--border-dark); border-radius: 1rem; padding: 1rem; }
    .btn-primary { background-color: var(--primary); color: var(--primary-text); border: 2px solid var(--primary-dark); border-bottom: 4px solid var(--primary-dark); border-radius: 1rem; font-weight: 700; text-transform: uppercase; font-family: 'Be Vietnam Pro', sans-serif; letter-spacing: 0.05em; transition: all 0.1s ease; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; }
    .btn-outline { background-color: transparent; color: var(--primary-dark); border: 2px solid var(--primary-dark); border-bottom: 4px solid var(--primary-dark); border-radius: 1rem; font-weight: 700; text-transform: uppercase; font-family: 'Be Vietnam Pro', sans-serif; letter-spacing: 0.05em; transition: all 0.1s ease; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; }
    .nav-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.875rem 1rem; border-radius: 1rem; font-weight: 700; transition: all 0.1s ease; border: 2px solid transparent; border-bottom-width: 4px; width: 100%; text-align: left; }
    .input-tactile { border: 2px solid var(--border-light); border-bottom: 4px solid var(--border-dark); border-radius: 1rem; transition: all 0.1s ease; font-family: inherit; }
    .input-tactile:focus { outline: none; border-color: var(--primary); border-bottom-color: var(--primary-dark); }
  `}} />
);

export default function KonselorPage() {
  return (
    <>
      <GlobalStyles />
      <KonselorView onLogout={() => { try { localStorage.removeItem('pulih_role'); } catch(e){}; window.location.href = '/login'; }} />
    </>
  );
}

function KonselorView({ onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [activeAction, setActiveAction] = useState(null);

  const getStatusStyle = (status) => {
    switch(status) {
      case 'merah': return 'bg-[#ffdad6] text-[#93000a] border-[#ba1a1a]';
      case 'kuning': return 'bg-[#ffdf92] text-[#594400] border-[#755b00]';
      case 'hijau': return 'bg-[#c8e6ff] text-[#004c6e] border-[#006590]';
      default: return 'bg-[#e3e2e2] text-[#3e4850] border-[#6e7881]';
    }
  };

  return (
    <div className="flex w-full min-h-screen flex-col md:flex-row bg-[#faf9f9]">
      <div className="hidden md:flex flex-col w-[280px] bg-[#f4f3f3] border-r-2 border-[#e3e2e2] p-6 h-screen sticky top-0 shrink-0">
        <div className="flex items-center gap-2 mb-8">
          <span className="font-heading text-2xl text-[#2b6c00]">PULIH</span>
          <span className="text-xs font-bold text-[#6e7881] uppercase tracking-wide">Portal Konselor</span>
        </div>

        <div className="bg-[#2b6c00] rounded-2xl p-5 mb-6 text-white border-2 border-[#194500] border-b-4 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="w-12 h-12 bg-[#87fe45] rounded-full flex items-center justify-center font-bold text-lg text-[#082100] border-2 border-[#1f5100]">PU</div>
            <div>
              <p className="font-bold text-[#ffffff] font-heading leading-tight text-lg">Psikolog Univ</p>
              <p className="text-sm text-[#6be026] font-medium">SIPK: 10293847</p>
            </div>
          </div>
        </div>

        <nav className="flex flex-col gap-3 flex-1">
          <button onClick={() => setActiveTab('dashboard')} className={`nav-item ${activeTab === 'dashboard' ? 'bg-[#51bd00] text-[#194500] border-[#2b6c00]' : ''}`}>
            <LayoutDashboard className="w-5 h-5" /> Dashboard Triase
          </button>
          <button onClick={() => setActiveTab('kalender')} className={`nav-item ${activeTab === 'kalender' ? 'bg-[#51bd00] text-[#194500] border-[#2b6c00]' : ''}`}>
            <CalendarDays className="w-5 h-5" /> Kalender Jadwal
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t-2 border-[#e3e2e2]">
          <button onClick={onLogout} className="btn-outline w-full py-3 border-[#dadada] text-[#3e4850] hover:bg-[#e9e8e8]">
            <LogOutIcon className="w-5 h-5" /> KELUAR
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 md:p-8 overflow-y-auto w-full">
        {activeTab === 'dashboard' && (
          <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in duration-300">
            <div className="w-full lg:w-[40%] flex flex-col gap-4">
              <div className="card-tactile bg-[#f4f3f3] border-[#e3e2e2]">
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle className="w-6 h-6 text-[#2b6c00]" />
                  <h2 className="text-2xl font-heading text-[#1a1c1c]">Daftar Triase</h2>
                </div>
                <p className="text-sm text-[#6e7881] font-bold uppercase tracking-wide mb-6">Diurutkan berdasar Risk Score</p>
                
                <div className="space-y-4">
                  {dummyTriageData.map((student) => (
                    <div 
                      key={student.id} 
                      onClick={() => setSelectedStudent(student)}
                      className={`card-tactile-sm flex flex-col sm:flex-row justify-between sm:items-center gap-3 cursor-pointer transition-all hover:bg-white ${selectedStudent?.id === student.id ? 'border-[#51bd00] bg-white' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl border-2 border-b-4 flex items-center justify-center text-2xl ${getStatusStyle(student.status)}`}>
                          {student.mood}
                        </div>
                        <div>
                          <h3 className="font-heading text-lg text-[#1a1c1c] leading-tight">{student.name}</h3>
                          <p className="text-xs font-bold text-[#6e7881] uppercase mt-1">{student.fakultas}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs font-bold px-2 py-1 rounded-md border-2 ${getStatusStyle(student.status)}`}>
                          Skor: {student.score}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full lg:w-[60%]">
              {selectedStudent ? (
                <StudentDetailPanelTactile 
                  student={selectedStudent} 
                  getStatusStyle={getStatusStyle} 
                  onOpenAction={setActiveAction} 
                />
              ) : (
                <div className="card-tactile h-full min-h-[500px] flex flex-col items-center justify-center text-[#6e7881] text-center bg-[#f4f3f3] border-dashed">
                  <Users className="w-16 h-16 mb-4 text-[#dadada]" />
                  <p className="font-heading text-xl text-[#3e4850] mb-2">Pilih mahasiswa</p>
                  <p className="font-medium max-w-sm">Informasi detail, riwayat mood, rekam jejak, dan opsi rujukan akan muncul di sini.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'kalender' && (
          <div className="card-tactile min-h-[600px] animate-in fade-in duration-300">
            <h2 className="text-3xl font-heading text-[#1a1c1c] mb-6 flex items-center gap-3">
              <CalendarDays className="w-8 h-8 text-[#2b6c00]" /> Jadwal Konseling Aktif
            </h2>
            <div className="space-y-8">
              <div>
                <h3 className="font-heading text-xl text-[#1a1c1c] mb-4">Hari Ini</h3>
                <div className="space-y-4">
                  <div className="card-tactile-sm bg-[#87fe45] border-[#51bd00] border-b-4 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div>
                        <p className="font-heading text-xl text-[#082100]">Budi Santoso</p>
                        <p className="text-sm font-bold text-[#1f5100] mt-1 uppercase">Sesi Pertama • Online (G-Meet)</p>
                      </div>
                      <span className="bg-[#ffdad6] text-[#93000a] text-xs px-3 py-1 rounded-full border-2 border-[#ba1a1a] font-bold uppercase tracking-wider">Risiko Tinggi</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border-2 border-[#51bd00] w-max font-bold text-[#1f5100]">
                      <Clock className="w-4 h-4"/> 10:00 - 11:00
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-heading text-xl text-[#1a1c1c] mb-4">Besok</h3>
                <div className="space-y-4">
                  <div className="card-tactile-sm bg-[#f4f3f3]">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-heading text-xl text-[#1a1c1c]">Siti Rahma</p>
                        <p className="text-sm font-bold text-[#6e7881] mt-1 uppercase">Sesi Lanjutan • Ruang Konseling B</p>
                      </div>
                      <span className="bg-[#ffdf92] text-[#594400] text-xs px-3 py-1 rounded-full border-2 border-[#755b00] font-bold uppercase tracking-wider">Risiko Sedang</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border-2 border-[#e3e2e2] border-b-4 border-b-[#dadada] w-max font-bold text-[#3e4850]">
                      <Clock className="w-4 h-4"/> 13:00 - 14:00
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {activeAction && selectedStudent && (
        <ActionModal action={activeAction} student={selectedStudent} onClose={() => setActiveAction(null)} />
      )}
    </div>
  );
}

function StudentDetailPanelTactile({ student, getStatusStyle, onOpenAction }) {
  const [profileTab, setProfileTab] = useState('overview');

  useEffect(() => { setProfileTab('overview'); }, [student.id]);

  return (
    <div className="card-tactile p-0 overflow-hidden flex flex-col bg-white h-full animate-in slide-in-from-right-4">
      <div className="p-6 border-b-2 border-[#e3e2e2] bg-[#faf9f9]">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-heading text-[#1a1c1c] mb-1">{student.name}</h2>
            <p className="text-sm font-bold text-[#6e7881] uppercase tracking-wide">{student.nim} • {student.fakultas}</p>
          </div>
          <div className={`px-4 py-2 rounded-2xl border-2 border-b-4 text-center ${getStatusStyle(student.status)}`}>
            <div className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-80">Risk Score</div>
            <div className="text-3xl font-heading leading-none">{student.score}</div>
          </div>
        </div>
      </div>

      <div className="flex border-b-2 border-[#e3e2e2] px-4 pt-4 bg-[#f4f3f3] overflow-x-auto">
        <button onClick={() => setProfileTab('overview')} className={`py-3 px-4 font-bold text-sm uppercase tracking-wide border-b-4 transition-colors ${profileTab === 'overview' ? 'border-[#2b6c00] text-[#2b6c00]' : 'border-transparent text-[#6e7881] hover:text-[#3e4850]'} flex items-center gap-2`}>
          Triase
        </button>
        <button onClick={() => setProfileTab('rekam')} className={`py-3 px-4 font-bold text-sm uppercase tracking-wide border-b-4 transition-colors ${profileTab === 'rekam' ? 'border-[#2b6c00] text-[#2b6c00]' : 'border-transparent text-[#6e7881] hover:text-[#3e4850]'} flex items-center gap-2`}>
          Rekam Medis
        </button>
        <button onClick={() => setProfileTab('rujukan')} className={`py-3 px-4 font-bold text-sm uppercase tracking-wide border-b-4 transition-colors ${profileTab === 'rujukan' ? 'border-[#2b6c00] text-[#2b6c00]' : 'border-transparent text-[#6e7881] hover:text-[#3e4850]'} flex items-center gap-2`}>
          Rujukan
        </button>
      </div>

      <div className="p-6 flex-1 bg-white">
        {profileTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="card-tactile-sm bg-[#faf9f9]">
                <h4 className="text-[10px] font-bold text-[#6e7881] uppercase tracking-widest mb-2">Sinyal Utama</h4>
                <p className="font-heading text-lg text-[#1a1c1c]">{student.issue}</p>
                <div className="mt-3 inline-block bg-white px-3 py-1.5 rounded-xl border-2 border-[#e3e2e2] text-sm font-bold flex items-center gap-2">
                  <span className="text-xl leading-none">{student.mood}</span> Check-in Terakhir
                </div>
              </div>
              <div className="card-tactile-sm bg-[#faf9f9]">
                <h4 className="text-[10px] font-bold text-[#6e7881] uppercase tracking-widest mb-2">Safety Net</h4>
                {student.lastAbsence === 'Hari ini' ? (
                  <p className="font-heading text-lg text-[#2b6c00] flex items-center gap-2"><CheckCircle2 className="w-5 h-5"/> Aman (Aktif)</p>
                ) : (
                  <p className="font-heading text-lg text-[#ba1a1a] flex items-center gap-2"><AlertTriangle className="w-5 h-5"/> Tidak absen &gt;3 hari</p>
                )}
              </div>
            </div>
            
            <div className="flex gap-4 pt-6 border-t-2 border-[#e3e2e2]">
              <button onClick={() => onOpenAction('jadwal')} className="btn-primary flex-1 bg-[#51bd00] text-[#ffffff] border-[#2b6c00] py-3">
                <Calendar className="w-5 h-5" /> Booking Sesi
              </button>
              <button onClick={() => onOpenAction('pesan')} className="btn-outline flex-1 py-3 border-[#dadada] text-[#3e4850] hover:bg-[#f4f3f3]">
                <MessageSquare className="w-5 h-5" /> Chat
              </button>
            </div>
          </div>
        )}

        {profileTab === 'rekam' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="card-tactile-sm bg-[#e6f4ff] border-[#88ceff]">
              <h3 className="font-heading text-xl text-[#004c6e] mb-4 flex items-center gap-2"><FileEdit className="w-6 h-6" /> Tambah Rekam Sesi Terstruktur</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div>
                     <label className="block text-xs font-bold text-[#006590] uppercase tracking-wider mb-1">Tanggal Sesi</label>
                     <input type="date" className="input-tactile w-full px-4 py-3 bg-white text-sm font-bold text-[#3e4850]" defaultValue="2026-05-24" />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-[#006590] uppercase tracking-wider mb-1">Status Kehadiran</label>
                     <select className="input-tactile w-full px-4 py-3 bg-white text-sm font-bold text-[#3e4850]">
                       <option>Hadir</option>
                       <option>Tidak Hadir</option>
                       <option>Reschedule</option>
                     </select>
                   </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#006590] uppercase tracking-wider mb-1">Hasil Sesi & Observasi Klinis</label>
                  <textarea rows="2" className="input-tactile w-full px-4 py-3 bg-white text-sm" placeholder="Catat keluhan utama dan hasil observasi..."></textarea>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-[#006590] uppercase tracking-wider mb-1">Perkembangan Mahasiswa</label>
                  <textarea rows="2" className="input-tactile w-full px-4 py-3 bg-white text-sm" placeholder="Catat kemajuan atau perubahan dari sesi sebelumnya..."></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#006590] uppercase tracking-wider mb-1">Catatan Tindak Lanjut (Follow-up)</label>
                  <textarea rows="2" className="input-tactile w-full px-4 py-3 bg-white text-sm" placeholder="Rencana intervensi, tugas mandiri, atau rujukan..."></textarea>
                </div>

                <div className="flex justify-end pt-2">
                  <button className="btn-primary py-3 px-6 text-sm bg-[#1cb0f6] text-[#00405d] border-[#006590]"><PlusCircle className="w-5 h-5"/> Simpan Rekam Sesi</button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-heading text-xl text-[#1a1c1c] mb-4 flex items-center gap-2"><FileText className="w-6 h-6 text-[#2b6c00]"/> Riwayat Rekam Jejak</h3>
              <div className="space-y-4">
                <div className="card-tactile-sm bg-[#faf9f9]">
                  <div className="flex justify-between items-center border-b-2 border-[#e3e2e2] pb-3 mb-3">
                    <p className="text-sm font-bold text-[#1a1c1c] uppercase tracking-wider">Sesi #2 • 12 Mei 2026</p>
                    <span className="bg-[#87fe45] text-[#1f5100] border-2 border-[#51bd00] font-bold text-[10px] px-2 py-1 rounded-md uppercase">Hadir (Online)</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] font-bold text-[#6e7881] uppercase tracking-widest mb-1">Hasil Sesi</p>
                      <p className="text-sm font-medium text-[#3e4850] bg-white p-3 rounded-xl border-2 border-[#e3e2e2]">Mahasiswa mengeluhkan kelelahan ekstrem (burnout) karena beban tugas skripsi. Pola tidur tidak teratur (kurang dari 4 jam sehari).</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#6e7881] uppercase tracking-widest mb-1">Perkembangan</p>
                      <p className="text-sm font-medium text-[#3e4850] bg-white p-3 rounded-xl border-2 border-[#e3e2e2]">Kecemasan sedikit menurun dibandingkan sesi pertama. Mulai terbuka tentang masalah tekanan dari ekspektasi keluarga.</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#6e7881] uppercase tracking-widest mb-1">Tindak Lanjut</p>
                      <p className="text-sm font-medium text-[#3e4850] bg-white p-3 rounded-xl border-2 border-[#e3e2e2]">Diberikan psikoedukasi tentang sleep hygiene dan teknik relaksasi (Box Breathing). Dijadwalkan sesi follow-up 2 minggu lagi.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {profileTab === 'rujukan' && (
          <div className="space-y-6 animate-in fade-in">
             <div className="card-tactile-sm bg-[#c8e6ff] border-[#88ceff]">
              <h3 className="font-heading text-[#004c6e] mb-2 flex items-center gap-2"><ExternalLink className="w-5 h-5"/> Buat Surat Rujukan</h3>
              <p className="text-sm text-[#006590] font-medium mb-4">Rujuk ke psikiater atau unit lain dengan dokumentasi otomatis.</p>
              
              <div className="space-y-4">
                <select className="input-tactile w-full px-4 py-3 bg-white text-sm font-bold text-[#3e4850]">
                  <option>Klinik Psikiatri RSUB</option>
                  <option>ULTKSP (Kekerasan/Perundungan)</option>
                  <option>Biro Akademik</option>
                </select>
                <textarea rows="3" className="input-tactile w-full px-4 py-3 bg-white text-sm" placeholder="Alasan klinis rujukan..."></textarea>
                <button className="btn-primary py-3 w-full"><Send className="w-4 h-4"/> Kirim Rujukan Otomatis</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ActionModal({ action, student, onClose }) {
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => onClose(), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="card-tactile max-w-md w-full animate-in zoom-in-95 duration-200">
        {isSuccess ? (
          <div className="text-center py-8">
            <div className="bg-[#87fe45] text-[#082100] w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 border-4 border-[#51bd00]">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-3xl font-heading text-[#1a1c1c] mb-2">Sukses!</h3>
            <p className="text-[#3e4850] font-medium">{action === 'jadwal' ? 'Jadwal berhasil dibooking.' : 'Pesan berhasil dikirim.'}</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-heading text-[#1a1c1c]">
                {action === 'jadwal' ? 'Booking Jadwal' : 'Kirim Pesan'}
              </h3>
              <button onClick={onClose} className="p-2 bg-[#f4f3f3] rounded-xl border-2 border-[#e3e2e2]"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-[#f4f3f3] p-4 rounded-xl border-2 border-[#e3e2e2] mb-4">
                <p className="text-[10px] font-bold text-[#6e7881] uppercase tracking-widest mb-1">Penerima</p>
                <p className="font-heading text-[#1a1c1c]">{student.name}</p>
              </div>
              {action === 'jadwal' ? (
                <>
                  <input type="date" required className="input-tactile w-full px-4 py-3" />
                  <input type="time" required className="input-tactile w-full px-4 py-3" />
                  <select className="input-tactile w-full px-4 py-3 font-bold text-[#3e4850]">
                    <option>Online (G-Meet)</option>
                    <option>Offline (Klinik)</option>
                  </select>
                </>
              ) : (
                <textarea rows="4" required placeholder="Tulis pesan..." className="input-tactile w-full px-4 py-3 resize-none"></textarea>
              )}
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={onClose} className="btn-outline flex-1 py-3 border-[#dadada] text-[#6e7881]">Batal</button>
                <button type="submit" className="btn-primary flex-1 py-3 bg-[#1cb0f6]">Kirim</button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
