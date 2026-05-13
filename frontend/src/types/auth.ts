export interface LoginDto {
  email: string;
  password: string;
}

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'merchant' | 'customer';
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserSession;
}
