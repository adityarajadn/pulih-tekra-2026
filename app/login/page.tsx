"use client";
import React from "react";
import { useRouter } from "next/navigation";
import GlobalStyles from "../../components/GlobalStyles";
import { User, Shield, Server, Building, LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (rolePath: string) => {
    // You can set localStorage role here if needed in the future
    router.push(rolePath);
  };

  return (
    <div className="min-h-screen bg-[#faf9f9] flex flex-col items-center justify-center p-4">
      <GlobalStyles />

      <div className="w-full max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Mahasiswa Card */}
          <button
            onClick={() => handleLogin("/mahasiswa")}
            className="card-tactile flex flex-col items-center justify-center text-center hover:bg-[#e6f4ff] hover:border-[#1cb0f6] group transition-all"
          >
            <div className="bg-[#1cb0f6] p-4 rounded-2xl border-2 border-[#006590] border-b-4 mb-4 group-hover:-translate-y-1 transition-transform">
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="font-heading text-xl text-[#1a1c1c] mb-1">
              Mahasiswa
            </h2>
            <p className="text-sm font-medium text-[#6e7881]">
              Akses Dashboard Akademik & Presensi
            </p>
          </button>

          {/* Konselor Card */}
          <button
            onClick={() => handleLogin("/konselor")}
            className="card-tactile flex flex-col items-center justify-center text-center hover:bg-[#ebf8e5] hover:border-[#51bd00] group transition-all"
          >
            <div className="bg-[#87fe45] p-4 rounded-2xl border-2 border-[#2b6c00] border-b-4 mb-4 group-hover:-translate-y-1 transition-transform">
              <Shield className="w-8 h-8 text-[#082100]" />
            </div>
            <h2 className="font-heading text-xl text-[#1a1c1c] mb-1">
              Konselor
            </h2>
            <p className="text-sm font-medium text-[#6e7881]">
              Manajemen Triase & Jadwal Konseling
            </p>
          </button>

          {/* Admin / Pimpinan Card */}
          <button
            onClick={() => handleLogin("/admin")}
            className="card-tactile flex flex-col items-center justify-center text-center hover:bg-[#fff9e6] hover:border-[#fec700] group transition-all"
          >
            <div className="bg-[#fec700] p-4 rounded-2xl border-2 border-[#755b00] border-b-4 mb-4 group-hover:-translate-y-1 transition-transform">
              <Building className="w-8 h-8 text-[#6e5400]" />
            </div>
            <h2 className="font-heading text-xl text-[#1a1c1c] mb-1">
              Pimpinan
            </h2>
            <p className="text-sm font-medium text-[#6e7881]">
              Akses Dashboard KPI & Laporan
            </p>
          </button>

          {/* DTI Card */}
          <button
            onClick={() => handleLogin("/dti")}
            className="card-tactile flex flex-col items-center justify-center text-center hover:bg-[#f4f3f3] hover:border-[#6e7881] group transition-all"
          >
            <div className="bg-[#1a1c1c] p-4 rounded-2xl border-2 border-[#3e4850] border-b-4 mb-4 group-hover:-translate-y-1 transition-transform">
              <Server className="w-8 h-8 text-[#bdc8d2]" />
            </div>
            <h2 className="font-heading text-xl text-[#1a1c1c] mb-1">DTI</h2>
            <p className="text-sm font-medium text-[#6e7881]">
              Monitoring Infrastruktur & Sistem
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
