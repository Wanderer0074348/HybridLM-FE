export interface InferenceRequest {
  query: string;
  context?: string;
  max_tokens?: number;
  temperature?: number;
  metadata?: Record<string, string>;
}

export interface InferenceResponse {
  response: string;
  model_used: string;
  routing_reason: string;
  latency: number;
  cache_hit: boolean;
  timestamp: string;
}

export interface RoutingDecision {
  useLLM: boolean;
  reason: string;
  confidence: number;
  complexityScore: number;
}

export interface QueryMetrics {
  tokenCount: number;
  complexity: number;
  hasContext: boolean;
  queryLength: number;
}

export interface HealthCheckResponse {
  status: string;
  timestamp: string;
}
