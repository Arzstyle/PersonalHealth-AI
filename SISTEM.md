# 🎨 Sistem Animasi & Visual PersonalHealth-AI

Dokumen ini menjelaskan secara detail teknologi dan teknik animasi yang digunakan dalam aplikasi ini, mulai dari layar awal (Onboarding) hingga interaksi antarmuka utama.

## 🛠️ Teknologi Inti
Sistem visual dibangun menggunakan kombinasi:
1.  **Tailwind CSS (v3)** - Utility-first framework untuk styling cepat.
2.  **Custom Keyframes (CSS & Tailwind Config)** - Animasi kustom untuk efek unik.
3.  **CSS Backdrop Filters** - Untuk efek *glassmorphism* (kaca).
4.  **CSS Blend Modes** - Untuk pencampuran warna latar belakang yang artistik.

## 📚 Tech Stack & Libraries
Berikut adalah daftar lengkap pustaka dan framework yang digunakan dalam proyek ini (berdasarkan `package.json`):

### Core Framework
*   **[React](https://react.dev/) (v18.3)**: Library UI utama untuk membangun komponen.
*   **[TypeScript](https://www.typescriptlang.org/)**: Superset JavaScript yang menambahkan tipe statis (safety).
*   **[Vite](https://vitejs.dev/)**: Build tool yang sangat cepat untuk development server dan bundling produksi.

### Styling & Visual
*   **[Tailwind CSS](https://tailwindcss.com/) (v3.4)**: Framework CSS utility-first untuk styling.
*   **[Lucide React](https://lucide.dev/)**: Koleksi ikon SVG yang bersih dan konsisten.
*   **[Lottie React](https://lottiefiles.com/)**: Library untuk merender animasi JSON kompleks (vector animations).

### Backend & AI Services
*   **[Firebase](https://firebase.google.com/) (v12.6)**: Platform Backend-as-a-Service (BaaS) untuk:
    *   Authentication (Login Google/Email).
    *   Firestore (Database NoSQL real-time).
    *   Analytics.
*   **[Groq SDK](https://groq.com/)**: Digunakan untuk akses AI yang sangat cepat (Llama 3 model) dalam fitur *AI Meal Planning*.
*   **[Google Generative AI](https://ai.google.dev/)**: Integrasi alternatif untuk fitur kecerdasan buatan.

### Routing & Navigation
*   **[React Router DOM](https://reactrouter.com/) (v6.30)**: Menangani navigasi antar halaman (SPA routing).

---

## 1. Global CSS Animations (`src/index.css`)

File ini menyimpan animasi "low-level" yang digunakan di seluruh aplikasi.

### ✨ Efek Masuk (Entrance Effects)
*   **`.animate-enter` / `@keyframes fadeSlideUp`**:
    *   Digunakan saat komponen pertama kali muncul (misal: kartu login, dashboard).
    *   **Mekanisme**: Elemen mulai dari `opacity: 0` dan sedikit turun (`translateY(30px)`), lalu naik ke posisi asli sambil menjadi solid. Memberikan kesan "muncul dari bawah".

### 🌌 Efek Latar Belakang (Atmospheric)
*   **`.animate-aurora` / `@keyframes aurora`**:
    *   Menggerakkan posisi background gradient secara perlahan (kiri ke kanan lalu kembali) untuk menciptakan efek langit aurora yang hidup.
*   **`.animate-blob-spin` / `@keyframes blob-spin`**:
    *   Membuat elemen berputar *sambil* berubah bentuk (scale naik turun). Digunakan untuk ornamen latar belakang yang abstrak.
*   **`.animate-mesh` / `@keyframes meshFlow`**:
    *   Animasi kompleks yang mengubah posisi (translate) dan rotasi sekaligus. Menciptakan efek jaring-jaring atau pola yang "mengalir" tidak beraturan.

### 💎 Glassmorphism System (`.glass-panel`)
Kelas utilitas khusus untuk membuat panel seperti kaca buram.
*   **Base Style**: Background semi-transparan (`bg-white/80` atau `bg-[#0F172A]/70`), `backdrop-blur-2xl` (buram kuat), dan border tipis.
*   **Hover Effect**: Saat mouse diarahkan, panel sedikit naik (`-translate-y-2`), skala membesar (`scale-[1.01]`), dan shadow/glow warna emerald muncul.

### 🖱️ Interaksi Mikro
*   **`.btn-press`**: Efek "menekan" tombol. Saat diklik (`:active`), elemen mengecil sedikit (`scale-95`) untuk memberi feedback taktil.

---

## 2. Tailwind Configuration Animations (`tailwind.config.js`)

Animasi ini didaftarkan ke konfigurasi Tailwind agar bisa dipanggil langsung dengan class (contoh: `animate-float`).

### 🎈 Custom Utility Classes
*   **`animate-blob`**:
    *   Animasi bentuk "cair" yang bergerak 3 titik koordinat berbeda secara infinite. Memberikan kesan organik pada lingkaran latar belakang.
*   **`animate-float`**:
    *   Membuat elemen melayang naik-turun secara halus. Biasa digunakan untuk ikon atau ilustrasi agar terlihat tidak kaku.
*   **`animate-spin-slow`** (15s) & **`animate-spin-reverse-slow`** (20s):
    *   Putaran sangat lambat. Digunakan untuk elemen dekoratif latar belakang (seperti lingkaran dashed di MealPlanning) agar tidak mengganggu fokus user.
*   **`animate-pulse-glow`**:
    *   Kombinasi `opacity` dan `box-shadow` yang berdenyut. Memberikan efek "bernafas" atau *glowing* pada elemen penting.

---

## 3. Implementasi di Layar (Contoh Kasus)

### 🚀 Layar Onboarding (`Onboarding.tsx`)

Halaman ini menggunakan teknik **Adaptive Background** yang canggih:

1.  **Dual Layer (Dark/Light Mode)**:
    *   Terdapat dua container background terpisah untuk mode gelap dan terang. Transisi antar mode menggunakan `transition-opacity duration-700` agar sangat halus.

2.  **Latar Belakang Abstrak (Light Mode)**:
    *   Menggunakan `mix-blend-multiply` pada dua lingkaran besar (biru & ungu) yang di-blur (`blur-[120px]`).
    *   Efek: Warna-warna menyatu seperti cat air saat bertumpuk.

3.  **Latar Belakang "Deep Space" (Dark Mode)**:
    *   Menggunakan `mix-blend-screen` pada lingkaran cahaya.
    *   **Animation**: Lingkaran cahaya diberi `animate-pulse` dengan delay berbeda (`animationDelay: "2s"`), sehingga mereka berkedip bergantian seperti bintang yang bernafas.
    *   **Grid Pattern**: Menggunakan `bg-[linear-gradient(...)]` untuk membuat pola kotak-kotak halus (grid) yang memberikan kesan teknikal/futuristik.

4.  **Kartu Login**:
    *   Menggunakan class `.animate-enter` (dari index.css) saat pertama kali dimuat.
    *   Menggunakan `backdrop-blur-xl` agar background abstrak di belakangnya tetap terlihat samar-samar.

---

## 🔍 Ringkasan Teknis

| Jenis Animasi | Class Name | Fungsi Utama |
| :--- | :--- | :--- |
| **Entrance** | `.animate-enter` / `animate-fade-in` | Memunculkan UI saat load awal. |
| **Ambient** | `animate-blob`, `animate-pulse`, `animate-float` | Menghidupkan elemen diam (background/ikon) agar tidak statis. |
| **Feedback** | `.btn-press`, `hover:scale...` | Memberi respon saat user berinteraksi (klik/hover). |
| **Struktural** | `.glass-panel` | Standarisasi tampilan kartu gelas (glassmorphism). |
| **Dekoratif** | `spin-slow`, `mix-blend...` | Estetika visual Cyber/Futuristik. |
