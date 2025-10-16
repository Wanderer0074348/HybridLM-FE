'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, BarChart3, Clock, Zap } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { apiClient } from '@/lib/api';
import { ChatMessage as ChatMessageType, ChatResponse } from '@/types/api';

export function ChatInterface() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalMessages: 0,
    totalTokens: 0,
    avgLatency: 0,
    cacheHits: 0,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatResponses = useRef<ChatResponse[]>([]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    setIsLoading(true);
    setError(null);

    // Add user message immediately
    const userMessage: ChatMessageType = {
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await apiClient.chat({
        session_id: sessionId || undefined,
        message: content,
      });

      // Update session ID if this is the first message
      if (!sessionId) {
        setSessionId(response.session_id);
      }

      // Add assistant message
      const assistantMessage: ChatMessageType = {
        role: 'assistant',
        content: response.response,
        timestamp: response.timestamp,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Update stats
      chatResponses.current.push(response);
      updateStats(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      // Remove the optimistic user message on error
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const updateStats = (response: ChatResponse) => {
    const responses = chatResponses.current;
    const totalLatency = responses.reduce((sum, r) => sum + r.latency, 0);
    const cacheHits = responses.filter((r) => r.cache_hit).length;

    setStats({
      totalMessages: response.message_count,
      totalTokens: responses.reduce((sum, r) => sum + (r.cost_metrics?.total_tokens || 0), 0),
      avgLatency: totalLatency / responses.length / 1e9, // Convert from nanoseconds to seconds
      cacheHits,
    });
  };

  const handleNewChat = () => {
    if (window.confirm('Start a new conversation? This will clear the current chat.')) {
      setSessionId(null);
      setMessages([]);
      chatResponses.current = [];
      setStats({
        totalMessages: 0,
        totalTokens: 0,
        avgLatency: 0,
        cacheHits: 0,
      });
    }
  };

  const handleDeleteSession = async () => {
    if (!sessionId) return;

    if (window.confirm('Delete this conversation permanently?')) {
      try {
        await apiClient.deleteSession(sessionId);
        handleNewChat();
      } catch (err) {
        setError('Failed to delete session');
      }
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800/50">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Chat with HybridLM
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Context-aware conversational AI
            {sessionId && (
              <span className="ml-2 text-emerald-500">
                • Session: {sessionId.slice(0, 8)}...
              </span>
            )}
          </p>
        </div>

        {/* Stats and Actions */}
        <div className="flex items-center gap-3">
          {messages.length > 0 && (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-4 text-xs text-gray-400 bg-gray-800/50 rounded-lg px-4 py-2 border border-gray-700/50"
              >
                <div className="flex items-center gap-1">
                  <BarChart3 className="w-4 h-4 text-emerald-400" />
                  <span>{stats.totalMessages} msgs</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span>{stats.avgLatency.toFixed(2)}s avg</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span>{stats.cacheHits} cached</span>
                </div>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDeleteSession}
                className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
                title="Delete conversation"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </>
          )}

          {messages.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNewChat}
              className="px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-colors text-sm font-medium"
            >
              New Chat
            </motion.button>
          )}
        </div>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto mb-6 space-y-4 pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">💬</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              Start a Conversation
            </h3>
            <p className="text-gray-500 max-w-md">
              Ask me anything! I remember our conversation context and provide intelligent, cost-optimized responses.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 max-w-lg">
              <button
                onClick={() => handleSendMessage('What is machine learning?')}
                className="p-3 text-left bg-gray-800/50 hover:bg-gray-800 rounded-lg border border-gray-700/50 hover:border-emerald-500/50 transition-colors text-sm"
              >
                <span className="text-emerald-400">💡</span> What is machine learning?
              </button>
              <button
                onClick={() => handleSendMessage('Explain neural networks simply')}
                className="p-3 text-left bg-gray-800/50 hover:bg-gray-800 rounded-lg border border-gray-700/50 hover:border-emerald-500/50 transition-colors text-sm"
              >
                <span className="text-blue-400">🧠</span> Explain neural networks
              </button>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                message={message}
                isLatest={index === messages.length - 1}
              />
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
                <div className="flex-1">
                  <div className="inline-block bg-gray-800/80 rounded-2xl px-5 py-3 border border-gray-700/50">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}
