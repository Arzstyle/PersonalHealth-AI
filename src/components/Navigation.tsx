import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Utensils,
  Dumbbell,
  User,
  PieChart,
  Sun,
  Moon,
  Globe,
  Activity,
  Cpu,
  Search,
} from "lucide-react";
import { useUI } from "../context/UIContext";

interface NavigationProps {
  showLinks?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ showLinks = true }) => {
  const { theme, toggleTheme, language, setLanguage } = useUI();

  const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Hub" },
    { to: "/meals", icon: Utensils, label: "Nutrition" },
    { to: "/food-search", icon: Search, label: "Search" },
    { to: "/exercises", icon: Dumbbell, label: "Training" },
    { to: "/progress", icon: PieChart, label: "Analytics" },
    { to: "/profile", icon: User, label: "Identity" },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-20 transition-all duration-700 ease-in-out transform-gpu select-none">
      <style>{`
        @keyframes orbit-3d-1 { 0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); } 100% { transform: rotateX(360deg) rotateY(180deg) rotateZ(360deg); } }
        @keyframes orbit-3d-2 { 0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); } 100% { transform: rotateX(-360deg) rotateY(360deg) rotateZ(-180deg); } }
        @keyframes orbit-3d-3 { 0% { transform: rotateX(60deg) rotateY(0deg) rotateZ(0deg); } 100% { transform: rotateX(60deg) rotateY(360deg) rotateZ(360deg); } }
        @keyframes core-pulse-super { 0%, 100% { transform: scale(1); filter: brightness(1); } 50% { transform: scale(1.08); filter: brightness(1.2); } }
        @keyframes plasma-shift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes digital-glitch { 0%, 100% { clip-path: inset(0 0 0 0); transform: translate(0); } 10% { clip-path: inset(10% 0 40% 0); transform: translate(-2px, 2px); } 20% { clip-path: inset(40% 0 10% 0); transform: translate(2px, -2px); } 30% { clip-path: inset(0 0 0 0); transform: translate(0); } }
        @keyframes scan-vertical { 0% { transform: translateY(-150%); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateY(150%); opacity: 0; } }
        @keyframes scan-horizontal { 0% { background-position: -100% 0; } 100% { background-position: 200% 0; } }
        @keyframes shine-move { 0% { left: -100%; opacity: 0; } 50% { opacity: 1; } 100% { left: 100%; opacity: 0; } }
        
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .animate-orbit-1 { animation: orbit-3d-1 12s linear infinite; }
        .animate-orbit-2 { animation: orbit-3d-2 18s linear infinite; }
        .animate-orbit-3 { animation: orbit-3d-3 10s linear infinite; }
        .animate-core-super { animation: core-pulse-super 2.5s ease-in-out infinite; }
        .animate-plasma { background: linear-gradient(45deg, rgba(6,182,212,0.4), rgba(6,182,212,0.1), rgba(6,182,212,0.4)); background-size: 200% 200%; animation: plasma-shift 4s ease infinite; }
        .group:hover .animate-glitch-hover { animation: digital-glitch 0.6s linear infinite; }
        .animate-scan-down { animation: scan-vertical 2s cubic-bezier(0.4, 0, 0.2, 1) infinite; background: linear-gradient(to bottom, transparent, rgba(6,182,212,0.8), transparent); }
        .animate-scan-laser { background: linear-gradient(90deg, transparent, #06b6d4, transparent); background-size: 50% 100%; background-repeat: no-repeat; animation: scan-horizontal 3s linear infinite; }
        .nav-item-shine { position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(to right, transparent, rgba(148, 163, 184, 0.4), transparent); transform: skewX(-25deg); animation: shine-move 2.5s infinite ease-in-out; }
        .dark .nav-item-shine { background: linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent); }
      `}</style>

      <div className="absolute inset-0 bg-slate-50/90 dark:bg-[#030712]/90 backdrop-blur-xl border-b border-slate-300 dark:border-white/5 shadow-lg shadow-slate-300/30 dark:shadow-cyan-900/5 transition-all duration-700"></div>

      <div className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden z-20">
        <div className="w-full h-full animate-scan-laser opacity-60 dark:opacity-100 transition-opacity duration-700"></div>
      </div>

      <div className="relative w-full h-full px-6 flex justify-between items-center mx-auto z-10">
        <NavLink
          to="/dashboard"
          className="flex items-center gap-5 cursor-pointer group btn-press no-underline relative pl-2 flex-shrink-0"
        >
          <div className="relative w-14 h-14 flex items-center justify-center perspective-1000">
            <div className="absolute inset-0 bg-cyan-400/20 dark:bg-cyan-400/10 rounded-full blur-xl animate-pulse-slow"></div>
            <div className="absolute inset-0 transform-style-3d">
              <div className="absolute inset-0 border-2 border-dashed border-slate-400 dark:border-cyan-500/20 rounded-full animate-orbit-1"></div>
              <div className="absolute inset-1 border border-dotted border-cyan-500/60 dark:border-cyan-400/30 rounded-full animate-orbit-2"></div>
              <div className="absolute inset-2 border-[1.5px] border-slate-300 dark:border-cyan-300/40 rounded-full animate-orbit-3"></div>
            </div>
            <div className="relative w-10 h-10 bg-gradient-to-br from-white to-slate-200 dark:from-slate-900 dark:to-slate-950 rounded-full flex items-center justify-center shadow-lg dark:shadow-[0_0_20px_rgba(6,182,212,0.4)] border border-slate-300 dark:border-cyan-500/50 overflow-hidden animate-core-super z-10">
              <div className="absolute inset-0 animate-plasma opacity-40 dark:opacity-30"></div>
              <div className="absolute inset-0 bg-cyan-500/20 mix-blend-multiply dark:mix-blend-overlay opacity-0 group-hover:opacity-100 animate-glitch-hover"></div>
              <Activity className="w-6 h-6 text-slate-700 dark:text-cyan-400 relative z-20 animate-pulse" />
              <div className="absolute inset-0 w-full h-1/2 bg-gradient-to-b from-transparent via-cyan-500/40 to-transparent z-30 animate-scan-down"></div>
            </div>
          </div>

          <div className="flex flex-col whitespace-nowrap">
            <span className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter leading-none group-hover:tracking-wide transition-all duration-500 relative">
              HEALTH
              <span className="text-cyan-600 dark:text-cyan-400 relative z-10">
                .AI
                <span className="absolute inset-0 blur-md bg-cyan-400/0 group-hover:bg-cyan-400/20 transition-all duration-500 -z-10"></span>
              </span>
            </span>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-[0.3em] group-hover:text-cyan-700 dark:group-hover:text-cyan-400 transition-colors duration-300 flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-blink shadow-[0_0_6px_#10b981]"></span>
              PERSONAL HEALTH AI
            </span>
          </div>
        </NavLink>

        {showLinks && (
          <nav className="hidden lg:flex items-center p-1.5 bg-slate-200/50 dark:bg-white/5 rounded-2xl border border-slate-300 dark:border-white/5 backdrop-blur-md shadow-inner transition-all duration-700">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `relative flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-500 group overflow-hidden whitespace-nowrap ${
                    isActive
                      ? "bg-white dark:bg-cyan-950/80 text-slate-900 dark:text-cyan-100 shadow-md scale-105 font-bold border border-slate-200 dark:border-cyan-500/30"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/10"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && <div className="nav-item-shine"></div>}
                    <item.icon
                      className={`w-4 h-4 relative z-10 transition-transform duration-500 ${
                        isActive
                          ? "scale-110 text-cyan-600 dark:text-cyan-400 fill-cyan-100/50 dark:fill-cyan-900/20"
                          : "group-hover:scale-110 group-hover:-rotate-12"
                      }`}
                    />
                    <span className="text-xs uppercase tracking-wide relative z-10 font-bold">
                      {item.label}
                    </span>
                    {isActive && (
                      <>
                        <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-cyan-600 dark:bg-cyan-400 rounded-full shadow-[0_0_5px_currentColor] animate-pulse"></span>
                        <span className="absolute top-1/2 right-2 w-0.5 h-3 bg-gradient-to-b from-transparent via-cyan-400/50 to-transparent opacity-50"></span>
                        <span className="absolute top-1/2 left-2 w-0.5 h-3 bg-gradient-to-b from-transparent via-cyan-400/50 to-transparent opacity-50"></span>
                      </>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3 pl-6 border-l border-slate-300 dark:border-white/10 flex-shrink-0">
          <button
            onClick={() => setLanguage(language === "en" ? "id" : "en")}
            className="group relative w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-all duration-500 border border-slate-300 dark:border-white/10 overflow-hidden shadow-sm hover:shadow-cyan-500/20 active:scale-95"
          >
            <div className="absolute inset-0 bg-blue-500/10 dark:bg-blue-400/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <Globe className="w-5 h-5 group-hover:rotate-180 transition-transform duration-700 ease-in-out relative z-10" />
          </button>

          <button
            onClick={toggleTheme}
            className="group relative w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 text-amber-500 dark:text-cyan-400 transition-all duration-500 border border-slate-300 dark:border-white/10 overflow-hidden shadow-sm hover:shadow-cyan-500/20 active:scale-95"
          >
            <div
              className={`absolute inset-0 transition-transform duration-500 ${
                theme === "light"
                  ? "bg-amber-500/10 translate-y-full group-hover:translate-y-0"
                  : "bg-cyan-500/10 translate-y-full group-hover:translate-y-0"
              }`}
            ></div>
            <div className="relative z-10">
              <Sun
                className={`w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
                  theme === "light"
                    ? "opacity-100 rotate-0 scale-100"
                    : "opacity-0 rotate-90 scale-0"
                }`}
              />
              <Moon
                className={`w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
                  theme === "dark"
                    ? "opacity-100 rotate-0 scale-100"
                    : "opacity-0 -rotate-90 scale-0"
                }`}
              />
            </div>
          </button>

          <div className="lg:hidden group cursor-pointer active:scale-95 transition-transform">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-900 dark:bg-slate-800 text-white shadow-lg border border-transparent group-hover:border-cyan-500/50 transition-all duration-300">
              <Cpu className="w-5 h-5 group-hover:text-cyan-400 transition-colors animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
