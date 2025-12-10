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
  image: string;
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

      if (dietGoal === "low-cal") {
        const minCal = isMale ? 1500 : 1200;
        const maxCal = isMale ? 1900 : 1600;
        const minProt = Math.round(weight * 1.6);
        const maxProt = Math.round(weight * 2.2);

        // Low Cal Specifics: Min Carbs 30-100g, Max Fat 25-40g
        targetInfo = `TARGET: Kalori ${minCal}-${maxCal} kcal. Protein ${minProt}-${maxProt}g. Karbo 30-100g. Lemak MAX 25-40g.`;
        dietInstruction = `Tujuan: CLEAN EATING (Cutting/Defisit). ${targetInfo}
           - Protein TINGGI, Lemak RENDAH, Karbo RENDAH.
           - Bahan: Dada ayam, ikan putih, putih telur, tahu/tempe, sayuran hijau.
           - Masak: Rebus, Kukus, Pepes, Bakar (tanpa minyak/sedikit). HINDARI GORENGAN & SANTAN KENTAL.`;
      } else if (dietGoal === "bulking") {
        const minCal = isMale ? 2600 : 2100;
        const maxCal = isMale ? 3200 : 2600;
        const minProt = Math.round(weight * 1.4);
        const maxProt = Math.round(weight * 1.8);

        // Bulking Specifics: Min Carbs 200-300g, Max Fat 70-90g
        targetInfo = `TARGET: Kalori ${minCal}-${maxCal} kcal. Protein ${minProt}-${maxProt}g. Karbo 200-300g. Lemak MAX 70-90g.`;
        dietInstruction = `Tujuan: BULKING (Surplus Otot). ${targetInfo}
           - Protein dan Karbohidrat kompleks TINGGI untuk energi latihan.
           - Lemak sedang (jangan berlebihan).
           - Sertakan nasi, ubi, kentang, daging, kacang-kacangan.`;
      } else {
        // Standard / Maintain
        const minCal = isMale ? 2200 : 1800;
        const maxCal = isMale ? 2600 : 2200;
        const minProt = Math.round(weight * 0.8);
        const maxProt = Math.round(weight * 1.2);

        // Standard Specifics: Carbs 150-200g, Max Fat 60-80g
        targetInfo = `TARGET: Kalori ${minCal}-${maxCal} kcal. Protein ${minProt}-${maxProt}g. Karbo 150-200g. Lemak MAX 60-80g.`;
        dietInstruction = `Tujuan: STANDARD / MAINTAIN (Seimbang). ${targetInfo}
           - Gizi seimbang (Karbo cukup untuk otak, Lemak cukup untuk hormon).
           - Menu masakan rumahan Indonesia yang sehat.`;
      }

      const userProfile = user
        ? `Profil: ${isMale ? "Laki-laki" : "Perempuan"}, ${
            user.age
          } th, ${weight}kg, ${user.height}cm`
        : "";

      const prompt = `Buatkan rencana makan 1 hari (breakfast, lunch, dinner, snacks) KHUSUS MASAKAN INDONESIA untuk:
      ${userProfile}
      ${targetInfo} (USAHAKAN MENDEKATI RANGE INI)
      
      DATABASE REFERENSI (TIDAK WAJIB PERSIS, BOLEH KREASI):
      ${nutritionList}
      
      ATURAN: 
      1. NAMA: Gunakan nama yang ENAK DIBACA, POPULER, dan PENDEK (Contoh: "Pepes Ikan", "Ayam Bakar").
      2. DATA: Gunakan angka nutrisi dari database jika ada. Jika tidak, ESTIMASI SENDIRI secara logis.
      3. FORMAT DATA: JSON valid. Jangan pakai markdown code block/backticks.
      
      ${dietInstruction}
      
      3. ICON (PENTING): Wajib gunakan emoji yang SANGAT SPESIFIK menggambarkan makanannya.
      4. PORSI/DETAIL: Wajib berikan keterangan porsi/gramasi/jumlah di field terpisah.

      Output harus format JSON valid tanpa markdown, dengan struktur:
      {
        "breakfast": [{ "id": 101, "name": "Ayam Goreng (Dada)", "portion": "1 potong besar (150g)", "calories": 0, "protein": 0, "carbs": 0, "fat": 0, "image": "🍗" }],
        "lunch": [...],
        "dinner": [...],
        "snacks": [...]
      }
      }`;

      const result = await generateAIContent(prompt);

      if (!result.success) {
        throw new Error(result.error);
      }

      const data = JSON.parse(result.data);
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
          const Icon = style.icon;
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
                    <Icon className="w-6 h-6" />
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
                          className={`text-2xl bg-white w-12 h-12 flex items-center justify-center rounded-xl shadow-sm transition-opacity ${
                            food.completed ? "grayscale opacity-70" : ""
                          }`}
                        >
                          {food.image}
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
