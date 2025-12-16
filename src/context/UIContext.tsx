import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

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
    "auth.btn.guest": "CONTINUE AS GUEST",
    "auth.divider": "OR ESTABLISH CONNECTION VIA",
    "auth.switch.signup": "New User? Create Profile",
    "auth.switch.login": "Existing User? Access System",
    "auth.error.generic": "Authentication Failed. Retry.",
    "auth.success": "Access Granted. Redirecting...",

    
    "profile.setup.title.step1": "Body Metrics",
    "profile.setup.desc.step1": "Let's start by calculating your BMI.",
    "profile.setup.label.height": "Height (cm)",
    "profile.setup.label.weight": "Weight (kg)",
    "profile.setup.bmi.estimated": "Estimated BMI",
    "profile.setup.btn.next": "Next Step",
    "profile.setup.title.step2": "Metabolic Profile",
    "profile.setup.desc.step2": "We calculate your BMR & TDEE based on this.",
    "profile.setup.label.age": "Age",
    "profile.setup.label.gender": "Gender",
    "profile.setup.gender.male": "Male",
    "profile.setup.gender.female": "Female",
    "profile.setup.label.activity": "Activity Level",
    "profile.setup.activity.sedentary": "Sedentary (Little to no exercise)",
    "profile.setup.activity.light": "Light (Exercise 1-3x/week)",
    "profile.setup.activity.moderate": "Moderate (Exercise 3-5x/week)",
    "profile.setup.activity.active": "Active (Exercise 6-7x/week)",
    "profile.setup.activity.very_active": "Very Active (Physical job/athlete)",
    "profile.setup.label.goal": "Primary Goal",
    "profile.setup.goal.loss": "Weight Loss",
    "profile.setup.goal.gain": "Weight Gain",
    "profile.setup.goal.muscle": "Muscle Gain",
    "profile.setup.bmr.title": "Basal Metabolic Rate",
    "profile.setup.bmr.desc": "Calories burned at rest",
    "profile.setup.btn.back": "Back",
    "profile.setup.btn.finish": "Calculate & Finish",

    
    "dash.welcome": "Welcome Back,",
    "dash.hello": "Hello,",
    "dash.today_overview": "Today's Overview",
    "dash.daily_fuel": "Daily Fuel",
    "dash.opt_target": "Optimization Target",
    "dash.kcal_left": "Kcal Left",
    "dash.active": "Active",
    "dash.no_data": "No Data",
    "dash.protein": "Protein",
    "dash.carbs": "Carbs",
    "dash.fat": "Fat",
    "dash.score": "Health Score",
    "dash.bmi": "Body Mass Index",
    "dash.hydration": "Hydration",
    "dash.daily_goal": "Daily Goal",
    "dash.quick_actions": "Quick Actions",
    "dash.act_log_meal": "Log Meal",
    "dash.desc_log_meal": "Track calories",
    "dash.act_workout": "Workout",
    "dash.desc_workout": "Log activity",
    "dash.act_ai_scan": "AI Scan",
    "dash.desc_ai_scan": "Analyze food",
    "dash.weekly_activity": "Weekly Activity",

    
    "meal.plan_title": "Meal Plan",
    "meal.plan_subtitle": "Plan your nutrition, auto or manual.",
    "meal.summary_title": "Nutrition Summary (Planned)",
    "meal.target": "Target",
    "meal.select_goal": "Select Diet Goal:",
    "meal.auto": "Automatic",
    "meal.manual": "Manual",
    "meal.ai_generate": "AI Auto-Generate",
    "meal.ai_desc": "Let the AI create a complete daily menu for you.",
    "meal.manual_title": "Manual Setup",
    "meal.manual_desc": "Choose your meals manually through AI search.",
    "meal.generating": "Generating Menu...",
    "meal.items": "Items",
    "meal.add": "Add",
    "meal.remove": "Remove",
    "meal.empty": "Empty",
    "meal.add_manual": "Add Manually",
    "meal.breakfast": "Breakfast",
    "meal.lunch": "Lunch",
    "meal.dinner": "Dinner",
    "meal.snacks": "Snacks",
    "meal.calories": "Calories",
    "meal.protein": "Protein",
    "meal.carbs": "Carbs",
    "meal.fat": "Fat",
    "goal.low-cal": "Low Calorie",
    "goal.standard": "Standard",
    "goal.bulking": "Bulking",

    
    "search.title": "NEURAL FOOD SEARCH",
    "search.subtitle": "AI-Powered Nutritional Analysis",
    "search.placeholder": "Enter food name to search...",
    "search.button": "SEARCH",
    "search.results": "SEARCH RESULTS",
    "search.items_found": "ITEMS FOUND",
    "search.scanning": "AI WEB SCANNING...",
    "search.processing": "Processing global nutritional data via AI...",
    "search.ready": "Ready to Search",
    "search.ready_desc":
      "Input food name to find nutritional values locally & globally.",
    "search.add_to_menu": "ADD TO MENU",

    
    "exercise.title": "WORKOUT PROTOCOL",
    "exercise.subtitle": "AI-Generated Fitness Roadmap",
    "exercise.generate": "GENERATE NEW PLAN",
    "exercise.tab.home": "HOME WORKOUT",
    "exercise.tab.gym": "GYM TRAINING",
    "exercise.tab.cardio": "CARDIO",
    "exercise.sets": "SETS",
    "exercise.reps": "REPS",
    "exercise.rest": "REST",
    "exercise.min": "MIN",

    
    "progress.title": "PROGRESS TRACKER",
    "progress.subtitle": "Monitor your body transformation.",
    "progress.log_btn": "LOG NEW DATA",
    "progress.current_weight": "CURRENT WEIGHT",
    "progress.total_loss": "TOTAL LOSS",
    "progress.achievement": "ACHIEVEMENT",
    "progress.total_entries": "TOTAL ENTRIES",
    "progress.chart.weight": "WEIGHT CHART",
    "progress.chart.measurements": "BODY MEASUREMENTS",
    "progress.upload.before": "UPLOAD BEFORE",
    "progress.upload.after": "UPLOAD AFTER",
    "progress.share": "SHARE PROGRESS",
    "progress.modal.title": "INPUT BIOMETRICS",
    "progress.modal.date": "RECORD DATE",
    "progress.modal.weight": "WEIGHT (KG)",
    "progress.modal.notes": "ADDITIONAL NOTES",
    "progress.modal.cancel": "CANCEL",
    "progress.modal.save": "SAVE DATA",

    
    "profile.title": "OPERATOR PROFILE",
    "profile.subtitle": "Manage identity & system preferences.",
    "profile.edit": "EDIT PROFILE",
    "profile.disconnect": "DISCONNECT",
    "profile.joined": "JOINED",
    "profile.status": "SYSTEM STATUS",
    "profile.online": "ONLINE",
    "profile.target_ops": "TARGET & OPERATIONS",
    "profile.nutrition_proto": "NUTRITIONAL PROTOCOLS",
    "profile.restrictions": "RESTRICTIONS",
    "profile.allergies": "ALLERGIES",
    "profile.no_restrictions": "No restrictions detected.",
    "profile.no_allergies": "No allergies detected.",
    "profile.tap_update": "TAP TO UPDATE VISUAL ID",
    "profile.modal.identity": "EDIT IDENTITY",
    "profile.modal.objectives": "EDIT OBJECTIVES",
    "profile.modal.protocols": "EDIT PROTOCOLS",
    "profile.label.height": "HEIGHT",
    "profile.label.weight": "WEIGHT",
    "profile.label.age": "AGE",
    "profile.label.bmi": "BMI",
    "profile.form.fullname": "FULL NAME",
    "profile.form.email": "EMAIL",
    "profile.form.target_main": "MAIN TARGET",
    "profile.form.target_weight": "TARGET WEIGHT",
    "profile.form.activity": "ACTIVITY LEVEL",
    "profile.form.calories": "CALORIE TARGET",
    "profile.form.cancel": "CANCEL",
    "profile.form.save": "SAVE DATA",
  },
  id: {
    
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
    "auth.btn.guest": "LANJUT SEBAGAI TAMU",
    "auth.divider": "ATAU SAMBUNGKAN MELALUI",
    "auth.switch.signup": "Pengguna Baru? Buat Profil",
    "auth.switch.login": "Pengguna Lama? Akses Sistem",
    "auth.error.generic": "Otentikasi Gagal. Coba lagi.",
    "auth.success": "Akses Diberikan. Mengalihkan...",

    
    "profile.setup.title.step1": "Metrik Tubuh",
    "profile.setup.desc.step1": "Mari mulai dengan menghitung BMI Anda.",
    "profile.setup.label.height": "Tinggi (cm)",
    "profile.setup.label.weight": "Berat (kg)",
    "profile.setup.bmi.estimated": "Estimasi BMI",
    "profile.setup.btn.next": "Lanjut",
    "profile.setup.title.step2": "Profil Metabolik",
    "profile.setup.desc.step2":
      "Kami menghitung BMR & TDEE Anda berdasarkan ini.",
    "profile.setup.label.age": "Umur",
    "profile.setup.label.gender": "Jenis Kelamin",
    "profile.setup.gender.male": "Pria",
    "profile.setup.gender.female": "Wanita",
    "profile.setup.label.activity": "Level Aktivitas",
    "profile.setup.activity.sedentary": "Sedentary (Jarang Olahraga)",
    "profile.setup.activity.light": "Light (Olahraga 1-3x/minggu)",
    "profile.setup.activity.moderate": "Moderate (Olahraga 3-5x/minggu)",
    "profile.setup.activity.active": "Active (Olahraga 6-7x/minggu)",
    "profile.setup.activity.very_active": "Very Active (Fisik Berat/Atlet)",
    "profile.setup.label.goal": "Tujuan Utama",
    "profile.setup.goal.loss": "Turun Berat Badan",
    "profile.setup.goal.gain": "Tambah Berat Badan",
    "profile.setup.goal.muscle": "Membentuk Otot",
    "profile.setup.bmr.title": "Basal Metabolic Rate",
    "profile.setup.bmr.desc": "Kalori terbakar saat istirahat",
    "profile.setup.btn.back": "Kembali",
    "profile.setup.btn.finish": "Hitung & Selesai",

    
    "dash.welcome": "Selamat Datang,",
    "dash.hello": "Halo,",
    "dash.today_overview": "Ringkasan Hari Ini",
    "dash.daily_fuel": "Bahan Bakar Harian",
    "dash.opt_target": "Target Optimasi",
    "dash.kcal_left": "Sisa Kalori",
    "dash.active": "Aktif",
    "dash.no_data": "Belum Ada Data",
    "dash.protein": "Protein",
    "dash.carbs": "Karbo",
    "dash.fat": "Lemak",
    "dash.score": "Skor Kesehatan",
    "dash.bmi": "Indeks Massa Tubuh",
    "dash.hydration": "Hidrasi",
    "dash.daily_goal": "Target Harian",
    "dash.quick_actions": "Aksi Cepat",
    "dash.act_log_meal": "Catat Makan",
    "dash.desc_log_meal": "Hitung kalori",
    "dash.act_workout": "Latihan",
    "dash.desc_workout": "Catat aktivitas",
    "dash.act_ai_scan": "Scan AI",
    "dash.desc_ai_scan": "Analisa makanan",
    "dash.weekly_activity": "Aktivitas Mingguan",

    
    "meal.plan_title": "Rencana Makan",
    "meal.plan_subtitle": "Rencanakan nutrisimu, otomatis atau manual.",
    "meal.summary_title": "Ringkasan Nutrisi (Rencana)",
    "meal.target": "Target",
    "meal.select_goal": "Pilih Tujuan Diet:",
    "meal.auto": "Otomatis",
    "meal.manual": "Manual",
    "meal.ai_generate": "AI Auto-Generate",
    "meal.ai_desc": "Biarkan AI menyusun menu harian lengkap untukmu.",
    "meal.manual_title": "Susun Manual",
    "meal.manual_desc": "Pilih sendiri menu makananmu lewat pencarian AI.",
    "meal.generating": "Meracik Menu...",
    "meal.items": "Item",
    "meal.add": "Tambah",
    "meal.remove": "Hapus",
    "meal.empty": "Kosong",
    "meal.add_manual": "Tambah Manual",
    "meal.breakfast": "Sarapan",
    "meal.lunch": "Makan Siang",
    "meal.dinner": "Makan Malam",
    "meal.snacks": "Camilan",
    "meal.calories": "Kalori",
    "meal.protein": "Protein",
    "meal.carbs": "Karbo",
    "meal.fat": "Lemak",
    "goal.low-cal": "Rendah Kalori",
    "goal.standard": "Standard",
    "goal.bulking": "Bulking",

    
    "search.title": "PENCARIAN MAKANAN NEURAL",
    "search.subtitle": "Analisis Nutrisi Bertenaga AI",
    "search.placeholder": "Masukkan nama makanan...",
    "search.button": "CARI",
    "search.results": "HASIL PENCARIAN",
    "search.items_found": "ITEM DITEMUKAN",
    "search.scanning": "MEMINDAI WEB AI...",
    "search.processing": "Memproses data nutrisi global via AI...",
    "search.ready": "Siap Mencari",
    "search.ready_desc": "Masukkan nama makanan untuk melihat nilai gizi.",
    "search.add_to_menu": "TAMBAH KE MENU",

    
    "exercise.title": "PROTOKOL LATIHAN",
    "exercise.subtitle": "Peta Fitness Generasi AI",
    "exercise.generate": "BUAT RENCANA BARU",
    "exercise.tab.home": "LATIHAN RUMAH",
    "exercise.tab.gym": "LATIHAN GYM",
    "exercise.tab.cardio": "KARDIO",
    "exercise.sets": "SET",
    "exercise.reps": "REPS",
    "exercise.rest": "ISTIRAHAT",
    "exercise.min": "MNT",

    
    "progress.title": "PELACAK PROGRESS",
    "progress.subtitle": "Pantau transformasi tubuh Anda.",
    "progress.log_btn": "CATAT DATA BARU",
    "progress.current_weight": "BERAT SAAT INI",
    "progress.total_loss": "TOTAL TURUN",
    "progress.achievement": "PENCAPAIAN",
    "progress.total_entries": "TOTAL ENTRI",
    "progress.chart.weight": "GRAFIK BERAT",
    "progress.chart.measurements": "UKURAN TUBUH",
    "progress.upload.before": "UPLOAD AWAL",
    "progress.upload.after": "UPLOAD AKHIR",
    "progress.share": "BAGIKAN PROGRESS",
    "progress.modal.title": "INPUT BIOMETRIK",
    "progress.modal.date": "TANGGAL PENCATATAN",
    "progress.modal.weight": "BERAT BADAN (KG)",
    "progress.modal.notes": "CATATAN TAMBAHAN",
    "progress.modal.cancel": "BATAL",
    "progress.modal.save": "SIMPAN DATA",

    
    "profile.title": "PROFIL OPERATOR",
    "profile.subtitle": "Kelola identitas & preferensi sistem.",
    "profile.edit": "EDIT PROFIL",
    "profile.disconnect": "PUTUSKAN KONEKSI",
    "profile.joined": "BERGABUNG",
    "profile.status": "STATUS SISTEM",
    "profile.online": "ONLINE",
    "profile.target_ops": "TARGET & OPERASI",
    "profile.nutrition_proto": "PROTOKOL NUTRISI",
    "profile.restrictions": "PANTANGAN",
    "profile.allergies": "ALERGI",
    "profile.no_restrictions": "Tidak ada pantangan terdeteksi.",
    "profile.no_allergies": "Tidak ada alergi terdeteksi.",
    "profile.tap_update": "KETUK UNTUK GANTI ID VISUAL",
    "profile.modal.identity": "EDIT IDENTITAS",
    "profile.modal.objectives": "EDIT TUJUAN",
    "profile.modal.protocols": "EDIT PROTOKOL",
    "profile.label.height": "TINGGI",
    "profile.label.weight": "BERAT",
    "profile.label.age": "UMUR",
    "profile.label.bmi": "BMI",
    "profile.form.fullname": "NAMA LENGKAP",
    "profile.form.email": "EMAIL",
    "profile.form.target_main": "TARGET UTAMA",
    "profile.form.target_weight": "TARGET BERAT",
    "profile.form.activity": "LEVEL AKTIVITAS",
    "profile.form.calories": "TARGET KALORI",
    "profile.form.cancel": "BATAL",
    "profile.form.save": "SIMPAN DATA",
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
