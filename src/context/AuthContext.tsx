import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  userName: string;
  credits: number;
  login: (name: string) => void;
  logout: () => void;
  addCredits: (amount: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const saved = localStorage.getItem('isAuthenticated');
    return saved === 'true';
  });
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('userName') || '';
  });
  const [credits, setCredits] = useState(() => {
    const saved = localStorage.getItem('userCredits');
    return saved ? parseInt(saved) : 0;
  });

  const login = (name: string) => {
    setIsAuthenticated(true);
    setUserName(name);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userName', name);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserName('');
    setCredits(0);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userName');
    localStorage.removeItem('userCredits');
  };

  const addCredits = (amount: number) => {
    setCredits(prev => {
      const newAmount = prev + amount;
      localStorage.setItem('userCredits', newAmount.toString());
      return newAmount;
    });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userName, credits, login, logout, addCredits }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
