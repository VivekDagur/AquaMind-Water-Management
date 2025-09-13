import { createContext, useContext } from 'react';

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
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  setDemoMode: (enable?: boolean) => void;
  setUser: (user: User | null) => void;
  completeSetup: (setupData: User['tankSetup']) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
