
import React, { useState, useEffect, useRef } from 'react';
import IntegrityWheel from './components/Opening';
import Splash from './components/Splash';

const splashSound = 'https://cdn.pixabay.com/audio/2022/03/15/audio_2b4b537f07.mp3';
const backgroundSound = 'https://cdn.pixabay.com/audio/2022/11/17/audio_850d533c3a.mp3';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const backgroundAudioRef = useRef<HTMLAudioElement | null>(null);

  // Pre-load background audio on component mount to ensure it's ready to play.
  useEffect(() => {
    const audio = new Audio(backgroundSound);
    audio.loop = true;
    audio.volume = 0.25;
    backgroundAudioRef.current = audio;

    // Clean up the audio element when the component unmounts.
    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Duration of the splash screen
    return () => clearTimeout(timer);
  }, [hasStarted]);
  

  const handleStart = () => {
    // Play sounds directly within the user-initiated click event to comply with browser autoplay policies.
    
    // Play a short splash sound on demand.
    try {
      const audio = new Audio(splashSound);
      audio.play().catch(error => console.log("Splash audio was interrupted by browser.", error));
    } catch (error) {
      console.error("Could not play splash audio:", error);
    }

    // Play the pre-loaded background music.
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.play().catch(error => console.log("Background audio playback failed.", error));
    }
    
    setHasStarted(true);
  };

  return (
    <main className="relative min-h-screen w-full bg-cover bg-center bg-fixed p-4 md:p-8" style={{backgroundImage: "url('https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&w=2070')"}}>
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
          isLoading ? <Splash /> : <IntegrityWheel backgroundAudioRef={backgroundAudioRef} />
        )}
      </div>
    </main>
  );
};

export default App;