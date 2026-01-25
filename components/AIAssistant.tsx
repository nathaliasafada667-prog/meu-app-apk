
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

const AIAssistant: React.FC<AIAssistantProps> = ({ language, activeColor, apps }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const colorBase = activeColor.split('-')[0];

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'ai', text: "O Assistente IA requer uma API_KEY configurada na Vercel para funcionar." }]);
        setIsTyping(false);
      }, 800);
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Você é o EsmaelX AI. Ajude o usuário a escolher um filme. 
      Catálogo: ${apps.slice(0, 10).map(a => a.title).join(', ')}.
      Pergunta: "${userMsg}". Responda em ${language} de forma curta e estilosa.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setMessages(prev => [...prev, { role: 'ai', text: response.text || "Análise concluída." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "Conexão com a rede neural interrompida." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-[100]">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 active:scale-90 ${isOpen ? 'bg-zinc-900 border border-white/10' : `bg-white/10 backdrop-blur-xl border border-white/10`}`}
      >
        <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-robot'} text-xl text-white`}></i>
      </button>

      {isOpen && (
        <div className="absolute bottom-20 left-0 w-[320px] max-w-[85vw] h-[480px] glass rounded-[2rem] flex flex-col overflow-hidden border border-white/10 shadow-2xl animate-soft-zoom bg-black/95">
          <div className={`p-5 bg-${colorBase}-600/10 border-b border-white/5`}>
            <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">IA EsmaelX Cine</span>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
            {messages.length === 0 && (
              <div className="text-center py-20 opacity-20">
                <p className="text-[9px] font-black uppercase tracking-widest">Aguardando comando...</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-[11px] leading-relaxed ${m.role === 'user' ? `bg-${colorBase}-600 text-white` : 'bg-white/5 text-gray-300 border border-white/5'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && <div className="text-[8px] font-black uppercase text-gray-600 animate-pulse">Sincronizando...</div>}
          </div>

          <div className="p-4 bg-black border-t border-white/5">
             <div className="relative">
                <input 
                  type="text" value={input} onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Mensagem..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-[11px] text-white focus:outline-none"
                />
                <button onClick={handleSend} className="absolute right-2 top-2 w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-colors">
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
