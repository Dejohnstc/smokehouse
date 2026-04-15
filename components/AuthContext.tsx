"use client";

import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  refreshUser: () => void; // 🔥 NEW
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getUserFromToken(): User | null {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    return {
      id: payload.id,
      email: payload.email,
    };
  } catch {
    localStorage.removeItem("token"); // 🔥 FIX
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(() => getUserFromToken());

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/");
  };

  const refreshUser = () => {
    setUser(getUserFromToken());
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};