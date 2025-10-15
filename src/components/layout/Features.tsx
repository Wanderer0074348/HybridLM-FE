'use client';

import { motion } from 'framer-motion';

const features = [
  {
    title: 'Intelligent Routing',
    description: 'Automatically routes queries to the optimal model based on complexity',
    gradient: 'from-gray-700/10 to-gray-800/10',
    border: 'border-gray-600/20',
  },
  {
    title: 'Real-time Visualization',
    description: 'Watch the decision-making process with beautiful animations',
    gradient: 'from-gray-600/10 to-gray-700/10',
    border: 'border-gray-500/20',
  },
  {
    title: 'Performance Metrics',
    description: 'Track latency, cache hits, and model distribution in real-time',
    gradient: 'from-gray-700/10 to-gray-800/10',
    border: 'border-gray-600/20',
  },
];

export function Features() {
  return (
    <motion.div
      className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      {features.map((feature, index) => (
        <motion.div
          key={index}
          className={`p-6 bg-gradient-to-br ${feature.gradient} border ${feature.border} rounded-xl backdrop-blur-sm`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 + index * 0.1 }}
          whileHover={{ scale: 1.05 }}
        >
          <h3 className="text-lg font-semibold text-white mb-2">
            {feature.title}
          </h3>
          <p className="text-sm text-gray-400">{feature.description}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
