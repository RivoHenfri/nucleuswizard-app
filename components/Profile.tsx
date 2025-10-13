
import React from 'react';
import type { WizardProfile } from '../types';

interface ProfileProps {
  profileData: WizardProfile;
  onComplete: () => void;
}

const Profile: React.FC<ProfileProps> = ({ profileData, onComplete }) => {
  const { coreElement, guidingPrinciple, latentPower } = profileData;

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto animate-fadeIn">
      <h2 className="font-cinzel text-3xl md:text-4xl font-bold text-yellow-200 mb-4">Your Inner Wizard Profile</h2>
      <p className="text-center text-gray-300 mb-8 max-w-2xl">The oracle has spoken. This is the essence of the magic you hold within.</p>
      
      <div className="w-full space-y-6">
        <div className="bg-black/60 border-2 border-yellow-400/50 rounded-xl p-8 shadow-2xl shadow-yellow-500/20 text-center">
            <h3 className="font-cinzel text-2xl font-bold text-yellow-300 mb-2 tracking-wider">Core Element: {coreElement.name}</h3>
            <p className="text-yellow-100/80 italic">{coreElement.description}</p>
        </div>
        
        <div className="bg-black/50 border border-emerald-400/30 rounded-lg p-6 shadow-xl shadow-emerald-500/10">
            <h3 className="font-cinzel text-xl font-bold text-emerald-300 mb-3 tracking-wider">Your Guiding Principle</h3>
            <p className="text-gray-300 leading-relaxed">{guidingPrinciple}</p>
        </div>
        
        <div className="bg-black/50 border border-emerald-400/30 rounded-lg p-6 shadow-xl shadow-emerald-500/10">
            <h3 className="font-cinzel text-xl font-bold text-emerald-300 mb-3 tracking-wider">Your Latent Power</h3>
            <p className="text-gray-300 leading-relaxed">{latentPower}</p>
        </div>
      </div>

      <button 
        onClick={onComplete}
        className="mt-10 px-8 py-3 bg-emerald-500 text-gray-900 font-bold rounded-full shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-500/50"
      >
        Awaken the Nucleus
      </button>
    </div>
  );
};

export default Profile;