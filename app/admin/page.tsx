"use client"
import React from 'react';
import GlobalStyles from '../../components/GlobalStyles';
import { Building, LogOutIcon, Users, AlertTriangle, TrendingUp } from 'lucide-react';

// --- DATA ---
const facultiesData = [
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
      <AdminView onLogout={() => { try { localStorage.removeItem('pulih_role'); } catch(e){}; window.location.href = '/login'; }} />
    </>
  );
}

function AdminView({ onLogout }) {
  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-[#faf9f9] min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b-2 border-[#e3e2e2] pb-6 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading text-[#1a1c1c] mb-2 flex items-center gap-3">
            <Building className="w-8 h-8 text-[#006590]" /> Dashboard Pimpinan
          </h1>
          <p className="text-[#6e7881] font-medium font-bold uppercase tracking-wider text-sm">Data Agregat Kesejahteraan Universitas</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="btn-primary py-3 px-6 shrink-0 text-sm">Unduh PDF</button>
          <button onClick={onLogout} className="btn-outline py-3 px-4 shrink-0 border-[#dadada] text-[#3e4850]"><LogOutIcon className="w-5 h-5"/></button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card-tactile border-b-[5px]">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-[#1cb0f6] p-3 rounded-2xl border-2 border-[#006590] border-b-4"><Users className="w-6 h-6 text-white" /></div>
            <p className="text-sm font-bold text-[#6e7881] uppercase tracking-wide">Partisipasi Check-in</p>
          </div>
          <p className="text-4xl font-heading text-[#1a1c1c]">12,450</p>
          <p className="text-sm font-bold text-[#2b6c00] mt-2 bg-[#87fe45] inline-block px-2 py-1 rounded-md border border-[#51bd00]">+5% bulan ini</p>
        </div>
        
        <div className="card-tactile border-b-[5px] border-[#ba1a1a]">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-[#ffdad6] p-3 rounded-2xl border-2 border-[#ba1a1a] border-b-4"><AlertTriangle className="w-6 h-6 text-[#93000a]" /></div>
            <p className="text-sm font-bold text-[#6e7881] uppercase tracking-wide">Early Warning Alerts</p>
          </div>
          <p className="text-4xl font-heading text-[#1a1c1c]">3 <span className="text-lg text-[#6e7881]">Fakultas</span></p>
          <p className="text-sm font-bold text-[#93000a] mt-2">Butuh Perhatian</p>
        </div>

        <div className="card-tactile border-b-[5px]">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-[#fec700] p-3 rounded-2xl border-2 border-[#755b00] border-b-4"><TrendingUp className="w-6 h-6 text-[#6e5400]" /></div>
            <p className="text-sm font-bold text-[#6e7881] uppercase tracking-wide">Skor Wellbeing</p>
          </div>
          <p className="text-4xl font-heading text-[#1a1c1c]">68<span className="text-xl text-[#6e7881]">/100</span></p>
          <p className="text-sm font-bold text-[#6e5400] mt-2">Kondisi Stabil</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card-tactile">
          <h3 className="font-heading text-2xl text-[#1a1c1c] mb-6 border-b-2 border-[#e3e2e2] pb-4">Heatmap Risiko Fakultas</h3>
          <div className="space-y-5">
            {facultiesData.map((fac, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-16 font-bold text-[#3e4850] uppercase">{fac.name}</div>
                <div className="flex-1 progress-track h-4">
                  <div className={`h-full border-r-2 ${fac.score > 60 ? 'bg-[#ffdad6] border-[#ba1a1a]' : fac.score > 45 ? 'bg-[#ffdf92] border-[#755b00]' : 'bg-[#87fe45] border-[#2b6c00]'}`} style={{ width: `${fac.score}%` }}></div>
                </div>
                <div className="w-12 text-right font-heading text-lg">{fac.score}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-tactile">
          <h3 className="font-heading text-2xl text-[#1a1c1c] mb-6 border-b-2 border-[#e3e2e2] pb-4">Early Warning System</h3>
          <div className="space-y-4">
            <div className="card-tactile-sm bg-[#ffdad6] border-[#ba1a1a] border-b-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-heading text-lg text-[#93000a]">Lonjakan Stres - FILKOM</h4>
                <span className="bg-white text-[#93000a] text-xs font-bold px-2 py-1 rounded-md border-2 border-[#ba1a1a]">HARI INI</span>
              </div>
              <p className="text-sm font-medium text-[#93000a] leading-relaxed">Kenaikan 35% pada indikator mood "Buruk" dalam 3 hari terakhir. Disarankan intervensi preventif fakultas.</p>
            </div>
            
            <div className="card-tactile-sm bg-[#ffdf92] border-[#755b00] border-b-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-heading text-lg text-[#6e5400]">Tren Kelelahan - Teknik</h4>
                <span className="bg-white text-[#6e5400] text-xs font-bold px-2 py-1 rounded-md border-2 border-[#755b00]">2 HARI LALU</span>
              </div>
              <p className="text-sm font-medium text-[#6e5400] leading-relaxed">Indikator kelelahan meningkat bertahap pada mhs tahun ke-3 (indikasi mid-term burnout).</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
