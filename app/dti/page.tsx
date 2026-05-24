"use client"
import React from 'react';
import { Network, LogOutIcon } from 'lucide-react';
import GlobalStyles from '../../components/GlobalStyles';

export default function DtiPage() {
  return (
    <>
      <GlobalStyles />
      <DtiView onLogout={() => { try { localStorage.removeItem('pulih_role'); } catch(e){}; window.location.href = '/login'; }} />
    </>
  );
}

function DtiView({ onLogout }) {
  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-[#faf9f9] min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b-2 border-[#e3e2e2] pb-6 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading text-[#1a1c1c] mb-2 flex items-center gap-3">
            <Network className="w-8 h-8" /> Monitoring Infrastruktur PULIH
          </h1>
          <p className="text-[#6e7881] font-medium font-bold uppercase tracking-wider text-sm">Monitoring Infrastruktur PULIH</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="bg-[#87fe45] px-4 py-3 rounded-xl border-2 border-[#51bd00] border-b-4 flex items-center gap-2 font-bold text-[#082100]">
            Sistem Aktif
          </div>
          <button onClick={onLogout} className="btn-outline py-3 px-4 shrink-0 border-[#dadada] text-[#3e4850]"><LogOutIcon className="w-5 h-5"/></button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card-tactile bg-[#1a1c1c] border-[#3e4850] text-white">
          <div className="flex items-center gap-3 mb-4">
            <div>
              <p className="text-5xl font-heading text-[#87fe45]">99.9<span className="text-2xl">%</span></p>
            </div>
          </div>
        </div>

        <div className="card-tactile">
          <div className="flex items-center gap-3 mb-4">
            <p className="text-5xl font-heading text-[#1a1c1c]">0.12<span className="text-2xl text-[#6e7881]">%</span></p>
          </div>
        </div>

        <div className="card-tactile">
          <div className="flex items-center gap-3 mb-6">
            <p className="text-sm font-bold text-[#3e4850]">Status Lainnya</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card-tactile">
          <h3 className="font-heading text-2xl text-[#1a1c1c] mb-6 flex items-center gap-2"><Network className="w-6 h-6"/> Integrasi SIAM</h3>
          <p className="text-sm text-[#3e4850]">Ringkasan integrasi dan status layanan.</p>
        </div>

        <div className="card-tactile bg-[#1a1c1c] border-[#3e4850] text-[#bdc8d2] flex flex-col h-full">
          <h3 className="font-heading text-2xl text-white mb-6 border-b-2 border-[#3e4850] pb-4">Security Logs</h3>
          <p className="text-sm">Log aktivitas dan kejadian keamanan.</p>
        </div>
      </div>
    </div>
  );
}
