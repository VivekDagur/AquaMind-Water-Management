import { ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'community';
  setupCompleted?: boolean;
  demoMode?: boolean;
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
  currentUser: User | null; // Alias for user
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setDemoMode: (enable?: boolean) => void;
  setUser: (user: User | null) => void; // Add setUser function
}

export interface AuthProviderProps {
  children: ReactNode;
}
