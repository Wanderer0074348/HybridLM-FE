'use client';

import { ChatInterface } from '@/components/ChatInterface';
import { Header } from '@/components/layout/Header';
import { BackgroundEffects } from '@/components/layout/BackgroundEffects';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ChatPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <BackgroundEffects />

      {/* Header */}
      <Header />

      {/* Back Button */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-emerald-400 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Chat Interface */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-6">
        <ChatInterface />
      </div>
    </main>
  );
}
