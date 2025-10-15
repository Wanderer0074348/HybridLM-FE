'use client';

import { CostMetrics as CostMetricsType } from '@/types/api';
import { DollarSign, TrendingDown, Coins, Zap } from 'lucide-react';

interface CostMetricsProps {
  metrics: CostMetricsType;
  cacheHit: boolean;
}

export function CostMetrics({ metrics, cacheHit }: CostMetricsProps) {
  // Format cost to display in a readable way
  const formatCost = (cost: number) => {
    if (cost === 0) return '$0.00';
    if (cost < 0.0001) return `$${(cost * 1000000).toFixed(2)}µ`;
    if (cost < 0.01) return `$${(cost * 1000).toFixed(4)}m`;
    return `$${cost.toFixed(6)}`;
  };

  const formatTokens = (tokens: number) => {
    if (tokens >= 1000) return `${(tokens / 1000).toFixed(1)}K`;
    return tokens.toString();
  };

  return (
    <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-xl border border-gray-700/50 p-6 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="w-5 h-5 text-green-400" />
        <h3 className="text-lg font-semibold text-white">Cost Analysis</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Cost */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-400">Total Cost</span>
          </div>
          <p className="text-xl font-bold text-white">
            {formatCost(metrics.total_cost)}
          </p>
        </div>

        {/* Inference Cost */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-400">
              {cacheHit ? 'Cached' : 'Inference'}
            </span>
          </div>
          <p className="text-xl font-bold text-gray-300">
            {formatCost(metrics.cost)}
          </p>
        </div>

        {/* Tokens Used */}
        <div className="space-y-1">
          <span className="text-xs text-gray-400">Tokens</span>
          <p className="text-xl font-bold text-gray-300">
            {formatTokens(metrics.total_tokens)}
          </p>
          <p className="text-xs text-gray-500">
            {formatTokens(metrics.input_tokens)}in / {formatTokens(metrics.output_tokens)}out
          </p>
        </div>

        {/* Savings */}
        {metrics.estimated_savings > 0 && (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4 text-green-400" />
              <span className="text-xs text-gray-400">Saved</span>
            </div>
            <p className="text-xl font-bold text-green-400">
              {formatCost(metrics.estimated_savings)}
            </p>
          </div>
        )}
      </div>

      {/* Detailed Breakdown */}
      {(cacheHit || metrics.estimated_savings > 0) && (
        <div className="mt-4 pt-4 border-t border-gray-700/50 text-sm text-gray-400">
          {cacheHit ? (
            <div className="flex items-center justify-between">
              <span>Cache hit saved full inference cost</span>
              <span className="text-green-400 font-semibold">
                -{formatCost(metrics.estimated_savings)}
              </span>
            </div>
          ) : metrics.estimated_savings > 0 ? (
            <div className="flex items-center justify-between">
              <span>SLM saved vs. Cloud LLM</span>
              <span className="text-green-400 font-semibold">
                -{formatCost(metrics.estimated_savings)}
              </span>
            </div>
          ) : null}

          {metrics.cache_cost > 0 && (
            <div className="flex items-center justify-between mt-2">
              <span>Embedding generation</span>
              <span className="text-gray-500">
                +{formatCost(metrics.cache_cost)}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Model Info */}
      <div className="mt-3 text-xs text-gray-500">
        Model: <span className="text-gray-400 font-mono">{metrics.model}</span>
      </div>
    </div>
  );
}
