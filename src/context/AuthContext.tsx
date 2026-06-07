import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import type { User } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: (token: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('admin_session_user');
    const token = localStorage.getItem('admin_token');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    } else {
      // Clear inconsistent state
      localStorage.removeItem('admin_session_user');
      localStorage.removeItem('admin_token');
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const data = await api.login(email, password);
      setUser(data.user);
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_session_user', JSON.stringify(data.user));
      return true;
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const loginWithGoogle = async (token: string): Promise<boolean> => {
    try {
      const data = await api.loginWithGoogle(token);
      setUser(data.user);
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_session_user', JSON.stringify(data.user));
      return true;
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_session_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
