"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import PageLoader from "@/components/ui/PageLoader";
import { AdminSidebar, TabId } from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { 
  Award01, 
  Tv01, 
  BookOpen01, 
  Star,
  Time01
} from "@dga-icons/react/duotone-rounded";
import LeaderboardPreview from "@/components/public/LeaderboardPreview";
import Link from "next/link";

interface Batch {
  id: number;
  name: string;
  schedule_description?: string;
  rank?: number;
  points?: number;
}

interface RecentSession {
  id: number;
  date: string;
  attendance: string;
  jadeed_grade?: string;
  muraja_grade?: string;
}

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function StudentDashboardPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <StudentDashboardPageContent />
    </Suspense>
  );
}

function StudentDashboardPageContent() {
  const { user, logout } = useAuth();
  
  const [batches, setBatches] = useState<Batch[]>([]);
  const [recentSessions, setRecentSessions] = useState<RecentSession[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [totalPoints, setTotalPoints] = useState(0);
  const [myRank, setMyRank] = useState(0);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const defaultTab = (searchParams.get("tab") as TabId) || "overview";

  const [activeTab, setActiveTab] = useState<TabId>(defaultTab);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const tab = searchParams.get("tab") as TabId;
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
    router.replace(`/student/dashboard?tab=${tab}`);
  };

  useEffect(() => {
    // Mock loading delay for demonstration
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const getAttendanceStyle = (attendance: string) => {
    switch (attendance) {
      case "حاضر":
        return "bg-[#E2F7E4] text-[#17481B]";
      case "غائب":
        return "bg-[#F7D9E4] text-[#4E0027]";
      case "متأخر":
        return "bg-[#F7EACF] text-[#4A3200]";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <ProtectedRoute allowedRoles={["student"]}>
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
                  handleTabChange(tab);
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
                setActiveTab={handleTabChange} 
              />
            </div>
          </div>

          {/* Main Content Area */}
          <main className="w-full min-w-0 flex-1 pb-[96px] lg:w-auto lg:pb-0">
            {isLoading ? (
              <PageLoader />
            ) : (
              <div className="min-h-[500px] w-full animate-fade-in overflow-x-hidden p-4 lg:px-6 lg:py-8">
                
                {/* OVERVIEW TAB */}
                {activeTab === "overview" && (
                  <div dir="rtl" className="flex flex-col gap-8 animate-slide-up">
                    <div className="flex w-full flex-col gap-8 text-right lg:grid lg:grid-cols-3 lg:gap-x-6 lg:gap-y-8">
                      <article className="flex h-[118px] flex-col items-center justify-center gap-2 rounded-2xl p-4 text-right shadow-[0_2px_10px_5px_rgba(0,10,1,0.25)] lg:h-[134px] lg:items-stretch lg:px-4 lg:py-6 bg-warning-100">
                        <div className="flex w-full items-center justify-center gap-2 lg:justify-start">
                          <Star aria-hidden="true" size={36} color="#B17C08" />
                          <h2 className="text-2xl font-bold leading-9 text-success-900">نقاطي</h2>
                        </div>
                        <p className="w-full text-center text-[28px] leading-[42px] text-neutral-800">{totalPoints}</p>
                      </article>
                      
                      <article className="flex h-[118px] flex-col items-center justify-center gap-2 rounded-2xl p-4 text-right shadow-[0_2px_10px_5px_rgba(0,10,1,0.25)] lg:h-[134px] lg:items-stretch lg:px-4 lg:py-6 bg-primary-100">
                        <div className="flex w-full items-center justify-center gap-2 lg:justify-start">
                          <Award01 aria-hidden="true" size={36} color="#338AB3" />
                          <h2 className="text-2xl font-bold leading-9 text-success-900">ترتيبي</h2>
                        </div>
                        <p className="w-full text-center text-[28px] leading-[42px] text-neutral-800" dir="ltr">#{myRank}</p>
                      </article>

                      <article className="flex h-[118px] flex-col items-center justify-center gap-2 rounded-2xl p-4 text-right shadow-[0_2px_10px_5px_rgba(0,10,1,0.25)] lg:h-[134px] lg:items-stretch lg:px-4 lg:py-6 bg-success-100">
                        <div className="flex w-full items-center justify-center gap-2 lg:justify-start">
                          <Tv01 aria-hidden="true" size={36} color="#4FB057" />
                          <h2 className="text-2xl font-bold leading-9 text-success-900">حلقاتي</h2>
                        </div>
                        <p className="w-full text-center text-[28px] leading-[42px] text-neutral-800">{batches.length}</p>
                      </article>
                    </div>
                  </div>
                )}

                {/* SESSIONS TAB */}
                {activeTab === "sessions" && (
                  <div className="animate-slide-up flex flex-col gap-6" dir="rtl">
                    <h2 className="text-2xl font-bold text-[#17481B] font-cairo">الجلسات الأخيرة</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {recentSessions.map((session) => (
                        <div key={session.id} className="bg-white border border-[#A3C3D7] rounded-[16px] p-6 shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-center w-full pb-3 border-b border-gray-100">
                            <span className="font-cairo font-bold text-[18px] text-[#000000]">
                              {new Date(session.date).toLocaleDateString("ar-EG", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                              })}
                            </span>
                            <div className={`flex flex-row justify-center items-center py-[4px] px-[12px] gap-[10px] rounded-[48px] ${getAttendanceStyle(session.attendance)}`}>
                              <span className="font-cairo font-normal text-[12px] text-center">
                                {session.attendance}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-2 w-full text-right">
                            {session.jadeed_grade && (
                              <div className="flex justify-between font-cairo text-[14px]">
                                <span className="text-[#79817A]">الحفظ:</span>
                                <span className="text-[#17481B] font-bold">{session.jadeed_grade}</span>
                              </div>
                            )}
                            {session.muraja_grade && (
                              <div className="flex justify-between font-cairo text-[14px]">
                                <span className="text-[#79817A]">المراجعة:</span>
                                <span className="text-[#17481B] font-bold">{session.muraja_grade}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      {recentSessions.length === 0 && (
                        <div className="col-span-full p-8 text-center text-gray-500 font-cairo bg-white rounded-2xl">
                          لا توجد جلسات مسجلة مؤخراً
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* BATCHES TAB */}
                {activeTab === "batches" && (
                  <div className="animate-slide-up flex flex-col gap-6" dir="rtl">
                    <h2 className="text-2xl font-bold text-[#17481B] font-cairo">حلقاتي</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {batches.map((batch) => (
                        <div key={batch.id} className="bg-white border border-[#A3C3D7] rounded-[16px] p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4">
                          <div className="flex justify-between items-start w-full">
                            <h3 className="font-bold text-[#17481B] font-cairo text-[20px] leading-[150%]">
                              {batch.name}
                            </h3>
                            <Tv01 aria-hidden="true" size={28} color="#338AB3" />
                          </div>
                          <div className="flex flex-col gap-2 w-full text-right">
                            <span className="font-cairo text-[#79817A] text-[14px]">
                              {batch.schedule_description || "لا يوجد وصف للجدول"}
                            </span>
                          </div>
                          {batch.rank && (
                            <div className="flex justify-start pt-4 border-t border-gray-100 w-full">
                              <div className="flex items-center gap-2 bg-[#F7EACF] px-4 py-2 rounded-[48px]">
                                <Award01 aria-hidden="true" size={20} color="#4A3200" />
                                <span className="text-[#4A3200] font-cairo font-bold text-[14px]">
                                  المركز {batch.rank}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      {batches.length === 0 && (
                        <div className="col-span-full p-8 text-center text-gray-500 font-cairo bg-white rounded-2xl">
                          لم يتم إضافتك لأي حلقة حتى الآن
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* LEADERBOARD TAB */}
                {activeTab === "leaderboard" && (
                  <div className="animate-slide-up" dir="rtl">
                     <LeaderboardPreview students={leaderboard} />
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
