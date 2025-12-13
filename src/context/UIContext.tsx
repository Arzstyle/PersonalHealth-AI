import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// --- Tipe Data ---
type Theme = "light" | "dark";
type Language = "en" | "id";

interface UIContextType {
  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // ... (TEXT LAMA TETAP SAMA) ...
    "hero.tagline": "INTELLIGENT HEALTH ECOSYSTEM",
    "hero.title": "PERSONAL HEALTH AI",
    "hero.subtitle": "YOUR SMART WELLNESS COMPANION.",
    "hero.desc":
      "Experience the future of wellness. Our AI analyzes your lifestyle to create personalized nutrition and workout plans tailored exactly to your body's needs.",
    "btn.start": "START HEALTH JOURNEY",
    "btn.demo": "VIEW AI DEMO",
    "goals.title": "SELECT YOUR GOAL",
    "goals.desc":
      "What do you want to achieve? Let our AI customize the perfect roadmap for your body transformation.",
    "goal.loss": "WEIGHT LOSS AI",
    "goal.loss.desc": "Smart calorie deficit planning with fat-burning focus.",
    "goal.gain": "HEALTHY WEIGHT GAIN",
    "goal.gain.desc": "Nutrient-rich meal planning for sustainable mass.",
    "goal.muscle": "MUSCLE BUILDING",
    "goal.muscle.desc":
      "Protein-optimized strength training & recovery protocols.",
    "why.title": "WHY PERSONAL HEALTH AI?",
    "why.desc":
      "We don't just guess. We use data to optimize your health journey in real-time.",
    "testi.title": "SUCCESS STORIES",
    "testi.desc": "Real results from people who trusted Personal Health AI.",
    "cta.title": "READY TO TRANSFORM?",
    "cta.desc":
      "Your personal AI health assistant is ready. Start your evolution today.",
    "btn.free": "TRY FOR FREE",
    "welcome.slide1.title": "AI Neural Analysis",
    "welcome.slide1.desc":
      "Our engine scans your bio-markers to calculate the perfect metabolic baseline.",
    "welcome.slide2.title": "Adaptive Protocols",
    "welcome.slide2.desc":
      "Workouts and meal plans that evolve in real-time as your body adapts.",
    "welcome.slide3.title": "Precision Tracking",
    "welcome.slide3.desc":
      "Visualize your evolution with military-grade data precision.",
    "welcome.feature": "Feature",
    "welcome.btn.next": "Next Preview",
    "welcome.btn.init": "Initialize System",
    "welcome.modal.title": "Authentication Required",
    "welcome.modal.desc":
      "To synchronize your AI-generated health protocol and save your preferences, secure system access is required.",
    "welcome.modal.btn": "Login / Sign Up",
    "welcome.modal.secure": "Secure Encrypted Connection",

    // --- LOGIN SCREEN (UPDATED) ---
    "auth.title": "SYSTEM ACCESS",
    "auth.subtitle": "Authenticate to synchronize your neural profile.",
    "auth.method.email": "Email",
    "auth.method.phone": "Mobile",
    "auth.input.email": "ENTER EMAIL ADDRESS",
    "auth.input.pass": "ENTER PASSCODE",
    "auth.input.phone": "ENTER MOBILE NUMBER",
    "auth.input.otp": "ENTER VERIFICATION CODE",
    "auth.btn.login": "INITIATE SESSION",
    "auth.btn.signup": "CREATE NEW PROFILE",
    "auth.btn.verify": "VERIFY UPLINK",
    "auth.btn.send_otp": "TRANSMIT CODE",
    "auth.btn.google": "ACCESS VIA GOOGLE",
    "auth.btn.guest": "CONTINUE AS GUEST", // NEW
    "auth.divider": "OR ESTABLISH CONNECTION VIA",
    "auth.switch.signup": "New User? Create Profile",
    "auth.switch.login": "Existing User? Access System",
    "auth.error.generic": "Authentication Failed. Retry.",
    "auth.success": "Access Granted. Redirecting...",
  },
  id: {
    // ... (TEXT LAMA TETAP SAMA) ...
    "hero.tagline": "EKOSISTEM KESEHATAN CERDAS",
    "hero.title": "PERSONAL HEALTH AI",
    "hero.subtitle": "PENDAMPING KESEHATAN PINTAR ANDA.",
    "hero.desc":
      "Rasakan masa depan kesehatan. AI kami menganalisis gaya hidup Anda untuk membuat rencana nutrisi dan olahraga yang disesuaikan tepat untuk kebutuhan tubuh Anda.",
    "btn.start": "MULAI SEKARANG",
    "btn.demo": "LIHAT DEMO AI",
    "goals.title": "PILIH TUJUAN ANDA",
    "goals.desc":
      "Apa yang ingin Anda capai? Biarkan AI kami menyusun peta jalan yang sempurna untuk transformasi tubuh Anda.",
    "goal.loss": "TURUN BERAT BADAN",
    "goal.loss.desc":
      "Perencanaan defisit kalori cerdas dengan fokus pembakaran lemak.",
    "goal.gain": "BERAT BADAN SEHAT",
    "goal.gain.desc":
      "Perencanaan makanan kaya nutrisi untuk massa tubuh ideal.",
    "goal.muscle": "PEMBENTUKAN OTOT",
    "goal.muscle.desc":
      "Latihan kekuatan & protokol pemulihan yang dioptimalkan protein.",
    "why.title": "MENGAPA PERSONAL HEALTH AI?",
    "why.desc":
      "Kami tidak hanya menebak. Kami menggunakan data untuk mengoptimalkan kesehatan Anda secara real-time.",
    "testi.title": "KISAH SUKSES",
    "testi.desc":
      "Hasil nyata dari mereka yang mempercayai Personal Health AI.",
    "cta.title": "SIAP BERTRANSFORMASI?",
    "cta.desc":
      "Asisten kesehatan AI pribadi Anda sudah siap. Mulai evolusi Anda hari ini.",
    "btn.free": "COBA GRATIS",
    "welcome.slide1.title": "Analisis Neural AI",
    "welcome.slide1.desc":
      "Mesin kami memindai penanda biologis Anda untuk menghitung dasar metabolik yang sempurna.",
    "welcome.slide2.title": "Protokol Adaptif",
    "welcome.slide2.desc":
      "Latihan dan rencana makan yang berevolusi secara real-time saat tubuh Anda beradaptasi.",
    "welcome.slide3.title": "Pelacakan Presisi",
    "welcome.slide3.desc":
      "Visualisasikan evolusi Anda dengan presisi data tingkat militer.",
    "welcome.feature": "Fitur",
    "welcome.btn.next": "Preview Lanjut",
    "welcome.btn.init": "Inisialisasi Sistem",
    "welcome.modal.title": "Otentikasi Diperlukan",
    "welcome.modal.desc":
      "Untuk menyinkronkan protokol kesehatan yang dihasilkan AI dan menyimpan preferensi Anda, akses sistem yang aman diperlukan.",
    "welcome.modal.btn": "Masuk / Daftar",
    "welcome.modal.secure": "Koneksi Terenkripsi Aman",

    // --- LOGIN SCREEN (UPDATED - ID) ---
    "auth.title": "AKSES SISTEM",
    "auth.subtitle": "Otentikasi untuk menyinkronkan profil neural Anda.",
    "auth.method.email": "Email",
    "auth.method.phone": "Seluler",
    "auth.input.email": "MASUKKAN ALAMAT EMAIL",
    "auth.input.pass": "MASUKKAN KODE SANDI",
    "auth.input.phone": "MASUKKAN NOMOR HP",
    "auth.input.otp": "MASUKKAN KODE VERIFIKASI",
    "auth.btn.login": "INISIASI SESI",
    "auth.btn.signup": "BUAT PROFIL BARU",
    "auth.btn.verify": "VERIFIKASI TAUTAN",
    "auth.btn.send_otp": "KIRIM KODE",
    "auth.btn.google": "AKSES VIA GOOGLE",
    "auth.btn.guest": "LANJUT SEBAGAI TAMU", // NEW
    "auth.divider": "ATAU SAMBUNGKAN MELALUI",
    "auth.switch.signup": "Pengguna Baru? Buat Profil",
    "auth.switch.login": "Pengguna Lama? Akses Sistem",
    "auth.error.generic": "Otentikasi Gagal. Coba lagi.",
    "auth.success": "Akses Diberikan. Mengalihkan...",
  },
};

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") as Theme;
      if (savedTheme) return savedTheme;
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  });

  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <UIContext.Provider
      value={{ theme, toggleTheme, language, setLanguage, t }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
};
