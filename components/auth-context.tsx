"use client"

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// Define the shape of the user object you expect from the API
interface User {
  id: string | number; // Or whatever identifier you use
  role: 'student' | 'admin'; // Keep it simple based on login roles for now
  name?: string; // Example: Add other relevant fields
  email?: string;
  matricule?: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  isLoading: boolean; // To handle initial loading of state
  login: (token: string, userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start loading until checked localStorage
  const router = useRouter();

  useEffect(() => {
    // Try to load token and user from localStorage on initial mount
    try {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('authUser');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to load auth state from localStorage", error);
      // Clear potentially corrupted storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    } finally {
      setIsLoading(false); // Finished loading attempt
    }
  }, []);

  const login = (newToken: string, userData: User) => {
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('authUser', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
    // Redirect happens in the login page component after calling login
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setToken(null);
    setUser(null);
    router.push('/'); // Redirect to login page after logout
  };

  return (
    <AuthContext.Provider value={{ token, user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};