'use client';

import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User as UserIcon } from 'lucide-react';

export default function UserMenu() {
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

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-3 px-3 py-2 bg-gray-800/30 rounded-lg border border-gray-700/50">
        {user.picture ? (
          <img
            src={user.picture}
            alt={user.name}
            className="w-8 h-8 rounded-full ring-2 ring-emerald-500/20"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
            <UserIcon className="w-4 h-4 text-white" />
          </div>
        )}
        <div className="hidden sm:block">
          <p className="text-sm font-medium text-white">{user.name}</p>
          <p className="text-xs text-gray-400">{user.email}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 rounded-lg text-sm transition-colors text-red-400"
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden sm:inline">Sign out</span>
      </button>
    </div>
  );
}
