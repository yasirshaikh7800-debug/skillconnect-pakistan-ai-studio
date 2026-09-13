'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, User, Loader2, Minimize2, Maximize2 } from 'lucide-react';

export default function AiAssistantDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content:
        'AOA! I am the SkillConnect Pakistan AI Assistant. How can I help you find CNIC-verified services, evaluate job skills, or navigate our platform today?',
    },
  ]);
  const [input, setInput] = useState('');
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

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages([
          ...newMessages,
          {
            role: 'assistant',
            content: 'I apologize, I encountered an issue connecting to the AI server. Please try again shortly.',
          },
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'Unable to reach SkillConnect AI service right now. Please check your internet connection.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (text: string) => {
    setInput(text);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-extrabold text-xs shadow-2xl hover:scale-105 transition-all flex items-center space-x-2 border border-emerald-400/30 glow-cyan-emerald"
        >
          <Bot className="w-5 h-5 animate-pulse" />
          <span>SkillConnect AI Chat</span>
        </button>
      )}

      {/* Chat Window Popup */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm sm:max-w-md h-[520px] rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col overflow-hidden text-white animate-fadeIn">
          {/* Header */}
          <div className="p-4 bg-slate-800/80 border-b border-slate-700/80 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white">
                  SkillConnect AI Assistant
                </h4>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>Online • Pakistan Career Context</span>
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex items-start space-x-2 ${
                  m.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {m.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`p-3 rounded-2xl max-w-[82%] leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-emerald-600 text-white rounded-tr-none'
                      : 'bg-slate-800 border border-slate-700/80 text-slate-200 rounded-tl-none'
                  }`}
                >
                  {m.content}
                </div>

                {m.role === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center space-x-2 text-slate-400 text-xs py-2">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                <span>AI Assistant is typing...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Sample Suggestions */}
          <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800 flex gap-1.5 overflow-x-auto text-[10px]">
            <button
              onClick={() => handleQuickPrompt('How do I book an electrician in Karachi in PKR?')}
              className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 whitespace-nowrap"
            >
              Book Electrician
            </button>
            <button
              onClick={() => handleQuickPrompt('What are top in-demand skills in Lahore right now?')}
              className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 whitespace-nowrap"
            >
              Lahore Skills Demand
            </button>
            <button
              onClick={() => handleQuickPrompt('How does CNIC verification work?')}
              className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 whitespace-nowrap"
            >
              CNIC Verification
            </button>
          </div>

          {/* Input Footer */}
          <form onSubmit={handleSend} className="p-3 bg-slate-800/90 border-t border-slate-700/80 flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about skills, services, PKR rates..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 text-white placeholder-slate-400 text-xs border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50 transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
