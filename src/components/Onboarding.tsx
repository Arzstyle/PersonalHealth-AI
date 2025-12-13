import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Smartphone,
  Lock,
  ShieldCheck,
  AlertCircle,
  CheckCircle,
  Loader2,
  Ghost,
} from "lucide-react";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  signInWithPopup,
  GoogleAuthProvider,
  signInAnonymously,
} from "firebase/auth";
import { useUI } from "../context/UIContext";

// --- BACKGROUND DIGITAL GRID ---
const DigitalGridBackground = () => (
  <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#050b14] transition-colors duration-500">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
    <div className="absolute inset-0 bg-gradient-to-t from-[#050b14] via-transparent to-[#050b14]"></div>
    <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[150px] mix-blend-screen animate-pulse"></div>
    <div
      className="absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] mix-blend-screen animate-pulse"
      style={{ animationDelay: "2s" }}
    ></div>
  </div>
);

// --- GOOGLE ICON SVG ---
const GoogleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24">
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
);

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useUI();
  const auth = getAuth();

  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  // --- FUNGSI PENTING: Initialize User & Redirect ---
  // Ini membuat template data user di localStorage agar Profile.tsx tidak error
  const initializeAndRedirect = (user: any) => {
    setSuccess(t("auth.success"));

    // Cek apakah sudah ada data di localstorage (user lama)
    const existingData = localStorage.getItem("user");

    if (!existingData) {
      // Template User Baru
      const initialUserData = {
        name:
          user.displayName || (user.email ? user.email.split("@")[0] : "Guest"),
        email: user.email || "",
        age: 0, // 0 menandakan belum diisi
        height: 0,
        weight: 0,
        gender: "male", // default
        goal: "weight-loss",
        activityLevel: "moderate",
        dietaryRestrictions: [],
        allergies: [],
        createdAt: new Date().toISOString(),
        dailyCalories: 2000,
        idealWeight: 0,
        bmi: 0,
      };
      localStorage.setItem("user", JSON.stringify(initialUserData));
    }

    // Redirect ke Profile Setup untuk melengkapi data
    setTimeout(() => {
      navigate("/profile-setup");
    }, 1500);
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      let userCredential;
      if (isRegistering) {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
      } else {
        userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
      }
      initializeAndRedirect(userCredential.user);
    } catch (err: any) {
      setError(err.message || t("auth.error.generic"));
      setIsLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!phoneNumber) return;
    setError(null);
    setIsLoading(true);
    try {
      if (!(window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            size: "invisible",
            callback: () => {},
          }
        );
      }
      const appVerifier = (window as any).recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        appVerifier
      );
      setConfirmationResult(confirmation);
      setShowOtpInput(true);
      setSuccess("OTP Transmitted.");
    } catch (err: any) {
      console.error(err);
      setError("Failed to send SMS. Check format (+62...).");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || !confirmationResult) return;
    setError(null);
    setIsLoading(true);
    try {
      const result = await confirmationResult.confirm(otp);
      initializeAndRedirect(result.user);
    } catch (err: any) {
      setError("Invalid OTP Code.");
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      initializeAndRedirect(result.user);
    } catch (err: any) {
      setError(err.message || "Google Auth Failed");
      setIsLoading(false);
    }
  };

  const handleGuestAuth = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const result = await signInAnonymously(auth);
      initializeAndRedirect(result.user);
    } catch (err: any) {
      setError("Guest Access Failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden font-sans text-gray-100">
      <style>{`
        .glass-auth { background: rgba(10, 15, 30, 0.85); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.08); box-shadow: 0 0 40px rgba(0, 0, 0, 0.6); }
        .input-tech { background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(255, 255, 255, 0.1); color: white; font-family: 'Orbitron', sans-serif; letter-spacing: 1px; transition: all 0.3s ease; }
        .input-tech:focus { border-color: #22c55e; box-shadow: 0 0 15px rgba(34, 197, 94, 0.3); outline: none; }
        .tab-active { background: rgba(34, 197, 94, 0.1); border-bottom: 2px solid #22c55e; color: #22c55e; }
        .tab-inactive { color: #6b7280; border-bottom: 2px solid transparent; }
        .tab-inactive:hover { color: #d1d5db; }
      `}</style>

      <DigitalGridBackground />
      <div id="recaptcha-container"></div>

      <div className="relative z-10 w-full max-w-md p-4 animate-fade-in">
        <div className="glass-auth rounded-2xl overflow-hidden relative border-t border-white/10">
          <div className="p-6 pb-2 text-center">
            <div className="w-10 h-10 bg-primary-900/50 rounded-lg mx-auto flex items-center justify-center mb-3 border border-primary-500/30 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
              <Lock className="w-5 h-5 text-primary-500" />
            </div>
            <h2 className="text-xl font-display font-black uppercase tracking-tight text-white mb-1">
              {t("auth.title")}
            </h2>
            <p className="text-gray-400 text-[10px] font-light uppercase tracking-widest">
              {t("auth.subtitle")}
            </p>
          </div>

          <div className="flex border-b border-gray-800 mt-2">
            <button
              onClick={() => setLoginMethod("email")}
              className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                loginMethod === "email" ? "tab-active" : "tab-inactive"
              }`}
            >
              <Mail className="w-3 h-3" /> {t("auth.method.email")}
            </button>
            <button
              onClick={() => setLoginMethod("phone")}
              className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                loginMethod === "phone" ? "tab-active" : "tab-inactive"
              }`}
            >
              <Smartphone className="w-3 h-3" /> {t("auth.method.phone")}
            </button>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-4 p-2 bg-red-500/10 border border-red-500/50 rounded flex items-center gap-2 text-red-400 text-[10px] font-bold">
                <AlertCircle className="w-3 h-3" /> {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-2 bg-green-500/10 border border-green-500/50 rounded flex items-center gap-2 text-green-400 text-[10px] font-bold">
                <CheckCircle className="w-3 h-3" /> {success}
              </div>
            )}

            {loginMethod === "email" && (
              <form
                onSubmit={handleEmailAuth}
                className="space-y-4 animate-[fadeIn_0.3s_ease-out]"
              >
                <div>
                  <label className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1 block">
                    {t("auth.input.email")}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 rounded text-sm input-tech"
                    placeholder="USER@EXAMPLE.COM"
                    required
                  />
                </div>
                <div>
                  <label className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1 block">
                    {t("auth.input.pass")}
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2.5 rounded text-sm input-tech"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-primary-600 hover:bg-primary-500 text-black font-display font-bold uppercase tracking-wider rounded-sm shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all mt-2 flex items-center justify-center gap-2 disabled:opacity-50 text-xs"
                  style={{
                    clipPath:
                      "polygon(5% 0, 100% 0, 100% 80%, 95% 100%, 0 100%, 0 20%)",
                  }}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isRegistering ? (
                    t("auth.btn.signup")
                  ) : (
                    t("auth.btn.login")
                  )}
                </button>
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => setIsRegistering(!isRegistering)}
                    className="text-[10px] text-gray-400 hover:text-white underline decoration-gray-600 underline-offset-4 transition-colors"
                  >
                    {isRegistering
                      ? t("auth.switch.login")
                      : t("auth.switch.signup")}
                  </button>
                </div>
              </form>
            )}

            {loginMethod === "phone" && (
              <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
                {!showOtpInput ? (
                  <>
                    <div>
                      <label className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1 block">
                        {t("auth.input.phone")}
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full p-2.5 rounded text-sm input-tech"
                        placeholder="+62 812 3456 7890"
                      />
                    </div>
                    <button
                      onClick={handleSendOtp}
                      disabled={isLoading || !phoneNumber}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-display font-bold uppercase tracking-wider rounded-sm shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all mt-2 flex items-center justify-center gap-2 disabled:opacity-50 text-xs"
                      style={{
                        clipPath:
                          "polygon(5% 0, 100% 0, 100% 80%, 95% 100%, 0 100%, 0 20%)",
                      }}
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        t("auth.btn.send_otp")
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1 block">
                        {t("auth.input.otp")}
                      </label>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full p-2.5 rounded input-tech text-center text-xl tracking-[0.5em]"
                        placeholder="••••••"
                        maxLength={6}
                      />
                    </div>
                    <button
                      onClick={handleVerifyOtp}
                      disabled={isLoading || otp.length < 6}
                      className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-display font-bold uppercase tracking-wider rounded-sm shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all mt-2 flex items-center justify-center gap-2 disabled:opacity-50 text-xs"
                      style={{
                        clipPath:
                          "polygon(5% 0, 100% 0, 100% 80%, 95% 100%, 0 100%, 0 20%)",
                      }}
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        t("auth.btn.verify")
                      )}
                    </button>
                    <div className="text-center pt-1">
                      <button
                        onClick={() => setShowOtpInput(false)}
                        className="text-[10px] text-gray-500 hover:text-white"
                      >
                        Wrong Number? Back
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-[9px] uppercase tracking-widest">
                <span className="bg-[#0f1525] px-2 text-gray-500">
                  {t("auth.divider")}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="w-full py-3 bg-white text-gray-900 font-bold rounded-sm hover:bg-gray-100 transition-all flex items-center justify-center gap-3 text-xs uppercase tracking-wide group"
              >
                <GoogleIcon />
                <span className="group-hover:text-black">
                  {t("auth.btn.google")}
                </span>
              </button>
              <button
                onClick={handleGuestAuth}
                disabled={isLoading}
                className="w-full py-3 bg-transparent border border-gray-600 text-gray-400 font-bold rounded-sm hover:border-gray-400 hover:text-gray-200 transition-all flex items-center justify-center gap-3 text-xs uppercase tracking-wide"
              >
                <Ghost className="w-4 h-4" />
                <span>{t("auth.btn.guest")}</span>
              </button>
            </div>
          </div>
          <div className="bg-black/40 p-2 text-center flex items-center justify-center gap-2 border-t border-white/5">
            <ShieldCheck className="w-3 h-3 text-gray-500" />
            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">
              Secure Encrypted Protocol
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
