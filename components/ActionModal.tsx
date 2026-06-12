import React, { useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';

export function ActionModal({ action, student, onClose }: { action: string, student: any, onClose: () => void }) {
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const date = formData.get('date') as string;
    const time = formData.get('time') as string;

    if (action === 'jadwal') {
      try {
        await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mahasiswaId: student.name.includes('Budi') ? 'mhs-2' : student.name.includes('Siti') ? 'mhs-3' : 'mhs-1',
            mahasiswaName: student.name,
            counselorId: 'rani',
            slot: time,
            date: date,
            status: 'confirmed',
            createdBy: 'konselor'
          })
        });
      } catch (e) {}
    }

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
                  <input name="date" type="date" required className="input-tactile w-full px-4 py-3" />
                  <input name="time" type="time" required className="input-tactile w-full px-4 py-3" />
                  <select className="input-tactile w-full px-4 py-3 font-bold text-[#3e4850]">
                    <option>Online (G-Meet)</option>
                    <option>Offline (Klinik)</option>
                  </select>
                </>
              ) : (
                <textarea rows={4} required placeholder="Tulis pesan..." className="input-tactile w-full px-4 py-3 resize-none"></textarea>
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
