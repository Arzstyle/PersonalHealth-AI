import React, { useState } from "react";
import Lottie from "lottie-react";
import { generateAIContent } from "../services/ai";

const API_KEY =
  "sk-ai-v1-9b40b3d621ec2e57b142749f38d10726e04b603ca0fa29c96acabdd1777e99fb";
import {
  Dumbbell,
  Home,
  Flame,
  Activity,
  ChevronLeft,
  ChevronRight,
  Play,
  Repeat,
  Zap,
  Trophy,
  BicepsFlexed,
  Footprints,
  HeartPulse,
  Sparkles,
  PenTool,
  MoreHorizontal,
  Plus,
} from "lucide-react";

import burpeeAnim from "../animations/Burpee.json";
import squatAnim from "../animations/squat.json";
import pushupAnim from "../animations/Military Push Ups.json";
import lungeAnim from "../animations/Lunge.json";
import plankAnim from "../animations/plank.json";
import crunchAnim from "../animations/Crunches.json";
import jackAnim from "../animations/JumpingJack.json";
import situpAnim from "../animations/situp.json";
import bridgeAnim from "../animations/glutebridge.json";
import supermanAnim from "../animations/superman.json";

// --- INITIAL DATA (Empty now, relies on AI) ---
const HOME_CATEGORIES = [
  {
    id: "fullbody",
    title: "Full Body HIIT",
    desc: "Bakar lemak maksimal dengan latihan intensitas tinggi tanpa alat.",
    exercises: [
      {
        id: "h1",
        name: "Jumping Jacks",
        sets: 3,
        reps: "45 sec",
        anim: jackAnim,
        cal: 50,
        muscle: "Full Body",
      },
      {
        id: "h2",
        name: "Push Ups",
        sets: 3,
        reps: "12-15",
        anim: pushupAnim,
        cal: 30,
        muscle: "Chest & Triceps",
      },
      {
        id: "h3",
        name: "Squats",
        sets: 4,
        reps: "20",
        anim: squatAnim,
        cal: 40,
        muscle: "Legs & Glutes",
      },
      {
        id: "h4",
        name: "Burpees",
        sets: 3,
        reps: "10",
        anim: burpeeAnim,
        cal: 60,
        muscle: "Full Body",
      },
      {
        id: "h5",
        name: "Plank",
        sets: 3,
        reps: "60 sec",
        anim: plankAnim,
        cal: 20,
        muscle: "Core",
      },
    ],
  },
  {
    id: "strength",
    title: "Home Strength",
    desc: "Bangun kekuatan otot dasar menggunakan berat badan.",
    exercises: [
      {
        id: "s1",
        name: "Lunges",
        sets: 3,
        reps: "12/side",
        anim: lungeAnim,
        cal: 40,
        muscle: "Legs",
      },
      {
        id: "s2",
        name: "Diamond Push Ups",
        sets: 3,
        reps: "8-12",
        anim: pushupAnim,
        cal: 35,
        muscle: "Triceps",
      },
      {
        id: "s3",
        name: "Glute Bridges",
        sets: 4,
        reps: "15",
        anim: bridgeAnim,
        cal: 25,
        muscle: "Glutes",
      },
      {
        id: "s4",
        name: "Superman",
        sets: 3,
        reps: "15",
        anim: supermanAnim,
        cal: 20,
        muscle: "Lower Back",
      },
    ],
  },
  {
    id: "core",
    title: "Core Crusher",
    desc: "Fokus membentuk perut sixpack dan kekuatan inti.",
    exercises: [
      {
        id: "c1",
        name: "Crunches",
        sets: 4,
        reps: "20",
        anim: crunchAnim,
        cal: 25,
        muscle: "Upper Abs",
      },
      {
        id: "c2",
        name: "Leg Raises",
        sets: 3,
        reps: "15",
        anim: situpAnim,
        cal: 25,
        muscle: "Lower Abs",
      },
      {
        id: "c3",
        name: "Plank Variations",
        sets: 3,
        reps: "45 sec",
        anim: plankAnim,
        cal: 30,
        muscle: "Core Stability",
      },
    ],
  },
];

const GYM_CATEGORIES = [
  {
    id: "push",
    title: "Push Day (Chest/Tri)",
    desc: "Latihan fokus otot dorong: Dada, Bahu, dan Tricep.",
    exercises: [
      { id: "g1", name: "Bench Press", sets: 4, reps: "8-12", muscle: "Chest" },
      {
        id: "g2",
        name: "Overhead Press",
        sets: 3,
        reps: "10-12",
        muscle: "Shoulders",
      },
      {
        id: "g3",
        name: "Incline Dumbbell Press",
        sets: 3,
        reps: "10",
        muscle: "Upper Chest",
      },
      {
        id: "g4",
        name: "Tricep Pushdown",
        sets: 3,
        reps: "15",
        muscle: "Triceps",
      },
    ],
  },
  {
    id: "pull",
    title: "Pull Day (Back/Bi)",
    desc: "Latihan fokus otot tarik: Punggung dan Bicep.",
    exercises: [
      {
        id: "g5",
        name: "Lat Pulldown",
        sets: 4,
        reps: "10-12",
        muscle: "Lats",
      },
      {
        id: "g6",
        name: "Barbell Row",
        sets: 3,
        reps: "8-10",
        muscle: "Back Thickness",
      },
      {
        id: "g7",
        name: "Face Pulls",
        sets: 3,
        reps: "15",
        muscle: "Rear Delts",
      },
      { id: "g8", name: "Bicep Curls", sets: 3, reps: "12", muscle: "Biceps" },
    ],
  },
  {
    id: "legs",
    title: "Leg Day",
    desc: "Latihan kaki intensif untuk paha dan bokong.",
    exercises: [
      {
        id: "g9",
        name: "Barbell Squat",
        sets: 4,
        reps: "6-10",
        muscle: "Quads & Glutes",
      },
      {
        id: "g10",
        name: "Romanian Deadlift",
        sets: 3,
        reps: "10-12",
        muscle: "Hamstrings",
      },
      { id: "g11", name: "Leg Press", sets: 3, reps: "12", muscle: "Legs" },
      {
        id: "g12",
        name: "Calf Raises",
        sets: 4,
        reps: "15-20",
        muscle: "Calves",
      },
    ],
  },
];

const ExercisePlanning: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"home" | "gym">("home");
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // --- HELPERS ---
  const getCategoryStyle = (id: string) => {
    if (["fullbody", "push"].includes(id))
      return {
        icon: Flame,
        color: "text-orange-600",
        bg: "bg-orange-100",
        label: id,
      };
    if (["strength", "legs"].includes(id))
      return {
        icon: Dumbbell,
        color: "text-blue-600",
        bg: "bg-blue-100",
        label: id,
      };
    if (["core", "pull"].includes(id))
      return {
        icon: Zap,
        color: "text-yellow-600",
        bg: "bg-yellow-100",
        label: id,
      };
    if (["cardio"].includes(id))
      return {
        icon: HeartPulse,
        color: "text-emerald-600",
        bg: "bg-emerald-100",
        label: id,
      };
    return {
      icon: Activity,
      color: "text-purple-600",
      bg: "bg-purple-100",
      label: id,
    };
  };

  const handleManualPlan = () => {
    console.log("Navigating to manual plan (dummy)");
    // navigate('/workout-search');
  };

  const handleAiGenerate = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Buatkan rencana latihan ${
        activeTab === "home" ? "Home Workout" : "Gym Workout"
      } yang efektif.
      Output wajib JSON valid tanpa markdown, dengan struktur:
      {
        "id": "ai-generated",
        "title": "AI Personalized Plan",
        "subtitle": "Custom Routine",
        "desc": "Rencana latihan yang disesuaikan oleh AI untuk kebugaran maksimal.",
        "exercises": [
           { "id": "ai1", "name": "Nama Latihan", "muscle": "Target Otot", "sets": "3", "reps": "12" }
        ]
      }
      Berikan 5-7 variasi latihan dengan nama Bahasa Inggris/Indonesia umum.`;

      const result = await generateAIContent(prompt);

      if (!result.success) {
        throw new Error(result.error);
      }

      const data = JSON.parse(result.data);
      // Inject icon manually or handle in render
      setSelectedCategory(data);
    } catch (error) {
      console.error("AI Gen Failed", error);
      // @ts-ignore
      alert("Gagal membuat workout plan (" + error.message + ")");
    }
    setIsGenerating(false);
  };

  // Dummy Stats Data

  // --- RENDER COMPONENT: DASHBOARD (Reverted Style) ---
  const renderDashboard = () => {
    const data = activeTab === "home" ? HOME_CATEGORIES : GYM_CATEGORIES;

    return (
      <div className="animate-fade-in-up space-y-10">
        {/* --- ACTION BUTTONS (Reduced Size) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {/* AI AUTO GENERATE (Compact) */}
          <div className="group relative overflow-hidden rounded-[2rem] p-6 bg-[#1a1a1a] text-white shadow-xl flex flex-col justify-between min-h-[220px]">
            <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-30 transition-opacity">
              <Sparkles className="w-24 h-24 text-gray-400" />
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full mb-3">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300 fill-current animate-pulse" />
                <span className="text-[10px] font-bold tracking-wide uppercase">
                  Otomatis
                </span>
              </div>
              <h3 className="text-2xl font-black mb-2 leading-tight">
                AI Auto-Generate
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                Biarkan AI menyusun program latihan personal untukmu.
              </p>
            </div>

            <button
              onClick={handleAiGenerate}
              disabled={isGenerating}
              className="relative z-10 w-fit bg-white text-gray-900 px-6 py-2.5 rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-white/20 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isGenerating ? "Generating..." : "Generate Plan"}
            </button>
          </div>

          {/* MANUAL CARD (Compact) */}
          <div
            onClick={handleManualPlan}
            className="group relative overflow-hidden rounded-[2rem] p-6 bg-white border border-gray-100 shadow-lg hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between min-h-[220px]"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <PenTool className="w-20 h-20 text-green-600" />
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-green-50 px-2.5 py-1 rounded-full mb-3 text-green-700">
                <PenTool className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold tracking-wide uppercase">
                  Manual
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Susun Sendiri
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                Pilih latihan satu per satu sesuai keinginanmu.
              </p>
            </div>

            <button className="relative z-10 w-fit text-green-700 font-bold text-sm mt-4 flex items-center gap-1 group-hover:gap-2 transition-all">
              Mulai Susun <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div>
          {/* --- CATEGORIES HEADER --- */}
          <div className="flex items-center gap-2 mb-6 ml-2">
            <Flame className="w-6 h-6 text-orange-500 fill-current" />
            <h3 className="text-2xl font-bold text-gray-900">
              Kategori Latihan
            </h3>
          </div>

          {/* --- CATEGORIES GRID (Enlarged) --- */}
          <div className="grid grid-cols-1 gap-6">
            {data.map((cat: any) => {
              const style = getCategoryStyle(cat.id);
              const Icon = style.icon;
              return (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat)}
                  className="group bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col md:flex-row items-center gap-8"
                >
                  {/* Icon Box (Larger) */}
                  <div
                    className={`w-32 h-32 rounded-[2rem] ${style.bg} ${style.color} flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-14 h-14" />
                  </div>

                  {/* Content (Expanded) */}
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-3xl font-black text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-gray-500 text-lg mb-6 leading-relaxed">
                      {cat.desc}
                    </p>

                    <div className="flex flex-wrap justify-center md:justify-start gap-3">
                      {cat.exercises.slice(0, 3).map((ex: any, idx: number) => (
                        <span
                          key={idx}
                          className="bg-gray-50 text-gray-600 text-xs font-bold px-3 py-1.5 rounded-lg border border-gray-100"
                        >
                          {ex.name}
                        </span>
                      ))}
                      {cat.exercises.length > 3 && (
                        <span className="bg-gray-50 text-gray-400 text-xs font-bold px-3 py-1.5 rounded-lg border border-gray-100">
                          +{cat.exercises.length - 3} lainnya
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="md:pr-4">
                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all text-gray-300">
                      <ChevronRight className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // --- RENDER COMPONENT: DETAIL LIST (Active View) ---
  const renderDetailView = () => {
    if (!selectedCategory) return null;

    return (
      <div className="animate-fade-in-up">
        {/* Detail Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setSelectedCategory(null)}
            className="p-3 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors border border-gray-100"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              {selectedCategory.title}
            </h2>
            <p className="text-gray-500">
              {activeTab === "home" ? "Home Workout" : "Gym Workout"} •{" "}
              {selectedCategory.exercises.length} Movements
            </p>
          </div>
        </div>

        {/* Exercises List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedCategory.exercises.map((ex: any) => (
            <div
              key={ex.id}
              className="group bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
            >
              {/* Animation/Visual Area */}
              <div className="h-48 bg-gray-50 flex items-center justify-center relative border-b border-gray-100 overflow-hidden">
                {ex.anim ? (
                  <div className="w-full h-full p-6 group-hover:scale-105 transition-transform duration-500">
                    <Lottie
                      animationData={ex.anim}
                      loop={true}
                      className="h-full w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="text-gray-300 flex flex-col items-center">
                    <Dumbbell className="w-16 h-16 opacity-20" />
                    <span className="text-xs font-bold mt-2 uppercase tracking-widest opacity-40">
                      Gym Exercise
                    </span>
                  </div>
                )}

                {/* Badge Info */}
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-3 py-1.5 rounded-xl text-xs font-bold text-gray-700 shadow-sm border border-gray-100">
                  {ex.sets} Sets
                </div>
              </div>

              {/* Info Area */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 leading-tight mb-2 group-hover:text-blue-600 transition-colors">
                    {ex.name}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700">
                      <Repeat className="w-3.5 h-3.5" />
                      <span className="font-semibold">
                        {ex.reps}{" "}
                        {ex.reps.toString().toLowerCase().includes("min") ||
                        ex.reps.toString().toLowerCase().includes("sec")
                          ? ""
                          : "Reps"}
                      </span>
                    </div>
                    {ex.cal && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-50 text-orange-700">
                        <Flame className="w-3.5 h-3.5" />
                        <span className="font-semibold">~{ex.cal} kcal</span>
                      </div>
                    )}
                    {ex.muscle && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-50 text-green-700">
                        <Activity className="w-3.5 h-3.5" />
                        <span className="font-semibold">{ex.muscle}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <button className="w-full mt-6 py-3 rounded-xl bg-gray-900 text-white font-bold text-sm hover:bg-gray-800 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-gray-200">
                  <Play className="w-4 h-4 fill-current" />
                  Start Session
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full px-6 md:px-12 pb-20">
      {/* --- HEADER UTAMA (Matching Meal) --- */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 pt-4">
        {/* Title */}
        <div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 flex items-center gap-3">
            <span className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl shadow-lg shadow-blue-200">
              <Trophy className="w-8 h-8" />
            </span>
            Workout Plan
          </h1>
          <p className="text-gray-500 mt-2 ml-1">
            Pilih jenis latihanmu hari ini.
          </p>
        </div>

        {/* Toggle pill (Date style) */}
        {/* Toggle pill (Home/Gym) */}
        <div className="flex bg-white rounded-full p-1.5 shadow-sm border border-gray-200">
          <button
            onClick={() => {
              setActiveTab("home");
              setSelectedCategory(null);
            }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
              activeTab === "home"
                ? "bg-gray-900 text-white shadow-lg"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Home className="w-4 h-4" />
            Home
          </button>
          <button
            onClick={() => {
              setActiveTab("gym");
              setSelectedCategory(null);
            }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
              activeTab === "gym"
                ? "bg-gray-900 text-white shadow-lg"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Dumbbell className="w-4 h-4" />
            Gym
          </button>
        </div>
      </div>

      {/* Render Content */}
      <div className="transition-all duration-300">
        {selectedCategory ? renderDetailView() : renderDashboard()}
      </div>
    </div>
  );
};

export default ExercisePlanning;
