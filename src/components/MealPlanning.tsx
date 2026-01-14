import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Sparkles,
  BrainCircuit,
  Utensils,
  Flame,
  MoreHorizontal,
  PenTool,
  CheckCircle,
  Circle,
  ArrowRight,
  Bot,
  Cpu,
  Zap,
  Scan,
  Binary,
  BatteryMedium,
  Disc,
  Egg,
  Fish,
  Wheat,
  Leaf,
  Drumstick,
  Beef,
  Moon,
} from "lucide-react";
import { useUI } from "../context/UIContext";
import { useNutrition } from "../context/NutritionContext";
import nutritionData from "../data/nutrition.json";
import { generateMealPlanAI } from "../services/ai";

interface Meal {
  id: number;
  name: string;
  portion?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  completed?: boolean;
  image?: string;
}

const INITIAL_MEALS: Record<string, Meal[]> = {
  breakfast: [],
  lunch: [],
  dinner: [],
  snacks: [],
};

const CyberConfetti = React.memo(() => {
  const particles = useMemo(() => Array.from({ length: 40 }), []);
  return (
    <div className="fixed inset-0 pointer-events-none z-[1000] overflow-hidden flex items-center justify-center">
      {particles.map((_, i) => {
        const angle = Math.random() * 360;
        const velocity = 250 + Math.random() * 500;
        const tx = Math.cos(angle * (Math.PI / 180)) * velocity;
        const ty = Math.sin(angle * (Math.PI / 180)) * velocity;
        return (
          <div
            key={i}
            className="absolute w-2 h-2 sm:w-3 sm:h-3 rounded-sm animate-explode will-change-transform"
            style={
              {
                backgroundColor: [
                  "#06b6d4",
                  "#d946ef",
                  "#84cc16",
                  "#3b82f6",
                  "#f43f5e",
                ][Math.floor(Math.random() * 5)],
                "--tx": `${tx}px`,
                "--ty": `${ty}px`,
                left: "50%",
                top: "50%",
                animationDelay: `${Math.random() * 0.1}s`,
                animationDuration: "1s",
                opacity: 0,
                boxShadow: "0 0 6px currentColor",
              } as any
            }
          />
        );
      })}
    </div>
  );
});

const CyberRobotCelebration = () => {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen z-[9999] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-slate-50/90 dark:bg-slate-950/90 animate-fade-in-fast backdrop-blur-sm">
        <div className="absolute inset-0 opacity-10 dark:opacity-20 bg-[linear-gradient(rgba(6,182,212,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.2)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md animate-pop-up-cyber transform-gpu">
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-cyan-500/20 rounded-full blur-[60px]"></div>
        <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-purple-500/20 rounded-full blur-[60px]"></div>

        <div className="relative bg-white dark:bg-slate-900 border border-cyan-500/30 dark:border-cyan-500/50 rounded-3xl p-1 overflow-hidden shadow-2xl shadow-cyan-500/10">
          <div className="absolute inset-0 w-full h-1 bg-cyan-400/50 blur-sm animate-scan z-20 pointer-events-none will-change-transform"></div>

          <div className="bg-slate-50 dark:bg-slate-950 rounded-[1.3rem] p-8 flex flex-col items-center text-center relative overflow-hidden">
            <div className="relative mb-6 group">
              <div className="absolute inset-0 border-2 border-dashed border-cyan-500/30 rounded-full w-28 h-28 -m-2 animate-[spin_10s_linear_infinite]"></div>
              <div className="absolute inset-0 border border-purple-500/30 rounded-full w-32 h-32 -m-4 animate-[spin_15s_linear_infinite_reverse]"></div>

              <div className="relative w-24 h-24 bg-gradient-to-b from-white to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl flex items-center justify-center border border-cyan-500/50 shadow-lg animate-float">
                <Bot className="w-14 h-14 text-cyan-600 dark:text-cyan-400" />
                <div className="absolute top-[38%] left-[35%] w-1.5 h-1.5 bg-cyan-500 dark:bg-cyan-300 rounded-full animate-blink shadow-[0_0_5px_cyan]"></div>
                <div className="absolute top-[38%] right-[35%] w-1.5 h-1.5 bg-cyan-500 dark:bg-cyan-300 rounded-full animate-blink shadow-[0_0_5px_cyan]"></div>
              </div>

              <Cpu className="absolute -top-4 -right-6 w-8 h-8 text-purple-600 dark:text-purple-400 animate-bounce delay-100" />
              <Zap className="absolute -bottom-2 -left-6 w-8 h-8 text-yellow-500 dark:text-yellow-400 animate-pulse delay-200" />
              <Binary className="absolute top-10 -right-10 w-6 h-6 text-emerald-600 dark:text-emerald-400 opacity-60 animate-pulse" />
            </div>

            <div className="space-y-2 relative z-30">
              <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 dark:from-cyan-400 dark:via-blue-400 dark:to-purple-400 tracking-tighter">
                SYSTEM UPGRADED!
              </h2>
              <div className="flex items-center justify-center gap-2 text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/50 border border-emerald-500/30 px-4 py-1.5 rounded-full text-sm font-bold tracking-widest uppercase">
                <Scan className="w-4 h-4" />
                <span>Nutrition Target 100%</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
                Protocol complete. Your body fuel is optimized.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CALORIE_LIMITS = {
  "low-cal": { min: 1500, max: 2000, label: "1500-2000" },
  standard: { min: 2000, max: 2600, label: "2000-2600" },
  bulking: { min: 2800, max: 3200, label: "2800-3200" },
};

const MealPlanning: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useUI();
  const { updateNutrition } = useNutrition();

  const [currentDate, setCurrentDate] = useState(new Date());

  const [mealsData, setMealsData] = useState<Record<string, Meal[]>>(() => {
    const saved = localStorage.getItem("dietPlan");
    return saved ? JSON.parse(saved) : INITIAL_MEALS;
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [dietGoal, setDietGoal] = useState<"standard" | "low-cal" | "bulking">(
    "standard"
  );
  const [user, setUser] = useState<any>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));

    const manualLogStr = localStorage.getItem("manualMealsLog");
    if (manualLogStr) {
      const manualLog = JSON.parse(manualLogStr);
      if (manualLog.length > 0) {
        setMealsData((prevData) => {
          const newData = { ...prevData };

          manualLog.forEach((item: any) => {
            const hour = new Date(item.timestamp).getHours();
            let category = "snack";
            if (hour < 10) category = "breakfast";
            else if (hour < 14) category = "lunch";
            else if (hour < 19) category = "dinner";

            if (!newData[category]) newData[category] = [];

            const exists = newData[category].some(
              (m) => m.name === item.name && m.calories === item.calories
            );
            if (!exists) {
              newData[category] = [
                ...newData[category],
                {
                  id: item.id || Date.now(),
                  name: item.name,
                  calories: item.calories,
                  protein: item.protein,
                  carbs: item.carbs,
                  fat: item.fat,
                  completed: false,
                  image: item.image,
                },
              ];
            }
          });
          return newData;
        });

        localStorage.removeItem("manualMealsLog");
      }
    }
  }, [currentDate]);

  const allMeals = useMemo(() => Object.values(mealsData).flat(), [mealsData]);

  useEffect(() => {
    localStorage.setItem("dietPlan", JSON.stringify(mealsData));
    calculateAndSyncNutrition(mealsData);

    const currentAllMeals = Object.values(mealsData).flat();
    const totalCompleted = currentAllMeals.filter(
      (meal) => meal.completed
    ).length;
    const totalItems = currentAllMeals.length;
    const isGoalComplete = totalItems > 0 && totalCompleted === totalItems;

    if (isGoalComplete) {
      setShowCelebration(true);
      const timer = setTimeout(() => {
        setShowCelebration(false);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setShowCelebration(false);
    }
  }, [mealsData]);

  const calculateAndSyncNutrition = (currentMeals: Record<string, Meal[]>) => {
    let totalConsumed = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    Object.values(currentMeals)
      .flat()
      .forEach((meal) => {
        if (meal.completed) {
          totalConsumed.calories += meal.calories || 0;
          totalConsumed.protein += meal.protein || 0;
          totalConsumed.carbs += meal.carbs || 0;
          totalConsumed.fat += meal.fat || 0;
        }
      });
    updateNutrition({
      ...totalConsumed,
      date: currentDate.toISOString().split("T")[0],
    });
  };

  const changeDate = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(t("locale") || "id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  const handleAiGenerate = async () => {
    if (!user || !user.dailyCalories) {
      alert(t("meal.no_user_data") || "Please complete profile setup first.");
      return;
    }

    setIsGenerating(true);
    try {
      const sampleSize = 25;
      const shuffled = [...nutritionData].sort(() => 0.5 - Math.random());
      const samples = shuffled.slice(0, sampleSize);

      let targetCalories = user.dailyCalories || 2000;
      const limit = CALORIE_LIMITS[dietGoal];

      if (limit) {
        if (targetCalories < limit.min || targetCalories > limit.max) {
          targetCalories = Math.round((limit.min + limit.max) / 2);
        }
      }

      console.log(
        `Requesting AI Meal Plan for ${dietGoal} (~${targetCalories} kcal)...`
      );
      const plan = await generateMealPlanAI(targetCalories, dietGoal, samples);

      console.log("AI Response Plan:", plan);

      if (plan) {
        const snacksList = plan.snack || [];

        const breakfastList = plan.breakfast || [];
        const lunchList = plan.lunch || [];
        const dinnerList = plan.dinner || [];

        setMealsData({
          breakfast: breakfastList.map((m, i) => ({
            ...m,
            id: Date.now() + i,
            completed: false,
          })),
          lunch: lunchList.map((m, i) => ({
            ...m,
            id: Date.now() + 100 + i,
            completed: false,
          })),
          dinner: dinnerList.map((m, i) => ({
            ...m,
            id: Date.now() + 200 + i,
            completed: false,
          })),
          snacks: snacksList.map((m: any, i: number) => ({
            ...m,
            id: Date.now() + 300 + i,
            completed: false,
          })),
        });
      } else {
        alert("Gagal membuat rencana makan. (AI did not return data)");
      }
    } catch (error: any) {
      console.error("AI Generation Failed:", error);
      const errorMessage = error?.message || "Unknown error";

      if (errorMessage.includes("401")) {
        alert("Gagal: API Key Invalid (401). Periksa .env Anda.");
      } else if (errorMessage.includes("429")) {
        alert("Gagal: Rate Limit Exceeded (429). Tunggu sebentar.");
      } else {
        alert(`AI Generation Gagal: ${errorMessage}`);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleManualPlan = () => navigate("/food-search");

  const handleRemoveItem = (mealType: string, id: number) => {
    const updatedCategory = mealsData[mealType].filter(
      (item) => item.id !== id
    );
    setMealsData((prev) => ({ ...prev, [mealType]: updatedCategory }));
  };

  const toggleMealCompletion = (mealType: string, id: number) => {
    setMealsData((prev) => {
      const updatedCategory = prev[mealType].map((meal) => {
        if (meal.id === id) {
          return { ...meal, completed: !meal.completed };
        }
        return meal;
      });
      return { ...prev, [mealType]: updatedCategory };
    });
  };

  const getFoodTheme = (name: string) => {
    const n = name.toLowerCase();

    if (n.match(/ayam|chicken|bebek|drumstick/))
      return {
        icon: Drumstick,
        gradient: "from-orange-500 to-red-600",
        text: "text-orange-600 dark:text-orange-500",
        border: "border-orange-200 dark:border-orange-500/30",
        bg: "bg-orange-50 dark:bg-slate-900",
      };
    if (n.match(/daging|sapi|beef|burger|steak|rendang/))
      return {
        icon: Beef,
        gradient: "from-red-600 to-rose-700",
        text: "text-red-600 dark:text-red-500",
        border: "border-red-200 dark:border-red-500/30",
        bg: "bg-red-50 dark:bg-slate-900",
      };
    if (n.match(/ikan|fish|lele|gurame|seafood|udang/))
      return {
        icon: Fish,
        gradient: "from-blue-500 to-cyan-600",
        text: "text-blue-600 dark:text-blue-500",
        border: "border-blue-200 dark:border-blue-500/30",
        bg: "bg-blue-50 dark:bg-slate-900",
      };
    if (n.match(/telur|egg/))
      return {
        icon: Egg,
        gradient: "from-amber-400 to-orange-500",
        text: "text-amber-600 dark:text-amber-500",
        border: "border-amber-200 dark:border-amber-500/30",
        bg: "bg-amber-50 dark:bg-slate-900",
      };
    if (n.match(/sayur|salad|brokoli|bayam|pecel|gado|kangkung|capcay/))
      return {
        icon: Leaf,
        gradient: "from-emerald-500 to-green-600",
        text: "text-emerald-600 dark:text-emerald-500",
        border: "border-emerald-200 dark:border-emerald-500/30",
        bg: "bg-emerald-50 dark:bg-slate-900",
      };
    if (n.match(/nasi|rice|bubur|lontong|roti|bread/))
      return {
        icon: Wheat,
        gradient: "from-zinc-400 to-slate-500",
        text: "text-slate-600 dark:text-slate-400",
        border: "border-slate-200 dark:border-slate-500/30",
        bg: "bg-slate-50 dark:bg-slate-900",
      };
    return {
      icon: Utensils,
      gradient: "from-slate-500 to-gray-600",
      text: "text-slate-600 dark:text-slate-400",
      border: "border-slate-200 dark:border-slate-500/30",
      bg: "bg-slate-50 dark:bg-slate-900",
    };
  };

  const getCategoryStyle = (type: string) => {
    switch (type) {
      case "breakfast":
        return {
          icon: Zap,
          color: "text-amber-500 dark:text-amber-400",
          bg: "bg-amber-100 dark:bg-amber-500/10",
          border: "border-amber-200 dark:border-amber-500/20",
          label: t("meal.breakfast") || "Sarapan",
        };
      case "lunch":
        return {
          icon: BatteryMedium,
          color: "text-emerald-600 dark:text-emerald-400",
          bg: "bg-emerald-100 dark:bg-emerald-500/10",
          border: "border-emerald-200 dark:border-emerald-500/20",
          label: t("meal.lunch") || "Makan Siang",
        };
      case "dinner":
        return {
          icon: Moon,
          color: "text-indigo-600 dark:text-indigo-400",
          bg: "bg-indigo-100 dark:bg-indigo-500/10",
          border: "border-indigo-200 dark:border-indigo-500/20",
          label: t("meal.dinner") || "Makan Malam",
        };
      default:
        return {
          icon: Disc,
          color: "text-pink-600 dark:text-pink-400",
          bg: "bg-pink-100 dark:bg-pink-500/10",
          border: "border-pink-200 dark:border-pink-500/20",
          label: t("meal.snacks") || "Camilan",
        };
    }
  };

  const totalStats = useMemo(
    () =>
      allMeals.reduce(
        (acc, item) => ({
          calories: acc.calories + item.calories,
          protein: acc.protein + item.protein,
          carbs: acc.carbs + item.carbs,
          fat: acc.fat + item.fat,
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      ),
    [allMeals]
  );

  const totalCalorieTarget = user?.dailyCalories || 2000;

  return (
    <div className="w-full px-6 flex flex-col pb-10 relative">
      <div className="absolute inset-0 -z-10 h-full w-full bg-slate-50 dark:bg-transparent bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      <style>{`
          @keyframes fade-in-fast { from { opacity: 0; } to { opacity: 1; } }
          .animate-fade-in-fast { animation: fade-in-fast 0.3s ease-out forwards; }
          
          @keyframes pop-up-cyber {
            0% { opacity: 0; transform: scale(0.9) translate3d(0, 20px, 0); }
            60% { opacity: 1; transform: scale(1.02) translate3d(0, -5px, 0); }
            100% { opacity: 1; transform: scale(1) translate3d(0, 0, 0); }
          }
          .animate-pop-up-cyber { animation: pop-up-cyber 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
          
          @keyframes explode {
            0% { transform: translate3d(0, 0, 0) scale(0.5); opacity: 1; }
            50% { opacity: 1; }
            100% { transform: translate3d(var(--tx), var(--ty), 0) scale(0); opacity: 0; }
          }
          .animate-explode { animation: explode 1s cubic-bezier(0.1, 0.7, 1.0, 0.1) forwards; }

          @keyframes float { 
            0%, 100% { transform: translate3d(0, 0, 0); } 
            50% { transform: translate3d(0, -10px, 0); } 
          }
          .animate-float { animation: float 3s ease-in-out infinite; }

          @keyframes scan { 
            0% { transform: translateY(0%); } 
            100% { transform: translateY(300px); } 
          }
          .animate-scan { animation: scan 2s linear infinite; }
          
          @keyframes blink { 0%, 90%, 100% { opacity: 1; } 95% { opacity: 0; } }
          .animate-blink { animation: blink 3s infinite; }

          @keyframes bg-scroll { from { background-position: 0 0; } to { background-position: 20px 20px; } }
          .animate-bg-scroll { animation: bg-scroll 1s linear infinite; }

          @keyframes scan-laser {
            0% { transform: translateY(-10%); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(150%); opacity: 0; }
          }
          .animate-scan-laser { animation: scan-laser 2s ease-in-out infinite; background: linear-gradient(to bottom, transparent, rgba(6, 182, 212, 0.8), transparent); }
        `}</style>

      {showCelebration && (
        <>
          <CyberConfetti />
          <CyberRobotCelebration />
        </>
      )}

      <div className="animate-enter w-full transform-gpu">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 pt-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white flex items-center gap-4 drop-shadow-sm">
              <div className="relative p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-cyan-500/30 shadow-lg shadow-slate-200/50 dark:shadow-none transition-transform hover:scale-105 group overflow-hidden">
                <div className="absolute inset-0 bg-cyan-100/50 dark:bg-cyan-500/10 animate-pulse"></div>
                <BrainCircuit className="w-8 h-8 text-cyan-600 dark:text-cyan-400 relative z-10" />
              </div>
              {t("meal.plan_title") || "Meal Plan"}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-3 ml-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {t("meal.plan_subtitle") ||
                "Rencanakan nutrisimu, otomatis atau manual."}
            </p>
          </div>

          <div className="glass-panel px-3 py-2 flex items-center gap-2 select-none rounded-xl border border-slate-200 dark:border-white/5 shadow-sm btn-press transition-colors duration-300 hover:border-cyan-500/30 bg-white dark:bg-transparent">
            <button
              onClick={() => changeDate(-1)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors text-slate-600 dark:text-slate-300 active:scale-90"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 px-4 py-1 text-slate-800 dark:text-white font-bold min-w-[180px] justify-center text-center text-sm">
              <CalendarIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mb-0.5" />
              <span>{formatDate(currentDate)}</span>
            </div>
            <button
              onClick={() => changeDate(1)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors text-slate-600 dark:text-slate-300 active:scale-90"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="glass-panel p-6 mb-10 relative overflow-hidden group rounded-[2.5rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-transparent shadow-xl shadow-slate-200/50 dark:shadow-none transition-colors duration-500 transform-gpu">
          <div className="flex justify-between items-center mb-6 relative z-10">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <div className="p-2 bg-orange-100 text-orange-600 rounded-lg dark:bg-orange-900/20 dark:text-orange-400 shadow-md">
                <Flame className="w-5 h-5 fill-current" />
              </div>
              {t("meal.summary_title") || "Ringkasan Nutrisi (Planned)"}
            </h3>
            <span className="text-xs font-bold bg-slate-100 dark:bg-white/5 px-3 py-1.5 rounded-full text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/5 shadow-sm">
              {t("meal.target") || "Target"}: {totalCalorieTarget} kcal
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
            {[
              {
                l: t("meal.calories") || "Kalori",
                v: totalStats.calories,
                u: "kcal",
                c: "orange",
                targetKey: totalCalorieTarget,
              },
              {
                l: t("meal.protein") || "Protein",
                v: totalStats.protein,
                u: "g",
                c: "blue",
                targetKey: 100,
              },
              {
                l: t("meal.carbs") || "Karbo",
                v: totalStats.carbs,
                u: "g",
                c: "emerald",
                targetKey: 250,
              },
              {
                l: t("meal.fat") || "Lemak",
                v: totalStats.fat,
                u: "g",
                c: "yellow",
                targetKey: 70,
              },
            ].map((stat, i) => {
              const percent = Math.min(100, (stat.v / stat.targetKey) * 100);
              return (
                <div
                  key={i}
                  className={`bg-${stat.c}-50 dark:bg-white/5 border border-${stat.c}-200 dark:border-white/10 rounded-2xl p-4 flex flex-col justify-between transition-colors duration-300 shadow-sm group/stat hover:border-${stat.c}-400 hover:shadow-md transform-gpu`}
                >
                  <p
                    className={`text-xs font-bold text-${stat.c}-700 dark:text-${stat.c}-400 uppercase tracking-wider mb-2`}
                  >
                    {stat.l}
                  </p>
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-slate-800 dark:text-white transition-colors duration-300 group-hover/stat:text-emerald-600 dark:group-hover/stat:text-emerald-500">
                        {Math.round(stat.v)}
                      </span>
                      <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                        {stat.u}
                      </span>
                    </div>
                    <div
                      className={`w-full bg-white dark:bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden border border-${stat.c}-100 dark:border-transparent`}
                    >
                      <div
                        className={`h-full bg-${stat.c}-500 rounded-full relative overflow-hidden transition-all duration-1000 ease-out will-change-transform`}
                        style={{ width: `${percent}%` }}
                      >
                        <div className="absolute inset-0 -translate-x-full group-hover/stat:animate-[shine_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10 transform-gpu">
          <div className="flex flex-col gap-4">
            <div className="glass-panel p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-white/5 bg-white dark:bg-transparent transition-colors duration-300">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 block">
                {t("meal.select_goal") || "Pilih Tujuan Diet:"}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["low-cal", "standard", "bulking"] as const).map((goal) => (
                  <button
                    key={goal}
                    onClick={() => setDietGoal(goal)}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200 btn-press ${dietGoal === goal
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                        : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10"
                      }`}
                  >
                    {t(`goal.${goal}`)}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleAiGenerate}
              disabled={isGenerating}
              className={`relative w-full overflow-hidden rounded-[2rem] p-0.5 transition-transform duration-300 group btn-press will-change-transform shadow-xl shadow-slate-200/50 dark:shadow-none
                ${isGenerating ? "scale-[0.99]" : "hover:scale-[1.01]"}`}
            >
              <div
                className={`absolute inset-0 transition-opacity duration-500
                  ${isGenerating
                    ? "bg-orange-500"
                    : "bg-cyan-500 opacity-0 group-hover:opacity-100"
                  }`}
              ></div>

              <div
                className={`relative h-full bg-white dark:bg-slate-950 rounded-[1.9rem] overflow-hidden flex flex-col justify-between p-6 m-[1px]
                ${isGenerating ? "bg-slate-50 dark:bg-slate-900" : ""}`}
              >
                <div
                  className={`absolute inset-0 opacity-10 pointer-events-none
                    bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%),linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%),linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:24px_24px]
                    ${isGenerating ? "animate-bg-scroll opacity-20" : ""}`}
                ></div>

                {isGenerating && (
                  <div className="absolute inset-x-0 h-20 animate-scan-laser z-10 pointer-events-none mix-blend-multiply dark:mix-blend-overlay"></div>
                )}

                <div className="relative z-20 flex flex-col h-full justify-between">
                  <div className="flex justify-between items-start">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <div
                        className={`absolute inset-0 border-2 rounded-full border-dashed transition-colors duration-500
                        ${isGenerating
                            ? "border-orange-500/60 animate-[spin_1s_linear_infinite]"
                            : "border-cyan-500/40 animate-[spin_10s_linear_infinite]"
                          }`}
                      ></div>
                      <div
                        className={`absolute inset-1 border-2 rounded-full border-dotted transition-colors duration-500
                        ${isGenerating
                            ? "border-red-500/60 animate-[spin_1.5s_linear_infinite_reverse]"
                            : "border-blue-500/40 animate-[spin_15s_linear_infinite_reverse]"
                          }`}
                      ></div>
                      <div className="relative z-10">
                        {isGenerating ? (
                          <Cpu className="w-8 h-8 text-orange-600 dark:text-white animate-pulse" />
                        ) : (
                          <Sparkles className="w-8 h-8 text-cyan-600 dark:text-white group-hover:scale-110 transition-transform" />
                        )}
                      </div>
                    </div>

                    <div
                      className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border transition-colors duration-500 flex items-center gap-2
                      ${isGenerating
                          ? "bg-orange-100 text-orange-600 border-orange-200 dark:bg-orange-950/80 dark:text-orange-300 dark:border-orange-500/50"
                          : "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/50 dark:text-cyan-300 dark:border-cyan-500/30"
                        }`}
                    >
                      {isGenerating ? "PROCESSING" : "AI READY"}
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3
                      className={`text-xl font-black tracking-tight transition-colors duration-300
                      ${isGenerating
                          ? "text-orange-600 dark:text-orange-400"
                          : "text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-100"
                        }`}
                    >
                      {isGenerating
                        ? "INITIALIZING AI CORE..."
                        : t("meal.ai_generate") || "AI Auto-Generate"}
                    </h3>
                    <p className="text-sm font-medium mt-2 text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                      {isGenerating
                        ? "Optimizing macro-nutrient protocols."
                        : t("meal.ai_desc") ||
                        "Biarkan AI menyusun menu harian lengkap untukmu."}
                    </p>
                  </div>
                </div>
              </div>
            </button>
          </div>

          <button
            onClick={handleManualPlan}
            className="relative overflow-hidden group glass-panel text-slate-800 p-1 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-white/5 bg-white dark:bg-transparent hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-left btn-press transform-gpu"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-emerald-50/70 dark:from-white/5 dark:to-emerald-900/10 opacity-100 transition-opacity"></div>
            <div className="relative p-5 h-full flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-emerald-100 rounded-xl text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
                  <PenTool className="w-6 h-6" />
                </div>
                <span className="bg-emerald-100 text-xs font-bold px-2 py-1 rounded text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                  {t("meal.manual") || "Manual"}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                  {t("meal.manual_title") || "Susun Manual"}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {t("meal.manual_desc") ||
                    "Pilih sendiri menu makananmu lewat pencarian AI."}
                </p>
              </div>
              <div className="absolute bottom-5 right-5 w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-white/10 text-emerald-600 dark:text-emerald-500 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20 group-hover:translate-x-1 transition-all">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 transform-gpu">
          {["breakfast", "lunch", "dinner", "snacks"].map((mealType) => {
            const style = getCategoryStyle(mealType);
            const CategoryIcon = style.icon;

            const meals = mealsData[mealType];

            const totalCalories = meals.reduce(
              (acc, curr) => acc + curr.calories,
              0
            );

            return (
              <div
                key={mealType}
                className={`glass-panel p-6 flex flex-col h-full min-h-[240px] rounded-[2.5rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-transparent shadow-xl shadow-slate-200/50 dark:shadow-none transition-colors duration-500 hover:shadow-emerald-500/10`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-3 rounded-xl ${style.bg} ${style.color} dark:bg-slate-900 shadow-sm border ${style.border}`}
                    >
                      <CategoryIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-slate-800 dark:text-white">
                        {style.label}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                        {meals.length} {t("meal.items") || "Item"} •{" "}
                        {totalCalories} kcal
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleManualPlan}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl text-slate-400 hover:text-emerald-600 transition-colors btn-press"
                    title={t("meal.add") || "Tambah"}
                  >
                    <Plus className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-3 flex-grow">
                  {meals.length > 0 ? (
                    meals.map((food) => {
                      const theme = getFoodTheme(food.name);
                      const FoodIcon = theme.icon;
                      return (
                        <div
                          key={food.id}
                          className={`relative p-4 flex items-center justify-between group rounded-xl transition-transform duration-200 shadow-sm border border-transparent hover:scale-[1.01] hover:border-emerald-200 dark:hover:border-emerald-500/20 overflow-hidden ${food.completed
                              ? "bg-emerald-50 dark:bg-emerald-900/20 opacity-80"
                              : "bg-white dark:bg-slate-800 border-slate-100 dark:border-transparent hover:shadow-lg"
                            } transform-gpu`}
                        >
                          <div className="flex items-center gap-4 relative z-10">
                            <button
                              onClick={() =>
                                toggleMealCompletion(mealType, food.id)
                              }
                              className={`p-1 rounded-full text-current transition-colors btn-press ${food.completed
                                  ? "text-emerald-600"
                                  : "text-slate-300 dark:text-slate-600 hover:text-emerald-500"
                                }`}
                            >
                              {food.completed ? (
                                <CheckCircle className="w-6 h-6 fill-emerald-100 dark:fill-emerald-900/50" />
                              ) : (
                                <Circle className="w-6 h-6" />
                              )}
                            </button>

                            <div
                              className={`w-12 h-12 flex items-center justify-center rounded-2xl shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${food.completed
                                  ? "grayscale opacity-50 bg-slate-100 dark:bg-slate-700"
                                  : `${theme.bg} border ${theme.border} shadow-lg`
                                }`}
                            >
                              <FoodIcon
                                className={`w-6 h-6 ${food.completed ? "text-slate-500" : theme.text
                                  }`}
                              />
                            </div>

                            <div
                              className={`${food.completed
                                  ? "line-through text-slate-400"
                                  : ""
                                }`}
                            >
                              <p className="font-bold text-slate-800 dark:text-white text-sm group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                                {food.name}
                              </p>
                              {food.portion && (
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                                  {food.portion}
                                </p>
                              )}
                              <div
                                className={`flex items-center gap-2 mt-1 ${food.completed ? "opacity-50" : ""
                                  }`}
                              >
                                <span className="text-xs font-medium text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 px-2 py-0.5 rounded text-center min-w-[60px]">
                                  {food.calories} kcal
                                </span>
                                <span className="text-[10px] text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 px-1.5 py-0.5 rounded">
                                  {food.protein}g P
                                </span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(mealType, food.id)}
                            className="relative z-10 opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
                            title={t("meal.remove") || "Hapus"}
                          >
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-slate-300/50 dark:border-white/10 rounded-3xl bg-slate-50/50 dark:bg-white/5 transition-all duration-300 hover:border-emerald-400/50">
                      <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">
                        {t("meal.empty") || "Kosong"}
                      </p>
                      <button
                        onClick={handleManualPlan}
                        className="mt-3 text-sm font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 px-4 py-2 rounded-xl transition-colors btn-press"
                      >
                        + {t("meal.add_manual") || "Tambah Manual"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MealPlanning;
