"use client";

import PageLoader from "@/components/ui/PageLoader";
import AdminHeader from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useAuth } from "@/contexts/AuthContext";

export default function Loading() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-white font-cairo text-success-900" dir="rtl">
      <AdminHeader
        onLogout={logout}
        onToggleMenu={() => {}}
        activeTab="overview" // Fallback tab for loading
      />
      <div className="flex min-h-[calc(100vh-114px)] gap-4 px-[10px] py-2">
        <aside className="hidden w-[250px] shrink-0 lg:block">
          <div className="sticky top-[122px] h-[calc(100vh-130px)] min-h-[702px] overflow-y-auto">
            <AdminSidebar activeTab="overview" setActiveTab={() => {}} />
          </div>
        </aside>
        <main className="flex min-w-0 flex-1 items-center justify-center overflow-x-hidden px-4 py-6 lg:px-4">
          <PageLoader />
        </main>
      </div>
    </div>
  );
}
