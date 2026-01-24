
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

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'ai', text: "Erro: API_KEY não configurada na Vercel." }]);
        setIsTyping(false);
      }, 1000);
      return;
    }

    try {
      // Cria instância nova para garantir o uso da chave atualizada
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Você é o assistente virtual do EsmaelX Cine.
      Catálogo atual: ${apps.map(a => a.title).join(', ')}.
      Pergunta do usuário: "${userMsg}".
      Responda em ${language}. Seja breve e use estilo cinematográfico.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      const aiText = response.text || "Não consegui analisar o filme agora.";
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "IA temporariamente offline." }]);
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
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[360px] max-w-[90vw] h-[550px] glass rounded-[2.5rem] flex flex-col overflow-hidden border border-white/10 shadow-2xl animate-soft-zoom bg-black">
          <div className={`p-6 bg-gradient-to-br from-${colorBase}-600/20 via-black to-black border-b border-white/5`}>
            <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
               <i className={`fa-solid fa-microchip text-${colorBase}-400`}></i>
               EsmaelX AI
            </h3>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
            {messages.length === 0 && (
              <div className="text-center py-16 opacity-30 flex flex-col items-center">
                <i className={`fa-solid fa-comment-nodes text-3xl text-${colorBase}-400 mb-4`}></i>
                <p className="text-[10px] font-black uppercase tracking-widest px-8">Como posso ajudar na sua escolha hoje?</p>
              </div>
            )}
            
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                <div className={`max-w-[85%] px-5 py-4 rounded-[1.5rem] text-xs font-medium leading-relaxed ${m.role === 'user' ? `bg-${colorBase}-600 text-white rounded-tr-none` : 'bg-white/5 text-zinc-300 border border-white/5 rounded-tl-none'}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-5 bg-zinc-950/80 backdrop-blur-md border-t border-white/5">
             <div className="relative">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Pergunte sobre um filme..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-5 pr-14 focus:outline-none focus:border-white/20 text-xs text-white"
                />
                <button 
                  onClick={handleSend}
                  className={`absolute right-2 top-2 w-10 h-10 flex items-center justify-center rounded-xl ${input.trim() ? `bg-${colorBase}-500 text-white` : 'bg-white/5 text-zinc-700'}`}
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
