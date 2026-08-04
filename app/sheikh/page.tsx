"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import PageLoader from "@/components/ui/PageLoader";
import { useBatches } from "@/queries/useBatches";
import { AdminSidebar, TabId } from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { Alert02, Clock01 } from "@dga-icons/react/duotone-rounded";
import Link from "next/link";
import { Students, Tv01 } from "@dga-icons/react/duotone-rounded";

export default function SheikhDashboard() {
  const { user, logout } = useAuth();
  
  const { data: batches = [], isLoading } = useBatches();
  
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const stats = {
    totalStudents: batches.reduce((acc: number, batch: any) => acc + (batch._count?.batch_students || 0), 0),
    todaySessions: 0,
    upcomingExams: 0,
  };

  return (
    <ProtectedRoute allowedRoles={["sheikh"]}>
      <div className="min-h-screen bg-success-50 font-cairo flex flex-col">
        
        <AdminHeader 
          onLogout={logout} 
          onToggleMenu={() => setMobileMenuOpen((open) => !open)}
          activeTab={activeTab}
        />

        {mobileMenuOpen && (
          <div className="fixed inset-0 top-[149px] z-40 bg-black/30 lg:hidden" onClick={() => setMobileMenuOpen(false)}>
            <div className="h-full w-[280px] bg-white" onClick={(event) => event.stopPropagation()}>
              <AdminSidebar
                activeTab={activeTab}
                setActiveTab={(tab) => {
                  setActiveTab(tab);
                  setMobileMenuOpen(false);
                }}
                mobile
              />
            </div>
          </div>
        )}

        <div className="flex flex-1 flex-col bg-success-50 lg:flex-row lg:gap-4 lg:bg-white lg:px-[10px] lg:py-2">
          {/* Desktop Sidebar */}
          <div className="hidden w-[250px] shrink-0 bg-white lg:block">
            <div className="sticky top-[122px] h-[calc(100vh-130px)] min-h-[702px] overflow-y-auto overflow-x-hidden">
              <AdminSidebar 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
              />
            </div>
          </div>

          {/* Main Content Area */}
          <main className="w-full min-w-0 flex-1 pb-[96px] lg:w-auto lg:pb-0">
            {isLoading ? (
              <PageLoader />
            ) : (
              <div className="min-h-[500px] w-full animate-fade-in overflow-x-hidden p-4 lg:px-6 lg:py-8">
                {activeTab === "overview" && (
                  <div dir="rtl" className="flex w-full flex-col gap-8 text-right lg:grid lg:grid-cols-3 lg:gap-x-6 lg:gap-y-8 animate-slide-up">
                    <article className="flex h-[118px] flex-col items-center justify-center gap-2 rounded-2xl p-4 text-right shadow-[0_2px_10px_5px_rgba(0,10,1,0.25)] lg:h-[134px] lg:items-stretch lg:px-4 lg:py-6 bg-success-100">
                      <div className="flex w-full items-center justify-center gap-2 lg:justify-start">
                        <Students aria-hidden="true" size={36} color="#4FB057" />
                        <h2 className="text-2xl font-bold leading-9 text-success-900">إجمالي الطلاب</h2>
                      </div>
                      <p className="w-full text-center text-[28px] leading-[42px] text-neutral-800">{stats.totalStudents}</p>
                    </article>
                    
                    <article className="flex h-[118px] flex-col items-center justify-center gap-2 rounded-2xl p-4 text-right shadow-[0_2px_10px_5px_rgba(0,10,1,0.25)] lg:h-[134px] lg:items-stretch lg:px-4 lg:py-6 bg-warning-100">
                      <div className="flex w-full items-center justify-center gap-2 lg:justify-start">
                        <Clock01 aria-hidden="true" size={36} color="#B17C08" />
                        <h2 className="text-2xl font-bold leading-9 text-success-900">جلسات اليوم</h2>
                      </div>
                      <p className="w-full text-center text-[28px] leading-[42px] text-neutral-800">{stats.todaySessions}</p>
                    </article>

                    <article className="flex h-[118px] flex-col items-center justify-center gap-2 rounded-2xl p-4 text-right shadow-[0_2px_10px_5px_rgba(0,10,1,0.25)] lg:h-[134px] lg:items-stretch lg:px-4 lg:py-6 bg-danger-100">
                      <div className="flex w-full items-center justify-center gap-2 lg:justify-start">
                        <Alert02 aria-hidden="true" size={36} color="#BB3535" />
                        <h2 className="text-2xl font-bold leading-9 text-success-900">امتحانات قادمة</h2>
                      </div>
                      <p className="w-full text-center text-[28px] leading-[42px] text-neutral-800">{stats.upcomingExams}</p>
                    </article>
                  </div>
                )}

                {activeTab === "batches" && (
                  <div className="animate-slide-up flex flex-col gap-6" dir="rtl">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                      <h2 className="text-2xl font-bold text-[#17481B] font-cairo">حلقاتي</h2>
                      <div className="w-full md:w-[400px]">
                        <input
                          type="text"
                          placeholder="أبحث عن حلقة..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full px-4 py-3 border border-[#A3C3D7] rounded-[8px] focus:outline-none focus:border-[#17481B] font-cairo text-sm text-[#79817A] bg-white"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {batches
                        .filter((b: any) => b.name.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((batch: any) => (
                        <Link
                          key={batch.id}
                          href={`/batches/${batch.id}`}
                          className="bg-white border border-[#A3C3D7] rounded-[16px] p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4"
                        >
                          <div className="flex justify-between items-start w-full">
                            <h3 className="font-bold text-[#17481B] font-cairo text-[20px] leading-[150%]">
                              {batch.name}
                            </h3>
                            <Tv01 aria-hidden="true" size={28} color="#B17C08" />
                          </div>
                          
                          <div className="flex flex-col gap-2 w-full text-right">
                            <span className="font-cairo text-[#79817A] text-[14px]">
                              {batch.schedule_description || "لا يوجد وصف للجدول"}
                            </span>
                          </div>

                          <div className="flex justify-start pt-4 border-t border-gray-100 w-full">
                             <div className="flex items-center gap-2 bg-[#E2F7E4] px-4 py-2 rounded-[48px]">
                               <Students aria-hidden="true" size={20} color="#17481B" />
                               <span className="text-[#17481B] font-cairo font-bold text-[14px]">
                                 {batch._count?.batch_students || 0} طلاب
                               </span>
                             </div>
                          </div>
                        </Link>
                      ))}
                      {batches.length === 0 && (
                        <div className="col-span-full p-8 text-center text-gray-500 font-cairo bg-white rounded-2xl">
                          لا يوجد حلقات مخصصة لك حالياً
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
