import { useContext } from 'react';
import { AuthContext, AuthContextType } from '@/context/authContext';

/**
 * Custom hook to access authentication context
 * Provides user state, login/logout functions, and loading state
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  const setDemoMode = (enable: boolean = true) => {
    context.setUser({
      ...context.user!,
      demoMode: enable,
      setupCompleted: enable
    });
  };

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return { ...context, setDemoMode };
};