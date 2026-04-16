import React, { createContext, useContext, useState, ReactNode } from 'react';
import * as authApi from '../api/auth';
import * as studentApi from '../api/students';
import { getAllStudents } from '../api/students';

type UserRole = 'student' | 'admin' | null;

interface AuthContextType {
  user: any;
  role: UserRole;
  isAuthenticated: boolean;
  students: any[];
  requestOtp: (email: string) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: any) => Promise<void>;
  loadStudents: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [role, setRole] = useState<UserRole>(() => {
    return (localStorage.getItem('role') as UserRole) || null;
  });
  const [students, setStudents] = useState<any[]>([]);

  const loadStudents = async () => {
    try {
      const data = await getAllStudents();
      setStudents(data);
    } catch (err) {
      console.error('Failed to load students', err);
    }
  };

  const requestOtp = async (email: string) => {
    await authApi.requestOtp(email);
  };

  const verifyOtp = async (email: string, otp: string) => {
    const data = await authApi.verifyOtp(email, otp);
    setUser(data.user);
    setRole(data.role);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('role', data.role);
    
    if (data.role === 'admin') {
      await loadStudents();
    }
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setStudents([]);
    localStorage.removeItem('user');
    localStorage.removeItem('role');
  };

  const updateUser = async (data: any) => {
    if (role === 'student' && user?._id) {
      const updated = await studentApi.updateStudent(user._id, data);
      setUser((prev: any) => ({ ...prev, ...updated }));
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, isAuthenticated: !!user, students, requestOtp, verifyOtp, logout, updateUser, loadStudents }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
