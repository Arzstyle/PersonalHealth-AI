import React from "react";
import Navigation from "./Navigation";

interface LayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showNavigation = true }) => {
  return (
    // WRAPPER UTAMA
    // flex-col & min-h-screen: Memastikan layout mengisi tinggi layar penuh
    // bg-white/dark:bg-[#030712]: Warna dasar background
    // overflow-hidden: Mencegah scrollbar horizontal yang tidak diinginkan dari animasi background
    <div className="flex flex-col min-h-screen w-full bg-white dark:bg-[#030712] text-slate-900 dark:text-slate-100 transition-colors duration-500 font-sans relative overflow-hidden selection:bg-emerald-500/30">
      {/* --- ANIMATED BACKGROUND LAYER (Lapisan Animasi) --- */}
      {/* pointer-events-none: Agar background tidak mengganggu klik pada tombol/link */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* 1. Aurora Blobs (Bola Warna Bergerak) */}
        {/* Blob Atas-Kiri (Emerald/Cyan) */}
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-full blur-[120px] animate-aurora opacity-60 dark:opacity-30 mix-blend-multiply dark:mix-blend-screen"></div>

        {/* Blob Bawah-Kanan (Blue/Purple) */}
        <div
          className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-[120px] animate-aurora opacity-60 dark:opacity-30 mix-blend-multiply dark:mix-blend-screen"
          style={{ animationDelay: "5s" }}
        ></div>

        {/* 2. Noise Texture (Tekstur Bintik Halus - Premium Feel) */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
      </div>

      {/* --- NAVIGATION BAR --- */}
      {/* Muncul hanya jika props showNavigation = true */}
      {showNavigation && <Navigation />}

      {/* --- KONTEN UTAMA (Children) --- */}
      {/* relative z-10: Agar konten berada DI ATAS background animasi */}
      {/* pt-20: Memberi jarak agar konten tidak tertutup Navbar (karena navbar fixed) */}
      <main
        className={`flex-1 relative z-10 w-full overflow-hidden ${
          showNavigation ? "pt-20" : "pt-0"
        }`}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
