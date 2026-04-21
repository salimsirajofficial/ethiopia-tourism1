import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, User, Bot, Loader2, Sparkles } from "lucide-react";
import { sendMessageToGemini } from "../../lib/geminiService";
import { useTranslation } from "react-i18next";

const ChatBot = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "model", parts: [{ text: t("chatbot.welcome") }] }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Update welcome message when language changes if no other messages exist
  useEffect(() => {
    if (messages.length === 1 && messages[0].role === "model") {
      setMessages([{ role: "model", parts: [{ text: t("chatbot.welcome") }] }]);
    }
  }, [t]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", parts: [{ text: input }] };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const chatHistory = messages
      .filter((msg, index) => !(index === 0 && msg.role === "model"))
      .map(msg => ({
        role: msg.role,
        parts: msg.parts
      }));

    try {
      const response = await sendMessageToGemini(chatHistory, input);
      setMessages((prev) => [...prev, response]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "model", parts: [{ text: t("chatbot.error") }] }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* FAB - Premium Floating Button with Glow */}
      <motion.button
        whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(245, 158, 11, 0.4)" }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative group size-16 rounded-2xl bg-amber-500 text-black flex items-center justify-center shadow-[0_10px_30px_rgba(245,158,11,0.3)] transition-all duration-500 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-600 to-amber-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10 flex items-center justify-center">
          {isOpen ? <X size={28} strokeWidth={2.5} /> : <MessageSquare size={28} strokeWidth={2.5} />}
        </div>
        
        {/* Subtle Pulse rings when closed */}
        {!isOpen && (
          <>
            <motion.div 
              animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 rounded-2xl border-2 border-amber-500/50 pointer-events-none"
            />
            <motion.div 
              animate={{ scale: [1, 1.8, 1], opacity: [0.1, 0, 0.1] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              className="absolute inset-0 rounded-2xl border-2 border-amber-500/30 pointer-events-none"
            />
          </>
        )}
      </motion.button>

      {/* Chat Window - Enhanced Glassmorphism */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            className="absolute bottom-24 right-0 w-[420px] max-w-[calc(100vw-48px)] h-[620px] max-h-[calc(100vh-160px)] bg-neutral-950/85 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
          >
            {/* Header - Premium Gradient */}
            <div className="p-6 border-b border-white/5 bg-gradient-to-br from-amber-500/5 via-neutral-900/40 to-transparent flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="size-12 rounded-2xl bg-amber-500 flex items-center justify-center text-black shadow-lg shadow-amber-500/20">
                    <Bot size={26} strokeWidth={2.2} />
                  </div>
                  <div className="absolute -bottom-1 -right-1 size-4 bg-emerald-500 border-2 border-neutral-950 rounded-full" />
                </div>
                <div>
                  <h3 className="font-black text-white tracking-tight flex items-center gap-2">
                    {t("chatbot.guard")} <Sparkles size={14} className="text-amber-500" />
                  </h3>
                  <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-black">{t("chatbot.status")}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl text-neutral-500 hover:text-white hover:bg-white/5 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar scroll-smooth">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    <div className={`mt-auto size-7 rounded-lg flex items-center justify-center flex-shrink-0 ${msg.role === "user" ? "bg-amber-500/20 text-amber-500" : "bg-neutral-800 text-neutral-400"}`}>
                      {msg.role === "user" ? <User size={14} /> : <Bot size={14} />}
                    </div>
                    <div
                      className={`p-4 rounded-[1.5rem] text-[13.5px] font-medium leading-relaxed shadow-sm ${
                        msg.role === "user"
                          ? "bg-amber-500 text-black rounded-br-none"
                          : "bg-white/[0.03] text-neutral-200 border border-white/5 rounded-bl-none backdrop-blur-sm"
                      }`}
                    >
                      {msg.parts[0].text}
                    </div>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start pl-10"
                >
                  <div className="bg-white/[0.02] p-4 rounded-[1.5rem] rounded-bl-none border border-white/5 flex items-center gap-3 text-neutral-400 text-xs font-black uppercase tracking-widest">
                    <Loader2 size={16} className="animate-spin text-amber-500" />
                    {t("chatbot.connecting")}
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-6 pt-2 border-t border-white/5 bg-neutral-900/30">
              <div className="relative group">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t("chatbot.placeholder")}
                  className="w-full bg-neutral-900/50 border border-white/10 rounded-2xl py-4 pl-5 pr-14 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500/40 focus:ring-4 focus:ring-amber-500/5 transition-all duration-300"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 group-hover:scale-110 active:scale-95 p-2.5 rounded-xl bg-amber-500 text-black disabled:opacity-30 disabled:grayscale disabled:scale-100 transition-all duration-300 shadow-lg shadow-amber-500/20"
                >
                  <Send size={18} strokeWidth={2.5} />
                </button>
              </div>
              <p className="text-[10px] text-neutral-600 mt-4 text-center select-none font-bold uppercase tracking-[0.2em]">
                {t("chatbot.labels")}
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatBot;
