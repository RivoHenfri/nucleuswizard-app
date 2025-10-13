import React, { useState, useEffect } from 'react';
import IntegrityWheel from './components/Opening';
import Splash from './components/Splash';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Duration of the splash screen
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="relative min-h-screen w-full bg-cover bg-center bg-fixed p-4 md:p-8" style={{backgroundImage: "url('https://i.imgur.com/eBf7p3R.jpeg')"}}>
      <div className="starfield">
        <div className="stars stars-slow"></div>
        <div className="stars stars-medium"></div>
        <div className="stars stars-fast"></div>
      </div>
      <div className="absolute inset-0 bg-[#141A17]/70 backdrop-blur-sm"></div>
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen py-10">
        {isLoading ? <Splash /> : <IntegrityWheel />}
      </div>
    </main>
  );
};

export default App;