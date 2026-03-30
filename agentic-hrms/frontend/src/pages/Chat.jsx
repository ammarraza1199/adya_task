import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Mic, Paperclip, MoreHorizontal, Info, Calendar, Clock } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import Sidebar from '../components/Sidebar';
import ChatBubble from '../components/ChatBubble';
import QuickChips from '../components/QuickChips';

const Chat = () => {
  const { messages, isTyping, sendMessage } = useChat();
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef(null);
  const [showDrawer, setShowDrawer] = useState(true);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    const handleAutoMessage = (e) => {
      if (e.detail) sendMessage(e.detail);
    };
    window.addEventListener('sendMessage', handleAutoMessage);
    return () => window.removeEventListener('sendMessage', handleAutoMessage);
  }, [sendMessage]);

  const handleSend = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      sendMessage(inputText);
      setInputText('');
    }
  };

  return (
    <div className="flex h-screen bg-background text-white font-sora relative overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col relative h-full">
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-10 border-b border-white/5 bg-background/50 backdrop-blur-xl z-20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-accent-indigo/10 flex items-center justify-center border border-accent-indigo/20">
              <Sparkles className="text-accent-indigo" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">AI Assistant</h2>
              <p className="text-xs text-accent-emerald flex items-center gap-1.5 font-bold uppercase tracking-widest">
                <span className="w-1.5 h-1.5 bg-accent-emerald rounded-full animate-pulse"></span>
                System Online
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={() => setShowDrawer(!showDrawer)} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/10">
               <Info size={20} className="text-white/60" />
             </button>
             <button className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/10">
               <MoreHorizontal size={20} className="text-white/60" />
             </button>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-8 py-10 space-y-2 relative custom-scrollbar">
          <AnimatePresence>
            {messages.map((m, i) => (
              <ChatBubble key={i} message={m} isLast={i === messages.length - 1} />
            ))}
          </AnimatePresence>
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 mb-10"
            >
              <div className="w-10 h-10 rounded-2xl glass flex items-center justify-center border border-white/10">
                <Sparkles size={20} className="text-accent-indigo animate-pulse" />
              </div>
              <div className="glass px-6 py-4 rounded-3xl flex gap-1.5 border border-white/10">
                <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce"></div>
              </div>
            </motion.div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="px-8 pb-8 pt-4 bg-gradient-to-t from-background via-background to-transparent z-10">
          <div className="max-w-4xl mx-auto">
            <QuickChips onSelect={sendMessage} />
            
            <form onSubmit={handleSend} className="relative group/form">
              <div className="absolute inset-0 bg-accent-indigo/10 blur-[100px] opacity-0 group-focus-within/form:opacity-100 transition-opacity pointer-events-none"></div>
              <div className="relative glass-heavy rounded-3xl p-2 border border-white/10 shadow-2xl transition-all duration-500 group-focus-within/form:border-accent-indigo/50 flex items-center gap-2">
                <button type="button" className="p-3.5 rounded-2xl hover:bg-white/5 text-white/40 hover:text-white transition-all transition-transform active:scale-90">
                  <Paperclip size={20} />
                </button>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask me anything... (e.g. 'Apply leave for tomorrow')"
                  className="flex-1 bg-transparent border-none outline-none py-4 px-2 text-sm font-medium placeholder:text-white/20"
                />
                <button type="button" className="p-3.5 rounded-2xl hover:bg-white/5 text-white/40 hover:text-white transition-all active:scale-90">
                  <Mic size={20} />
                </button>
                <button
                  type="submit"
                  disabled={!inputText.trim() || isTyping}
                  className="p-3.5 rounded-2xl bg-accent-indigo hover:bg-accent-indigo/90 text-white shadow-xl shadow-accent-indigo/20 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
                >
                  <Send size={20} className="group-focus-within/form:translate-x-0.5 group-focus-within/form:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Side Drawer (Analytics) */}
      <AnimatePresence>
        {showDrawer && (
          <motion.aside
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            className="w-96 border-l border-white/5 bg-background/50 backdrop-blur-3xl p-8 z-30 flex flex-col gap-8 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold tracking-tight">Quick Overview</h3>
              <button 
                onClick={() => setShowDrawer(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/10"
              >
                <X size={16} className="text-white/40" />
              </button>
            </div>

            <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <div className="p-6 rounded-3xl glass-heavy border border-white/10 space-y-4 group hover:bg-accent-indigo/5 transition-all duration-500">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-accent-indigo/10 text-accent-indigo group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <Calendar size={20} />
                  </div>
                  <span className="text-sm font-semibold text-white/60">Leave Balance</span>
                </div>
                <div className="flex flex-col gap-0.5">
                   <span className="text-4xl font-mono font-bold tracking-tighter">15<span className="text-sm text-white/30 ml-2 font-sora font-medium">days left</span></span>
                   <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mt-3">
                     <div className="h-full bg-accent-indigo w-3/4 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                   </div>
                </div>
              </div>

               <div className="p-6 rounded-3xl glass-heavy border border-white/10 space-y-4 group hover:bg-accent-emerald/5 transition-all duration-500">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-accent-emerald/10 text-accent-emerald group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <Clock size={20} />
                  </div>
                  <span className="text-sm font-semibold text-white/60">Today's Presence</span>
                </div>
                <div className="flex flex-col gap-0.5">
                   <span className="text-4xl font-mono font-bold tracking-tighter text-accent-emerald">PRESENT</span>
                   <p className="text-[10px] uppercase font-bold tracking-widest text-white/20 mt-1">Clocked in at 09:12 AM</p>
                </div>
              </div>
              
              <div className="p-4 rounded-3xl glass text-center border border-white/10 mt-auto py-8">
                <Sparkles className="text-accent-amber mx-auto mb-4 animate-pulse" />
                <p className="text-sm font-semibold mb-1">PRO TIP</p>
                <p className="text-xs text-white/40 leading-relaxed px-4 italic">"Ask me to calculate your taxes based on your current payslip!"</p>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
};

// Simple X icon as Lucide-react export might vary
const X = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

export default Chat;
