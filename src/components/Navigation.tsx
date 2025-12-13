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
} from "lucide-react";
import { useUI } from "../context/UIContext";

const Navigation: React.FC = () => {
  const { theme, toggleTheme, language, setLanguage } = useUI();

  const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Hub" },
    { to: "/meals", icon: Utensils, label: "Nutrition" },
    { to: "/exercises", icon: Dumbbell, label: "Training" },
    { to: "/progress", icon: PieChart, label: "Analytics" },
    { to: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-20 bg-white/80 dark:bg-[#030712]/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-white/5 transition-all duration-500 shadow-sm">
      <div className="w-full h-full px-6 lg:px-10 flex justify-between items-center max-w-[1920px] mx-auto">
        {/* LOGO AREA - Animated */}
        <div className="flex items-center gap-3 cursor-pointer group btn-press">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <div className="absolute inset-0 bg-emerald-500/30 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg border border-white/20 group-hover:rotate-12 transition-transform duration-500">
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
              HEALTH<span className="text-emerald-500">AI</span>
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:block group-hover:text-emerald-500 transition-colors">
              Personal Assistant
            </span>
          </div>
        </div>

        {/* CENTER MENU - Pill Style with Active Shine */}
        <nav className="hidden lg:flex items-center p-1.5 bg-slate-100/50 dark:bg-white/5 rounded-2xl border border-slate-200/50 dark:border-white/5 backdrop-blur-md">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `relative flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300 group overflow-hidden ${
                  isActive
                    ? "text-white bg-slate-900 dark:bg-emerald-600 shadow-md scale-105 font-bold"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={`w-4 h-4 relative z-10 transition-transform ${
                      isActive ? "scale-110" : "group-hover:scale-110"
                    }`}
                  />
                  <span className="text-xs uppercase tracking-wide relative z-10">
                    {item.label}
                  </span>

                  {/* Animation Shine Effect fix TypeScript Error */}
                  {isActive && (
                    <div className="absolute inset-0 -translate-x-full group-hover:animate-[shine_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* ACTIONS */}
        <div className="flex items-center gap-3 pl-6 border-l border-slate-200 dark:border-white/5">
          <button
            onClick={() => setLanguage(language === "en" ? "id" : "en")}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-all btn-press border border-transparent hover:border-slate-300 dark:hover:border-white/20"
          >
            <Globe className="w-5 h-5" />
          </button>
          <button
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-amber-500 dark:text-blue-400 transition-all btn-press border border-transparent hover:border-slate-300 dark:hover:border-white/20"
          >
            {theme === "light" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
