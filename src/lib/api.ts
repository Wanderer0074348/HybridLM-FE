import {
  InferenceRequest,
  InferenceResponse,
  HealthCheckResponse,
  ChatRequest,
  ChatResponse,
  ChatSession
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

  async inference(request: InferenceRequest): Promise<InferenceResponse> {
    const response = await this.fetchWithAuth(`${this.baseURL}/inference`, {
      method: 'POST',
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

  async chat(request: ChatRequest): Promise<ChatResponse> {
    const response = await this.fetchWithAuth(`${this.baseURL}/chat`, {
      method: 'POST',
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Chat request failed');
    }

    return response.json();
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

  async listSessions(): Promise<{ sessions: string[]; count: number }> {
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
}

export const apiClient = new APIClient();
