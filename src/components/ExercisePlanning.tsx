import React, { useState, useEffect } from "react";
import Lottie from "lottie-react";
import { generateExercisePlanAI } from "../services/ai";
import { useUI } from "../context/UIContext";

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
  Sparkles,
  PenTool,
  Shield,
  Cpu,
  Sword,
  Layers,
  Crosshair,
  X,
  Pause,
  CheckCircle,
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

const HOME_CATEGORIES = [
  {
    id: "fullbody",
    title: "Full Body Spec-Ops",
    desc: "Latihan intensitas tempur untuk pembakaran kalori maksimal.",
    icon: Flame,
    color: "orange",
    exercises: [
      {
        id: "h1",
        name: "Jumping Jacks",
        sets: 3,
        reps: "45 sec",
        anim: jackAnim,
        cal: 50,
        muscle: "Total Body",
        difficulty: 40,
      },
      {
        id: "h2",
        name: "Push Ups",
        sets: 3,
        reps: "12-15",
        anim: pushupAnim,
        cal: 30,
        muscle: "Chest Core",
        difficulty: 60,
      },
      {
        id: "h3",
        name: "Squats",
        sets: 4,
        reps: "20",
        anim: squatAnim,
        cal: 40,
        muscle: "Legs Glutes",
        difficulty: 50,
      },
      {
        id: "h4",
        name: "Burpees",
        sets: 3,
        reps: "10",
        anim: burpeeAnim,
        cal: 60,
        muscle: "Explosive",
        difficulty: 90,
      },
      {
        id: "h5",
        name: "Plank",
        sets: 3,
        reps: "60 sec",
        anim: plankAnim,
        cal: 20,
        muscle: "Core Stabilizer",
        difficulty: 70,
      },
    ],
  },
  {
    id: "strength",
    title: "Core Stability Protocol",
    desc: "Bangun fondasi kekuatan otot dasar dengan gravitasi.",
    icon: Shield,
    color: "blue",
    exercises: [
      {
        id: "s1",
        name: "Lunges",
        sets: 3,
        reps: "12/side",
        anim: lungeAnim,
        cal: 40,
        muscle: "Legs",
        difficulty: 50,
      },
      {
        id: "s2",
        name: "Diamond Push Ups",
        sets: 3,
        reps: "8-12",
        anim: pushupAnim,
        cal: 35,
        muscle: "Triceps",
        difficulty: 75,
      },
      {
        id: "s3",
        name: "Glute Bridges",
        sets: 4,
        reps: "15",
        anim: bridgeAnim,
        cal: 25,
        muscle: "Glutes",
        difficulty: 30,
      },
      {
        id: "s4",
        name: "Superman",
        sets: 3,
        reps: "15",
        anim: supermanAnim,
        cal: 20,
        muscle: "Lower Back",
        difficulty: 40,
      },
    ],
  },
  {
    id: "core",
    title: "Abs Armor Forge",
    desc: "Tempa otot perut sekeras baja dengan isolasi terpusat.",
    icon: Zap,
    color: "yellow",
    exercises: [
      {
        id: "c1",
        name: "Crunches",
        sets: 4,
        reps: "20",
        anim: crunchAnim,
        cal: 25,
        muscle: "Upper Abs",
        difficulty: 45,
      },
      {
        id: "c2",
        name: "Leg Raises",
        sets: 3,
        reps: "15",
        anim: situpAnim,
        cal: 25,
        muscle: "Lower Abs",
        difficulty: 60,
      },
      {
        id: "c3",
        name: "Plank Variations",
        sets: 3,
        reps: "45 sec",
        anim: plankAnim,
        cal: 30,
        muscle: "Core Stability",
        difficulty: 70,
      },
    ],
  },
];

const GYM_CATEGORIES = [
  {
    id: "push",
    title: "Push Mechanics",
    desc: "Sistem dorong mekanis: Dada, Bahu, dan Tricep.",
    icon: Sword,
    color: "red",
    exercises: [
      {
        id: "g1",
        name: "Bench Press",
        sets: 4,
        reps: "8-12",
        muscle: "Chest",
        difficulty: 80,
      },
      {
        id: "g2",
        name: "Overhead Press",
        sets: 3,
        reps: "10-12",
        muscle: "Shoulders",
        difficulty: 75,
      },
      {
        id: "g3",
        name: "Incline Press",
        sets: 3,
        reps: "10",
        muscle: "Upper Chest",
        difficulty: 70,
      },
      {
        id: "g4",
        name: "Tricep Pushdown",
        sets: 3,
        reps: "15",
        muscle: "Triceps",
        difficulty: 50,
      },
    ],
  },
  {
    id: "pull",
    title: "Pull Dynamics",
    desc: "Sistem tarik dinamis: Punggung dan Bicep.",
    icon: Layers,
    color: "cyan",
    exercises: [
      {
        id: "g5",
        name: "Lat Pulldown",
        sets: 4,
        reps: "10-12",
        muscle: "Lats",
        difficulty: 65,
      },
      {
        id: "g6",
        name: "Barbell Row",
        sets: 3,
        reps: "8-10",
        muscle: "Back Thickness",
        difficulty: 85,
      },
      {
        id: "g7",
        name: "Face Pulls",
        sets: 3,
        reps: "15",
        muscle: "Rear Delts",
        difficulty: 40,
      },
      {
        id: "g8",
        name: "Bicep Curls",
        sets: 3,
        reps: "12",
        muscle: "Biceps",
        difficulty: 50,
      },
    ],
  },
  {
    id: "legs",
    title: "Leg Hydraulics",
    desc: "Latihan kaki hidrolik untuk daya ledak bawah.",
    icon: Activity,
    color: "emerald",
    exercises: [
      {
        id: "g9",
        name: "Barbell Squat",
        sets: 4,
        reps: "6-10",
        muscle: "Quads & Glutes",
        difficulty: 95,
      },
      {
        id: "g10",
        name: "Romanian Deadlift",
        sets: 3,
        reps: "10-12",
        muscle: "Hamstrings",
        difficulty: 85,
      },
      {
        id: "g11",
        name: "Leg Press",
        sets: 3,
        reps: "12",
        muscle: "Legs",
        difficulty: 70,
      },
      {
        id: "g12",
        name: "Calf Raises",
        sets: 4,
        reps: "15-20",
        muscle: "Calves",
        difficulty: 30,
      },
    ],
  },
];

const WorkoutSessionOverlay = ({
  exercise,
  onClose,
}: {
  exercise: any;
  onClose: () => void;
}) => {
  const [phase, setPhase] = useState<"countdown" | "active" | "rest">(
    "countdown"
  );
  const [countdown, setCountdown] = useState(3);
  const [timer, setTimer] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (phase === "countdown") {
      if (countdown > 0) {
        const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
        return () => clearTimeout(t);
      } else {
        setPhase("active");
      }
    }
  }, [countdown, phase]);

  useEffect(() => {
    let interval: any;
    if (phase === "active" && !isPaused) {
      interval = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [phase, isPaused]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleFinishSet = () => {
    if (currentSet < exercise.sets) {
      setCurrentSet((c) => c + 1);
      setTimer(0);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed top-0 left-0 w-screen h-screen z-[9999] bg-slate-950 flex flex-col overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[linear-gradient(to_right,#06b6d41a_1px,transparent_1px),linear-gradient(to_bottom,#06b6d41a_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      <div className="absolute top-0 inset-x-0 h-1 bg-cyan-500 shadow-[0_0_20px_cyan]"></div>
      <div className="absolute bottom-0 inset-x-0 h-1 bg-cyan-500 shadow-[0_0_20px_cyan]"></div>

      <div className="relative z-10 flex justify-between items-center p-6 border-b border-white/10 bg-slate-900/50 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-cyan-500/20 rounded-lg border border-cyan-500/50">
            <Activity className="w-6 h-6 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-wider uppercase">
              {exercise.name}
            </h2>
            <p className="text-xs text-cyan-400 font-mono tracking-widest">
              PROTOCOL: ACTIVE
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-red-500/20 rounded-full group transition-colors"
        >
          <X className="w-8 h-8 text-slate-400 group-hover:text-red-500" />
        </button>
      </div>

      <div className="flex-1 relative flex items-center justify-center p-6">
        {phase === "countdown" && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
            <div className="text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-cyan-400 to-blue-600 animate-ping font-mono">
              {countdown > 0 ? countdown : "GO!"}
            </div>
          </div>
        )}

        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-square lg:aspect-video bg-slate-900/50 rounded-3xl border border-cyan-500/30 overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.1)]">
            <div className="absolute top-4 left-4 w-4 h-4 border-l-2 border-t-2 border-cyan-400"></div>
            <div className="absolute top-4 right-4 w-4 h-4 border-r-2 border-t-2 border-cyan-400"></div>
            <div className="absolute bottom-4 left-4 w-4 h-4 border-l-2 border-b-2 border-cyan-400"></div>
            <div className="absolute bottom-4 right-4 w-4 h-4 border-r-2 border-b-2 border-cyan-400"></div>

            {exercise.anim && (
              <div className="w-full h-full p-8">
                <Lottie
                  animationData={exercise.anim}
                  loop={!isPaused}
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-cyan-500/5 group-hover:bg-cyan-500/10 transition-colors"></div>
              <span className="text-sm text-cyan-500 font-bold tracking-[0.2em] uppercase mb-2 block">
                Duration
              </span>
              <div className="text-8xl font-black text-white font-mono tracking-tighter shadow-black drop-shadow-lg">
                {formatTime(timer)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center">
                <span className="text-xs text-slate-400 uppercase tracking-wider">
                  Current Set
                </span>
                <div className="text-4xl font-bold text-white mt-1">
                  {currentSet}{" "}
                  <span className="text-xl text-slate-500">
                    / {exercise.sets}
                  </span>
                </div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center">
                <span className="text-xs text-slate-400 uppercase tracking-wider">
                  Target
                </span>
                <div className="text-4xl font-bold text-white mt-1">
                  {exercise.reps}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className={`p-4 rounded-xl font-bold flex items-center justify-center gap-2 border transition-all ${
                  isPaused
                    ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
                    : "bg-slate-800 text-white border-white/10 hover:bg-slate-700"
                }`}
              >
                {isPaused ? (
                  <Play className="fill-current" />
                ) : (
                  <Pause className="fill-current" />
                )}
                {isPaused ? "RESUME" : "PAUSE"}
              </button>

              <button
                onClick={handleFinishSet}
                className="p-4 rounded-xl font-bold flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/30 hover:scale-[1.02] active:scale-95 transition-all"
              >
                <CheckCircle className="w-5 h-5" />
                {currentSet === exercise.sets ? "FINISH EXERCISE" : "NEXT SET"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ExercisePlanning: React.FC = () => {
  const { t } = useUI();
  const [activeTab, setActiveTab] = useState<"home" | "gym">("home");
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const [activeSessionExercise, setActiveSessionExercise] = useState<
    any | null
  >(null);

  const [generatedWorkout, setGeneratedWorkout] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUserProfile(JSON.parse(storedUser));
  }, []);

  const handleAiGenerate = async () => {
    if (!userProfile) {
      alert("Please complete your profile first.");
      return;
    }

    setIsGenerating(true);
    try {
      const targetCals = userProfile.dailyCalories || 2000;

      const plan = await generateExercisePlanAI(
        targetCals,
        userProfile.goal || "general",
        userProfile.activityLevel || "moderate",
        {
          weight: userProfile.weight || 70,
          height: userProfile.height || 170,
          age: userProfile.age || 25,
          gender: userProfile.gender || "male",
        }
      );

      if (plan) {
        const combinedExercises = [
          ...plan.warm_up.map((e, i) => ({
            ...e,
            id: `ai-wu-${i}`,
            difficulty: e.difficulty || 20,
            muscle: e.muscle || "Warm Up",
          })),
          ...plan.main_workout.map((e, i) => ({
            ...e,
            id: `ai-main-${i}`,
            difficulty: e.difficulty || 50,
            muscle: e.muscle || "Target",
          })),
          ...plan.cool_down.map((e, i) => ({
            ...e,
            id: `ai-cd-${i}`,
            difficulty: e.difficulty || 10,
            muscle: e.muscle || "Cool Down",
          })),
        ];

        const aiCategory = {
          id: "ai-generated",
          title: "AI Adaptive Protocol",
          desc: `Personalized session targeting ~${Math.round(
            targetCals * 0.3
          )} kcal burn.`,
          icon: Cpu,
          color: "cyan",
          exercises: combinedExercises,
        };

        setGeneratedWorkout([aiCategory]);
        setActiveTab("home");
        setSelectedCategory(aiCategory);
      }
    } catch (error) {
      console.error("AI Gen Error", error);
      alert("AI Generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleManualPlan = () => {};

  const getCategoryStyle = (cat: any) => {
    const colors: any = {
      orange: {
        bg: "bg-orange-100 dark:bg-orange-900/20",
        text: "text-orange-600 dark:text-orange-400",
        border: "border-orange-200 dark:border-orange-500/30",
      },
      blue: {
        bg: "bg-blue-100 dark:bg-blue-900/20",
        text: "text-blue-600 dark:text-blue-400",
        border: "border-blue-200 dark:border-blue-500/30",
      },
      yellow: {
        bg: "bg-yellow-100 dark:bg-yellow-900/20",
        text: "text-yellow-600 dark:text-yellow-400",
        border: "border-yellow-200 dark:border-yellow-500/30",
      },
      red: {
        bg: "bg-red-100 dark:bg-red-900/20",
        text: "text-red-600 dark:text-red-400",
        border: "border-red-200 dark:border-red-500/30",
      },
      cyan: {
        bg: "bg-cyan-100 dark:bg-cyan-900/20",
        text: "text-cyan-600 dark:text-cyan-400",
        border: "border-cyan-200 dark:border-cyan-500/30",
      },
      emerald: {
        bg: "bg-emerald-100 dark:bg-emerald-900/20",
        text: "text-emerald-600 dark:text-emerald-400",
        border: "border-emerald-200 dark:border-emerald-500/30",
      },
    };
    return colors[cat.color] || colors.blue;
  };

  const renderDashboard = () => {
    let data = activeTab === "home" ? HOME_CATEGORIES : GYM_CATEGORIES;

    if (generatedWorkout && activeTab === "home") {
      data = [...generatedWorkout, ...data];
    }

    return (
      <div className="animate-enter w-full space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 transform-gpu">
          <button
            onClick={handleAiGenerate}
            disabled={isGenerating}
            className={`relative w-full overflow-hidden rounded-[2rem] p-0.5 transition-transform duration-300 group btn-press will-change-transform shadow-xl shadow-slate-200/50 dark:shadow-none
              ${isGenerating ? "scale-[0.99]" : "hover:scale-[1.01]"}`}
          >
            <div
              className={`absolute inset-0 transition-opacity duration-500
                ${
                  isGenerating
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

              <div className="relative z-20 flex flex-col h-full justify-between min-h-[140px]">
                <div className="flex justify-between items-start">
                  <div className="relative w-14 h-14 flex items-center justify-center">
                    <div
                      className={`absolute inset-0 border-2 rounded-full border-dashed transition-colors duration-500
                      ${
                        isGenerating
                          ? "border-orange-500/60 animate-[spin_1s_linear_infinite]"
                          : "border-cyan-500/40 animate-[spin_10s_linear_infinite]"
                      }`}
                    ></div>
                    <div className="relative z-10">
                      {isGenerating ? (
                        <Cpu className="w-7 h-7 text-orange-600 dark:text-white animate-pulse" />
                      ) : (
                        <Sparkles className="w-7 h-7 text-cyan-600 dark:text-white group-hover:scale-110 transition-transform" />
                      )}
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border transition-colors duration-500 flex items-center gap-2
                    ${
                      isGenerating
                        ? "bg-orange-100 text-orange-600 border-orange-200 dark:bg-orange-950/80 dark:text-orange-300"
                        : "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/50 dark:text-cyan-300"
                    }`}
                  >
                    {isGenerating ? "ANALYZING" : "AI TRAINER"}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">
                    {isGenerating
                      ? "GENERATING PROTOCOL..."
                      : t("exercise.generate")}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {t("exercise.subtitle")}
                  </p>
                </div>
              </div>
            </div>
          </button>

          <button
            onClick={handleManualPlan}
            className="relative overflow-hidden group glass-panel text-slate-800 p-1 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-white/5 bg-white dark:bg-transparent hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-left btn-press transform-gpu"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-emerald-50/70 dark:from-white/5 dark:to-emerald-900/10 opacity-100 transition-opacity"></div>
            <div className="relative p-6 h-full flex flex-col justify-between min-h-[140px]">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-xl text-emerald-600 dark:text-emerald-400">
                  <PenTool className="w-6 h-6" />
                </div>
                <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold px-2 py-1 rounded">
                  MANUAL
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                  Susun Sendiri
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Pilih latihan satu per satu sesuai keinginanmu.
                </p>
              </div>
            </div>
          </button>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg text-orange-600 dark:text-orange-400 shadow-sm">
              <Crosshair className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Training Modules
            </h3>
          </div>

          <div className="space-y-4">
            {data.map((cat: any) => {
              const style = getCategoryStyle(cat);
              const Icon = cat.icon;
              return (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat)}
                  className={`group relative overflow-hidden bg-white dark:bg-slate-900/50 rounded-[2rem] p-6 border border-slate-200 dark:border-white/5 hover:border-${cat.color}-400 dark:hover:border-${cat.color}-500/50 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-lg`}
                >
                  <div className="flex items-center gap-6 relative z-10">
                    <div
                      className={`w-20 h-20 rounded-2xl ${style.bg} ${style.text} flex items-center justify-center shrink-0 border ${style.border} group-hover:scale-110 transition-transform duration-500`}
                    >
                      <Icon className="w-10 h-10" />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                        {cat.title}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                        {cat.desc}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {cat.exercises
                          .slice(0, 3)
                          .map((ex: any, idx: number) => (
                            <span
                              key={idx}
                              className="text-[10px] font-bold px-2 py-1 rounded bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/5"
                            >
                              {ex.name}
                            </span>
                          ))}
                        {cat.exercises.length > 3 && (
                          <span className="text-[10px] font-bold px-2 py-1 rounded bg-slate-100 dark:bg-white/5 text-slate-400 border border-slate-200 dark:border-white/5">
                            +{cat.exercises.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-cyan-500 group-hover:text-white transition-all">
                      <ChevronRight className="w-5 h-5" />
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

  const renderDetailView = () => {
    if (!selectedCategory) return null;

    return (
      <div className="animate-enter w-full transform-gpu">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setSelectedCategory(null)}
            className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-white/10 group"
          >
            <ChevronLeft className="w-6 h-6 text-slate-700 dark:text-slate-300 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {selectedCategory.title}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 rounded bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 text-[10px] font-bold uppercase tracking-wide border border-cyan-200 dark:border-cyan-500/20">
                {activeTab === "home" ? "Home Ops" : "Gym Ops"}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {selectedCategory.exercises.length} Protocols Loaded
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedCategory.exercises.map((ex: any, idx: number) => (
            <div
              key={ex.id}
              className={`group bg-white dark:bg-slate-900/80 rounded-[2rem] shadow-lg border border-slate-200 dark:border-white/5 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full animate-enter delay-${
                idx * 100
              }`}
            >
              <div className="h-56 bg-slate-50 dark:bg-slate-800/30 flex items-center justify-center relative border-b border-slate-100 dark:border-white/5 overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.1)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

                {ex.anim ? (
                  <div className="w-full h-full p-6 group-hover:scale-110 transition-transform duration-700 relative z-10">
                    <Lottie
                      animationData={ex.anim}
                      loop={true}
                      className="h-full w-full object-contain drop-shadow-xl"
                    />
                  </div>
                ) : (
                  <div className="text-slate-300 dark:text-slate-600 flex flex-col items-center">
                    <Dumbbell className="w-16 h-16 opacity-20" />
                    <span className="text-xs font-bold mt-2 uppercase tracking-widest opacity-40">
                      No Visual Data
                    </span>
                  </div>
                )}

                <div className="absolute top-3 left-3 flex gap-2">
                  <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur px-2 py-1 rounded-md text-[10px] font-bold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 shadow-sm flex items-center gap-1">
                    <Layers className="w-3 h-3 text-blue-500" /> {ex.sets}{" "}
                    {t("exercise.sets")}
                  </div>
                </div>

                <div className="absolute bottom-0 inset-x-0 h-1 bg-slate-200 dark:bg-white/5">
                  <div
                    className={`h-full ${
                      ex.difficulty > 70
                        ? "bg-red-500"
                        : ex.difficulty > 40
                        ? "bg-orange-500"
                        : "bg-green-500"
                    } transition-all duration-1000`}
                    style={{ width: `${ex.difficulty || 50}%` }}
                  ></div>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1 relative bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                      {ex.name}
                    </h3>
                    <div
                      className={`w-2 h-2 rounded-full ${
                        ex.difficulty > 70
                          ? "bg-red-500 shadow-[0_0_5px_red]"
                          : "bg-green-500 shadow-[0_0_5px_green]"
                      }`}
                    ></div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <div className="flex flex-col bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl border border-slate-100 dark:border-white/5">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-0.5">
                        Reps/Time
                      </span>
                      <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200 font-mono text-sm font-bold">
                        <Repeat className="w-3.5 h-3.5 text-blue-500" />{" "}
                        {ex.reps}
                      </div>
                    </div>

                    <div className="flex flex-col bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl border border-slate-100 dark:border-white/5">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-0.5">
                        Est. Burn
                      </span>
                      <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200 font-mono text-sm font-bold">
                        <Flame className="w-3.5 h-3.5 text-orange-500" />{" "}
                        {ex.cal || "-"}
                      </div>
                    </div>

                    <div className="col-span-2 flex flex-col bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl border border-slate-100 dark:border-white/5">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-0.5">
                        Target Muscle
                      </span>
                      <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200 font-mono text-xs font-bold truncate">
                        <Activity className="w-3.5 h-3.5 text-emerald-500" />{" "}
                        {ex.muscle || "General"}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveSessionExercise(ex)}
                  className="group/btn relative w-full mt-6 py-3 rounded-xl bg-slate-900 dark:bg-cyan-600 text-white font-bold text-sm overflow-hidden shadow-lg shadow-slate-900/20 dark:shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                  <div className="relative flex items-center justify-center gap-2">
                    <Play className="w-4 h-4 fill-current group-hover/btn:scale-125 transition-transform" />
                    INITIATE
                  </div>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-[1800px] mx-auto px-6 lg:px-10 pb-20 relative">
      {activeSessionExercise && (
        <WorkoutSessionOverlay
          exercise={activeSessionExercise}
          onClose={() => setActiveSessionExercise(null)}
        />
      )}

      <div className="absolute inset-0 -z-10 h-full w-full bg-slate-50 dark:bg-transparent bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      <style>{`
          @keyframes bg-scroll { from { background-position: 0 0; } to { background-position: 20px 20px; } }
          .animate-bg-scroll { animation: bg-scroll 1s linear infinite; }
          @keyframes scan { 0% { transform: translateY(0%); } 100% { transform: translateY(300px); } }
          .animate-scan { animation: scan 2s linear infinite; }
      `}</style>

      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 pt-6 animate-enter transform-gpu">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white flex items-center gap-4 drop-shadow-sm">
            <div className="relative p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-cyan-500/30 shadow-lg shadow-slate-200/50 dark:shadow-none transition-transform hover:scale-105 group overflow-hidden">
              <div className="absolute inset-0 bg-blue-100/50 dark:bg-blue-500/10 animate-pulse"></div>
              <Trophy className="w-8 h-8 text-blue-600 dark:text-blue-400 relative z-10" />
            </div>
            {t("exercise.title")}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-3 ml-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            {t("exercise.subtitle")}
          </p>
        </div>

        <div className="flex bg-white dark:bg-slate-900 rounded-full p-1.5 shadow-sm border border-slate-200 dark:border-white/5">
          <button
            onClick={() => {
              setActiveTab("home");
              setSelectedCategory(null);
            }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
              activeTab === "home"
                ? "bg-slate-900 dark:bg-cyan-600 text-white shadow-lg"
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Home className="w-4 h-4" />
            {t("exercise.tab.home")}
          </button>
          <button
            onClick={() => {
              setActiveTab("gym");
              setSelectedCategory(null);
            }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
              activeTab === "gym"
                ? "bg-slate-900 dark:bg-cyan-600 text-white shadow-lg"
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Dumbbell className="w-4 h-4" />
            {t("exercise.tab.gym")}
          </button>
        </div>
      </div>

      <div className="transition-all duration-300">
        {selectedCategory ? renderDetailView() : renderDashboard()}
      </div>
    </div>
  );
};

export default ExercisePlanning;
