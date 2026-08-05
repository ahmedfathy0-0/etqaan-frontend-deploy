"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

import Image from "next/image";
import AppLogo from "@/components/ui/AppLogo";
export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push("/batches");
      return;
    }

    // Role-based redirection
    switch (user?.role) {
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
        // Fallback for unknown roles
        router.push("/batches");
    }
  }, [isAuthenticated, isLoading, user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-success-50 font-cairo">
      <div className="text-center flex flex-col items-center">
        <AppLogo className="w-24 h-24 mb-6 object-contain text-success-800" />
        <div className="w-12 h-12 border-4 border-success-200 border-t-success-700 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-neutral-700 font-bold text-lg animate-pulse">
          جاري التوجيه...
        </p>
      </div>
    </div>
  );
}
