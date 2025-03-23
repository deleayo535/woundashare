
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '../components/ui/use-toast';

export type User = {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
};

type UserCredentials = {
  email: string;
  password: string;
};

type RegisterData = UserCredentials & {
  name: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (credentials: UserCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_ADMIN_USER: User = {
  id: 'admin-1',
  email: 'admin@woundashare.com',
  name: 'Admin User',
  isAdmin: true,
};

const DEMO_NORMAL_USER: User = {
  id: 'user-1',
  email: 'user@example.com',
  name: 'Demo Patient',
  isAdmin: false,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user on mount
    const savedUser = localStorage.getItem('woundashare_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials: UserCredentials): Promise<void> => {
    try {
      setLoading(true);
      // Simulate login delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo authentication logic
      if (credentials.email === DEMO_ADMIN_USER.email && credentials.password === 'admin123') {
        setUser(DEMO_ADMIN_USER);
        localStorage.setItem('woundashare_user', JSON.stringify(DEMO_ADMIN_USER));
        toast({
          title: 'Admin logged in',
          description: 'Welcome back, Admin!',
        });
      } else if (credentials.email === DEMO_NORMAL_USER.email && credentials.password === 'user123') {
        setUser(DEMO_NORMAL_USER);
        localStorage.setItem('woundashare_user', JSON.stringify(DEMO_NORMAL_USER));
        toast({
          title: 'Logged in successfully',
          description: 'Welcome back to WoundaShare!',
        });
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      toast({
        title: 'Login failed',
        description: (error as Error).message || 'Invalid email or password',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<void> => {
    try {
      setLoading(true);
      // Simulate registration delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would send a request to your API to register the user
      const newUser: User = {
        id: `user-${Date.now()}`,
        email: data.email,
        name: data.name,
        isAdmin: false,
      };
      
      setUser(newUser);
      localStorage.setItem('woundashare_user', JSON.stringify(newUser));
      toast({
        title: 'Account created',
        description: 'You have successfully registered!',
      });
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: (error as Error).message || 'Could not create your account',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('woundashare_user');
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out',
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      loading,
      isAdmin: !!user?.isAdmin 
    }}>
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
