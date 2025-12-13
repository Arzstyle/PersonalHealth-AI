import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  ChevronLeft,
  User,
  Target,
  Activity,
  LogIn,
} from "lucide-react";
import { signInWithGoogle } from "../firebase";
import {
  calculateBMI,
  calculateIdealWeight,
  calculateDailyCalories,
} from "../utils/calculations";
import {
  ACTIVITY_LEVELS,
  DIETARY_RESTRICTIONS,
  COMMON_ALLERGIES,
} from "../utils/constants";
import type { User as UserType } from "../types";

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    activityLevel: "",
    goal: "",
    dietaryRestrictions: [] as string[],
    allergies: [] as string[],
  });
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      const user = await signInWithGoogle();
      if (user) {
        if (isRegister) {
          // If in Register mode, proceed to next steps with pre-filled data
          setFormData((prev) => ({
            ...prev,
            name: user.displayName || "",
            email: user.email || "",
          }));
          setLoginEmail(user.email || "");
          setCurrentStep(2);
        } else {
          // If in Login mode, go to dashboard
          // Note: In a real app we would check if the user exists in DB.
          // For now we create a session.
          const userData = {
            id: user.uid,
            name: user.displayName || "User",
            email: user.email || "",
            // Provide defaults for required fields
            age: 25,
            gender: "male",
            height: 170,
            weight: 60,
            activityLevel: "moderate",
            goal: "weight-loss",
            dietaryRestrictions: [],
            allergies: [],
            createdAt: new Date(),
            bmi: 20,
            idealWeight: 60,
            dailyCalories: 2000,
          };
          localStorage.setItem("token", await user.getIdToken());
          localStorage.setItem("user", JSON.stringify(userData));
          navigate("/dashboard");
        }
      }
    } catch (error: any) {
      console.error(error);
      setLoginError("Failed to sign in with Google");
    }
  };

  const totalSteps = 5; // Updated to include login step

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
      } else {
        setLoginError(data.message);
      }
    } catch (err) {
      setLoginError("Server error");
    }
  };

  const handleRegister = async () => {
    if (!loginEmail || !loginPassword || !formData.name) {
      setLoginError("Please fill in all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.name,
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Simpan token dan data user ke localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        alert("Registration successful!");
        navigate("/dashboard");
      } else {
        setLoginError(data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Error during registration:", err);
      setLoginError("Server error");
    }
  };

  const handleComplete = () => {
    const user: UserType = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      age: parseInt(formData.age),
      gender: formData.gender as "male" | "female",
      height: parseInt(formData.height),
      weight: parseInt(formData.weight),
      activityLevel: formData.activityLevel as any,
      goal: formData.goal as any,
      dietaryRestrictions: formData.dietaryRestrictions,
      allergies: formData.allergies,
      bmi: calculateBMI(parseInt(formData.weight), parseInt(formData.height)),
      idealWeight: calculateIdealWeight(
        parseInt(formData.height),
        formData.gender as "male" | "female"
      ),
      dailyCalories: calculateDailyCalories(
        parseInt(formData.weight),
        parseInt(formData.height),
        parseInt(formData.age),
        formData.gender as "male" | "female",
        formData.activityLevel,
        formData.goal
      ),
      createdAt: new Date(),
    };

    localStorage.setItem("user", JSON.stringify(user));
    navigate("/dashboard");
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return true; // Login step is optional, can skip
      case 2:
        return (
          formData.name && formData.email && formData.age && formData.gender
        );
      case 3:
        return formData.height && formData.weight;
      case 4:
        return formData.activityLevel && formData.goal;
      case 5:
        return true; // Optional step
      default:
        return false;
    }
  };

  const handleCheckboxChange = (
    value: string,
    field: "dietaryRestrictions" | "allergies"
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Background Logo Transparan */}
        <img
          src="/img/logo.jpg" // ubah sesuai lokasi file logomu
          alt="Logo Background"
          className="absolute opacity-10 w-[500px] h-[500px] object-contain z-0 select-none pointer-events-none"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            filter: "blur(1px)",
          }}
        />

        {/* Progress Bar */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6">
          <div className="flex items-center justify-between text-white mb-4">
            <h1 className="text-2xl font-bold">Let's Get Started</h1>
            <span className="text-green-100">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
          <div className="w-full bg-green-700 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="p-8">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <LogIn className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {isRegister ? "Create Account" : "Welcome Back"}
                </h2>
                <p className="text-gray-600">
                  {isRegister
                    ? "Register to get started"
                    : "Login to your account or create a new one"}
                </p>
              </div>

              <div className="space-y-4">
                {isRegister && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your password"
                  />
                </div>

                {loginError && (
                  <p className="text-red-600 text-sm">{loginError}</p>
                )}

                <button
                  onClick={isRegister ? handleRegister : handleLogin}
                  className="w-full px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  {isRegister ? "Register" : "Login"}
                </button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleGoogleLogin}
                  className="w-full px-8 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg shadow-sm hover:bg-gray-50 flex items-center justify-center gap-3 transition-all duration-200"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google
                </button>

                <p className="text-center text-sm text-gray-600 mt-4">
                  {isRegister ? (
                    <>
                      Already have an account?{" "}
                      <span
                        onClick={() => setIsRegister(false)}
                        className="text-green-600 cursor-pointer font-semibold hover:underline"
                      >
                        Login
                      </span>
                    </>
                  ) : (
                    <>
                      Don’t have an account?{" "}
                      <span
                        onClick={() => setIsRegister(true)}
                        className="text-green-600 cursor-pointer font-semibold hover:underline"
                      >
                        Register
                      </span>
                    </>
                  )}
                </p>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <User className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Basic Information
                </h2>
                <p className="text-gray-600">Tell us about yourself</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your age"
                    min="18"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Activity className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Physical Measurements
                </h2>
                <p className="text-gray-600">
                  Help us calculate your personal metrics
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) =>
                      setFormData({ ...formData, height: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your height in cm"
                    min="100"
                    max="250"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) =>
                      setFormData({ ...formData, weight: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your weight in kg"
                    min="30"
                    max="300"
                  />
                </div>
              </div>

              {formData.height && formData.weight && (
                <div className="mt-8 p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">
                    Your BMI Preview
                  </h3>
                  <p className="text-green-700">
                    BMI:{" "}
                    {calculateBMI(
                      parseInt(formData.weight),
                      parseInt(formData.height)
                    )}
                  </p>
                </div>
              )}
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Target className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Goals & Activity
                </h2>
                <p className="text-gray-600">What do you want to achieve?</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Activity Level
                </label>
                <div className="space-y-3">
                  {ACTIVITY_LEVELS.map((level) => (
                    <label
                      key={level.value}
                      className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="radio"
                        name="activityLevel"
                        value={level.value}
                        checked={formData.activityLevel === level.value}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            activityLevel: e.target.value,
                          })
                        }
                        className="text-green-600 focus:ring-green-500"
                      />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {level.label}
                        </div>
                        <div className="text-sm text-gray-500">
                          {level.description}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Primary Goal
                </label>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    {
                      value: "weight-loss",
                      label: "Weight Loss",
                      desc: "Lose weight healthily",
                    },
                    {
                      value: "weight-gain",
                      label: "Weight Gain",
                      desc: "Gain healthy weight",
                    },
                    {
                      value: "muscle-gain",
                      label: "Muscle Gain",
                      desc: "Build lean muscle",
                    },
                  ].map((goal) => (
                    <label
                      key={goal.value}
                      className="flex flex-col items-center p-6 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="radio"
                        name="goal"
                        value={goal.value}
                        checked={formData.goal === goal.value}
                        onChange={(e) =>
                          setFormData({ ...formData, goal: e.target.value })
                        }
                        className="text-green-600 focus:ring-green-500 mb-3"
                      />
                      <div className="text-center">
                        <div className="text-sm font-medium text-gray-900">
                          {goal.label}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {goal.desc}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Dietary Preferences
                </h2>
                <p className="text-gray-600">
                  Optional: Tell us about any dietary restrictions or allergies
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Dietary Restrictions
                </label>
                <div className="grid md:grid-cols-3 gap-3">
                  {DIETARY_RESTRICTIONS.map((restriction) => (
                    <label
                      key={restriction}
                      className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={formData.dietaryRestrictions.includes(
                          restriction
                        )}
                        onChange={() =>
                          handleCheckboxChange(
                            restriction,
                            "dietaryRestrictions"
                          )
                        }
                        className="text-green-600 focus:ring-green-500 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {restriction}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Allergies
                </label>
                <div className="grid md:grid-cols-4 gap-3">
                  {COMMON_ALLERGIES.map((allergy) => (
                    <label
                      key={allergy}
                      className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={formData.allergies.includes(allergy)}
                        onChange={() =>
                          handleCheckboxChange(allergy, "allergies")
                        }
                        className="text-green-600 focus:ring-green-500 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {allergy}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Previous
            </button>

            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="flex items-center px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {currentStep === totalSteps ? "Complete Setup" : "Next"}
              <ChevronRight className="h-5 w-5 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
