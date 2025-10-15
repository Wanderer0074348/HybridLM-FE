'use client';

import { motion } from 'framer-motion';

export function Hero() {
  return (
    <motion.div
      className="text-center space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <motion.h2
        className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
      >
        Ask Anything
      </motion.h2>
      <p className="text-gray-400 text-lg max-w-2xl mx-auto">
        Watch in real-time as your queries are intelligently routed between{' '}
        <span className="text-gray-200 font-semibold">Cloud LLM</span> and{' '}
        <span className="text-gray-300 font-semibold">Edge SLM</span>
      </p>
    </motion.div>
  );
}
