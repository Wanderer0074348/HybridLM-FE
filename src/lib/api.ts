import {
  InferenceRequest,
  InferenceResponse,
  HealthCheckResponse,
  ChatRequest,
  ChatResponse,
  ChatSession
} from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export class APIClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  async inference(request: InferenceRequest): Promise<InferenceResponse> {
    const response = await fetch(`${this.baseURL}/inference`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Inference request failed');
    }

    return response.json();
  }

  async healthCheck(): Promise<HealthCheckResponse> {
    const response = await fetch(`${this.baseURL}/health`);

    if (!response.ok) {
      throw new Error('Health check failed');
    }

    return response.json();
  }

  // Chat methods
  async chat(request: ChatRequest): Promise<ChatResponse> {
    const response = await fetch(`${this.baseURL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Chat request failed');
    }

    return response.json();
  }

  async getSession(sessionId: string): Promise<ChatSession> {
    const response = await fetch(`${this.baseURL}/chat/sessions/${sessionId}`);

    if (!response.ok) {
      throw new Error('Failed to get session');
    }

    return response.json();
  }

  async deleteSession(sessionId: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/chat/sessions/${sessionId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete session');
    }
  }

  async listSessions(): Promise<{ sessions: string[]; count: number }> {
    const response = await fetch(`${this.baseURL}/chat/sessions`);

    if (!response.ok) {
      throw new Error('Failed to list sessions');
    }

    return response.json();
  }
}

export const apiClient = new APIClient();
