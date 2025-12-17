import React, { useState } from "react";
import {
  Search,
  Loader,
  Check,
  Scan,
  Database,
  AlertCircle,
} from "lucide-react";
import { generateAIContent } from "../services/ai";
import { useUI } from "../context/UIContext";

interface FoodDetail {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
  image?: string;
}

interface FoodSearchProps {
  onSelectFood?: (food: FoodDetail) => void;
}

interface FoodImageProps {
  term: string;
  initialImage?: string;
}

const FoodImage: React.FC<FoodImageProps> = ({ term, initialImage }) => {
  const [imgSrc, setImgSrc] = useState<string>("");
  const [retryStage, setRetryStage] = useState(0);

  React.useEffect(() => {
    setRetryStage(0);
    if (initialImage && initialImage.startsWith("http")) {
      setImgSrc(initialImage);
    } else {
      setImgSrc(
        `https://tse2.mm.bing.net/th?q=${encodeURIComponent(
          term + " food"
        )}&w=500&h=500&c=7&rs=1&p=0`
      );
    }
  }, [term, initialImage]);

  const handleError = () => {
    if (retryStage === 0) {
      setRetryStage(1);
      setImgSrc(
        `https://tse1.mm.bing.net/th?q=${encodeURIComponent(
          term + " dish"
        )}&w=500&h=500&c=7&rs=1&p=0`
      );
    } else if (retryStage === 1) {
      setRetryStage(2);
      setImgSrc(
        `https://image.pollinations.ai/prompt/${encodeURIComponent(
          term + " food realistic photography"
        )}?width=500&height=500&nologo=true`
      );
    } else if (retryStage === 2) {
      setRetryStage(3);
      setImgSrc("https://placehold.co/200x200?text=No+Image");
    }
  };

  return (
    <img
      src={imgSrc}
      alt={term}
      className="w-full h-full object-cover transition-opacity duration-300"
      onError={handleError}
      loading="lazy"
      referrerPolicy="no-referrer"
    />
  );
};

const AISearch: React.FC<FoodSearchProps> = ({ onSelectFood }) => {
  const { t } = useUI();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<FoodDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addedFood, setAddedFood] = useState<string | null>(null);

  const handleSearch = async () => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setSearchResults([]);

    try {
      const prompt = `
        You are an expert AI Nutritionist.
        Identify the food item: "${searchQuery}" and provide a detailed nutritional breakdown.
        
        STRICT OUTPUT REQUIREMENTS:
        1. Return ONLY a valid JSON array.
        2. NO markdown formatting.
        3. For "image", try to provide a REAL direct URL to a public image (e.g. from Wikimedia Commons) if you know one. If not, leave it empty.
        4. If the food is generic (e.g. "Sate"), provide the most common variation (e.g. "Sate Ayam").

        REQUIRED JSON FORMAT:
        [
          {
            "name": "Food Name (Indonesian/English)",
            "calories": 0,
            "protein": 0, 
            "carbs": 0, 
            "fat": 0,
            "servingSize": "e.g. 1 porsi",
            "image": "https://upload.wikimedia.org/..." 
          }
        ]
      `;

      const result = await generateAIContent(prompt);

      if (!result.success) {
        throw new Error(result.error);
      }

      const foods: FoodDetail[] = JSON.parse(result.data);
      setSearchResults(foods);
    } catch (err: any) {
      console.error("Error during AI search:", err);
      setError(`Scan Failed: ${err.message || "Network Error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFood = (food: FoodDetail) => {
    if (onSelectFood) {
      onSelectFood(food);
    } else {
      const storedMeals = localStorage.getItem("manualMealsLog");
      const currentLog = storedMeals ? JSON.parse(storedMeals) : [];

      const newEntry = {
        ...food,
        id: Date.now().toString(),
        date: new Date().toISOString().split("T")[0],
        timestamp: new Date().toISOString(),
      };

      const updatedLog = [...currentLog, newEntry];
      localStorage.setItem("manualMealsLog", JSON.stringify(updatedLog));
    }

    setAddedFood(food.name);
    setTimeout(() => setAddedFood(null), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-1 relative">
      <div className="absolute inset-0 bg-slate-50 dark:bg-transparent bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none rounded-3xl"></div>

      <div className="relative z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 sm:p-8 shadow-xl overflow-hidden transition-all duration-500">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-cyan-100 dark:bg-cyan-900/20 rounded-xl text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)] animate-pulse">
            <Scan className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {t("search.title") || "NEURAL FOOD SEARCH"}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-widest">
              {t("search.subtitle") || "AI-Powered Nutritional Analysis"}
            </p>
          </div>
        </div>

        <div className="relative group mb-8">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
          <div className="relative flex items-center bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-inner h-14">
            <div className="pl-4 flex items-center text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder={
                t("search.placeholder") || "Enter food name to search..."
              }
              className="flex-grow h-full px-4 bg-transparent outline-none text-slate-900 dark:text-white font-mono placeholder:text-slate-400 dark:placeholder:text-slate-600"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              onClick={handleSearch}
              disabled={isLoading || !searchQuery}
              className="h-full px-8 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-bold text-xs uppercase tracking-wider hover:bg-cyan-500 hover:text-white dark:hover:bg-cyan-600 transition-all border-l border-slate-200 dark:border-white/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group/btn"
            >
              {isLoading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {t("search.button") || "SEARCH"}
                  <Search className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-500/30 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-bold">{error}</span>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-slate-200 dark:border-slate-800 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
              <Database className="absolute inset-0 m-auto w-6 h-6 text-cyan-500 animate-pulse" />
            </div>
            <div className="text-center">
              <h3 className="text-slate-900 dark:text-white font-bold text-lg animate-pulse">
                {t("search.scanning") || "AI WEB SCANNING..."}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-mono mt-1">
                {t("search.processing") ||
                  "Processing global nutritional data via AI..."}
              </p>
            </div>
          </div>
        )}

        {!isLoading && !error && searchResults.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-2xl bg-slate-50/50 dark:bg-white/5">
            <div className="w-16 h-16 bg-slate-100 dark:bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-slate-900 dark:text-white font-bold">
              {t("search.ready") || "Ready to Search"}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              {t("search.ready_desc") ||
                "Input food name to find nutritional values locally & globally."}
            </p>
          </div>
        )}

        {!isLoading && searchResults.length > 0 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                {t("search.results") || "SEARCH RESULTS"}
              </h2>
              <span className="px-2 py-0.5 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 text-[10px] font-bold rounded border border-cyan-200 dark:border-cyan-500/20">
                {searchResults.length}{" "}
                {t("search.items_found") || "ITEMS FOUND"}
              </span>
            </div>

            {searchResults.map((food, index) => (
              <div
                key={index}
                className="group relative bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row gap-6 hover:border-cyan-400 dark:hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/5 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                <div className="w-full sm:w-32 h-32 flex-shrink-0 bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden relative border border-slate-100 dark:border-white/5 group-hover:scale-105 transition-transform duration-500">
                  <FoodImage term={food.name} initialImage={food.image} />
                  <div className="absolute bottom-0 left-0 right-0 p-1 bg-black/60 backdrop-blur-sm text-center">
                    <span className="text-[10px] text-white font-bold uppercase">
                      {food.servingSize}
                    </span>
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-center relative z-10">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                      {food.name}
                    </h3>
                    <div className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 font-mono">
                      {food.calories} KCAL
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-500/20 p-2 rounded-lg text-center">
                      <div className="text-[10px] text-blue-500 font-bold uppercase tracking-wider">
                        Protein
                      </div>
                      <div className="text-lg font-black text-blue-700 dark:text-blue-400">
                        {food.protein}
                        <span className="text-xs font-normal opacity-70">
                          g
                        </span>
                      </div>
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-500/20 p-2 rounded-lg text-center">
                      <div className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">
                        Carbs
                      </div>
                      <div className="text-lg font-black text-emerald-700 dark:text-emerald-400">
                        {food.carbs}
                        <span className="text-xs font-normal opacity-70">
                          g
                        </span>
                      </div>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-500/20 p-2 rounded-lg text-center">
                      <div className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">
                        Fat
                      </div>
                      <div className="text-lg font-black text-amber-700 dark:text-amber-400">
                        {food.fat}
                        <span className="text-xs font-normal opacity-70">
                          g
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddFood(food)}
                    className="w-full py-3 bg-slate-900 dark:bg-cyan-600 hover:bg-slate-800 dark:hover:bg-cyan-500 text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group/btn relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                    <Check className="w-4 h-4 relative z-10" />
                    <span className="relative z-10 text-xs uppercase tracking-wider">
                      {t("search.add_to_menu") || "ADD TO MENU"}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {addedFood && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 zoom-in-95 duration-300">
            <div className="bg-slate-900/90 dark:bg-cyan-950/90 backdrop-blur-md text-white px-6 py-3 rounded-2xl shadow-2xl border border-cyan-500/30 flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_10px_#22c55e]">
                <Check className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">
                  Success
                </p>
                <p className="font-bold text-sm">
                  Added <span className="text-cyan-400">{addedFood}</span> to
                  your plan.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AISearch;
