'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { LogOut, User as UserIcon } from 'lucide-react';
import { ChatInterface } from '@/components/ChatInterface';
import { Sidebar } from '@/components/layout/Sidebar';
import { BackgroundEffects } from '@/components/layout/BackgroundEffects';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const { user, logout } = useAuth();

  const handleNewChat = useCallback(() => {
    setCurrentSessionId(null);
  }, []);

  const handleSelectSession = useCallback((sessionId: string) => {
    setCurrentSessionId(sessionId);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
      alert('Logout failed. Please try again.');
    }
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white relative overflow-hidden flex">
        {/* Animated Background */}
        <BackgroundEffects />

        {/* Sidebar */}
        <Sidebar
          currentSessionId={currentSessionId}
          onNewChat={handleNewChat}
          onSelectSession={handleSelectSession}
        />

        {/* Main Content */}
        <div className="flex-1 ml-[280px] relative z-10">
          {/* Top Right User Menu */}
          {user && (
            <div className="absolute top-6 right-6 flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-800/50 rounded-lg border border-gray-700/50">
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="w-8 h-8 rounded-full ring-2 ring-gray-500/20"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center">
                    <UserIcon className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className="hidden sm:block">
                  <p className="text-xs font-medium text-white">{user.name}</p>
                  <p className="text-[10px] text-gray-400">{user.email}</p>
                </div>
              </div>
              <motion.button
                type="button"
                onClick={handleLogout}
                className="p-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 rounded-lg transition-colors text-gray-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </motion.button>
            </div>
          )}

          <div className="max-w-6xl mx-auto px-6 py-6">
            <ChatInterface
              sessionId={currentSessionId}
              onSessionChange={setCurrentSessionId}
            />
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
