import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Sparkles,
  ChefHat,
  Coffee,
  Sun,
  Moon,
  Utensils,
  Flame,
  MoreHorizontal,
  Loader2,
  PenTool,
  CheckCircle,
  Circle,
  Egg,
  Fish,
  Carrot,
  Beef,
  Sandwich,
  Apple,
  Cookie,
  Drumstick,
  Soup,
  GlassWater,
} from "lucide-react";
import { generateAIContent } from "../services/ai";
import nutritionData from "../data/nutrition.json";
import { useNutrition } from "../context/NutritionContext";

// --- TYPES ---
interface Meal {
  id: number;
  name: string;
  portion?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  completed?: boolean;
}

// --- INITIAL DATA ---
const INITIAL_MEALS: Record<string, Meal[]> = {
  breakfast: [],
  lunch: [],
  dinner: [],
  snacks: [],
};

const MealPlanning: React.FC = () => {
  const navigate = useNavigate();
  const { updateNutrition } = useNutrition();
  const [currentDate, setCurrentDate] = useState(new Date());

  // Initialize mealsData from localStorage if available
  const [mealsData, setMealsData] = useState<Record<string, Meal[]>>(() => {
    const saved = localStorage.getItem("dietPlan");
    return saved ? JSON.parse(saved) : INITIAL_MEALS;
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [dietGoal, setDietGoal] = useState<"standard" | "low-cal" | "bulking">(
    "standard"
  );

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Persist mealsData to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("dietPlan", JSON.stringify(mealsData));

    // Also calculate and sync consumed nutrition to Dashboard via Context
    calculateAndSyncNutrition(mealsData);
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
      date: new Date().toISOString().split("T")[0],
    });
  };

  // --- LOGIC TANGGAL ---
  const changeDate = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  // --- ACTIONS ---
  const handleAiGenerate = async () => {
    setIsGenerating(true);
    try {
      // Prepare simplified nutrition data string to save some tokens/cleanliness
      const primaryIngredients = [
        "Ayam",
        "Telur",
        "Ikan",
        "Tahu",
        "Tempe",
        "Daging",
        "Udang", // Proteins
        "Nasi",
        "Kentang",
        "Ubi",
        "Jagung", // Carbs
        "Bayam",
        "Kangkung",
        "Wortel",
        "Brokoli",
        "Sawi", // Veggies
        "Soto",
        "Bubur",
        "Pepes",
        "Sayur", // Common dishes
      ];

      const filteredNutrition = nutritionData
        .filter((item: any) =>
          primaryIngredients.some((k) =>
            item.name.toLowerCase().includes(k.toLowerCase())
          )
        )
        // We slice to 30 to make it extremely fast
        .slice(0, 30);

      const nutritionList = filteredNutrition
        .map(
          (item: any) =>
            `- ${item.name} (${item.calories} kcal, P: ${item.proteins}g, F: ${item.fat}g, C: ${item.carbohydrate}g)`
        )
        .join("\n");

      let dietInstruction = "";
      let targetInfo = "";

      // Defaults if user is null
      const isMale = user ? user.gender === "male" : true;
      const weight = user ? user.weight : 60;

      // --- HITUNG KEBUTUHAN KALORI PERSONAL (Mifflin-St Jeor) ---
      let dailyCaloriesNeed = 2000; // Default fallback

      if (user) {
        // 1. Hitung BMR
        const weight = parseFloat(user.weight);
        const height = parseFloat(user.height);
        const age = parseInt(user.age);

        let bmr = 0;
        if (user.gender === "male") {
          bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
          bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }

        // 2. Hitung TDEE (Total Daily Energy Expenditure)
        // Asumsi aktivitas 'Moderate' (x1.35) karena user aplikasi kesehatan biasanya olahraga
        // Jika ada data activity level di user, bisa diganti dinamis.
        const activityMultiplier =
          user.activityLevel === "active" ? 1.55 : 1.35;
        dailyCaloriesNeed = Math.round(bmr * activityMultiplier);
      }

      // --- TENTUKAN TARGET BERDASARKAN GOAL ---
      let minCal = 0;
      let maxCal = 0;

      if (dietGoal === "low-cal") {
        // Cutting
        // Updated: Range random 1200 - 1600
        minCal = 1200;
        maxCal = 1600;

        const minProt = Math.round(weight * 1.6);
        const maxProt = Math.round(weight * 2.2);

        targetInfo = `TARGET HARIAN: Kalori ${minCal}-${maxCal} kcal. Protein ${minProt}-${maxProt}g.`;
        dietInstruction = `Tujuan: CLEAN EATING (Cutting/Defisit).
           - ATURAN UTAMA: Capai target kalori harian yang diminta.
           - Protein 1.6–2.2 g/kg BB.
           - Karbohidrat 30–100g. Lemak 30-50g.
           - Bahan: Dada ayam, ikan, telur, tahu/tempe, sayuran.`;
      } else if (dietGoal === "bulking") {
        // Bulking
        const target = dailyCaloriesNeed + 400;
        minCal = target;
        maxCal = target + 500;

        const minProt = Math.round(weight * 1.6);
        const maxProt = Math.round(weight * 2.0);

        targetInfo = `TARGET HARIAN: Kalori ${minCal}-${maxCal} kcal. Protein ${minProt}-${maxProt}g.`;
        dietInstruction = `Tujuan: BULKING (Surplus Otot).
           - Kalori Total WAJIB TINGGI (${minCal}+).
           - Karbohidrat & Protein TINGGI.
           - Porsi BESAR.`;
      } else {
        // Maintenance
        minCal = dailyCaloriesNeed - 200;
        maxCal = dailyCaloriesNeed + 200;

        targetInfo = `TARGET HARIAN: Kalori ${minCal}-${maxCal} kcal.`;
        dietInstruction = `Tujuan: MAINTENANCE (Seimbang).
           - Gizi seimbang. Porsi normal rumahan.`;
      }

      // --- HITUNG RANDOm TARGET (Agar bervariasi) ---
      // Pick a random number between minCal and maxCal
      const randomTarget =
        Math.floor(Math.random() * (maxCal - minCal + 1)) + minCal;

      // --- BREAKDOWN MEAL TARGETS (Based on RANDOM Target) ---
      // Pembagian: Breakfast 25%, Lunch 35%, Dinner 25%, Snack 15%
      const bfTarget = Math.round(randomTarget * 0.25);
      const lnTarget = Math.round(randomTarget * 0.35);
      const dnTarget = Math.round(randomTarget * 0.25);
      const snTarget = Math.round(randomTarget * 0.15);

      const mealTargets = `
      - BREAKFAST: ~${bfTarget} kcal
      - LUNCH: ~${lnTarget} kcal
      - DINNER: ~${dnTarget} kcal
      - SNACKS: ~${snTarget} kcal
      (TARGET TOTAL HARUS DEKAT: ${randomTarget} kcal)
      `;

      const userProfile = user
        ? `Profil: ${isMale ? "Laki-laki" : "Perempuan"}, ${
            user.age
          } th, ${weight}kg, ${user.height}cm. BMR est: ${Math.round(
            dailyCaloriesNeed / 1.35
          )}.`
        : "";

      const prompt = `Buatkan rencana makan 1 hari KHUSUS MASAKAN INDONESIA yang enak tapi sehat. 
      ${userProfile}
      ${targetInfo}
      
      PANDUAN KALORI PER MAKAN (Ikuti ini agar target tercapai):
      ${mealTargets}
      
      ${dietInstruction}
      
      DATABASE REFERENSI:
      ${nutritionList}
      
      ATURAN FORMAT:
      1. NAMA MENU: Populer & Enak (e.g., "Ayam Pop", "Pepes Ikan", "Sayur Asem").
      2. PORSI: Tulis gramasi JELAS. Jika kalori kurang, perbesar gramasinya!
      3. OUTPUT: JSON valid struktur fix (breakfast, lunch, dinner, snacks).
      
      JSON Only:
      {
        "breakfast": [{ "id": 1, "name": "...", "portion": "...", "calories": ${bfTarget}, "protein": 20, "carbs": 10, "fat": 5 }],
        "lunch": [{ "id": 2, "name": "...", "portion": "...", "calories": ${lnTarget}, "protein": 30, "carbs": 40, "fat": 10 }],
        "dinner": [...], 
        "snacks": [...]
      }`;

      const result = await generateAIContent(prompt);

      if (!result.success) {
        throw new Error(result.error);
      }

      let cleanData = result.data
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      // Attempt to find the first '{' and last '}' to handle potential extra text
      const firstBrace = cleanData.indexOf("{");
      const lastBrace = cleanData.lastIndexOf("}");

      if (firstBrace !== -1 && lastBrace !== -1) {
        cleanData = cleanData.substring(firstBrace, lastBrace + 1);
      }

      const data = JSON.parse(cleanData);
      // Ensure completion status is false for new meals
      const initializedData = Object.keys(data).reduce((acc, key) => {
        // @ts-ignore
        acc[key] = data[key].map((m) => ({ ...m, completed: false }));
        return acc;
      }, {} as Record<string, Meal[]>);

      setMealsData(initializedData);
    } catch (error: any) {
      console.error("AI Error:", error);
      alert(`Gagal membuat rencana: ${error.message || "Unknown error"}`);
    }
    setIsGenerating(false);
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

  const getFoodVisuals = (name: string, defaultStyle: any) => {
    const n = name.toLowerCase();

    // Proteins
    if (n.includes("telur") || n.includes("egg"))
      return { icon: Egg, color: "text-amber-500", bg: "bg-amber-100" };
    if (
      n.includes("ikan") ||
      n.includes("fish") ||
      n.includes("lele") ||
      n.includes("gurame")
    )
      return { icon: Fish, color: "text-blue-500", bg: "bg-blue-100" };
    if (
      n.includes("ayam") ||
      n.includes("chicken") ||
      n.includes("bebek") ||
      n.includes("drumstick")
    )
      return { icon: Drumstick, color: "text-orange-600", bg: "bg-orange-100" };
    if (
      n.includes("daging") ||
      n.includes("sapi") ||
      n.includes("beef") ||
      n.includes("burger")
    )
      return { icon: Beef, color: "text-red-600", bg: "bg-red-100" };

    // Veggies
    if (
      n.includes("sayur") ||
      n.includes("salad") ||
      n.includes("brokoli") ||
      n.includes("bayam") ||
      n.includes("pecel") ||
      n.includes("gado")
    )
      return { icon: Carrot, color: "text-green-600", bg: "bg-green-100" };

    // Carbs
    if (n.includes("roti") || n.includes("bread") || n.includes("sandwich"))
      return { icon: Sandwich, color: "text-amber-700", bg: "bg-amber-100" };
    if (n.includes("nasi") || n.includes("rice") || n.includes("bubur"))
      return { icon: Utensils, color: "text-zinc-600", bg: "bg-zinc-100" };
    if (n.includes("mie") || n.includes("pasta") || n.includes("spaghetti"))
      return { icon: Utensils, color: "text-yellow-600", bg: "bg-yellow-100" };

    // Drinks / Dairy
    if (n.includes("susu") || n.includes("milk") || n.includes("yogurt"))
      return { icon: GlassWater, color: "text-sky-500", bg: "bg-sky-100" };
    if (n.includes("kopi") || n.includes("teh"))
      return { icon: Coffee, color: "text-amber-800", bg: "bg-amber-100" };

    // Fruits
    if (
      n.includes("buah") ||
      n.includes("fruit") ||
      n.includes("apel") ||
      n.includes("pisang") ||
      n.includes("mangga") ||
      n.includes("jeruk")
    )
      return { icon: Apple, color: "text-rose-500", bg: "bg-rose-100" };

    // Others
    if (n.includes("soto") || n.includes("sop") || n.includes("sup"))
      return { icon: Soup, color: "text-yellow-500", bg: "bg-yellow-100" };
    if (
      n.includes("gorengan") ||
      n.includes("bakwan") ||
      n.includes("tahu") ||
      n.includes("tempe") ||
      n.includes("keripik")
    )
      return { icon: Cookie, color: "text-orange-400", bg: "bg-orange-50" };

    // Default fallback to category style but remove specific category specific styling if needed or keep consistent
    return {
      icon: defaultStyle.icon,
      color: "text-gray-500", // Default Neutral
      bg: "bg-gray-100",
    };
  };

  const getCategoryStyle = (type: string) => {
    switch (type) {
      case "breakfast":
        return {
          icon: Coffee,
          color: "text-orange-600",
          bg: "bg-orange-100",
          label: "Sarapan",
        };
      case "lunch":
        return {
          icon: Sun,
          color: "text-yellow-600",
          bg: "bg-yellow-100",
          label: "Makan Siang",
        };
      case "dinner":
        return {
          icon: Moon,
          color: "text-indigo-600",
          bg: "bg-indigo-100",
          label: "Makan Malam",
        };
      default:
        return {
          icon: Utensils,
          color: "text-emerald-600",
          bg: "bg-emerald-100",
          label: "Camilan",
        };
    }
  };

  const allMeals = [
    ...mealsData.breakfast,
    ...mealsData.lunch,
    ...mealsData.dinner,
    ...mealsData.snacks,
  ];
  const totalStats = allMeals.reduce(
    (acc, item) => ({
      calories: acc.calories + item.calories,
      protein: acc.protein + item.protein,
      carbs: acc.carbs + item.carbs,
      fat: acc.fat + item.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return (
    // FULL WIDTH CONTAINER
    <div className="w-full px-6 md:px-12 pb-20">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 pt-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 flex items-center gap-3">
            <span className="p-2.5 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl shadow-lg shadow-green-200">
              <ChefHat className="w-8 h-8" />
            </span>
            Meal Plan
          </h1>
          <p className="text-gray-500 mt-2 ml-1">
            Rencanakan nutrisimu, otomatis atau manual.
          </p>
        </div>

        {/* Date Navigator */}
        <div className="glass-panel px-2 py-2 flex items-center gap-2 select-none bg-white/80">
          <button
            onClick={() => changeDate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 active:scale-90"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 px-4 py-1 text-gray-800 font-bold min-w-[180px] justify-center text-center">
            <CalendarIcon className="w-4 h-4 text-green-600 mb-0.5" />
            <span>{formatDate(currentDate)}</span>
          </div>
          <button
            onClick={() => changeDate(1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 active:scale-90"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* --- SUMMARY CARD (DOUBLE CARD STYLE) --- */}
      <div className="glass-panel p-6 mb-10 relative overflow-hidden group border-white/60">
        <div className="flex justify-between items-center mb-6 relative z-10">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <div className="p-1.5 bg-orange-100 text-orange-600 rounded-lg">
              <Flame className="w-5 h-5 fill-current" />
            </div>
            Ringkasan Nutrisi (Planned)
          </h3>
          <span className="text-xs font-bold bg-white px-3 py-1.5 rounded-full text-gray-600 border border-gray-200 shadow-sm">
            Target: {user ? user.dailyCalories : 2000} kcal
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
          {/* Kalori */}
          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-16 h-16 bg-orange-200/50 rounded-full blur-xl -mr-4 -mt-4"></div>
            <p className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-2">
              Kalori
            </p>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-gray-800">
                  {Math.round(totalStats.calories)}
                </span>
                <span className="text-xs text-gray-500 font-medium">kcal</span>
              </div>
              <div className="w-full bg-white/60 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-orange-500 rounded-full"
                  style={{ width: "45%" }}
                ></div>
              </div>
            </div>
          </div>
          {/* Protein */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-16 h-16 bg-blue-200/50 rounded-full blur-xl -mr-4 -mt-4"></div>
            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
              Protein
            </p>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-gray-800">
                  {Math.round(totalStats.protein)}
                </span>
                <span className="text-xs text-gray-500 font-medium">g</span>
              </div>
              <div className="w-full bg-white/60 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: "60%" }}
                ></div>
              </div>
            </div>
          </div>
          {/* Karbo */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-16 h-16 bg-emerald-200/50 rounded-full blur-xl -mr-4 -mt-4"></div>
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">
              Karbo
            </p>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-gray-800">
                  {Math.round(totalStats.carbs)}
                </span>
                <span className="text-xs text-gray-500 font-medium">g</span>
              </div>
              <div className="w-full bg-white/60 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: "30%" }}
                ></div>
              </div>
            </div>
          </div>
          {/* Lemak */}
          <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-4 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-16 h-16 bg-yellow-200/50 rounded-full blur-xl -mr-4 -mt-4"></div>
            <p className="text-xs font-bold text-yellow-600 uppercase tracking-wider mb-2">
              Lemak
            </p>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-gray-800">
                  {Math.round(totalStats.fat)}
                </span>
                <span className="text-xs text-gray-500 font-medium">g</span>
              </div>
              <div className="w-full bg-white/60 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-yellow-500 rounded-full"
                  style={{ width: "25%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- ACTION BUTTONS (DUAL TYPE) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* 1. AUTO GENERATE BUTTON */}
        <div className="flex flex-col gap-4">
          {/* Diet Goal Select */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <label className="text-sm font-bold text-gray-700 mb-2 block">
              Pilih Tujuan Diet:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setDietGoal("low-cal")}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  dietGoal === "low-cal"
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                }`}
              >
                Rendah Kalori
              </button>
              <button
                onClick={() => setDietGoal("standard")}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  dietGoal === "standard"
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                }`}
              >
                Standard
              </button>
              <button
                onClick={() => setDietGoal("bulking")}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  dietGoal === "bulking"
                    ? "bg-orange-100 text-orange-700 border border-orange-200"
                    : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                }`}
              >
                Bulking
              </button>
            </div>
          </div>

          <button
            onClick={handleAiGenerate}
            disabled={isGenerating}
            className="relative overflow-hidden group bg-gray-900 text-white p-1 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-80 disabled:cursor-not-allowed text-left"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black opacity-100 group-hover:opacity-90 transition-opacity"></div>
            <div className="relative p-5 h-full flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div
                  className={`p-2 bg-white/20 rounded-xl backdrop-blur-sm ${
                    isGenerating ? "animate-spin" : ""
                  }`}
                >
                  {isGenerating ? (
                    <Loader2 className="w-6 h-6" />
                  ) : (
                    <Sparkles className="w-6 h-6 text-yellow-300 fill-current" />
                  )}
                </div>
                <span className="bg-white/10 text-xs font-bold px-2 py-1 rounded text-gray-300">
                  Otomatis
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">
                  {isGenerating ? "Meracik Menu..." : "AI Auto-Generate"}
                </h3>
                <p className="text-sm text-gray-400">
                  Biarkan AI menyusun menu harian lengkap untukmu.
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* 2. MANUAL PLAN BUTTON */}
        <button
          onClick={handleManualPlan}
          className="relative overflow-hidden group bg-white text-gray-800 p-1 rounded-2xl shadow-lg border border-white/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white to-green-50 opacity-100 transition-opacity"></div>
          <div className="relative p-5 h-full flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-green-100 rounded-xl text-green-600">
                <PenTool className="w-6 h-6" />
              </div>
              <span className="bg-green-100 text-xs font-bold px-2 py-1 rounded text-green-700">
                Manual
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Susun Manual
              </h3>
              <p className="text-sm text-gray-500">
                Pilih sendiri menu makananmu lewat pencarian AI.
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* --- MEAL SECTIONS GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {["breakfast", "lunch", "dinner", "snacks"].map((mealType) => {
          const style = getCategoryStyle(mealType);
          const CategoryIcon = style.icon;
          // @ts-ignore
          const meals = mealsData[mealType];
          // @ts-ignore
          const totalCalories = meals.reduce(
            (acc, curr) => acc + curr.calories,
            0
          );

          return (
            <div
              key={mealType}
              className="glass-panel p-6 flex flex-col h-full min-h-[240px] border border-white/60"
            >
              {/* Header Kategori */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-3 rounded-2xl ${style.bg} ${style.color} shadow-sm`}
                  >
                    <CategoryIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-800">
                      {style.label}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">
                      {meals.length} Item • {totalCalories} kcal
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleManualPlan}
                  className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-green-600 transition-colors active:bg-green-50"
                  title="Tambah"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </div>

              {/* List Makanan */}
              <div className="space-y-3 flex-grow">
                {/* @ts-ignore */}
                {meals.length > 0 ? (
                  // @ts-ignore
                  meals.map((food) => (
                    <div
                      key={food.id}
                      className={`glass-card p-3 flex items-center justify-between group border transition-all duration-300 ${
                        food.completed
                          ? "bg-green-50 border-green-200 opacity-80"
                          : "bg-white/50 border-transparent hover:border-green-100"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Checkbox Trigger */}
                        <button
                          onClick={() =>
                            toggleMealCompletion(mealType, food.id)
                          }
                          className={`p-1 rounded-full text-current transition-colors ${
                            food.completed
                              ? "text-green-600"
                              : "text-gray-300 hover:text-green-500"
                          }`}
                        >
                          {food.completed ? (
                            <CheckCircle className="w-6 h-6" />
                          ) : (
                            <Circle className="w-6 h-6" />
                          )}
                        </button>

                        <div
                          className={`w-12 h-12 flex items-center justify-center rounded-xl shadow-sm transition-opacity ${
                            food.completed
                              ? "grayscale opacity-70 bg-gray-100"
                              : ""
                          } ${
                            !food.completed
                              ? (() => {
                                  // Only apply color bg if not completed
                                  const visuals = getFoodVisuals(
                                    food.name,
                                    style
                                  );
                                  return visuals.bg;
                                })()
                              : ""
                          }`}
                        >
                          {(() => {
                            const visuals = getFoodVisuals(food.name, style);
                            const FoodIcon = visuals.icon;
                            // Apply custom color if active, gray if completed
                            return (
                              <FoodIcon
                                className={`w-6 h-6 ${
                                  food.completed
                                    ? "text-gray-500"
                                    : visuals.color
                                }`}
                              />
                            );
                          })()}
                        </div>
                        <div
                          className={`${
                            food.completed ? "line-through text-gray-400" : ""
                          }`}
                        >
                          <p
                            className={`font-bold text-gray-800 text-sm group-hover:text-green-700 transition-colors ${
                              food.completed ? "!text-gray-500" : ""
                            }`}
                          >
                            {food.name}
                          </p>
                          {/* @ts-ignore */}
                          {food.portion && (
                            <p className="text-[11px] text-gray-500 mb-1 font-medium">
                              {food.portion}
                            </p>
                          )}
                          <div
                            className={`flex items-center gap-2 mt-1 ${
                              food.completed ? "opacity-50" : ""
                            }`}
                          >
                            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded text-center min-w-[60px]">
                              {food.calories} kcal
                            </span>
                            <span className="text-[10px] text-gray-400 border border-gray-200 px-1.5 py-0.5 rounded">
                              {food.protein}g P
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(mealType, food.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Hapus"
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/30">
                    <p className="text-sm text-gray-400 font-medium">Kosong</p>
                    <button
                      onClick={handleManualPlan}
                      className="mt-2 text-xs font-bold text-green-600 hover:text-green-700 bg-green-50 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      + Tambah Manual
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MealPlanning;
