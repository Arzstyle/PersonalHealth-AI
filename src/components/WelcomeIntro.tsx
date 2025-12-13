import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Cpu,
  Activity,
  BarChart3,
  Lock,
  CheckCircle,
  ScanFace,
} from "lucide-react";
import { useUI } from "../context/UIContext"; // Import Context

// --- BACKGROUND DIGITAL GRID (Tetap Sama) ---
const DigitalGridBackground = () => (
  <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#050b14] transition-colors duration-500">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
    <div className="absolute inset-0 bg-gradient-to-t from-[#050b14] via-transparent to-[#050b14]"></div>
    <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[150px] mix-blend-screen animate-pulse"></div>
    <div
      className="absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] mix-blend-screen animate-pulse"
      style={{ animationDelay: "2s" }}
    ></div>
  </div>
);

// --- KOMPONEN VISUAL (Tetap Sama) ---
const VisualAIAnalysis = () => (
  <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
    <div className="absolute inset-0 border-2 border-primary-500/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
    <div className="absolute inset-4 border border-dashed border-primary-400/50 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
    <div className="relative z-10 w-24 h-24 bg-gray-900 rounded-full border border-primary-500 flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.4)]">
      <ScanFace className="w-10 h-10 text-primary-400 animate-pulse" />
    </div>
    <div className="absolute top-0 w-full h-1 bg-primary-500 shadow-[0_0_15px_#22c55e] animate-[scan_2s_ease-in-out_infinite] opacity-50"></div>
  </div>
);

const VisualAdaptivePlan = () => (
  <div className="relative w-full max-w-[200px] mx-auto perspective-1000">
    <div className="absolute top-0 left-4 w-full h-24 bg-gray-800/50 border border-gray-600 rounded-lg transform rotate-6 scale-90"></div>
    <div className="absolute top-2 left-2 w-full h-24 bg-gray-800/80 border border-gray-500 rounded-lg transform rotate-3 scale-95"></div>
    <div className="relative w-full h-24 bg-gray-900 border border-blue-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)]">
      <div className="flex items-center gap-3">
        <Activity className="w-6 h-6 text-blue-400" />
        <div className="text-left">
          <div className="h-2 w-16 bg-blue-500/50 rounded mb-1"></div>
          <div className="h-1.5 w-10 bg-gray-600 rounded"></div>
        </div>
      </div>
    </div>
  </div>
);

const VisualMetrics = () => (
  <div className="relative w-full max-w-[220px] mx-auto h-32 flex items-end justify-between gap-2 px-4 border-b border-gray-700">
    {[30, 50, 40, 70, 55, 85, 60].map((h, i) => (
      <div
        key={i}
        className="w-full bg-gray-800 rounded-t-sm relative overflow-hidden group"
      >
        <div
          className="absolute bottom-0 w-full bg-gradient-to-t from-purple-900 to-purple-400 transition-all duration-1000"
          style={{
            height: `${h}%`,
            animation: `growBar 1s ease-out ${i * 0.1}s forwards`,
          }}
        ></div>
      </div>
    ))}
    <div className="absolute top-0 right-0 p-1 bg-gray-800 rounded border border-gray-600">
      <BarChart3 className="w-4 h-4 text-purple-400" />
    </div>
  </div>
);

const WelcomeIntro: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useUI(); // Menggunakan hook t() untuk translate

  const [currentSlide, setCurrentSlide] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // DATA SLIDES (Sekarang menggunakan t() untuk teks dinamis)
  const slides = [
    {
      id: 1,
      title: t("welcome.slide1.title"),
      desc: t("welcome.slide1.desc"),
      icon: Cpu,
      color: "text-primary-500",
      visual: <VisualAIAnalysis />,
    },
    {
      id: 2,
      title: t("welcome.slide2.title"),
      desc: t("welcome.slide2.desc"),
      icon: Activity,
      color: "text-blue-500",
      visual: <VisualAdaptivePlan />,
    },
    {
      id: 3,
      title: t("welcome.slide3.title"),
      desc: t("welcome.slide3.desc"),
      icon: BarChart3,
      color: "text-purple-500",
      visual: <VisualMetrics />,
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      setShowLoginModal(true);
    }
  };

  const handleLoginRedirect = () => {
    navigate("/onboarding");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden font-sans text-gray-100">
      <style>{`
        .glass-card {
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
        }
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes growBar {
          from { height: 0; }
        }
      `}</style>

      <DigitalGridBackground />

      {/* --- MAIN CARD (PREVIEW TOUR) --- */}
      <div
        className={`relative z-10 w-full max-w-md p-1 transition-all duration-500 ${
          showLoginModal ? "blur-sm scale-95 opacity-50" : "opacity-100"
        }`}
      >
        <div className="glass-card rounded-3xl overflow-hidden relative">
          {/* Header Progress */}
          <div className="flex gap-1 p-6 pb-0">
            {slides.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                  idx <= currentSlide ? "bg-white" : "bg-gray-700"
                }`}
              ></div>
            ))}
          </div>

          {/* Slide Content */}
          <div className="p-8 text-center min-h-[400px] flex flex-col justify-center">
            {/* Dynamic Visual Area */}
            <div className="mb-8 h-48 flex items-center justify-center">
              {slides[currentSlide].visual}
            </div>

            {/* Text Content */}
            <div className="animate-fade-in" key={currentSlide}>
              <div
                className={`inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-gray-800/50 border border-gray-700 mx-auto`}
              >
                {React.createElement(slides[currentSlide].icon, {
                  className: `w-4 h-4 ${slides[currentSlide].color}`,
                })}
                {/* Menggunakan t() untuk label Feature */}
                <span
                  className={`text-xs font-bold uppercase tracking-widest ${slides[currentSlide].color}`}
                >
                  {t("welcome.feature")} 0{slides[currentSlide].id}
                </span>
              </div>

              <h2 className="text-3xl font-display font-black uppercase mb-4 tracking-tight">
                {slides[currentSlide].title}
              </h2>

              <p className="text-gray-400 font-light leading-relaxed">
                {slides[currentSlide].desc}
              </p>
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-6 border-t border-gray-800 bg-black/20">
            <button
              onClick={handleNext}
              className="w-full flex items-center justify-center gap-2 py-4 bg-white text-black font-display font-bold uppercase tracking-wider rounded-sm hover:bg-gray-200 transition-colors"
              style={{
                clipPath:
                  "polygon(5% 0, 100% 0, 100% 80%, 95% 100%, 0 100%, 0 20%)",
              }}
            >
              {/* Menggunakan t() untuk tombol */}
              {currentSlide === slides.length - 1
                ? t("welcome.btn.init")
                : t("welcome.btn.next")}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* --- POP-UP MODAL (LOGIN SUGGESTION) --- */}
      {showLoginModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"></div>

          {/* Modal Card */}
          <div className="relative z-60 glass-card max-w-sm w-full p-8 rounded-2xl text-center border border-primary-500/30 shadow-[0_0_50px_rgba(34,197,94,0.2)] animate-[slideUp_0.3s_ease-out_forwards]">
            <div className="w-16 h-16 bg-primary-900/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary-500/50">
              <Lock className="w-8 h-8 text-primary-400" />
            </div>

            {/* Menggunakan t() untuk modal title */}
            <h3 className="text-2xl font-display font-bold text-white mb-2 uppercase">
              {t("welcome.modal.title")}
            </h3>

            {/* Menggunakan t() untuk modal desc */}
            <p className="text-gray-400 mb-8 text-sm leading-relaxed">
              {t("welcome.modal.desc")}
            </p>

            <div className="space-y-3">
              <button
                onClick={handleLoginRedirect}
                className="w-full py-3 bg-primary-500 hover:bg-primary-400 text-black font-bold uppercase tracking-widest rounded transition-all shadow-[0_0_20px_rgba(34,197,94,0.4)]"
              >
                {/* Menggunakan t() untuk tombol login */}
                {t("welcome.modal.btn")}
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest mt-4">
                <CheckCircle className="w-3 h-3 text-primary-500" />
                {/* Menggunakan t() untuk secure text */}
                <span>{t("welcome.modal.secure")}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomeIntro;
