'use client';

import { InferenceResponse } from '@/types/api';
import { Cloud, Cpu, Loader2 } from 'lucide-react';

interface RoutingVisualizationProps {
  response: InferenceResponse;
  isLoading?: boolean;
}

export function RoutingVisualization({ response, isLoading }: RoutingVisualizationProps) {
  const isLLM = response?.model_used === 'cloud-llm';
  const isSLM = response?.model_used === 'edge-slm';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-6 py-12">
        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
        <span className="text-gray-400">Processing query...</span>
      </div>
    );
  }

  if (!response) return null;

  return (
    <div className="flex items-center justify-center gap-8 py-8">
      {/* Cloud LLM Badge */}
      <div
        className={`relative px-6 py-4 rounded-xl border-2 transition-all duration-300 ${
          isLLM
            ? 'border-white shadow-[0_0_20px_rgba(255,255,255,0.5)] bg-gray-800/50'
            : 'border-gray-700 bg-gray-900/30'
        }`}
      >
        <div className="flex flex-col items-center gap-2">
          <Cloud className={`w-8 h-8 ${isLLM ? 'text-white' : 'text-gray-500'}`} />
          <span className={`text-sm font-medium ${isLLM ? 'text-white' : 'text-gray-500'}`}>
            Cloud LLM
          </span>
        </div>
      </div>

      {/* Edge SLM Badge */}
      <div
        className={`relative px-6 py-4 rounded-xl border-2 transition-all duration-300 ${
          isSLM
            ? 'border-white shadow-[0_0_20px_rgba(255,255,255,0.5)] bg-gray-800/50'
            : 'border-gray-700 bg-gray-900/30'
        }`}
      >
        <div className="flex flex-col items-center gap-2">
          <Cpu className={`w-8 h-8 ${isSLM ? 'text-white' : 'text-gray-500'}`} />
          <span className={`text-sm font-medium ${isSLM ? 'text-white' : 'text-gray-500'}`}>
            Edge SLM
          </span>
        </div>
      </div>
    </div>
  );
}
