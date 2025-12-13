# Panduan Setup Firebase untuk Google Login

Ya, Anda **harus** membuat proyek di Firebase agar fitur login Google bisa berfungsi. Firebase adalah layanan dari Google yang menangani keamanan dan proses login tersebut.

Berikut adalah langkah-langkah mudah untuk mendapatkannya (Gratis):

## 1. Buat Proyek Firebase

1. Buka [Firebase Console](https://console.firebase.google.com/).
2. Login dengan akun Google Anda.
3. Klik **"Create a project"** (atau "Add project").
4. Beri nama proyek (misalnya: `PersonalHealthApp`) dan ikuti langkah-langkahnya (Anda bisa mematikan Google Analytics jika tidak butuh).

## 2. Daftarkan Aplikasi Web

1. Setelah proyek jadi, di halaman utama proyek, klik ikon **Web** (ikon `</>`).
2. Masukkan nama aplikasi (misalnya: `My Health App`).
3. Klik **Register app**.

## 3. Salin Kode Konfigurasi

1. Firebase akan menampilkan kode konfigurasi `firebaseConfig`.
2. Salin bagian yang terlihat seperti ini:
   ```javascript
   const firebaseConfig = {
     apiKey: "...",
     authDomain: "...",
     projectId: "...",
     storageBucket: "...",
     messagingSenderId: "...",
     appId: "...",
   };
   ```
3. Buka file `src/firebase.ts` di VS Code Anda.
4. Ganti bagian `const firebaseConfig = { ... }` yang lama dengan kode yang baru Anda salin.

## 4. Aktifkan Google Sign-In (PENTING!)

Tanpa langkah ini, login akan tetap gagal meskipun kodenya benar.

1. Kembali ke Firebase Console.
2. Di menu kiri, klik **Build** > **Authentication**.
3. Klik **Get started**.
4. Pilih tab **Sign-in method**.
5. Klik **Google**.
6. Klik tombol **Enable**.
7. Pilih email dukungan proyek (biasanya email Anda sendiri).
8. Klik **Save**.

## 5. Coba Lagi

Setelah langkah di atas selesai, kembali ke aplikasi Anda (refresh halaman jika perlu) dan coba klik tombol **Google** lagi.
