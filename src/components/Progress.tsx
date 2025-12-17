import React, { useState, useRef, useEffect } from "react";
import {
  Calendar,
  Plus,
  X,
  Scale,
  ArrowDown,
  History,
  Share2,
  Save,
  UploadCloud,
  Trash2,
  Activity,
  Target,
  BarChart3,
  ScanLine,
  Ruler,
} from "lucide-react";
import { useUI } from "../context/UIContext";

const formatDateForInput = (date: Date) => date.toISOString().split("T")[0];
const formatDateForDisplay = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
};

const RoboticLineChart = ({ data }: { data: any[] }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const height = 220;
  const width = 600;
  const paddingX = 30;
  const paddingY = 20;

  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      pathRef.current.style.strokeDasharray = `${length} ${length}`;
      pathRef.current.style.strokeDashoffset = `${length}`;
      pathRef.current.getBoundingClientRect();
      pathRef.current.style.transition = "stroke-dashoffset 1.5s ease-in-out";
      pathRef.current.style.strokeDashoffset = "0";
    }
  }, [data]);

  if (data.length < 2)
    return (
      <div className="h-full flex items-center justify-center text-slate-500 font-mono text-sm transition-colors duration-500">
        NO DATA POINTS DETECTED
      </div>
    );

  const weights = data.map((d) => d.weight);
  const minWeight = Math.min(...weights) - 1.5;
  const maxWeight = Math.max(...weights) + 1.5;
  const chartHeight = height - paddingY * 2;
  const chartWidth = width - paddingX * 2;

  const getY = (w: number) =>
    height -
    paddingY -
    ((w - minWeight) / (maxWeight - minWeight)) * chartHeight;
  const getX = (index: number) =>
    paddingX + (index / (data.length - 1)) * chartWidth;

  const pathData = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d.weight)}`)
    .join(" ");
  const areaPathData = `${pathData} L ${getX(
    data.length - 1
  )} ${height} L ${getX(0)} ${height} Z`;

  return (
    <div
      className="w-full h-full overflow-visible relative group"
      ref={chartRef}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-30 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:20px_20px] animate-pulse-slow transition-opacity duration-500"></div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full overflow-visible"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="chartGradientCyan" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={areaPathData}
          fill="url(#chartGradientCyan)"
          className="opacity-0 animate-fade-in delay-700 forwards"
          style={{ animationFillMode: "forwards" }}
        />
        <path
          ref={pathRef}
          d={pathData}
          fill="none"
          stroke="#06b6d4"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="drop-shadow-[0_0_8px_rgba(6,182,212,0.5)] transition-all duration-500"
        />

        {data.map((d, i) => {
          const cx = getX(i);
          const cy = getY(d.weight);
          const isHovered = hoveredIndex === i;
          return (
            <g
              key={i}
              className="opacity-0 animate-fade-in delay-1000 forwards"
              style={{
                animationFillMode: "forwards",
                animationDelay: `${1000 + i * 100}ms`,
              }}
            >
              <circle
                cx={cx}
                cy={cy}
                r="15"
                fill="transparent"
                onMouseEnter={() => setHoveredIndex(i)}
                className="cursor-pointer"
              />
              <circle
                cx={cx}
                cy={cy}
                r={isHovered ? "6" : "4"}
                fill="var(--bg-card)"
                stroke="#06b6d4"
                strokeWidth={isHovered ? "3" : "2"}
                className="transition-all duration-500 ease-in-out pointer-events-none fill-slate-50 dark:fill-slate-900"
              />
            </g>
          );
        })}
      </svg>

      {hoveredIndex !== null && (
        <div
          className="absolute z-20 bg-white dark:bg-slate-900 border border-cyan-200 dark:border-cyan-500/50 text-slate-800 dark:text-white p-3 rounded-xl shadow-lg shadow-cyan-100 dark:shadow-[0_0_15px_rgba(6,182,212,0.3)] pointer-events-none transition-all duration-200 animate-fade-in-up"
          style={{
            left: `${(getX(hoveredIndex) / width) * 100}%`,
            top: `${(getY(data[hoveredIndex].weight) / height) * 100}%`,
            transform: "translate(-50%, -130%)",
          }}
        >
          <p className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 mb-1 uppercase tracking-wider transition-colors duration-500">
            {formatDateForDisplay(data[hoveredIndex].date)}
          </p>
          <p className="text-lg font-black flex items-center gap-1 font-mono transition-colors duration-500">
            {data[hoveredIndex].weight}{" "}
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400 transition-colors duration-500">
              kg
            </span>
          </p>
          {data[hoveredIndex].notes && (
            <p className="text-xs text-slate-500 dark:text-slate-300 mt-1 italic border-t border-slate-100 dark:border-white/10 pt-1 transition-colors duration-500">
              "{data[hoveredIndex].notes}"
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const Progress: React.FC = () => {
  const { t } = useUI();
  const [history, setHistory] = useState<any[]>([]);
  const [measurements] = useState<any[]>([]);

  const [photos, setPhotos] = useState<{
    before: string | null;
    after: string | null;
  }>({ before: null, after: null });
  const [showLogModal, setShowLogModal] = useState(false);
  const [logForm, setLogForm] = useState({
    date: formatDateForInput(new Date()),
    weight: "",
    notes: "",
  });
  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);

  const sortedHistory = [...history].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const startWeight = sortedHistory.length > 0 ? sortedHistory[0].weight : 0;
  const currentWeight =
    sortedHistory.length > 0
      ? sortedHistory[sortedHistory.length - 1].weight
      : 0;
  const totalLoss = (startWeight - currentWeight).toFixed(1);
  const progressPercent =
    startWeight > 0 ? ((startWeight - currentWeight) / startWeight) * 100 : 0;

  const handleSaveLog = () => {
    if (!logForm.weight || !logForm.date) {
      alert("Data incomplete.");
      return;
    }
    const newEntry = {
      date: logForm.date,
      weight: parseFloat(logForm.weight),
      notes: logForm.notes,
    };
    setHistory((prev) =>
      [...prev, newEntry].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )
    );
    setShowLogModal(false);
    setLogForm({ date: formatDateForInput(new Date()), weight: "", notes: "" });
  };

  const handlePhotoUpload = (
    type: "before" | "after",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Max size 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () =>
        setPhotos((prev) => ({ ...prev, [type]: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const deletePhoto = (type: "before" | "after") => {
    if (window.confirm(`Delete ${type} photo?`))
      setPhotos((prev) => ({ ...prev, [type]: null }));
  };

  return (
    <div className="w-full max-w-[1800px] mx-auto px-6 lg:px-10 pb-20 relative overflow-hidden transition-colors duration-500 ease-in-out">
      <div className="absolute inset-0 -z-10 h-full w-full bg-slate-50 dark:bg-transparent bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none transition-all duration-500 ease-in-out animate-pulse-slow"></div>

      <style>{`
        .animate-pulse-slow { animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        .hover-scan { position: relative; overflow: hidden; }
        .hover-scan::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(to right, transparent, rgba(15, 23, 42, 0.05), transparent);
          transform: skewX(-25deg);
          transition: 0.7s;
          pointer-events: none;
          z-index: 20;
        }
        .dark .hover-scan::before {
           background: linear-gradient(to right, transparent, rgba(6, 182, 212, 0.2), transparent);
        }
        .hover-scan:hover::before { left: 150%; }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
        .forwards { animation-fill-mode: forwards; }
      `}</style>

      <div className="animate-enter transform-gpu">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 pt-4 gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3 transition-colors duration-500 ease-in-out">
              <div className="relative p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-cyan-500/30 shadow-sm dark:shadow-none transition-all duration-500 hover:scale-105 group overflow-hidden">
                <div className="absolute inset-0 bg-blue-50 dark:bg-blue-500/10 animate-pulse transition-colors duration-500"></div>
                <Activity className="w-8 h-8 text-blue-600 dark:text-blue-400 relative z-10 transition-colors duration-500" />
              </div>
              {t("progress.title")}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 ml-1 flex items-center gap-2 transition-colors duration-500">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              {t("progress.subtitle")}
            </p>
          </div>

          <button
            onClick={() => setShowLogModal(true)}
            className="group relative px-5 py-3 bg-slate-900 dark:bg-cyan-600 text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-500/30 hover:-translate-y-1 transition-all duration-500 flex items-center gap-2 overflow-hidden font-mono"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <Plus className="w-5 h-5 relative z-10" />
            <span className="relative z-10">{t("progress.log_btn")}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/80 backdrop-blur shadow-md dark:shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden hover-scan">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-cyan-100 dark:bg-cyan-500/10 rounded-full blur-2xl group-hover:scale-150 transition-all duration-500 opacity-70 dark:opacity-100"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1 transition-colors duration-500">
                  {t("progress.current_weight")}
                </p>
                <h3 className="text-4xl font-black text-slate-900 dark:text-white font-mono transition-colors duration-500">
                  {currentWeight}{" "}
                  <span className="text-lg text-slate-400 font-medium">kg</span>
                </h3>
              </div>
              <div className="p-3 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 rounded-xl border border-cyan-100 dark:border-cyan-500/20 group-hover:rotate-12 transition-all duration-500">
                <Scale className="w-6 h-6" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-emerald-400 bg-slate-100 dark:bg-emerald-900/20 px-3 py-1.5 rounded-lg w-fit border border-slate-200 dark:border-emerald-500/20 transition-all duration-500">
              <ArrowDown className="w-3 h-3 animate-bounce text-emerald-500" />{" "}
              {t("progress.total_loss")} {totalLoss} kg
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/80 backdrop-blur shadow-md dark:shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden hover-scan">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-100 dark:bg-emerald-500/10 rounded-full blur-2xl group-hover:scale-150 transition-all duration-500 opacity-70 dark:opacity-100"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1 transition-colors duration-500">
                  {t("progress.achievement")}
                </p>
                <h3 className="text-4xl font-black text-slate-900 dark:text-white font-mono transition-colors duration-500">
                  {progressPercent.toFixed(1)}{" "}
                  <span className="text-lg text-slate-400 font-medium">%</span>
                </h3>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-100 dark:border-emerald-500/20 group-hover:rotate-12 transition-all duration-500">
                <Target className="w-6 h-6" />
              </div>
            </div>
            <div className="w-full bg-slate-100 dark:bg-white/10 h-2 rounded-full overflow-hidden border border-slate-100 dark:border-transparent transition-colors duration-500">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-1000 shadow-[0_0_10px_#10b981] relative overflow-hidden"
                style={{ width: `${Math.min(100, progressPercent * 5)}%` }}
              >
                <div className="absolute inset-0 bg-white/30 animate-[shine_2s_infinite]"></div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-slate-900/80 backdrop-blur shadow-md dark:shadow-sm hover:shadow-xl transition-all duration-500 ease-in-out group relative overflow-hidden hover-scan">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-orange-100 dark:bg-orange-500/10 rounded-full blur-2xl group-hover:scale-150 transition-all duration-500 opacity-70 dark:opacity-100"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1 transition-colors duration-500">
                  {t("progress.total_entries")}
                </p>
                <h3 className="text-4xl font-black text-slate-900 dark:text-white font-mono transition-colors duration-500">
                  {history.length}{" "}
                  <span className="text-lg text-slate-400 font-medium">x</span>
                </h3>
              </div>
              <div className="p-3 bg-orange-50 dark:bg-orange-100/10 text-orange-600 dark:text-orange-400 rounded-xl border border-orange-100 dark:border-orange-500/20 group-hover:rotate-12 transition-all duration-500">
                <History className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium transition-colors duration-500">
              Konsistensi adalah kunci!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-panel p-6 md:p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 shadow-lg dark:shadow-sm relative overflow-hidden group hover-scan transition-all duration-500">
              <div className="flex justify-between items-center mb-8 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 transition-colors duration-500">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white transition-colors duration-500">
                      {t("progress.chart.weight")}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors duration-500">
                      Visualisasi data biometrik.
                    </p>
                  </div>
                </div>
              </div>
              <div className="h-72 w-full relative z-10">
                <RoboticLineChart data={sortedHistory} />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4 px-2">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 transition-colors duration-500">
                  <Ruler className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white transition-colors duration-500">
                  {t("progress.chart.measurements")}
                </h3>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {measurements.length > 0 ? (
                measurements.map((m, idx) => (
                  <div
                    key={idx}
                    className={`bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-white/5 shadow-md dark:shadow-sm flex flex-col justify-between hover:border-slate-300 dark:hover:border-white/10 transition-all duration-500 group hover:-translate-y-1 hover-scan`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <div
                          className={`hidden dark:block w-1 h-8 rounded-full ${m.barColor} transition-colors duration-500`}
                        ></div>
                        <div>
                          <span className="font-bold text-slate-700 dark:text-slate-200 block text-sm transition-colors duration-500">
                            {m.part}
                          </span>
                          <span className="text-[10px] text-slate-400 transition-colors duration-500">
                            Start: {m.start} {m.unit}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-end gap-2 mt-3 pl-1 dark:pl-4 transition-all duration-500">
                      <span
                        className={`text-3xl font-black ${m.color} font-mono transition-colors duration-500`}
                      >
                        {m.current}
                      </span>
                      <span className="text-xs text-slate-500 font-bold mb-1 transition-colors duration-500">
                        {m.unit}
                      </span>
                      {m.start - m.current > 0 && (
                        <span className="ml-auto text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded flex items-center border border-emerald-100 dark:border-emerald-500/20 transition-all duration-500">
                          <ArrowDown className="w-3 h-3 mr-0.5" />{" "}
                          {m.start - m.current}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-10 text-center text-slate-400 text-sm font-mono border-2 border-dashed border-slate-200 dark:border-white/5 rounded-2xl">
                  NO MEASUREMENT DATA
                </div>
              )}
            </div>
          </div>

          <div className="space-y-8">
            <div className="glass-panel p-6 rounded-[2.5rem] border border-slate-800 bg-slate-900 text-white shadow-xl relative overflow-hidden group hover-scan transition-all duration-500">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/30 via-transparent to-transparent opacity-50 transition-opacity duration-500"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-125 transition-transform duration-700"></div>

              <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg flex items-center gap-2 text-white transition-colors duration-500">
                    <ScanLine className="w-5 h-5 text-cyan-400 animate-pulse" />{" "}
                    Transformasi
                  </h3>
                  <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-cyan-200 font-medium border border-white/10 font-mono tracking-wider transition-colors duration-500">
                    VISUAL DATA
                  </span>
                </div>

                <div className="flex gap-3 h-48">
                  <div
                    onClick={() =>
                      !photos.before && beforeInputRef.current?.click()
                    }
                    className={`flex-1 relative rounded-2xl overflow-hidden border-2 ${
                      photos.before
                        ? "border-transparent"
                        : "border-dashed border-white/20 hover:bg-white/5 hover:border-cyan-400/50"
                    } transition-all duration-500 cursor-pointer group/photo`}
                  >
                    {photos.before ? (
                      <>
                        <img
                          src={photos.before}
                          alt="Before"
                          className="w-full h-full object-cover group-hover/photo:scale-110 transition-transform duration-500"
                        />
                        <span className="absolute top-2 left-2 bg-black/60 backdrop-blur px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-white">
                          Before
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deletePhoto("before");
                          }}
                          className="absolute top-2 right-2 p-1.5 bg-red-500/80 rounded-full opacity-0 group-hover/photo:opacity-100 hover:bg-red-600 transition-all"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-slate-400 group-hover/photo:text-cyan-400 transition-colors duration-500">
                        <UploadCloud className="w-8 h-8 mb-2 opacity-50 group-hover/photo:scale-110 transition-transform" />
                        <span className="text-xs font-bold font-mono">
                          {t("progress.upload.before")}
                        </span>
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

                  <div
                    onClick={() =>
                      !photos.after && afterInputRef.current?.click()
                    }
                    className={`flex-1 relative rounded-2xl overflow-hidden border-2 ${
                      photos.after
                        ? "border-transparent"
                        : "border-dashed border-white/20 hover:bg-white/5 hover:border-emerald-400/50"
                    } transition-all duration-500 cursor-pointer group/photo`}
                  >
                    {photos.after ? (
                      <>
                        <img
                          src={photos.after}
                          alt="After"
                          className="w-full h-full object-cover group-hover/photo:scale-110 transition-transform duration-500"
                        />
                        <span className="absolute top-2 left-2 bg-emerald-600/80 backdrop-blur px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-white">
                          Now
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deletePhoto("after");
                          }}
                          className="absolute top-2 right-2 p-1.5 bg-red-500/80 rounded-full opacity-0 group-hover/photo:opacity-100 hover:bg-red-600 transition-all"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-slate-400 group-hover/photo:text-emerald-400 transition-colors duration-500">
                        <UploadCloud className="w-8 h-8 mb-2 opacity-50 group-hover/photo:scale-110 transition-transform" />
                        <span className="text-xs font-bold font-mono">
                          {t("progress.upload.after")}
                        </span>
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

                <button className="w-full mt-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all duration-500 shadow-lg shadow-cyan-500/20 hover:-translate-y-1 group/btn overflow-hidden relative font-mono">
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                  <Share2 className="w-4 h-4 relative z-10" />{" "}
                  <span className="relative z-10">{t("progress.share")}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {showLogModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fade-in-up font-mono transition-all duration-500">
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] w-full max-w-md p-8 shadow-2xl relative border border-slate-200 dark:border-cyan-500/30 overflow-hidden transition-all duration-500">
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,transparent,rgba(6,182,212,0.05),transparent)] bg-[size:100%_3px] animate-scan"></div>

              <button
                onClick={() => setShowLogModal(false)}
                className="absolute top-5 right-5 p-2 text-slate-400 hover:text-red-500 transition-colors duration-300 z-10"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-3 mb-2 relative z-10">
                <div className="p-3 bg-cyan-100 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 rounded-2xl border border-cyan-200 dark:border-cyan-500/30 transition-all duration-500">
                  <Scale className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight transition-colors duration-500">
                  {t("progress.modal.title")}
                </h3>
              </div>
              <p className="text-slate-500 dark:text-slate-400 mb-8 ml-1 text-sm relative z-10 transition-colors duration-500">
                Update parameter data terbaru.
              </p>

              <div className="space-y-6 relative z-10">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1 transition-colors duration-500">
                    {t("progress.modal.date")}
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={logForm.date}
                      onChange={(e) =>
                        setLogForm({ ...logForm, date: e.target.value })
                      }
                      className="w-full p-4 pl-12 bg-slate-50 dark:bg-slate-800 rounded-2xl font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all duration-500 border border-slate-200 dark:border-white/5"
                      max={formatDateForInput(new Date())}
                    />
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1 transition-colors duration-500">
                    {t("progress.modal.weight")}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={logForm.weight}
                      onChange={(e) =>
                        setLogForm({ ...logForm, weight: e.target.value })
                      }
                      placeholder="0.0"
                      className="w-full p-4 pl-12 bg-slate-50 dark:bg-slate-800 rounded-2xl font-black text-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all duration-500 border border-slate-200 dark:border-white/5 placeholder:text-slate-600"
                      step="0.1"
                      autoFocus
                    />
                    <Scale className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1 transition-colors duration-500">
                    {t("progress.modal.notes")}
                  </label>
                  <textarea
                    value={logForm.notes}
                    onChange={(e) =>
                      setLogForm({ ...logForm, notes: e.target.value })
                    }
                    placeholder="Kondisi fisik, energi, dll..."
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all duration-500 resize-none h-24 border border-slate-200 dark:border-white/5 text-sm"
                  ></textarea>
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setShowLogModal(false)}
                    className="flex-1 py-4 text-slate-600 dark:text-slate-400 font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl transition-colors duration-500 text-sm"
                  >
                    {t("progress.modal.cancel")}
                  </button>
                  <button
                    onClick={handleSaveLog}
                    className="flex-1 py-4 text-white font-bold bg-cyan-600 hover:bg-cyan-500 rounded-2xl shadow-lg shadow-cyan-500/30 transition-all duration-500 flex items-center justify-center gap-2 hover:-translate-y-1 text-sm group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <Save className="w-4 h-4 relative z-10" />{" "}
                    <span className="relative z-10">
                      {t("progress.modal.save")}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Progress;
