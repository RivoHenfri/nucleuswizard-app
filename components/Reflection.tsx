
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import type { Spell, WizardProfile } from '../types';

interface ReflectionProps {
  onComplete: (profile: WizardProfile) => void;
}

const spells: Spell[] = [
  {
    title: 'Spell of Self',
    question: 'When was the last time you acted on what’s right, even when no one noticed?',
    purpose: 'Builds awareness of intrinsic motivation.',
  },
  {
    title: 'Spell of Balance',
    question: 'In your daily work, what keeps you steady when things feel uncertain?',
    purpose: 'Surfaces internal anchors and calm presence.',
  },
  {
    title: 'Spell of Energy',
    question: 'How do your values show up in small actions — not just big moments?',
    purpose: 'Connects micro-behaviors to culture.',
  },
  {
    title: 'Spell of Truth',
    question: 'If integrity is energy, where does yours leak or get blocked?',
    purpose: 'Encourages honest introspection.',
  },
  {
    title: 'Spell of You',
    question: 'What ‘unique magic’ do you bring that strengthens the team’s trust?',
    purpose: 'Ends with empowerment and ownership.',
  },
];

// --- Audio Assets ---
const sounds = {
  submit: 'https://cdn.pixabay.com/audio/2022/10/18/audio_216209b2e5.mp3',
};

// --- Audio Player Utility ---
const playSound = (src: string, loop = false) => {
  try {
    const audio = new Audio(src);
    audio.loop = loop;
    audio.play().catch(error => console.log("Audio playback was interrupted.", error));
    return audio;
  } catch (error) {
    console.error("Could not play audio:", error);
    return null;
  }
};


const Reflection: React.FC<ReflectionProps> = ({ onComplete }) => {
  const [answers, setAnswers] = useState<string[]>(Array(spells.length).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    playSound(sounds.submit);
    setIsLoading(true);
    setError(null);
    
    const filledAnswers = answers.map((answer, index) => ({
      question: spells[index].question,
      answer: answer
    })).filter(a => a.answer.trim() !== '');

    if (filledAnswers.length < 3) {
      setError("Please reflect on at least 3 spells to awaken your inner wizard.");
      setIsLoading(false);
      return;
    }

    const prompt = `
      You are a wise, mystical mentor. Based on the following reflections about leadership and integrity, create a personalized "Inner Wizard Profile".
      The tone should be empowering, insightful, and magical.
      
      User's Reflections:
      ${filledAnswers.map(a => `Q: ${a.question}\nA: ${a.answer}`).join('\n\n')}

      Generate a profile with these exact JSON keys: "coreElement" (with "name" and "description"), "guidingPrinciple", and "latentPower".
      - The "coreElement" name should be a classical element (e.g., Earth, Aether, Crystal, Shadow, Starlight) that symbolizes their leadership foundation. The description should explain why.
      - The "guidingPrinciple" is a short, powerful summary of their leadership philosophy based on their answers.
      - The "latentPower" is a potential strength they can cultivate, framed as a magical ability.
    `;

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const responseSchema = {
        type: Type.OBJECT,
        properties: {
            coreElement: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: 'The name of the core element.' },
                    description: { type: Type.STRING, description: 'A description of why this is their element.' },
                },
                required: ['name', 'description']
            },
            guidingPrinciple: { type: Type.STRING, description: 'A summary of their leadership style.' },
            latentPower: { type: Type.STRING, description: 'A potential strength to develop.' },
        },
        required: ['coreElement', 'guidingPrinciple', 'latentPower']
      };

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema,
        },
      });

      const profileData = JSON.parse(response.text);
      onComplete(profileData);

    } catch (e) {
      console.error(e);
      setError("The arcane energies are disturbed. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const canSubmit = answers.filter(a => a.trim().length > 0).length >= 3;

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto animate-fadeIn">
      <h2 className="font-cinzel text-3xl md:text-4xl font-bold text-emerald-200 mb-2">Cast Your Spells</h2>
      <p className="text-center text-gray-300 mb-8 max-w-3xl">Reflect on the following incantations. Your answers will reveal the nature of your inner wizard. Answer at least three to proceed.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-8">
        {spells.map((spell, index) => (
          <div 
            key={spell.title} 
            className="bg-black/50 border border-amber-400/30 rounded-lg p-6 shadow-xl shadow-amber-500/10 flex flex-col"
          >
            <h3 className="font-cinzel text-xl font-bold text-yellow-300 mb-2">{spell.title}</h3>
            <p className="text-gray-300 mb-3">{spell.question}</p>
            <textarea 
              value={answers[index]}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              rows={4}
              className="w-full bg-gray-900/50 border border-gray-600 rounded-md p-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition mt-auto"
              placeholder="Your reflection..."
              aria-label={`Reflection for ${spell.title}`}
            />
          </div>
        ))}
      </div>
      {error && <p className="text-red-400 mb-4" role="alert">{error}</p>}
      <button 
        onClick={handleSubmit}
        disabled={isLoading || !canSubmit}
        className="px-8 py-3 bg-emerald-500 text-gray-900 font-bold rounded-full shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 disabled:bg-gray-600 disabled:shadow-none disabled:cursor-not-allowed disabled:scale-100"
      >
        {isLoading ? 'Consulting the Oracle...' : 'Reveal My Inner Wizard'}
      </button>
    </div>
  );
};

export default Reflection;