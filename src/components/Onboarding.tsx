import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Smartphone,
  Lock,
  ShieldCheck,
  AlertCircle,
  CheckCircle,
  Activity,
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

// --- ADAPTIVE BACKGROUND ---
const AdaptiveBackground = () => (
  <>
    {/* Light Mode: Pastel Blobs & Subtle Grid */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-100 dark:opacity-0 transition-opacity duration-700">
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-200/40 rounded-full blur-[120px] mix-blend-multiply"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-200/40 rounded-full blur-[120px] mix-blend-multiply"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
    </div>

    {/* Dark Mode: Digital Grid & Neon */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-700 bg-[#050b14]">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#050b14] via-transparent to-[#050b14]"></div>
      <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[150px] mix-blend-screen animate-pulse"></div>
      <div
        className="absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] mix-blend-screen animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>
    </div>
  </>
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

  // --- LOGIKA SMART REDIRECT ---
  const initializeAndRedirect = (user: any) => {
    setSuccess(t("auth.success"));

    const existingDataString = localStorage.getItem("user");
    let userData = existingDataString ? JSON.parse(existingDataString) : null;

    if (!userData || (user.email && userData.email !== user.email)) {
      userData = {
        name:
          user.displayName || (user.email ? user.email.split("@")[0] : "Guest"),
        email: user.email || "",
        uid: user.uid,
        age: 0,
        height: 0,
        weight: 0,
        gender: "male",
        goal: "weight-loss",
        activityLevel: "moderate",
        isSetupComplete: false,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem("user", JSON.stringify(userData));
    }

    setTimeout(() => {
      if (userData.isSetupComplete) {
        navigate("/dashboard");
      } else {
        navigate("/profile-setup");
      }
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

  // --- CUSTOM STYLES UNTUK LIGHT/DARK MODE ---
  const inputClasses =
    "w-full p-3 rounded-xl text-sm transition-all outline-none border font-sans font-bold " +
    "bg-white dark:bg-black/40 " + // Light: Putih, Dark: Hitam transparan
    "border-gray-200 dark:border-white/10 " + // Light: Border abu halus, Dark: Border putih tipis
    "text-gray-900 dark:text-white " + // Warna teks
    "placeholder-gray-400 dark:placeholder-gray-600 " + // Warna placeholder
    "focus:border-blue-500 dark:focus:border-primary-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-primary-500/30 shadow-sm"; // Fokus ring biru/hijau

  const tabActiveClasses =
    "bg-blue-50 dark:bg-primary-900/20 border-b-2 border-blue-500 dark:border-primary-500 text-blue-600 dark:text-primary-500";
  const tabInactiveClasses =
    "text-gray-500 dark:text-gray-400 border-b-2 border-transparent hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5";

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden font-sans text-gray-900 dark:text-gray-100 bg-[#f8fafc] dark:bg-[#050b14] transition-colors duration-500">
      <AdaptiveBackground />
      <div id="recaptcha-container"></div>

      <div className="relative z-10 w-full max-w-md p-4 animate-fade-in">
        {/* ✨ UPDATE CARD: Glassmorphism Premium Light/Dark */}
        <div className="bg-white/80 dark:bg-[#0a0f1e]/85 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-[2rem] overflow-hidden relative shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_40px_rgba(0,0,0,0.6)] transition-all duration-300">
          {/* Header */}
          <div className="p-6 pb-4 text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-primary-900/50 rounded-2xl mx-auto flex items-center justify-center mb-4 border border-blue-200 dark:border-primary-500/30 shadow-sm dark:shadow-[0_0_20px_rgba(34,197,94,0.2)]">
              <Lock className="w-6 h-6 text-blue-600 dark:text-primary-500" />
            </div>
            <h2 className="text-2xl font-display font-black uppercase tracking-tight text-gray-900 dark:text-white mb-1">
              {t("auth.title")}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-widest">
              {t("auth.subtitle")}
            </p>
          </div>

          {/* Login Method Tabs */}
          <div className="flex border-b border-gray-100 dark:border-gray-800 mx-6">
            <button
              onClick={() => setLoginMethod("email")}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 rounded-t-lg ${
                loginMethod === "email" ? tabActiveClasses : tabInactiveClasses
              }`}
            >
              <Mail className="w-4 h-4" /> {t("auth.method.email")}
            </button>
            <button
              onClick={() => setLoginMethod("phone")}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 rounded-t-lg ${
                loginMethod === "phone" ? tabActiveClasses : tabInactiveClasses
              }`}
            >
              <Smartphone className="w-4 h-4" /> {t("auth.method.phone")}
            </button>
          </div>

          <div className="p-6 pt-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/50 rounded-xl flex items-center gap-2 text-red-600 dark:text-red-400 text-xs font-bold">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/50 rounded-xl flex items-center gap-2 text-green-600 dark:text-green-400 text-xs font-bold">
                <CheckCircle className="w-4 h-4" /> {success}
              </div>
            )}

            {loginMethod === "email" && (
              <form
                onSubmit={handleEmailAuth}
                className="space-y-5 animate-[fadeIn_0.3s_ease-out]"
              >
                <div>
                  <label className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest mb-1.5 block pl-1">
                    {t("auth.input.email")}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClasses}
                    placeholder="user@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest mb-1.5 block pl-1">
                    {t("auth.input.pass")}
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputClasses}
                    placeholder="••••••••"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-gray-900 dark:bg-primary-600 hover:bg-gray-800 dark:hover:bg-primary-500 text-white font-display font-bold uppercase tracking-wider rounded-xl shadow-lg dark:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all mt-2 flex items-center justify-center gap-2 disabled:opacity-50 text-xs"
                >
                  {isLoading ? (
                    <Activity className="w-4 h-4 animate-spin" />
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
                    className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-bold transition-colors"
                  >
                    {isRegistering
                      ? t("auth.switch.login")
                      : t("auth.switch.signup")}
                  </button>
                </div>
              </form>
            )}

            {loginMethod === "phone" && (
              <div className="space-y-5 animate-[fadeIn_0.3s_ease-out]">
                {!showOtpInput ? (
                  <>
                    <div>
                      <label className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest mb-1.5 block pl-1">
                        {t("auth.input.phone")}
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className={inputClasses}
                        placeholder="+62 812 3456 7890"
                      />
                    </div>
                    <button
                      onClick={handleSendOtp}
                      disabled={isLoading || !phoneNumber}
                      className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-display font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-blue-500/20 transition-all mt-2 flex items-center justify-center gap-2 disabled:opacity-50 text-xs"
                    >
                      {isLoading ? (
                        <Activity className="w-4 h-4 animate-spin" />
                      ) : (
                        t("auth.btn.send_otp")
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest mb-1.5 block pl-1">
                        {t("auth.input.otp")}
                      </label>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className={`${inputClasses} text-center text-xl tracking-[0.5em] font-display`}
                        placeholder="••••••"
                        maxLength={6}
                      />
                    </div>
                    <button
                      onClick={handleVerifyOtp}
                      disabled={isLoading || otp.length < 6}
                      className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-display font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-green-500/20 transition-all mt-2 flex items-center justify-center gap-2 disabled:opacity-50 text-xs"
                    >
                      {isLoading ? (
                        <Activity className="w-4 h-4 animate-spin" />
                      ) : (
                        t("auth.btn.verify")
                      )}
                    </button>
                    <div className="text-center pt-1">
                      <button
                        onClick={() => setShowOtpInput(false)}
                        className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-bold"
                      >
                        Wrong Number? Back
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-[9px] uppercase tracking-widest font-bold">
                <span className="bg-white dark:bg-[#0f1525] px-3 text-gray-400 dark:text-gray-500 transition-colors duration-300">
                  {t("auth.divider")}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="w-full py-3 bg-white dark:bg-white text-gray-700 dark:text-gray-900 font-bold rounded-xl border border-gray-200 dark:border-transparent hover:bg-gray-50 transition-all flex items-center justify-center gap-3 text-xs uppercase tracking-wide shadow-sm"
              >
                <GoogleIcon />
                <span>{t("auth.btn.google")}</span>
              </button>
              <button
                onClick={handleGuestAuth}
                disabled={isLoading}
                className="w-full py-3 bg-transparent border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 font-bold rounded-xl hover:border-gray-400 dark:hover:border-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-all flex items-center justify-center gap-3 text-xs uppercase tracking-wide"
              >
                <Ghost className="w-4 h-4" />
                <span>{t("auth.btn.guest")}</span>
              </button>
            </div>
          </div>
          <div className="bg-gray-50/50 dark:bg-black/40 p-3 text-center flex items-center justify-center gap-2 border-t border-gray-100 dark:border-white/5">
            <ShieldCheck className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <span className="text-[10px] text-gray-500 dark:text-gray-500 font-bold uppercase tracking-widest">
              Secure Encrypted Protocol
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
