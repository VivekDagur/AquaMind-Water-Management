import { createContext } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'community';
  setupCompleted?: boolean;
  tankSetup?: {
    hasPhysicalTank: boolean;
    tankCount: number;
    tankType: 'residential' | 'commercial' | 'industrial' | 'community';
    location: string;
    capacity: string;
    currentLevel: string;
    sensorConnected: boolean;
    wantsDemoMode: boolean;
  };
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  completeSetup: (setupData: User['tankSetup']) => void;
  setDemoMode: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);