"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  clearSession,
  readSession,
  saveSession,
  SessionUser,
} from "@/lib/session";

type SessionOptions = {
  redirectIfAuthenticated?: boolean;
  requireAuth?: boolean;
};

export function useSession(options: SessionOptions = {}) {
  const { redirectIfAuthenticated = false, requireAuth = false } = options;
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<SessionUser | null>(null);

  useEffect(() => {
    let isMounted = true;

    queueMicrotask(() => {
      if (!isMounted) {
        return;
      }

      const currentSession = readSession();
      setSession(currentSession);
      setReady(true);

      if (requireAuth && !currentSession) {
        router.replace("/login");
      }

      if (redirectIfAuthenticated && currentSession) {
        router.replace("/dashboard");
      }
    });

    return () => {
      isMounted = false;
    };
  }, [redirectIfAuthenticated, requireAuth, router]);

  function login(nextSession: SessionUser) {
    saveSession(nextSession);
    setSession(nextSession);
    router.replace("/dashboard");
  }

  function logout() {
    clearSession();
    setSession(null);
    router.replace("/login");
  }

  return {
    login,
    logout,
    ready,
    session,
  };
}
