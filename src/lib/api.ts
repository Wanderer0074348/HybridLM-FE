import {
  InferenceRequest,
  InferenceResponse,
  HealthCheckResponse,
  ChatRequest,
  ChatResponse,
  ChatSession,
  SessionMetadata,
  FeedbackRequest,
  FeedbackResponse,
  RoutingDecisionRecord,
  ABTestConfig,
  ABTestMetrics,
  CreateABTestRequest,
  MLTrainingResponse
} from '@/types/api';
import {
  LoginResponse,
  MeResponse,
  LogoutResponse
} from '@/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export class APIClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    return fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });
  }

  async inference(request: InferenceRequest): Promise<{ data: InferenceResponse; decisionId?: string }> {
    const response = await this.fetchWithAuth(`${this.baseURL}/inference`, {
      method: 'POST',
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Inference request failed');
    }

    const decisionId = response.headers.get('X-Decision-ID') || undefined;
    const data = await response.json();

    return { data, decisionId };
  }

  async healthCheck(): Promise<HealthCheckResponse> {
    const response = await fetch(`${this.baseURL}/health`);

    if (!response.ok) {
      throw new Error('Health check failed');
    }

    return response.json();
  }

  async chat(request: ChatRequest): Promise<{ data: ChatResponse; decisionId?: string }> {
    const response = await this.fetchWithAuth(`${this.baseURL}/chat`, {
      method: 'POST',
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Chat request failed');
    }

    const decisionId = response.headers.get('X-Decision-ID') || undefined;
    const data = await response.json();

    return { data, decisionId };
  }

  async getSession(sessionId: string): Promise<ChatSession> {
    const response = await this.fetchWithAuth(`${this.baseURL}/chat/sessions/${sessionId}`);

    if (!response.ok) {
      throw new Error('Failed to get session');
    }

    return response.json();
  }

  async deleteSession(sessionId: string): Promise<void> {
    const response = await this.fetchWithAuth(`${this.baseURL}/chat/sessions/${sessionId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete session');
    }
  }

  async listSessions(): Promise<{ sessions: SessionMetadata[] | string[]; count: number }> {
    const response = await this.fetchWithAuth(`${this.baseURL}/chat/sessions`);

    if (!response.ok) {
      throw new Error('Failed to list sessions');
    }

    return response.json();
  }

  async login(): Promise<LoginResponse> {
    const response = await this.fetchWithAuth(`${this.baseURL}/auth/login`);

    if (!response.ok) {
      throw new Error('Failed to initiate login');
    }

    return response.json();
  }

  async me(): Promise<MeResponse> {
    const response = await this.fetchWithAuth(`${this.baseURL}/auth/me`);

    if (!response.ok) {
      throw new Error('Not authenticated');
    }

    return response.json();
  }

  async logout(): Promise<LogoutResponse> {
    const response = await this.fetchWithAuth(`${this.baseURL}/auth/logout`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }

    return response.json();
  }

  // Feedback methods
  async submitFeedback(feedback: FeedbackRequest): Promise<FeedbackResponse> {
    const response = await this.fetchWithAuth(`${this.baseURL}/feedback`, {
      method: 'POST',
      body: JSON.stringify(feedback),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to submit feedback');
    }

    return response.json();
  }

  async getDecision(decisionId: string): Promise<RoutingDecisionRecord> {
    const response = await this.fetchWithAuth(`${this.baseURL}/decisions/${decisionId}`);

    if (!response.ok) {
      throw new Error('Failed to get decision');
    }

    return response.json();
  }

  // A/B Testing methods
  async createABTest(config: CreateABTestRequest): Promise<ABTestConfig> {
    const response = await this.fetchWithAuth(`${this.baseURL}/ab-tests`, {
      method: 'POST',
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create A/B test');
    }

    return response.json();
  }

  async getActiveABTest(): Promise<ABTestConfig | null> {
    const response = await this.fetchWithAuth(`${this.baseURL}/ab-tests/active`);

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error('Failed to get active A/B test');
    }

    return response.json();
  }

  async endABTest(testId: string): Promise<{ message: string }> {
    const response = await this.fetchWithAuth(`${this.baseURL}/ab-tests/${testId}/end`, {
      method: 'POST',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to end A/B test');
    }

    return response.json();
  }

  async getABTestMetrics(group?: 'control' | 'treatment'): Promise<ABTestMetrics[]> {
    const url = group
      ? `${this.baseURL}/ab-tests/metrics?group=${group}`
      : `${this.baseURL}/ab-tests/metrics`;

    const response = await this.fetchWithAuth(url);

    if (!response.ok) {
      throw new Error('Failed to get A/B test metrics');
    }

    return response.json();
  }

  // ML Training methods
  async trainMLModel(): Promise<MLTrainingResponse> {
    const response = await this.fetchWithAuth(`${this.baseURL}/ml/train`, {
      method: 'POST',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to train ML model');
    }

    return response.json();
  }
}

export const apiClient = new APIClient();
