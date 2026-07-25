import { createContext, useContext, useState, type ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  email_verified?: boolean;
  phone_verified?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string, refreshToken: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('infamous_token'));
  const [user, setUser] = useState<User | null>(
    localStorage.getItem('infamous_user') ? JSON.parse(localStorage.getItem('infamous_user')!) : null
  );

  const login = (newToken: string, newRefreshToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('infamous_token', newToken);
    localStorage.setItem('infamous_refresh_token', newRefreshToken);
    localStorage.setItem('infamous_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('infamous_token');
    localStorage.removeItem('infamous_refresh_token');
    localStorage.removeItem('infamous_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!token, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
