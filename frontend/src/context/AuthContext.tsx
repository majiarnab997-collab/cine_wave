import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';
import { analyticsService } from '../services/analyticsService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string) => { success: boolean; error?: string };
  demoLogin: (role: 'user' | 'kids' | 'admin') => void;
  signup: (name: string, email: string, planId?: string) => { success: boolean; error?: string };
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => authService.getCurrentUser());

  useEffect(() => {
    const current = authService.getCurrentUser();
    setUser(current);
  }, []);

  const login = (email: string) => {
    const res = authService.login(email);
    if (res.success && res.user) {
      setUser(res.user);
      analyticsService.track('login', { method: 'email' }, res.user.id);
    }
    return res;
  };

  const demoLogin = (role: 'user' | 'kids' | 'admin') => {
    const u = authService.demoLogin(role);
    setUser(u);
    analyticsService.track('demo_login', { role }, u.id);
  };

  const signup = (name: string, email: string, planId?: string) => {
    const res = authService.signup(name, email, planId);
    if (res.success && res.user) {
      setUser(res.user);
      analyticsService.track('signup', { planId }, res.user.id);
    }
    return res;
  };

  const logout = () => {
    if (user) {
      analyticsService.track('logout', {}, user.id);
    }
    authService.logout();
    setUser(null);
  };

  const refreshUser = () => {
    const current = authService.getCurrentUser();
    setUser(current);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isAdmin: user?.role === 'admin',
        login,
        demoLogin,
        signup,
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
