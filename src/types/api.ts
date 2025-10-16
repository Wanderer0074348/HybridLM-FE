export interface InferenceRequest {
  query: string;
  context?: string;
  max_tokens?: number;
  temperature?: number;
  metadata?: Record<string, string>;
}

export interface CostMetrics {
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  cost: number;
  cache_cost: number;
  total_cost: number;
  estimated_savings: number;
  model: string;
}

export interface InferenceResponse {
  response: string;
  model_used: string;
  routing_reason: string;
  latency: number;
  cache_hit: boolean;
  timestamp: string;
  cost_metrics?: CostMetrics;
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

// Chat-specific types
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface ChatSession {
  session_id: string;
  messages: ChatMessage[];
  created_at: string;
  last_interaction: string;
  total_tokens: number;
  message_count: number;
  model_preference: string;
}

export interface ChatRequest {
  session_id?: string;
  message: string;
  max_tokens?: number;
  temperature?: number;
  stream?: boolean;
}

export interface ChatResponse {
  session_id: string;
  response: string;
  model_used: string;
  routing_reason: string;
  latency: number;
  cache_hit: boolean;
  timestamp: string;
  message_count: number;
  cost_metrics?: CostMetrics;
}
