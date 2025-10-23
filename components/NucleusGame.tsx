
import React, { useState, useEffect } from 'react';
import type { Particle } from '../types';

interface NucleusGameProps {
  onComplete: () => void;
}

const initialParticles: Particle[] = [
  { id: 1, name: 'Independent', prompt: 'When did you last make a decision without waiting for approval—and it turned out right?', isClicked: false },
  { id: 2, name: 'Natural', prompt: 'Where do you feel most yourself at work?', isClicked: false },
  { id: 3, name: 'Trusty', prompt: 'What makes people trust you?', isClicked: false },
  { id: 4, name: 'Equitable', prompt: 'How do you ensure fairness when others can’t see your process?', isClicked: false },
  { id: 5, name: 'Genuine', prompt: 'What makes your authenticity shine?', isClicked: false },
  { id: 6, name: 'Reliable', prompt: 'How do you show up consistently, even in small things?', isClicked: false },
  { id: 7, name: 'Incorruptible', prompt: 'When values are tested, what helps you stay true?', isClicked: false },
  { id: 8, name: 'Truthful', prompt: 'What truth about yourself are you ready to own today?', isClicked: false },
  { id: 9, name: 'You', prompt: 'What’s one action that reflects your integrity tomorrow?', isClicked: false },
];

// --- Audio Assets ---
const sounds = {
  particleClick: 'https://cdn.pixabay.com/audio/2022/03/07/audio_a55381f9b1.mp3',
  nucleusGlow: 'https://cdn.pixabay.com/audio/2022/10/13/audio_779c16bb77.mp3',
  complete: 'https://cdn.pixabay.com/audio/2022/03/24/audio_73f0c1126b.mp3',
  close: 'https://cdn.pixabay.com/audio/2022/03/31/audio_472a1106e2.mp3',
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

// Modal component defined inside to avoid extra file
const Modal: React.FC<{ particle: Particle; onClose: () => void }> = ({ particle, onClose }) => (
  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fadeIn" onClick={onClose}>
    <div className="bg-[#1a1a2e] border border-yellow-400/50 rounded-xl shadow-2xl shadow-yellow-500/20 max-w-md w-full m-4 p-8 text-center" onClick={e => e.stopPropagation()}>
      <h3 className="font-cinzel text-2xl font-bold text-yellow-300 mb-4">{particle.name}</h3>
      <p className="text-gray-300 text-lg">{particle.prompt}</p>
      <button 
        onClick={onClose}
        className="mt-6 px-6 py-2 bg-yellow-400 text-gray-900 font-bold rounded-full shadow-lg hover:bg-yellow-300 transition-colors duration-300"
      >
        Close
      </button>
    </div>
  </div>
);

const NucleusGame: React.FC<NucleusGameProps> = ({ onComplete }) => {
  const [particles, setParticles] = useState<Particle[]>(initialParticles);
  const [activeParticle, setActiveParticle] = useState<Particle | null>(null);
  const [allClicked, setAllClicked] = useState(false);

  const handleParticleClick = (particle: Particle) => {
    // Show modal even if clicked, but don't re-play sounds or update state.
    if (particle.isClicked) {
      setActiveParticle(particle);
      return;
    }

    playSound(sounds.particleClick);
    setActiveParticle(particle);
    
    const updatedParticles = particles.map(p =>
      p.id === particle.id ? { ...p, isClicked: true } : p
    );

    setParticles(updatedParticles);
    
    // If all particles are now clicked, trigger the completion effects.
    // This is checked here to tie the nucleusGlow sound to the user's click action.
    if (!allClicked && updatedParticles.every(p => p.isClicked)) {
      playSound(sounds.nucleusGlow);
      setAllClicked(true);
    }
  };

  const handleCloseModal = () => {
    playSound(sounds.close);
    setActiveParticle(null);
  };

  const handleComplete = () => {
    playSound(sounds.complete);
    onComplete();
  };

  const radius = 220; // in pixels for desktop
  const mobileRadius = 140;

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <h2 className="font-cinzel text-3xl md:text-4xl font-bold text-emerald-200 mb-4 text-center">The Nucleus of Integrity</h2>
      <p className="text-center mb-10 max-w-2xl">Click each orbiting particle to reveal a reflection prompt. After all are clicked, the nucleus will glow, symbolizing the integrated self.</p>
      
      <div className="relative w-full h-[320px] md:h-[500px] flex items-center justify-center">
        {/* Nucleus */}
        <div className={`
          absolute w-24 h-24 md:w-32 md:h-32 rounded-full bg-yellow-400/50 
          flex items-center justify-center text-center font-bold text-yellow-100
          transition-all duration-1000 shadow-2xl
          ${allClicked ? 'animate-pulse-glow scale-110 shadow-yellow-400/60' : 'shadow-yellow-400/20'}
        `}>
          Integrity
        </div>
        
        {/* Particles */}
        {particles.map((particle, i) => {
          const angle = (i / particles.length) * 2 * Math.PI;
          const x = Math.cos(angle) * (window.innerWidth < 768 ? mobileRadius : radius);
          const y = Math.sin(angle) * (window.innerWidth < 768 ? mobileRadius : radius);
          
          return (
            <div
              key={particle.id}
              onClick={() => handleParticleClick(particle)}
              className={`
                absolute w-24 h-24 flex items-center justify-center text-center p-2 rounded-full cursor-pointer
                transition-all duration-300 transform
                hover:scale-110 hover:shadow-emerald-300/40
                ${particle.isClicked ? 'bg-emerald-500/80 text-gray-900 font-semibold shadow-lg shadow-emerald-500/50 border-2 border-emerald-200' : 'bg-black/60 border border-emerald-400/50 shadow-md'}
              `}
              style={{ top: `calc(50% + ${y}px - 48px)`, left: `calc(50% + ${x}px - 48px)` }}
            >
              {particle.name}
            </div>
          );
        })}
      </div>

      {allClicked && (
        <button 
          onClick={handleComplete}
          className="mt-12 px-8 py-3 bg-yellow-400 text-gray-900 font-bold rounded-full shadow-lg shadow-yellow-400/30 hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 animate-fadeIn"
        >
          Complete the Ritual
        </button>
      )}

      {activeParticle && <Modal particle={activeParticle} onClose={handleCloseModal} />}
    </div>
  );
};

export default NucleusGame;
