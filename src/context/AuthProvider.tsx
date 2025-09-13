import React, { useState, useEffect, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { AuthContext, AuthContextType, User } from './AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authToken, setAuthToken] = useLocalStorage('authToken', null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedToken = localStorage.getItem('authToken');
        
        if (storedToken && storedToken !== 'demo-token') {
          // Verify token with backend
          try {
            const response = await fetch(`${API_URL}/auth/profile`, {
              headers: {
                'Authorization': `Bearer ${storedToken}`,
                'Content-Type': 'application/json'
              }
            });
            
            if (response.ok) {
              const data = await response.json();
              setUser(data.user);
              setAuthToken(storedToken);
            } else {
              // Token invalid, clear auth
              localStorage.removeItem('authToken');
              localStorage.removeItem('user');
              setAuthToken('');
              setUser(null);
            }
          } catch (error) {
            console.error('Token verification failed:', error);
            // Fallback to demo mode on network error
            setDemoMode(true);
          }
        } else if (storedToken === 'demo-token') {
          // Handle demo mode
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
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

    checkAuth();
  }, [authToken, setAuthToken]);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setUser(data.user);
        setAuthToken(data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('authToken', data.token);
      } else {
        throw new Error(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setUser(data.user);
        setAuthToken(data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('authToken', data.token);
      } else {
        throw new Error(data.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    setUser(null);
    setAuthToken('');
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  };

  const completeSetup = async (setupData: User['tankSetup']) => {
    if (user && authToken && authToken !== 'demo-token') {
      try {
        const response = await fetch(`${API_URL}/auth/setup`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ setupData })
        });
        
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      } catch (error) {
        console.error('Setup completion error:', error);
      }
    } else if (user) {
      // Demo mode fallback
      const updatedUser = {
        ...user,
        setupCompleted: true,
        tankSetup: setupData
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
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
        currentUser: user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
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