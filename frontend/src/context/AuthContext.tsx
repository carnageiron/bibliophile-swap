
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { loginUser, registerUser, getUserProfile } from '@/api';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Check if user is authenticated on mount
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          console.log('Loading user with token');
          const userData = await getUserProfile();
          console.log('User data loaded:', userData);
          setUser(userData);
        } catch (err) {
          console.error('Error loading user', err);
          toast({
            title: 'Session Expired',
            description: 'Please log in again',
            variant: 'destructive'
          });
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Attempting to login user:', email);
      const { user, token } = await loginUser({ email, password });
      console.log('Login successful, user:', user);
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      toast({
        title: 'Login Successful',
        description: `Welcome back, ${user.name}!`,
      });
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || 'Network error. Please check your connection and try again.';
      setError(errorMessage);
      toast({
        title: 'Login Failed',
        description: errorMessage,
        variant: 'destructive'
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Attempting to register user:', email);
      const { user, token } = await registerUser({ name, email, password });
      console.log('Registration successful, user:', user);
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      toast({
        title: 'Registration Successful',
        description: `Welcome to Bibliophile Swap, ${user.name}!`,
      });
    } catch (err: any) {
      console.error('Registration error:', err);
      const errorMessage = err.response?.data?.message || 'Network error. Please check your connection and try again.';
      setError(errorMessage);
      toast({
        title: 'Registration Failed',
        description: errorMessage,
        variant: 'destructive'
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out'
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        error,
        login,
        register,
        logout
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
