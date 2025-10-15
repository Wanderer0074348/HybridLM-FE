'use client';

import { motion } from 'framer-motion';

export function Footer() {
  return (
    <motion.footer
      className="relative z-10 border-t border-gray-800/50 backdrop-blur-sm mt-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-6 text-center text-sm text-gray-500">
        <p>
          Built with Next.js, React, Tailwind CSS, and Framer Motion
        </p>
      </div>
    </motion.footer>
  );
}
