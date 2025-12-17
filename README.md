# 🏥 PersonalHealth AI - Platform Kebugaran Masa Depan

Selamat datang di **PersonalHealth AI**, sebuah revolusi dalam cara Anda merencanakan kesehatan dan kebugaran. Proyek ini bukan sekadar aplikasi pencatat kalori biasa; ini adalah **Health Ecosystem** yang menggabungkan prinsip *Nutritional Science* yang valid dengan kecerdasan buatan generatif (**Generative AI**) terkini.

Ditujukan untuk pengguna yang ingin mencapai target tubuh ideal mereka—baik itu menurunkan berat badan, membentuk otot (bulking), atau sekadar hidup lebih sehat—PersonalHealth AI hadir sebagai **Personal Trainer** dan **Nutritionist** digital yang selalu siap sedia 24/7.

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![Version](https://img.shields.io/badge/version-2.0.0-brightgreen.svg)]()

---

## 👥 Tim Pengembang (The Developers)

Proyek ini dikembangkan dengan dedikasi tinggi oleh tim yang berfokus pada pengalaman pengguna (UI/UX) dan performa sistem yang handal.

| No | Nama | Role & Tanggung Jawab |
| :--- | :--- | :--- |
| **01** | **Muhamad Akbar Rizky Saputra** | **Project Owner & Lead Front-End Engineer**<br>bertanggung jawab atas visi proyek, arsitektur utama aplikasi, dan implementasi fitur antarmuka pengguna yang responsif. |
| **02** | **Muhamad Ghibran Muslih** | **Fullstack Engineer & UI/UX Designer**<br>Menangani *Redesign UI* untuk estetika premium, integrasi Back-End logic, serta optimalisasi alur data pengguna. |

---

## 📑 Daftar Isi (Table of Contents)

1. [Pendahuluan & Filosofi](#-pendahuluan--filosofi)
2. [Tentang PersonalHealth AI](#-tentang-personalhealth-ai)
3. [Arsitektur & Struktur Folder](#-struktur-folder-structure)
4. [Scientific Core (Unsur-Unsur & Konsep Dasar)](#-scientific-core-konsep-kesehatan)
    - [Body Mass Index (BMI)](/-body-mass-index-bmi)
    - [Basal Metabolic Rate (BMR)](/-basal-metabolic-rate-bmr)
    - [Total Daily Energy Expenditure (TDEE)](/-total-daily-energy-expenditure-tdee)
    - [Makronutrisi (Macros)](/-makronutrisi-macros)
5. [Brain of The System: Generative AI](#-brain-of-the-system-generative-ai)
    - [Mengapa Llama-3?](#mengapa-llama-3)
    - [Prompt Engineering Workflow](#prompt-engineering-workflow)
6. [Fitur Utama & Bedah Kode](#-fitur-utama--bedah-kode)
    - [Logic Perhitungan](#1-logic-perhitungan-kalkulator)
    - [AI Service Implementation](#2-ai-service-implementation)
7. [Teknologi yang Digunakan](#-teknologi-yang-digunakan-tech-stack)
8. [Instalasi & Penggunaan](#-instalasi--penggunaan)

---

## 🌟 Pendahuluan & Filosofi

Kesehatan adalah investasi jangka panjang. Namun, informasi yang beredar seringkali membingungkan. Berapa banyak kalori yang sebenarnya saya butuhkan? Apakah saya harus makan nasi? Olahraga apa yang cocok untuk saya?

**PersonalHealth AI** menjawab pertanyaan tersebut dengan **DATA**, bukan asumsi. Kami percaya bahwa setiap individu unik. Rumus yang bekerja untuk atlet berusia 20 tahun tidak akan sama efektifnya untuk pekerja kantor berusia 40 tahun. Oleh karena itu, sistem kami dibangun di atas dua pilar utama:
1.  **Validitas Sains**: Menggunakan rumus medis standar (Mifflin-St Jeor) yang diakui secara global.
2.  **Fleksibilitas AI**: Menggunakan AI untuk memberikan rekomendasi yang tidak kaku, manusiawi, dan selera lokal (Indonesia).

---

## 📂 Struktur Folder (Structure)

Kami menerapkan struktur *feature-based* dan *separation of concerns* yang ketat agar kode mudah dipelihara dan dikembangkan.

```
src/
├── 📁 animations/       # Aset animasi JSON (LottieFiles)
│   ├── glutebridge.json # Animasi panduan latihan
│   └── ...
├── 📁 components/       # Building Blocks UI
│   ├── Dashboard.tsx    # Halaman utama visualisasi data
│   ├── MealPlanning.tsx # Fitur rencana makan
│   └── ...
├── 📁 context/          # Global State Management (React Context)
│   ├── UIContext.tsx    # Mengatur tema dan state UI
│   └── MealContext.tsx  # Mengatur data makanan user
├── 📁 data/             # Static Data
│   └── nutrition.csv    # Database referensi nutrisi dasar
├── 📁 services/         # External API Integrations
│   └── ai.ts            # Konfigurasi Groq & Llama-3
├── 📁 types/            # TypeScript Definitions
│   └── index.ts         # Interface untuk User, Meal, Workout
├── 📁 utils/            # Pure Functions & Math Logic
│   └── calculations.ts  # 'Otak' matematis aplikasi
├── App.tsx              # Routing System
└── main.tsx             # Entry Point
```

---

## 🧪 Scientific Core (Konsep Kesehatan)

Bagian ini menjelaskan **Hukum Fisika Tubuh** yang kami tanamkan ke dalam sistem. Memahami ini penting untuk mengerti mengapa aplikasi memberikan rekomendasi tertentu.

### ⚖️ Body Mass Index (BMI)

**Apa itu BMI?**
BMI adalah metode skrining sederhana namun efektif untuk mengkategorikan berat badan seseorang. Meskipun tidak mengukur lemak tubuh secara langsung, BMI berkorelasi kuat dengan berbagai indikator kesehatan metabolik.

**Mengapa Penting?**
Mengetahui BMI membantu kita menyadari risiko kesehatan. BMI yang terlalu tinggi berkaitan dengan risiko penyakit jantung dan diabetes, sementara terlalu rendah dapat mengindikasikan malnutrisi.

**Tabel Kategori BMI dalam Aplikasi:**

| BMI Range | Kategori | Kode Warna di Aplikasi | Indikasi |
| :--- | :--- | :--- | :--- |
| **< 18.5** | Underweight | 🔵 Blue | Perlu peningkatan asupan kalori & nutrisi |
| **18.5 - 24.9** | Normal Weight | 🟢 Green | Pertahankan gaya hidup sehat saat ini |
| **25.0 - 29.9** | Overweight | 🟡 Yellow | Waspada, mulai atur pola makan |
| **≥ 30.0** | Obese | 🔴 Red | Risiko tinggi, perlu intervensi segera |

---

### 🔥 Basal Metabolic Rate (BMR)

**Definisi:**
BMR adalah jumlah energi (kalori) minimal yang dibakar tubuh Anda untuk bertahan hidup jika Anda hanya tidur seharian selama 24 jam. Ini mencakup energi untuk memompa jantung, memproses nutrisi, memproduksi sel baru, dan menjaga suhu tubuh.

**Rumus yang Digunakan: Mifflin-St Jeor**
Kami memilih rumus ini karena dianggap paling akurat oleh *American Dietetic Association* untuk masyarakat modern saat ini.

> **Pria** = `(10 × berat_kg) + (6.25 × tinggi_cm) - (5 × usia) + 5`
>
> **Wanita** = `(10 × berat_kg) + (6.25 × tinggi_cm) - (5 × usia) - 161`

*Perhatikan bahwa pria memiliki BMR sedikit lebih tinggi (+5) dibanding wanita (-161) karena secara alami memiliki massa otot lebih banyak.*

---

### ⚡ Total Daily Energy Expenditure (TDEE)

**Konsep:**
Anda tidak tidur seharian, bukan? Anda berjalan, bekerja, berpikir, dan berolahraga. TDEE adalah BMR ditambah kalori yang Anda bakar melalui aktivitas fisik tersebut. Inilah angka "Maintenance Calories" Anda—jumlah kalori untuk menjaga berat badan tetap sama.

**Faktor Aktivitas (Activity Multiplier):**

1.  **Sedentary (1.2)**: Banyak duduk, jarang olahraga (pekerja kantoran umum).
2.  **Lightly Active (1.375)**: Olahraga ringan 1-3 hari/minggu.
3.  **Moderately Active (1.55)**: Olahraga sedang 3-5 hari/minggu.
4.  **Very Active (1.725)**: Olahraga berat 6-7 hari/minggu.
5.  **Super Active (1.9)**: Pekerjaan fisik berat atau atlet profesional.

**Matematika Goal:**
Aplikasi secara otomatis menghitung target kalori harian Anda dari TDEE:
-   **Weight Loss**: `TDEE - 500 kkal` (Defisit sehat untuk turun ~0.5kg/minggu)
-   **Muscle Gain/Bulking**: `TDEE + 300` sampai `+500 kkal` (Surplus untuk bahan baku otot)

---

### 🥗 Makronutrisi (Macros)

Kalori bukan segalanya. Sumber kalori juga penting. Kami membagi "piring makan" Anda menjadi tiga komponen utama:

*   **Protein 🍗**: Pembangun otot, hormon, dan enzim. Sangat krusial saat diet untuk mencegah penyusutan otot.
    *   *Target*: 1.4g - 2.2g per kg berat badan.
*   **Lemak (Fat) 🥑**: Penting untuk kesehatan otak dan penyerapan vitamin.
    *   *Target*: ~1.0g per kg berat badan.
*   **Karbohidrat 🍚**: Sumber energi utama tubuh, terutama untuk aktivitas intensitas tinggi.

---

## 🧠 Brain of The System: Generative AI

Disinilah "Magis" terjadi. Kami tidak menggunakan template kaku. Setiap meal plan dan workout plan dibuat *fresh* oleh AI.

### Mengapa Llama-3 (via Groq)?
Kami menggunakan model **Llama-3.3-70b-versatile** yang di-hosting oleh **Groq**.
1.  **Kecepatan Super Cepat**: Groq menggunakan LPU (Language Processing Unit), bukan GPU biasa, memungkinkan generasi teks yang hampir instan.
2.  **Pemahaman Konteks**: Model 70B parameter sangat cerdas dalam memahami nuansa budaya (makanan Indonesia) dan fisiologi latihan.

### Prompt Engineering Workflow
Bagaimana kami "berbicara" dengan AI agar hasilnya akurat? Kami tidak asal bertanya. Kami menggunakan teknik **Prompt Engineering** yang terstruktur:
1.  **Role Playing**: "You are an expert AI Nutritionist..."
2.  **Data Injection**: Kami memasukkan data pengguna (berat, tinggi, goal) ke dalam prompt.
3.  **Constraints (Batasan)**: "Kalori harus +/- 50 dari target", "Gunakan bahasa Indonesia".
4.  **Output Formatting**: "Return ONLY JSON". Ini krusial agar aplikasi bisa membaca jawaban AI dan menampilkannya dalam bentuk kartu yang cantik, bukan hanya teks paragraf panjang.

---

## 🛠 Fitur Utama & Bedah Kode

Berikut adalah implementasi nyata dari konsep-konsep di atas dalam kode TypeScript kami.

### 1. Logic Perhitungan Kalkulator
Fungsi ini adalah jantung dari akurasi data aplikasi. Perhatikan bagaimana *Safety Net* diterapkan agar kalori tidak terlalu rendah.

**File:** `src/utils/calculations.ts`

```typescript
// Fungsi untuk menghitung kebutuhan kalori harian
export const calculateDailyCalories = (
  weight: number, height: number, age: number, 
  gender: string, activityLevel: string, goal: string
): number => {
  // Langkah 1: Hitung BMR (Energi dasar)
  const bmr = calculateBMR(weight, height, age, gender);

  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2, 
    light: 1.375, 
    moderate: 1.55, 
    active: 1.725, 
    "very-active": 1.9, 
  };

  // Langkah 2: Hitung TDEE
  const tdee = bmr * (activityMultipliers[activityLevel] || 1.2);
  let targetCalories = tdee;

  // Langkah 3: Penyesuaian Goal
  // Jika ingin kurus, kurangi 500 kalori. Jika ingin berotot, tambah.
  if (goal === "weight-loss") {
    targetCalories -= 500; 
  } else if (goal === "weight-gain") {
    targetCalories += 500; 
  } else if (goal === "muscle-gain") {
    targetCalories += 300; 
  }

  // SAFETY NET: Jangan biarkan user kelaparan!
  // Batas minimum pria: 1500, wanita: 1200
  const minCalories = gender === "male" ? 1500 : 1200;
  return Math.round(Math.max(targetCalories, minCalories));
};
```

**Penjelasan Kode:**
-   Kode diatas memastikah bahwa meskipun user ingin diet ekstrim, sistem akan menahannya di batas aman (`Math.max`).
-   Struktur `if-else` sederhana namun vital untuk menentukan arah goal pengguna.

---

### 2. AI Service Implementation
Bagaimana kode TypeScript "memanggil" otak AI? Kami menggunakan fungsi asinkron (Async/Await) untuk menghubungi Groq API.

**File:** `src/services/ai.ts`

```typescript
// Interface untuk memastikan jawaban AI sesuai format
export interface DailyMealPlan {
  breakfast: MealGeneratedItem[];
  lunch: MealGeneratedItem[];
  dinner: MealGeneratedItem[];
  snack: MealGeneratedItem[];
}

export const generateMealPlanAI = async (
  targetCalories: number, dietType: string, nutritionReference: any[]
): Promise<DailyMealPlan | null> => {
  
  // Prompt yang dikirim ke AI
  // Perhatikan instruksi 'Indonesian Food Names' agar AI tidak menyarankan 
  // makanan barat yang sulit dicari seperti 'Kale' atau 'Quinoa' secara berlebihan.
  const prompt = `
    You are an expert AI Nutritionist for an Indonesian audience.
    Your task is to generate a daily meal plan... that totals approximately **${targetCalories} kcal**.
    Diet Goal: ${dietType}.

    **Strict Requirements:**
    1. **Total Calories**: Must be within +/- 50 kcal.
    2. **Language**: Use **Indonesian Food Names** (e.g., "Nasi Goreng Spesial").
    3. **Format**: Return ONLY valid JSON...
  `;

  // Mengirim request ke Groq
  const result = await generateAIContent(prompt);

  // Parsing hasil JSON string menjadi Object JavaScript
  if (result.success && result.data) {
    try {
        return JSON.parse(result.data);
    } catch (e) {
        console.error("AI returned invalid JSON");
        return null;
    }
  }
  return null;
};
```

**Penjelasan Kode:**
-   `prompt`: Instruksi detail yang dikirim ke 'otak' AI. Semakin detail prompt, semakin bagus hasilnya.
-   `JSON.parse`: AI mengembalikan teks, kita harus mengubahnya menjadi objek agar bisa ditampilkan di layar dalam bentuk kartu/list.

---

## 💻 Teknologi yang Digunakan (Tech Stack)

Aplikasi ini dibangun di atas infrastruktur teknologi modern untuk menjamin kecepatan dan skalabilitas.

*   **Frontend Framework**: React + Vite (Untuk performa development yang instan).
*   **Language**: TypeScript (Menghindari bug tipe data sejak dini).
*   **Styling**: Tailwind CSS (Desain responsif dan modern dengan utility-first)..
*   **Icons**: Lucide React (Ikon vektor ringan dan tajam).
*   **Animations**: Framer Motion & Lottie (Interaksi UI yang halus).
*   **AI Provider**: Groq SDK (Llama 3 Model Access).
*   **Deploy Target**: Firebase Hosting / Vercel.

---

## 🔧 Instalasi & Penggunaan

Ingin menjalankan proyek ini di mesin lokal Anda? Ikuti langkah mudah berikut:

1.  **Clone Repository**
    ```bash
    git clone https://github.com/Arzstyle/PersonalHealth-AI.git
    cd PersonalHealth-AI
    ```

2.  **Install Dependencies**
    Pastikan Anda memiliki Node.js terinstall.
    ```bash
    npm install
    ```

3.  **Setup Environment Variables**
    Buat file `.env` di root folder dan masukkan API Key Groq Anda.
    ```env
    VITE_GROQ_API_KEY=gsk_your_api_key_here
    ```

4.  **Jalankan Aplikasi**
    ```bash
    npm run dev
    ```
    Aplikasi akan berjalan di `http://localhost:5173`.

---

*Copyright © 2024 PersonalHealth AI Team. All Rights Reserved.*
*Sehat itu investasi, mulailah dari sekarang.*
