import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, 
  Plus, Sparkles, ChefHat, Coffee, Sun, Moon, Utensils, 
  Flame, MoreHorizontal, Loader2, PenTool
} from 'lucide-react';

// --- INITIAL DATA ---
const INITIAL_MEALS = {
  breakfast: [
    { id: 1, name: 'Oatmeal & Berries', calories: 320, protein: 12, carbs: 45, fat: 6, image: '🥣' },
  ],
  lunch: [
    { id: 3, name: 'Grilled Chicken Salad', calories: 450, protein: 40, carbs: 12, fat: 15, image: '🥗' },
  ],
  dinner: [],
  snacks: [
    { id: 4, name: 'Greek Yogurt', calories: 120, protein: 15, carbs: 8, fat: 0, image: '🥛' },
  ]
};

const MealPlanning: React.FC = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [mealsData, setMealsData] = useState(INITIAL_MEALS);
  const [isGenerating, setIsGenerating] = useState(false);

  // --- LOGIC TANGGAL ---
  const changeDate = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  // --- ACTIONS ---
  const handleAiGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setMealsData({
        breakfast: [
          { id: 10, name: 'Avocado Toast', calories: 350, protein: 10, carbs: 30, fat: 15, image: '🥑' },
          { id: 11, name: 'Boiled Egg', calories: 70, protein: 6, carbs: 1, fat: 5, image: '🥚' }
        ],
        lunch: [
          { id: 12, name: 'Beef Teriyaki Bowl', calories: 550, protein: 35, carbs: 60, fat: 18, image: '🍱' }
        ],
        dinner: [
          { id: 13, name: 'Salmon with Asparagus', calories: 420, protein: 38, carbs: 10, fat: 20, image: '🐟' }
        ],
        snacks: [
          { id: 14, name: 'Almonds (30g)', calories: 180, protein: 7, carbs: 5, fat: 15, image: '🥜' }
        ]
      });
      setIsGenerating(false);
    }, 2000);
  };

  const handleManualPlan = () => navigate('/food-search');
  
  const handleRemoveItem = (mealType: string, id: number) => {
    // @ts-ignore
    const updatedCategory = mealsData[mealType].filter(item => item.id !== id);
    setMealsData(prev => ({ ...prev, [mealType]: updatedCategory }));
  };

  const getCategoryStyle = (type: string) => {
    switch (type) {
      case 'breakfast': return { icon: Coffee, color: 'text-orange-600', bg: 'bg-orange-100', label: 'Sarapan' };
      case 'lunch': return { icon: Sun, color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Makan Siang' };
      case 'dinner': return { icon: Moon, color: 'text-indigo-600', bg: 'bg-indigo-100', label: 'Makan Malam' };
      default: return { icon: Utensils, color: 'text-emerald-600', bg: 'bg-emerald-100', label: 'Camilan' };
    }
  };

  const allMeals = [...mealsData.breakfast, ...mealsData.lunch, ...mealsData.dinner, ...mealsData.snacks];
  const totalStats = allMeals.reduce((acc, item) => ({
    calories: acc.calories + item.calories,
    protein: acc.protein + item.protein,
    carbs: acc.carbs + item.carbs,
    fat: acc.fat + item.fat
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

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
          <p className="text-gray-500 mt-2 ml-1">Rencanakan nutrisimu, otomatis atau manual.</p>
        </div>

        {/* Date Navigator */}
        <div className="glass-panel px-2 py-2 flex items-center gap-2 select-none bg-white/80">
          <button onClick={() => changeDate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 active:scale-90">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 px-4 py-1 text-gray-800 font-bold min-w-[180px] justify-center text-center">
            <CalendarIcon className="w-4 h-4 text-green-600 mb-0.5" />
            <span>{formatDate(currentDate)}</span>
          </div>
          <button onClick={() => changeDate(1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 active:scale-90">
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
            Ringkasan Nutrisi
          </h3>
          <span className="text-xs font-bold bg-white px-3 py-1.5 rounded-full text-gray-600 border border-gray-200 shadow-sm">
            Target: 2200 kcal
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
          {/* Kalori */}
          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-16 h-16 bg-orange-200/50 rounded-full blur-xl -mr-4 -mt-4"></div>
            <p className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-2">Kalori</p>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-gray-800">{totalStats.calories}</span>
                <span className="text-xs text-gray-500 font-medium">kcal</span>
              </div>
              <div className="w-full bg-white/60 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
          </div>
          {/* Protein */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-16 h-16 bg-blue-200/50 rounded-full blur-xl -mr-4 -mt-4"></div>
            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Protein</p>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-gray-800">{totalStats.protein}</span>
                <span className="text-xs text-gray-500 font-medium">g</span>
              </div>
              <div className="w-full bg-white/60 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
          {/* Karbo */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-16 h-16 bg-emerald-200/50 rounded-full blur-xl -mr-4 -mt-4"></div>
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">Karbo</p>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-gray-800">{totalStats.carbs}</span>
                <span className="text-xs text-gray-500 font-medium">g</span>
              </div>
              <div className="w-full bg-white/60 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
          </div>
          {/* Lemak */}
          <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-4 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-16 h-16 bg-yellow-200/50 rounded-full blur-xl -mr-4 -mt-4"></div>
            <p className="text-xs font-bold text-yellow-600 uppercase tracking-wider mb-2">Lemak</p>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-gray-800">{totalStats.fat}</span>
                <span className="text-xs text-gray-500 font-medium">g</span>
              </div>
              <div className="w-full bg-white/60 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-yellow-500 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- ACTION BUTTONS (DUAL TYPE) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        
        {/* 1. AUTO GENERATE BUTTON */}
        <button 
          onClick={handleAiGenerate}
          disabled={isGenerating}
          className="relative overflow-hidden group bg-gray-900 text-white p-1 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-80 disabled:cursor-not-allowed text-left"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black opacity-100 group-hover:opacity-90 transition-opacity"></div>
          <div className="relative p-5 h-full flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 bg-white/20 rounded-xl backdrop-blur-sm ${isGenerating ? 'animate-spin' : ''}`}>
                 {isGenerating ? <Loader2 className="w-6 h-6" /> : <Sparkles className="w-6 h-6 text-yellow-300 fill-current" />}
              </div>
              <span className="bg-white/10 text-xs font-bold px-2 py-1 rounded text-gray-300">Otomatis</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">
                {isGenerating ? 'Meracik Menu...' : 'AI Auto-Generate'}
              </h3>
              <p className="text-sm text-gray-400">Biarkan AI menyusun menu harian lengkap untukmu.</p>
            </div>
          </div>
        </button>

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
              <span className="bg-green-100 text-xs font-bold px-2 py-1 rounded text-green-700">Manual</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Susun Manual
              </h3>
              <p className="text-sm text-gray-500">Pilih sendiri menu makananmu lewat pencarian AI.</p>
            </div>
          </div>
        </button>

      </div>

      {/* --- MEAL SECTIONS GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {['breakfast', 'lunch', 'dinner', 'snacks'].map((mealType) => {
          const style = getCategoryStyle(mealType);
          const Icon = style.icon;
          // @ts-ignore
          const meals = mealsData[mealType];
          // @ts-ignore
          const totalCalories = meals.reduce((acc, curr) => acc + curr.calories, 0);

          return (
            <div key={mealType} className="glass-panel p-6 flex flex-col h-full min-h-[240px] border border-white/60">
              
              {/* Header Kategori */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl ${style.bg} ${style.color} shadow-sm`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-800">{style.label}</h3>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">{meals.length} Item • {totalCalories} kcal</p>
                  </div>
                </div>
                <button onClick={handleManualPlan} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-green-600 transition-colors active:bg-green-50" title="Tambah">
                  <Plus className="w-6 h-6" />
                </button>
              </div>

              {/* List Makanan */}
              <div className="space-y-3 flex-grow">
                {/* @ts-ignore */}
                {meals.length > 0 ? (
                  // @ts-ignore
                  meals.map((food) => (
                    <div key={food.id} className="glass-card p-3 flex items-center justify-between group border border-transparent hover:border-green-100 bg-white/50">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl bg-white w-12 h-12 flex items-center justify-center rounded-xl shadow-sm">
                          {food.image}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-sm group-hover:text-green-700 transition-colors">{food.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded text-center min-w-[60px]">
                              {food.calories} kcal
                            </span>
                            <span className="text-[10px] text-gray-400 border border-gray-200 px-1.5 py-0.5 rounded">
                              {food.protein}g P
                            </span>
                          </div>
                        </div>
                      </div>
                      <button onClick={() => handleRemoveItem(mealType, food.id)} className="opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Hapus">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/30">
                    <p className="text-sm text-gray-400 font-medium">Kosong</p>
                    <button onClick={handleManualPlan} className="mt-2 text-xs font-bold text-green-600 hover:text-green-700 bg-green-50 px-3 py-1.5 rounded-lg transition-colors">
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