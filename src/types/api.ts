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
  metadata?: {
    model_used?: string;
    routing_reason?: string;
    latency?: number;
    cache_hit?: boolean;
    cost_metrics?: CostMetrics;
    decision_id?: string;
  };
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

export interface SessionMetadata {
  session_id: string;
  title: string;
  last_interaction: string;
  message_count: number;
  created_at: string;
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

// Feedback types
export interface FeedbackRequest {
  decision_id: string;
  rating?: number;
  thumbs?: 'up' | 'down';
  comment?: string;
}

export interface FeedbackResponse {
  message: string;
}

// Routing Decision types
export interface RoutingFeatures {
  token_count: number;
  char_count: number;
  word_count: number;
  unique_word_ratio: number;
  keyword_score: number;
  punctuation_density: number;
  complexity_score: number;
  question_type: string;
  has_context: boolean;
  sentence_count: number;
  avg_sentence_length: number;
  has_code_block: boolean;
  slm_assessment: string;
  slm_confidence: number;
}

export interface RoutingInfo {
  decision: string;
  reason: string;
  confidence: number;
  strategy: string;
  ab_test_group?: string;
}

export interface PerformanceMetrics {
  latency_ms: number;
  cost_usd: number;
  cache_hit: boolean;
  model_used: string;
}

export interface FeedbackData {
  rating?: number;
  thumbs?: string;
  collected_at?: string;
  comment?: string;
}

export interface RoutingDecisionRecord {
  id: string;
  query: string;
  query_hash: string;
  features: RoutingFeatures;
  routing: RoutingInfo;
  performance: PerformanceMetrics;
  feedback?: FeedbackData;
  user_id?: string;
  session_id?: string;
  timestamp: string;
}

// A/B Testing types
export interface ABTestConfig {
  id: string;
  name: string;
  description: string;
  control_group: string;
  treatment_group: string;
  traffic_split: number;
  is_active: boolean;
  started_at: string;
  ended_at?: string;
}

export interface ABTestMetrics {
  id: string;
  test_id: string;
  group: string;
  total_requests: number;
  avg_latency_ms: number;
  avg_cost: number;
  avg_rating: number;
  thumbs_up_count: number;
  thumbs_down_count: number;
  updated_at: string;
}

export interface CreateABTestRequest {
  name: string;
  description: string;
  control_group: string;
  treatment_group: string;
  traffic_split: number;
}

// ML Training types
export interface MLTrainingResponse {
  message: string;
  version: string;
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
    training_samples: number;
    validation_samples: number;
  };
}
