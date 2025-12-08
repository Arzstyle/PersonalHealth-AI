import React from 'react';
import Navigation from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showNavigation = true }) => {
  // Daftar emoji dekorasi
  const backgroundEmojis = [
    { icon: '🍎', top: '10%', left: '5%', size: 'text-6xl', delay: '0s' },
    { icon: '💪', top: '25%', right: '8%', size: 'text-7xl', delay: '2s' },
    { icon: '💧', top: '50%', left: '12%', size: 'text-5xl', delay: '4s' },
    { icon: '🧘', top: '15%', left: '45%', size: 'text-6xl', delay: '1.5s' },
    { icon: '🥗', bottom: '20%', right: '15%', size: 'text-6xl', delay: '3s' },
    { icon: '👟', bottom: '10%', left: '8%', size: 'text-5xl', delay: '5s' },
    { icon: '🩺', top: '60%', right: '5%', size: 'text-5xl', delay: '2.5s' },
    { icon: '🥑', top: '80%', left: '50%', size: 'text-4xl', delay: '1s' },
  ];

  return (
    <div className="textured-bg flex flex-col relative min-h-screen overflow-x-hidden">
      
      {/* --- Layer Emoji Dekorasi --- */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden h-full w-full z-0">
        {backgroundEmojis.map((item, index) => (
          <div
            key={index}
            className={`floating-emoji ${item.size} select-none`}
            style={{
              top: item.top,
              left: item.left,
              right: item.right,
              bottom: item.bottom,
              animationDelay: item.delay
            }}
          >
            {item.icon}
          </div>
        ))}
      </div>

      {showNavigation && <Navigation />}
      
      {/* PERBAIKAN: Hapus padding horizontal (px) di sini. 
         Biarkan children yang mengatur paddingnya sendiri. */}
      <main className={`flex-grow w-full relative z-10 ${showNavigation ? 'pt-28 pb-12' : 'py-12'}`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;