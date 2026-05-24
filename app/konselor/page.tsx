"use client"
import React, { useState, useEffect } from 'react';
import GlobalStyles from '../../components/GlobalStyles';
import { StudentDetailPanelTactile } from '../../components/StudentDetailPanelTactile';
import { ActionModal } from '../../components/ActionModal';
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

// GlobalStyles moved to components/GlobalStyles.tsx

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
            <CalendarDays className="w-5 h-5" /> Manajemen Jadwal
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
                  <h2 className="text-2xl font-heading text-[#1a1c1c]">Dashboard Triase</h2>
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
                  <p className="font-heading text-xl text-[#3e4850] mb-2">Profil Kondisi Mahasiswa</p>
                  <p className="font-medium max-w-sm">Informasi detail, riwayat mood, rekam jejak, dan opsi rujukan akan muncul di sini.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'kalender' && (
          <div className="card-tactile min-h-[600px] animate-in fade-in duration-300">
            <h2 className="text-3xl font-heading text-[#1a1c1c] mb-6 flex items-center gap-3">
              <CalendarDays className="w-8 h-8 text-[#2b6c00]" /> Manajemen Jadwal
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

// StudentDetailPanelTactile moved to components/StudentDetailPanelTactile.tsx

// ActionModal moved to components/ActionModal.tsx
