import React from "react";
import Navigation from "./Navigation";

interface LayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
  showNavLinks?: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  showNavigation = true,
  showNavLinks = true,
}) => {
  return (
    <div className="flex flex-col min-h-screen w-full bg-white dark:bg-[#030712] text-slate-900 dark:text-slate-100 transition-colors duration-500 font-sans relative overflow-hidden selection:bg-emerald-500/30">
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-full blur-[120px] animate-blob-spin opacity-60 dark:opacity-30 mix-blend-multiply dark:mix-blend-screen"></div>

        <div
          className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-[120px] animate-blob-spin opacity-60 dark:opacity-30 mix-blend-multiply dark:mix-blend-screen"
          style={{ animationDelay: "5s" }}
        ></div>

        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
      </div>

      {showNavigation && <Navigation showLinks={showNavLinks} />}

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
