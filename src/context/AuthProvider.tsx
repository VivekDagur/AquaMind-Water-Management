import React, { useState, useEffect, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { AuthContext, AuthContextType, User } from './authContext';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authToken, setAuthToken] = useLocalStorage('authToken', null);

  useEffect(() => {
    const checkAuth = () => {
      try {
        // Check if there's a stored user in localStorage
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('authToken');
        
        if (storedUser && storedToken) {
          const user = JSON.parse(storedUser);
          setUser(user);
          setAuthToken(storedToken);
        } else if (authToken) {
          // If we have authToken but no user, create a mock user
          const mockUser: User = {
            id: '1',
            email: 'user@aquamind.com',
            name: 'AquaMind User',
            role: 'user',
            setupCompleted: true
          };
          setUser(mockUser);
          localStorage.setItem('user', JSON.stringify(mockUser));
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setAuthToken('');
        localStorage.removeItem('user');
        setUser(null);
      } finally {
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
    setAuthToken('');
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
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

  const setDemoMode = (enable: boolean = true) => {
    if (enable) {
      const demoUser: User = {
        id: 'demo-user',
        email: 'demo@aquamind.com',
        name: 'Demo User',
        role: 'user',
        setupCompleted: true,
        demoMode: true,
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
      };
      // Save to both state and localStorage
      localStorage.setItem('user', JSON.stringify(demoUser));
      localStorage.setItem('authToken', 'demo-token');
      setAuthToken('demo-token');
      setUser(demoUser);
      return demoUser;
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      setAuthToken('');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        completeSetup,
        setDemoMode,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};