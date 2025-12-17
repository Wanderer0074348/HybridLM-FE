'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { InferenceResponse } from '@/types/api';
import { Clock, Database, Cpu, Cloud, CheckCircle2, XCircle } from 'lucide-react';
import { CostMetrics } from './CostMetrics';

interface ResponseDisplayProps {
  response: InferenceResponse;
}

export function ResponseDisplay({ response }: ResponseDisplayProps) {
  const isLLM = response.model_used === 'cloud-llm';

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Cost Metrics - Show first if available */}
      {response.cost_metrics && (
        <CostMetrics metrics={response.cost_metrics} cacheHit={response.cache_hit} />
      )}
      {/* Response Content */}
      <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-2xl border border-gray-700/50 p-6 backdrop-blur-sm">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-gray-700/20 to-gray-800/20 border border-gray-600/30 flex-shrink-0">
            {isLLM ? (
              <Cloud className="w-6 h-6 text-gray-300" />
            ) : (
              <Cpu className="w-6 h-6 text-gray-300" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-700/20 text-gray-300 border border-gray-600/30">
                {isLLM ? 'Cloud LLM' : 'Edge SLM'}
              </span>
              {response.cache_hit && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-600/20 text-gray-300 border border-gray-500/30 flex items-center gap-1">
                  <Database className="w-3 h-3" />
                  Cached
                </span>
              )}
            </div>
            <div className="text-gray-100 leading-relaxed prose prose-invert prose-sm max-w-none
                prose-headings:text-gray-200 prose-headings:font-semibold
                prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
                prose-p:text-gray-200 prose-p:my-2
                prose-a:text-gray-300 prose-a:underline hover:prose-a:text-white
                prose-strong:text-gray-100 prose-strong:font-semibold
                prose-code:text-gray-300 prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-700 prose-pre:rounded-lg prose-pre:overflow-x-auto
                prose-ul:list-disc prose-ul:ml-4 prose-ul:text-gray-200
                prose-ol:list-decimal prose-ol:ml-4 prose-ol:text-gray-200
                prose-li:text-gray-200 prose-li:my-1
                prose-blockquote:border-l-4 prose-blockquote:border-gray-600 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-300
                prose-hr:border-gray-700
                prose-table:border-collapse prose-table:w-full
                prose-th:border prose-th:border-gray-700 prose-th:bg-gray-800 prose-th:p-2 prose-th:text-gray-200
                prose-td:border prose-td:border-gray-700 prose-td:p-2 prose-td:text-gray-200
                break-words overflow-wrap-anywhere whitespace-pre-wrap">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({node, ...props}) => <p className="mb-4 last:mb-0" {...props} />,
                  code: ({node, className, children, ...props}) => {
                    const isInline = !className?.includes('language-');
                    return isInline ? (
                      <code className="bg-gray-800 px-1 py-0.5 rounded text-sm" {...props}>
                        {children}
                      </code>
                    ) : (
                      <code className={`block bg-gray-800 p-4 rounded-lg overflow-x-auto ${className || ''}`} {...props}>
                        {children}
                      </code>
                    );
                  },
                  pre: ({node, ...props}) => <pre className="my-4" {...props} />,
                }}
              >
                {response.response}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          icon={Clock}
          label="Latency"
          value={`${(response.latency / 1000000).toFixed(0)}ms`}
          color="gray"
        />
        <MetricCard
          icon={isLLM ? Cloud : Cpu}
          label="Model"
          value={isLLM ? 'Cloud' : 'Edge'}
          color="gray"
        />
        <MetricCard
          icon={response.cache_hit ? CheckCircle2 : XCircle}
          label="Cache"
          value={response.cache_hit ? 'Hit' : 'Miss'}
          color="gray"
        />
        <MetricCard
          icon={Database}
          label="Strategy"
          value={response.routing_reason.includes('ML model') || response.routing_reason.includes('Exploration') ? 'RL' : 'Rule'}
          color="gray"
          tooltip={response.routing_reason}
        />
      </div>
    </div>
  );
}

interface MetricCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  color: 'gray';
  tooltip?: string;
}

function MetricCard({ icon: Icon, label, value, color, tooltip }: MetricCardProps) {
  const colorClasses = {
    gray: 'from-gray-700/10 to-gray-800/10 border-gray-600/20 text-gray-300',
  };

  return (
    <div
      className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-4 backdrop-blur-sm transition-transform hover:scale-105`}
      title={tooltip}
    >
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-4 h-4" />
        <span className="text-xs font-medium text-gray-400">{label}</span>
      </div>
      <p className="text-sm font-semibold truncate">{value}</p>
    </div>
  );
}
