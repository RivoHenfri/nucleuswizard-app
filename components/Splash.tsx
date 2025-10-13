import React from 'react';

const Splash: React.FC = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center animate-fadeOut pointer-events-none">
      {/* Flash Effect */}
      <div className="absolute inset-0 bg-white animate-flash"></div>

      {/* Glowing Orb */}
      <div className="relative w-48 h-48 md:w-56 md:h-56 flex items-center justify-center mb-8">
        <div className="absolute w-full h-full rounded-full bg-amber-600/40 animate-pulse-glow"></div>
        <div className="absolute w-2/3 h-2/3 rounded-full bg-radial-gradient from-amber-200 to-transparent"></div>
         <p className="font-cinzel text-2xl font-bold text-yellow-100 z-10 text-shadow-strong">Integrity</p>
      </div>
      
      {/* Title */}
      <h1 className="font-cinzel text-3xl md:text-5xl font-bold text-yellow-200 text-center animate-fadeInDelayed text-shadow-strong">
        Awakening the Inner Wizard
      </h1>
    </div>
  );
};

export default Splash;