import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Flame,
  Target,
  Activity,
  Apple,
  Dumbbell,
  Search,
  TrendingUp,
} from "lucide-react";
import { calculateMacroTargets } from "../utils/calculations";
import type { User } from "../types";
import { useNutrition } from "../context/NutritionContext";

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const { nutrition: todayNutrition } = useNutrition();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, []);

  // Calculate Target based on Active Meal Plan (if exists), otherwise fallback to User Goal
  const [planTargets, setPlanTargets] = useState<{
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  } | null>(null);

  useEffect(() => {
    try {
      const savedPlan = localStorage.getItem("dietPlan");
      if (savedPlan && user) {
        const parsedPlan = JSON.parse(savedPlan);
        const allItems = Object.values(parsedPlan).flat() as any[];

        if (allItems.length > 0) {
          const total = allItems.reduce(
            (acc, item) => ({
              calories: acc.calories + (Number(item.calories) || 0),
              protein: acc.protein + (Number(item.protein) || 0),
              carbs: acc.carbs + (Number(item.carbs) || 0),
              fat: acc.fat + (Number(item.fat) || 0),
            }),
            { calories: 0, protein: 0, carbs: 0, fat: 0 }
          );

          // Ensure we don't set invalid numbers (NaN or Infinity)
          if (!isNaN(total.calories)) {
            setPlanTargets(total);
          }
        }
      }
    } catch (e) {
      console.error("Error loading plan for dashboard", e);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // Use Plan Targets if available, else User Defaults
  const targetCalories = planTargets?.calories || user.dailyCalories;
  const targetSplit =
    planTargets || calculateMacroTargets(user.dailyCalories, user.goal);

  // Kalkulasi Chart Lingkaran (Donut Chart)
  // Prevent division by zero
  const safeTargetCalories = targetCalories > 0 ? targetCalories : 2000;
  const caloriesPercent = Math.min(
    100,
    (todayNutrition.calories / safeTargetCalories) * 100
  );
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (caloriesPercent / 100) * circumference;

  return (
    // FULL WIDTH CONTAINER dengan Padding Internal yang Konsisten
    <div className="w-full px-6 md:px-12 space-y-10">
      {/* --- Header --- */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Halo, {user.name} 👋
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            Dashboard performa kesehatanmu hari ini.
          </p>
        </div>
        <div className="bg-white px-5 py-2.5 rounded-full shadow-sm border border-gray-100 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
          <span className="font-medium text-gray-600">Status: Aktif</span>
        </div>
      </header>

      {/* --- Main Stats Area --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 1. Hero Card: Calorie Chart */}
        <div className="lg:col-span-2 stat-card bg-white p-8 flex flex-col md:flex-row items-center justify-between gap-8 border border-gray-100">
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 font-bold text-sm">
              <Flame className="w-4 h-4" /> Daily Energy
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight">
              {Math.round(todayNutrition.calories)}
              <span className="text-2xl text-gray-400 font-medium ml-2">
                kcal
              </span>
            </h2>
            <p className="text-gray-500 text-lg">
              Target harian: <strong>{Math.round(targetCalories)} kcal</strong>.
              {caloriesPercent < 100 ? " Semangat!" : " Tercapai!"}
            </p>
          </div>

          {/* Donut Chart */}
          <div className="relative w-48 h-48 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r={radius}
                stroke="#f3f4f6"
                strokeWidth="12"
                fill="transparent"
              />
              <circle
                cx="96"
                cy="96"
                r={radius}
                stroke="#f97316"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-gray-900">
                {Math.round(caloriesPercent)}%
              </span>
            </div>
          </div>
        </div>

        {/* 2. Weight Card */}
        <div className="stat-card bg-purple-50 p-8 flex flex-col justify-center border border-purple-100">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-purple-600 font-bold uppercase tracking-wider mb-1">
                Berat Badan
              </p>
              <h3 className="text-4xl font-black text-gray-900">
                {user.weight}{" "}
                <span className="text-xl text-gray-500 font-medium">kg</span>
              </h3>
            </div>
            <div className="bg-white p-3 rounded-2xl shadow-sm text-purple-500">
              <Target className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-auto">
            <div className="flex justify-between text-sm text-purple-700 font-medium mb-2">
              <span>Goal</span>
              <span>{user.idealWeight} kg</span>
            </div>
            <div className="w-full bg-white h-2.5 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 w-3/4 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Nutrisi Cards --- */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Activity className="w-5 h-5 text-gray-400" /> Detail Nutrisi
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Protein */}
          <div className="stat-card bg-blue-50 p-6 border border-blue-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-sm">
                <Dumbbell className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-blue-600 uppercase">
                  Protein
                </p>
                <p className="text-xs text-blue-400">Pembangun Otot</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800">
              {Math.round(todayNutrition.protein)}{" "}
              <span className="text-base text-gray-400 font-normal">
                / {Math.round(targetSplit.protein)}g
              </span>
            </p>
            <div className="w-full bg-blue-200/50 h-1.5 rounded-full mt-4">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{
                  width: `${Math.min(
                    100,
                    (todayNutrition.protein / targetSplit.protein) * 100
                  )}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Karbo */}
          <div className="stat-card bg-green-50 p-6 border border-green-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-green-500 shadow-sm">
                <Apple className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-green-600 uppercase">
                  Karbohidrat
                </p>
                <p className="text-xs text-green-400">Energi Utama</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800">
              {Math.round(todayNutrition.carbs)}{" "}
              <span className="text-base text-gray-400 font-normal">
                / {Math.round(targetSplit.carbs)}g
              </span>
            </p>
            <div className="w-full bg-green-200/50 h-1.5 rounded-full mt-4">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{
                  width: `${Math.min(
                    100,
                    (todayNutrition.carbs / targetSplit.carbs) * 100
                  )}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Lemak */}
          <div className="stat-card bg-yellow-50 p-6 border border-yellow-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-yellow-500 shadow-sm">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-yellow-600 uppercase">
                  Lemak
                </p>
                <p className="text-xs text-yellow-500">Cadangan Energi</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800">
              {Math.round(todayNutrition.fat)}{" "}
              <span className="text-base text-gray-400 font-normal">
                / {Math.round(targetSplit.fat)}g
              </span>
            </p>
            <div className="w-full bg-yellow-200/50 h-1.5 rounded-full mt-4">
              <div
                className="h-full bg-yellow-500 rounded-full"
                style={{
                  width: `${Math.min(
                    100,
                    (todayNutrition.fat / targetSplit.fat) * 100
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Quick Actions --- */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Menu Cepat</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            to="/meals"
            className="group bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-all border-l-4 border-l-green-500"
          >
            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-4 group-hover:scale-110 transition-transform">
              <Apple className="w-7 h-7" />
            </div>
            <h4 className="font-bold text-gray-800 text-lg">Catat Makan</h4>
            <p className="text-sm text-gray-500 mt-1">Input kalori harianmu</p>
          </Link>

          <Link
            to="/exercises"
            className="group bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-all border-l-4 border-l-blue-500"
          >
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
              <Dumbbell className="w-7 h-7" />
            </div>
            <h4 className="font-bold text-gray-800 text-lg">Latihan</h4>
            <p className="text-sm text-gray-500 mt-1">Mulai workout rutin</p>
          </Link>

          <Link
            to="/food-search"
            className="group bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-all border-l-4 border-l-purple-500"
          >
            <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
              <Search className="w-7 h-7" />
            </div>
            <h4 className="font-bold text-gray-800 text-lg">Cari Makanan</h4>
            <p className="text-sm text-gray-500 mt-1">Cek info nutrisi</p>
          </Link>

          <Link
            to="/progress"
            className="group bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-all border-l-4 border-l-orange-500"
          >
            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 mb-4 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-7 h-7" />
            </div>
            <h4 className="font-bold text-gray-800 text-lg">Progress</h4>
            <p className="text-sm text-gray-500 mt-1">Pantau hasilmu</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
