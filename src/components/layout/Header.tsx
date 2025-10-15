'use client';

import { motion } from 'framer-motion';
import { Sparkles, Github, ExternalLink } from 'lucide-react';

export function Header() {
  return (
    <motion.header
      className="relative z-10 border-b border-gray-800/50 backdrop-blur-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className="p-2 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl"
              whileHover={{ scale: 1.1, rotate: 180 }}
              transition={{ type: 'spring' }}
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 bg-clip-text text-transparent">
                HybridLM
              </h1>
              <p className="text-xs text-gray-400">Intelligent Query Routing</p>
            </div>
          </div>
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
    </motion.header>
  );
}
