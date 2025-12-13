// --- 1. BMI CALCULATOR ---
export const calculateBMI = (weight: number, height: number): number => {
  if (!weight || !height) return 0;
  const heightInMeters = height / 100;
  // Rumus BMI: Berat / (Tinggi^2)
  const bmi = weight / (heightInMeters * heightInMeters);
  return Number(bmi.toFixed(1));
};

export const getBMICategory = (bmi: number) => {
  if (bmi < 18.5) return { category: "Underweight", color: "text-blue-400" };
  if (bmi < 25) return { category: "Normal Weight", color: "text-green-400" };
  if (bmi < 30) return { category: "Overweight", color: "text-yellow-400" };
  return { category: "Obese", color: "text-red-400" };
};

// --- 2. BMR CALCULATOR (Mifflin-St Jeor) ---
// Mengembalikan nilai float (desimal) presisi
export const calculateBMR = (
  weight: number,
  height: number,
  age: number,
  gender: string
): number => {
  // Konstanta Mifflin-St Jeor
  // Pria: +5, Wanita: -161
  const s = gender === "male" ? 5 : -161;

  // Rumus: (10 * kg) + (6.25 * cm) - (5 * th) + s
  const bmr = 10 * weight + 6.25 * height - 5 * age + s;

  return bmr;
};

// --- 3. IDEAL WEIGHT (Rumus Broca Modifikasi) ---
export const calculateIdealWeight = (
  height: number,
  gender: string
): number => {
  // Pria: (TB-100) - 10%
  // Wanita: (TB-100) - 15%
  const base = height - 100;
  const adjustment = gender === "male" ? 0.1 : 0.15;
  return Math.round(base - base * adjustment);
};

// --- 4. DAILY CALORIES (TDEE + Goal) ---
export const calculateDailyCalories = (
  weight: number,
  height: number,
  age: number,
  gender: string,
  activityLevel: string,
  goal: string
): number => {
  // Hitung BMR (Desimal)
  const bmr = calculateBMR(weight, height, age, gender);

  // Multiplier Aktivitas (Standard PAL)
  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2, // Jarang bergerak (BMR x 1.2)
    light: 1.375, // Ringan (BMR x 1.375)
    moderate: 1.55, // Sedang (BMR x 1.55)
    active: 1.725, // Aktif (BMR x 1.725)
    "very-active": 1.9, // Sangat Aktif (BMR x 1.9)
  };

  // Hitung TDEE (Total Daily Energy Expenditure)
  const tdee = bmr * (activityMultipliers[activityLevel] || 1.2);

  // Sesuaikan dengan Goal
  let targetCalories = tdee;

  if (goal === "weight-loss") {
    targetCalories -= 500; // Defisit 500 kcal (Standard Cut)
  } else if (goal === "weight-gain") {
    targetCalories += 500; // Surplus 500 kcal (Standard Bulk)
  } else if (goal === "muscle-gain") {
    targetCalories += 300; // Surplus 300 kcal (Lean Bulk - Lebih rendah dari weight gain agar minim lemak)
  }

  // Batas minimal aman (agar tidak malnutrisi)
  const minCalories = gender === "male" ? 1500 : 1200;

  // Hasil akhir dibulatkan
  return Math.round(Math.max(targetCalories, minCalories));
};

// --- 5. MACRO TARGETS (Tambahan untuk kelengkapan) ---
export const calculateMacroTargets = (calories: number, goal: string) => {
  const macroRatios: Record<
    string,
    { protein: number; carbs: number; fat: number }
  > = {
    "weight-loss": { protein: 0.4, carbs: 0.3, fat: 0.3 }, // High Protein untuk maintain otot saat defisit
    "weight-gain": { protein: 0.3, carbs: 0.45, fat: 0.25 }, // High Carbs untuk energi surplus
    "muscle-gain": { protein: 0.35, carbs: 0.4, fat: 0.25 }, // Balanced High Protein & Carbs
  };

  const ratios = macroRatios[goal] || macroRatios["weight-loss"];

  return {
    protein: Math.round((calories * ratios.protein) / 4), // 4 cal per gram
    carbs: Math.round((calories * ratios.carbs) / 4), // 4 cal per gram
    fat: Math.round((calories * ratios.fat) / 9), // 9 cal per gram
  };
};
