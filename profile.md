# PersonalHealth AI

PersonalHealth AI adalah platform kesehatan cerdas yang dirancang untuk membantu pengguna mencapai tujuan kebugaran mereka melalui rencana makan dan latihan yang dipersonalisasi. Menggabungkan perhitungan nutrisi ilmiah dengan kecerdasan buatan (Gen AI), aplikasi ini menyediakan panduan yang disesuaikan dengan profil tubuh dan gaya hidup pengguna.

## 👥 Tim Pengembang

| No | Nama | Role & Tanggung Jawab |
| :--- | :--- | :--- |
| 1 | **Muhamad Akbar Rizky Saputra** | Project Owner, Front-End Development |
| 2 | **Muhamad Ghibran Muslih** | Front-End, Back-End, UI Redesign |

---

## 📑 Daftar Isi

1. [Struktur Folder](#-struktur-folder)
2. [Fitur & Implementasi Kode](#-fitur--implementasi-kode)
    - [1. Perhitungan BMI (Body Mass Index)](#1-perhitungan-bmi-body-mass-index)
    - [2. Perhitungan BMR (Basal Metabolic Rate)](#2-perhitungan-bmr-basal-metabolic-rate)
    - [3. Perhitungan TDEE & Target Kalori](#3-perhitungan-tdee--target-kalori)
    - [4. Distribusi Makronutrisi](#4-distribusi-makronutrisi)
3. [Implementasi Generative AI](#-implementasi-generative-ai)
    - [1. AI Nutritionist (Meal Plan)](#1-ai-nutritionist-meal-plan)
    - [2. AI Fitness Trainer (Workout Plan)](#2-ai-fitness-trainer-workout-plan)

---

## 📂 Struktur Folder
Berikut adalah struktur direktori utama yang digunakan dalam proyek ini untuk mengorganisir logika, tampilan, dan data:

```
src/
├── animations/       # File animasi (Lottie/JSON) untuk panduan latihan visual
├── components/       # Komponen UI Reusable (Dashboard, MealPlanning, dll)
├── context/          # State Management Global (UserContext, MealContext, UIContext)
├── data/             # Data statis referensi
├── services/         # Layanan eksternal (AI Service Configuration)
├── types/            # Definisi tipe TypeScript untuk type-safety
├── utils/            # Fungsi utilitas & rumus perhitungan (Calculations)
├── App.tsx           # Main Routing & Layout Management
└── main.tsx          # Entry point aplikasi React
```

---

## 🚀 Fitur & Implementasi Kode

Berikut adalah penjelasan mendalam mengenai logika sistem yang digunakan dalam fitur-fitur utama PersonalHealth AI.

### 1. Perhitungan BMI (Body Mass Index)
BMI digunakan sebagai indikator awal kesehatan untuk menentukan apakah berat badan pengguna termasuk dalam kategori kurang, normal, berlebih, atau obesitas. Sistem menggunakan rumus standar `Berat / (Tinggi/100)²`.

**File:** `src/utils/calculations.ts`

```typescript
export const calculateBMI = (weight: number, height: number): number => {
  if (!weight || !height) return 0;
  const heightInMeters = height / 100;
  
  // Rumus BMI: Berat (kg) dibagi kuadrat Tinggi (m)
  const bmi = weight / (heightInMeters * heightInMeters);
  return Number(bmi.toFixed(1));
};

export const getBMICategory = (bmi: number) => {
  // Logic penentuan kategori dan warna indikator
  if (bmi < 18.5) return { category: "Underweight", color: "text-blue-400" };
  if (bmi < 25) return { category: "Normal Weight", color: "text-green-400" };
  if (bmi < 30) return { category: "Overweight", color: "text-yellow-400" };
  return { category: "Obese", color: "text-red-400" };
};
```

---

### 2. Perhitungan BMR (Basal Metabolic Rate)
BMR adalah kalori dasar yang dibutuhkan tubuh untuk fungsi vital (bernapas, sirkulasi darah) saat istirahat total. Kami menggunakan persamaan **Mifflin-St Jeor** yang terbukti lebih akurat untuk populasi modern. Perhatikan perbedaan konstanta `s` (+5 untuk pria, -161 untuk wanita).

**File:** `src/utils/calculations.ts`

```typescript
export const calculateBMR = (
  weight: number,
  height: number,
  age: number,
  gender: string
): number => {
  // Konstanta 's' berdasarkan gender
  const s = gender === "male" ? 5 : -161;

  // Rumus Mifflin-St Jeor
  const bmr = 10 * weight + 6.25 * height - 5 * age + s;

  return bmr;
};
```

---

### 3. Perhitungan TDEE & Target Kalori
Total Daily Energy Expenditure (TDEE) menggabungkan BMR dengan tingkat aktivitas fisik. Target kalori kemudian disesuaikan berdasarkan goal pengguna (Weight Loss, Gain, atau Muscle Gain). Kode di bawah memastikan kalori tidak pernah di bawah batas aman (Safety Net: 1500 kcal Pria, 1200 kcal Wanita).

**File:** `src/utils/calculations.ts`

```typescript
export const calculateDailyCalories = (
  weight: number, height: number, age: number, 
  gender: string, activityLevel: string, goal: string
): number => {
  const bmr = calculateBMR(weight, height, age, gender);

  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2, 
    light: 1.375, 
    moderate: 1.55, 
    active: 1.725, 
    "very-active": 1.9, 
  };

  // TDEE = BMR x Activity Multiplier
  const tdee = bmr * (activityMultipliers[activityLevel] || 1.2);
  let targetCalories = tdee;

  // Penyesuaian Kalori Berdasarkan Goal
  if (goal === "weight-loss") {
    targetCalories -= 500; // Defisit Kalori
  } else if (goal === "weight-gain") {
    targetCalories += 500; // Surplus Kalori
  } else if (goal === "muscle-gain") {
    targetCalories += 300; // Surplus Moderat
  }

  // Safety Net Calculations
  const minCalories = gender === "male" ? 1500 : 1200;
  return Math.round(Math.max(targetCalories, minCalories));
};
```

---

### 4. Distribusi Makronutrisi
Setelah mendapatkan target kalori, sistem membaginya menjadi Protein, Lemak, dan Karbohidrat. Rasio ini dinamis: `weight-loss` memprioritaskan protein tinggi untuk mempertahankan otot saat defisit, sementara `muscle-gain` menjaga keseimbangan untuk energi latihan.

**File:** `src/utils/calculations.ts`

```typescript
export const calculateMacroTargets = (
  calories: number, goal: string, weight: number 
) => {
  let pRatio = 1.4; // Default Protein Ratio (g/kg bodyweight)
  let fRatio = 1.0; // Default Fat Ratio

  if (goal === "weight-loss") {
    pRatio = 2.1; // Protein tinggi saat diet
    fRatio = 0.8;
  } else if (goal === "muscle-gain") {
    pRatio = 1.9;
    fRatio = 1.0;
  }

  // Konversi gram ke kalori (Protein x4, Fat x9)
  const proteinGrams = Math.round(weight * pRatio);
  const fatGrams = Math.round(weight * fRatio);
  
  const proteinCal = proteinGrams * 4;
  const fatCal = fatGrams * 9;

  // Sisa kalori dialokasikan ke Karbohidrat
  const remainingCal = calories - (proteinCal + fatCal);
  const carbGrams = Math.max(0, Math.round(remainingCal / 4));

  return { protein: proteinGrams, carbs: carbGrams, fat: fatGrams };
};
```

---

## 🤖 Implementasi Generative AI

Fitur cerdas aplikasi ini ditenagai oleh **Groq SDK** menggunakan model **Llama-3.3-70b**.

### 1. AI Nutritionist (Meal Plan)
Fungsi ini merekayasa prompt untuk menghasilkan rencana makan terstruktur dalam format JSON. Prompt secara spesifik meminta nama makanan Indonesia yang terdengar lezat namun tetap sesuai pagu kalori.

**File:** `src/services/ai.ts`

```typescript
export const generateMealPlanAI = async (
  targetCalories: number, dietType: string, nutritionReference: any[]
): Promise<DailyMealPlan | null> => {
  
  // Prompt Engineering
  const prompt = `
    You are an expert AI Nutritionist for an Indonesian audience.
    Your task is to generate a daily meal plan... that totals approximately **${targetCalories} kcal**.
    Diet Goal: ${dietType}.

    **Strict Requirements:**
    1. **Total Calories**: Must be within +/- 50 kcal.
    2. **Language**: Use **Indonesian Food Names** (e.g., "Nasi Goreng Spesial").
    3. **Format**: Return ONLY valid JSON...
      {
        "breakfast": [{ "name": "Menu Name", "calories": 0, "protein": 0, "carbs": 0, "fat": 0 }],
        ...
      }
  `;

  const result = await generateAIContent(prompt);
  // ... Parsing dan validasi JSON response ...
};
```

### 2. AI Fitness Trainer (Workout Plan)
Mirip dengan Meal Plan, fitur ini membuat program latihan. Logic di dalam prompt menyesuaikan "Volume" (Sets x Reps) berdasarkan usia dan gender, serta memilih jenis latihan yang aman (Low Impact) jika pengguna memiliki BMI tinggi (Overweight/Obese).

**File:** `src/services/ai.ts`

```typescript
export const generateExercisePlanAI = async (
  targetCalories: number, userGoal: string, 
  fitnessLevel: string, userData?: any
): Promise<WorkoutPlan | null> => {
  
  // Dynamic Context Injection
  const profileText = userData ? `Weight: ${userData.weight} kg...` : "Standard Adult";

  const prompt = `
    You are an expert AI Fitness Trainer...
    ${profileText}
    Target Burn: **${Math.round(targetCalories * 0.25)} - ${Math.round(targetCalories * 0.4)} kcal**.

    **Strict Scientific Requirements:**
    1. **Personalization**: 
       - Adjust volume specifically for a ${userData?.age || "adult"} year old.
       - If user is overweight, prioritize low-impact movements.
       - If Goal is 'Weight Loss', focus on Metabolic Conditioning.
    
    2. **Structure**: Warm Up, Main Workout, Cool Down.
    3. **Format**: Return ONLY valid JSON...
  `;
  
  // ... Call AI Service ...
};
```

---

### 3. AI Health Coach (Nutrition & Fitness)
Fitur ini menggabungkan Meal Plan dan Workout Plan untuk memberikan rekomendasi yang komprehensif. Prompt ini memastikan keseimbangan antara nutrisi dan latihan, serta memberikan saran tambahan untuk mencegah kecanduan makanan.

**File:** `src/services/ai.ts`

```typescript
export const generateHealthPlanAI = async (
  targetCalories: number, dietType: string, 
  userGoal: string, fitnessLevel: string, 
  userData?: any
): Promise<HealthPlan | null> => {
  
  // ... Generate Meal Plan ...
  
  // ... Generate Workout Plan ...
  
  // ... Generate Additional Recommendations ...
};
```
