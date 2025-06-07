'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define user type
type User = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string,
  profile_pic: string,
  no_shows: number
  // Add any other user properties
} | null;

// Define authentication context type
type AuthContextType = {
  user: User;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: User) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  login: async () => { },
  signup: async () => { },
  logout: async () => { },
  isAuthenticated: false,
});

// Auth provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check authentication status on mount and after any auth-related actions
  const checkAuthStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3005/auth/status', {
        method: 'GET',
        credentials: 'include', // Important: include cookies with request
      });

      if (response.ok) {
        const userData = await response.json();
        console.log(userData);
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        // Clear user data if auth check fails
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error('Auth check error:', err);
      setUser(null);
      setIsAuthenticated(false);
      setError('Authentication check failed');
    } finally {
      setLoading(false);
    }
  };

  // Check auth status when component mounts
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3005/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important: include cookies with response
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      // After successful login, JWT token is set as HttpOnly cookie
      // We just need to get the user data
      await checkAuthStatus();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (userData: User) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3005/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Signup failed');
      }

      // After successful signup and auto-login, check auth status
      await checkAuthStatus();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Signup failed');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    try {
      await fetch('http://localhost:3005/auth/logout', {
        method: 'POST',
        credentials: 'include', // Include cookies to clear them
      });

      // Clear user data after logout
      setUser(null);
      setIsAuthenticated(false);
    } catch (err: unknown) {
      console.error('Logout error:', err);
      setError('Logout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        signup,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext); 