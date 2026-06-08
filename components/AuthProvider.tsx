"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { getRole } from "@/lib/auth";

interface AuthContextValue {
  user: User | null;
  role: "parent" | "child" | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({ user: null, role: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<"parent" | "child" | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(getFirebaseAuth(), async (u) => {
      setUser(u);
      if (u) {
        try {
          const r = await getRole(u.uid);
          setRole(r);
        } catch {
          setRole(null);
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });
  }, []);

  return <AuthContext.Provider value={{ user, role, loading }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
