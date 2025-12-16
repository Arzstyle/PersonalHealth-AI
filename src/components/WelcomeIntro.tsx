import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Activity,
  Brain,
  Target,
  Zap,
  Shield,
  ChevronLeft,
} from "lucide-react";
import { useUI } from "../context/UIContext";

const WelcomeIntro: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useUI();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      icon: Brain,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      title: t("welcome.slide1.title"),
      desc: t("welcome.slide1.desc"),
      features: ["Biometric Scan", "Metabolic Baseline", "Neural Profiling"],
    },
    {
      id: 2,
      icon: Activity,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      title: t("welcome.slide2.title"),
      desc: t("welcome.slide2.desc"),
      features: [
        "Real-time Adjustments",
        "Progressive Overload",
        "Dynamic Nutrition",
      ],
    },
    {
      id: 3,
      icon: Target,
      color: "text-green-500",
      bg: "bg-green-500/10",
      title: t("welcome.slide3.title"),
      desc: t("welcome.slide3.desc"),
      features: ["Goal Tracking", "Data Visualization", "Milestone Rewards"],
    },
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      navigate("/onboarding");
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  return (
    
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] dark:bg-[#050b14] relative overflow-hidden font-sans transition-colors duration-500">
      {}
      {}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-100 dark:opacity-0 transition-opacity duration-700">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-purple-200/40 rounded-full blur-[120px] mix-blend-multiply"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-200/40 rounded-full blur-[120px] mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      {}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-700">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[150px] mix-blend-screen animate-pulse"></div>
        <div
          className="absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] mix-blend-screen animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl p-4 sm:p-6 h-full sm:h-auto flex items-center justify-center">
        {}
        <div className="bg-white/70 dark:bg-[#0a0f1e]/90 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-[2.5rem] p-6 sm:p-12 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.15)] dark:shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full relative overflow-hidden transition-all duration-300">
          {}
          <div className="flex justify-between items-center mb-8 sm:mb-12">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary-600 dark:text-primary-500 fill-primary-600/20 dark:fill-primary-500/20" />
              <span className="text-sm font-bold text-gray-900 dark:text-white tracking-widest uppercase font-display">
                System Intro
              </span>
            </div>
            <div className="flex gap-1">
              {[0, 1, 2].map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    idx === currentSlide
                      ? "w-8 bg-primary-600 dark:bg-primary-500"
                      : "w-2 bg-gray-300 dark:bg-gray-800"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden min-h-[400px] sm:min-h-[450px]">
            <div
              className="flex transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] h-full"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {slides.map((slide) => (
                <div
                  key={slide.id}
                  className="w-full flex-shrink-0 flex flex-col sm:flex-row items-center gap-8 sm:gap-16 px-4"
                >
                  {}
                  <div className="relative group flex-1 flex justify-center">
                    <div
                      className={`absolute inset-0 ${slide.bg} rounded-full blur-[60px] group-hover:blur-[80px] transition-all opacity-70 dark:opacity-100`}
                    ></div>
                    <div className="relative w-48 h-48 sm:w-64 sm:h-64 bg-white/80 dark:bg-[#0f172a] rounded-full border-[3px] border-white/50 dark:border-white/10 flex items-center justify-center shadow-xl dark:shadow-[0_0_30px_rgba(0,0,0,0.3)] group-hover:scale-105 transition-transform duration-500">
                      <div
                        className={`absolute inset-2 rounded-full border border-dashed ${slide.color} opacity-30 animate-[spin_20s_linear_infinite]`}
                      ></div>
                      <slide.icon
                        className={`w-20 h-20 sm:w-24 sm:h-24 ${slide.color} drop-shadow-[0_10px_10px_rgba(0,0,0,0.2)] dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]`}
                      />
                    </div>
                  </div>

                  {}
                  <div className="flex-1 text-center sm:text-left space-y-6">
                    <div>
                      <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white font-display tracking-tight mb-4 leading-tight">
                        {slide.title}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg leading-relaxed font-light">
                        {slide.desc}
                      </p>
                    </div>

                    {}
                    <div className="grid gap-3 pt-4">
                      {slide.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-3 rounded-xl bg-white/60 dark:bg-white/5 border border-white/60 dark:border-white/10 backdrop-blur-sm shadow-sm"
                        >
                          <Shield className={`w-5 h-5 ${slide.color}`} />
                          <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {}
          <div className="flex justify-between items-center mt-8 sm:mt-12 pt-6 border-t border-gray-200 dark:border-white/10">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                currentSlide === 0
                  ? "opacity-0 pointer-events-none"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Back</span>
            </button>

            <button
              onClick={nextSlide}
              className="group relative flex items-center gap-3 px-8 py-4 bg-gray-900 dark:bg-primary-600 text-white rounded-xl font-bold overflow-hidden transition-all hover:shadow-lg dark:hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:scale-105 active:scale-100"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-500"></div>
              <span className="relative uppercase tracking-wider text-sm">
                {currentSlide === slides.length - 1
                  ? t("welcome.btn.init")
                  : t("welcome.btn.next")}
              </span>
              <ChevronRight className="w-5 h-5 relative group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeIntro;
