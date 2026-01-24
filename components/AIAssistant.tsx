
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { AppItem, Language } from '../types';
import { translations } from '../translations';

interface AIAssistantProps {
  language: Language;
  activeColor: string;
  apps: AppItem[];
  onSelectApp: (app: AppItem) => void;
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

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `You are Esmael's AI assistant for a premium APK mod store. 
      Available apps: ${apps.map(a => a.name).join(', ')}.
      User query: "${userMsg}".
      Answer in ${language} language. Be sophisticated and helpful. 
      If recommending an app, strictly use its exact name from the list.
      Keep it brief.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      const aiText = response.text || "Desculpe, não consegui processar isso.";
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "Erro na conexão com o sistema central de IA." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(var(--active-rgb),0.4)] transition-all duration-500 active:scale-90 relative ${isOpen ? 'bg-red-600 rotate-90' : `bg-${colorBase}-600 hover:scale-110`}`}
      >
        <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-robot'} text-2xl text-white`}></i>
        {!isOpen && (
           <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-black rounded-full animate-pulse"></span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[350px] max-w-[90vw] h-[500px] glass rounded-[2.5rem] flex flex-col overflow-hidden border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.8)] animate-soft-zoom">
          {/* Header */}
          <div className={`p-6 bg-gradient-to-r from-${colorBase}-600/40 to-black border-b border-white/5`}>
            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
               <i className="fa-solid fa-wand-magic-sparkles text-purple-400"></i>
               {t.aiChatTitle}
            </h3>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-hide bg-black/40">
            {messages.length === 0 && (
              <div className="text-center py-10">
                <div className={`w-16 h-16 rounded-3xl bg-${colorBase}-600/10 mx-auto mb-4 flex items-center justify-center border border-${colorBase}-500/20`}>
                  <i className={`fa-solid fa-comment-dots text-${colorBase}-400 text-2xl`}></i>
                </div>
                <p className="text-gray-500 text-xs font-medium px-10 leading-relaxed">
                  Diga o que você está procurando e eu encontrarei o mod perfeito para você.
                </p>
              </div>
            )}
            
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm font-medium ${m.role === 'user' ? `bg-${colorBase}-600 text-white rounded-tr-none` : 'bg-white/5 text-gray-200 border border-white/5 rounded-tl-none'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                 <div className="bg-white/5 px-4 py-3 rounded-2xl rounded-tl-none flex gap-1">
                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                 </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/5 bg-[#0d0d0d]">
             <div className="relative">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={t.aiChatPlaceholder}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-4 pr-12 focus:outline-none focus:border-white/20 transition-all text-xs font-medium"
                />
                <button 
                  onClick={handleSend}
                  className={`absolute right-2 top-2 w-9 h-9 flex items-center justify-center rounded-xl transition-all ${input.trim() ? `bg-${colorBase}-600 text-white` : 'bg-white/5 text-gray-600 cursor-not-allowed'}`}
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
