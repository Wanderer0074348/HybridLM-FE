'use client';

import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User as UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface UserMenuProps {
  collapsed?: boolean;
}

export default function UserMenu({ collapsed = false }: UserMenuProps) {
  const { user, logout } = useAuth();

  if (!user) return null;

  const handleLogout = async () => {
    console.log('Logout button clicked');
    try {
      console.log('Calling logout...');
      await logout();
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
      alert('Logout failed. Please try again.');
    }
  };

  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-2">
        {user.picture ? (
          <img
            src={user.picture}
            alt={user.name}
            className="w-10 h-10 rounded-full ring-2 ring-emerald-500/20"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
            <UserIcon className="w-5 h-5 text-white" />
          </div>
        )}
        <motion.button
          type="button"
          onClick={handleLogout}
          className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 rounded-lg transition-colors text-red-400"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </motion.button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 flex-1 px-3 py-2 bg-gray-800/30 rounded-lg border border-gray-700/50">
        {user.picture ? (
          <img
            src={user.picture}
            alt={user.name}
            className="w-8 h-8 rounded-full ring-2 ring-emerald-500/20 flex-shrink-0"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
            <UserIcon className="w-4 h-4 text-white" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-white truncate">{user.name}</p>
          <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
        </div>
      </div>

      <motion.button
        type="button"
        onClick={handleLogout}
        className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 rounded-lg transition-colors text-red-400"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Sign out"
      >
        <LogOut className="w-4 h-4" />
      </motion.button>
    </div>
  );
}
