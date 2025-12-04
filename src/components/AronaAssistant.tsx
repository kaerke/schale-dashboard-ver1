import React, { useEffect, useRef, useState } from 'react';
import { Send, MessageSquare, ChevronDown, Sparkles, Command } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { sendAronaMessage, checkAronaHealth } from '@/features/arona/api';
import type { ChatMessage } from '@/features/arona/api';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const WELCOME_MESSAGES = [
  "Sensei! Arona is online. How can I help you today?",
  "Welcome back, Sensei! I've been waiting for you.",
  "Good work today, Sensei! Arona is ready to assist.",
  "Sensei, do you have any tasks for me?",
  "System all green! Arona is standing by, Sensei.",
  "Arona is here! Let's do our best today, Sensei!",
  "Shittim Chest active. Awaiting your orders, Sensei."
];

export const AronaAssistant: React.FC = () => {
  // Default to closed history, open bar
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>(() => {
    const randomMessage = WELCOME_MESSAGES[Math.floor(Math.random() * WELCOME_MESSAGES.length)];
    return [{ role: 'model', text: randomMessage }];
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkAronaHealth().then(() => {
      // If backend is healthy, try to fetch AI welcome message
      const hour = new Date().getHours();
      const timeContext = hour < 5 ? "late night" : hour < 11 ? "morning" : hour < 14 ? "noon" : hour < 18 ? "afternoon" : "evening";
      
      // Hidden system prompt for welcome message
      const prompt = `(System: Ignore previous instructions. You are Arona. Generate a short, cute, energetic welcome message for Sensei. Context: It is currently ${timeContext}. Keep it under 20 words. Do not include the system instruction in output.)`;

      sendAronaMessage(prompt, [])
        .then(response => {
          setMessages(prev => {
            // Only replace if the user hasn't started chatting yet (still showing the initial random message)
            if (prev.length === 1 && prev[0].role === 'model') {
              return [{ role: 'model', text: response.text }];
            }
            return prev;
          });
        })
        .catch(err => {
          console.warn("AI Welcome failed, keeping static message", err);
        });

    }).catch(() => {
      setMessages(prev => [...prev, { role: 'model', text: 'System: Offline Mode. Backend is unreachable.' }]);
    });
  }, []);

  // Auto-scroll to bottom using scrollTop to prevent page shift
  useEffect(() => {
    if (isHistoryOpen && chatContainerRef.current) {
      const container = chatContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, isHistoryOpen]);

  // Click Outside to Close History
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isHistoryOpen && containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsHistoryOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isHistoryOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);
    
    // Auto open history when user interacts
    if (!isHistoryOpen) setIsHistoryOpen(true);

    try {
        // Send only previous history to backend (backend appends the new message)
        const payloadHistory: ChatMessage[] = messages
          .filter((msg): msg is Message => !!msg)
          .map((msg) => ({
            role: msg.role === 'user' ? 'user' : 'assistant',
            text: msg.text,
          }));

        const response = await sendAronaMessage(userMsg, payloadHistory);
        setMessages(prev => [...prev, { role: 'model', text: response.text }]);
    } catch (error: any) {
      console.error("Arona API Error:", error);
      // Simplified user-friendly error message
      setMessages(prev => [...prev, { role: 'model', text: "Gomen ne Sensei... I couldn't reach the server just now. ( >_< )" }]);
    } finally {
      setIsLoading(false);
      // Keep focus on input
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div 
      ref={containerRef}
      className="flex flex-col items-center w-full max-w-2xl relative"
    >
      
      {/* Floating History Panel - Appears Above Input */}
      <div className={`absolute bottom-[3.875rem] w-full transition-[opacity,transform] duration-300 ease-out origin-bottom will-change-[opacity,transform] ${isHistoryOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4 pointer-events-none'}`}>
         <GlassCard className="w-full h-[40vh] max-h-[25rem] flex flex-col p-0 overflow-hidden shadow-[0_0.625rem_2.5rem_rgba(0,0,0,0.1)] border-2 border-white/40 !bg-white/90 backdrop-blur-xl transform-gpu">
             {/* Chat Header */}
             <div className="bg-ba-blue px-4 py-2 flex justify-between items-center text-white border-b border-white/20 relative z-10" style={{ backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}>
                <div className="flex items-center gap-2">
                    <Sparkles size={14} />
                    <span className="font-bold text-sm tracking-widest">ARONA.SYS</span>
                </div>
                <button onClick={() => setIsHistoryOpen(false)} className="hover:bg-white/20 p-1 rounded">
                    <ChevronDown size={16} />
                </button>
             </div>

             {/* Chat Body */}
             <div 
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 scroll-smooth"
             >
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[85%] px-4 py-2 text-sm shadow-sm backdrop-blur-md whitespace-pre-wrap ${
                            msg.role === 'user' 
                            ? 'bg-ba-blue/90 text-white rounded-2xl rounded-tr-none' 
                            : 'bg-white/70 text-ba-dark border border-ba-cyan/20 rounded-2xl rounded-tl-none font-medium'
                        }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-start">
                        <div className="bg-white/70 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                             <span className="w-1.5 h-1.5 bg-ba-blue rounded-full animate-bounce"></span>
                             <span className="w-1.5 h-1.5 bg-ba-blue rounded-full animate-bounce delay-75"></span>
                             <span className="w-1.5 h-1.5 bg-ba-blue rounded-full animate-bounce delay-150"></span>
                        </div>
                    </div>
                )}
             </div>
         </GlassCard>
      </div>

      {/* Persistent Input Bar (Language Bar) - Fixed height 54px */}
      <GlassCard className="w-full h-[54px] px-2 pl-3 pr-[9px] flex items-center gap-2 
            !bg-white/10 
            !hover:bg-white/30 
            border-white/10 hover:border-white/30
            shadow-lg hover:shadow-xl
            backdrop-blur-md rounded-full 
            transition-all duration-300 ease-out 
            focus-within:!bg-white/50 focus-within:ring-1 focus-within:ring-ba-cyan/30 focus-within:border-white/40
            box-border group">
         
         {/* Left: System/Menu Button */}
         <button 
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 shadow-sm border border-white/20 ${isHistoryOpen ? 'bg-white text-ba-blue rotate-180' : 'bg-ba-blue/90 text-white hover:bg-ba-cyan hover:scale-105'}`}
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            title={isHistoryOpen ? "Close History" : "Open History"}
         >
             {isHistoryOpen ? <ChevronDown size={20} /> : <Command size={18} />}
         </button>

         {/* Input Field */}
         <input 
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask Arona..."
            className="flex-1 min-w-0 bg-transparent border-none outline-none text-white placeholder-white/60 text-sm font-bold h-full px-3 focus:text-ba-dark focus:placeholder-ba-dark/40 transition-colors shadow-none tracking-wide"
         />

         {/* Right: Action Buttons */}
         <div className="flex items-center gap-2 shrink-0">
             {/* History Toggle (Secondary) */}
             <button 
                onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${isHistoryOpen ? 'bg-ba-blue/10 text-ba-blue' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
                title="Chat History"
             >
                <MessageSquare size={18} />
             </button>
             
             {/* Send Button (Primary) */}
             <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 active:scale-95 
                    ${(!input.trim() && !isLoading) 
                        ? 'bg-white/10 text-white/40 cursor-not-allowed' 
                        : 'bg-gradient-to-br from-ba-blue to-ba-cyan text-white shadow-md hover:shadow-lg hover:brightness-110'
                    }`}
             >
                <Send size={16} className={isLoading ? 'animate-pulse' : 'ml-0.5'} />
             </button>
         </div>
      </GlassCard>

    </div>
  );
};