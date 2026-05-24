"use client"
import React, { useState } from "react";
import { useRouter } from "next/navigation";

function GlobalStyles() {
  return (
    <style dangerouslySetInnerHTML={{ __html: `
      @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;700&family=Plus+Jakarta+Sans:wght@700;800&display=swap');

      :root {
        --bg-color: #faf9f9;
        --surface-color: #ffffff;
        --primary: #1cb0f6;
        --primary-dark: #006590;
        --primary-text: #00405d;
        --border-light: #e3e2e2;
        --border-dark: #dadada;
        --text-main: #1a1c1c;
        --text-muted: #6e7881;
      }

      .card-tactile {
        background-color: var(--surface-color);
        border: 2px solid var(--border-light);
        border-bottom: 4px solid var(--border-dark);
        border-radius: 1.5rem;
        padding: 1.5rem;
      }

      .btn-primary {
        background-color: var(--primary);
        color: var(--primary-text);
        border: 2px solid var(--primary-dark);
        border-bottom: 4px solid var(--primary-dark);
        border-radius: 1rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        transition: all 0.1s ease;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
      }
      .btn-outline {
        background-color: transparent;
        color: var(--primary-dark);
        border: 2px solid var(--primary-dark);
        border-bottom: 4px solid var(--primary-dark);
        border-radius: 1rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        transition: all 0.1s ease;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
      }

      .input-tactile {
        border: 2px solid var(--border-light);
        border-bottom: 4px solid var(--border-dark);
        border-radius: 1rem;
        transition: all 0.1s ease;
        font-family: inherit;
      }
      .input-tactile:focus { outline: none; border-color: var(--primary); border-bottom-color: var(--primary-dark); }

      body { background-color: var(--bg-color); }
    ` }} />
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");

  const submit = (role?: string) => {
    // Demo: store role and redirect to home
    if (role) {
      try { localStorage.setItem('pulih_role', role); } catch (e) {}
      router.push('/');
      return;
    }
    // naive check (accept anything)
    try { localStorage.setItem('pulih_role', 'mahasiswa'); } catch (e) {}
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#f4f3f3' }}>
      <GlobalStyles />

      <div className="card-tactile max-w-md w-full">
        <div className="text-center mb-8">
          <div style={{ backgroundColor: '#1cb0f6', border: '2px solid #006590', borderBottom: '4px solid #006590', padding: 12, borderRadius: 16, display: 'inline-block', marginBottom: 16 }}>
            <span style={{ display: 'inline-block', color: '#00405d', fontWeight: 800 }}>🔒</span>
          </div>
          <h1 className="text-3xl text-[#1a1c1c] mb-2">SSO Universitas</h1>
          <p className="text-[#6e7881] font-medium">Masuk untuk melanjutkan</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-[#3e4850] mb-2 uppercase tracking-wide">NIM / NIP / Email</label>
            <input value={identity} onChange={(e) => setIdentity(e.target.value)} type="text" className="input-tactile w-full px-4 py-3 bg-[#faf9f9]" placeholder="Masukkan identitas..." />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#3e4850] mb-2 uppercase tracking-wide">Kata Sandi</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="input-tactile w-full px-4 py-3 bg-[#faf9f9]" placeholder="••••••••" />
          </div>
          <div className="pt-2">
            <button type="submit" className="btn-primary w-full py-3.5 text-lg">Masuk ke Sistem</button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t-2 border-[#e3e2e2]">
          <p className="text-xs text-center text-[#6e7881] mb-4 uppercase tracking-widest font-bold">Mode Demo Akses Cepat</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button onClick={() => submit('mahasiswa')} className="btn-outline py-2.5 text-xs">Mahasiswa</button>
            <button onClick={() => submit('konselor')} className="btn-outline py-2.5 text-xs">Konselor</button>
            <button onClick={() => submit('admin')} className="btn-outline py-2.5 text-xs">Pimpinan</button>
          </div>
        </div>
      </div>
    </div>
  );
}
