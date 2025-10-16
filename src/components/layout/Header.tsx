'use client';

import { motion } from 'framer-motion';
import { Sparkles, Github, ExternalLink, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Header() {
  const pathname = usePathname();
  const isChat = pathname === '/chat';

  return (
    <motion.header
      className="relative z-10 border-b border-gray-800/50 backdrop-blur-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              className="p-2 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl group-hover:from-emerald-600 group-hover:to-emerald-700 transition-colors"
              whileHover={{ scale: 1.1, rotate: 180 }}
              transition={{ type: 'spring' }}
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 bg-clip-text text-transparent group-hover:from-emerald-200 group-hover:to-emerald-400 transition-all">
                HybridLM
              </h1>
              <p className="text-xs text-gray-400">Intelligent Query Routing</p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            {!isChat && (
              <Link href="/chat">
                <motion.div
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/40 rounded-lg text-sm transition-colors text-emerald-400"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MessageSquare className="w-4 h-4" />
                  Try Chat Mode
                </motion.div>
              </Link>
            )}

            <motion.a
              href="https://github.com/Wanderer0074348/HybridLM"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 rounded-lg text-sm transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Github className="w-4 h-4" />
              View on GitHub
              <ExternalLink className="w-3 h-3" />
            </motion.a>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
