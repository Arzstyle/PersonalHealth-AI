import React, { useState } from 'react';
import Lottie from 'lottie-react';
import { 
  Dumbbell, Home, Flame, Activity, ChevronLeft, 
  Play, Timer, Repeat, ArrowRight, Zap, Trophy,
  BicepsFlexed, Footprints, HeartPulse, Sparkles
} from 'lucide-react';

// --- IMPORT ANIMATIONS (Dari file yang diupload) ---
import burpeeAnim from '../animations/Burpee.json';
import squatAnim from '../animations/squat.json';
import pushupAnim from '../animations/Military Push Ups.json';
import lungeAnim from '../animations/Lunge.json';
import plankAnim from '../animations/plank.json';
import crunchAnim from '../animations/Crunches.json';
import jackAnim from '../animations/JumpingJack.json';
import situpAnim from '../animations/situp.json';
import bridgeAnim from '../animations/glutebridge.json';
import supermanAnim from '../animations/superman.json';

// --- DATA STRUCTURE ---

// 1. HOME WORKOUTS (Menggunakan Animasi)
const HOME_CATEGORIES = [
  {
    id: 'fullbody',
    title: 'Full Body Burn',
    desc: 'Bakar kalori seluruh tubuh tanpa alat.',
    icon: Activity,
    color: 'from-orange-500 to-red-500',
    exercises: [
      { id: 'h1', name: 'Burpees', anim: burpeeAnim, sets: '3', reps: '12', cal: 15 },
      { id: 'h2', name: 'Jumping Jacks', anim: jackAnim, sets: '3', reps: '30 sec', cal: 10 },
      { id: 'h3', name: 'Superman', anim: supermanAnim, sets: '3', reps: '15', cal: 8 },
    ]
  },
  {
    id: 'strength',
    title: 'Strength & Power',
    desc: 'Bangun otot dasar dengan berat badan.',
    icon: Dumbbell,
    color: 'from-blue-500 to-indigo-500',
    exercises: [
      { id: 's1', name: 'Push Ups', anim: pushupAnim, sets: '4', reps: '12', cal: 12 },
      { id: 's2', name: 'Squats', anim: squatAnim, sets: '4', reps: '15', cal: 14 },
      { id: 's3', name: 'Lunges', anim: lungeAnim, sets: '3', reps: '12/leg', cal: 12 },
    ]
  },
  {
    id: 'core',
    title: 'Core & Abs',
    desc: 'Kencangkan otot perut dan stabilitas.',
    icon: Zap,
    color: 'from-yellow-500 to-orange-500',
    exercises: [
      { id: 'c1', name: 'Plank', anim: plankAnim, sets: '3', reps: '45 sec', cal: 6 },
      { id: 'c2', name: 'Crunches', anim: crunchAnim, sets: '3', reps: '20', cal: 8 },
      { id: 'c3', name: 'Sit Ups', anim: situpAnim, sets: '3', reps: '15', cal: 9 },
      { id: 'c4', name: 'Glute Bridge', anim: bridgeAnim, sets: '3', reps: '15', cal: 8 },
    ]
  }
];

// 2. GYM WORKOUTS (PPL Structure)
const GYM_CATEGORIES = [
  {
    id: 'push',
    title: 'Push Day',
    subtitle: 'Chest, Shoulders, Triceps',
    desc: 'Fokus mendorong beban menjauhi tubuh.',
    icon: Dumbbell, // Ganti icon jika ada yang lebih pas
    color: 'from-blue-600 to-cyan-500',
    exercises: [
      { id: 'g1', name: 'Barbell Bench Press', muscle: 'Chest', sets: '4', reps: '8-10' },
      { id: 'g2', name: 'Overhead Press', muscle: 'Shoulders', sets: '3', reps: '10-12' },
      { id: 'g3', name: 'Incline Dumbbell Press', muscle: 'Upper Chest', sets: '3', reps: '10-12' },
      { id: 'g4', name: 'Tricep Pushdown', muscle: 'Triceps', sets: '3', reps: '12-15' },
      { id: 'g5', name: 'Lateral Raises', muscle: 'Side Delts', sets: '4', reps: '15' },
    ]
  },
  {
    id: 'pull',
    title: 'Pull Day',
    subtitle: 'Back, Biceps, Rear Delts',
    desc: 'Fokus menarik beban mendekati tubuh.',
    icon: BicepsFlexed,
    color: 'from-purple-600 to-indigo-500',
    exercises: [
      { id: 'g6', name: 'Deadlift', muscle: 'Back/Legs', sets: '3', reps: '5-8' },
      { id: 'g7', name: 'Pull Ups / Lat Pulldown', muscle: 'Lats', sets: '4', reps: '8-12' },
      { id: 'g8', name: 'Barbell Rows', muscle: 'Mid Back', sets: '3', reps: '10' },
      { id: 'g9', name: 'Face Pulls', muscle: 'Rear Delts', sets: '3', reps: '15' },
      { id: 'g10', name: 'Hammer Curls', muscle: 'Biceps', sets: '3', reps: '12' },
    ]
  },
  {
    id: 'legs',
    title: 'Leg Day',
    subtitle: 'Quads, Hamstrings, Calves',
    desc: 'Jangan pernah skip leg day!',
    icon: Footprints,
    color: 'from-red-600 to-pink-600',
    exercises: [
      { id: 'g11', name: 'Barbell Squat', muscle: 'Quads/Glutes', sets: '4', reps: '6-8' },
      { id: 'g12', name: 'Leg Press', muscle: 'Quads', sets: '3', reps: '10-12' },
      { id: 'g13', name: 'Romanian Deadlift', muscle: 'Hamstrings', sets: '3', reps: '10' },
      { id: 'g14', name: 'Leg Extensions', muscle: 'Quads', sets: '3', reps: '15' },
      { id: 'g15', name: 'Calf Raises', muscle: 'Calves', sets: '4', reps: '15-20' },
    ]
  },
  {
    id: 'cardio',
    title: 'Cardio & Fat Burn',
    subtitle: 'Endurance & Heart Health',
    desc: 'Tingkatkan stamina dan bakar lemak.',
    icon: HeartPulse,
    color: 'from-green-500 to-emerald-600',
    exercises: [
      { id: 'g16', name: 'Treadmill Run', muscle: 'Full Body', sets: '30', reps: 'mins' },
      { id: 'g17', name: 'Elliptical', muscle: 'Low Impact', sets: '20', reps: 'mins' },
      { id: 'g18', name: 'Stairmaster', muscle: 'Glutes/Cardio', sets: '15', reps: 'mins' },
      { id: 'g19', name: 'Rowing Machine', muscle: 'Full Body', sets: '10', reps: 'mins' },
    ]
  }
];

const ExercisePlanning: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'gym'>('home');
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);

  // --- RENDER COMPONENT: CARD SELECTION ---
  const renderCategoryGrid = () => {
    const data = activeTab === 'home' ? HOME_CATEGORIES : GYM_CATEGORIES;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
        {data.map((cat: any) => (
          <div 
            key={cat.id}
            onClick={() => setSelectedCategory(cat)}
            className="group relative overflow-hidden rounded-3xl cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border border-gray-100"
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
            
            <div className="p-6 md:p-8 flex items-start justify-between relative z-10">
              <div>
                {cat.subtitle && (
                  <span className={`text-xs font-bold px-2 py-1 rounded bg-gray-100 text-gray-600 mb-2 inline-block`}>
                    {cat.subtitle}
                  </span>
                )}
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-gray-500 mt-2 text-sm md:text-base pr-8">
                  {cat.desc}
                </p>
                
                <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <span>Lihat {cat.exercises.length} Latihan</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              <div className={`p-4 rounded-2xl bg-gradient-to-br ${cat.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <cat.icon className="w-8 h-8" />
              </div>
            </div>
          </div>
        ))}

        {/* AI GENERATE CARD */}
        <div className="group relative overflow-hidden rounded-3xl cursor-pointer shadow-sm hover:shadow-md transition-all bg-gray-900 text-white border border-gray-800 flex flex-col justify-center items-center text-center p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black opacity-50"></div>
          <div className="relative z-10">
             <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm group-hover:rotate-12 transition-transform">
                <Sparkles className="w-8 h-8 text-yellow-300" />
             </div>
             <h3 className="text-xl font-bold">Custom AI Plan</h3>
             <p className="text-gray-400 text-sm mt-2 mb-4">Minta AI buatkan program spesifik.</p>
             <button className="px-4 py-2 bg-white text-gray-900 rounded-lg font-bold text-sm hover:bg-gray-100">
               Generate Now
             </button>
          </div>
        </div>
      </div>
    );
  };

  // --- RENDER COMPONENT: DETAIL LIST ---
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
            <h2 className="text-3xl font-bold text-gray-900">{selectedCategory.title}</h2>
            <p className="text-gray-500">{activeTab === 'home' ? 'Home Workout' : 'Gym Workout'} • {selectedCategory.exercises.length} Movements</p>
          </div>
        </div>

        {/* Exercises List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedCategory.exercises.map((ex: any) => (
            <div key={ex.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
              
              {/* Animation/Visual Area */}
              <div className="h-48 bg-gray-50 flex items-center justify-center relative border-b border-gray-100">
                {activeTab === 'home' ? (
                  <div className="w-full h-full p-4">
                     <Lottie animationData={ex.anim} loop={true} className="h-full w-full object-contain" />
                  </div>
                ) : (
                  // Placeholder visual untuk Gym (karena tidak ada JSON gym)
                  <div className="text-gray-300 flex flex-col items-center">
                    <Dumbbell className="w-16 h-16 opacity-20" />
                    <span className="text-xs font-bold mt-2 uppercase tracking-widest opacity-40">Gym Exercise</span>
                  </div>
                )}
                
                {/* Badge Info */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow-sm">
                  {ex.sets} Sets
                </div>
              </div>

              {/* Info Area */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{ex.name}</h3>
                
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Repeat className="w-4 h-4 text-blue-500" />
                    <span>{ex.reps} {activeTab === 'cardio' ? 'Mins' : 'Reps'}</span>
                  </div>
                  {ex.cal && (
                    <div className="flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <span>~{ex.cal} kcal</span>
                    </div>
                  )}
                  {ex.muscle && (
                    <div className="flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-green-500" />
                      <span>{ex.muscle}</span>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <button className="w-full mt-4 py-2.5 rounded-xl bg-gray-900 text-white font-medium text-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                  <Play className="w-4 h-4 fill-current" />
                  Start
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full pb-20">
      
      {/* --- HEADER UTAMA --- */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 pt-4 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
             <span className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl shadow-lg shadow-blue-200">
              <Trophy className="w-8 h-8" />
            </span>
            Workout Plan
          </h1>
          <p className="text-gray-500 mt-2 ml-1">Pilih jenis latihanmu hari ini.</p>
        </div>

        {/* --- TOGGLE SWITCH (HOME vs GYM) --- */}
        <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-gray-200 flex relative w-full md:w-auto">
          {/* Slider Background */}
          <div 
            className={`absolute top-1.5 bottom-1.5 rounded-xl bg-gray-900 transition-all duration-300 ease-out shadow-md ${
              activeTab === 'home' ? 'left-1.5 w-[calc(50%-6px)]' : 'left-[50%] w-[calc(50%-6px)]'
            }`}
          ></div>
          
          <button 
            onClick={() => { setActiveTab('home'); setSelectedCategory(null); }}
            className={`relative z-10 flex-1 px-8 py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'home' ? 'text-white' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Home className="w-4 h-4" />
            Home
          </button>
          
          <button 
            onClick={() => { setActiveTab('gym'); setSelectedCategory(null); }}
            className={`relative z-10 flex-1 px-8 py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'gym' ? 'text-white' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Dumbbell className="w-4 h-4" />
            Gym
          </button>
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      {selectedCategory ? renderDetailView() : renderCategoryGrid()}

    </div>
  );
};

export default ExercisePlanning;