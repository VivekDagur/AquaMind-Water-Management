import React, { useState, useEffect } from 'react';
import { AuthContext, User, AuthContextType } from './authContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authToken, setAuthToken] = useLocalStorage<string>('auth', '');

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = () => {
      // Auto-auth in dev to avoid blank protected pages
      if (authToken !== '1') {
        setAuthToken('1');
      }
      const mockUser: User = {
        id: '1',
        email: 'user@aquamind.com',
        name: 'AquaMind User',
        role: 'user'
      };
      setUser(mockUser);
      setIsLoading(false);
    };

    // Simulate initial auth check delay
    setTimeout(checkAuth, 100);
  }, [authToken]);

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

  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user && authToken === '1',
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};