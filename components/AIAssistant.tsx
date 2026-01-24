
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MovieItem, Language } from '../types';
import { translations } from '../translations';

interface AIAssistantProps {
  language: Language;
  activeColor: string;
  apps: MovieItem[];
  onSelectApp: (app: MovieItem) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ language, activeColor, apps, onSelectApp }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const t = translations[language];
  const colorBase = activeColor.split('-')[0];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    if (!process.env.API_KEY) {
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'ai', text: "Atenção: A chave de inteligência artificial (API_KEY) não foi configurada na Vercel. Por favor, adicione-a para habilitar o assistente." }]);
        setIsTyping(false);
      }, 1000);
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Você é o assistente virtual do EsmaelX Cine.
      Catálogo atual: ${apps.map(a => a.title).join(', ')}.
      Pergunta do usuário: "${userMsg}".
      Responda em ${language}. Seja sofisticado, use gírias de cinema e seja breve.
      Se recomendar um filme, cite o nome exato do catálogo.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      const aiText = response.text || t.aiError;
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: t.aiMaintenance }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 active:scale-90 ${isOpen ? 'bg-zinc-900 rotate-90 border border-white/10' : `bg-${colorBase}-600 hover:scale-110 shadow-${colorBase}-500/20 shadow-2xl`}`}
      >
        <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-robot'} text-2xl text-white`}></i>
        {!isOpen && (
           <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-black rounded-full animate-pulse"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[360px] max-w-[90vw] h-[550px] glass rounded-[2.5rem] flex flex-col overflow-hidden border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.9)] animate-soft-zoom">
          <div className={`p-6 bg-gradient-to-br from-${colorBase}-600/20 via-black to-black border-b border-white/5`}>
            <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
               <i className={`fa-solid fa-microchip text-${colorBase}-400`}></i>
               {t.aiChatTitle}
            </h3>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide bg-black/40">
            {messages.length === 0 && (
              <div className="text-center py-16 opacity-30 flex flex-col items-center">
                <div className={`w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-6 border border-white/5`}>
                   <i className={`fa-solid fa-comment-nodes text-3xl text-${colorBase}-400`}></i>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest px-8">{t.aiWelcome}</p>
              </div>
            )}
            
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                <div className={`max-w-[85%] px-5 py-4 rounded-[1.5rem] text-xs font-medium leading-relaxed ${m.role === 'user' ? `bg-${colorBase}-600 text-white rounded-tr-none` : 'bg-white/5 text-zinc-300 border border-white/5 rounded-tl-none'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                 <div className="bg-white/5 px-5 py-3 rounded-2xl flex gap-1.5 items-center">
                    <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                 </div>
              </div>
            )}
          </div>

          <div className="p-5 bg-zinc-950/80 backdrop-blur-md border-t border-white/5">
             <div className="relative group">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={t.aiChatPlaceholder}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-5 pr-14 focus:outline-none focus:border-white/20 text-xs text-white transition-all focus:bg-white/10"
                />
                <button 
                  onClick={handleSend}
                  className={`absolute right-2 top-2 w-10 h-10 flex items-center justify-center rounded-xl transition-all ${input.trim() ? `bg-${colorBase}-500 text-white shadow-lg shadow-${colorBase}-500/20` : 'bg-white/5 text-zinc-700 cursor-not-allowed'}`}
                >
                  <i className="fa-solid fa-paper-plane text-xs"></i>
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
