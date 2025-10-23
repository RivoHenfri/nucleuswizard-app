// Enhanced Audio Utilities for NucleusWizard App

export interface AudioConfig {
  src: string;
  volume?: number;
  loop?: boolean;
  preload?: 'auto' | 'metadata' | 'none';
  priority?: 'high' | 'medium' | 'low';
}

export interface EnhancedSoundLibrary {
  // Core UI Sounds
  click: AudioConfig;
  hover: AudioConfig;
  focus: AudioConfig;
  
  // Magical Interactions
  spin: AudioConfig;
  reveal: AudioConfig;
  cast_spell: AudioConfig;
  magic_success: AudioConfig;
  
  // Feedback & Notifications
  copy_success: AudioConfig;
  share_success: AudioConfig;
  error: AudioConfig;
  warning: AudioConfig;
  
  // Transitions & Atmosphere
  page_transition: AudioConfig;
  modal_open: AudioConfig;
  modal_close: AudioConfig;
  whoosh: AudioConfig;
  
  // Background & Ambient
  background_enchanted: AudioConfig;
  ambient_magic: AudioConfig;
  ambient_forest: AudioConfig;
}

// Enhanced sound library with better organization and fallbacks
export const enhancedSoundLibrary: EnhancedSoundLibrary = {
  // Core UI Sounds
  click: {
    src: 'https://actions.google.com/sounds/v1/ui/ui_tap.ogg',
    volume: 60,
    priority: 'high'
  },
  hover: {
    src: 'https://actions.google.com/sounds/v1/ui/ui_button_hover.ogg',
    volume: 30,
    priority: 'medium'
  },
  focus: {
    src: 'https://actions.google.com/sounds/v1/ui/ui_focus.ogg',
    volume: 40,
    priority: 'medium'
  },
  
  // Magical Interactions
  spin: {
    src: 'https://actions.google.com/sounds/v1/magical/magic_wand_swoosh.ogg',
    volume: 70,
    priority: 'high'
  },
  reveal: {
    src: 'https://actions.google.com/sounds/v1/magical/magic_spell_charge_up.ogg',
    volume: 80,
    priority: 'high'
  },
  cast_spell: {
    src: 'https://actions.google.com/sounds/v1/magical/magic_spell_cast.ogg',
    volume: 75,
    priority: 'high'
  },
  magic_success: {
    src: 'https://actions.google.com/sounds/v1/magical/magic_spell_success.ogg',
    volume: 70,
    priority: 'high'
  },
  
  // Feedback & Notifications
  copy_success: {
    src: 'https://actions.google.com/sounds/v1/ui/ui_notification_active.ogg',
    volume: 65,
    priority: 'medium'
  },
  share_success: {
    src: 'https://actions.google.com/sounds/v1/ui/ui_notification_positive.ogg',
    volume: 65,
    priority: 'medium'
  },
  error: {
    src: 'https://actions.google.com/sounds/v1/ui/ui_notification_error.ogg',
    volume: 70,
    priority: 'high'
  },
  warning: {
    src: 'https://actions.google.com/sounds/v1/ui/ui_notification_warning.ogg',
    volume: 60,
    priority: 'medium'
  },
  
  // Transitions & Atmosphere
  page_transition: {
    src: 'https://actions.google.com/sounds/v1/ui/ui_transition_slide.ogg',
    volume: 50,
    priority: 'low'
  },
  modal_open: {
    src: 'https://actions.google.com/sounds/v1/ui/ui_pop_up.ogg',
    volume: 55,
    priority: 'medium'
  },
  modal_close: {
    src: 'https://actions.google.com/sounds/v1/ui/ui_pop_down.ogg',
    volume: 55,
    priority: 'medium'
  },
  whoosh: {
    src: 'https://actions.google.com/sounds/v1/ui/ui_whoosh.ogg',
    volume: 45,
    priority: 'low'
  },
  
  // Background & Ambient
  background_enchanted: {
    src: 'https://www.chosic.com/wp-content/uploads/2022/01/enchanted-valley-127769.mp3',
    volume: 25,
    loop: true,
    preload: 'auto',
    priority: 'high'
  },
  ambient_magic: {
    src: 'https://actions.google.com/sounds/v1/magical/magic_spell_ambient.ogg',
    volume: 20,
    loop: true,
    priority: 'medium'
  },
  ambient_forest: {
    src: 'https://www.chosic.com/wp-content/uploads/2022/05/forest-ambience-88199.mp3',
    volume: 15,
    loop: true,
    priority: 'low'
  }
};

export class AudioManager {
  private audioCache: Map<string, HTMLAudioElement> = new Map();
  private isInitialized = false;
  private masterVolume = 1.0;
  private sfxEnabled = true;
  private musicEnabled = true;

  constructor() {
    this.loadSettings();
  }

  private loadSettings() {
    this.masterVolume = parseFloat(localStorage.getItem('wizard-master-volume') || '1.0');
    this.sfxEnabled = localStorage.getItem('wizard-sfx-enabled') !== 'false';
    this.musicEnabled = localStorage.getItem('wizard-music-enabled') !== 'false';
  }

  public async initialize() {
    if (this.isInitialized) return;

    // Preload high-priority sounds
    const highPrioritySounds = Object.entries(enhancedSoundLibrary)
      .filter(([_, config]) => config.priority === 'high');

    await Promise.allSettled(
      highPrioritySounds.map(([name, config]) => this.preloadSound(name, config))
    );

    this.isInitialized = true;
  }

  private async preloadSound(name: string, config: AudioConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio(config.src);
      audio.preload = config.preload || 'auto';
      audio.volume = (config.volume || 50) / 100 * this.masterVolume;
      audio.loop = config.loop || false;

      audio.addEventListener('canplaythrough', () => {
        this.audioCache.set(name, audio);
        resolve();
      }, { once: true });

      audio.addEventListener('error', (e) => {
        console.warn(`Failed to preload audio "${name}":`, e);
        reject(e);
      }, { once: true });
    });
  }

  public playSound(soundName: string, options: { volume?: number; immediate?: boolean } = {}) {
    if (!this.sfxEnabled && !soundName.includes('background') && !soundName.includes('ambient')) {
      return;
    }

    const config = enhancedSoundLibrary[soundName as keyof EnhancedSoundLibrary];
    if (!config) {
      console.warn(`Sound "${soundName}" not found`);
      return;
    }

    let audio = this.audioCache.get(soundName);
    if (!audio) {
      // Lazy load if not preloaded
      audio = new Audio(config.src);
      audio.volume = (options.volume || config.volume || 50) / 100 * this.masterVolume;
      audio.loop = config.loop || false;
      this.audioCache.set(soundName, audio);
    }

    // Reset audio if already playing
    if (!audio.paused) {
      audio.pause();
    }
    audio.currentTime = 0;

    // Apply volume
    audio.volume = (options.volume || config.volume || 50) / 100 * this.masterVolume;

    // Play with error handling
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.warn(`Playback failed for "${soundName}":`, error.message);
      });
    }

    return audio;
  }

  public setMasterVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    localStorage.setItem('wizard-master-volume', this.masterVolume.toString());
    
    // Update all cached audio volumes
    this.audioCache.forEach(audio => {
      const originalVolume = audio.volume / this.masterVolume;
      audio.volume = originalVolume * this.masterVolume;
    });
  }

  public toggleSFX(enabled?: boolean) {
    this.sfxEnabled = enabled !== undefined ? enabled : !this.sfxEnabled;
    localStorage.setItem('wizard-sfx-enabled', this.sfxEnabled.toString());
    return this.sfxEnabled;
  }

  public toggleMusic(enabled?: boolean) {
    this.musicEnabled = enabled !== undefined ? enabled : !this.musicEnabled;
    localStorage.setItem('wizard-music-enabled', this.musicEnabled.toString());
    
    // Stop/start background music
    const bgAudio = this.audioCache.get('background_enchanted');
    if (bgAudio) {
      if (this.musicEnabled) {
        bgAudio.play().catch(console.warn);
      } else {
        bgAudio.pause();
      }
    }
    
    return this.musicEnabled;
  }

  public getSettings() {
    return {
      masterVolume: this.masterVolume,
      sfxEnabled: this.sfxEnabled,
      musicEnabled: this.musicEnabled
    };
  }

  public dispose() {
    this.audioCache.forEach(audio => {
      audio.pause();
      audio.src = '';
    });
    this.audioCache.clear();
    this.isInitialized = false;
  }
}

// Global audio manager instance
export const audioManager = new AudioManager();

// Helper hooks for React components
export const useAudioManager = () => {
  return {
    playSound: (soundName: string, options?: { volume?: number }) => 
      audioManager.playSound(soundName, options),
    setVolume: (volume: number) => audioManager.setMasterVolume(volume),
    toggleSFX: (enabled?: boolean) => audioManager.toggleSFX(enabled),
    toggleMusic: (enabled?: boolean) => audioManager.toggleMusic(enabled),
    getSettings: () => audioManager.getSettings()
  };
};