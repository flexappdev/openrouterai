"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type User = { name: string; email: string; avatar: string } | null;

const AuthCtx = createContext<{
  user: User;
  signIn: () => void;
  signOut: () => void;
  ready: boolean;
}>({ user: null, signIn: () => {}, signOut: () => {}, ready: false });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("orai-user");
      if (raw) setUser(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  const signIn = () => {
    const u = { name: "Mat", email: "mat@cleverfox.ai", avatar: "M" };
    setUser(u);
    try {
      window.localStorage.setItem("orai-user", JSON.stringify(u));
    } catch {}
  };

  const signOut = () => {
    setUser(null);
    try {
      window.localStorage.removeItem("orai-user");
    } catch {}
  };

  return <AuthCtx.Provider value={{ user, signIn, signOut, ready }}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);
