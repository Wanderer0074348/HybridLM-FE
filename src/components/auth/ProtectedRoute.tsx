'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoginButton from './LoginButton';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4">
            <div className="w-16 h-16 border-4 border-gray-600/20 border-t-gray-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black relative overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-gradient-radial from-gray-800/20 via-transparent to-transparent"></div>

        <div className="relative z-10 text-center max-w-md space-y-8 p-8">
          {/* Logo */}
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl shadow-2xl">
              <svg className="w-12 h-12 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent">
                HybridLM
              </h1>
              <p className="text-sm text-gray-500 mt-1">Intelligent LLM Routing</p>
            </div>
          </div>

          {/* Lock icon and message */}
          <div className="space-y-4 pt-4">
            <div className="w-16 h-16 mx-auto rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-gray-200">Welcome Back</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Sign in with your Google account to access intelligent AI routing and chat history
              </p>
            </div>
          </div>

          {/* Login button */}
          <div className="pt-2">
            <LoginButton />
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-3 pt-4 text-xs">
            <div className="p-3 rounded-lg bg-gray-800/30 border border-gray-700/30">
              <div className="text-gray-400 mb-1">⚡ Smart Routing</div>
              <div className="text-gray-500">Edge & Cloud LLMs</div>
            </div>
            <div className="p-3 rounded-lg bg-gray-800/30 border border-gray-700/30">
              <div className="text-gray-400 mb-1">💾 Chat History</div>
              <div className="text-gray-500">Save your sessions</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
