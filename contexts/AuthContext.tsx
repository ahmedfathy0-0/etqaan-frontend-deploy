"use client";

import React, { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, User, UserRole } from "@/stores/authStore";
import { api } from "@/lib/api";

export type { User, UserRole };

// We keep AuthProvider for backward compatibility, although it doesn't need to wrap children with a Context anymore.
// We can use it to initialize some global things if needed, or just return children.
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // In Zustand persist, hydration happens automatically, so we don't need the old useEffect for localStorage.
  return <>{children}</>;
}

export function useAuth() {
  const { user, token, isLoading, logout: zustandLogout, setAuth } = useAuthStore();
  const router = useRouter();

  // Backward compatible login function (although we will migrate to React Query mutations later)
  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const response = await api.post('/auth/login', { email, password });
        const { id, name, role, accessToken } = response.data;
        
        const userData: User = {
          id: id || 0, 
          name,
          email,
          role,
        };

        setAuth(userData, accessToken);

        // Redirect based on role
        switch (role) {
          case "super_admin":
          case "admin":
            router.push("/admin");
            break;
          case "sheikh":
            router.push("/sheikh");
            break;
          case "student":
            router.push("/student/dashboard");
            break;
          default:
            router.push("/");
        }
      } catch (error) {
        throw error;
      }
    },
    [router, setAuth]
  );

  const logout = useCallback(() => {
    zustandLogout();
    router.push("/");
  }, [router, zustandLogout]);

  return {
    user,
    token,
    isLoading,
    login,
    logout,
    isAuthenticated: !!token && !!user,
  };
}

// Helper hook for role checks
export function useRequireAuth(allowedRoles?: UserRole[]) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for hydration before redirecting
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        router.push("/unauthorized");
      }
    }
  }, [isAuthenticated, isLoading, user, allowedRoles, router]);

  return { user, isLoading, isAuthenticated };
}
