export interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
}

export interface LoginResponse {
  url: string;
}

export interface MeResponse {
  user: User;
}

export interface LogoutResponse {
  message: string;
}
