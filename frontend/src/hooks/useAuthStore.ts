import { create } from 'zustand';
import type { AuthResponse, UserSession } from '../types/auth';
import { clearTokens, setTokens } from '../lib/token';

interface AuthState {
  user: UserSession | null;
  isAuthenticated: boolean;
  setSession: (payload: AuthResponse) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setSession: (payload: AuthResponse) => {
    setTokens(payload.accessToken, payload.refreshToken);
    set({ user: payload.user, isAuthenticated: true });
  },
  clearSession: () => {
    clearTokens();
    set({ user: null, isAuthenticated: false });
  }
}));
