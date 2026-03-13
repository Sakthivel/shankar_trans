"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { api } from "@/lib/api-client";
import type { Role } from "@/types";

interface User {
  id: number;
  userId: string;
  name: string;
  email: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userId: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isRole: (...roles: Role[]) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const res = await api.get<{ success: boolean; data: User }>("/auth/me");
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (userId: string, password: string) => {
    const res = await api.post<{ success: boolean; data: User }>("/auth/login", {
      userId,
      password,
    });
    setUser(res.data);
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
  };

  const isRole = (...roles: Role[]) => {
    return user ? roles.includes(user.role) : false;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
