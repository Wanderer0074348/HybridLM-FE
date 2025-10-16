'use client';

import { useState, KeyboardEvent } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

export function ChatInput({ onSend, isLoading, placeholder = 'Type your message...' }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative">
      <div className="relative flex items-end gap-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-3 focus-within:border-emerald-500/50 transition-colors">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={placeholder}
          disabled={isLoading}
          rows={1}
          className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none resize-none min-h-[40px] max-h-[200px] py-2 px-1"
          style={{
            height: 'auto',
            minHeight: '40px',
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = target.scrollHeight + 'px';
          }}
        />

        <motion.button
          onClick={handleSend}
          disabled={!message.trim() || isLoading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex-shrink-0 p-2.5 rounded-xl transition-all ${
            message.trim() && !isLoading
              ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/20'
              : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </motion.button>
      </div>

      {/* Hint text */}
      <div className="mt-2 text-xs text-gray-500 text-center">
        Press <kbd className="px-2 py-0.5 bg-gray-800 rounded border border-gray-700">Enter</kbd> to send, <kbd className="px-2 py-0.5 bg-gray-800 rounded border border-gray-700">Shift+Enter</kbd> for new line
      </div>
    </div>
  );
}
