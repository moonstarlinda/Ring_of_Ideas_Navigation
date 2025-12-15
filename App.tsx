import React from 'react';
import ParticleBackground from './components/ParticleBackground';
import RingNavigation from './components/RingNavigation';

const App: React.FC = () => {
  return (
    <main className="relative w-full h-screen bg-[#0B0B15] text-white overflow-hidden">
        {/* Background Layer - Dark Violet Gradient */}
        <div className="absolute inset-0 z-0 pointer-events-none">
             <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B15] via-[#101020] to-[#05050a]"></div>
             {/* Central ambient glow */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-radial-gradient from-purple-900/10 to-transparent opacity-50"></div>
             <ParticleBackground />
        </div>
        
        {/* Header - Centered & Minimal */}
        <header className="absolute top-0 left-0 w-full pt-12 z-30 flex flex-col items-center justify-center pointer-events-none select-none">
            <h1 className="text-3xl md:text-4xl font-display font-normal tracking-[0.1em] text-white/90">
                Ring of Ideas
            </h1>
            <p className="mt-2 text-[10px] md:text-xs text-white/40 uppercase tracking-[0.2em]">
                Scroll or click to rotate
            </p>
        </header>

        {/* Main Content */}
        <RingNavigation />
    </main>
  );
};

export default App;