"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import PageLoader from "@/components/ui/PageLoader";
import { AdminSidebar, TabId } from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { Award01, Tv01, Search01, Star, Filter } from "@dga-icons/react/duotone-rounded";
import { Students } from "@dga-icons/react/duotone-rounded";
import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useBatches } from "@/queries/useBatches";
import { api } from "@/lib/api";

export default function StudentDashboardPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <StudentDashboardPageContent />
    </Suspense>
  );
}

function BatchCard({ batch, isOwn }: { batch: any; isOwn: boolean }) {
  return (
    <article className="flex min-h-[164px] flex-col gap-5 rounded-2xl bg-white p-4 text-right shadow-[0_2px_10px_5px_rgba(0,10,1,0.25)]">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <h2 className="truncate text-xl lg:text-2xl font-bold leading-8 lg:leading-9 text-success-900">
            {batch.name}
          </h2>
          {isOwn && (
            <span className="text-[11px] bg-success-100 text-success-800 px-2 py-1 rounded-full font-bold">حلقتي</span>
          )}
        </div>
      </div>
      <p className="truncate text-base leading-6 text-neutral-800">
        {batch.schedule_description || `${batch._count?.batch_students || 0} طالب`}
      </p>
      <Link
        href={`/batches/detail?id=${batch.id}`}
        className="mt-auto flex h-10 w-full items-center justify-center rounded-2xl border-2 border-success-700 text-base lg:text-lg font-bold text-success-900 transition-colors hover:bg-success-100"
      >
        عرض التفاصيل
      </Link>
    </article>
  );
}

function StudentDashboardPageContent() {
  const { user, logout } = useAuth();
  const { data: allBatches = [], isLoading } = useBatches();
  const searchParams = useSearchParams();
  const router = useRouter();
  const defaultTab = (searchParams.get("tab") as TabId) || "overview";

  const [activeTab, setActiveTab] = useState<TabId>(defaultTab);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name_asc");
  const [myStudentId, setMyStudentId] = useState<number | null>(null);
  const [myPoints, setMyPoints] = useState(0);
  const [myRank, setMyRank] = useState<number | null>(null);

  useEffect(() => {
    const tab = searchParams.get("tab") as TabId;
    if (tab && tab !== activeTab) setActiveTab(tab);
  }, [searchParams]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  // Load student ID linked to this user account
  useEffect(() => {
    if (!user) return;
    api.get(`/students?userId=${user.id}`).then((res) => {
      const list = Array.isArray(res.data) ? res.data : [];
      const mine = list.find((s: any) => s.user_id === user.id);
      if (mine) setMyStudentId(mine.id);
    }).catch(() => {});
  }, [user]);

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
    router.replace(`/student/dashboard?tab=${tab}`);
  };

  // Determine own batches vs others based on batch_students data
  const ownBatches = allBatches.filter((b: any) =>
    (b.batch_students || []).some((bs: any) => Number(bs.student?.user_id) === Number(user?.id))
  );
  const otherBatches = allBatches.filter((b: any) =>
    !(b.batch_students || []).some((bs: any) => Number(bs.student?.user_id) === Number(user?.id))
  );

  const sortFn = (a: any, b: any) => {
    if (sortBy === "name_desc") return b.name.localeCompare(a.name, "ar");
    if (sortBy === "students_desc") return (b._count?.batch_students || 0) - (a._count?.batch_students || 0);
    if (sortBy === "students_asc") return (a._count?.batch_students || 0) - (b._count?.batch_students || 0);
    return a.name.localeCompare(b.name, "ar");
  };

  const filteredOwn = ownBatches.filter((b: any) => b.name.toLowerCase().includes(searchTerm.toLowerCase())).sort(sortFn);
  const filteredOther = otherBatches.filter((b: any) => b.name.toLowerCase().includes(searchTerm.toLowerCase())).sort(sortFn);

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <div className="min-h-screen bg-white font-cairo text-success-900" dir="rtl">
        <AdminHeader
          onLogout={logout}
          onToggleMenu={() => setMobileMenuOpen(true)}
          activeTab={activeTab}
        />

        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setMobileMenuOpen(false)}>
            <div className="h-full w-[280px] bg-white" onClick={(e) => e.stopPropagation()}>
              <AdminSidebar activeTab={activeTab} setActiveTab={(tab) => { handleTabChange(tab); setMobileMenuOpen(false); }} mobile />
            </div>
          </div>
        )}

        <div className="flex min-h-[calc(100vh-114px)] gap-4 px-[10px] py-2">
          <aside className="hidden w-[250px] shrink-0 lg:block">
            <div className="sticky top-[122px] h-[calc(100vh-130px)] min-h-[702px] overflow-y-auto">
              <AdminSidebar activeTab={activeTab} setActiveTab={handleTabChange} />
            </div>
          </aside>

          <main className="min-w-0 flex-1 overflow-x-hidden px-4 py-6 pb-[96px] lg:pb-6">
            {isLoading ? <PageLoader /> : (
              <>
                {activeTab === "overview" && (
                  <div className="flex flex-col gap-6">
                    <div className="grid grid-cols-2 gap-4">
                      <article className="flex flex-col items-center justify-center gap-2 rounded-2xl p-4 shadow-[0_2px_10px_5px_rgba(0,10,1,0.25)] bg-warning-100 min-h-[110px]">
                        <div className="flex items-center gap-2">
                          <Star aria-hidden="true" size={28} color="#B17C08" />
                          <h2 className="text-lg font-bold text-success-900">نقاطي</h2>
                        </div>
                        <p className="text-3xl font-bold text-neutral-800">{myPoints}</p>
                      </article>
                      <article className="flex flex-col items-center justify-center gap-2 rounded-2xl p-4 shadow-[0_2px_10px_5px_rgba(0,10,1,0.25)] bg-success-100 min-h-[110px]">
                        <div className="flex items-center gap-2">
                          <Tv01 aria-hidden="true" size={28} color="#4FB057" />
                          <h2 className="text-lg font-bold text-success-900">حلقاتي</h2>
                        </div>
                        <p className="text-3xl font-bold text-neutral-800">{ownBatches.length}</p>
                      </article>
                    </div>

                    {ownBatches.length > 0 && (
                      <div className="flex flex-col gap-3">
                        <h2 className="text-xl font-bold text-success-800">حلقتي</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {ownBatches.map((b: any) => (
                            <BatchCard key={b.id} batch={b} isOwn={true} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "batches" && (
                  <div className="flex flex-col gap-6">
                    <div className="mb-6 flex h-12 w-full items-center gap-4">
                      <label className="relative h-12 min-w-0 flex-1">
                        <span className="sr-only">البحث عن حلقة</span>
                        <input
                          type="search"
                          placeholder="أبحث عن"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="h-12 w-full rounded-2xl border-[1.5px] border-neutral-800 bg-white py-3 pr-11 pl-3 text-right text-base text-success-900 outline-none placeholder:text-success-900 focus:border-success-800"
                        />
                        <Search01 aria-hidden="true" size={24} className="absolute right-3 top-1/2 -translate-y-1/2 text-success-800" />
                      </label>

                      <label className="relative flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center text-neutral-800">
                        <span className="sr-only">ترتيب الحلقات</span>
                        <Filter aria-hidden="true" size={32} />
                        <select
                          value={sortBy}
                          onChange={(event) => setSortBy(event.target.value)}
                          className="absolute inset-0 cursor-pointer opacity-0"
                        >
                          <option value="name_asc">الاسم (أ-ي)</option>
                          <option value="name_desc">الاسم (ي-أ)</option>
                          <option value="students_desc">عدد الطلاب (الأكثر)</option>
                          <option value="students_asc">عدد الطلاب (الأقل)</option>
                        </select>
                      </label>
                    </div>

                    <section>
                      <h2 className="text-xl font-bold text-success-800 mb-3">حلقتي</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredOwn.map((b: any) => (
                          <BatchCard key={b.id} batch={b} isOwn={true} />
                        ))}
                        {filteredOwn.length === 0 && <p className="col-span-full text-center text-neutral-500 py-6 bg-white rounded-2xl">لا توجد حلقات</p>}
                      </div>
                    </section>

                    <section>
                      <h2 className="text-xl font-bold text-neutral-600 mb-3">حلقات أخرى</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredOther.map((b: any) => (
                          <BatchCard key={b.id} batch={b} isOwn={false} />
                        ))}
                        {filteredOther.length === 0 && <p className="col-span-full text-center text-neutral-500 py-6 bg-white rounded-2xl">لا توجد حلقات أخرى</p>}
                      </div>
                    </section>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
