'use client';

import { motion } from 'framer-motion';
import { User, Bot, Sparkles, Cpu, Cloud, Database, Clock, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChatMessage as ChatMessageType } from '@/types/api';
import { useState } from 'react';

interface ChatMessageProps {
  message: ChatMessageType;
  isLatest?: boolean;
}

export function ChatMessage({ message, isLatest }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';
  const [showMetadata, setShowMetadata] = useState(false);

  const hasMetadata = !isUser && !isSystem && message.metadata;

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

        {/* Timestamp and Metadata Toggle */}
        <div className={`flex items-center gap-2 mt-1 text-xs text-gray-500 ${isUser ? 'justify-end' : 'justify-start'}`}>
          <span>
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          {hasMetadata && (
            <button
              onClick={() => setShowMetadata(!showMetadata)}
              className="flex items-center gap-1 text-gray-500 hover:text-emerald-400 transition-colors"
            >
              <span className="text-xs">Details</span>
              {showMetadata ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}
        </div>

        {/* Metadata Panel */}
        {hasMetadata && showMetadata && message.metadata && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 p-3 bg-gray-900/50 border border-gray-700/50 rounded-lg space-y-2"
          >
            {/* Model Used */}
            <div className="flex items-center gap-2 text-xs">
              {message.metadata.model_used === 'cloud-llm' || message.metadata.model_used?.includes('gpt') ? (
                <Cloud className="w-4 h-4 text-blue-400" />
              ) : (
                <Cpu className="w-4 h-4 text-emerald-400" />
              )}
              <span className="text-gray-400">Model:</span>
              <span className="text-gray-200 font-medium">
                {message.metadata.model_used === 'cloud-llm'
                  ? message.metadata.cost_metrics?.model || 'Cloud LLM'
                  : message.metadata.cost_metrics?.model || 'Edge SLM'}
              </span>
              {message.metadata.cache_hit && (
                <span className="ml-2 px-2 py-0.5 bg-gray-700/50 border border-gray-600/50 rounded text-gray-300 flex items-center gap-1">
                  <Database className="w-3 h-3" />
                  Cached
                </span>
              )}
            </div>

            {/* Routing Reason */}
            {message.metadata.routing_reason && (
              <div className="flex items-start gap-2 text-xs">
                <Sparkles className="w-4 h-4 text-purple-400 mt-0.5" />
                <span className="text-gray-400">Routing:</span>
                <span className="text-gray-300 flex-1">
                  {message.metadata.routing_reason}
                  {(message.metadata.routing_reason.includes('ML model') ||
                    message.metadata.routing_reason.includes('Exploration')) && (
                    <span className="ml-2 px-2 py-0.5 bg-purple-700/30 border border-purple-600/50 rounded text-purple-300 text-xs">
                      RL
                    </span>
                  )}
                </span>
              </div>
            )}

            {/* Performance Metrics */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {message.metadata.latency !== undefined && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-400">Latency:</span>
                  <span className="text-gray-200">{(message.metadata.latency / 1000000).toFixed(0)}ms</span>
                </div>
              )}

              {message.metadata.cost_metrics && (
                <div className="flex items-center gap-1.5">
                  <DollarSign className="w-3 h-3 text-green-400" />
                  <span className="text-gray-400">Cost:</span>
                  <span className="text-gray-200">
                    {message.metadata.cost_metrics.total_cost < 0.0001
                      ? `$${(message.metadata.cost_metrics.total_cost * 1000000).toFixed(2)}µ`
                      : `$${message.metadata.cost_metrics.total_cost.toFixed(6)}`}
                  </span>
                </div>
              )}
            </div>

            {/* Cost Savings */}
            {message.metadata.cost_metrics && message.metadata.cost_metrics.estimated_savings > 0 && (
              <div className="pt-2 border-t border-gray-700/50 text-xs">
                <span className="text-green-400">
                  💰 Saved ${message.metadata.cost_metrics.estimated_savings < 0.0001
                    ? (message.metadata.cost_metrics.estimated_savings * 1000000).toFixed(2) + 'µ'
                    : message.metadata.cost_metrics.estimated_savings.toFixed(6)} by using SLM
                </span>
              </div>
            )}

            {/* Token Usage */}
            {message.metadata.cost_metrics && (
              <div className="text-xs text-gray-500">
                Tokens: {message.metadata.cost_metrics.input_tokens} in / {message.metadata.cost_metrics.output_tokens} out
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
