'use client';

import { motion } from 'framer-motion';
import { InferenceResponse } from '@/types/api';
import { ModelNode } from './routing/ModelNode';
import { AnimatedPath } from './routing/AnimatedPath';
import { RoutingBadge } from './routing/RoutingBadge';
import { LoadingState } from './routing/LoadingState';

interface RoutingVisualizationProps {
  response: InferenceResponse;
  isLoading?: boolean;
}

export function RoutingVisualization({ response, isLoading }: RoutingVisualizationProps) {
  const isLLM = response?.model_used === 'cloud-llm';
  const isSLM = response?.model_used === 'edge-slm';
  const isCacheHit = response?.cache_hit;

  if (isLoading) {
    return <LoadingState />;
  }

  if (!response) return null;

  return (
    <div className="relative h-[600px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-2xl border border-gray-700/50">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />

      {/* Query Node (Top Center) */}
      <ModelNode
        type="query"
        position="top-center"
        delay={0.1}
      />

      {/* Cache Node (Middle Center - if cache hit) */}
      {isCacheHit && (
        <ModelNode
          type="cache"
          position="middle-center"
          delay={0.3}
        />
      )}

      {/* LLM Node (Bottom Left) */}
      <ModelNode
        type="llm"
        position="bottom-left"
        delay={0.4}
        isActive={isLLM}
      />

      {/* SLM Node (Bottom Right) */}
      <ModelNode
        type="slm"
        position="bottom-right"
        delay={0.4}
        isActive={isSLM}
      />

      {/* SVG for paths */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
        <defs>
          {/* Gradient for active paths (greyscale) */}
          <linearGradient id="activeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d1d5db" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#9ca3af" stopOpacity="1" />
          </linearGradient>

          {/* Gradient for cache (lighter grey) */}
          <linearGradient id="cacheGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e5e7eb" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#d1d5db" stopOpacity="1" />
          </linearGradient>
        </defs>

        {!isCacheHit ? (
          <>
            {/* Direct path: Query to LLM (top-center to bottom-left) */}
            <AnimatedPath
              d="M 300 100 L 200 450"
              isActive={isLLM}
              color={isLLM ? 'url(#activeGradient)' : '#374151'}
              delay={0.3}
              withParticle={isLLM}
            />

            {/* Direct path: Query to SLM (top-center to bottom-right) */}
            <AnimatedPath
              d="M 300 100 L 400 450"
              isActive={isSLM}
              color={isSLM ? 'url(#activeGradient)' : '#374151'}
              delay={0.3}
              withParticle={isSLM}
            />
          </>
        ) : (
          <>
            {/* Cache hit flow: Query to Cache */}
            <AnimatedPath
              d="M 300 100 L 300 250"
              isActive={true}
              color="url(#cacheGradient)"
              delay={0.3}
              withParticle={true}
            />

            {/* Cache to LLM */}
            <AnimatedPath
              d="M 300 310 L 200 450"
              isActive={isLLM}
              color={isLLM ? 'url(#cacheGradient)' : '#374151'}
              delay={0.5}
              withParticle={isLLM}
            />

            {/* Cache to SLM */}
            <AnimatedPath
              d="M 300 310 L 400 450"
              isActive={isSLM}
              color={isSLM ? 'url(#cacheGradient)' : '#374151'}
              delay={0.5}
              withParticle={isSLM}
            />
          </>
        )}
      </svg>

      {/* Routing Info Badge */}
      <RoutingBadge reason={response.routing_reason} delay={0.8} />
    </div>
  );
}
