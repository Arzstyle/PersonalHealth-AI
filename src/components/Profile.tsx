import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  User as UserIcon,
  Settings,
  LogOut,
  Mail,
  Calendar,
  Ruler,
  Weight,
  Activity,
  Target,
  Utensils,
  ShieldCheck,
  Edit3,
  X,
  Save,
  Check,
  Camera,
  Scan,
  Cpu,
  Zap,
  Crosshair,
} from "lucide-react";
import type { User } from "../types";
import { useAuth } from "../context/AuthContext";
import { useUI } from "../context/UIContext";

const ACTIVITY_LEVELS = [
  { value: "sedentary", label: "Sedentary (Jarang Gerak)" },
  { value: "light", label: "Light (1-3x/minggu)" },
  { value: "moderate", label: "Moderate (3-5x/minggu)" },
  { value: "active", label: "Active (6-7x/minggu)" },
  { value: "very-active", label: "Very Active (Fisik Berat)" },
];

const GOALS = [
  { value: "weight-loss", label: "Weight Loss" },
  { value: "weight-gain", label: "Weight Gain" },
  { value: "muscle-gain", label: "Muscle Gain" },
];

const DIETARY_OPTIONS = [
  "Vegetarian",
  "Vegan",
  "Keto",
  "Paleo",
  "Dairy-Free",
  "Gluten-Free",
  "Halal",
];
const ALLERGY_OPTIONS = [
  "Nuts",
  "Dairy",
  "Soy",
  "Eggs",
  "Shellfish",
  "Seafood",
  "Gluten",
];

interface ExtendedUser extends User {
  avatar?: string;
}

const Profile: React.FC = () => {
  const { t } = useUI();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [activeModal, setActiveModal] = useState<
    "settings" | "goals" | "preferences" | null
  >(null);
  const [formData, setFormData] = useState<Partial<ExtendedUser>>({});

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser({
          ...parsedUser,
          dietaryRestrictions: parsedUser.dietaryRestrictions || [],
          allergies: parsedUser.allergies || [],
        });
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }
  }, []);

  const handleLogout = async () => {
    if (window.confirm("Disconnect from system?")) {
      try {
        await logout();
        localStorage.removeItem("user");
        localStorage.removeItem("dietPlan");
        localStorage.removeItem("nutritionData");
        navigate("/onboarding");
      } catch (error) {
        console.error("Logout failed", error);
      }
    }
  };

  const openModal = (type: "settings" | "goals" | "preferences") => {
    if (user) {
      setFormData({ ...user });
      setActiveModal(type);
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setFormData({});
  };

  const handleSave = () => {
    if (!user) return;
    const updatedUser = { ...user, ...formData };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    closeModal();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: [
        "age",
        "height",
        "weight",
        "idealWeight",
        "dailyCalories",
      ].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File too large! Max 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () =>
        setFormData((prev) => ({ ...prev, avatar: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const toggleArrayItem = (
    field: "dietaryRestrictions" | "allergies",
    item: string
  ) => {
    const currentList = formData[field] || [];
    const newList = currentList.includes(item)
      ? currentList.filter((i) => i !== item)
      : [...currentList, item];
    setFormData((prev) => ({ ...prev, [field]: newList }));
  };

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center text-cyan-500 animate-pulse font-mono">
        INITIALIZING SYSTEM...
      </div>
    );

  const joinDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="w-full max-w-[1800px] mx-auto px-6 lg:px-10 pb-20 relative overflow-hidden transition-colors duration-500 ease-in-out">
      <div className="absolute inset-0 -z-10 h-full w-full bg-slate-50 dark:bg-transparent bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none transition-all duration-500 ease-in-out animate-pulse-slow"></div>

      <style>{`
        .animate-pulse-slow { animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        .hover-scan { position: relative; overflow: hidden; }
        .hover-scan::before {
          content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%;
          background: linear-gradient(to right, transparent, rgba(15, 23, 42, 0.05), transparent);
          transform: skewX(-25deg); transition: 0.7s; pointer-events: none; z-index: 20;
        }
        .dark .hover-scan::before { background: linear-gradient(to right, transparent, rgba(168, 85, 247, 0.2), transparent); }
        .hover-scan:hover::before { left: 150%; }
        .delay-100 { animation-delay: 100ms; } .delay-200 { animation-delay: 200ms; } .delay-300 { animation-delay: 300ms; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
        .forwards { animation-fill-mode: forwards; }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 10s linear infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(156, 163, 175, 0.5); border-radius: 20px; }
      `}</style>

      <div className="flex flex-col md:flex-row justify-between items-end mb-10 pt-4 gap-6 animate-enter transform-gpu">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3 transition-colors duration-500">
            <div className="relative p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-purple-500/30 shadow-sm dark:shadow-none transition-all duration-500 hover:scale-105 group overflow-hidden">
              <div className="absolute inset-0 bg-purple-50 dark:bg-purple-500/10 animate-pulse transition-colors duration-500"></div>
              <UserIcon className="w-8 h-8 text-purple-600 dark:text-purple-400 relative z-10 transition-colors duration-500" />
            </div>
            {t("profile.title")}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 ml-1 flex items-center gap-2 transition-colors duration-500">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
            {t("profile.subtitle")}
          </p>
        </div>

        <button
          onClick={() => openModal("settings")}
          className="group relative px-5 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white font-bold rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-500 flex items-center gap-2 overflow-hidden hover-scan"
        >
          <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
          <span>{t("profile.edit")}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6 animate-enter delay-100 forwards">
          <div className="glass-panel p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 bg-white/80 dark:bg-slate-900/80 backdrop-blur shadow-lg relative overflow-hidden group hover-scan transition-all duration-500">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-purple-100 via-blue-50 to-transparent dark:from-purple-900/20 dark:via-blue-900/10 dark:to-transparent z-0 transition-colors duration-500"></div>
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl transition-opacity duration-500"></div>

            <div className="relative z-10 mt-8 text-center">
              <div className="relative w-36 h-36 mx-auto mb-6">
                <div className="absolute inset-0 border-2 border-dashed border-purple-300 dark:border-purple-500/30 rounded-full animate-spin-slow transition-colors duration-500"></div>
                <div className="absolute inset-2 border border-blue-200 dark:border-blue-500/20 rounded-full transition-colors duration-500"></div>
                <div className="w-full h-full rounded-full p-2">
                  <div className="w-full h-full rounded-full overflow-hidden relative shadow-lg bg-white dark:bg-slate-800 transition-colors duration-500">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-5xl font-black text-white">
                        {user.name?.charAt(0) || "U"}
                      </div>
                    )}
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full animate-pulse shadow-md transition-colors duration-500"></div>
              </div>

              <h2 className="text-2xl font-black text-slate-900 dark:text-white transition-colors duration-500">
                {user.name}
              </h2>
              <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 text-sm mt-1 mb-6 font-mono transition-colors duration-500">
                <Mail className="w-3 h-3" /> {user.email}
              </div>

              <div className="flex justify-center gap-3 mb-8">
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1 border border-green-200 dark:border-green-500/20 transition-colors duration-500">
                  <ShieldCheck className="w-3 h-3" /> Verified Operator
                </span>
              </div>

              <div className="border-t border-slate-100 dark:border-white/5 pt-6 transition-colors duration-500">
                <div className="flex justify-between text-sm mb-3 text-slate-600 dark:text-slate-400 font-medium transition-colors duration-500">
                  <span>{t("profile.joined")}</span>
                  <span className="text-slate-900 dark:text-white font-mono transition-colors duration-500">
                    {joinDate}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 font-medium transition-colors duration-500">
                  <span>{t("profile.status")}</span>
                  <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>{" "}
                    {t("profile.online")}
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full mt-8 py-3 rounded-xl border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 font-bold text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 flex items-center justify-center gap-2 group/logout"
              >
                <LogOut className="w-4 h-4 group-hover/logout:translate-x-1 transition-transform" />{" "}
                {t("profile.disconnect")}
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6 animate-enter delay-200 forwards">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                label: t("profile.label.height"),
                val: user.height,
                unit: "cm",
                icon: Ruler,
                color: "text-blue-600 dark:text-blue-400",
                bg: "bg-blue-50 dark:bg-blue-900/20",
                border: "border-blue-200 dark:border-blue-500/30",
              },
              {
                label: t("profile.label.weight"),
                val: user.weight,
                unit: "kg",
                icon: Weight,
                color: "text-green-600 dark:text-green-400",
                bg: "bg-green-50 dark:bg-green-900/20",
                border: "border-green-200 dark:border-green-500/30",
              },
              {
                label: t("profile.label.age"),
                val: user.age,
                unit: "th",
                icon: Calendar,
                color: "text-orange-600 dark:text-orange-400",
                bg: "bg-orange-50 dark:bg-orange-900/20",
                border: "border-orange-200 dark:border-orange-500/30",
              },
              {
                label: t("profile.label.bmi"),
                val: user.bmi,
                unit: "",
                icon: Activity,
                color: "text-purple-600 dark:text-purple-400",
                bg: "bg-purple-50 dark:bg-purple-900/20",
                border: "border-purple-200 dark:border-purple-500/30",
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                className={`bg-white/70 dark:bg-slate-900/50 backdrop-blur p-4 rounded-2xl border ${stat.border} shadow-sm hover:-translate-y-1 transition-all duration-500 group hover-scan`}
              >
                <div
                  className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center ${stat.color} mb-3 transition-colors duration-500`}
                >
                  <stat.icon className="w-5 h-5" />
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest transition-colors duration-500">
                  {stat.label}
                </p>
                <p className="text-2xl font-black text-slate-900 dark:text-white font-mono transition-colors duration-500">
                  {stat.val}{" "}
                  <span className="text-xs font-normal text-slate-400">
                    {stat.unit}
                  </span>
                </p>
              </div>
            ))}
          </div>

          <div className="glass-panel p-6 rounded-[2rem] border border-slate-200 dark:border-white/5 bg-white/80 dark:bg-slate-900/80 backdrop-blur shadow-sm relative overflow-hidden group hover-scan transition-all duration-500">
            <div className="flex justify-between items-center mb-6 relative z-10">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2 transition-colors duration-500">
                <Target className="w-5 h-5 text-red-500" />{" "}
                {t("profile.target_ops")}
              </h3>
              <button
                onClick={() => openModal("goals")}
                className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-300"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-white/5 transition-colors duration-500">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400 transition-colors duration-500">
                    <Crosshair className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white capitalize transition-colors duration-500">
                      {user.goal?.replace("-", " ") || "No Goal"}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors duration-500">
                      Misi Utama
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-slate-900 dark:text-white font-mono transition-colors duration-500">
                    {user.idealWeight}
                  </span>
                  <span className="text-xs text-slate-500 ml-1">kg</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-white/5 transition-colors duration-500">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 transition-colors duration-500">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white capitalize transition-colors duration-500">
                      {user.activityLevel?.replace("-", " ") || "Unknown"}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors duration-500">
                      Output Energi
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-slate-900 dark:text-white font-mono transition-colors duration-500">
                    {user.dailyCalories}
                  </span>
                  <span className="text-xs text-slate-500 ml-1">kcal</span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-[2rem] border border-slate-200 dark:border-white/5 bg-white/80 dark:bg-slate-900/80 backdrop-blur shadow-sm relative overflow-hidden group hover-scan transition-all duration-500">
            <div className="flex justify-between items-center mb-6 relative z-10">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2 transition-colors duration-500">
                <Utensils className="w-5 h-5 text-green-500" />{" "}
                {t("profile.nutrition_proto")}
              </h3>
              <button
                onClick={() => openModal("preferences")}
                className="p-2 text-slate-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all duration-300"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 relative z-10">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 transition-colors duration-500">
                  {t("profile.restrictions")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {user.dietaryRestrictions.length > 0 ? (
                    user.dietaryRestrictions.map((item, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-bold text-xs border border-green-100 dark:border-green-500/20 transition-colors duration-500 flex items-center gap-1"
                      >
                        <Scan className="w-3 h-3" /> {item}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-400 italic">
                      {t("profile.no_restrictions")}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 transition-colors duration-500">
                  {t("profile.allergies")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {user.allergies.length > 0 ? (
                    user.allergies.map((item, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 font-bold text-xs border border-red-100 dark:border-red-500/20 transition-colors duration-500 flex items-center gap-1"
                      >
                        <X className="w-3 h-3" /> {item}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-400 italic">
                      {t("profile.no_allergies")}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fade-in transition-all duration-500">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] w-full max-w-lg shadow-2xl relative border border-slate-200 dark:border-purple-500/30 overflow-hidden flex flex-col max-h-[90vh] transition-all duration-500">
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,transparent,rgba(168,85,247,0.05),transparent)] bg-[size:100%_3px] animate-scan"></div>

            <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 relative z-10 transition-colors duration-500">
              <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2 transition-colors duration-500">
                <Cpu className="w-5 h-5 text-purple-500" />
                {activeModal === "settings" && t("profile.modal.identity")}
                {activeModal === "goals" && t("profile.modal.objectives")}
                {activeModal === "preferences" && t("profile.modal.protocols")}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto relative z-10 custom-scrollbar">
              {activeModal === "settings" && (
                <div className="space-y-6">
                  <div className="flex flex-col items-center">
                    <div
                      className="relative group cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-100 dark:border-slate-700 shadow-md transition-colors duration-500">
                        {formData.avatar ? (
                          <img
                            src={formData.avatar}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-white text-3xl font-bold">
                            {formData.name?.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-2 font-mono transition-colors duration-500">
                      {t("profile.tap_update")}
                    </p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1 transition-colors duration-500">
                        {t("profile.form.fullname")}
                      </label>
                      <input
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all duration-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1 transition-colors duration-500">
                          {t("profile.label.age")}
                        </label>
                        <input
                          name="age"
                          type="number"
                          value={formData.age}
                          onChange={handleInputChange}
                          className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all duration-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1 transition-colors duration-500">
                          {t("profile.form.email")}
                        </label>
                        <input
                          name="email"
                          type="email"
                          value={formData.email}
                          disabled
                          className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 text-slate-500 cursor-not-allowed transition-all duration-500"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1 transition-colors duration-500">
                          {t("profile.label.height")} (cm)
                        </label>
                        <input
                          name="height"
                          type="number"
                          value={formData.height}
                          onChange={handleInputChange}
                          className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all duration-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1 transition-colors duration-500">
                          {t("profile.label.weight")} (kg)
                        </label>
                        <input
                          name="weight"
                          type="number"
                          value={formData.weight}
                          onChange={handleInputChange}
                          className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all duration-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeModal === "goals" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1 transition-colors duration-500">
                      {t("profile.form.target_main")}
                    </label>
                    <select
                      name="goal"
                      value={formData.goal}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition-all duration-500"
                    >
                      {GOALS.map((g) => (
                        <option key={g.value} value={g.value}>
                          {g.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1 transition-colors duration-500">
                      {t("profile.form.target_weight")} (kg)
                    </label>
                    <input
                      name="idealWeight"
                      type="number"
                      value={formData.idealWeight}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition-all duration-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1 transition-colors duration-500">
                      {t("profile.form.activity")}
                    </label>
                    <select
                      name="activityLevel"
                      value={formData.activityLevel}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition-all duration-500"
                    >
                      {ACTIVITY_LEVELS.map((a) => (
                        <option key={a.value} value={a.value}>
                          {a.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1 transition-colors duration-500">
                      {t("profile.form.calories")}
                    </label>
                    <input
                      name="dailyCalories"
                      type="number"
                      value={formData.dailyCalories}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition-all duration-500"
                    />
                  </div>
                </div>
              )}

              {activeModal === "preferences" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 transition-colors duration-500">
                      {t("profile.restrictions")}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {DIETARY_OPTIONS.map((item) => (
                        <button
                          key={item}
                          onClick={() =>
                            toggleArrayItem("dietaryRestrictions", item)
                          }
                          className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all duration-300 flex items-center gap-2 ${
                            formData.dietaryRestrictions?.includes(item)
                              ? "bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-500/30 text-green-700 dark:text-green-400"
                              : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                          }`}
                        >
                          {item}{" "}
                          {formData.dietaryRestrictions?.includes(item) && (
                            <Check className="w-3 h-3" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 transition-colors duration-500">
                      {t("profile.allergies")}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {ALLERGY_OPTIONS.map((item) => (
                        <button
                          key={item}
                          onClick={() => toggleArrayItem("allergies", item)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all duration-300 flex items-center gap-2 ${
                            formData.allergies?.includes(item)
                              ? "bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400"
                              : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                          }`}
                        >
                          {item}{" "}
                          {formData.allergies?.includes(item) && (
                            <Check className="w-3 h-3" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3 relative z-10 transition-colors duration-500">
              <button
                onClick={closeModal}
                className="px-5 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
              >
                {t("profile.form.cancel")}
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all flex items-center gap-2 shadow-lg shadow-purple-500/20 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <Save className="w-4 h-4 relative z-10" />{" "}
                <span className="relative z-10">{t("profile.form.save")}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
