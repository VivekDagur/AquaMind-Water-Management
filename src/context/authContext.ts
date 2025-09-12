import { createContext } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'community';
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);