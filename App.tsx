
import React, { useState, useEffect, useRef } from 'react';
import IntegrityWheel from './components/Opening';
import Splash from './components/Splash';
import AudioControls from './components/AudioControls';

const splashSound = 'https://actions.google.com/sounds/v1/magical/magic_spell_charge_up.ogg';
// Epic background music options (legal alternatives)
const backgroundMusicOptions = {
  epic: 'https://www.chosic.com/wp-content/uploads/2022/05/epic-cinematic-trailer-117909.mp3',
  fantasy: 'https://www.chosic.com/wp-content/uploads/2022/01/enchanted-valley-127769.mp3',
  heroic: 'https://www.chosic.com/wp-content/uploads/2021/12/heroic-kingdom-119502.mp3',
  mystical: 'https://www.chosic.com/wp-content/uploads/2022/03/mystical-adventure-118739.mp3'
};
const backgroundSound = backgroundMusicOptions.epic; // Change this to switch music
const hoverSound = 'https://actions.google.com/sounds/v1/ui/ui_button_hover.ogg';
const successSound = 'https://actions.google.com/sounds/v1/magical/magic_spell_cast.ogg';

// Simple audio player
const playSimpleSound = (src: string, volume = 0.6) => {
  try {
    const audio = new Audio(src);
    audio.volume = volume;
    audio.play().catch(error => console.warn("Audio playback failed:", error));
  } catch (error) {
    console.error("Audio error:", error);
  }
};

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const backgroundAudioRef = useRef<HTMLAudioElement | null>(null);
  const splashAudioRef = useRef<HTMLAudioElement | null>(null);

  // Pre-load audio on component mount to ensure it's ready to play.
  useEffect(() => {
    const bgAudio = new Audio(backgroundSound);
    bgAudio.loop = true;
    bgAudio.volume = 0.25;
    bgAudio.preload = 'auto';
    backgroundAudioRef.current = bgAudio;

    const spAudio = new Audio(splashSound);
    spAudio.preload = 'auto';
    splashAudioRef.current = spAudio;

    // Clean up the audio elements when the component unmounts.
    return () => {
      if (bgAudio) {
        bgAudio.pause();
      }
      if (spAudio) {
        spAudio.pause();
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
    // Play pre-loaded sounds directly within the user-initiated click event to comply with browser autoplay policies.
    if (splashAudioRef.current) {
      splashAudioRef.current.currentTime = 0;
      splashAudioRef.current.play().catch(error => console.warn("Splash audio playback failed.", error));
    }

    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.play().catch(error => console.warn("Background audio playback failed.", error));
    }
    
    playSimpleSound(successSound);
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
      
      {/* Audio Controls */}
      {hasStarted && <AudioControls backgroundAudioRef={backgroundAudioRef} />}
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen py-10">
        {!hasStarted ? (
           <div className="text-center flex flex-col items-center justify-center">
             <h1 className="font-cinzel text-3xl md:text-5xl font-bold text-yellow-200 text-center text-shadow-strong mb-8 animate-fadeInDelayed">
                 Awakening the Inner Wizard
             </h1>
             <button
                 onClick={handleStart}
                 onMouseEnter={() => playSimpleSound(hoverSound, 0.3)}
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