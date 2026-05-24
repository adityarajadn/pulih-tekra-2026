import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, FileEdit, PlusCircle, FileText, ExternalLink, Send, Calendar, MessageSquare, User } from 'lucide-react';

export function StudentDetailPanelTactile({ student, getStatusStyle, onOpenAction }: any) {
  const [profileTab, setProfileTab] = useState('overview');

  useEffect(() => { setProfileTab('overview'); }, [student.id]);

  return (
    <div className="card-tactile p-0 overflow-hidden flex flex-col bg-white h-full animate-in slide-in-from-right-4">
      <div className="p-6 border-b-2 border-[#e3e2e2] bg-[#faf9f9]">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-heading text-[#1a1c1c] mb-1 flex items-center gap-2"><User className="w-7 h-7 text-[#006590]" /> Profil Kondisi Mahasiswa</h2>
            <p className="text-sm font-bold text-[#6e7881] uppercase tracking-wide">{student.name} • {student.nim} • {student.fakultas}</p>
          </div>
          <div className={`px-4 py-2 rounded-2xl border-2 border-b-4 text-center ${getStatusStyle(student.status)}`}>
            <div className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-80">Risk Score</div>
            <div className="text-3xl font-heading leading-none">{student.score}</div>
          </div>
        </div>
      </div>

      <div className="flex border-b-2 border-[#e3e2e2] px-4 pt-4 bg-[#f4f3f3] overflow-x-auto">
        <button onClick={() => setProfileTab('overview')} className={`py-3 px-4 font-bold text-sm uppercase tracking-wide border-b-4 transition-colors ${profileTab === 'overview' ? 'border-[#2b6c00] text-[#2b6c00]' : 'border-transparent text-[#6e7881] hover:text-[#3e4850]'} flex items-center gap-2`}>
          Dashboard Triase
        </button>
        <button onClick={() => setProfileTab('rekam')} className={`py-3 px-4 font-bold text-sm uppercase tracking-wide border-b-4 transition-colors ${profileTab === 'rekam' ? 'border-[#2b6c00] text-[#2b6c00]' : 'border-transparent text-[#6e7881] hover:text-[#3e4850]'} flex items-center gap-2`}>
          Profil Kondisi Mahasiswa
        </button>
        <button onClick={() => setProfileTab('rujukan')} className={`py-3 px-4 font-bold text-sm uppercase tracking-wide border-b-4 transition-colors ${profileTab === 'rujukan' ? 'border-[#2b6c00] text-[#2b6c00]' : 'border-transparent text-[#6e7881] hover:text-[#3e4850]'} flex items-center gap-2`}>
          Manajemen Jadwal
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
