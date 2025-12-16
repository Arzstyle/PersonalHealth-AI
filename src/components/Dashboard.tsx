import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ScanLine,
  Droplets,
  Plus,
  Zap,
  ChevronRight,
  Dumbbell,
  Wind,
  Trophy,
  ArrowUpRight,
  Cpu,
  Binary,
  Disc,
} from "lucide-react";
import { useUI } from "../context/UIContext";
import { calculateMacroTargets, getBMICategory } from "../utils/calculations";

const CountUp = ({
  end,
  duration = 2000,
  suffix = "",
}: {
  end: number;
  duration?: number;
  suffix?: string;
}) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);
  return (
    <>
      {count}
      {suffix}
    </>
  );
};

const CyberConfetti = () => {
  const particles = Array.from({ length: 40 });
  return (
    <div className="absolute inset-0 pointer-events-none rounded-[2.5rem] overflow-hidden z-20">
      {particles.map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 sm:w-3 sm:h-3 rounded-sm animate-confetti"
          style={
            {
              backgroundColor: ["#06b6d4", "#d946ef", "#84cc16", "#3b82f6"][
                Math.floor(Math.random() * 4)
              ],
              left: "50%",
              top: "50%",
              "--tx": `${(Math.random() - 0.5) * 600}px`,
              "--ty": `${(Math.random() - 0.5) * 600}px`,
              animationDelay: `${Math.random() * 0.5}s`,
              animationDuration: "1.5s",
              opacity: 0,
              boxShadow: "0 0 8px currentColor",
            } as any
          }
        />
      ))}
    </div>
  );
};
const DashboardHeader = ({ user }: { user: any }) => {
  const { t } = useUI();
  const today = new Date();
  const displayName = user?.name || "Guest";
  const firstName = displayName.split(" ")[0];
  const safeName =
    firstName.length > 12 && !firstName.includes(" ")
      ? `${firstName.substring(0, 10)}\u200B${firstName.substring(10)}`
      : firstName;

  return (
    <div className="flex flex-col xl:flex-row justify-between items-end mb-8 pt-6 animate-enter transform-gpu relative z-20 gap-4">
      <div className="w-full xl:w-auto">
        <div className="flex items-center gap-2 mb-2 group cursor-default">
          <div className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-cyan-200 dark:border-cyan-500/30 flex items-center gap-2 shadow-sm shadow-cyan-100 dark:shadow-[0_0_10px_rgba(6,182,212,0.2)] transition-transform group-hover:scale-105">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500 dark:bg-cyan-400"></span>
            </span>
            <span className="text-[11px] font-bold text-cyan-700 dark:text-cyan-400 uppercase tracking-widest font-mono">
              SYSTEM ONLINE
            </span>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight mt-2 drop-shadow-sm group max-w-full">
          <span className="inline-block mr-2">{t("dash.hello")}</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 dark:from-cyan-400 dark:via-blue-500 dark:to-purple-500 animate-aurora bg-[length:200%_auto] inline-block transition-transform hover:scale-105 origin-left duration-300 cursor-default break-all drop-shadow-sm">
            {safeName}
          </span>
          <span className="inline-block ml-2 text-3xl animate-bounce delay-700 origin-bottom-right">
            🤖
          </span>
        </h1>
      </div>

      <div className="hidden sm:block text-right flex-shrink-0">
        <div className="glass-panel px-6 py-3 rounded-2xl hover:rotate-1 transition-transform duration-300 border-l-4 border-cyan-500 bg-white/80 dark:bg-slate-900/80 shadow-md shadow-cyan-100/50 dark:shadow-none">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-0.5">
            {t("dash.today_overview")}
          </p>
          <p className="text-lg font-bold text-slate-800 dark:text-slate-200 font-mono">
            {today.toLocaleDateString("en-US", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

const CalorieRing = ({
  target,
  current,
}: {
  target: number;
  current: number;
}) => {
  const { t } = useUI();
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const isGoalReached = current >= target && target > 0;
  const remaining = Math.max(0, target - current);
  const percentage = Math.min(
    100,
    Math.max(0, (current / (target || 1)) * 100)
  );
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-64 h-64 flex items-center justify-center group flex-shrink-0">
      {isGoalReached && <CyberConfetti />}
      <div
        className={`absolute inset-0 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse ${
          isGoalReached
            ? "bg-yellow-500/30 dark:bg-yellow-500/40"
            : "bg-cyan-500/20"
        }`}
      ></div>

      <div className="absolute inset-0 border border-slate-300 dark:border-slate-700/30 rounded-full scale-110 border-dashed animate-[spin_20s_linear_infinite] will-change-transform"></div>
      <div className="absolute inset-0 border border-slate-300 dark:border-slate-700/30 rounded-full scale-125 border-dotted animate-[spin_15s_linear_infinite_reverse] will-change-transform"></div>

      <svg className="w-full h-full transform -rotate-90 relative z-10 drop-shadow-xl">
        <circle
          cx="128"
          cy="128"
          r={radius}
          stroke="currentColor"
          strokeWidth="12"
          fill="transparent"
          className="text-slate-200 dark:text-white/5 transition-colors duration-500"
          strokeLinecap="round"
        />
        <circle
          cx="128"
          cy="128"
          r={radius}
          stroke="currentColor"
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className={`${
            isGoalReached
              ? "text-yellow-500 dark:text-yellow-400 drop-shadow-[0_0_15px_rgba(234,179,8,0.9)]"
              : "text-cyan-500 drop-shadow-[0_0_10px_rgba(6,182,212,0.6)]"
          } transition-all duration-1500 ease-[cubic-bezier(0.34,1.56,0.64,1)]`}
        />
      </svg>

      <div className="absolute flex flex-col items-center z-20 group-hover:scale-110 transition-transform duration-300">
        <div
          className={`p-3 rounded-full mb-2 shadow-lg border transition-all duration-500 ${
            isGoalReached
              ? "bg-yellow-100 dark:bg-yellow-900/50 border-yellow-500 animate-bounce scale-110"
              : "bg-white dark:bg-slate-900 border-cyan-200 dark:border-cyan-500/50"
          }`}
        >
          {isGoalReached ? (
            <Trophy className="w-7 h-7 text-yellow-600 dark:text-yellow-400 fill-yellow-600 dark:fill-yellow-400" />
          ) : (
            <Zap className="w-6 h-6 text-cyan-600 dark:text-cyan-400 fill-cyan-600 dark:fill-cyan-400 animate-[pulse_3s_ease-in-out_infinite]" />
          )}
        </div>
        {isGoalReached ? (
          <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-600 dark:from-yellow-400 dark:to-orange-500 tracking-tighter animate-pulse">
            MAX POWER!
          </span>
        ) : (
          <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter font-mono">
            <CountUp end={remaining} />
          </span>
        )}
        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">
          {isGoalReached ? "System Optimized" : t("dash.kcal_left")}
        </span>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { t } = useUI();
  const [user, setUser] = useState<any>(null);
  const [macroTargets, setMacroTargets] = useState<any>({
    protein: 0,
    carbs: 0,
    fat: 0,
  });
  const [caloriesEaten, setCaloriesEaten] = useState(0);
  const [consumedMacros, setConsumedMacros] = useState({
    protein: 0,
    carbs: 0,
    fat: 0,
  });

  const [plannedCalories, setPlannedCalories] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      if (parsedUser.dailyCalories && parsedUser.goal) {
        setMacroTargets(
          calculateMacroTargets(
            parsedUser.dailyCalories,
            parsedUser.goal,
            parsedUser.weight
          )
        );
      }
    }
    const loadDietStats = () => {
      const savedDiet = localStorage.getItem("dietPlan");
      if (savedDiet) {
        const dietData = JSON.parse(savedDiet);
        let totalCal = 0;
        let totalP = 0;
        let totalC = 0;
        let totalF = 0;
        let plannedCal = 0;

        Object.keys(dietData).forEach((key) => {
          dietData[key].forEach((meal: any) => {
            plannedCal += meal.calories || 0;
            if (meal.completed) {
              totalCal += meal.calories || 0;
              totalP += meal.protein || 0;
              totalC += meal.carbs || 0;
              totalF += meal.fat || 0;
            }
          });
        });
        setCaloriesEaten(totalCal);
        setConsumedMacros({ protein: totalP, carbs: totalC, fat: totalF });
        setPlannedCalories(plannedCal);
      }
    };
    loadDietStats();
    window.addEventListener("storage", loadDietStats);
    return () => window.removeEventListener("storage", loadDietStats);
  }, []);

  useEffect(() => {
    if (!user?.isOptimistic) return;

    const interval = setInterval(() => {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);

        if (!parsed.isOptimistic) {
          console.log("🔄 Dashboard: Real User Data Arrived!");

          if (!parsed.isSetupComplete) {
            window.location.href = "/profile-setup";
          } else {
            setUser(parsed);
            if (parsed.dailyCalories && parsed.goal) {
              setMacroTargets(
                calculateMacroTargets(
                  parsed.dailyCalories,
                  parsed.goal,
                  parsed.weight
                )
              );
            }
          }
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, [user?.isOptimistic]);

  if (!user) return null;

  const activeTarget =
    plannedCalories > 0 ? plannedCalories : user.dailyCalories;
  const isGoalReached = caloriesEaten >= activeTarget && activeTarget > 0;

  return (
    <div className="relative w-full px-6 flex flex-col pb-10 overflow-visible">
      <div className="absolute inset-0 -z-10 h-full w-full bg-slate-50 dark:bg-transparent bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      <style>{`
          @keyframes confetti { 0% { transform: translate(0, 0) scale(1); opacity: 1; } 100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; } }
          .animate-confetti { animation: confetti 1.5s cubic-bezier(0.25, 1, 0.5, 1) forwards; will-change: transform, opacity; }
          @keyframes wave { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(15deg); } 75% { transform: rotate(-10deg); } }
          .animate-wave { animation: wave 2s infinite; transform-origin: 70% 70%; }
          @keyframes scan { 0% { transform: translateY(0%); } 100% { transform: translateY(300px); } }
          .animate-scan { animation: scan 2s linear infinite; }
        `}</style>

      <DashboardHeader user={user} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 animate-enter delay-100">
        <div className="lg:col-span-8 flex flex-col gap-8">
          <div
            className={`glass-panel rounded-[2.5rem] p-10 relative group hover:shadow-2xl transition-all duration-500 overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-md ${
              isGoalReached
                ? "shadow-yellow-500/20 border-yellow-500/30"
                : "hover:shadow-cyan-500/20 border-cyan-200 dark:border-cyan-500/30"
            }`}
          >
            <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%),linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%),linear-gradient(to_right,#06b6d430_1px,transparent_1px),linear-gradient(to_bottom,#06b6d430_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <div className="absolute inset-x-0 h-1 bg-cyan-400/20 blur-sm animate-scan z-0 pointer-events-none"></div>

            <div className="flex flex-col xl:flex-row items-center gap-12 relative z-10">
              <CalorieRing target={activeTarget} current={caloriesEaten} />
              <div className="flex-1 w-full">
                <div className="flex justify-between items-end mb-8 border-b border-slate-200 dark:border-white/5 pb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                      {t("dash.daily_fuel")}
                      <Cpu
                        className={`w-5 h-5 animate-pulse ${
                          isGoalReached
                            ? "text-yellow-500"
                            : "text-cyan-600 dark:text-cyan-500"
                        }`}
                      />
                    </h3>
                    <p className="text-sm text-slate-500 font-medium mt-1">
                      {t("dash.opt_target")}:{" "}
                      <span className="text-slate-900 dark:text-white font-bold font-mono">
                        {activeTarget}
                      </span>{" "}
                      kcal
                    </p>
                  </div>
                  <div className="text-right">
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border transition-all duration-500 ${
                        isGoalReached
                          ? "bg-yellow-100 dark:bg-yellow-950/30 border-yellow-300 dark:border-yellow-500/30 scale-105 shadow-sm"
                          : "bg-slate-100 dark:bg-slate-900 border-cyan-200 dark:border-cyan-500/30"
                      }`}
                    >
                      <span
                        className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                          isGoalReached
                            ? "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)]"
                            : caloriesEaten > 0
                            ? "bg-cyan-500"
                            : "bg-slate-400"
                        }`}
                      ></span>
                      <span
                        className={`text-xs font-bold uppercase tracking-wide ${
                          isGoalReached
                            ? "text-yellow-700 dark:text-yellow-400"
                            : "text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        {isGoalReached
                          ? "GOAL REACHED!"
                          : caloriesEaten > 0
                          ? t("dash.active")
                          : t("dash.no_data")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  {[
                    {
                      l: t("dash.protein"),
                      v: consumedMacros.protein,
                      t: macroTargets.protein,
                      c: "bg-blue-500",
                      b: "bg-blue-100 dark:bg-blue-900/20",
                      i: <Cpu className="w-4 h-4" />,
                      tc: "text-blue-600 dark:text-blue-400",
                    },
                    {
                      l: t("dash.carbs"),
                      v: consumedMacros.carbs,
                      t: macroTargets.carbs,
                      c: "bg-emerald-500",
                      b: "bg-emerald-100 dark:bg-emerald-900/20",
                      i: <Zap className="w-4 h-4" />,
                      tc: "text-emerald-600 dark:text-emerald-400",
                    },
                    {
                      l: t("dash.fat"),
                      v: consumedMacros.fat,
                      t: macroTargets.fat,
                      c: "bg-amber-500",
                      b: "bg-amber-100 dark:bg-amber-900/20",
                      i: <Disc className="w-4 h-4" />,
                      tc: "text-amber-600 dark:text-amber-400",
                    },
                  ].map((m, i) => {
                    const percent =
                      Math.min(100, (m.v / (m.t || 1)) * 100) || 0;
                    return (
                      <div key={i} className="group/macro">
                        <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-wider text-slate-500">
                          <span
                            className={`flex items-center gap-2 group-hover/macro:scale-105 transition-transform origin-left ${m.tc}`}
                          >
                            {m.i} {m.l}
                          </span>
                          <span className="text-slate-900 dark:text-white font-black font-mono">
                            <CountUp end={Math.round(m.v)} />g{" "}
                            <span className="text-slate-500 font-medium">
                              / {m.t}g
                            </span>
                          </span>
                        </div>
                        <div
                          className={`h-3 w-full rounded-full ${m.b} overflow-hidden shadow-inner ring-1 ring-black/5 dark:ring-white/5`}
                        >
                          <div
                            className={`h-full rounded-full ${m.c} relative overflow-hidden transition-all duration-[1.5s] ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-[0_0_10px_currentColor] group-hover/macro:brightness-110`}
                            style={{ width: `${percent}%` }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shine_2s_infinite]"></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-enter delay-200">
            <div className="glass-panel rounded-[2.5rem] p-8 relative group hover:-translate-y-1 hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-900/80 border border-violet-200 dark:border-white/5 hover:border-violet-400 dark:hover:border-violet-500/30 shadow-violet-100/50 dark:shadow-none">
              <div className="absolute -right-6 -top-6 w-32 h-32 bg-violet-500/5 dark:bg-violet-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="p-3 bg-violet-100 dark:bg-violet-900/20 rounded-2xl text-violet-600 dark:text-violet-400 shadow-sm border border-violet-200 dark:border-violet-500/20 group-hover:rotate-12 transition-transform">
                  <Activity className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-violet-700 dark:text-violet-300 bg-violet-100 dark:bg-violet-900/20 px-3 py-1 rounded-full uppercase tracking-wider border border-violet-200 dark:border-violet-500/20">
                  {t("dash.score")}
                </span>
              </div>
              <div className="relative z-10">
                <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter flex items-center gap-1 font-mono">
                  <CountUp end={Number(user.bmi)} />
                </span>
                <p className="text-sm font-medium text-slate-500 mt-1">
                  {t("dash.bmi")}
                </p>
                <div className="mt-4 inline-flex items-center gap-1 px-4 py-1.5 rounded-xl border border-violet-200 dark:border-violet-500/30 text-xs font-bold text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-900/10 backdrop-blur-md group-hover:bg-violet-100 dark:group-hover:bg-violet-900/30 transition-colors">
                  {getBMICategory(user.bmi).category}{" "}
                  <ArrowUpRight className="w-3 h-3" />
                </div>
              </div>
            </div>
            <div className="glass-panel rounded-[2.5rem] p-8 relative group hover:-translate-y-1 hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-900/80 border border-cyan-200 dark:border-white/5 hover:border-cyan-400 dark:hover:border-cyan-500/30 shadow-cyan-100/50 dark:shadow-none">
              <div className="absolute -right-6 -top-6 w-32 h-32 bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="p-3 bg-cyan-100 dark:bg-cyan-900/20 rounded-2xl text-cyan-600 dark:text-cyan-400 shadow-sm border border-cyan-200 dark:border-cyan-500/20 group-hover:rotate-12 transition-transform">
                  <Droplets className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-cyan-700 dark:text-cyan-300 bg-cyan-100 dark:bg-cyan-900/20 px-3 py-1 rounded-full uppercase tracking-wider border border-cyan-200 dark:border-cyan-500/20">
                  {t("dash.hydration")}
                </span>
              </div>
              <div className="relative z-10">
                <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter font-mono">
                  0
                  <span className="text-2xl text-slate-500 font-bold ml-1">
                    L
                  </span>
                </span>
                <p className="text-sm font-medium text-slate-500 mt-1">
                  {t("dash.daily_goal")}: 2.5L
                </p>
                <div className="mt-5 flex gap-1.5 h-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="flex-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden hover:scale-y-125 transition-transform cursor-pointer group/bar origin-bottom border border-slate-300 dark:border-white/5"
                    >
                      <div className="h-full bg-cyan-500 w-0 group-hover/bar:w-full transition-all duration-500 ease-out shadow-[0_0_10px_#06b6d4]"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-8 animate-enter delay-300">
          <div className="glass-panel rounded-[2.5rem] p-8 flex flex-col h-full relative group hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/5 hover:border-cyan-400 dark:hover:border-cyan-500/30 shadow-slate-200/50 dark:shadow-none">
            <div className="flex items-center justify-between mb-8 px-1 relative z-10">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Binary className="w-5 h-5 text-amber-500 animate-pulse" />{" "}
                {t("dash.quick_actions")}
              </h3>
            </div>
            <div className="flex-1 grid grid-cols-1 gap-5 relative z-10">
              {[
                {
                  to: "/meals",
                  label: t("dash.act_log_meal"),
                  desc: t("dash.desc_log_meal"),
                  icon: Plus,
                  color: "emerald",
                  gradient: "from-emerald-500 to-teal-500",
                  bg: "bg-emerald-100 dark:bg-slate-800",
                  text: "text-emerald-600 dark:text-emerald-400",
                },
                {
                  to: "/exercises",
                  label: t("dash.act_workout"),
                  desc: t("dash.desc_workout"),
                  icon: Dumbbell,
                  color: "blue",
                  gradient: "from-blue-500 to-indigo-500",
                  bg: "bg-blue-100 dark:bg-slate-800",
                  text: "text-blue-600 dark:text-blue-400",
                },
                {
                  to: "/food-search",
                  label: t("dash.act_ai_scan"),
                  desc: t("dash.desc_ai_scan"),
                  icon: ScanLine,
                  color: "violet",
                  gradient: "from-violet-500 to-purple-500",
                  bg: "bg-violet-100 dark:bg-slate-800",
                  text: "text-violet-600 dark:text-violet-400",
                },
              ].map((action, i) => (
                <Link
                  key={i}
                  to={action.to}
                  className="group/btn relative p-5 rounded-[24px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 hover:border-cyan-400 dark:hover:border-cyan-500/30 transition-all duration-300 hover:shadow-md hover:shadow-cyan-100/50 dark:hover:shadow-[0_0_15px_rgba(6,182,212,0.1)] hover:-translate-y-1 btn-press overflow-hidden"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${action.gradient} opacity-0 group-hover/btn:opacity-10 transition-opacity duration-300`}
                  ></div>
                  <div className="flex items-center gap-5 relative z-10">
                    <div
                      className={`w-14 h-14 rounded-2xl ${action.bg} flex items-center justify-center ${action.text} shadow-sm border border-slate-200 dark:border-white/5 group-hover/btn:scale-110 group-hover/btn:bg-white dark:group-hover/btn:bg-slate-700 transition-all duration-300`}
                    >
                      <action.icon className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover/btn:translate-x-1 group-hover/btn:text-cyan-600 dark:group-hover/btn:text-cyan-400 transition-transform">
                        {action.label}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 group-hover/btn:text-slate-700 dark:group-hover/btn:text-slate-300">
                        {action.desc}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 group-hover/btn:text-cyan-600 dark:group-hover/btn:text-cyan-400 group-hover/btn:bg-slate-100 dark:group-hover/btn:bg-slate-700 group-hover/btn:translate-x-2 transition-all shadow-sm">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/5 relative z-10">
              <div className="flex justify-between items-center mb-4 px-1">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  {t("dash.weekly_activity")}
                </span>
                <Wind className="w-4 h-4 text-slate-400 animate-pulse" />
              </div>
              <div className="flex items-end justify-between h-16 gap-2">
                {[40, 70, 30, 85, 50, 90, 60].map((h, i) => (
                  <div
                    key={i}
                    className="w-full flex flex-col items-center gap-2 group/bar cursor-pointer hover:-translate-y-1 transition-transform"
                  >
                    <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-t-md relative h-full overflow-hidden border border-slate-300 dark:border-white/5">
                      <div
                        className="absolute bottom-0 w-full bg-gradient-to-t from-slate-400 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-t-md transition-all duration-700 group-hover/bar:bg-cyan-500 group-hover/bar:from-cyan-600 group-hover/bar:to-cyan-400 group-hover/bar:shadow-[0_0_10px_#06b6d4]"
                        style={{ height: `${h}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
