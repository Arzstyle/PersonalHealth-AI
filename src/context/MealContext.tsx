import React, { createContext, useContext, useState } from "react";

interface MacroData {
  protein: number;
  carbs: number;
  fat: number;
}

interface MealContextType {
  consumedCalories: number;
  setConsumedCalories: React.Dispatch<React.SetStateAction<number>>;
  totalPlanCalories: number;
  setTotalPlanCalories: React.Dispatch<React.SetStateAction<number>>;

  totalCaloriesConsumed: number;
  todaysMacros: MacroData;
  setTodaysMacros: React.Dispatch<React.SetStateAction<MacroData>>;
}

const MealContext = createContext<MealContextType | undefined>(undefined);

export const MealProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [consumedCalories, setConsumedCalories] = useState(0);
  const [totalPlanCalories, setTotalPlanCalories] = useState(0);
  const [todaysMacros, setTodaysMacros] = useState<MacroData>({
    protein: 0,
    carbs: 0,
    fat: 0,
  });

  return (
    <MealContext.Provider
      value={{
        consumedCalories,
        setConsumedCalories,
        totalPlanCalories,
        setTotalPlanCalories,
        totalCaloriesConsumed: consumedCalories,
        todaysMacros,
        setTodaysMacros,
      }}
    >
      {children}
    </MealContext.Provider>
  );
};

export const useMeal = (): MealContextType => {
  const context = useContext(MealContext);
  if (!context) throw new Error("useMeal must be used within a MealProvider");
  return context;
};
