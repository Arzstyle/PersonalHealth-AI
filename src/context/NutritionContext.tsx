import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date: string; 
}

interface NutritionContextType {
  nutrition: NutritionData;
  updateNutrition: (newNutrition: NutritionData) => void;
}

const NutritionContext = createContext<NutritionContextType | undefined>(
  undefined
);

export const NutritionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [nutrition, setNutrition] = useState<NutritionData>(() => {
    
    try {
      const savedNutrition = localStorage.getItem("todayNutrition");
      if (savedNutrition) {
        return JSON.parse(savedNutrition);
      }
    } catch (error) {
      console.error("Failed to parse nutrition data from localStorage", error);
      localStorage.removeItem("todayNutrition");
    }
    return {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      date: new Date().toISOString().split("T")[0],
    };
  });

  
  useEffect(() => {
    localStorage.setItem("todayNutrition", JSON.stringify(nutrition));
  }, [nutrition]);

  const updateNutrition = (newNutrition: NutritionData) => {
    setNutrition(newNutrition);
  };

  return (
    <NutritionContext.Provider value={{ nutrition, updateNutrition }}>
      {children}
    </NutritionContext.Provider>
  );
};

export const useNutrition = () => {
  const context = useContext(NutritionContext);
  if (context === undefined) {
    throw new Error("useNutrition must be used within a NutritionProvider");
  }
  return context;
};
