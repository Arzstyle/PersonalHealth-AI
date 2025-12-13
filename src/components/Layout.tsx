import React from "react";
import Navigation from "./Navigation";
import { useUI } from "../context/UIContext";
import { Moon, Sun, Languages } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showNavigation = true }) => {
  const { theme, toggleTheme, language, setLanguage } = useUI();

  return (
    <div className="textured-bg flex flex-col relative min-h-screen overflow-x-hidden text-gray-800 dark:text-dark-text transition-colors duration-300">
      {/* --- Floating Settings (Theme & Lang) --- */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        {/* Language Toggle */}
        <button
          onClick={() => setLanguage(language === "en" ? "id" : "en")}
          className="p-2 rounded-full glass-panel hover:bg-white/80 dark:hover:bg-gray-700 transition-all shadow-md flex items-center gap-2 px-4"
          aria-label="Toggle Language"
        >
          <Languages className="w-5 h-5 text-primary-600" />
          <span className="font-semibold text-sm">
            {language === "en" ? "EN" : "ID"}
          </span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full glass-panel hover:bg-white/80 dark:hover:bg-gray-700 transition-all shadow-md"
          aria-label="Toggle Theme"
        >
          {theme === "light" ? (
            <Moon className="w-5 h-5 text-gray-600" />
          ) : (
            <Sun className="w-5 h-5 text-yellow-400" />
          )}
        </button>
      </div>

      {showNavigation && <Navigation />}

      {/* Container Utama */}
      <main
        className={`flex-grow w-full relative z-10 ${
          showNavigation ? "pt-28 pb-0" : "py-0"
        }`}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
