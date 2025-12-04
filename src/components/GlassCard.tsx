import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'light' | 'dark' | 'blue';
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', variant = 'light' }) => {
  let bgClass = 'bg-white/80';
  let borderClass = 'border-white/50';
  let textClass = 'text-ba-dark';

  if (variant === 'dark') {
    bgClass = 'bg-ba-dark/80';
    borderClass = 'border-ba-gray/50';
    textClass = 'text-white';
  } else if (variant === 'blue') {
    bgClass = 'bg-ba-cyan/90';
    borderClass = 'border-ba-blue/50';
    textClass = 'text-white';
  }

  return (
    <div className={`backdrop-blur-md rounded-xl border shadow-lg transition-all duration-300 hover:bg-opacity-90 ${bgClass} ${borderClass} ${textClass} ${className}`}>
      {children}
    </div>
  );
};