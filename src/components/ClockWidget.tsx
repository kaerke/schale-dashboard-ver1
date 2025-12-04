
import React, { useState, useEffect } from 'react';
import { GlassCard } from '@/components/GlassCard';

export const ClockWidget: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' });
  };

  return (
    <div className="animate-fade-in-up">
      <div className="flex flex-col items-start group select-none hover:scale-[1.02] transition-transform duration-300">
        {/* Decorative Label */}
        <div className="bg-ba-dark text-white text-xs font-bold px-3 py-0.5 rounded-t-md ml-1 transform skew-x-[-10deg] inline-block shadow-md">
          <span className="block transform skew-x-[10deg] tracking-widest">SYSTEM TIME</span>
        </div>
        
        <GlassCard className="px-6 py-3 min-w-[16.25rem] flex items-center justify-between relative overflow-hidden border-l-4 border-l-ba-cyan !bg-white/40 !hover:bg-white/60 backdrop-blur-md transition-all duration-300">
          
          <div className="flex flex-col z-10">
            <div className="flex items-baseline text-ba-dark leading-none">
              <span className="text-6xl font-black tracking-tighter font-sans">{hours}</span>
              <span className="text-4xl font-bold text-ba-blue mx-1 animate-pulse">:</span>
              <span className="text-6xl font-black tracking-tighter font-sans">{minutes}</span>
              <span className="text-xl font-bold text-ba-gray ml-2 w-[1.625rem]">{seconds}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="h-px flex-1 bg-ba-gray/30"></div>
              <span className="text-ba-gray font-bold text-sm tracking-wide uppercase">
                  {formatDate(time)}
              </span>
            </div>
          </div>

          {/* Decorative Elements with Floating Animation */}
          <div className="absolute top-[-0.625rem] right-[-0.625rem] w-20 h-20 rounded-full border-[0.375rem] border-ba-cyan/10 animate-float"></div>
          <div className="absolute bottom-[-0.9375rem] right-[1.25rem] w-12 h-12 rounded-full border-4 border-ba-blue/10 animate-float" style={{ animationDelay: '1.5s' }}></div>
        </GlassCard>
      </div>
    </div>
  );
};
