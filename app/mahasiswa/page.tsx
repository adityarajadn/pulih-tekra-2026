"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import GlobalStyles from "../../components/GlobalStyles";
import { MoodResponseVibrant } from "../../components/MoodResponseVibrant";
import { ChatbotTEMAN } from "../../components/ChatbotTEMAN";
import { ChatBubble } from "../../components/ChatBubble";
import {
  Activity,
  BookOpen,
  Bot,
  ClipboardCheck,
  CloudLightning,
  CloudRain,
  CloudSun,
  LayoutDashboard,
  Calendar,
  CalendarDays,
  Sun,
  HelpCircle,
  Bell,
  LogOutIcon,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MapPin,
  User,
  Star,
} from "lucide-react";

// --- DATA DUMMY ---
const dummyTriageData = [
  {
    id: 1,
    name: "Budi Santoso",
    nim: "205150201111001",
    fakultas: "FILKOM",
    score: 85,
    status: "merah",
    mood: "⛈️",
    lastAbsence: "Hari ini",
    issue: "Potensi krisis",
  },
  {
    id: 2,
    name: "Siti Rahma",
    nim: "205150201111002",
    fakultas: "FIA",
    score: 65,
    status: "kuning",
    mood: "🌧️",
    lastAbsence: "Kemarin",
    issue: "Stres akademik berulang",
  },
  {
    id: 3,
    name: "Agus Pratama",
    nim: "205150201111003",
    fakultas: "FT",
    score: 45,
    status: "kuning",
    mood: "⛅",
    lastAbsence: "Hari ini",
    issue: "Kelelahan",
  },
  {
    id: 4,
    name: "Dina Nabila",
    nim: "205150201111004",
    fakultas: "FEB",
    score: 15,
    status: "hijau",
    mood: "☀️",
    lastAbsence: "Hari ini",
    issue: "Stabil",
  },
];

const facultiesData = [
  { name: "FILKOM", score: 62, trend: "naik" },
  { name: "FT", score: 58, trend: "naik" },
  { name: "FEB", score: 45, trend: "turun" },
  { name: "FIA", score: 40, trend: "stabil" },
  { name: "FH", score: 35, trend: "turun" },
];

const dummyMoodTrendData = Array.from({ length: 30 }, (_, i) => {
  const baseHeight = 40 + Math.sin(i / 3) * 20; // Wavy baseline
  const noise = Math.sin(i * 12.9898 + 78.233) * 30;
  const height = Math.max(10, Math.min(100, Math.floor(baseHeight + noise)));

  let color = "bg-[#87fe45]"; // green
  let tooltip = "Baik";
  if (height <= 40) {
    color = "bg-[#ba1a1a]"; // red
    tooltip = "Sangat Buruk";
  } else if (height <= 60) {
    color = "bg-[#006590]"; // blue
    tooltip = "Buruk";
  } else if (height <= 80) {
    color = "bg-[#fec700]"; // yellow
    tooltip = "Biasa";
  }

  return { day: 30 - i, height, color, tooltip };
}).reverse(); // Current day is last

const jadwalKuliahData = [
  {
    hari: "Senin",
    jadwal: [
      { mk: "Pemrograman Lanjut", jam: "07:00:00 - 08:40:00", ruang: "F3.1" },
      { mk: "Aljabar Linear", jam: "08:45:00 - 10:25:00", ruang: "F4.4" },
      { mk: "Basis Data", jam: "10:30:00 - 12:10:00", ruang: "RV 1.5" },
      { mk: "Pemrograman Lanjut", jam: "16:00:00 - 17:40:00", ruang: "G1.5" },
    ],
  },
  {
    hari: "Selasa",
    jadwal: [
      { mk: "Etika Profesi", jam: "07:00:00 - 08:40:00", ruang: "F4.1" },
      { mk: "Sistem Operasi", jam: "08:45:00 - 10:25:00", ruang: "F3.4" },
      { mk: "Sistem Operasi", jam: "15:20:00 - 17:00:00", ruang: "G1.2" },
    ],
  },
  {
    hari: "Rabu",
    jadwal: [
      { mk: "Bahasa Inggris", jam: "15:20:00 - 17:00:00", ruang: "F3.5" },
    ],
  },
  {
    hari: "Kamis",
    jadwal: [
      { mk: "Pemrograman Lanjut", jam: "08:45:00 - 10:25:00", ruang: "F4.6" },
      { mk: "Sistem Operasi", jam: "15:20:00 - 17:00:00", ruang: "F3.3" },
    ],
  },
  {
    hari: "Jumat",
    jadwal: [
      { mk: "Matematika Diskret", jam: "07:00:00 - 08:40:00", ruang: "F3.2" },
      { mk: "Basis Data", jam: "14:15:00 - 15:55:00", ruang: "G1.6" },
    ],
  },
];

// Global styles moved to components/GlobalStyles.tsx

export default function MahasiswaPage() {
  return (
    <>
      <GlobalStyles />
      <MahasiswaView />
    </>
  );
}

function MahasiswaView() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [presensiStep, setPresensiStep] = useState("list");
  const [selectedCounselor, setSelectedCounselor] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [bookingStatus, setBookingStatus] = useState("");
  const [hasPresensiToday, setHasPresensiToday] = useState(false);
  const [favoriteCounselorId, setFavoriteCounselorId] = useState("rani");
  const [notifications, setNotifications] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [unreadChats, setUnreadChats] = useState(1);
  const [unreadNotifs, setUnreadNotifs] = useState(2);

  useEffect(() => {
    fetch("/api/bookings?mahasiswaId=mhs-1")
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (activeTab === "notifikasi") {
      fetch("/api/notifications?userId=mhs-1")
        .then((res) => res.json())
        .then((data) => setNotifications(data))
        .catch(() => {});
    }
  }, [activeTab]);

  const counselorOptions = [
    {
      id: "rani",
      name: "Rani Wulandari, M.Psi.",
      focus: "Stress akademik & burnout",
      schedule: "Senin - Rabu",
    },
    {
      id: "dimas",
      name: "Dimas Pratama, S.Psi.",
      focus: "Adaptasi perkuliahan & relasi",
      schedule: "Selasa - Kamis",
    },
    {
      id: "sinta",
      name: "Sinta Maharani, M.Psi.",
      focus: "Krisis emosi & recovery plan",
      schedule: "Jumat - Sabtu",
    },
  ];

  const slotOptions = ["09:00", "10:30", "13:00", "15:00"];

  const handleMoodSelect = async (moodId: string) => {
    setSelectedMood(moodId);
    setHasCheckedInToday(true);

    // Kirim perhitungan skor ke backend
    try {
      await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "mhs-1", mood: moodId }),
      });
    } catch (e) {}

    if (activeTab === "presensi" && presensiStep === "mood_modal") {
      setTimeout(() => {
        setHasPresensiToday(true);
        setPresensiStep("response");
      }, 600);
    }
  };

  const handlePresensi = () => {
    if (!hasCheckedInToday) {
      setPresensiStep("mood_modal");
    } else {
      setHasPresensiToday(true);
      setPresensiStep("response");
    }
  };

  const handleBookingCounseling = () => {
    setActiveTab("konseling");
    setBookingStatus("");
  };

  const handleConfirmBooking = async () => {
    if (!selectedCounselor || !selectedSlot) {
      setBookingStatus("Pilih konselor dan jam sesi terlebih dahulu.");
      return;
    }

    const counselor = counselorOptions.find(
      (option) => option.id === selectedCounselor,
    );

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mahasiswaId: "mhs-1",
          mahasiswaName: "Aditya Rajadana Hernadi",
          counselorId: selectedCounselor,
          slot: selectedSlot,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.isShifted) {
          setBookingStatus(
            `Jadwal penuh! Booking digeser otomatis ke ${data.newSlot} dengan ${counselor?.name || "konselor"}. Menunggu konfirmasi.`,
          );
        } else {
          setBookingStatus(
            `Booking berhasil dikirim ke ${counselor?.name || "konselor"} pada pukul ${selectedSlot}. Menunggu konfirmasi.`,
          );
        }
      } else {
        const errorData = await res.json();
        setBookingStatus(`Gagal mengirim booking: ${errorData.error}`);
      }
    } catch (e) {
      setBookingStatus("Gagal mengirim booking.");
    }
  };

  const moodOptions = [
    {
      id: "very_bad",
      label: "Sangat Buruk",
      icon: (
        <CloudLightning
          className="w-10 h-10 mb-2 text-[#ba1a1a]"
          strokeWidth={2.5}
        />
      ),
    },
    {
      id: "bad",
      label: "Buruk",
      icon: (
        <CloudRain
          className="w-10 h-10 mb-2 text-[#006590]"
          strokeWidth={2.5}
        />
      ),
    },
    {
      id: "neutral",
      label: "Biasa",
      icon: (
        <CloudSun className="w-10 h-10 mb-2 text-[#755b00]" strokeWidth={2.5} />
      ),
    },
    {
      id: "good",
      label: "Baik",
      icon: <Sun className="w-10 h-10 mb-2 text-[#2b6c00]" strokeWidth={2.5} />,
    },
  ];

  return (
    <div className="flex w-full min-h-screen flex-col md:flex-row bg-[#faf9f9]">
      {/* SIDEBAR */}
      <div className="hidden md:flex flex-col w-[280px] bg-[#f4f3f3] border-r-2 border-[#e3e2e2] p-6 h-screen sticky top-0 shrink-0">
        {/* Profile Card */}
        <div className="bg-[#006590] rounded-2xl p-5 mb-6 text-white border-2 border-[#004c6e] border-b-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-5 rounded-full -mr-8 -mt-8"></div>
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="w-12 h-12 bg-[#fec700] rounded-full flex items-center justify-center font-bold text-lg text-[#6e5400] border-2 border-[#755b00]">
              AR
            </div>
            <div>
              <p className="font-bold text-[#ffffff] font-heading leading-tight text-lg">
                Aditya Rajadana Hernadi
              </p>
              <p className="text-sm text-[#88ceff]">205150200111002</p>
            </div>
          </div>
          <div className="bg-[#00405d] p-2 rounded-xl text-[10px] font-bold flex items-center gap-2 border border-[#001e2e] relative z-10">
            <BookOpen className="w-4 h-4 text-[#88ceff]" /> FAKULTAS ILMU
            KOMPUTER
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-3 flex-1 overflow-y-auto pr-2">
          <button
            onClick={() => {
              setActiveTab("dashboard");
              setPresensiStep("list");
            }}
            className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`}
          >
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </button>
          <button
            onClick={() => {
              setActiveTab("presensi");
              setPresensiStep("list");
            }}
            className={`nav-item ${activeTab === "presensi" ? "active" : ""}`}
          >
            <ClipboardCheck className="w-5 h-5" /> Presensi
          </button>
          <button
            onClick={() => setActiveTab("jadwal")}
            className={`nav-item ${activeTab === "jadwal" ? "active" : ""}`}
          >
            <CalendarDays className="w-5 h-5" /> Jadwal Kuliah
          </button>
          <button
            onClick={() => {
              setActiveTab("chatbot");
              setUnreadChats(0);
            }}
            className={`nav-item justify-between ${activeTab === "chatbot" ? "active" : ""}`}
          >
            <div className="flex items-center gap-[0.75rem]">
              <Bot className="w-5 h-5" /> Chat TEMAN
            </div>
            {unreadChats > 0 && (
              <span className="bg-[#ba1a1a] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shrink-0">
                {unreadChats}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("konseling")}
            className={`nav-item ${activeTab === "konseling" ? "active" : ""}`}
          >
            <Calendar className="w-5 h-5" /> Booking Konseling
          </button>
          <button
            onClick={() => {
              setActiveTab("notifikasi");
              setUnreadNotifs(0);
            }}
            className={`nav-item justify-between ${activeTab === "notifikasi" ? "active" : ""}`}
          >
            <div className="flex items-center gap-[0.75rem]">
              <Bell className="w-5 h-5" /> Notifikasi
            </div>
            {unreadNotifs > 0 && (
              <span className="bg-[#ba1a1a] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shrink-0">
                {unreadNotifs}
              </span>
            )}
          </button>
        </nav>

        {/* Bantuan Button */}
        <div className="mt-auto pt-6 border-t-2 border-[#e3e2e2]">
          <button
            onClick={() => setActiveTab("bantuan")}
            className={`nav-item ${activeTab === "bantuan" ? "active" : ""}`}
          >
            <HelpCircle className="w-5 h-5" /> Bantuan
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-5xl mx-auto">
        {/* Desktop Header */}
        <div className="hidden md:flex justify-end items-center mb-8 pb-4 border-b-2 border-[#e3e2e2]">
          <div className="text-right mr-4">
            <p className="font-heading font-bold text-lg text-[#1a1c1c]">
              Aditya Rajadana
            </p>
            <p className="text-sm font-bold text-[#6e7881]">Akses: Mahasiswa</p>
          </div>
          <button
            onClick={() => router.push("/login")}
            className="p-3 bg-[#f4f3f3] border-2 border-[#e3e2e2] border-b-4 rounded-xl text-[#3e4850] hover:bg-[#e9e8e8] active:border-b-2 active:translate-y-[2px] transition-all"
            title="Kelbali ke Login"
          >
            <LogOutIcon className="w-6 h-6" />
          </button>
        </div>

        {/* --- TAB CONTENT --- */}
        {activeTab === "dashboard" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Welcome Card */}
            <div className="card-tactile flex flex-col md:flex-row items-center gap-6 overflow-hidden relative">
              <div className="flex-1 z-10">
                <h2 className="text-2xl md:text-3xl font-heading mb-3 text-[#1a1c1c]">
                  Selamat Datang di SIAM
                </h2>
                <p className="text-lg text-[#3e4850] mb-8 max-w-xl">
                  Ringkasan aktivitas akademikmu hari ini. Tetap semangat
                  belajarnya!
                </p>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => setActiveTab("presensi")}
                    className="btn-primary py-3 px-6"
                  >
                    PRESENSI SEKARANG
                  </button>
                  <button
                    onClick={() => setActiveTab("jadwal")}
                    className="btn-outline py-3 px-6"
                  >
                    LIHAT JADWAL
                  </button>
                </div>
              </div>
              <div className="shrink-0 w-32 md:w-48 flex justify-center items-center opacity-90 relative z-10">
                <div className="bg-[#fec700] p-6 rounded-3xl border-4 border-[#755b00]">
                  <Bot className="w-16 h-16 md:w-20 md:h-20 text-[#6e5400]" />
                </div>
              </div>
            </div>

            {/* Mood Check-in Widget */}
            {!hasCheckedInToday ? (
              <div className="card-tactile">
                <h3 className="text-xl font-heading flex items-center gap-3 mb-2 text-[#1a1c1c]">
                  <Activity className="w-6 h-6 text-[#006590]" />
                  Bagaimana perasaanmu hari ini?
                </h3>
                <p className="text-[#3e4850] mb-6">
                  Check-in harianmu membantu kami mendukung kesejahteraanmu.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {moodOptions.map((mood) => (
                    <button
                      key={mood.id}
                      onClick={() => handleMoodSelect(mood.id)}
                      className={`flex flex-col items-center justify-center p-6 bg-white border-2 border-[#e3e2e2] border-b-4 border-b-[#dadada] rounded-2xl transition-all active:border-b-2 active:translate-y-[2px] hover:bg-[#f4f3f3]`}
                    >
                      {mood.icon}
                      <span className="font-bold text-[#3e4850] mt-2">
                        {mood.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <MoodResponseVibrant
                mood={selectedMood}
                onOpenChatbot={() => setActiveTab("chatbot")}
                onBookCounseling={handleBookingCounseling}
              />
            )}

            {/* Mood Trend Widget */}
            <div className="card-tactile mt-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-heading text-[#1a1c1c] flex items-center gap-2">
                  <Activity className="w-6 h-6 text-[#1cb0f6]" />
                  Tren Mood (30 Hari Terakhir)
                </h3>
              </div>

              <div className="flex items-end gap-1 sm:gap-2 h-40 w-full pt-4">
                {dummyMoodTrendData.map((data, i) => (
                  <div
                    key={i}
                    className="flex-1 flex flex-col justify-end group relative h-full"
                  >
                    <div
                      className={`${data.color} w-full rounded-t-md transition-all duration-300 hover:opacity-80 border border-black/10`}
                      style={{ height: `${data.height}%` }}
                    ></div>
                    <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#1a1c1c] text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10 pointer-events-none transition-opacity">
                      H-{data.day}: {data.tooltip}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-6 pt-4 border-t-2 border-[#e3e2e2]">
                <div className="text-center flex-1">
                  <p className="text-xs sm:text-sm text-[#6e7881] font-bold uppercase">
                    Dominan
                  </p>
                  <p className="font-heading text-base sm:text-lg text-[#2b6c00]">
                    Biasa
                  </p>
                </div>
                <div className="text-center flex-1 border-l-2 border-[#e3e2e2]">
                  <p className="text-xs sm:text-sm text-[#6e7881] font-bold uppercase">
                    Rata-rata
                  </p>
                  <p className="font-heading text-base sm:text-lg text-[#006590]">
                    Stabil
                  </p>
                </div>
                <div className="text-center flex-1 border-l-2 border-[#e3e2e2]">
                  <p className="text-xs sm:text-sm text-[#6e7881] font-bold uppercase">
                    Krisis
                  </p>
                  <p className="font-heading text-base sm:text-lg text-[#ba1a1a]">
                    0 Hari
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card-tactile">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-heading text-[#1a1c1c]">
                    Jadwal Terdekat
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="bg-[#f4f3f3] border-2 border-[#e3e2e2] rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:border-[#1cb0f6] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="bg-[#c8e6ff] text-[#004c6e] p-3 rounded-xl text-center min-w-[60px] border border-[#88ceff]">
                        <p className="text-[10px] font-bold uppercase leading-none mb-1">
                          HARI
                        </p>
                        <p className="text-lg font-heading leading-none">INI</p>
                      </div>
                      <div>
                        <p className="font-bold text-[#1a1c1c] text-lg">
                          {jadwalKuliahData[0].jadwal[0].mk}
                        </p>
                        <p className="text-sm text-[#6e7881]">
                          {jadwalKuliahData[0].jadwal[0].jam.substring(0, 5)} -{" "}
                          {jadwalKuliahData[0].jadwal[0].jam.substring(11, 16)}{" "}
                          • Ruang {jadwalKuliahData[0].jadwal[0].ruang}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#f4f3f3] border-2 border-[#e3e2e2] rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:border-[#1cb0f6] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="bg-[#ffdf92] text-[#594400] p-3 rounded-xl text-center min-w-[60px] border border-[#755b00]">
                        <p className="text-[10px] font-bold uppercase leading-none mb-1">
                          HARI
                        </p>
                        <p className="text-lg font-heading leading-none">INI</p>
                      </div>
                      <div>
                        <p className="font-bold text-[#1a1c1c] text-lg">
                          {jadwalKuliahData[0].jadwal[1].mk}
                        </p>
                        <p className="text-sm text-[#6e7881]">
                          {jadwalKuliahData[0].jadwal[1].jam.substring(0, 5)} -{" "}
                          {jadwalKuliahData[0].jadwal[1].jam.substring(11, 16)}{" "}
                          • Ruang {jadwalKuliahData[0].jadwal[1].ruang}
                        </p>
                      </div>
                    </div>
                  </div>
                  {bookings
                    .filter((b) => b.status === "confirmed")
                    .map((b, i) => {
                      const slotParts = b.slot.split(" ");
                      const isDateIncluded = slotParts.length > 1;
                      const dateStr = isDateIncluded ? slotParts[0] : "Bln";
                      const timeStr = isDateIncluded
                        ? slotParts.slice(1).join(" ")
                        : b.slot;
                      const dateObj = isDateIncluded
                        ? new Date(dateStr)
                        : new Date();

                      return (
                        <div
                          key={i}
                          className="bg-[#f4f3f3] border-2 border-[#e3e2e2] rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:border-[#1cb0f6] transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="bg-[#87fe45] text-[#082100] p-3 rounded-xl text-center min-w-[60px] border border-[#51bd00]">
                              <p className="text-[10px] font-bold uppercase leading-none mb-1">
                                {isDateIncluded
                                  ? dateObj.toLocaleDateString("id-ID", {
                                      weekday: "short",
                                    })
                                  : "HARI"}
                              </p>
                              <p className="text-lg font-heading leading-none">
                                {isDateIncluded ? dateObj.getDate() : "INI"}
                              </p>
                            </div>
                            <div>
                              <p className="font-bold text-[#1a1c1c] text-lg">
                                Konseling dengan {b.counselorId}
                              </p>
                              <p className="text-sm text-[#6e7881]">
                                {timeStr} • Sesi Konseling
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="card-tactile bg-[#eeeeed] border-[#dadada] border-b-[#bdc8d2]">
                <h3 className="text-xl font-heading text-[#1a1c1c] mb-6">
                  Progress Akademik
                </h3>
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-sm font-bold text-[#3e4850] uppercase tracking-wide">
                        SKS Terpenuhi
                      </span>
                      <span className="text-lg font-heading text-[#006590]">
                        84/144
                      </span>
                    </div>
                    <div className="progress-track">
                      <div
                        className="progress-fill-blue"
                        style={{ width: "58%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-sm font-bold text-[#3e4850] uppercase tracking-wide">
                        IPK Rata-Rata
                      </span>
                      <span className="text-lg font-heading text-[#2b6c00]">
                        3.85
                      </span>
                    </div>
                    <div className="progress-track">
                      <div
                        className="progress-fill-green"
                        style={{ width: "96%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "presensi" && (
          <div className="animate-in fade-in duration-300">
            <h2 className="text-3xl font-heading text-[#1a1c1c] mb-6">
              Presensi Kelas
            </h2>

            {presensiStep === "list" && (
              <div className="space-y-4 max-w-3xl">
                <div className="card-tactile bg-[#e6f4ff] border-[#88ceff] flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <span className="bg-[#1cb0f6] text-[#00405d] text-[10px] font-bold px-2 py-1 rounded-lg mb-2 inline-block uppercase border border-[#006590]">
                      Sedang Berlangsung
                    </span>
                    <h3 className="font-heading text-[#00405d] text-xl">
                      {jadwalKuliahData[0].jadwal[0].mk}
                    </h3>
                    <p className="text-sm text-[#006590] flex items-center gap-1 mt-1 font-medium">
                      <Clock className="w-4 h-4" />{" "}
                      {jadwalKuliahData[0].jadwal[0].jam.substring(0, 5)} -{" "}
                      {jadwalKuliahData[0].jadwal[0].jam.substring(11, 16)} •
                      Ruang {jadwalKuliahData[0].jadwal[0].ruang}
                    </p>
                  </div>
                  {hasPresensiToday ? (
                    <button
                      disabled
                      className="bg-[#87fe45] text-[#1f5100] border-2 border-[#51bd00] border-b-4 py-3 px-6 shrink-0 rounded-xl font-bold flex items-center gap-2 opacity-80 cursor-not-allowed"
                    >
                      <CheckCircle2 className="w-5 h-5" /> TERCATAT
                    </button>
                  ) : (
                    <button
                      onClick={handlePresensi}
                      className="btn-primary py-3 px-6 shrink-0"
                    >
                      <CheckCircle2 className="w-5 h-5" /> Hadir
                    </button>
                  )}
                </div>

                <div className="card-tactile bg-[#f4f3f3] opacity-75 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <span className="bg-[#dadada] text-[#3e4850] text-[10px] font-bold px-2 py-1 rounded-lg mb-2 inline-block uppercase border border-[#6e7881]">
                      Mendatang
                    </span>
                    <h3 className="font-heading text-[#1a1c1c] text-xl">
                      {jadwalKuliahData[0].jadwal[1].mk}
                    </h3>
                    <p className="text-sm text-[#6e7881] flex items-center gap-1 mt-1 font-medium">
                      <Clock className="w-4 h-4" />{" "}
                      {jadwalKuliahData[0].jadwal[1].jam.substring(0, 5)} -{" "}
                      {jadwalKuliahData[0].jadwal[1].jam.substring(11, 16)} •
                      Ruang {jadwalKuliahData[0].jadwal[1].ruang}
                    </p>
                  </div>
                  <button
                    disabled
                    className="btn-outline py-3 px-6 shrink-0 border-[#dadada] text-[#6e7881]"
                  >
                    Belum Mulai
                  </button>
                </div>
              </div>
            )}

            {presensiStep === "mood_modal" && (
              <div className="card-tactile bg-[#ffdad6] border-[#ba1a1a] max-w-2xl mx-auto text-center py-10 mt-8">
                <div className="bg-[#ba1a1a] w-16 h-16 rounded-2xl mx-auto flex items-center justify-center border-b-4 border-[#93000a] mb-6">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-heading text-[#93000a] mb-2">
                  Tunggu Sebentar!
                </h3>
                <p className="text-[#ba1a1a] mb-8 font-medium">
                  Kamu belum mengisi check-in perasaanmu hari ini di Dashboard.
                  Silakan pilih di bawah ini untuk melanjutkan:
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-4">
                  {moodOptions.map((mood) => (
                    <button
                      key={mood.id}
                      onClick={() => handleMoodSelect(mood.id)}
                      className="flex flex-col items-center justify-center p-4 bg-white border-2 border-[#e3e2e2] border-b-4 border-b-[#dadada] rounded-2xl active:border-b-2 active:translate-y-[2px]"
                    >
                      {mood.icon}
                      <span className="font-bold text-[#3e4850] mt-2 text-sm">
                        {mood.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {presensiStep === "response" && (
              <div className="max-w-2xl mx-auto space-y-6 mt-8 animate-in slide-in-from-bottom-4">
                <div className="card-tactile bg-[#87fe45] border-[#51bd00] flex items-center gap-6">
                  <div className="bg-[#2b6c00] rounded-2xl p-4 shrink-0 border-b-4 border-[#194500]">
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="font-heading text-2xl text-[#082100] mb-1">
                      Presensi Berhasil!
                    </h3>
                    <p className="text-[#1f5100] font-bold">
                      {jadwalKuliahData[0].jadwal[0].mk} - Hadir
                    </p>
                  </div>
                </div>

                <MoodResponseVibrant
                  mood={selectedMood}
                  onOpenChatbot={() => setActiveTab("chatbot")}
                  onBookCounseling={handleBookingCounseling}
                />

                <div className="text-center mt-6">
                  <button
                    onClick={() => setPresensiStep("list")}
                    className="btn-outline py-3 px-6"
                  >
                    Kembali ke Daftar Presensi
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "jadwal" && (
          <div className="animate-in fade-in duration-300 max-w-3xl">
            <h2 className="text-3xl font-heading text-[#1a1c1c] mb-6">
              Jadwal Kuliah Mingguan
            </h2>
            <div className="space-y-6">
              {jadwalKuliahData.map((hariItem) => (
                <div key={hariItem.hari} className="card-tactile">
                  <h3 className="font-heading text-xl text-[#006590] mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5" /> {hariItem.hari}
                  </h3>
                  <div className="space-y-3">
                    {hariItem.jadwal.map((j, idx) => (
                      <div
                        key={idx}
                        className="bg-[#f4f3f3] p-4 rounded-xl border-2 border-[#e3e2e2] flex justify-between items-center"
                      >
                        <div>
                          <p className="font-bold text-[#1a1c1c] text-lg">
                            {j.mk}
                          </p>
                          <p className="text-sm text-[#6e7881] mt-1 font-medium">
                            {j.jam.substring(0, 5)} - {j.jam.substring(11, 16)}{" "}
                            • Ruang {j.ruang}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "chatbot" && (
          <div className="h-[calc(100vh-120px)] max-h-[800px] max-w-3xl mx-auto flex flex-col">
            <ChatbotTEMAN />
          </div>
        )}

        {activeTab === "konseling" && (
          <div className="animate-in fade-in duration-300 max-w-5xl mx-auto space-y-6">
            <div className="card-tactile bg-[#e6f4ff] border-[#88ceff] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-heading text-[#00405d] mb-2">
                  Booking Konseling
                </h2>
                <p className="text-[#006590] font-medium">
                  Pilih konselor, jadwal, lalu konfirmasi sesi bantuan yang
                  paling cocok.
                </p>
              </div>
              <div className="bg-white border-2 border-[#88ceff] rounded-2xl px-4 py-3 font-bold text-[#004c6e] flex items-center gap-2">
                <Clock className="w-5 h-5" /> Layanan tersedia Senin - Sabtu
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card-tactile">
                <h3 className="text-2xl font-heading text-[#1a1c1c] mb-4 flex items-center gap-2">
                  <User className="w-6 h-6 text-[#006590]" /> Pilih Konselor
                </h3>
                <div className="space-y-3">
                  {counselorOptions.map((counselor) => (
                    <div
                      key={counselor.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedCounselor(counselor.id)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          setSelectedCounselor(counselor.id);
                        }
                      }}
                      className={`w-full text-left p-4 rounded-2xl border-2 border-b-4 transition-all cursor-pointer ${selectedCounselor === counselor.id ? "bg-[#c8e6ff] border-[#88ceff] border-b-[#006590]" : "bg-white border-[#e3e2e2] border-b-[#dadada]"}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-bold text-[#1a1c1c] text-lg">
                            {counselor.name}
                          </p>
                          <p className="text-sm text-[#3e4850] mt-1">
                            {counselor.focus}
                          </p>
                          <p className="text-xs font-bold text-[#6e7881] mt-2 uppercase tracking-wide">
                            {counselor.schedule}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            setFavoriteCounselorId((current) =>
                              current === counselor.id ? "" : counselor.id,
                            );
                          }}
                          aria-pressed={favoriteCounselorId === counselor.id}
                          aria-label={
                            favoriteCounselorId === counselor.id
                              ? `Hapus favorit ${counselor.name}`
                              : `Jadikan favorit ${counselor.name}`
                          }
                          className="shrink-0"
                        >
                          <Star
                            className={`w-5 h-5 transition-colors ${favoriteCounselorId === counselor.id ? "text-[#fec700] fill-[#fec700]" : "text-[#dadada]"}`}
                          />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card-tactile">
                <h3 className="text-2xl font-heading text-[#1a1c1c] mb-4 flex items-center gap-2">
                  <CalendarDays className="w-6 h-6 text-[#2b6c00]" /> Pilih Slot
                  Waktu
                </h3>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {slotOptions.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-4 rounded-2xl border-2 border-b-4 font-bold transition-all ${selectedSlot === slot ? "bg-[#87fe45] border-[#51bd00] border-b-[#2b6c00] text-[#1f5100]" : "bg-white border-[#e3e2e2] border-b-[#dadada] text-[#3e4850]"}`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>

                <div className="bg-[#faf9f9] border-2 border-[#e3e2e2] rounded-2xl p-4 mb-4">
                  <p className="text-sm font-bold text-[#6e7881] uppercase tracking-wide mb-2">
                    Lokasi
                  </p>
                  <p className="text-[#1a1c1c] font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#006590]" /> Ruang
                    Konseling B / Online via TEMAN
                  </p>
                </div>

                <button
                  onClick={handleConfirmBooking}
                  className="btn-primary py-3 px-6 w-full bg-[#006590] border-[#00405d] text-white"
                >
                  <Calendar className="w-5 h-5" /> Konfirmasi Booking
                </button>

                {bookingStatus && (
                  <div className="mt-4 p-4 rounded-2xl border-2 border-[#88ceff] bg-[#e6f4ff] text-[#00405d] font-medium">
                    {bookingStatus}
                  </div>
                )}
              </div>
            </div>

            <div className="card-tactile bg-[#ffdf92] border-[#f4bf00]">
              <h3 className="font-heading text-xl text-[#594400] mb-2">
                Butuh bantuan cepat?
              </h3>
              <p className="text-[#6e5400] mb-4">
                Kalau kamu belum siap booking, kamu bisa langsung ngobrol anonim
                lewat TEMAN dulu.
              </p>
              <button
                onClick={() => setActiveTab("chatbot")}
                className="btn-outline bg-white py-3 px-6 border-[#f4bf00] text-[#6e5400]"
              >
                <Bot className="w-5 h-5" /> Buka Chat TEMAN
              </button>
            </div>
          </div>
        )}

        {activeTab === "bantuan" && (
          <div className="card-tactile max-w-3xl mx-auto text-center py-16 animate-in fade-in duration-300">
            <h3 className="font-heading text-2xl">Bantuan & Kontak</h3>
            <p className="mt-4">Informasi bantuan tersedia di sini.</p>
          </div>
        )}

        {activeTab === "notifikasi" && (
          <div className="animate-in fade-in duration-300 max-w-3xl">
            <h2 className="text-3xl font-heading text-[#1a1c1c] mb-6 flex items-center gap-2">
              <Bell className="w-8 h-8 text-[#fec700]" /> Notifikasi
            </h2>
            <div className="space-y-4">
              {notifications.length === 0 ? (
                <div className="card-tactile text-center text-[#6e7881] py-10">
                  Belum ada notifikasi.
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`card-tactile ${n.read ? "bg-white opacity-70" : "bg-[#e6f4ff] border-[#88ceff]"}`}
                  >
                    <p className="font-medium text-[#1a1c1c]">{n.message}</p>
                    <p className="text-xs text-[#6e7881] mt-2">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <ChatBubble
        currentUserRole="mahasiswa"
        currentUserId="mhs-1"
        currentUserName="Aditya Rajadana Hernadi"
      />
    </div>
  );
}

// Replaced by components/MoodResponseVibrant and components/ChatbotTEMAN
