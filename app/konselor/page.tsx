"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import GlobalStyles from "../../components/GlobalStyles";
import { StudentDetailPanelTactile } from "../../components/StudentDetailPanelTactile";
import { ActionModal } from "../../components/ActionModal";
import { ChatBubble } from "../../components/ChatBubble";
import {
  LayoutDashboard,
  CalendarDays,
  LogOutIcon,
  AlertTriangle,
  Users,
  CheckCircle2,
  MessageSquare,
  Clock,
  Calendar,
  FileEdit,
  PlusCircle,
  FileText,
  ExternalLink,
  Send,
  X,
  Bell,
} from "lucide-react";

// --- DATA DUMMY ---
const dummyTriageData = [
  {
    id: 1,
    name: "Aditya Rajadana Hernadi",
    nim: "205150201111002",
    fakultas: "FILKOM",
    score: 85,
    status: "merah",
    mood: "⛈️",
    lastAbsence: "Hari ini",
    issue: "Potensi krisis",
  },
  {
    id: 2,
    name: "Budi Santoso",
    nim: "205150201111001",
    fakultas: "FIA",
    score: 65,
    status: "kuning",
    mood: "🌧️",
    lastAbsence: "Kemarin",
    issue: "Stres akademik berulang",
  },
  {
    id: 3,
    name: "Siti Rahma",
    nim: "205150201111003",
    fakultas: "FT",
    score: 45,
    status: "kuning",
    mood: "⛅",
    lastAbsence: "Hari ini",
    issue: "Kelelahan",
  },
];

const facultiesData = [
  { name: "FILKOM", score: 62, trend: "naik" },
  { name: "FT", score: 58, trend: "naik" },
  { name: "FEB", score: 45, trend: "turun" },
  { name: "FIA", score: 40, trend: "stabil" },
  { name: "FH", score: 35, trend: "turun" },
];

// GlobalStyles moved to components/GlobalStyles.tsx

export default function KonselorPage() {
  return (
    <>
      <GlobalStyles />
      <KonselorView />
    </>
  );
}

function KonselorView() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadNotifs, setUnreadNotifs] = useState(3);
  const [triageData, setTriageData] = useState<any[]>(dummyTriageData);
  const [sortBy, setSortBy] = useState("score");

  // Reschedule Modal State
  const [rescheduleBooking, setRescheduleBooking] = useState<{
    id: string;
    currentSlot: string;
  } | null>(null);
  const [newSlotInput, setNewSlotInput] = useState("");

  useEffect(() => {
    fetch("/api/profiles?role=mahasiswa")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((d, i) => ({
            id: d.user_id,
            name: d.name,
            nim: "20515020" + (i + 1).toString().padStart(5, "0"),
            fakultas: d.fakultas || ["FILKOM", "FIA", "FT", "FEB"][i % 4],
            jurusan: d.jurusan || "Belum Ditentukan",
            score: d.risk_score ?? Math.max(15, 85 - i * 20),
            status:
              (d.risk_score ?? Math.max(15, 85 - i * 20)) >= 75
                ? "merah"
                : (d.risk_score ?? Math.max(15, 85 - i * 20)) >= 50
                  ? "kuning"
                  : "hijau",
            mood:
              d.current_mood === "very_bad"
                ? "⛈️"
                : d.current_mood === "bad"
                  ? "🌧️"
                  : d.current_mood === "neutral"
                    ? "⛅"
                    : d.current_mood === "good"
                      ? "☀️"
                      : d.current_mood === "very_good"
                        ? "🌈"
                        : ["⛈️", "🌧️", "⛅", "☀️"][i % 4],
            lastAbsence: "Hari ini",
            issue: ["Potensi krisis", "Stres akademik berulang", "Kelelahan"][
              i % 3
            ],
          }));
          setTriageData(mapped);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (activeTab === "notifikasi") {
      fetch("/api/notifications?userId=rani")
        .then((res) => res.json())
        .then((data) => setNotifications(data))
        .catch(() => {});
    }
  }, [activeTab]);

  const fetchBookings = () => {
    fetch("/api/bookings?counselorId=rani")
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch(() => {});
  };

  useEffect(() => {
    if (activeTab === "kalender") {
      fetchBookings();
    }
  }, [activeTab]);

  const updateBookingStatus = async (
    id: string,
    status: string,
    newSlot?: string,
  ) => {
    try {
      await fetch("/api/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, newSlot }),
      });
      fetchBookings();
    } catch (e) {}
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "merah":
        return "bg-[#ffdad6] text-[#93000a] border-[#ba1a1a]";
      case "kuning":
        return "bg-[#ffdf92] text-[#594400] border-[#755b00]";
      case "hijau":
        return "bg-[#c8e6ff] text-[#004c6e] border-[#006590]";
      default:
        return "bg-[#e3e2e2] text-[#3e4850] border-[#6e7881]";
    }
  };

  return (
    <div className="flex w-full min-h-screen flex-col md:flex-row bg-[#faf9f9]">
      <div
        className="hidden md:flex flex-col w-[280px] bg-[#f4f3f3] border-r-2 border-[#e3e2e2] p-6 h-screen sticky top-0 shrink-0"
        style={
          {
            "--primary": "#51bd00",
            "--primary-text": "#194500",
            "--primary-dark": "#2b6c00",
          } as React.CSSProperties
        }
      >
        <div className="bg-[#2b6c00] rounded-2xl p-5 mb-6 text-white border-2 border-[#194500] border-b-4 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="w-12 h-12 bg-[#87fe45] rounded-full flex items-center justify-center font-bold text-lg text-[#082100] border-2 border-[#1f5100]">
              RW
            </div>
            <div>
              <p className="font-bold text-[#ffffff] font-heading leading-tight text-lg">
                Rani Wulandari
              </p>
              <p className="text-sm text-[#6be026] font-medium">
                SIPK: 10293847
              </p>
            </div>
          </div>
        </div>

        <nav className="flex flex-col gap-3 flex-1">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`}
          >
            <LayoutDashboard className="w-5 h-5" /> Dashboard Triase
          </button>
          <button
            onClick={() => setActiveTab("kalender")}
            className={`nav-item ${activeTab === "kalender" ? "active" : ""}`}
          >
            <CalendarDays className="w-5 h-5" /> Manajemen Jadwal
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

        <div className="mt-auto pt-6 border-t-2 border-[#e3e2e2]">
          <button
            onClick={() => router.push("/login")}
            className="btn-outline w-full py-3 border-[#dadada] text-[#3e4850] hover:bg-[#e9e8e8]"
          >
            <LogOutIcon className="w-5 h-5" /> KEMBALI
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 md:p-8 overflow-y-auto w-full">
        {activeTab === "dashboard" && (
          <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in duration-300">
            <div className="w-full lg:w-[40%] flex flex-col gap-4">
              <div className="card-tactile bg-[#f4f3f3] border-[#e3e2e2]">
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle className="w-6 h-6 text-[#2b6c00]" />
                  <h2 className="text-2xl font-heading text-[#1a1c1c]">
                    Dashboard Triase
                  </h2>
                </div>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-sm text-[#6e7881] font-bold uppercase tracking-wide">
                    Diurutkan berdasar
                  </p>
                  <select
                    className="bg-white border-2 border-[#e3e2e2] text-[#3e4850] text-sm font-bold rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#51bd00] cursor-pointer"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="score">Risk Score</option>
                    <option value="name">Nama (A-Z)</option>
                    <option value="fakultas">Fakultas</option>
                  </select>
                </div>

                <div className="space-y-4">
                  {[...triageData]
                    .sort((a, b) => {
                      if (sortBy === "score") return b.score - a.score;
                      if (sortBy === "name")
                        return a.name.localeCompare(b.name);
                      if (sortBy === "fakultas")
                        return a.fakultas.localeCompare(b.fakultas);
                      return 0;
                    })
                    .map((student) => (
                      <div
                        key={student.id}
                        onClick={() => setSelectedStudent(student)}
                        className={`card-tactile-sm flex flex-col sm:flex-row justify-between sm:items-center gap-3 cursor-pointer transition-all hover:bg-white ${selectedStudent?.id === student.id ? "border-[#51bd00] bg-white" : ""}`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-12 h-12 rounded-xl border-2 border-b-4 flex items-center justify-center text-2xl ${getStatusStyle(student.status)}`}
                          >
                            {student.mood}
                          </div>
                          <div>
                            <h3 className="font-heading text-lg text-[#1a1c1c] leading-tight">
                              {student.name}
                            </h3>
                            <p className="text-xs font-bold text-[#6e7881] uppercase mt-1">
                              {student.fakultas}{" "}
                              {student.jurusan !== "Belum Ditentukan"
                                ? `• ${student.jurusan}`
                                : ""}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`text-xs font-bold px-2 py-1 rounded-md border-2 ${getStatusStyle(student.status)}`}
                          >
                            Skor: {student.score}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="w-full lg:w-[60%]">
              {selectedStudent ? (
                <StudentDetailPanelTactile
                  student={selectedStudent}
                  getStatusStyle={getStatusStyle}
                  onOpenAction={setActiveAction}
                />
              ) : (
                <div className="card-tactile h-full min-h-[500px] flex flex-col items-center justify-center text-[#6e7881] text-center bg-[#f4f3f3] border-dashed">
                  <Users className="w-16 h-16 mb-4 text-[#dadada]" />
                  <p className="font-heading text-xl text-[#3e4850] mb-2">
                    Profil Kondisi Mahasiswa
                  </p>
                  <p className="font-medium max-w-sm">
                    Informasi detail, riwayat mood, rekam jejak, dan opsi
                    rujukan akan muncul di sini.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "kalender" && (
          <div className="card-tactile min-h-[600px] animate-in fade-in duration-300">
            <h2 className="text-3xl font-heading text-[#1a1c1c] mb-6 flex items-center gap-3">
              <CalendarDays className="w-8 h-8 text-[#2b6c00]" /> Manajemen
              Jadwal
            </h2>
            <div className="space-y-8">
              <div>
                <h3 className="font-heading text-xl text-[#1a1c1c] mb-4">
                  Permintaan Booking
                </h3>
                <div className="space-y-4">
                  {bookings.length === 0 ? (
                    <p className="text-[#6e7881]">
                      Belum ada permintaan booking.
                    </p>
                  ) : (
                    bookings.map((b) => (
                      <div
                        key={b.id}
                        className="card-tactile-sm bg-[#f4f3f3] border-2 border-[#e3e2e2]"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="font-heading text-xl text-[#1a1c1c]">
                              {b.mahasiswaName}
                            </p>
                            <p className="text-sm font-bold text-[#6e7881] mt-1 uppercase">
                              Sesi Konseling
                            </p>
                          </div>
                          <span
                            className={`text-xs px-3 py-1 rounded-full border-2 font-bold uppercase ${b.status === "confirmed" ? "bg-[#87fe45] text-[#1f5100] border-[#51bd00]" : b.status === "rejected" ? "bg-[#ffdad6] text-[#93000a] border-[#ba1a1a]" : "bg-[#fec700] text-[#6e5400] border-[#755b00]"}`}
                          >
                            {b.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border-2 border-[#e3e2e2] w-max font-bold text-[#3e4850] mb-4">
                          <Clock className="w-4 h-4" /> {b.slot}
                        </div>
                        {b.status === "pending" && (
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() =>
                                updateBookingStatus(b.id, "confirmed")
                              }
                              className="bg-[#51bd00] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#3e9e00] transition-colors"
                            >
                              Konfirmasi
                            </button>
                            <button
                              onClick={() =>
                                updateBookingStatus(b.id, "rejected")
                              }
                              className="bg-[#ba1a1a] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#93000a] transition-colors"
                            >
                              Tolak
                            </button>
                            <button
                              onClick={() => {
                                setRescheduleBooking({
                                  id: b.id,
                                  currentSlot: b.slot,
                                });
                                setNewSlotInput(b.slot);
                              }}
                              className="bg-[#006590] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#004c6e] transition-colors"
                            >
                              Ganti Tanggal
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-heading text-xl text-[#1a1c1c] mb-4">
                  Besok
                </h3>
                <div className="space-y-4">
                  <div className="card-tactile-sm bg-[#f4f3f3]">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-heading text-xl text-[#1a1c1c]">
                          Siti Rahma
                        </p>
                        <p className="text-sm font-bold text-[#6e7881] mt-1 uppercase">
                          Sesi Lanjutan • Ruang Konseling B
                        </p>
                      </div>
                      <span className="bg-[#ffdf92] text-[#594400] text-xs px-3 py-1 rounded-full border-2 border-[#755b00] font-bold uppercase tracking-wider">
                        Risiko Sedang
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border-2 border-[#e3e2e2] border-b-4 border-b-[#dadada] w-max font-bold text-[#3e4850]">
                      <Clock className="w-4 h-4" /> 13:00 - 14:00
                    </div>
                  </div>
                </div>
              </div>
            </div>
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

      {activeAction && selectedStudent && (
        <ActionModal
          action={activeAction}
          student={selectedStudent}
          onClose={() => setActiveAction(null)}
        />
      )}

      {rescheduleBooking && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 border-4 border-[#e3e2e2] shadow-xl transform scale-100 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-heading text-[#1a1c1c] flex items-center gap-2">
                <CalendarDays className="w-6 h-6 text-[#006590]" /> Ganti
                Tanggal
              </h3>
              <button
                onClick={() => setRescheduleBooking(null)}
                className="p-2 hover:bg-[#f4f3f3] rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-[#6e7881]" />
              </button>
            </div>

            <p className="text-[#3e4850] mb-4">
              Pilihkan tanggal dan waktu baru untuk sesi konseling ini. Format
              yang disarankan: YYYY-MM-DD HH:MM (contoh: 2026-06-15 13:00).
            </p>

            <input
              type="text"
              value={newSlotInput}
              onChange={(e) => setNewSlotInput(e.target.value)}
              className="w-full bg-[#f4f3f3] border-2 border-[#e3e2e2] rounded-xl px-4 py-3 text-[#1a1c1c] font-bold focus:outline-none focus:border-[#006590] mb-6"
              placeholder="2026-06-15 13:00"
            />

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setRescheduleBooking(null)}
                className="px-6 py-3 rounded-xl border-2 border-[#dadada] text-[#3e4850] font-bold hover:bg-[#f4f3f3] transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  if (
                    newSlotInput &&
                    newSlotInput !== rescheduleBooking.currentSlot
                  ) {
                    updateBookingStatus(
                      rescheduleBooking.id,
                      "confirmed",
                      newSlotInput,
                    );
                  }
                  setRescheduleBooking(null);
                }}
                className="px-6 py-3 rounded-xl bg-[#51bd00] text-white font-bold border-2 border-[#2b6c00] border-b-4 hover:bg-[#3e9e00] transition-all active:border-b-2 active:translate-y-[2px]"
              >
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}

      <ChatBubble
        currentUserRole="konselor"
        currentUserId="rani"
        currentUserName="Rani Wulandari, M.Psi."
      />
    </div>
  );
}

// StudentDetailPanelTactile moved to components/StudentDetailPanelTactile.tsx

// ActionModal moved to components/ActionModal.tsx
