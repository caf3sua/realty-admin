import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import type { User } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('admin_session_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const users = await api.getUsers();
      const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      // Allow admin@realty.com with admin123, or staff@realty.com with staff123, or any existing active user with password123 for testing
      if (foundUser && foundUser.status === 'active') {
        const isPasswordCorrect = password === 'admin123' || password === 'staff123' || password === 'password123';
        if (isPasswordCorrect) {
          setUser(foundUser);
          localStorage.setItem('admin_session_user', JSON.stringify(foundUser));
          return true;
        }
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('admin_session_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
