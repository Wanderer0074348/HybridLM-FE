'use client';

import { motion } from 'framer-motion';
import { User, Bot, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChatMessage as ChatMessageType } from '@/types/api';

interface ChatMessageProps {
  message: ChatMessageType;
  isLatest?: boolean;
}

export function ChatMessage({ message, isLatest }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-6`}
    >
      {/* Avatar */}
      <div className={`flex-shrink-0 ${isSystem ? 'mx-auto' : ''}`}>
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isUser
              ? 'bg-gradient-to-br from-blue-500 to-blue-600'
              : isSystem
              ? 'bg-gradient-to-br from-purple-500 to-purple-600'
              : 'bg-gradient-to-br from-emerald-500 to-emerald-600'
          }`}
        >
          {isUser ? (
            <User className="w-5 h-5 text-white" />
          ) : isSystem ? (
            <Sparkles className="w-5 h-5 text-white" />
          ) : (
            <Bot className="w-5 h-5 text-white" />
          )}
        </div>
      </div>

      {/* Message Content */}
      <div className={`flex-1 ${isUser ? 'text-right' : 'text-left'} ${isSystem ? 'text-center' : ''}`}>
        <div
          className={`inline-block max-w-[85%] rounded-2xl px-5 py-3 ${
            isUser
              ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white'
              : isSystem
              ? 'bg-gradient-to-br from-purple-900/50 to-purple-800/50 border border-purple-700/50 text-purple-200 italic'
              : 'bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 text-gray-100'
          } ${isLatest && !isUser ? 'animate-pulse-subtle' : ''}`}
        >
          {isSystem ? (
            <p className="text-sm">{message.content}</p>
          ) : (
            <div className="prose prose-invert prose-sm max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc list-inside mb-2">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside mb-2">{children}</ol>,
                  li: ({ children }) => <li className="mb-1">{children}</li>,
                  code: ({ children, className }) => {
                    const isInline = !className;
                    return isInline ? (
                      <code className="bg-black/30 px-1.5 py-0.5 rounded text-emerald-300 font-mono text-sm">
                        {children}
                      </code>
                    ) : (
                      <code className="block bg-black/50 p-3 rounded-lg overflow-x-auto font-mono text-sm border border-gray-700/50">
                        {children}
                      </code>
                    );
                  },
                  strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                  em: ({ children }) => <em className="italic text-gray-300">{children}</em>,
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <div className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </motion.div>
  );
}
