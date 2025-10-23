import React, { createContext, useContext, useRef, useState, useEffect } from 'react';

interface AudioContextType {
  playSound: (soundName: string, options?: { volume?: number; loop?: boolean }) => void;
  setBackgroundMusic: (enabled: boolean) => void;
  setMasterVolume: (volume: number) => void;
  isMuted: boolean;
  masterVolume: number;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return context;
};

// Enhanced sound library with better wizard-themed sounds
const enhancedSounds = {
  // UI Interactions
  click: 'https://actions.google.com/sounds/v1/ui/ui_tap.ogg',
  hover: 'https://actions.google.com/sounds/v1/ui/ui_button_hover.ogg',
  
  // Magical Actions
  spin: 'https://actions.google.com/sounds/v1/magical/magic_wand_swoosh.ogg',
  reveal: 'https://actions.google.com/sounds/v1/magical/magic_spell_charge_up.ogg',
  success: 'https://actions.google.com/sounds/v1/magical/magic_spell_cast.ogg',
  
  // Feedback Sounds
  copy: 'https://actions.google.com/sounds/v1/ui/ui_notification_active.ogg',
  close: 'https://actions.google.com/sounds/v1/ui/ui_pop_down.ogg',
  error: 'https://actions.google.com/sounds/v1/ui/ui_notification_error.ogg',
  
  // Transition Sounds
  transition: 'https://actions.google.com/sounds/v1/ui/ui_transition_slide.ogg',
  whoosh: 'https://actions.google.com/sounds/v1/ui/ui_whoosh.ogg',
  
  // Ambient
  ambient_magic: 'https://actions.google.com/sounds/v1/magical/magic_spell_ambient.ogg'
};

interface AudioProviderProps {
  children: React.ReactNode;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [masterVolume, setMasterVolumeState] = useState(25);
  const [soundEffectsEnabled, setSoundEffectsEnabled] = useState(true);
  
  const backgroundAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioCache = useRef<{ [key: string]: HTMLAudioElement }>({});

  // Load preferences from localStorage
  useEffect(() => {
    const savedMuted = localStorage.getItem('wizard-audio-muted') === 'true';
    const savedVolume = parseInt(localStorage.getItem('wizard-audio-volume') || '25');
    const savedSFX = localStorage.getItem('wizard-sfx-enabled') !== 'false';
    
    setIsMuted(savedMuted);
    setMasterVolumeState(savedVolume);
    setSoundEffectsEnabled(savedSFX);
  }, []);

  // Initialize background music
  useEffect(() => {
    const bgAudio = new Audio('https://www.chosic.com/wp-content/uploads/2022/01/enchanted-valley-127769.mp3');
    bgAudio.loop = true;
    bgAudio.volume = (masterVolume / 100) * (isMuted ? 0 : 1);
    bgAudio.preload = 'auto';
    backgroundAudioRef.current = bgAudio;

    return () => {
      if (bgAudio) bgAudio.pause();
    };
  }, []);

  // Update background volume when settings change
  useEffect(() => {
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.volume = (masterVolume / 100) * (isMuted ? 0 : 1);
    }
  }, [masterVolume, isMuted]);

  const playSound = (soundName: string, options: { volume?: number; loop?: boolean } = {}) => {
    if (!soundEffectsEnabled || isMuted) return;

    try {
      const soundUrl = enhancedSounds[soundName as keyof typeof enhancedSounds];
      if (!soundUrl) {
        console.warn(`Sound "${soundName}" not found in sound library`);
        return;
      }

      let audio = audioCache.current[soundUrl];
      if (!audio) {
        audio = new Audio(soundUrl);
        audio.preload = 'auto';
        audioCache.current[soundUrl] = audio;
      }

      // Reset and configure audio
      if (!audio.paused) {
        audio.pause();
      }
      audio.currentTime = 0;
      audio.loop = options.loop || false;
      audio.volume = ((options.volume || 50) / 100) * (masterVolume / 100);

      // Play with error handling
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn(`Audio playback failed for "${soundName}":`, error.message);
        });
      }
    } catch (error) {
      console.error(`Error playing sound "${soundName}":`, error);
    }
  };

  const setBackgroundMusic = (enabled: boolean) => {
    if (!backgroundAudioRef.current) return;

    if (enabled && !isMuted) {
      backgroundAudioRef.current.play().catch(error => {
        console.warn('Background music playback failed:', error);
      });
    } else {
      backgroundAudioRef.current.pause();
    }
  };

  const setMasterVolume = (volume: number) => {
    setMasterVolumeState(volume);
    localStorage.setItem('wizard-audio-volume', volume.toString());
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    localStorage.setItem('wizard-audio-muted', newMuted.toString());
  };

  const toggleSoundEffects = () => {
    const newEnabled = !soundEffectsEnabled;
    setSoundEffectsEnabled(newEnabled);
    localStorage.setItem('wizard-sfx-enabled', newEnabled.toString());
  };

  const contextValue: AudioContextType = {
    playSound,
    setBackgroundMusic,
    setMasterVolume,
    isMuted,
    masterVolume
  };

  return (
    <AudioContext.Provider value={contextValue}>
      {children}
    </AudioContext.Provider>
  );
};

export default AudioProvider;