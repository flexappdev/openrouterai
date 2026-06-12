"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";

type User = { name: string; email: string; avatar: string } | null;

const AuthCtx = createContext<{
  user: User;
  signIn: () => void;
  signOut: () => void;
  ready: boolean;
}>({ user: null, signIn: () => {}, signOut: () => {}, ready: false });

function avatarOf(email: string) {
  return (email[0] ?? "?").toUpperCase();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    const supabase = createClient();

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      const u = data.session?.user;
      if (u?.email) {
        const name =
          (u.user_metadata?.full_name as string | undefined) ??
          u.email.split("@")[0];
        setUser({ name, email: u.email, avatar: avatarOf(u.email) });
      }
      setReady(true);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user;
      if (u?.email) {
        const name =
          (u.user_metadata?.full_name as string | undefined) ??
          u.email.split("@")[0];
        setUser({ name, email: u.email, avatar: avatarOf(u.email) });
      } else {
        setUser(null);
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signIn = () => {
    if (typeof window === "undefined") return;
    window.location.assign("/login");
  };

  const signOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    setUser(null);
    if (typeof window !== "undefined") {
      window.location.assign("/");
    }
  };

  return (
    <AuthCtx.Provider value={{ user, signIn, signOut, ready }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
