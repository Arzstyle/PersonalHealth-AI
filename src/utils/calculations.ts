
export const calculateBMI = (weight: number, height: number): number => {
  if (!weight || !height) return 0;
  const heightInMeters = height / 100;
  
  const bmi = weight / (heightInMeters * heightInMeters);
  return Number(bmi.toFixed(1));
};

export const getBMICategory = (bmi: number) => {
  if (bmi < 18.5) return { category: "Underweight", color: "text-blue-400" };
  if (bmi < 25) return { category: "Normal Weight", color: "text-green-400" };
  if (bmi < 30) return { category: "Overweight", color: "text-yellow-400" };
  return { category: "Obese", color: "text-red-400" };
};



export const calculateBMR = (
  weight: number,
  height: number,
  age: number,
  gender: string
): number => {
  
  
  const s = gender === "male" ? 5 : -161;

  
  const bmr = 10 * weight + 6.25 * height - 5 * age + s;

  return bmr;
};


export const calculateIdealWeight = (
  height: number,
  gender: string
): number => {
  
  
  const base = height - 100;
  const adjustment = gender === "male" ? 0.1 : 0.15;
  return Math.round(base - base * adjustment);
};


export const calculateDailyCalories = (
  weight: number,
  height: number,
  age: number,
  gender: string,
  activityLevel: string,
  goal: string
): number => {
  
  const bmr = calculateBMR(weight, height, age, gender);

  
  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2, 
    light: 1.375, 
    moderate: 1.55, 
    active: 1.725, 
    "very-active": 1.9, 
  };

  
  const tdee = bmr * (activityMultipliers[activityLevel] || 1.2);

  
  let targetCalories = tdee;

  if (goal === "weight-loss") {
    targetCalories -= 500; 
  } else if (goal === "weight-gain") {
    targetCalories += 500; 
  } else if (goal === "muscle-gain") {
    targetCalories += 300; 
  }

  
  const minCalories = gender === "male" ? 1500 : 1200;

  
  return Math.round(Math.max(targetCalories, minCalories));
};


export const calculateMacroTargets = (
  calories: number,
  goal: string,
  weight: number 
) => {
  
  const safeWeight = weight || 55;

  let pRatio = 1.4; 
  let fRatio = 1.0;

  if (goal === "weight-loss") {
    
    
    pRatio = 2.1;
    fRatio = 0.8;
  } else if (
    goal === "weight-gain" ||
    goal === "bulking" ||
    goal === "muscle-gain"
  ) {
    
    
    pRatio = 1.9;
    fRatio = 1.0;
  } else {
    
    
    pRatio = 1.4;
    fRatio = 1.0;
  }

  
  const proteinGrams = Math.round(safeWeight * pRatio);
  const fatGrams = Math.round(safeWeight * fRatio);

  
  const proteinCal = proteinGrams * 4;
  const fatCal = fatGrams * 9;

  
  const remainingCal = calories - (proteinCal + fatCal);
  const carbGrams = Math.max(0, Math.round(remainingCal / 4));

  return {
    protein: proteinGrams,
    carbs: carbGrams,
    fat: fatGrams,
  };
};
