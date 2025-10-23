import React, { useState, useEffect, useRef } from 'react';
import IntegrityWheel from './components/Opening';
import Splash from './components/Splash';

// Use Web Audio API to create simple audio tones instead of external files
const createAudioTone = (frequency: number, duration: number, type: OscillatorType = 'sine'): void => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  } catch (error) {
    console.log("Audio tone creation failed:", error);
  }
};

// Create magical sound effect using multiple tones
const playMagicalSound = (): void => {
  createAudioTone(440, 0.3, 'sine');   // A note
  setTimeout(() => createAudioTone(554, 0.3, 'sine'), 100);   // C# note
  setTimeout(() => createAudioTone(659, 0.5, 'sine'), 200);   // E note
};

// Create ambient background sound using low frequency tones
const playBackgroundAmbient = (): void => {
  createAudioTone(60, 2, 'sine');   // Low hum
  setTimeout(() => createAudioTone(80, 1.5, 'triangle'), 500);
};

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const backgroundIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!hasStarted) return;

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Duration of the splash screen
    return () => clearTimeout(timer);
  }, [hasStarted]);
  
  // This function "unlocks" the browser's audio context, allowing sounds to play.
  // It should be called on the very first user interaction.
  const unlockAudio = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
    } catch (e) {
      console.error("Could not unlock audio context:", e);
    }
  };

  const handleStart = () => {
    unlockAudio(); // Unlock audio on the first click.

    // Play magical sound using Web Audio API
    playMagicalSound();

    // Start background ambient sounds
    if (!backgroundIntervalRef.current) {
      // Play ambient sound every 5 seconds
      backgroundIntervalRef.current = setInterval(() => {
        playBackgroundAmbient();
      }, 5000);
      
      // Play initial background sound
      playBackgroundAmbient();
    }
    
    setHasStarted(true);
  };

  // Cleanup background sounds when component unmounts
  useEffect(() => {
    return () => {
      if (backgroundIntervalRef.current) {
        clearInterval(backgroundIntervalRef.current);
      }
    };
  }, []);

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
          isLoading ? <Splash /> : <IntegrityWheel />
        )}
      </div>
    </main>
  );
};

export default App;