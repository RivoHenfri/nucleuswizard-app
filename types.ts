export interface Trait {
  label: {
    en: string;
    id: string;
  };
  prompt: {
    en: string;
    id: string;
  };
}

// FIX: Added missing type definitions for Spell, WizardProfile, and Particle.
export interface Spell {
  title: string;
  question: string;
  purpose: string;
}

export interface WizardProfile {
  coreElement: {
    name: string;
    description: string;
  };
  guidingPrinciple: string;
  latentPower: string;
}

export interface Particle {
  id: number;
  name: string;
  prompt: string;
  isClicked: boolean;
}
