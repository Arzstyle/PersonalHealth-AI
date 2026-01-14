import Groq from "groq-sdk";

export const API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";
export const MODEL = "llama-3.3-70b-versatile";

const groq = new Groq({ apiKey: API_KEY, dangerouslyAllowBrowser: true });

export interface AIResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export interface MealGeneratedItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  image?: string;
}

export interface DailyMealPlan {
  breakfast: MealGeneratedItem[];
  lunch: MealGeneratedItem[];
  dinner: MealGeneratedItem[];
  snack: MealGeneratedItem[];
}

function extractFirstJson(text: string): string {
  const firstCurly = text.indexOf("{");
  const firstSquare = text.indexOf("[");

  let startIndex = -1;
  let openChar = "";
  let closeChar = "";

  if (firstCurly === -1 && firstSquare === -1) return text.trim();

  if (firstCurly !== -1 && (firstSquare === -1 || firstCurly < firstSquare)) {
    startIndex = firstCurly;
    openChar = "{";
    closeChar = "}";
  } else {
    startIndex = firstSquare;
    openChar = "[";
    closeChar = "]";
  }

  let balanceCount = 0;
  let inString = false;
  let endIndex = -1;

  for (let i = startIndex; i < text.length; i++) {
    const char = text[i];

    if (char === '"' && text[i - 1] !== "\\") {
      inString = !inString;
    }

    if (!inString) {
      if (char === openChar) {
        balanceCount++;
      } else if (char === closeChar) {
        balanceCount--;
        if (balanceCount === 0) {
          endIndex = i;
          break;
        }
      }
    }
  }

  if (endIndex !== -1) {
    return text.substring(startIndex, endIndex + 1);
  }

  return text.substring(startIndex).trim();
}

export const generateAIContent = async (
  prompt: string
): Promise<AIResponse> => {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: MODEL,
      temperature: 0.7,
    });

    let text = completion.choices[0]?.message?.content || "";

    text = text.replace(/```json/g, "").replace(/```/g, "");

    const cleanData = extractFirstJson(text);

    return { success: true, data: cleanData };
  } catch (error: any) {
    console.error("Groq AI Error:", error);
<<<<<<< HEAD
    // Throw error to be caught by component
    throw new Error(error?.error?.message || error.message || "Unknown AI Error");
=======
    return { success: false, error: error.message || "Unknown error occurred" };
>>>>>>> 8aaccfdcafabe2d66f1b9f88d0e3b21248ebc6f9
  }
};

export const generateMealPlanAI = async (
  targetCalories: number,
  dietType: string,
  nutritionReference: any[]
): Promise<DailyMealPlan | null> => {
  const referenceText = nutritionReference
    .map(
      (item) =>
        `- ${item.name}: ${item.calories}kcal, P:${item.proteins}g, F:${item.fat}g, C:${item.carbohydrate}g`
    )
    .join("\n");

  const prompt = `
    You are an expert AI Nutritionist for an Indonesian audience.
    Your task is to generate a daily meal plan (Breakfast, Lunch, Dinner, Snack) that totals approximately **${targetCalories} kcal**.
    Diet Goal: ${dietType}.

    **Validation Data (Reference Only - "Formality"):**
    The following are some real food items from our database to ground your reality, but you are NOT restricted to only these.
    ${referenceText}

    **Strict Requirements:**
    1. **Total Calories**: Must be within +/- 50 kcal of ${targetCalories}.
    2. **Language**: Use **Indonesian Food Names** that sound natural and appetizing (e.g., "Nasi Goreng Spesial", "Ayam Bakar Taliwang", "Sayur Asem"). Do NOT use stiff database names like "Beras giling mentah".
    3. **Macros**: Estimate realistic Protein (g), Carbs (g), and Fat (g) for each meal.
    4. **Format**: Return ONLY valid JSON matching this structure:
    {
      "breakfast": [{ "name": "Menu Name", "calories": 0, "protein": 0, "carbs": 0, "fat": 0 }],
      "lunch": [...],
      "dinner": [...],
      "snack": [...]
    }
    5. Do not include markdown formatting like \`\`\`json. Just the raw JSON string.
  `;

  const result = await generateAIContent(prompt);

  if (result.success && result.data) {
    try {
      const parsed = JSON.parse(result.data);

      if (!parsed.breakfast || !Array.isArray(parsed.breakfast)) {
        console.error("Invalid AI response structure:", parsed);
        return null;
      }
      return parsed as DailyMealPlan;
    } catch (e) {
      console.error("Failed to parse AI JSON:", e);
      return null;
    }
  }

  return null;
};

export interface ExerciseGeneratedItem {
  id?: string;
  name: string;
  sets: number;
  reps: string;
  muscle: string;
  difficulty: number;
  duration?: number;
}

export interface WorkoutPlan {
  warm_up: ExerciseGeneratedItem[];
  main_workout: ExerciseGeneratedItem[];
  cool_down: ExerciseGeneratedItem[];
}

export const generateExercisePlanAI = async (
  targetCalories: number,
  userGoal: string = "general",
  fitnessLevel: string = "moderate",
  userData?: { weight: number; height: number; age: number; gender: string }
): Promise<WorkoutPlan | null> => {
  const profileText = userData
    ? `User Profile:
       - Weight: ${userData.weight} kg
       - Height: ${userData.height} cm
       - Age: ${userData.age} years
       - Gender: ${userData.gender}`
    : "User Profile: Standard Adult";

  const prompt = `
    You are an expert AI Fitness Trainer and Physiologist.
    Design a highly personalized workout session (Warm Up, Main Workout, Cool Down) based on verified global health standards (ACSM, NSCA).
    
    ${profileText}
    Target Burn: **${Math.round(targetCalories * 0.25)} - ${Math.round(
    targetCalories * 0.4
  )} kcal**.
    primary Goal: ${userGoal}.
    Current Fitness Level: ${fitnessLevel}.

    **Strict Scientific Requirements:**
    1. **Personalization**: 
<<<<<<< HEAD
       - Adjust volume (Sets x Reps) specifically for a ${userData?.age || "adult"
    } year old ${userData?.gender || "person"}.
=======
       - Adjust volume (Sets x Reps) specifically for a ${
         userData?.age || "adult"
       } year old ${userData?.gender || "person"}.
>>>>>>> 8aaccfdcafabe2d66f1b9f88d0e3b21248ebc6f9
       - If user is overweight (high BMI), prioritize low-impact joint-friendly movements.
       - If Goal is 'Muscle Gain', focus on Hypertrophy ranges (8-12 reps).
       - If Goal is 'Weight Loss', focus on Metabolic Conditioning (high reps / timed intervals).
    
    2. **Structure**: 
       - Warm Up: 2-3 dynamic movements to prime the nervous system.
       - Main Workout: 4-6 exercises. Mix of Compound (Multi-joint) and Isolation.
       - Cool Down: 2-3 static stretches to aid recovery.

    3. **Language**: Use **English** for standard exercise names.
    
    4. **Format**: Return ONLY valid JSON:
    {
      "warm_up": [{ "name": "Exercise Name", "sets": 2, "reps": "30s", "muscle": "Full Body", "difficulty": 20 }],
      "main_workout": [{ "name": "Exercise Name", "sets": 3, "reps": "12", "muscle": "Target Muscle", "difficulty": 60 }],
      "cool_down": [...]
    }
    
    5. **Difficulty**: 0-100 scale (0=Very Easy, 100=Elite).
    6. Returns ONLY raw JSON. No markdown.
  `;

  const result = await generateAIContent(prompt);

  if (result.success && result.data) {
    try {
      const parsed = JSON.parse(result.data);
      if (!parsed.main_workout || !Array.isArray(parsed.main_workout)) {
        console.error("Invalid AI Workout structure:", parsed);
        return null;
      }
      return parsed as WorkoutPlan;
    } catch (e) {
      console.error("Failed to parse AI Workout JSON:", e);
      return null;
    }
  }
  return null;
};
