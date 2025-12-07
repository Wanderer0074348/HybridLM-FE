'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Plus,
  BarChart3,
  Sparkles,
  Trash2,
  Clock,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { SessionMetadata } from '@/types/api';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  currentSessionId?: string | null;
  onNewChat: () => void;
  onSelectSession?: (sessionId: string) => void;
}

export function Sidebar({ currentSessionId, onNewChat, onSelectSession }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [sessions, setSessions] = useState<SessionMetadata[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
      alert('Logout failed. Please try again.');
    }
  };

  useEffect(() => {
    loadSessions();
  }, [currentSessionId]);

  const loadSessions = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.listSessions();
      // Check if response.sessions is an array of SessionMetadata
      if (response.sessions.length > 0 && typeof response.sessions[0] === 'object') {
        setSessions(response.sessions as SessionMetadata[]);
      } else {
        setSessions([]);
      }
    } catch (err) {
      console.error('Failed to load sessions:', err);
      setSessions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this conversation?')) return;

    try {
      await apiClient.deleteSession(sessionId);
      await loadSessions();
      if (currentSessionId === sessionId) {
        onNewChat();
      }
    } catch (err) {
      console.error('Failed to delete session:', err);
    }
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0, width: isCollapsed ? 80 : 280 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed left-0 top-0 h-screen bg-gray-950/95 border-r border-gray-800/50 backdrop-blur-sm z-50 flex flex-col"
    >
      {/* Logo & Toggle */}
      <div className="p-4 border-b border-gray-800/50 flex items-center justify-between">
        {!isCollapsed && (
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              className="p-2 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg"
              whileHover={{ scale: 1.1, rotate: 180 }}
              transition={{ type: 'spring' }}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
                HybridLM
              </h1>
            </div>
          </Link>
        )}
        <motion.button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-400" />
          )}
        </motion.button>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <motion.button
          onClick={onNewChat}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 bg-gray-700/30 hover:bg-gray-700/50 border border-gray-600/50 rounded-lg text-gray-200 transition-colors`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-5 h-5" />
          {!isCollapsed && <span className="font-medium">New Chat</span>}
        </motion.button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-3 space-y-1">
        {!isCollapsed && (
          <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
            Recent Chats
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : sessions.length === 0 ? (
          !isCollapsed && (
            <div className="px-3 py-8 text-center text-sm text-gray-500">
              No previous chats
            </div>
          )
        ) : (
          <AnimatePresence>
            {sessions.map((session, index) => (
              <motion.button
                key={session.session_id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onSelectSession?.(session.session_id)}
                className={`w-full group relative ${isCollapsed ? 'p-3' : 'px-3 py-2'} rounded-lg transition-all ${
                  currentSessionId === session.session_id
                    ? 'bg-gray-700/50 border border-gray-600'
                    : 'hover:bg-gray-800/50 border border-transparent'
                }`}
              >
                <div className="flex items-start gap-2">
                  <MessageSquare className={`${isCollapsed ? 'w-5 h-5' : 'w-4 h-4'} text-gray-400 flex-shrink-0 mt-0.5`} />
                  {!isCollapsed && (
                    <div className="flex-1 text-left min-w-0">
                      <div className="text-sm text-gray-200 truncate font-medium">
                        {session.title}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {formatRelativeTime(session.last_interaction)}
                      </div>
                    </div>
                  )}
                  {!isCollapsed && (
                    <motion.div
                      onClick={(e) => handleDeleteSession(session.session_id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-700/50 transition-opacity cursor-pointer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 className="w-3 h-3 text-gray-400" />
                    </motion.div>
                  )}
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Navigation */}
      <div className="border-t border-gray-800/50 p-3 space-y-1">
        <Link href="/analytics">
          <motion.div
            className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2 rounded-lg transition-colors ${
              pathname === '/analytics'
                ? 'bg-gray-700/50 text-gray-200 border border-gray-600'
                : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <BarChart3 className="w-5 h-5" />
            {!isCollapsed && <span className="text-sm font-medium">Analytics</span>}
          </motion.div>
        </Link>
      </div>
    </motion.aside>
  );
}
