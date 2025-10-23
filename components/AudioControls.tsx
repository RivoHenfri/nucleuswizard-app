import React, { useState, useEffect } from 'react';

interface AudioControlsProps {
  backgroundAudioRef: React.MutableRefObject<HTMLAudioElement | null>;
}

const AudioControls: React.FC<AudioControlsProps> = ({ backgroundAudioRef }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(25);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Load audio preferences from localStorage
    const savedMuted = localStorage.getItem('wizard-audio-muted') === 'true';
    const savedVolume = parseInt(localStorage.getItem('wizard-audio-volume') || '25');
    
    setIsMuted(savedMuted);
    setVolume(savedVolume);
    
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.volume = savedMuted ? 0 : savedVolume / 100;
    }
  }, [backgroundAudioRef]);

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    localStorage.setItem('wizard-audio-muted', newMutedState.toString());
    
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.volume = newMutedState ? 0 : volume / 100;
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    localStorage.setItem('wizard-audio-volume', newVolume.toString());
    
    if (backgroundAudioRef.current && !isMuted) {
      backgroundAudioRef.current.volume = newVolume / 100;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      {/* Compact Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-12 h-12 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center border border-yellow-400/30 transition-all duration-300"
        title="Audio Controls"
      >
        <span className="text-yellow-400 text-lg">
          {isMuted ? '🔇' : '🎵'}
        </span>
      </button>

      {/* Expanded Controls */}
      {isExpanded && (
        <div className="absolute top-14 right-0 bg-black/90 backdrop-blur-sm border border-yellow-400/30 rounded-lg p-4 min-w-48 animate-fadeIn">
          <h3 className="text-yellow-300 font-semibold mb-3 text-sm">Audio Settings</h3>
          
          {/* Mute Toggle */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-300 text-sm">Background Music</span>
            <button
              onClick={toggleMute}
              className={`w-10 h-6 rounded-full transition-all duration-300 ${
                isMuted ? 'bg-gray-600' : 'bg-emerald-500'
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                  isMuted ? 'translate-x-1' : 'translate-x-5'
                }`}
              />
            </button>
          </div>

          {/* Volume Slider */}
          <div className="mb-3">
            <label className="text-gray-300 text-sm block mb-2">
              Volume: {volume}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
              disabled={isMuted}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
              style={{
                background: `linear-gradient(to right, #10b981 0%, #10b981 ${volume}%, #374151 ${volume}%, #374151 100%)`
              }}
            />
          </div>

          {/* Sound Effects Toggle */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-300">Sound Effects</span>
            <span className="text-emerald-400">ON</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioControls;