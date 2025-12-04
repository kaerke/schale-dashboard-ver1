import React, { useRef } from 'react';
import { Image as ImageIcon, RotateCcw, EyeOff, Eye } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';

interface ControlWidgetProps {
  onBackgroundChange: (file: File) => void;
  onResetBackground: () => void;
  uiVisible: boolean;
  onToggleUi: () => void;
}

export const ControlWidget: React.FC<ControlWidgetProps> = ({ 
  onBackgroundChange, 
  onResetBackground,
  uiVisible,
  onToggleUi
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onBackgroundChange(e.target.files[0]);
      e.target.value = '';
    }
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    onResetBackground();
  };

  const preventBubble = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className={`flex flex-col items-end transition-opacity duration-500 ${uiVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={preventBubble}
    >
       {/* Always Visible Dock - Height fixed to 44px for alignment */}
       {/* Using !bg-white/20 to match Arona and Music widgets */}
       <GlassCard className="h-[2.75rem] px-2 flex items-center gap-1 !bg-white/20 !hover:bg-white/30 border-white/10 shadow-lg backdrop-blur-md box-border transition-all duration-300">
          
          {/* Toggle UI Button */}
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleUi(); }}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all active:scale-95 flex items-center justify-center"
            title={uiVisible ? "Hide Interface" : "Show Interface"}
          >
            {uiVisible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>

          <div className="w-px h-4 bg-white/20 mx-1"></div>

          {/* Upload Button */}
          <button 
            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
            className="p-1.5 rounded-lg text-ba-cyan hover:text-white hover:bg-ba-blue transition-all active:scale-95 flex items-center justify-center"
            title="Change Wallpaper"
          >
            <ImageIcon size={16} />
          </button>
          
          {/* Reset Button */}
          <button 
            onClick={handleReset}
            className="p-1.5 rounded-lg text-red-300 hover:text-white hover:bg-red-500/80 transition-all active:scale-95 flex items-center justify-center"
            title="Reset Wallpaper"
          >
            <RotateCcw size={16} />
          </button>

          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
          />
       </GlassCard>
       
       <div className="mt-1 text-[10px] font-mono text-white/60 text-right px-1 absolute top-full right-0 drop-shadow-sm">
          SCHALE_SYS
       </div>
    </div>
  );
};