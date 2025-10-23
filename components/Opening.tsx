
import React, { useState, useRef, useEffect } from 'react';
import type { Trait } from '../types';

type Language = 'en' | 'id';
type GameScreen = 'language' | 'landing' | 'spinning' | 'form';

interface IntegrityWheelProps {
  backgroundAudioRef: React.MutableRefObject<HTMLAudioElement | null>;
}

const traits: Trait[] = [
  { label: { en: 'Independent', id: 'Independent' }, prompt: { en: 'How do you make decisions that honor your values, even without external validation?', id: 'Bagaimana Anda membuat keputusan yang menghormati nilai-nilai Anda, bahkan tanpa validasi eksternal?' } },
  { label: { en: 'Natural', id: 'Natural' }, prompt: { en: 'When do you feel most authentic and aligned at work?', id: 'Kapan Anda merasa paling otentik dan selaras di tempat kerja?' } },
  { label: { en: 'Trusty', id: 'Trusty' }, prompt: { en: 'How do you earn trust from your team, even in small actions?', id: 'Bagaimana Anda mendapatkan kepercayaan dari tim Anda, bahkan dalam tindakan kecil?' } },
  { label: { en: 'Equitable', id: 'Equitable' }, prompt: { en: 'How do you ensure fairness in your interactions?', id: 'Bagaimana Anda memastikan keadilan dalam interaksi Anda?' } },
  { label: { en: 'Genuine', id: 'Genuine' }, prompt: { en: 'What does being genuine mean to you in a professional setting?', id: 'Apa arti menjadi tulus bagi Anda dalam lingkungan profesional?' } },
  { label: { en: 'Reliable', id: 'Reliable' }, prompt: { en: 'How do you show up consistently, even in small things?', id: 'Bagaimana Anda menunjukkan konsistensi, bahkan dalam hal-hal kecil?' } },
  { label: { en: 'Incorruptible', id: 'Incorruptible' }, prompt: { en: 'When values are tested, what helps you stay true?', id: 'Ketika nilai-nilai diuji, apa yang membantu Anda tetap teguh?' } },
  { label: { en: 'Truthful', id: 'Truthful' }, prompt: { en: 'How do you practice transparency with your team?', id: 'Bagaimana Anda mempraktikkan transparansi dengan tim Anda?' } },
  { label: { en: 'You', id: 'You' }, prompt: { en: 'What unique quality do you bring to the team’s integrity?', id: 'Kualitas unik apa yang Anda bawa pada integritas tim?' } },
];

const uiText = {
  chooseLanguage: { en: 'Choose Language', id: 'Pilih Bahasa' },
  welcome: { en: 'Welcome, Earth Wizard.', id: 'Selamat Datang, Penyihir Bumi.' },
  instruction: { en: 'Spin the nucleus and awaken your Integrity spell.', id: 'Putar nukleus dan bangkitkan mantra Integritasmu.' },
  spinButton: { en: 'Spin the Nucleus', id: 'Putar Nukleus' },
  landedOn: { en: 'You Landed On:', id: 'Kamu Mendapat:' },
  modalButton: { en: 'Cast My Spell ✨', id: 'Ucapkan Mantraku ✨' },
  yourName: { en: 'Your Name', id: 'Namamu' },
  yourNamePlaceholder: { en: 'e.g., Tole', id: 'contoh: Tole' },
  castSpell: { en: '"I cast the Spell of Integrity by..."', id: '"Aku mengucapkan Mantra Integritas dengan..."' },
  castSpellPlaceholder: { en: 'e.g., always giving honest feedback...', id: 'contoh: dengan selalu memberi masukan jujur...' },
  tagWizards: { en: 'Tag Your Fellow Wizards (optional)', id: 'Tandai Rekan Penyihirmu (opsional)' },
  tagPlaceholder: { en: 'e.g. Tag your Nucleus teammates to cast their spell ✨', id: 'contoh: Tandai rekan tim Nucleus-mu untuk mengucapkan mantra mereka ✨' },
  shareWhatsApp: { en: 'Share to WhatsApp', id: 'Bagikan ke WhatsApp' },
  generateLink: { en: 'Generate Shareable Link', id: 'Buat Tautan' },
  linkCopied: { en: 'Link Copied!', id: 'Tautan Disalin!' },
  shareCastingLine: { en: '✨ {name} casts the Spell of Integrity by...', id: '✨ {name} mengucapkan Mantra Integritas dengan...' },
  shareNextTurn: { en: '🪄 Next to spin the Wheel of Integrity is {tags}!', id: '🪄 Giliran selanjutnya memutar Roda Integritas adalah {tags}!' },
  shareTeamTurn: { en: '🪄 Now it\'s @TeamNucleus\'s turn to spin the Wheel of Integrity!', id: '🪄 Sekarang giliran @TimNucleus untuk memutar Roda Integritas!' },
  shareCallToAction: { en: 'Unleash your element and spin your magic earth 🌍', id: 'Bebaskan elemenmu dan putar sihir bumimu 🌍' },
  shareLinkPrefix: { en: '👉', id: '👉' },
  shareInstruction: { en: 'Click "Share to WhatsApp" to tag your fellow wizards in the Nucleus group and continue the chain message! Note: The @tag is for our internal game and won\'t automatically tag users in WhatsApp.', id: 'Klik "Bagikan ke WhatsApp" untuk menandai rekan penyihirmu di grup Nucleus dan melanjutkan pesan berantai! Catatan: Tanda @ adalah untuk permainan internal kita dan tidak akan secara otomatis menandai pengguna di WhatsApp.' },
  signature: { en: 'RR Nucleus', id: 'RR Nucleus' },
};

// Most reliable audio sources using Web Audio API for simple sounds
const createSimpleBeep = (frequency: number, duration: number, volume: number = 0.3) => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  } catch (error) {
    console.warn('Audio API not supported:', error);
  }
};

// Fallback to reliable external audio sources
const sounds = {
  click: 'https://www.soundjay.com/misc/beep-07a.wav',
  hover: 'https://www.soundjay.com/misc/beep-08a.wav', 
  spin: 'https://www.soundjay.com/misc/whoosh-10.wav',
  reveal: 'https://www.soundjay.com/misc/magic-chime-02.wav',
  success: 'https://www.soundjay.com/misc/ding-idea-40142.wav',
  copy: 'https://www.soundjay.com/misc/beep-28.wav',
  close: 'https://www.soundjay.com/misc/click-02.wav',
  transition: 'https://www.soundjay.com/misc/swoosh-06.wav'
};

// Enhanced audio player with Web Audio API fallback
const audioCache: { [src: string]: HTMLAudioElement } = {};

const playSound = (soundName: string, volume = 0.6) => {
  try {
    // For simple sounds, use Web Audio API for better reliability
    if (soundName === 'click') {
      createSimpleBeep(800, 0.1, volume);
      return;
    } else if (soundName === 'hover') {
      createSimpleBeep(600, 0.08, volume * 0.5);
      return;
    } else if (soundName === 'copy') {
      createSimpleBeep(1000, 0.15, volume);
      return;
    }
    
    // For other sounds, try external URLs with fallback
    const src = sounds[soundName as keyof typeof sounds];
    if (!src) {
      console.warn(`Sound "${soundName}" not found`);
      return;
    }
    
    let audio = audioCache[src];
    if (!audio) {
      audio = new Audio(src);
      audio.preload = 'auto';
      audio.crossOrigin = 'anonymous'; // Help with CORS
      audioCache[src] = audio;
    }
    
    // Reset and play
    audio.currentTime = 0;
    audio.volume = volume;
    
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.warn(`Audio playback failed for "${soundName}":`, error.message);
        // Fallback to beep for failed external sounds
        if (soundName === 'spin') createSimpleBeep(400, 0.3, volume);
        else if (soundName === 'reveal') createSimpleBeep(1200, 0.5, volume);
        else if (soundName === 'success') createSimpleBeep(880, 0.4, volume);
        else createSimpleBeep(500, 0.1, volume);
      });
    }
    return audio;
  } catch (error) {
    console.error(`Audio error for "${soundName}":`, error);
    // Final fallback to simple beep
    createSimpleBeep(600, 0.1, volume);
    return null;
  }
};

const IntegrityWheel: React.FC<IntegrityWheelProps> = ({ backgroundAudioRef }) => {
  const [lang, setLang] = useState<Language | null>(null);
  const [screen, setScreen] = useState<GameScreen>('language');
  const [selectedTrait, setSelectedTrait] = useState<Trait | null>(null);
  const [name, setName] = useState('');
  const [spell, setSpell] = useState('');
  const [tags, setTags] = useState('');
  const [spinDuration, setSpinDuration] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copyButtonText, setCopyButtonText] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  const wheelRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const selectLanguage = (selectedLang: Language) => {
    playSound('click');
    playSound('transition');
    setLang(selectedLang);
    setCopyButtonText(uiText.generateLink[selectedLang]);
    setScreen('landing');
  };

  const handleSpin = () => {
    playSound('click');
    playSound('spin');

    if (backgroundAudioRef.current) backgroundAudioRef.current.volume = 0.08;
    
    const newRotation = rotation + 360 * 5 + Math.random() * 360;
    const duration = 5000; // 5 seconds
    setRotation(newRotation);
    setSpinDuration(duration);
    setScreen('spinning');

    setTimeout(() => {
      if (backgroundAudioRef.current) backgroundAudioRef.current.volume = 0.25;
      playSound('reveal');

      const finalAngle = newRotation % 360;
      const segmentAngle = 360 / traits.length;
      const landedIndex = Math.round(((360 - finalAngle) % 360) / segmentAngle) % traits.length;
      const landedTrait = traits[landedIndex];
      setSelectedTrait(landedTrait);
      setIsModalOpen(true);
    }, duration);
  };

  const closeModal = () => {
    playSound('close');
    playSound('transition');
    setIsModalOpen(false);
    setScreen('form');
  };

  const getShareMessage = () => {
    if (!lang) return '';
    
    const wizardName = name.trim() || 'A Wizard';
    const taggedWizards = tags.trim() ? `@${tags.replace(/, ?/g, ', @')}` : '';

    let nextTurnLine = '';
    if (taggedWizards) {
      nextTurnLine = uiText.shareNextTurn[lang].replace('{tags}', taggedWizards);
    } else {
      nextTurnLine = uiText.shareTeamTurn[lang];
    }
    
    const introQuestion = traits[traits.length - 1].prompt[lang];
    
    const castingLine = uiText.shareCastingLine[lang].replace('{name}', `*${wizardName}*`);

    return encodeURIComponent(
      `${introQuestion}\n\n` +
      `${castingLine}\n` +
      `"${spell.trim()}"\n\n` +
      `${nextTurnLine}\n` +
      `${uiText.shareCallToAction[lang]}\n` +
      `${uiText.shareLinkPrefix[lang]} https://rivohenfri.github.io/nucleuswizard-app/`
    );
  };
  
  const handleCopyToClipboard = () => {
    if (!lang) return;
    playSound('copy');
    navigator.clipboard.writeText(decodeURIComponent(getShareMessage()));
    setCopyButtonText(uiText.linkCopied[lang]);
    setTimeout(() => setCopyButtonText(uiText.generateLink[lang]), 2000);
  };

  if (!lang) {
    return (
      <div className="text-center animate-fadeIn flex flex-col items-center">
         <h1 className="font-cinzel text-3xl md:text-5xl font-bold text-yellow-200 mb-8">{uiText.chooseLanguage.en}</h1>
         <h2 className="font-cinzel text-2xl md:text-4xl font-bold text-yellow-200/80 mb-12">{uiText.chooseLanguage.id}</h2>
         <div className="flex gap-6">
            <button 
              onClick={() => selectLanguage('en')} 
              onMouseEnter={() => playSound('hover')}
              className="px-10 py-4 bg-emerald-600 text-gray-100 font-bold text-lg rounded-full shadow-lg shadow-emerald-600/30 hover:bg-emerald-500 transition-all duration-300 transform hover:scale-105"
            >
              EN
            </button>
            <button 
              onClick={() => selectLanguage('id')} 
              onMouseEnter={() => playSound('hover')}
              className="px-10 py-4 bg-yellow-400 text-gray-900 font-bold text-lg rounded-full shadow-lg shadow-yellow-400/30 hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105"
            >
              ID
            </button>
         </div>
      </div>
    );
  }

  if (screen === 'landing' || screen === 'spinning') {
    return (
        <div className="flex flex-col items-center text-center">
          <h1 className="font-cinzel text-4xl md:text-6xl font-bold text-yellow-200 mb-4">{uiText.welcome[lang]}</h1>
          <p className="text-xl md:text-2xl text-emerald-200 mb-12 max-w-3xl">{uiText.instruction[lang]}</p>
          <div className="relative w-80 h-80 md:w-96 md:h-96 mb-12 flex items-center justify-center">
            <div 
              ref={wheelRef}
              className="absolute w-full h-full"
              style={{
                transition: `transform ${spinDuration}ms cubic-bezier(0.25, 1, 0.5, 1)`,
                transform: `rotate(${rotation}deg)`,
              }}
            >
              {traits.map((trait, index) => {
                const angle = (index / traits.length) * 2 * Math.PI - (Math.PI / 2); // Start trait 0 at top
                const radius = isMobile ? 110 : 140;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                
                return (
                  <div 
                    key={index} 
                    className="absolute w-24 h-24 flex items-center justify-center text-center p-1 rounded-full bg-black/60 border border-amber-400/50 shadow-lg text-amber-200"
                    style={{ 
                      top: `calc(50% + ${y}px - 48px)`, 
                      left: `calc(50% + ${x}px - 48px)`,
                    }}
                  >
                    <span
                      className="font-cinzel font-bold text-sm"
                      style={{
                        transform: `rotate(${-rotation}deg)`,
                        transition: `transform ${spinDuration}ms cubic-bezier(0.25, 1, 0.5, 1)`,
                        display: 'inline-block'
                      }}
                    >
                      {trait.label[lang]}
                    </span>
                  </div>
                );
              })}
            </div>
             {/* Central Nucleus */}
            <div className={`absolute w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-yellow-400/30 to-yellow-500/50 
              flex items-center justify-center text-center font-cinzel font-bold text-yellow-100 text-xl md:text-2xl
              shadow-2xl shadow-yellow-400/20 animate-pulse-glow`}>
              Integrity
            </div>
            <div className="absolute w-4 h-8 bg-yellow-300 -top-2 rounded-b-full shadow-lg"></div>
          </div>
          <button
            onClick={handleSpin}
            onMouseEnter={() => playSound('hover')}
            disabled={screen === 'spinning'}
            className="px-12 py-4 min-w-64 bg-emerald-600 text-gray-100 font-bold text-lg rounded-full hover:bg-emerald-500 transition-all duration-300 transform hover:scale-110 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:animate-none animate-pulse-button"
          >
            {uiText.spinButton[lang]}
          </button>
          {isModalOpen && selectedTrait && (
             <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fadeIn" onClick={closeModal}>
                <div className="bg-[#1a1a2e] border border-yellow-400/50 rounded-xl shadow-2xl shadow-yellow-500/20 max-w-md w-full m-4 p-8 text-center" onClick={e => e.stopPropagation()}>
                <h3 className="font-cinzel text-2xl font-bold text-yellow-300 mb-4">{selectedTrait.label[lang]}</h3>
                <p className="text-gray-300 text-lg">{selectedTrait.prompt[lang]}</p>
                <button 
                  onClick={closeModal} 
                  onMouseEnter={() => playSound('hover')}
                  className="mt-8 px-8 py-3 bg-amber-500 text-gray-900 font-bold rounded-full shadow-lg hover:bg-amber-400 transition-all duration-300 transform hover:scale-105"
                >
                    {uiText.modalButton[lang]}
                </button>
                </div>
            </div>
          )}
        </div>
    );
  }
  
  if (screen === 'form' && selectedTrait) {
     return (
        <div className="w-full max-w-lg animate-fadeIn text-center">
             <h1 className="font-cinzel text-2xl md:text-3xl font-bold text-yellow-200 mb-2">{uiText.landedOn[lang]} {selectedTrait.label[lang].toUpperCase()}</h1>
             <p className="text-emerald-200 italic mb-8">"{selectedTrait.prompt[lang]}"</p>

            <div className="space-y-6 text-left">
                <div>
                    <label className="block text-yellow-300 mb-1 pl-4">{uiText.yourName[lang]}</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={uiText.yourNamePlaceholder[lang]} className="w-full bg-black/50 border border-gray-600 rounded-full p-3 px-5 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 outline-none transition" />
                </div>
                 <div>
                    <label className="block text-yellow-300 mb-1 pl-4">{uiText.castSpell[lang]}</label>
                    <textarea value={spell} onChange={(e) => setSpell(e.target.value)} rows={3} placeholder={uiText.castSpellPlaceholder[lang]} className="w-full bg-black/50 border border-gray-600 rounded-2xl p-3 px-5 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 outline-none transition resize-none"></textarea>
                </div>
                 <div>
                    <label className="block text-yellow-300 mb-1 pl-4">{uiText.tagWizards[lang]}</label>
                    <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder={uiText.tagPlaceholder[lang]} className="w-full bg-black/50 border border-gray-600 rounded-full p-3 px-5 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 outline-none transition" />
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
                 <a 
                   href={`https://api.whatsapp.com/send?text=${getShareMessage()}`} 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="flex-1 text-center px-6 py-3 bg-green-500 text-white font-bold rounded-full shadow-lg shadow-green-500/30 hover:bg-green-400 transition-all duration-300 transform hover:scale-105" 
                   onClick={() => playSound('click')}
                   onMouseEnter={() => playSound('hover')}
                 >
                    {uiText.shareWhatsApp[lang]} 🔮
                </a>
                <button 
                  onClick={handleCopyToClipboard} 
                  onMouseEnter={() => playSound('hover')}
                  className="flex-1 px-6 py-3 bg-emerald-600 text-white font-bold rounded-full shadow-lg shadow-emerald-600/30 hover:bg-emerald-500 transition-all duration-300 transform hover:scale-105"
                >
                    {copyButtonText} ✨
                </button>
            </div>

            <div className="mt-8 text-center text-sm text-gray-400 px-4">
                <p>{uiText.shareInstruction[lang]}</p>
                <p className="mt-2 font-semibold">{uiText.signature[lang]}</p>
            </div>
        </div>
     )
  }

  return <div>Loading...</div>;
};

export default IntegrityWheel;
