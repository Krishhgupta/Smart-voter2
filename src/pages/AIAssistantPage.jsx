import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';
import apiClient from '../api/client';

const AIAssistantPage = () => {
  const { t, lang } = useLanguage();
  const [messages, setMessages] = useState([
    { id: 1, text: t('assistantGreeting'), isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    
    // Add user message immediately
    setMessages(prev => [...prev, { id: Date.now(), text: userMessage, isBot: false }]);
    setInput('');
    setIsLoading(true);

    try {
      // Call backend API via Axios
      const response = await apiClient.post('/assistant/chat', { 
        message: userMessage, 
        lang 
      });

      const data = response.data;

      // Add bot response
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: data.reply, 
        isBot: true 
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      toast.error(error.message || t('assistantError'));
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: t('assistantError'), 
        isBot: true 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 h-[calc(100vh-64px-73px)] flex flex-col transition-colors duration-300">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white transition-colors duration-300">{t('assistant')}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 transition-colors duration-300">{t('assistantSubtitle')}</p>
      </div>

      <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden transition-colors duration-300">
        {/* Chat window */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900/50 transition-colors duration-300">
          {messages.map(msg => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={msg.id} 
              className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`flex max-w-[80%] gap-3 ${msg.isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${msg.isBot ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400' : 'bg-secondary-100 dark:bg-secondary-900/50 text-secondary-600 dark:text-secondary-400'}`}>
                  {msg.isBot ? <Bot size={18} /> : <User size={18} />}
                </div>
                <div className={`px-4 py-3 rounded-2xl transition-colors duration-300 ${msg.isBot ? 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-tl-none whitespace-pre-wrap' : 'bg-primary-600 text-white rounded-tr-none whitespace-pre-wrap'}`}>
                  <p className="text-sm md:text-base leading-relaxed">{msg.text}</p>
                </div>
              </div>
            </motion.div>
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex gap-3 flex-row">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 transition-colors duration-300">
                  <Bot size={18} />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-tl-none flex items-center gap-2 transition-colors duration-300">
                  <Loader2 className="w-4 h-4 animate-spin text-primary-500" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">{t('typing')}</span>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input box */}
        <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 transition-colors duration-300">
          <form onSubmit={handleSend} className="flex gap-2 items-end">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('chatPlaceholder')}
              className="flex-1 bg-slate-100 dark:bg-slate-700 dark:text-white border-none rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors resize-none max-h-32 min-h-[50px]"
              rows="1"
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isLoading}
              className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={18} className={input.trim() && !isLoading ? 'ml-1' : ''} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPage;
