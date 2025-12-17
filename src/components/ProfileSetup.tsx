import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Ruler,
  Weight as WeightIcon,
  ChevronRight,
  Activity,
  Calendar,
  CheckCircle,
  User,
  Zap,
  TrendingDown,
  TrendingUp,
  Target,
  Armchair,
  Move,
  Utensils,
} from "lucide-react";
import {
  calculateBMI,
  getBMICategory,
  calculateDailyCalories,
  calculateIdealWeight,
  calculateBMR,
} from "../utils/calculations";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useUI } from "../context/UIContext";

const ProfileSetup: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useUI();
  const [step, setStep] = useState(1);
  const [user, setUser] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [height, setHeight] = useState<number | "">("");
  const [weight, setWeight] = useState<number | "">("");
  const [age, setAge] = useState<number | "">("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [activityLevel, setActivityLevel] = useState("moderate");
  const [goal, setGoal] = useState("weight-loss");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/onboarding");
    }
  }, [navigate]);

  const getBMRDisplay = () => {
    if (!weight || !height || !age) return "0.00";
    const val = calculateBMR(
      Number(weight),
      Number(height),
      Number(age),
      gender
    );
    return val.toFixed(2);
  };

  const getDailyCaloriesDisplay = () => {
    if (!weight || !height || !age) return 0;
    return calculateDailyCalories(
      Number(weight),
      Number(height),
      Number(age),
      gender,
      activityLevel,
      goal
    );
  };

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!height || !weight || !age) return;
    setStep(2);
  };

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !height || !weight || !age) return;

    const bmi = calculateBMI(Number(weight), Number(height));
    const bmr = calculateBMR(
      Number(weight),
      Number(height),
      Number(age),
      gender
    );
    const idealWeight = calculateIdealWeight(Number(height), gender);
    const dailyCalories = calculateDailyCalories(
      Number(weight),
      Number(height),
      Number(age),
      gender,
      activityLevel,
      goal
    );

    const updatedUser = {
      ...user,
      height: Number(height),
      weight: Number(weight),
      age: Number(age),
      gender,
      activityLevel,
      goal,
      bmi,
      bmr,
      idealWeight,
      dailyCalories,
      isSetupComplete: true,
      updatedAt: new Date().toISOString(),
    };

    setIsSaving(true);

    try {
      localStorage.setItem("user", JSON.stringify(updatedUser));

      const userRef = doc(db, "users", user.uid);
      setDoc(userRef, updatedUser, { merge: true }).catch((err) =>
        console.warn("Background Sync Warning:", err)
      );

      navigate("/dashboard");
    } catch (e) {
      console.error("Critical Local Save Error:", e);
      setIsSaving(false);
    }
  };

  const SelectionCard = ({
    selected,
    onClick,
    icon: Icon,
    label,
    desc,
  }: {
    selected: boolean;
    onClick: () => void;
    icon: any;
    label: string;
    desc?: string;
  }) => (
    <div
      onClick={onClick}
      className={`relative cursor-pointer p-3 sm:p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center text-center gap-2 group ${
        selected
          ? "bg-primary-50 dark:bg-primary-500/20 border-primary-500 ring-1 ring-primary-500 shadow-lg shadow-primary-500/10"
          : "bg-white dark:bg-black/20 border-gray-100 dark:border-white/10 hover:border-primary-300 dark:hover:border-primary-500/50 hover:bg-gray-50 dark:hover:bg-white/5"
      }`}
    >
      <div
        className={`p-2 sm:p-3 rounded-full transition-colors ${
          selected
            ? "bg-primary-500 text-white"
            : "bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 group-hover:text-primary-500 group-hover:bg-primary-50 dark:group-hover:bg-primary-500/20"
        }`}
      >
        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>
      <div>
        <h3
          className={`text-xs sm:text-sm font-bold uppercase tracking-wider ${
            selected
              ? "text-primary-700 dark:text-primary-400"
              : "text-gray-700 dark:text-gray-300"
          }`}
        >
          {label}
        </h3>
        {desc && (
          <p className="hidden sm:block text-[10px] text-gray-500 dark:text-gray-400 mt-1 leading-tight">
            {desc}
          </p>
        )}
      </div>
      {selected && (
        <div className="absolute top-2 right-2 text-primary-500">
          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 fill-primary-100 dark:fill-primary-900" />
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] dark:bg-[#050b14] relative overflow-hidden font-sans text-gray-900 dark:text-gray-100 transition-colors duration-500">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-200/40 dark:bg-primary-500/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen transition-all duration-700"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-200/40 dark:bg-blue-500/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen transition-all duration-700"></div>

      <div className="relative z-10 w-full max-w-2xl p-4 md:p-6">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div
            className={`h-1.5 rounded-full transition-all duration-500 ${
              step >= 1
                ? "w-16 bg-primary-500"
                : "w-16 bg-gray-200 dark:bg-gray-800"
            }`}
          ></div>
          <div
            className={`h-1.5 rounded-full transition-all duration-500 ${
              step >= 2
                ? "w-16 bg-primary-500"
                : "w-16 bg-gray-200 dark:bg-gray-800"
            }`}
          ></div>
        </div>

        <div className="bg-white/70 dark:bg-[#0a0f1e]/80 backdrop-blur-2xl border border-white/60 dark:border-white/10 rounded-[2rem] p-6 md:p-10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-2xl transition-all duration-300">
          {step === 1 && (
            <form
              onSubmit={handleNextStep1}
              className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-500/20 dark:to-blue-600/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-200 dark:border-blue-500/30 shadow-sm">
                  <Ruler className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
                  {t("profile.setup.title.step1")}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {t("profile.setup.desc.step1")}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest pl-1">
                    {t("profile.setup.label.height")}
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
                      className="w-full p-4 pl-12 bg-white dark:bg-black/20 border border-gray-100 dark:border-white/10 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-gray-900 dark:text-white font-sans text-xl font-bold transition-all placeholder-gray-300 dark:placeholder-gray-700 shadow-sm"
                      placeholder="175"
                      required
                      min={100}
                      max={250}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest pl-1">
                    {t("profile.setup.label.weight")}
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
                      className="w-full p-4 pl-12 bg-white dark:bg-black/20 border border-gray-100 dark:border-white/10 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-gray-900 dark:text-white font-sans text-xl font-bold transition-all placeholder-gray-300 dark:placeholder-gray-700 shadow-sm"
                      placeholder="70"
                      required
                      min={30}
                      max={300}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest pl-1">
                    {t("profile.setup.label.age")}
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
                      className="w-full p-4 pl-12 bg-white dark:bg-black/20 border border-gray-100 dark:border-white/10 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none text-gray-900 dark:text-white font-sans text-xl font-bold transition-all placeholder-gray-300 dark:placeholder-gray-700 shadow-sm"
                      placeholder="25"
                      required
                      min={10}
                      max={120}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest pl-1">
                    {t("profile.setup.label.gender")}
                  </label>
                  <div className="grid grid-cols-2 gap-3 h-[60px]">
                    <button
                      type="button"
                      onClick={() => setGender("male")}
                      className={`rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                        gender === "male"
                          ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-600 ring-offset-1 dark:ring-offset-black"
                          : "bg-white dark:bg-white/5 text-gray-500 hover:bg-gray-50 dark:hover:bg-white/10 border border-gray-100 dark:border-white/10"
                      }`}
                    >
                      <User className="w-4 h-4" />{" "}
                      {t("profile.setup.gender.male")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender("female")}
                      className={`rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                        gender === "female"
                          ? "bg-pink-500 text-white shadow-md ring-2 ring-pink-500 ring-offset-1 dark:ring-offset-black"
                          : "bg-white dark:bg-white/5 text-gray-500 hover:bg-gray-50 dark:hover:bg-white/10 border border-gray-100 dark:border-white/10"
                      }`}
                    >
                      <User className="w-4 h-4" />{" "}
                      {t("profile.setup.gender.female")}
                    </button>
                  </div>
                </div>
              </div>

              {height && weight && age && (
                <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-500/30 rounded-2xl p-4 text-center shadow-sm">
                    <p className="text-[10px] text-blue-600 dark:text-blue-400 uppercase font-bold mb-1 tracking-wider">
                      {t("profile.setup.bmi.estimated")}
                    </p>
                    <div className="text-3xl sm:text-4xl font-sans font-black text-gray-900 dark:text-white tracking-tight mb-1">
                      {calculateBMI(Number(weight), Number(height))}
                    </div>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        calculateBMI(Number(weight), Number(height)) < 18.5
                          ? "bg-blue-100 text-blue-700 border-blue-200"
                          : calculateBMI(Number(weight), Number(height)) < 25
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-orange-100 text-orange-700 border-orange-200"
                      }`}
                    >
                      {
                        getBMICategory(
                          calculateBMI(Number(weight), Number(height))
                        ).category
                      }
                    </span>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-100 dark:border-green-500/30 rounded-2xl p-4 text-center shadow-sm">
                    <p className="text-[10px] text-green-600 dark:text-green-400 uppercase font-bold mb-1 tracking-wider">
                      {t("profile.setup.bmr.title")}
                    </p>
                    <div className="text-3xl sm:text-4xl font-sans font-black text-gray-900 dark:text-white tracking-tight mb-1">
                      {getBMRDisplay()}
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border bg-green-100 text-green-700 border-green-200">
                      kcal/day (Base)
                    </span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 bg-gray-900 dark:bg-gradient-to-r dark:from-blue-600 dark:to-blue-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group mt-4"
              >
                <span>{t("profile.setup.btn.next")}</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          )}

          {step === 2 && (
            <form
              onSubmit={handleFinish}
              className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-primary-500/20 dark:to-primary-600/20 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary-200 dark:border-primary-500/30 shadow-sm">
                  <Activity className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
                  {t("profile.setup.title.step2")}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {t("profile.setup.desc.step2")}
                </p>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest pl-1">
                  {t("profile.setup.label.activity")}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <SelectionCard
                    selected={activityLevel === "sedentary"}
                    onClick={() => setActivityLevel("sedentary")}
                    icon={Armchair}
                    label="Low"
                    desc="Sedentary"
                  />
                  <SelectionCard
                    selected={activityLevel === "moderate"}
                    onClick={() => setActivityLevel("moderate")}
                    icon={Move}
                    label="Med"
                    desc="Moderate"
                  />
                  <SelectionCard
                    selected={activityLevel === "active"}
                    onClick={() => setActivityLevel("active")}
                    icon={Zap}
                    label="High"
                    desc="Active"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest pl-1">
                  {t("profile.setup.label.goal")}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <SelectionCard
                    selected={goal === "weight-loss"}
                    onClick={() => setGoal("weight-loss")}
                    icon={TrendingDown}
                    label="Loss"
                    desc="Weight"
                  />
                  <SelectionCard
                    selected={goal === "weight-gain"}
                    onClick={() => setGoal("weight-gain")}
                    icon={TrendingUp}
                    label="Gain"
                    desc="Weight"
                  />
                  <SelectionCard
                    selected={goal === "muscle-gain"}
                    onClick={() => setGoal("muscle-gain")}
                    icon={Target}
                    label="Build"
                    desc="Muscle"
                  />
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-primary-500/10 dark:to-orange-600/10 border border-orange-100 dark:border-primary-500/30 rounded-2xl p-5 flex items-center justify-between animate-in zoom-in duration-300 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-white dark:bg-primary-500/20 rounded-xl text-orange-600 dark:text-primary-400 shadow-sm">
                    <Utensils className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-orange-700 dark:text-primary-400 uppercase font-bold tracking-wide">
                      Daily Calorie Target
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                      Based on Activity & Goal
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-sans font-black text-gray-900 dark:text-white tracking-tight">
                    {getDailyCaloriesDisplay()}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-1 font-bold">
                    kcal
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-4 bg-white dark:bg-transparent border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400 font-bold rounded-xl transition-all shadow-sm"
                >
                  {t("profile.setup.btn.back")}
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-4 bg-gray-900 dark:bg-gradient-to-r dark:from-primary-600 dark:to-primary-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <Activity className="w-5 h-5 animate-spin" />
                  ) : (
                    <CheckCircle className="w-5 h-5" />
                  )}
                  <span>
                    {isSaving ? "Saving..." : t("profile.setup.btn.finish")}
                  </span>
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
