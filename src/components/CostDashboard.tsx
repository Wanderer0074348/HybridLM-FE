'use client';

import { InferenceResponse } from '@/types/api';
import { DollarSign, TrendingDown, Zap, Database, BarChart3 } from 'lucide-react';
import { useMemo } from 'react';

interface CostDashboardProps {
  responses: InferenceResponse[];
}

export function CostDashboard({ responses }: CostDashboardProps) {
  const stats = useMemo(() => {
    let totalCost = 0;
    let totalSavings = 0;
    let cacheHits = 0;
    let llmCalls = 0;
    let slmCalls = 0;

    responses.forEach((resp) => {
      if (resp.cost_metrics) {
        totalCost += resp.cost_metrics.total_cost;
        totalSavings += resp.cost_metrics.estimated_savings;
      }
      if (resp.cache_hit) cacheHits++;
      if (resp.model_used === 'cloud-llm') llmCalls++;
      else slmCalls++;
    });

    const cacheHitRate = responses.length > 0 ? (cacheHits / responses.length) * 100 : 0;

    return {
      totalCost,
      totalSavings,
      totalQueries: responses.length,
      cacheHits,
      cacheHitRate,
      llmCalls,
      slmCalls,
    };
  }, [responses]);

  const formatCost = (cost: number) => {
    if (cost === 0) return '$0.00';
    if (cost < 0.0001) return `$${(cost * 1000000).toFixed(2)}µ`;
    if (cost < 0.01) return `$${(cost * 1000).toFixed(4)}m`;
    return `$${cost.toFixed(6)}`;
  };

  if (responses.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-2xl border border-gray-700/50 p-6 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-5 h-5 text-blue-400" />
        <h2 className="text-xl font-bold text-white">Cost Dashboard</h2>
        <span className="ml-auto text-sm text-gray-400">
          {stats.totalQueries} {stats.totalQueries === 1 ? 'query' : 'queries'}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Spent */}
        <StatCard
          icon={DollarSign}
          label="Total Spent"
          value={formatCost(stats.totalCost)}
          color="blue"
        />

        {/* Total Saved */}
        <StatCard
          icon={TrendingDown}
          label="Total Saved"
          value={formatCost(stats.totalSavings)}
          color="green"
          subtitle={`${((stats.totalSavings / (stats.totalCost + stats.totalSavings)) * 100).toFixed(0)}% reduction`}
        />

        {/* Cache Hit Rate */}
        <StatCard
          icon={Database}
          label="Cache Hit Rate"
          value={`${stats.cacheHitRate.toFixed(1)}%`}
          color="purple"
          subtitle={`${stats.cacheHits}/${stats.totalQueries} hits`}
        />

        {/* Model Usage */}
        <StatCard
          icon={Zap}
          label="Model Usage"
          value={`${stats.slmCalls}/${stats.llmCalls}`}
          color="yellow"
          subtitle="SLM / LLM"
        />
      </div>

      {/* Efficiency Score */}
      {stats.totalSavings > 0 && (
        <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300">
                You're saving <span className="font-bold text-green-400">{formatCost(stats.totalSavings)}</span> by using HybridLM's intelligent routing
              </p>
              <p className="text-xs text-gray-500 mt-1">
                That's {((stats.totalSavings / (stats.totalCost + stats.totalSavings)) * 100).toFixed(1)}% cost reduction compared to using only Cloud LLM
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  color: 'blue' | 'green' | 'purple' | 'yellow';
  subtitle?: string;
}

function StatCard({ icon: Icon, label, value, color, subtitle }: StatCardProps) {
  const colorClasses = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    purple: 'text-purple-400',
    yellow: 'text-yellow-400',
  };

  return (
    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/30">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${colorClasses[color]}`} />
        <span className="text-xs text-gray-400">{label}</span>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}
