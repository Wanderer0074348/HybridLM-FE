'use client';

import { motion } from 'framer-motion';
import { InferenceResponse } from '@/types/api';
import { TrendingUp, Activity, Zap, Target } from 'lucide-react';
import { useMemo } from 'react';

interface StatisticsProps {
  responses: InferenceResponse[];
}

export function Statistics({ responses }: StatisticsProps) {
  const stats = useMemo(() => {
    if (responses.length === 0) {
      return {
        totalQueries: 0,
        avgLatency: 0,
        cacheHitRate: 0,
        llmUsageRate: 0,
      };
    }

    const totalQueries = responses.length;
    const avgLatency =
      responses.reduce((sum, r) => sum + r.latency, 0) / totalQueries / 1000000;
    const cacheHits = responses.filter((r) => r.cache_hit).length;
    const cacheHitRate = (cacheHits / totalQueries) * 100;
    // Check if model_used is NOT "edge-slm" to count as LLM (handles "cloud-llm" and other LLM models)
    const llmUsage = responses.filter((r) => r.model_used !== 'edge-slm').length;
    const llmUsageRate = (llmUsage / totalQueries) * 100;

    return {
      totalQueries,
      avgLatency,
      cacheHitRate,
      llmUsageRate,
    };
  }, [responses]);

  const statCards = [
    {
      title: 'Total Queries',
      value: stats.totalQueries.toString(),
      icon: Activity,
      color: 'blue',
      suffix: '',
    },
    {
      title: 'Avg Latency',
      value: stats.avgLatency.toFixed(0),
      icon: Zap,
      color: 'yellow',
      suffix: 'ms',
    },
    {
      title: 'Cache Hit Rate',
      value: stats.cacheHitRate.toFixed(1),
      icon: Target,
      color: 'green',
      suffix: '%',
    },
    {
      title: 'LLM Usage',
      value: stats.llmUsageRate.toFixed(1),
      icon: TrendingUp,
      color: 'purple',
      suffix: '%',
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          Session Statistics
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              className={`bg-gradient-to-br ${getColorGradient(
                stat.color
              )} border ${getColorBorder(stat.color)} rounded-xl p-4 backdrop-blur-sm`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`w-5 h-5 ${getColorText(stat.color)}`} />
                <motion.span
                  className={`text-2xl font-bold ${getColorText(stat.color)}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.2, type: 'spring' }}
                >
                  {stat.value}
                  <span className="text-sm ml-0.5">{stat.suffix}</span>
                </motion.span>
              </div>
              <p className="text-xs font-medium text-gray-400">{stat.title}</p>
            </motion.div>
          ))}
        </div>

        {/* Usage Distribution */}
        {responses.length > 0 && (
          <motion.div
            className="mt-4 bg-gray-900/50 border border-gray-700/50 rounded-xl p-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-400">
                Model Distribution
              </span>
              <span className="text-xs text-gray-500">
                {responses.length} total queries
              </span>
            </div>
            <div className="flex h-3 rounded-full overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-cyan-500"
                initial={{ width: 0 }}
                animate={{ width: `${stats.llmUsageRate}%` }}
                transition={{ delay: 0.8, duration: 1 }}
              />
              <motion.div
                className="bg-gradient-to-r from-orange-500 to-amber-500"
                initial={{ width: 0 }}
                animate={{ width: `${100 - stats.llmUsageRate}%` }}
                transition={{ delay: 0.8, duration: 1 }}
              />
            </div>
            <div className="flex items-center justify-between mt-2 text-xs">
              <span className="text-blue-400">
                Cloud LLM: {stats.llmUsageRate.toFixed(1)}%
              </span>
              <span className="text-orange-400">
                Edge SLM: {(100 - stats.llmUsageRate).toFixed(1)}%
              </span>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

function getColorGradient(color: string): string {
  const gradients: Record<string, string> = {
    blue: 'from-blue-500/10 to-blue-600/10',
    yellow: 'from-yellow-500/10 to-yellow-600/10',
    green: 'from-green-500/10 to-green-600/10',
    purple: 'from-purple-500/10 to-purple-600/10',
  };
  return gradients[color] || gradients.blue;
}

function getColorBorder(color: string): string {
  const borders: Record<string, string> = {
    blue: 'border-blue-500/20',
    yellow: 'border-yellow-500/20',
    green: 'border-green-500/20',
    purple: 'border-purple-500/20',
  };
  return borders[color] || borders.blue;
}

function getColorText(color: string): string {
  const texts: Record<string, string> = {
    blue: 'text-blue-400',
    yellow: 'text-yellow-400',
    green: 'text-green-400',
    purple: 'text-purple-400',
  };
  return texts[color] || texts.blue;
}
