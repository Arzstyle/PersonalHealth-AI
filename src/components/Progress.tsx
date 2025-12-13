import React, { useState, useRef } from "react";
import {
  TrendingUp,
  Calendar,
  Camera,
  Plus,
  X,
  Scale,
  ChevronDown,
  ArrowDown,
  History,
  Share2,
  Save,
  FileText,
  UploadCloud,
  Trash2,
} from "lucide-react";

// --- HELPER: Format Date untuk Input & Display ---
const formatDateForInput = (date: Date) => date.toISOString().split("T")[0];
const formatDateForDisplay = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
};

// --- MOCK DATA INITIAL ---
// Menggunakan format YYYY-MM-DD agar mudah disortir
const INITIAL_HISTORY = [
  { date: "2024-12-01", weight: 78.5, notes: "Awal program" },
  { date: "2024-12-05", weight: 77.8, notes: "" },
  { date: "2024-12-10", weight: 77.0, notes: "Mulai rutin cardio" },
  { date: "2024-12-15", weight: 76.2, notes: "" },
  { date: "2024-12-20", weight: 75.5, notes: "Merasa lebih ringan" },
];

const INITIAL_MEASUREMENTS = [
  {
    part: "Pinggang",
    current: 85,
    start: 90,
    unit: "cm",
    color: "bg-blue-500",
  },
  { part: "Dada", current: 98, start: 102, unit: "cm", color: "bg-purple-500" },
  {
    part: "Lengan",
    current: 32,
    start: 34,
    unit: "cm",
    color: "bg-orange-500",
  },
  { part: "Paha", current: 58, start: 60, unit: "cm", color: "bg-green-500" },
];

// --- COMPONENT: ADVANCED SVG CHART WITH TOOLTIP ---
const AdvancedLineChart = ({ data }: { data: typeof INITIAL_HISTORY }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  const height = 220;
  const width = 600;
  const paddingX = 30;
  const paddingY = 20;

  if (data.length < 2) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        Butuh minimal 2 data untuk grafik.
      </div>
    );
  }

  const weights = data.map((d) => d.weight);
  // Tambahkan padding dinamis ke min/max agar grafik tidak mepet atas/bawah
  const minWeight = Math.min(...weights) - 1.5;
  const maxWeight = Math.max(...weights) + 1.5;
  const chartHeight = height - paddingY * 2;
  const chartWidth = width - paddingX * 2;

  // Normalisasi koordinat Y
  const getY = (w: number) => {
    return (
      height -
      paddingY -
      ((w - minWeight) / (maxWeight - minWeight)) * chartHeight
    );
  };

  // Normalisasi koordinat X
  const getX = (index: number) => {
    return paddingX + (index / (data.length - 1)) * chartWidth;
  };

  // Buat Path Garis
  const pathData = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d.weight)}`)
    .join(" ");

  // Buat Area Gradient di bawah garis
  const areaPathData = `
    ${pathData} 
    L ${getX(data.length - 1)} ${height} 
    L ${getX(0)} ${height} 
    Z
  `;

  return (
    <div
      className="w-full h-full overflow-visible relative"
      ref={chartRef}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full overflow-visible"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="chartGradientOrange" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Area Fill */}
        <path d={areaPathData} fill="url(#chartGradientOrange)" />

        {/* Main Line */}
        <path
          d={pathData}
          fill="none"
          stroke="#f97316"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Interactive Dots */}
        {data.map((d, i) => {
          const cx = getX(i);
          const cy = getY(d.weight);
          const isHovered = hoveredIndex === i;

          return (
            <g key={i}>
              {/* Invisible larger circle for easier hovering */}
              <circle
                cx={cx}
                cy={cy}
                r="15"
                fill="transparent"
                onMouseEnter={() => setHoveredIndex(i)}
                className="cursor-pointer"
              />
              {/* Visible Dot */}
              <circle
                cx={cx}
                cy={cy}
                r={isHovered ? "6" : "4"}
                fill="white"
                stroke="#f97316"
                strokeWidth={isHovered ? "3" : "2"}
                className="transition-all duration-200 pointer-events-none"
              />
            </g>
          );
        })}
      </svg>

      {/* CUSTOM HTML TOOLTIP */}
      {hoveredIndex !== null && (
        <div
          className="absolute z-20 bg-gray-900 text-white p-3 rounded-xl shadow-xl pointer-events-none transition-all duration-200"
          style={{
            left: `${(getX(hoveredIndex) / width) * 100}%`,
            top: `${(getY(data[hoveredIndex].weight) / height) * 100}%`,
            transform: "translate(-50%, -130%)", // Posisikan di atas titik
          }}
        >
          <p className="text-xs font-medium text-gray-400 mb-1">
            {formatDateForDisplay(data[hoveredIndex].date)}
          </p>
          <p className="text-lg font-black flex items-center gap-1">
            {data[hoveredIndex].weight}{" "}
            <span className="text-xs font-normal">kg</span>
          </p>
          {data[hoveredIndex].notes && (
            <p className="text-xs text-gray-300 mt-1 italic border-t border-gray-700 pt-1">
              "{data[hoveredIndex].notes}"
            </p>
          )}
          {/* Arrow down */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-gray-900"></div>
        </div>
      )}

      {/* X-Axis Labels */}
      <div className="flex justify-between text-xs font-medium text-gray-400 mt-2 px-6">
        <span>{formatDateForDisplay(data[0].date)}</span>
        <span>
          {formatDateForDisplay(data[Math.floor(data.length / 2)].date)}
        </span>
        <span>{formatDateForDisplay(data[data.length - 1].date)}</span>
      </div>
    </div>
  );
};

const Progress: React.FC = () => {
  // State Utama
  const [history, setHistory] = useState(INITIAL_HISTORY);
  const [photos, setPhotos] = useState<{
    before: string | null;
    after: string | null;
  }>({ before: null, after: null });

  // State Modal Log
  const [showLogModal, setShowLogModal] = useState(false);
  const [logForm, setLogForm] = useState({
    date: formatDateForInput(new Date()),
    weight: "",
    notes: "",
  });

  // Refs untuk Input File Foto
  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);

  // --- LOGIC: Stats Hitungan ---
  // Sort history berdasarkan tanggal agar kalkulasi dan grafik benar
  const sortedHistory = [...history].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const startWeight = sortedHistory[0].weight;
  const currentWeight = sortedHistory[sortedHistory.length - 1].weight;
  const totalLoss = (startWeight - currentWeight).toFixed(1);
  const progressPercent = ((startWeight - currentWeight) / startWeight) * 100;

  // --- LOGIC: Handle Log Berat ---
  const handleSaveLog = () => {
    if (!logForm.weight || !logForm.date) {
      alert("Mohon isi tanggal dan berat badan.");
      return;
    }

    const newEntry = {
      date: logForm.date,
      weight: parseFloat(logForm.weight),
      notes: logForm.notes,
    };

    // Tambahkan data baru dan sort ulang history berdasarkan tanggal
    setHistory((prev) =>
      [...prev, newEntry].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )
    );

    // Reset dan tutup modal
    setShowLogModal(false);
    setLogForm({ date: formatDateForInput(new Date()), weight: "", notes: "" });
  };

  // --- LOGIC: Handle Photo Upload (Base64) ---
  const handlePhotoUpload = (
    type: "before" | "after",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validasi ukuran (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran foto terlalu besar! Maksimal 2MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos((prev) => ({ ...prev, [type]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const deletePhoto = (type: "before" | "after") => {
    if (window.confirm(`Hapus foto ${type}?`)) {
      setPhotos((prev) => ({ ...prev, [type]: null }));
    }
  };

  return (
    <div className="w-full px-6 md:px-12 pb-20 relative">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 pt-4 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
            <span className="p-2.5 bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-2xl shadow-lg shadow-orange-200">
              <TrendingUp className="w-8 h-8" />
            </span>
            Progress Tracker
          </h1>
          <p className="text-gray-500 mt-2 ml-1">
            Pantau transformasi tubuhmu dari waktu ke waktu.
          </p>
        </div>

        <button
          onClick={() => setShowLogModal(true)}
          className="px-5 py-3 bg-gray-900 text-white font-bold rounded-xl shadow-lg hover:bg-gray-800 hover:-translate-y-1 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>Catat Berat Baru</span>
        </button>
      </div>

      {/* --- TOP STATS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card 1: Current Weight */}
        <div className="bg-white/80 backdrop-blur p-6 rounded-3xl border border-white/60 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                Berat Saat Ini
              </p>
              <h3 className="text-4xl font-black text-gray-900">
                {currentWeight}{" "}
                <span className="text-lg text-gray-400 font-medium">kg</span>
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                per{" "}
                {formatDateForDisplay(
                  sortedHistory[sortedHistory.length - 1].date
                )}
              </p>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Scale className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm font-medium text-green-600 bg-green-50 px-3 py-1.5 rounded-lg w-fit">
            <ArrowDown className="w-4 h-4" />
            <span>Turun {totalLoss} kg total</span>
          </div>
        </div>

        {/* Card 2: Progress Percent */}
        <div className="bg-white/80 backdrop-blur p-6 rounded-3xl border border-white/60 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                Pencapaian
              </p>
              <h3 className="text-4xl font-black text-gray-900">
                {progressPercent.toFixed(1)}
                <span className="text-lg text-gray-400 font-medium">%</span>
              </h3>
            </div>
            <div className="p-3 bg-green-50 text-green-600 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(100, progressPercent * 5)}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Menuju target idealmu</p>
        </div>

        {/* Card 3: Streak / Entries */}
        <div className="bg-white/80 backdrop-blur p-6 rounded-3xl border border-white/60 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                Total Entri Log
              </p>
              <h3 className="text-4xl font-black text-gray-900">
                {history.length}{" "}
                <span className="text-lg text-gray-400 font-medium">kali</span>
              </h3>
            </div>
            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4 font-medium">
            Konsistensi adalah kunci!
          </p>
        </div>
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: CHART & MEASUREMENTS */}
        <div className="lg:col-span-2 space-y-8">
          {/* IMPROVED CHART SECTION */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="font-bold text-xl text-gray-800">
                  Grafik Berat Badan
                </h3>
                <p className="text-sm text-gray-500">
                  Tren penurunan berat badanmu.
                </p>
              </div>
              <select className="bg-gray-50 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl px-4 py-2 focus:outline-none hover:bg-gray-100 transition-colors cursor-pointer">
                <option>Semua Waktu</option>
                <option>30 Hari Terakhir</option>
              </select>
            </div>

            {/* Advanced Custom Chart Component */}
            <div className="h-72 w-full">
              <AdvancedLineChart data={sortedHistory} />
            </div>
          </div>

          {/* MEASUREMENTS GRID */}
          <div>
            <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
              Ukuran Tubuh (Cm)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {INITIAL_MEASUREMENTS.map((m, idx) => (
                <div
                  key={idx}
                  className="bg-white/70 backdrop-blur p-5 rounded-2xl border border-white/60 shadow-sm flex flex-col justify-between hover:border-blue-100 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2.5 h-10 rounded-full ${m.color} opacity-80`}
                      ></div>
                      <div>
                        <span className="font-bold text-gray-700 block">
                          {m.part}
                        </span>
                        <span className="text-xs text-gray-400">
                          Awal: {m.start}
                          {m.unit}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-end gap-2 mt-3 pl-5">
                    <span className="text-3xl font-black text-gray-900">
                      {m.current}
                    </span>
                    <span className="text-sm text-gray-500 font-bold mb-1">
                      {m.unit}
                    </span>

                    {m.start - m.current > 0 && (
                      <span className="ml-auto text-xs font-bold text-green-600 flex items-center bg-green-100 px-2.5 py-1 rounded-lg">
                        <ArrowDown className="w-3 h-3 mr-0.5" />
                        {m.start - m.current} cm
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PHOTO & HISTORY */}
        <div className="space-y-8">
          {/* FUNCTIONAL BEFORE / AFTER PHOTO CARD */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden group">
            {/* Background Blob */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-125 transition-transform duration-700"></div>

            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Camera className="w-6 h-6 text-orange-400" />
                  Transformation
                </h3>
                <span className="text-xs bg-white/10 px-3 py-1 rounded-full text-orange-200 font-medium">
                  Visual Progress
                </span>
              </div>

              <div className="flex gap-3 h-56 md:h-48 lg:h-56">
                {/* BEFORE PHOTO UPLOAD/DISPLAY */}
                <div
                  onClick={() =>
                    !photos.before && beforeInputRef.current?.click()
                  }
                  className={`flex-1 relative rounded-2xl overflow-hidden border-2 ${
                    photos.before
                      ? "border-transparent"
                      : "border-dashed border-white/20 hover:bg-white/10 hover:border-white/40"
                  } transition-all cursor-pointer group/photo`}
                >
                  {photos.before ? (
                    <>
                      <img
                        src={photos.before}
                        alt="Before"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 bg-black/60 backdrop-blur px-2 py-1 rounded-md text-xs font-bold">
                        Before
                      </span>
                      {/* Delete Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deletePhoto("before");
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-red-500/80 rounded-full opacity-0 group-hover/photo:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                      <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-3">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-bold text-gray-300">
                        Upload Before
                      </span>
                      <span className="text-xs opacity-60 mt-1">Max 2MB</span>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={beforeInputRef}
                    onChange={(e) => handlePhotoUpload("before", e)}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                {/* Arrow Connector */}
                <div className="flex items-center justify-center">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-orange-600 shadow-lg z-20 relative">
                    <ChevronDown className="w-5 h-5 -rotate-90" />
                    <div className="absolute inset-0 bg-orange-200 rounded-full animate-ping opacity-30"></div>
                  </div>
                </div>

                {/* AFTER PHOTO UPLOAD/DISPLAY */}
                <div
                  onClick={() =>
                    !photos.after && afterInputRef.current?.click()
                  }
                  className={`flex-1 relative rounded-2xl overflow-hidden border-2 ${
                    photos.after
                      ? "border-transparent"
                      : "border-dashed border-white/20 hover:bg-white/10 hover:border-white/40"
                  } transition-all cursor-pointer group/photo`}
                >
                  {photos.after ? (
                    <>
                      <img
                        src={photos.after}
                        alt="After"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 bg-green-500/80 backdrop-blur px-2 py-1 rounded-md text-xs font-bold">
                        Now
                      </span>
                      {/* Delete Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deletePhoto("after");
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-red-500/80 rounded-full opacity-0 group-hover/photo:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                      <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-3">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-bold text-gray-300">
                        Upload After
                      </span>
                      <span className="text-xs opacity-60 mt-1">Max 2MB</span>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={afterInputRef}
                    onChange={(e) => handlePhotoUpload("after", e)}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>

              <button className="w-full mt-6 py-3.5 bg-white text-gray-900 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors shadow-lg">
                <Share2 className="w-5 h-5" />
                Bagikan Pencapaian
              </button>
            </div>
          </div>

          {/* RECENT HISTORY LIST (Sorted Descending) */}
          <div className="bg-white/80 backdrop-blur-md border border-white/60 p-6 rounded-3xl shadow-sm max-h-[400px] overflow-y-auto custom-scrollbar">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 sticky top-0 bg-white/80 backdrop-blur py-2 z-10">
              <History className="w-5 h-5 text-gray-400" />
              Riwayat Log
            </h3>
            <div className="space-y-3">
              {[...sortedHistory].reverse().map((log, idx) => (
                <div
                  key={idx}
                  className="flex flex-col p-3 border border-gray-100 bg-white rounded-xl hover:border-orange-200 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {formatDateForDisplay(log.date)}
                    </span>
                    <span className="font-black text-lg text-gray-900">
                      {log.weight}{" "}
                      <span className="text-xs font-normal text-gray-500">
                        kg
                      </span>
                    </span>
                  </div>
                  {log.notes && (
                    <div className="mt-2 flex items-start gap-2 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                      <FileText className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <p className="italic">"{log.notes}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- COMPLEX LOG WEIGHT MODAL --- */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in-up">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl relative">
            <button
              onClick={() => setShowLogModal(false)}
              className="absolute top-5 right-5 p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-gray-900">Catat Berat</h3>
            </div>
            <p className="text-gray-500 mb-8 ml-1">
              Update progress terbarumu.
            </p>

            <div className="space-y-6">
              {/* Input Tanggal */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                  Tanggal
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={logForm.date}
                    onChange={(e) =>
                      setLogForm({ ...logForm, date: e.target.value })
                    }
                    className="w-full p-4 pl-12 bg-gray-50 rounded-2xl font-medium text-gray-800 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                    max={formatDateForInput(new Date())} // Tidak bisa pilih tanggal masa depan
                  />
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Input Berat */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                  Berat Badan (kg)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={logForm.weight}
                    onChange={(e) =>
                      setLogForm({ ...logForm, weight: e.target.value })
                    }
                    placeholder="Contoh: 75.5"
                    className="w-full p-4 pl-12 bg-gray-50 rounded-2xl font-black text-2xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all placeholder:text-gray-300"
                    step="0.1"
                    autoFocus
                  />
                  <Scale className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 pointer-events-none" />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg pointer-events-none">
                    kg
                  </span>
                </div>
              </div>

              {/* Input Catatan */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                  Catatan (Opsional)
                </label>
                <textarea
                  value={logForm.notes}
                  onChange={(e) =>
                    setLogForm({ ...logForm, notes: e.target.value })
                  }
                  placeholder="Contoh: Merasa lebih energik hari ini..."
                  className="w-full p-4 bg-gray-50 rounded-2xl font-medium text-gray-800 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all resize-none h-24"
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setShowLogModal(false)}
                  className="flex-1 py-4 text-gray-600 font-bold bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveLog}
                  className="flex-1 py-4 text-white font-bold bg-gray-900 hover:bg-gray-800 rounded-2xl shadow-xl shadow-gray-200 transition-all flex items-center justify-center gap-2 hover:-translate-y-1"
                >
                  <Save className="w-5 h-5" />
                  Simpan Log
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Progress;
