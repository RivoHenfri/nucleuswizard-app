import React, { useState, useEffect } from 'react';
import IntegrityWheel from './components/Opening';
import Splash from './components/Splash';

const splashSound = 'https://actions.google.com/sounds/v1/magical/magic_spell_large_cast.ogg';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!hasStarted) return;

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Duration of the splash screen
    return () => clearTimeout(timer);
  }, [hasStarted]);

  const handleStart = () => {
    try {
      const audio = new Audio(splashSound);
      audio.play().catch(error => console.log("Splash audio was interrupted by browser.", error));
    } catch (error) {
      console.error("Could not play splash audio:", error);
    }
    setHasStarted(true);
  };

  return (
    <main className="relative min-h-screen w-full bg-cover bg-center bg-fixed p-4 md:p-8" style={{backgroundImage: "url('https://i.imgur.com/eBf7p3R.jpeg')"}}>
      <div className="starfield">
        <div className="stars stars-slow"></div>
        <div className="stars stars-medium"></div>
        <div className="stars stars-fast"></div>
      </div>
      <div className="absolute inset-0 bg-[#141A17]/70 backdrop-blur-sm"></div>
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen py-10">
        {!hasStarted ? (
           <div className="text-center flex flex-col items-center justify-center">
             <h1 className="font-cinzel text-3xl md:text-5xl font-bold text-yellow-200 text-center text-shadow-strong mb-8 animate-fadeInDelayed">
                 Awakening the Inner Wizard
             </h1>
             <button
                 onClick={handleStart}
                 className="px-12 py-4 bg-emerald-600 text-gray-100 font-bold text-lg rounded-full hover:bg-emerald-500 transition-all duration-300 transform hover:scale-110 animate-pulse-button"
             >
                 Begin the Journey
             </button>
         </div>
        ) : (
          isLoading ? <Splash /> : <IntegrityWheel />
        )}
      </div>
    </main>
  );
};

export default App;
