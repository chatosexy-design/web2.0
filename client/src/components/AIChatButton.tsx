import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Zap, Loader2, Apple } from 'lucide-react';
import api from '../api';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  data?: any;
}

const AIChatButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: '¡Hola! Soy tu asistente nutricional. Describe lo que comiste y te diré sus valores aproximados.',
      sender: 'ai'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!query.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: query,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    const currentQuery = query;
    setQuery('');
    setLoading(true);

    try {
      const res = await api.post('/nutrition/analyze', { query: currentQuery });
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: `He analizado: ${res.data.data.name}`,
        sender: 'ai',
        data: res.data.data
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (err) {
      console.error(err);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Lo siento, no pude analizar esa combinación. Intenta ser más específico.',
        sender: 'ai'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[90vw] sm:w-[400px] h-[500px] bg-white dark:bg-stone-900 rounded-[2.5rem] shadow-2xl border border-stone-100 dark:border-stone-800 flex flex-col overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="bg-wine-700 p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                <Apple className="text-white w-6 h-6" />
              </div>
              <div>
                <h3 className="text-white font-black uppercase tracking-tighter text-sm">Asistente IA</h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-wine-100 text-[10px] font-bold uppercase tracking-widest">En línea</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] space-y-2 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-4 rounded-3xl font-medium text-sm ${
                    msg.sender === 'user' 
                      ? 'bg-wine-700 text-white rounded-tr-none' 
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                  
                  {msg.data && (
                    <div className="bg-stone-50 dark:bg-stone-800/50 rounded-3xl p-4 border border-stone-100 dark:border-stone-700 space-y-4 animate-fade-in">
                      <div className="flex items-center gap-2 mb-1">
                        <Zap className="w-4 h-4 text-wine-700" />
                        <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Análisis Nutricional</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white dark:bg-stone-800 p-3 rounded-2xl shadow-sm">
                          <p className="text-[8px] font-black text-stone-400 uppercase tracking-tighter">Calorías</p>
                          <p className="text-lg font-black text-wine-700">{msg.data.calories.toFixed(0)} <span className="text-[10px]">kcal</span></p>
                        </div>
                        <div className="bg-white dark:bg-stone-800 p-3 rounded-2xl shadow-sm">
                          <p className="text-[8px] font-black text-stone-400 uppercase tracking-tighter">Proteína</p>
                          <p className="text-lg font-black text-emerald-600">{msg.data.protein.toFixed(1)} <span className="text-[10px]">g</span></p>
                        </div>
                        <div className="bg-white dark:bg-stone-800 p-3 rounded-2xl shadow-sm">
                          <p className="text-[8px] font-black text-stone-400 uppercase tracking-tighter">Carbohidratos</p>
                          <p className="text-lg font-black text-amber-500">{msg.data.carbs.toFixed(1)} <span className="text-[10px]">g</span></p>
                        </div>
                        <div className="bg-white dark:bg-stone-800 p-3 rounded-2xl shadow-sm">
                          <p className="text-[8px] font-black text-stone-400 uppercase tracking-tighter">Grasas</p>
                          <p className="text-lg font-black text-rose-500">{msg.data.fat.toFixed(1)} <span className="text-[10px]">g</span></p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-stone-100 dark:bg-stone-800 p-4 rounded-3xl rounded-tl-none">
                  <Loader2 className="w-5 h-5 animate-spin text-wine-700" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-6 border-t border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50">
            <div className="relative flex items-center gap-2">
              <input 
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Escribe lo que comiste..."
                className="flex-1 bg-white dark:bg-stone-800 border-none rounded-2xl px-4 py-3 text-sm font-bold text-stone-800 dark:text-white placeholder:text-stone-400 focus:ring-2 focus:ring-wine-700 shadow-sm"
              />
              <button 
                onClick={handleSend}
                disabled={loading || !query.trim()}
                className="w-11 h-11 bg-wine-700 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-wine-700/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-110 active:scale-90 ${
          isOpen 
            ? 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 rotate-90' 
            : 'bg-wine-700 text-white shadow-wine-700/30'
        }`}
      >
        {isOpen ? <X className="w-8 h-8" /> : <MessageSquare className="w-8 h-8" />}
      </button>
    </div>
  );
};

export default AIChatButton;
