'use client';

import { motion } from 'framer-motion';
import { InferenceResponse } from '@/types/api';
import { ArrowRight, Zap, Brain, Gauge, CheckCircle } from 'lucide-react';

interface FlowDiagramProps {
  response: InferenceResponse;
}

export function FlowDiagram({ response }: FlowDiagramProps) {
  const isLLM = response.model_used === 'cloud-llm';
  const stages = [
    {
      title: 'Query Analysis',
      description: 'Analyzing query complexity and context',
      icon: Zap,
      delay: 0,
    },
    {
      title: 'Routing Decision',
      description: response.routing_reason,
      icon: Brain,
      delay: 0.2,
    },
    {
      title: 'Model Selection',
      description: isLLM ? 'Using Cloud LLM' : 'Using Edge SLM',
      icon: Gauge,
      delay: 0.4,
    },
    {
      title: 'Response',
      description: `Generated in ${(response.latency / 1000000).toFixed(0)}ms`,
      icon: CheckCircle,
      delay: 0.6,
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div
        className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-2xl border border-gray-700/50 p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          Query Processing Flow
        </h3>

        <div className="space-y-4">
          {stages.map((stage, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: stage.delay }}
            >
              <div className="flex items-start gap-4">
                {/* Stage Number */}
                <motion.div
                  className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: stage.delay + 0.1, type: 'spring' }}
                >
                  {index + 1}
                </motion.div>

                {/* Stage Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <stage.icon className="w-5 h-5 text-blue-400" />
                    <h4 className="font-semibold text-white">{stage.title}</h4>
                  </div>
                  <p className="text-sm text-gray-400">{stage.description}</p>
                </div>

                {/* Arrow */}
                {index < stages.length - 1 && (
                  <motion.div
                    className="flex-shrink-0 mt-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: stage.delay + 0.2 }}
                  >
                    <ArrowRight className="w-5 h-5 text-gray-600" />
                  </motion.div>
                )}
              </div>

              {/* Connection Line */}
              {index < stages.length - 1 && (
                <motion.div
                  className="ml-5 h-8 w-0.5 bg-gradient-to-b from-purple-500 to-blue-500"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: stage.delay + 0.3 }}
                  style={{ transformOrigin: 'top' }}
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Cache Indicator */}
        {response.cache_hit && (
          <motion.div
            className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Cache Hit!</span>
              <span className="text-sm text-green-300">
                Response retrieved from cache for faster delivery
              </span>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
