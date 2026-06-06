"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import PageLoader from "@/components/ui/PageLoader";

export default function GuestRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user && !isLoading) {
      switch (user.role) {
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
    }
  }, [isAuthenticated, user, isLoading, router]);

  if (isLoading) {
    return <PageLoader />;
  }

  // If authenticated, we show nothing while redirecting
  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
