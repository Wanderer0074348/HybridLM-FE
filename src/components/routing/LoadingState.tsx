'use client';

import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

export function LoadingState() {
  return (
    <div className="relative h-[600px] flex items-center justify-center bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-2xl border border-gray-700/50">
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="relative">
          {/* Outer spinning ring */}
          <motion.div
            className="w-24 h-24 border-4 border-gray-600/30 border-t-gray-400 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />

          {/* Inner spinning ring (opposite direction) */}
          <motion.div
            className="absolute inset-2 border-4 border-gray-500/30 border-b-gray-300 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />

          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Zap className="w-10 h-10 text-gray-300" />
            </motion.div>
          </div>
        </div>

        {/* Loading text */}
        <motion.p
          className="absolute bottom-1/3 text-sm text-gray-400 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Routing query...
        </motion.p>
      </motion.div>
    </div>
  );
}
