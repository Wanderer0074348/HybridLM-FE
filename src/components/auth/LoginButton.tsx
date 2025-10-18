'use client';

import { useAuth } from '@/contexts/AuthContext';
import { LogIn } from 'lucide-react';

export default function LoginButton() {
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <button
      onClick={handleLogin}
      className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl"
    >
      <LogIn className="w-5 h-5" />
      Sign in with Google
    </button>
  );
}
