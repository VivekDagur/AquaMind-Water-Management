import React, { useState, useEffect, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { AuthContext, AuthContextType, User } from './authContext';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authToken, setAuthToken] = useLocalStorage('authToken', null);

  useEffect(() => {
    const checkAuth = () => {
      if (authToken) {
        // Mock user data based on stored token
        const mockUser: User = {
          id: '1',
          email: 'user@aquamind.com',
          name: 'AquaMind User',
          role: 'user',
          setupCompleted: false
        };
        setUser(mockUser);
        setIsLoading(false);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    };

    // Simulate initial auth check delay
    setTimeout(checkAuth, 100);
  }, [authToken, setAuthToken]);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    // Simulate API call delay (700-1000ms as requested)
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock authentication - accept any email/password
    if (email && password) {
      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0],
        role: email.includes('admin') ? 'admin' : 'user'
      };
      
      setUser(mockUser);
      setAuthToken('1'); // Store auth state in localStorage
    } else {
      throw new Error('Invalid credentials');
    }
    
    setIsLoading(false);
  };

  const logout = (): void => {
    setUser(null);
    setAuthToken(''); // Clear auth from localStorage
  };

  const completeSetup = (setupData: User['tankSetup']) => {
    if (user) {
      setUser({
        ...user,
        setupCompleted: true,
        tankSetup: setupData
      });
    }
  };

  const setDemoMode = () => {
    if (user) {
      setUser({
        ...user,
        setupCompleted: true,
        tankSetup: {
          hasPhysicalTank: false,
          tankCount: 3,
          tankType: 'residential',
          location: 'Demo Location',
          capacity: '5000',
          currentLevel: '3500',
          sensorConnected: true,
          wantsDemoMode: true
        }
      });
    }
  };

  const contextValue: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user,
    completeSetup,
    setDemoMode
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};