'use client';

import { motion } from 'framer-motion';
import { Cpu, Cloud, Zap, Database } from 'lucide-react';

interface ModelNodeProps {
  type: 'query' | 'cache' | 'llm' | 'slm';
  position: 'top-center' | 'middle-center' | 'bottom-left' | 'bottom-right';
  delay: number;
  isActive?: boolean;
}

const nodeConfig = {
  query: {
    icon: Zap,
    gradient: 'from-gray-600 to-gray-700',
    label: 'Query',
    size: 'w-16 h-16',
    iconSize: 'w-8 h-8',
    labelColor: 'text-gray-300',
  },
  cache: {
    icon: Database,
    gradient: 'from-gray-500 to-gray-600',
    label: 'Cache',
    size: 'w-16 h-16',
    iconSize: 'w-8 h-8',
    labelColor: 'text-gray-300',
  },
  llm: {
    icon: Cloud,
    gradient: 'from-gray-400 to-gray-500',
    label: 'Cloud LLM',
    size: 'w-24 h-24',
    iconSize: 'w-12 h-12',
    labelColor: 'text-gray-200',
  },
  slm: {
    icon: Cpu,
    gradient: 'from-gray-500 to-gray-600',
    label: 'Edge SLM',
    size: 'w-24 h-24',
    iconSize: 'w-12 h-12',
    labelColor: 'text-gray-200',
  },
};

const positionClasses = {
  'top-center': 'left-1/2 -translate-x-1/2 top-12',
  'middle-center': 'left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2',
  'bottom-left': 'left-1/4 -translate-x-1/2 bottom-12',
  'bottom-right': 'right-1/4 translate-x-1/2 bottom-12',
};

export function ModelNode({ type, position, delay, isActive }: ModelNodeProps) {
  const config = nodeConfig[type];
  const Icon = config.icon;
  const shouldPulse = type !== 'query' && isActive;

  return (
    <motion.div
      className={`absolute ${positionClasses[position]} z-10`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, type: 'spring', stiffness: 200 }}
    >
      <div className="relative flex flex-col items-center gap-3">
        <div className="relative">
          <motion.div
            className={`${config.size} rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-2xl ${
              isActive === false ? 'opacity-30' : 'opacity-100'
            }`}
            animate={shouldPulse ? {
              scale: [1, 1.1, 1],
              boxShadow: [
                '0 10px 40px rgba(0,0,0,0.3)',
                '0 10px 60px rgba(255, 255, 255, 0.4)',
                '0 10px 40px rgba(0,0,0,0.3)',
              ]
            } : { scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: delay + 0.5 }}
          >
            <Icon className={`${config.iconSize} text-white`} />
          </motion.div>

          {/* Active indicator ring */}
          {shouldPulse && (
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-gray-300"
              initial={{ scale: 1, opacity: 0 }}
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.6, 0, 0.6]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
            />
          )}
        </div>

        <div className={`text-sm font-semibold whitespace-nowrap ${
          isActive ? config.labelColor : 'text-gray-500'
        }`}>
          {config.label}
        </div>
      </div>
    </motion.div>
  );
}
