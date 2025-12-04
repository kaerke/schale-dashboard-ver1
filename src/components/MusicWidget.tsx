
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Upload, Music as MusicIcon, AlertCircle, RotateCcw, SkipForward } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';

const PLAYLIST = [
  {
    title: "RE Aoharu",
    artist: "Mitsukiyo",
    url: "/background-music/RE Aoharu (Title).ogg"
  },
  {
    title: "Constant Moderato",
    artist: "Mitsukiyo",
    url: "/background-music/Constant Moderato -Piano Arrange-.ogg"
  },
  {
    title: "Luminous Memory",
    artist: "Mitsukiyo",
    url: "/background-music/Luminous Memory (Title).ogg"
  }
];

export const MusicWidget: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [trackInfo, setTrackInfo] = useState({ title: PLAYLIST[0].title, artist: PLAYLIST[0].artist });
  const [audioSrc, setAudioSrc] = useState(PLAYLIST[0].url);
  const [hasError, setHasError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-play when track changes
  useEffect(() => {
    if (shouldAutoPlay && audioRef.current) {
        setHasError(false);
        audioRef.current.play()
            .then(() => setIsPlaying(true))
            .catch(e => {
                console.error("Auto-play failed", e);
                setIsPlaying(false);
            });
    }
  }, [audioSrc, shouldAutoPlay]);

  const playNextTrack = () => {
    if (currentTrackIndex !== -1) {
      const nextIndex = (currentTrackIndex + 1) % PLAYLIST.length;
      setCurrentTrackIndex(nextIndex);
      setAudioSrc(PLAYLIST[nextIndex].url);
      setTrackInfo({ 
          title: PLAYLIST[nextIndex].title, 
          artist: PLAYLIST[nextIndex].artist 
      });
      setShouldAutoPlay(true);
    }
  };

  const togglePlay = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      setShouldAutoPlay(false);
    } else {
      if (hasError) {
          alert("Cannot play this track. Please try uploading a valid audio file.");
          return;
      }
      try {
        await audioRef.current.play();
        setIsPlaying(true);
        setShouldAutoPlay(true);
      } catch (e) {
        console.error("Playback failed", e);
        setIsPlaying(false);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setProgress(newTime);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Revoke old URL if it was a blob
      if (audioSrc.startsWith('blob:')) {
          URL.revokeObjectURL(audioSrc);
      }
      
      const url = URL.createObjectURL(file);
      setAudioSrc(url);
      setCurrentTrackIndex(-1); // Mark as custom track
      setHasError(false);
      setShouldAutoPlay(true);
      
      // Extract name
      const name = file.name.replace(/\.[^/.]+$/, "");
      setTrackInfo({ title: name, artist: "Local File" });
    }
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Cleanup blob if exists
    if (audioSrc.startsWith('blob:')) {
        URL.revokeObjectURL(audioSrc);
    }
    
    setAudioSrc(PLAYLIST[0].url);
    setTrackInfo({ title: PLAYLIST[0].title, artist: PLAYLIST[0].artist });
    setCurrentTrackIndex(0);
    setHasError(false);
    setIsPlaying(false);
    setShouldAutoPlay(false);
    
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const isCustomTrack = currentTrackIndex === -1;

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group flex flex-col gap-1 select-none transition-[max-width,height] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] h-[2.75rem] overflow-hidden relative z-50 w-fit ${isHovered ? 'max-w-[20rem] 2xl:max-w-[26rem] h-auto' : 'max-w-[2.75rem]'}`}
    >
       <audio 
         ref={audioRef}
         src={audioSrc}
         onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
         onLoadedMetadata={(e) => {
             setDuration(e.currentTarget.duration);
             setHasError(false);
         }}
         onEnded={() => {
             if (currentTrackIndex !== -1) {
                 playNextTrack();
             } else {
                 // Loop custom track
                 audioRef.current?.play();
             }
         }}
         onError={(e) => {
             console.error("Audio source error:", e);
             setTrackInfo({ title: "Playback Error", artist: "Check Source" });
             setHasError(true);
             setIsPlaying(false);
         }}
       />

       <div className={`absolute transition-opacity duration-300 delay-100 flex justify-between items-end w-full top-0 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
         <div className="bg-ba-blue text-white text-xs font-bold px-3 py-0.5 rounded-t-md ml-2 transform skew-x-[-10deg] inline-block shadow-md">
            <span className="block transform skew-x-[10deg] flex items-center gap-1">
              <MusicIcon size={10} /> AUDIO_OUTPUT
            </span>
        </div>
       </div>

      <GlassCard className={`p-0 w-full h-full flex items-center gap-3 relative border-white/10 !bg-white/10 backdrop-blur-md transition-all duration-300 shadow-xl ${isHovered ? 'p-2 pr-4 !bg-white/30 backdrop-blur-2xl' : ''} ${hasError ? 'border-red-400/50 !bg-red-900/20' : ''}`}>
        
        {/* Album Art / Spinner (Always Visible) */}
        <div className={`relative flex items-center justify-center transition-all duration-300 ${isHovered ? 'min-w-[2rem] h-[2rem]' : 'min-w-[2.75rem] h-[2.75rem]'}`}>
             <div 
                onClick={togglePlay}
                className={`cursor-pointer w-8 h-8 rounded-full flex items-center justify-center border-2 shadow-lg transition-all duration-300 ${hasError ? 'bg-red-500/20 border-red-400' : 'bg-gray-800 border-gray-600'} ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}
             >
                {hasError ? (
                    <AlertCircle size={14} className="text-red-400" />
                ) : (
                    <div className="w-2.5 h-2.5 bg-ba-cyan rounded-full border border-white"></div>
                )}
            </div>
             {/* Status Dot for Minimized View */}
             {isPlaying && !hasError && (
                <div className={`absolute top-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse border-2 border-white ${isHovered ? 'top-[-0.25rem] right-[-0.25rem]' : ''}`}></div>
            )}
        </div>

        {/* Expanded Content */}
        <div className={`flex-1 min-w-[10rem] transition-opacity duration-300 flex flex-col justify-center h-full ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="flex justify-between items-end mb-1">
               <h3 className={`text-xs font-bold truncate max-w-[6.5rem] ${hasError ? 'text-red-200' : 'text-white'}`}>{trackInfo.title}</h3>
               <span className="text-[9px] text-white/80 font-mono">{formatTime(progress)}</span>
            </div>
            
            {/* Custom Range Input for Progress */}
            <input 
              type="range" 
              min="0" 
              max={duration || 100} 
              value={progress} 
              onChange={handleSeek}
              disabled={hasError}
              className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:bg-ba-cyan [&::-webkit-slider-thumb]:rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            />
        </div>

        {/* Controls */}
        <div className={`flex items-center gap-2 pl-2 border-l border-white/20 transition-opacity duration-300 relative z-10 ${isHovered ? 'opacity-100' : 'opacity-0'}`} style={{ pointerEvents: isHovered ? 'auto' : 'none' }}>
            <button 
                onClick={togglePlay}
                className={`w-8 h-8 flex items-center justify-center rounded-full text-ba-dark hover:text-white transition-colors shadow-sm ${hasError ? 'bg-red-400/50 hover:bg-red-500' : 'bg-white/50 hover:bg-ba-cyan'}`}
            >
                {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
            </button>
            
            {!isCustomTrack && (
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        playNextTrack();
                    }}
                    className="text-white/70 hover:text-ba-cyan transition-colors p-1 relative z-10"
                    title="Next Track"
                >
                    <SkipForward size={14} />
                </button>
            )}
            
            {isCustomTrack ? (
                <button 
                    onClick={handleReset}
                    className="text-white/70 hover:text-red-400 transition-colors p-1 relative z-10"
                    title="Reset to Default"
                >
                    <RotateCcw size={14} />
                </button>
            ) : (
                <button 
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (fileInputRef.current) {
                            fileInputRef.current.click();
                        }
                    }}
                    className="text-white/70 hover:text-ba-blue transition-colors p-1 relative z-10"
                    title="Upload Local Track"
                >
                    <Upload size={14} />
                </button>
            )}
        </div>

        <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept="audio/*" 
            style={{ 
                position: 'absolute',
                width: '1px',
                height: '1px',
                padding: '0',
                margin: '-1px',
                overflow: 'hidden',
                clip: 'rect(0, 0, 0, 0)',
                whiteSpace: 'nowrap',
                border: '0',
                opacity: '0',
                pointerEvents: 'none'
            }} 
            tabIndex={-1}
            aria-hidden="true"
        />

        {/* Decorative BG Visualizer */}
        {!hasError && (
            <div className="absolute bottom-0 left-0 right-0 h-full flex items-end justify-between px-10 opacity-10 pointer-events-none z-0">
                {[1,2,3,4,5,6].map(i => (
                    <div 
                        key={i} 
                        className="w-2 bg-ba-blue transition-all duration-150 ease-out rounded-t-sm"
                        style={{ height: isPlaying ? `${Math.random() * 80 + 10}%` : '10%' }}
                    ></div>
                ))}
            </div>
        )}
      </GlassCard>
    </div>
  );
};
