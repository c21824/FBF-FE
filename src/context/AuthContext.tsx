import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  email: string;
  name: string;
  role: 'player' | 'owner';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock accounts
const MOCK_ACCOUNTS = [
  {
    email: 'player@test.com',
    password: '123456',
    name: 'Nguyễn Văn Player',
    role: 'player' as const,
  },
  {
    email: 'owner@test.com',
    password: '123456',
    name: 'Trần Thị Owner',
    role: 'owner' as const,
  },
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const account = MOCK_ACCOUNTS.find(
      acc => acc.email === email && acc.password === password
    );

    if (account) {
      setUser({
        email: account.email,
        name: account.name,
        role: account.role,
      });
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
