'use client';

import { motion } from 'framer-motion';

interface RoutingBadgeProps {
  reason: string;
  delay: number;
}

export function RoutingBadge({ reason, delay }: RoutingBadgeProps) {
  return (
    <motion.div
      className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full border border-gray-700/50"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay }}
    >
      <p className="text-xs text-gray-300">
        <span className="font-semibold text-white">{reason}</span>
      </p>
    </motion.div>
  );
}
