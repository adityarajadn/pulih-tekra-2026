import React from 'react';
import { Calendar, CheckCircle2, Bot } from 'lucide-react';

export function MoodResponseVibrant({ mood, onOpenChatbot, onBookCounseling }: { mood: string | null, onOpenChatbot?: () => void, onBookCounseling?: () => void }) {
  if (mood === 'very_good' || mood === 'good') {
    return (
      <div className="card-tactile bg-[#ffdf92] border-[#f4bf00] flex items-center gap-6 animate-in zoom-in-95 duration-300">
        <div className="text-6xl">{mood === 'very_good' ? '☀️' : '🌤️'}</div>
        <div>
          <h3 className="text-2xl font-heading text-[#594400] mb-2">Senang mendengarnya!</h3>
          <p className="text-[#6e5400] font-medium">Semoga harimu berjalan lancar dan penuh produktivitas.</p>
          {onBookCounseling && (
            <button onClick={onBookCounseling} className="btn-outline py-2 px-4 text-xs bg-white mt-4">
              <Calendar className="w-4 h-4" /> Booking Konseling
            </button>
          )}
        </div>
      </div>
    );
  }
  
  if (mood === 'neutral') {
    return (
      <div className="card-tactile bg-[#eeeeed] border-[#dadada] flex items-center gap-6 animate-in zoom-in-95 duration-300">
        <div className="text-6xl drop-shadow-md">⛅</div>
        <div>
          <h3 className="text-2xl font-heading text-[#1a1c1c] mb-2">Ambil jeda sejenak</h3>
          <button className="btn-outline py-2 px-4 text-xs bg-white">Mulai Latihan Napas</button>
          {onBookCounseling && (
            <button onClick={onBookCounseling} className="btn-outline py-2 px-4 text-xs bg-white mt-3">
              <Calendar className="w-4 h-4" /> Booking Konseling
            </button>
          )}
        </div>
      </div>
    );
  }

  if (mood === 'bad') {
    return (
      <div className="card-tactile bg-[#c8e6ff] border-[#88ceff] flex flex-col md:flex-row items-center md:items-start gap-6 animate-in zoom-in-95 duration-300">
        <div className="text-6xl mt-2 drop-shadow-md">🌧️</div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-2xl font-heading text-[#004c6e] mb-2">Sedang merasa berat?</h3>
          <p>Jika butuh bicara, buka chatbot TEMAN atau jadwalkan konseling.</p>
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            {onOpenChatbot && (
              <button onClick={onOpenChatbot} className="btn-primary bg-[#1cb0f6] border-[#006590] text-[#00405d] py-3 px-6">
                <Bot className="w-5 h-5" /> Chat TEMAN
              </button>
            )}
            {onBookCounseling && (
              <button onClick={onBookCounseling} className="btn-outline bg-white border-[#88ceff] text-[#004c6e] py-3 px-6">
                <Calendar className="w-5 h-5" /> Booking Konseling
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (mood === 'very_bad') {
    return (
      <div className="card-tactile bg-[#ffdad6] border-[#ba1a1a] flex flex-col md:flex-row items-center md:items-start gap-6 animate-in zoom-in-95 duration-300">
        <div className="text-6xl mt-2 drop-shadow-md animate-pulse">⛈️</div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-2xl font-heading text-[#93000a] mb-2">Kamu tidak sendirian.</h3>
          <p>Jika merasa krisis, segera hubungi layanan darurat atau jadwalkan bantuan profesional.</p>
          {onBookCounseling && (
            <button onClick={onBookCounseling} className="btn-primary bg-[#ba1a1a] border-[#93000a] text-white py-3 px-6 mt-4">
              <Calendar className="w-5 h-5" /> Booking Konseling
            </button>
          )}
        </div>
      </div>
    );
  }

  return null;
}
