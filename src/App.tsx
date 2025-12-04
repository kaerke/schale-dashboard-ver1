
import React from 'react';
import { ClockWidget } from '@/components/ClockWidget';
import { WeatherWidget } from '@/components/WeatherWidget';
import { MusicWidget } from '@/components/MusicWidget';
import { ControlWidget } from '@/components/ControlWidget';
import { AronaAssistant } from '@/components/AronaAssistant';
import { DEFAULT_WALLPAPERS } from '@/constants';
import { useDashboardBackground } from '@/hooks/useDashboardBackground';
import { useDashboardIntro } from '@/hooks/useDashboardIntro';

const App: React.FC = () => {
  const {
    customBg,
    wallpaperIndex,
    loaded,
    handleBackgroundChange,
    handleResetBackground,
  } = useDashboardBackground();

  const {
    uiVisible,
    introActive,
    toggleUi,
    handleGlobalClick,
  } = useDashboardIntro();

  return (
    <main 
      onClick={handleGlobalClick}
      className={`relative w-screen h-[100dvh] overflow-hidden bg-gray-900 font-sans text-ba-dark selection:bg-ba-cyan/30 ${!uiVisible ? 'cursor-pointer' : ''}`}
    >
      
      {/* Background Layer Container */}
      <div 
        className={`absolute inset-0 z-0 transition-[opacity,transform,filter] duration-1000 ease-out will-change-[opacity,transform,filter] ${loaded ? 'opacity-100' : 'opacity-0'}`}
        style={{
          filter: uiVisible ? 'none' : 'brightness(0.9) blur(0px)',
          transform: uiVisible ? 'scale(1)' : 'scale(1.02)'
        }}
      >
        {/* Default Wallpapers - Rendered stacked for cross-fade */}
        {DEFAULT_WALLPAPERS.map((bgUrl, index) => (
          <div 
            key={`default-bg-${index}`}
            className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ease-in-out"
            style={{
              backgroundImage: `url(${bgUrl})`,
              opacity: (!customBg && wallpaperIndex === index) ? 1 : 0,
              zIndex: 0
            }}
          />
        ))}

        {/* Custom Wallpaper - Overlays defaults */}
        <div 
           className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ease-in-out"
           style={{
             backgroundImage: customBg ? `url(${customBg})` : 'none',
             opacity: customBg ? 1 : 0,
             zIndex: 1
           }}
        />

        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 pointer-events-none z-10" />
      </div>

      {/* Welcome Intro Overlay */}
      <div 
        className={`absolute inset-0 z-40 flex items-center justify-center pointer-events-none transition-[opacity,filter,transform] duration-700 will-change-[opacity,filter,transform] ${introActive ? 'opacity-100 blur-0' : 'opacity-0 blur-lg scale-110'}`}
      >
         <div className="flex flex-col items-center">
            <div className="flex items-center gap-4 mb-2 animate-fade-in-up">
                <div className="h-px w-16 bg-white/60"></div>
                <span className="text-ba-cyan font-bold tracking-[0.3em] text-sm drop-shadow-md">S.C.H.A.L.E</span>
                <div className="h-px w-16 bg-white/60"></div>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter drop-shadow-2xl animate-blur-in" style={{textShadow: '0 0.25rem 1.25rem rgba(0,174,225,0.5)'}}>
              WELCOME
            </h1>
            <div className="mt-4 text-white/80 font-mono text-sm tracking-widest animate-pulse-slow">
               CONNECTING TO SERVER...
            </div>
         </div>
      </div>

      {/* Top UI Container */}
      <div className={`absolute top-0 left-0 w-full p-4 sm:p-8 z-20 flex flex-wrap justify-between items-start gap-4 pointer-events-none transition-[opacity,transform] duration-700 will-change-[opacity,transform] ${uiVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
         <div className="pointer-events-auto">
            <ClockWidget />
         </div>
         <div className="pointer-events-auto flex flex-col gap-4 items-end">
            <WeatherWidget />
         </div>
      </div>

      {/* Bottom UI Container - Unified height alignment (bottom-4 or bottom-8) */}
      
      {/* Bottom Left: Music (Lower Z-Index than Arona to allow chat overlay) */}
      <div className={`absolute bottom-[5.5rem] left-4 xl:bottom-8 xl:left-8 z-40 pointer-events-auto transition-[opacity,transform] duration-700 delay-100 will-change-[opacity,transform] ${uiVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 pointer-events-none'}`}>
         <MusicWidget />
      </div>

      {/* Bottom Right: Controls (Mobile: Left aligned above Music, Desktop: Right aligned) */}
      <div className={`absolute bottom-[9rem] left-4 xl:bottom-8 xl:left-auto xl:right-8 z-30 pointer-events-auto transition-[opacity,transform] duration-700 delay-100 will-change-[opacity,transform] ${uiVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 xl:translate-x-10 pointer-events-none'}`}>
          <ControlWidget 
             onBackgroundChange={handleBackgroundChange} 
             onResetBackground={handleResetBackground}
             uiVisible={uiVisible}
             onToggleUi={toggleUi}
          />
      </div>

      {/* Bottom Center: Arona Assistant (Language Bar) - Constrained Width - Higher Z-Index */}
      <div className={`absolute bottom-4 left-4 right-4 xl:bottom-8 xl:left-1/2 xl:right-auto xl:transform xl:-translate-x-1/2 z-50 xl:w-full xl:max-w-lg pointer-events-none transition-[opacity,transform] duration-700 delay-200 will-change-[opacity,transform] ${uiVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
         <div className="pointer-events-auto w-full flex justify-center">
            <AronaAssistant />
         </div>
      </div>

      {/* Decoration Lines */}
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-ba-cyan to-transparent z-10 pointer-events-none transition-opacity duration-1000 ${uiVisible ? 'opacity-70' : 'opacity-0'}`} />
      <div className={`absolute bottom-0 right-0 w-2/3 h-1 bg-gradient-to-l from-ba-blue to-transparent z-10 pointer-events-none transition-opacity duration-1000 ${uiVisible ? 'opacity-70' : 'opacity-0'}`} />
    </main>
  );
};

export default App;
