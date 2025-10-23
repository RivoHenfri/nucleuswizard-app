
import React from 'react';

// --- Audio Assets ---
const sounds = {
  sessionEnd: 'https://cdn.pixabay.com/audio/2022/03/24/audio_73f0c1126b.mp3',
};

// --- Audio Player Utility ---
const playSound = (src: string, loop = false) => {
  try {
    const audio = new Audio(src);
    audio.loop = loop;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        // This error is common in modern browsers when audio is not user-initiated.
        // It's safe to ignore, as the app functionality is not blocked.
        console.warn(`Audio playback interrupted for "${src}". This may be due to browser autoplay policies.`, error);
      });
    }
    return audio;
  } catch (error) {
    console.error(`Could not play audio for "${src}":`, error);
    return null;
  }
};

const Closing: React.FC = () => {

  const handleSessionComplete = () => {
    playSound(sounds.sessionEnd);
    setTimeout(() => {
      window.location.reload();
    }, 1500); // Delay allows sound to play
  };

  return (
    <div className="flex flex-col items-center max-w-4xl mx-auto text-center animate-fadeIn">
      <h2 className="font-cinzel text-3xl md:text-4xl font-bold text-yellow-300 mb-6">The Energy of Integrity</h2>
      <div className="bg-black/40 p-6 rounded-xl shadow-2xl shadow-emerald-500/10 mb-8">
        <p className="text-lg leading-relaxed italic">
          “When our inner particles — our values — align, we create not just work, but energy. Leadership isn’t about how bright we shine alone, but how stable our orbit is together.”
        </p>
      </div>
      <div className="w-full max-w-2xl space-y-6 text-left">
          <div className="bg-black/20 p-4 rounded-lg">
              <label htmlFor="magic" className="block text-emerald-200 text-lg font-semibold mb-2">My inner magic is…</label>
              <textarea id="magic" rows={2} className="w-full bg-gray-900/50 border border-gray-600 rounded-md p-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"></textarea>
          </div>
          <div className="bg-black/20 p-4 rounded-lg">
              <label htmlFor="steady" className="block text-yellow-200 text-lg font-semibold mb-2">I’ll keep it steady by…</label>
              <textarea id="steady" rows={2} className="w-full bg-gray-900/50 border border-gray-600 rounded-md p-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition"></textarea>
          </div>
      </div>
       <button 
        onClick={handleSessionComplete}
        className="mt-10 px-8 py-3 bg-gradient-to-r from-yellow-400 to-emerald-500 text-gray-900 font-bold rounded-full shadow-lg shadow-yellow-400/30 hover:opacity-90 transition-all duration-300 transform hover:scale-105"
      >
        Session Complete
      </button>
    </div>
  );
};

export default Closing;
