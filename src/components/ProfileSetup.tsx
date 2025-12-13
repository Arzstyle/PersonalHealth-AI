import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Ruler,
  Weight as WeightIcon,
  ChevronRight,
  Activity,
  Calendar,
  User as UserIcon,
  Target,
  CheckCircle,
} from "lucide-react";
import {
  calculateBMI,
  getBMICategory,
  calculateDailyCalories,
  calculateIdealWeight,
} from "../utils/calculations";

const ProfileSetup: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [user, setUser] = useState<any>(null);

  // Form State
  const [height, setHeight] = useState<number | "">("");
  const [weight, setWeight] = useState<number | "">("");
  const [age, setAge] = useState<number | "">("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [activityLevel, setActivityLevel] = useState("moderate");
  const [goal, setGoal] = useState("weight-loss");

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // If no user, redirect back to onboarding
      navigate("/onboarding");
    }
  }, [navigate]);

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!height || !weight) return;
    setStep(2);
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !height || !weight || !age) return;

    // 1. Calculate BMI
    const bmi = calculateBMI(Number(weight), Number(height));
    const bmiInfo = getBMICategory(bmi);

    // 2. Calculate Ideal Weight
    const idealWeight = calculateIdealWeight(Number(height), gender);

    // 3. Calculate BMR & TDEE (Daily Calories)
    const dailyCalories = calculateDailyCalories(
      Number(weight),
      Number(height),
      Number(age),
      gender,
      activityLevel,
      goal
    );

    // 4. Update User Data
    const updatedUser = {
      ...user,
      height: Number(height),
      weight: Number(weight),
      age: Number(age),
      gender,
      activityLevel,
      goal,
      bmi,
      idealWeight,
      dailyCalories,
      isSetupComplete: true,
      updatedAt: new Date().toISOString(),
    };

    // 5. Save & Redirect
    localStorage.setItem("user", JSON.stringify(updatedUser));
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#050b14] relative overflow-hidden font-sans text-gray-100">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      <div className="absolute top-[-20%] right-[-20%] w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[120px] mix-blend-screen"></div>
      <div className="absolute bottom-[-20%] left-[-20%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] mix-blend-screen"></div>

      <div className="relative z-10 w-full max-w-lg p-6">
        {/* Progress Bar */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div
            className={`h-1.5 rounded-full transition-all duration-500 ${
              step >= 1 ? "w-16 bg-primary-500" : "w-16 bg-gray-800"
            }`}
          ></div>
          <div
            className={`h-1.5 rounded-full transition-all duration-500 ${
              step >= 2 ? "w-16 bg-primary-500" : "w-16 bg-gray-800"
            }`}
          ></div>
        </div>

        <div className="bg-[#0a0f1e]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {/* STEP 1: BMI DATA (Height & Weight) */}
          {step === 1 && (
            <form
              onSubmit={handleNextStep1}
              className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500"
            >
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
                  <Ruler className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-display font-bold text-white mb-2">
                  Body Metrics
                </h2>
                <p className="text-gray-400 text-sm">
                  Let's start by calculating your BMI.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">
                    Height (cm)
                  </label>
                  <div className="relative group">
                    <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="number"
                      value={height}
                      onChange={(e) =>
                        setHeight(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                      className="w-full p-4 pl-12 bg-black/20 border border-white/10 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white font-display text-lg transition-all placeholder-gray-700"
                      placeholder="e.g. 175"
                      required
                      min={100}
                      max={250}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">
                    Weight (kg)
                  </label>
                  <div className="relative group">
                    <WeightIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) =>
                        setWeight(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                      className="w-full p-4 pl-12 bg-black/20 border border-white/10 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white font-display text-lg transition-all placeholder-gray-700"
                      placeholder="e.g. 70"
                      required
                      min={30}
                      max={300}
                    />
                  </div>
                </div>
              </div>

              {/* BMI Preview (Real-time) */}
              {height && weight && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-center animate-in zoom-in duration-300">
                  <p className="text-xs text-blue-400 uppercase font-bold mb-1">
                    Estimated BMI
                  </p>
                  <div className="text-3xl font-display font-black text-white">
                    {calculateBMI(Number(weight), Number(height))}
                  </div>
                  <p
                    className={`text-sm font-bold mt-1 ${
                      calculateBMI(Number(weight), Number(height)) < 18.5
                        ? "text-blue-400"
                        : calculateBMI(Number(weight), Number(height)) < 25
                        ? "text-green-400"
                        : calculateBMI(Number(weight), Number(height)) < 30
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}
                  >
                    {
                      getBMICategory(
                        calculateBMI(Number(weight), Number(height))
                      ).category
                    }
                  </p>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group mt-4"
              >
                <span>Next Step</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          )}

          {/* STEP 2: METABOLIC DATA (Age, Gender, Activity) */}
          {step === 2 && (
            <form
              onSubmit={handleFinish}
              className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500"
            >
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-primary-500/20 text-primary-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary-500/30">
                  <Activity className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-display font-bold text-white mb-2">
                  Metabolic Profile
                </h2>
                <p className="text-gray-400 text-sm">
                  We calculate your BMR & TDEE based on this.
                </p>
              </div>

              {/* Age & Gender */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">
                    Age
                  </label>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                    <input
                      type="number"
                      value={age}
                      onChange={(e) =>
                        setAge(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                      className="w-full p-4 pl-12 bg-black/20 border border-white/10 rounded-xl focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none text-white font-display text-lg transition-all placeholder-gray-700"
                      placeholder="e.g. 25"
                      required
                      min={10}
                      max={120}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">
                    Gender
                  </label>
                  <div className="relative">
                    <div className="flex bg-black/20 rounded-xl p-1 border border-white/10 h-[60px]">
                      <button
                        type="button"
                        onClick={() => setGender("male")}
                        className={`flex-1 rounded-lg text-sm font-bold transition-all ${
                          gender === "male"
                            ? "bg-primary-600 text-white shadow-lg"
                            : "text-gray-500 hover:text-white"
                        }`}
                      >
                        Male
                      </button>
                      <button
                        type="button"
                        onClick={() => setGender("female")}
                        className={`flex-1 rounded-lg text-sm font-bold transition-all ${
                          gender === "female"
                            ? "bg-pink-600 text-white shadow-lg"
                            : "text-gray-500 hover:text-white"
                        }`}
                      >
                        Female
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Level */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">
                  Activity Level
                </label>
                <select
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value)}
                  className="w-full p-4 bg-black/20 border border-white/10 rounded-xl focus:border-primary-500 outline-none text-white text-sm appearance-none cursor-pointer hover:bg-black/30 transition-colors"
                >
                  <option value="sedentary" className="text-gray-900">
                    Sedentary (Jarang Olahraga)
                  </option>
                  <option value="moderate" className="text-gray-900">
                    Moderate (Olahraga 3-5x/minggu)
                  </option>
                  <option value="active" className="text-gray-900">
                    Active (Olahraga Rutin/Berat)
                  </option>
                </select>
              </div>

              {/* Goal */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">
                  Primary Goal
                </label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full p-4 bg-black/20 border border-white/10 rounded-xl focus:border-primary-500 outline-none text-white text-sm appearance-none cursor-pointer hover:bg-black/30 transition-colors"
                >
                  <option value="weight-loss" className="text-gray-900">
                    Weight Loss
                  </option>
                  <option value="weight-gain" className="text-gray-900">
                    Weight Gain
                  </option>
                  <option value="muscle-gain" className="text-gray-900">
                    Muscle Gain
                  </option>
                </select>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-4 bg-transparent border border-white/10 hover:bg-white/5 text-gray-400 font-bold rounded-xl transition-all"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-bold rounded-xl shadow-lg shadow-primary-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>Calculate & Finish</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
