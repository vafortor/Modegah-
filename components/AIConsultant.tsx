
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, User, Loader2 } from 'lucide-react';
import { ChatMessage } from '../types';
import { getGeminiResponse } from '../services/geminiService';
import BlockIcon from './BlockIcon';

interface AIConsultantProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const AIConsultant: React.FC<AIConsultantProps> = ({ isOpen, setIsOpen }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: "Hello! I'm your Modegah Construction Assistant. How can I help you with your project today?" }
  ]);
  
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
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const responseText = await getGeminiResponse([...messages, userMessage]);
    setMessages(prev => [...prev, { role: 'model', content: responseText }]);
    setIsLoading(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-slate-900 text-white p-4 rounded-full shadow-2xl hover:bg-slate-800 transition-all group scale-100 hover:scale-110 active:scale-95 border border-slate-700"
      >
        <BlockIcon size={28} className="group-hover:text-amber-500 transition-colors" />
      </button>

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-[400px] h-[600px] max-h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-in slide-in-from-bottom-10 duration-300">
          <div className="bg-slate-900 p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="bg-amber-500 p-2 rounded-lg">
                <BlockIcon size={20} className="text-slate-900" />
              </div>
              <div>
                <h3 className="font-bold leading-tight">Expert AI</h3>
                <p className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">Modegah Assistant</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:text-amber-500 transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`p-1 rounded-lg self-end flex-shrink-0 ${msg.role === 'user' ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-500'}`}>
                    {msg.role === 'user' ? <User size={16} /> : <BlockIcon size={16} />}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-slate-900 text-white rounded-br-none shadow-md' 
                      : 'bg-white text-slate-700 rounded-bl-none border border-slate-100 shadow-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-slate-100 shadow-sm">
                  <Loader2 size={20} className="animate-spin text-amber-500" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t bg-white">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex gap-2"
            >
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about blocks or materials..."
                className="flex-1 px-4 py-2 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm font-medium"
              />
              <button 
                type="submit"
                disabled={isLoading}
                className="bg-amber-500 text-slate-900 p-2 rounded-xl hover:bg-amber-600 transition-colors disabled:opacity-50"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AIConsultant;
