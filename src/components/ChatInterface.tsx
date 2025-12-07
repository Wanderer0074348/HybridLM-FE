'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Clock, Zap } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { apiClient } from '@/lib/api';
import { ChatMessage as ChatMessageType, ChatResponse } from '@/types/api';
import { useAnalytics } from '@/contexts/AnalyticsContext';

interface ChatInterfaceProps {
  sessionId?: string | null;
  onSessionChange?: (sessionId: string) => void;
}

export function ChatInterface({ sessionId: propSessionId, onSessionChange }: ChatInterfaceProps) {
  const { addResponse } = useAnalytics();
  const [sessionId, setSessionId] = useState<string | null>(propSessionId || null);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalMessages: 0,
    totalTokens: 0,
    avgLatency: 0,
    cacheHits: 0,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatResponses = useRef<ChatResponse[]>([]);

  // Load session when propSessionId changes
  useEffect(() => {
    if (propSessionId && propSessionId !== sessionId) {
      loadSession(propSessionId);
    } else if (propSessionId === null && sessionId !== null) {
      // New chat requested
      handleNewChat();
    }
  }, [propSessionId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadSession = async (id: string) => {
    try {
      setIsLoadingSession(true);
      const session = await apiClient.getSession(id);

      // Convert session messages to chat messages
      const chatMessages: ChatMessageType[] = session.messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp,
      }));

      setMessages(chatMessages);
      setSessionId(id);
      setStats({
        totalMessages: session.message_count,
        totalTokens: session.total_tokens,
        avgLatency: 0,
        cacheHits: 0,
      });
      chatResponses.current = [];
    } catch (err) {
      setError('Failed to load session');
      console.error('Failed to load session:', err);
    } finally {
      setIsLoadingSession(false);
    }
  };

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
      const { data: response, decisionId } = await apiClient.chat({
        session_id: sessionId || undefined,
        message: content,
      });

      // Update session ID if this is the first message
      if (!sessionId) {
        setSessionId(response.session_id);
        onSessionChange?.(response.session_id);
      }

      // Add assistant message with metadata
      const assistantMessage: ChatMessageType = {
        role: 'assistant',
        content: response.response,
        timestamp: response.timestamp,
        metadata: {
          model_used: response.model_used,
          routing_reason: response.routing_reason,
          latency: response.latency,
          cache_hit: response.cache_hit,
          cost_metrics: response.cost_metrics,
          decision_id: decisionId,
        },
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Update stats and analytics
      chatResponses.current.push(response);
      updateStats(response);
      addResponse(response); // Save to analytics
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
    setSessionId(null);
    setMessages([]);
    chatResponses.current = [];
    setStats({
      totalMessages: 0,
      totalTokens: 0,
      avgLatency: 0,
      cacheHits: 0,
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] max-w-5xl mx-auto">
      {/* Simple Header with Stats */}
      {messages.length > 0 && (
        <div className="flex items-center justify-end mb-4 pb-3 border-b border-gray-800/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-4 text-xs text-gray-400 bg-gray-800/50 rounded-lg px-4 py-2 border border-gray-700/50"
          >
            <div className="flex items-center gap-1">
              <BarChart3 className="w-4 h-4 text-gray-400" />
              <span>{stats.totalMessages} msgs</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>{stats.avgLatency.toFixed(2)}s avg</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-gray-400" />
              <span>{stats.cacheHits} cached</span>
            </div>
          </motion.div>
        </div>
      )}

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
        {isLoadingSession ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-12 h-12 border-4 border-gray-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-400">Loading conversation...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-700/30 to-gray-600/30 rounded-full flex items-center justify-center mb-4">
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
                className="p-3 text-left bg-gray-800/50 hover:bg-gray-800 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-colors text-sm"
              >
                <span className="text-gray-400">💡</span> What is machine learning?
              </button>
              <button
                onClick={() => handleSendMessage('Explain neural networks simply')}
                className="p-3 text-left bg-gray-800/50 hover:bg-gray-800 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-colors text-sm"
              >
                <span className="text-gray-400">🧠</span> Explain neural networks
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
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
                <div className="flex-1">
                  <div className="inline-block bg-gray-800/80 rounded-2xl px-5 py-3 border border-gray-700/50">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
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
