import { apiClient } from '../lib/axios';
import type { AuthResponse, LoginDto } from '../types/auth';

export const loginUser = async (credentials: LoginDto): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/api/auth/login', credentials);
  return response.data;
};

export const refreshAuthToken = async (refreshToken: string): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/api/auth/refresh', { refreshToken });
  return response.data;
};
