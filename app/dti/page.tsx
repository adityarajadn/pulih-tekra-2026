"use client"
import React from 'react';
import { useRouter } from "next/navigation";
import { Network, LogOutIcon, Server, Activity, AlertTriangle, Database, Lock, ClipboardCheck } from 'lucide-react';
import GlobalStyles from '../../components/GlobalStyles';

export default function DtiPage() {
  return (
    <>
      <GlobalStyles />
      <DtiView />
    </>
  );
}

function DtiView() {
  const router = useRouter();
  return (
    <div className="flex w-full min-h-screen flex-col md:flex-row bg-[#faf9f9]">
      <div className="hidden md:flex flex-col w-[280px] bg-[#f4f3f3] border-r-2 border-[#e3e2e2] p-6 h-screen sticky top-0 shrink-0" style={{ '--primary': '#87fe45', '--primary-text': '#082100', '--primary-dark': '#51bd00' } as React.CSSProperties}>
        
        <div className="bg-[#1a1c1c] rounded-2xl p-5 mb-6 text-white border-2 border-[#3e4850] border-b-4 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="w-12 h-12 bg-[#87fe45] rounded-full flex items-center justify-center font-bold text-lg text-[#082100] border-2 border-[#51bd00]">DT</div>
            <div>
              <p className="font-bold text-[#ffffff] font-heading leading-tight text-lg">Tim DTI</p>
              <p className="text-sm text-[#87fe45] font-medium">Administrator</p>
            </div>
          </div>
        </div>

        <nav className="flex flex-col gap-3 flex-1">
          <button className="nav-item active">
            <Server className="w-5 h-5" /> Dashboard DTI
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t-2 border-[#e3e2e2]">
          <button onClick={() => router.push('/login')} className="btn-outline w-full py-3 border-[#dadada] text-[#3e4850] hover:bg-[#e9e8e8]">
            <LogOutIcon className="w-5 h-5" /> KEMBALI
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 md:p-8 overflow-y-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b-2 border-[#e3e2e2] pb-6 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading text-[#1a1c1c] mb-2 flex items-center gap-3">
            <Server className="w-8 h-8 text-[#006590]" /> Dashboard DTI
          </h1>
          <p className="text-[#6e7881] font-medium font-bold uppercase tracking-wider text-sm">Monitoring Infrastruktur PULIH</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="bg-[#87fe45] px-4 py-3 rounded-xl border-2 border-[#51bd00] border-b-4 flex items-center gap-2 font-bold text-[#082100]">
            <div className="w-3 h-3 bg-[#2b6c00] rounded-full animate-pulse"></div> Sistem Normal
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card-tactile bg-[#1a1c1c] border-[#3e4850] text-white">
          <div className="flex items-center gap-3 mb-4">
             <Activity className="w-6 h-6 text-[#87fe45]" />
             <p className="text-xs font-bold text-[#bdc8d2] uppercase tracking-widest">Uptime (30 Hari)</p>
          </div>
          <p className="text-5xl font-heading text-[#87fe45]">99.9<span className="text-2xl">%</span></p>
        </div>
        
        <div className="card-tactile">
          <div className="flex items-center gap-3 mb-4">
             <AlertTriangle className="w-6 h-6 text-[#fec700]" />
             <p className="text-xs font-bold text-[#6e7881] uppercase tracking-widest">Error Rate API</p>
          </div>
          <p className="text-5xl font-heading text-[#1a1c1c]">0.12<span className="text-2xl text-[#6e7881]">%</span></p>
        </div>

        <div className="card-tactile">
          <div className="flex items-center gap-3 mb-6">
             <Database className="w-6 h-6 text-[#1cb0f6]" />
             <p className="text-xs font-bold text-[#6e7881] uppercase tracking-widest">Beban Server</p>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm font-bold mb-1"><span>CPU</span><span>42%</span></div>
              <div className="progress-track h-3"><div className="progress-fill-blue" style={{width:'42%'}}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold mb-1"><span>RAM</span><span>68%</span></div>
              <div className="progress-track h-3"><div className="bg-[#fec700] border-r-2 border-[#755b00] rounded-full h-full" style={{width:'68%'}}></div></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card-tactile">
          <h3 className="font-heading text-2xl text-[#1a1c1c] mb-6 flex items-center gap-2"><Network className="w-6 h-6"/> Integrasi SIAM</h3>
          <div className="space-y-4">
            <div className="card-tactile-sm bg-[#faf9f9] flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Lock className="w-6 h-6 text-[#006590]" />
                <div>
                  <p className="font-bold text-lg text-[#1a1c1c]">SIAM API Gateway</p>
                  <p className="text-sm font-medium text-[#6e7881]">Token validasi API</p>
                </div>
              </div>
              <span className="bg-[#87fe45] text-[#1f5100] border-2 border-[#51bd00] font-bold text-xs px-3 py-1.5 rounded-lg">CONNECTED</span>
            </div>
            <div className="card-tactile-sm bg-[#faf9f9] flex justify-between items-center">
              <div className="flex items-center gap-4">
                <ClipboardCheck className="w-6 h-6 text-[#006590]" />
                <div>
                  <p className="font-bold text-lg text-[#1a1c1c]">Presensi Webhook</p>
                  <p className="text-sm font-medium text-[#6e7881]">Sync data jadwal</p>
                </div>
              </div>
              <span className="bg-[#87fe45] text-[#1f5100] border-2 border-[#51bd00] font-bold text-xs px-3 py-1.5 rounded-lg">SYNCED</span>
            </div>
          </div>
        </div>

        <div className="card-tactile bg-[#1a1c1c] border-[#3e4850] text-[#bdc8d2] flex flex-col h-full">
          <h3 className="font-heading text-2xl text-white mb-6 border-b-2 border-[#3e4850] pb-4">Security Logs</h3>
          <div className="flex-1 overflow-y-auto space-y-3 font-mono text-sm">
            <p><span className="text-[#6e7881]">[14:32:01]</span> <span className="text-[#1cb0f6] font-bold">INFO</span>: Chatbot API check - PASS</p>
            <p><span className="text-[#6e7881]">[14:31:45]</span> <span className="text-[#87fe45] font-bold">SUCCESS</span>: Data sync (ID 10293)</p>
            <p><span className="text-[#6e7881]">[14:30:12]</span> <span className="text-[#fec700] font-bold">WARN</span>: High traffic Auto-scaling triggered.</p>
            <p><span className="text-[#6e7881]">[14:28:55]</span> <span className="text-[#1cb0f6] font-bold">INFO</span>: CRON job completed in 12.4s</p>
            <p><span className="text-[#6e7881]">[14:25:10]</span> <span className="text-[#ffdad6] font-bold">ERROR</span>: Timeout DB (Retry 1/3) - Resolved.</p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
