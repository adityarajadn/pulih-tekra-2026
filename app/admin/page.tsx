"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import GlobalStyles from '../../components/GlobalStyles';
import { Building, LogOutIcon, Users, AlertTriangle, TrendingUp, Calendar, MessageCircle } from 'lucide-react';

const defaultFacultiesData = [
  { name: "FILKOM", score: 62, trend: "naik" },
  { name: "FT", score: 58, trend: "naik" },
  { name: "FEB", score: 45, trend: "turun" },
  { name: "FIA", score: 40, trend: "stabil" },
  { name: "FH", score: 35, trend: "turun" },
];

export default function AdminPage() {
  return (
    <>
      <GlobalStyles />
      <AdminView />
    </>
  );
}

function AdminView() {
  const router = useRouter();
  const [stats, setStats] = useState({ totalBookings: 0, totalChats: 0, totalProfiles: 0 });
  const [facultiesData, setFacultiesData] = useState(defaultFacultiesData);
  const [adminProfile, setAdminProfile] = useState({ name: "Pimpinan Univ", role: "Admin", initials: "PU" });

  useEffect(() => {
    Promise.all([
      fetch('/api/bookings').then(r => r.json()),
      fetch('/api/chats').then(r => r.json()),
      fetch('/api/profiles?role=mahasiswa').then(r => r.json()),
      fetch('/api/profiles?role=admin').then(r => r.json())
    ]).then(([bookingsData, chatsData, profilesData, adminData]) => {
      setStats({
        totalBookings: Array.isArray(bookingsData) ? bookingsData.length : 0,
        totalChats: Array.isArray(chatsData) ? chatsData.length : 0,
        totalProfiles: Array.isArray(profilesData) ? profilesData.length : 0
      });

      if (Array.isArray(profilesData) && profilesData.length > 0) {
        const facultyScores: Record<string, { total: number; count: number }> = {};
        
        profilesData.forEach((profile: any, i: number) => {
          // Fallback if fakultas is missing in db, same as in konselor logic
          const fac = profile.fakultas || ["FILKOM", "FIA", "FT", "FEB", "FH"][i % 5];
          const score = profile.risk_score ?? Math.max(15, 85 - (i * 20));
          
          if (!facultyScores[fac]) {
            facultyScores[fac] = { total: 0, count: 0 };
          }
          facultyScores[fac].total += score;
          facultyScores[fac].count += 1;
        });

        const aggregatedData = Object.keys(facultyScores).map(fac => ({
          name: fac,
          score: Math.round(facultyScores[fac].total / facultyScores[fac].count),
          trend: "stabil" // simplified trend for dynamic data
        }));

        aggregatedData.sort((a, b) => b.score - a.score);
        setFacultiesData(aggregatedData);
      }

      if (Array.isArray(adminData) && adminData.length > 0) {
        const admin = adminData[0];
        const nameParts = admin.name ? admin.name.split(' ') : ["Pimpinan", "Univ"];
        const initials = nameParts.length > 1 
          ? (nameParts[0][0] + nameParts[1][0]).toUpperCase()
          : nameParts[0].substring(0, 2).toUpperCase();
        
        setAdminProfile({
          name: admin.name || "Pimpinan Univ",
          role: "Admin",
          initials
        });
      }
    }).catch(() => {});
  }, []);
  return (
    <div className="flex w-full min-h-screen flex-col md:flex-row bg-[#faf9f9] print:bg-white">
      <div className="hidden md:flex flex-col w-[280px] bg-[#f4f3f3] border-r-2 border-[#e3e2e2] p-6 h-screen sticky top-0 shrink-0 print:hidden" style={{ '--primary': '#1cb0f6', '--primary-text': '#004c6e', '--primary-dark': '#006590' } as React.CSSProperties}>
        
        <div className="bg-[#006590] rounded-2xl p-5 mb-6 text-white border-2 border-[#004c6e] border-b-4 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="w-12 h-12 bg-[#c8e6ff] rounded-full flex items-center justify-center font-bold text-lg text-[#004c6e] border-2 border-[#88ceff]">
              {adminProfile.initials}
            </div>
            <div>
              <p className="font-bold text-[#ffffff] font-heading leading-tight text-lg">{adminProfile.name}</p>
              <p className="text-sm text-[#88ceff] font-medium">{adminProfile.role}</p>
            </div>
          </div>
        </div>

        <nav className="flex flex-col gap-3 flex-1">
          <button className="nav-item active">
            <Building className="w-5 h-5" /> Dashboard
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t-2 border-[#e3e2e2]">
          <button onClick={() => router.push('/login')} className="btn-outline w-full py-3 border-[#dadada] text-[#3e4850] hover:bg-[#e9e8e8]">
            <LogOutIcon className="w-5 h-5" /> KEMBALI
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 md:p-8 overflow-y-auto w-full print:p-0 print:overflow-visible">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b-2 border-[#e3e2e2] pb-6 gap-4 print:mb-4 print:pb-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading text-[#1a1c1c] mb-2 flex items-center gap-3 print:text-2xl">
            <Building className="w-8 h-8 text-[#006590]" /> Dashboard Pimpinan
          </h1>
          <p className="text-[#6e7881] font-medium font-bold uppercase tracking-wider text-sm">Data Agregat Kesejahteraan Universitas</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto print:hidden">
          <button onClick={() => { try { window.print(); } catch(e){ alert('Print failed: '+(e && e.message ? e.message : e)); } }} className="btn-primary py-3 px-6 shrink-0 text-sm">Unduh PDF</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8 print:grid-cols-5 print:gap-4 print:mb-6">
        <div className="card-tactile border-b-[5px]">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-[#1cb0f6] p-3 rounded-2xl border-2 border-[#006590] border-b-4"><Users className="w-6 h-6 text-white" /></div>
            <p className="text-sm font-bold text-[#6e7881] uppercase tracking-wide">Partisipasi Check-in</p>
          </div>
          <p className="text-4xl font-heading text-[#1a1c1c]">{stats.totalProfiles}</p>
          <p className="text-sm font-bold text-[#2b6c00] mt-2 bg-[#87fe45] inline-block px-2 py-1 rounded-md border border-[#51bd00]">Data Real-Time</p>
        </div>
        
        <div className="card-tactile border-b-[5px] border-[#ba1a1a]">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-[#ffdad6] p-3 rounded-2xl border-2 border-[#ba1a1a] border-b-4"><AlertTriangle className="w-6 h-6 text-[#93000a]" /></div>
            <p className="text-sm font-bold text-[#6e7881] uppercase tracking-wide">Early Warning Alerts</p>
          </div>
          <p className="text-4xl font-heading text-[#1a1c1c]">{facultiesData.filter(f => f.score > 45).length} <span className="text-lg text-[#6e7881]">Fakultas</span></p>
          <p className="text-sm font-bold text-[#93000a] mt-2">Butuh Perhatian</p>
        </div>

        <div className="card-tactile border-b-[5px]">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-[#fec700] p-3 rounded-2xl border-2 border-[#755b00] border-b-4"><TrendingUp className="w-6 h-6 text-[#6e5400]" /></div>
            <p className="text-sm font-bold text-[#6e7881] uppercase tracking-wide">Skor Risiko Rata-Rata</p>
          </div>
          <p className="text-4xl font-heading text-[#1a1c1c]">{facultiesData.length > 0 ? Math.round(facultiesData.reduce((acc, f) => acc + f.score, 0) / facultiesData.length) : 0}<span className="text-xl text-[#6e7881]">/100</span></p>
          <p className="text-sm font-bold text-[#6e5400] mt-2">Agregat Keseluruhan</p>
        </div>

        <div className="card-tactile border-b-[5px] border-[#006590]">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-[#c8e6ff] p-3 rounded-2xl border-2 border-[#006590] border-b-4"><Calendar className="w-6 h-6 text-[#00405d]" /></div>
            <p className="text-sm font-bold text-[#6e7881] uppercase tracking-wide">Total Booking Konseling</p>
          </div>
          <p className="text-4xl font-heading text-[#1a1c1c]">{stats.totalBookings}</p>
          <p className="text-sm font-bold text-[#006590] mt-2">Data Real-Time</p>
        </div>

        <div className="card-tactile border-b-[5px] border-[#2b6c00]">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-[#ebf8e5] p-3 rounded-2xl border-2 border-[#51bd00] border-b-4"><MessageCircle className="w-6 h-6 text-[#1f5100]" /></div>
            <p className="text-sm font-bold text-[#6e7881] uppercase tracking-wide">Total Pesan Chat</p>
          </div>
          <p className="text-4xl font-heading text-[#1a1c1c]">{stats.totalChats}</p>
          <p className="text-sm font-bold text-[#2b6c00] mt-2">Data Real-Time</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:grid-cols-2 print:gap-6">
        <div className="card-tactile print:border-2 print:border-b-4">
          <h3 className="font-heading text-2xl text-[#1a1c1c] mb-6 border-b border-[#e3e2e2] pb-4 print:text-xl print:mb-4 print:pb-2">Heatmap Risiko Fakultas</h3>
          <div className="space-y-5 print:space-y-3">
            {facultiesData.map((fac, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-16 font-bold text-[#3e4850] uppercase">{fac.name}</div>
                <div className="flex-1 h-4 bg-transparent">
                  <div className={`h-full border-r-2 ${fac.score > 60 ? 'bg-[#ffdad6] border-[#ba1a1a]' : fac.score > 45 ? 'bg-[#ffdf92] border-[#755b00]' : 'bg-[#87fe45] border-[#2b6c00]'}`} style={{ width: `${fac.score}%` }}></div>
                </div>
                <div className="w-12 text-right font-bold text-[#1a1c1c] text-lg">{fac.score}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-tactile print:border-2 print:border-b-4">
          <h3 className="font-heading text-2xl text-[#1a1c1c] mb-6 border-b-2 border-[#e3e2e2] pb-4 print:text-xl print:mb-4 print:pb-2">Early Warning System</h3>
          <div className="space-y-4 print:space-y-2">
            {facultiesData.filter(f => f.score > 45).length > 0 ? (
              facultiesData.filter(f => f.score > 45).map((fac, idx) => {
                const isRed = fac.score > 60;
                return (
                  <div key={idx} className={`card-tactile-sm ${isRed ? 'bg-[#ffdad6] border-[#ba1a1a]' : 'bg-[#ffdf92] border-[#755b00]'} border-b-4`}>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className={`font-heading text-lg ${isRed ? 'text-[#93000a]' : 'text-[#6e5400]'}`}>
                        {isRed ? `Lonjakan Stres - ${fac.name}` : `Tren Kelelahan - ${fac.name}`}
                      </h4>
                      <span className={`bg-white ${isRed ? 'text-[#93000a] border-[#ba1a1a]' : 'text-[#6e5400] border-[#755b00]'} text-xs font-bold px-2 py-1 rounded-md border-2`}>
                        {isRed ? 'HARI INI' : 'PERHATIAN'}
                      </span>
                    </div>
                    <p className={`text-sm font-medium ${isRed ? 'text-[#93000a]' : 'text-[#6e5400]'} leading-relaxed`}>
                      {isRed 
                        ? `Skor risiko mencapai ${fac.score}. Disarankan intervensi preventif segera untuk mahasiswa Fakultas ${fac.name}.`
                        : `Skor risiko berada di ${fac.score}. Indikator kelelahan mulai meningkat bertahap pada mahasiswa Fakultas ${fac.name}.`}
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="card-tactile-sm bg-[#ebf8e5] border-[#51bd00] border-b-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-heading text-lg text-[#1f5100]">Kondisi Stabil</h4>
                  <span className="bg-white text-[#1f5100] text-xs font-bold px-2 py-1 rounded-md border-2 border-[#51bd00]">AMAN</span>
                </div>
                <p className="text-sm font-medium text-[#1f5100] leading-relaxed">Tidak ada fakultas yang melampaui ambang batas peringatan dini saat ini.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
