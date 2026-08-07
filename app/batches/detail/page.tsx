"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowDown01,
  ArrowLeft01,
  Award01,
  Filter,
  Menu01,
  MoreVertical,
  Search01,
  TaskAdd01,
  Delete01,
  Tv01,
  UserAdd01,
} from "@dga-icons/react/duotone-rounded";
import { toast } from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useBatchDetails, useEnrollStudents, useUnenrollStudent } from "@/queries/useBatches";
import { useBatchExams } from "@/queries/useExams";
import { useStudents } from "@/queries/useStudents";
import { AdminSidebar, type TabId } from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import RankMedal from "@/components/ui/RankMedal";
import AddStudentModal from "@/components/batches/AddStudentModal";
import Avatar from "@/components/ui/Avatar";
import Modal from "@/components/ui/Modal";
import PageLoader from "@/components/ui/PageLoader";
import StudentHistoryModal from "@/components/public/StudentHistoryModal";

interface Student {
  id: number;
  batch_student_id: number;
  name: string;
  points: number;
  avatarIndex?: number;
  rank: number;
}

interface AvailableStudent {
  id: number;
  full_name: string;
  guardian_name?: string;
}

const sidebarRoutes: Record<TabId, string> = {
  overview: "/admin",
  users: "/admin",
  students: "/admin",
  batches: "/admin",
  quotes: "/admin",
  notices: "/admin",
  exams: "/sheikh",
  sessions: "/sheikh",
  leaderboard: "/student/dashboard",
};

const medalStyles = [
  "bg-[#fff1d7] text-[#b17c08]",
  "bg-neutral-200 text-neutral-700",
  "bg-[#f7eacf] text-[#845a00]",
];

export default function BatchDetailsPage() {
  const searchParams = useSearchParams();
  const batchId = searchParams.get("id") || "";
  const router = useRouter();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("points_desc");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showAddSessionModal, setShowAddSessionModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [availableStudents, setAvailableStudents] = useState<AvailableStudent[]>([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const isAdmin = ["admin", "super_admin"].includes(user?.role || "");
  const isSheikh = user?.role === "sheikh";
  const isStudent = user?.role === "student";
  const isPublic = !user;

  const { data, isLoading, isError } = useBatchDetails(batchId);
  const { data: exams = [], isLoading: examsLoading } = useBatchExams(batchId);
  const { data: allStudents } = useStudents();
  const { mutateAsync: enrollStudents } = useEnrollStudents();
  const { mutateAsync: unenrollStudent } = useUnenrollStudent();
  const batch = data?.batch;

  // Determine if the current user "owns" this batch
  const batchSheikhIds: number[] = (batch?.batch_sheikhs || []).map((bs: any) => bs.sheikh_id ?? bs.sheikh?.id);
  const isOwnBatch = isSheikh
    ? batchSheikhIds.includes(Number(user?.id) || 0)
    : isStudent
    ? (data?.students || []).some((s: any) => Number(s.user_id) === Number(user?.id))
    : isAdmin;

  const canManage = isAdmin || (isSheikh && isOwnBatch);
  const canEnroll = canManage; // same rule for enrollment

  const allStudentsRanked: Student[] = (data?.students || []).map((student: Omit<Student, "rank">, index: number) => ({
    ...student,
    rank: index + 1,
  }));

  // Public and student-in-other-batch: only top 3
  const students: Student[] = (isPublic || (isStudent && !isOwnBatch))
    ? allStudentsRanked.slice(0, 3)
    : allStudentsRanked;

  useEffect(() => {
    if (!showAddStudentModal || !allStudents) return;
    const enrolled = new Set(allStudentsRanked.map((student) => student.id));
    setAvailableStudents(allStudents.filter((student: AvailableStudent) => !enrolled.has(student.id)));
  }, [showAddStudentModal, allStudents, data?.students]);

  const filteredStudents = students
    .filter((student) => student.name.toLowerCase().includes(searchQuery.trim().toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "name_asc") return a.name.localeCompare(b.name, "ar");
      if (sortBy === "name_desc") return b.name.localeCompare(a.name, "ar");
      if (sortBy === "points_asc") return a.points - b.points;
      return b.points - a.points;
    });

  const handleStudentClick = (student: Student) => {
    if (isPublic || (isStudent && !isOwnBatch)) return; // no modal for public or in other-batch
    if (isStudent && (student as any).user_id !== user?.id) {
      return toast.error("عفواً، لا يمكنك عرض تفاصيل طلاب آخرين");
    }
    setSelectedStudent(student);
    setShowHistoryModal(true);
  };

  const handleRemoveStudent = async (student: Student, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`هل أنت متأكد من إزالة الطالب ${student.name} من الحلقة؟`)) return;
    try {
      await unenrollStudent({ batchId, studentId: student.id });
      toast.success("تم إزالة الطالب بنجاح");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "حدث خطأ أثناء إزالة الطالب");
    }
  };

  const handleEnrollStudent = async () => {
    if (!selectedStudentIds.length) return;
    setFormLoading(true);
    setFormError("");
    try {
      await enrollStudents({ batchId, studentIds: selectedStudentIds });
      setShowAddStudentModal(false);
      setSelectedStudentIds([]);
    } catch (error: any) {
      setFormError(error.response?.data?.message || "حدث خطأ أثناء إضافة الطلاب");
    } finally {
      setFormLoading(false);
    }
  };

  const handleSidebar = (tab: TabId) => {
    setMobileMenuOpen(false);
    router.push(`${sidebarRoutes[tab]}?tab=${tab}`);
  };

  return (
    <div className="min-h-screen bg-white font-cairo text-success-900" dir="rtl">
      <AddStudentModal
        isOpen={showAddStudentModal}
        onClose={() => setShowAddStudentModal(false)}
        availableStudents={availableStudents}
        selectedStudentIds={selectedStudentIds}
        setSelectedStudentIds={setSelectedStudentIds}
        formError={formError}
        formLoading={formLoading}
        onEnroll={handleEnrollStudent}
      />

      <AdminHeader
        onLogout={logout}
        onToggleMenu={() => setMobileMenuOpen(true)}
        activeTab="batches"
        customTitle={batch?.name || "تفاصيل الحلقة"}
      >
        {canManage && (
          <>
            <Link href={`/sheikh/session/new?batchId=${batchId}`} className="flex h-14 min-w-[190px] items-center justify-center gap-4 rounded-2xl bg-warning-600 px-5 font-bold text-warning-50 hover:bg-warning-700">
              <TaskAdd01 aria-hidden="true" size={24} /> تسجيل الحضور
            </Link>
            {canEnroll && (
              <button onClick={() => setShowAddStudentModal(true)} className="flex h-14 min-w-[190px] items-center justify-center gap-4 rounded-2xl bg-primary-600 px-5 font-bold text-white hover:bg-primary-700">
                <UserAdd01 aria-hidden="true" size={24} /> إضافة طالب
              </button>
            )}
            <Link href={`/batches/exams?batchId=${batchId}`} className="flex h-14 min-w-[190px] items-center justify-center gap-4 rounded-2xl bg-success-800 px-5 font-bold text-white hover:bg-success-900">
              <Tv01 aria-hidden="true" size={24} /> إدارة الاختبارات
            </Link>
          </>
        )}
      </AdminHeader>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div className="h-full w-[280px] bg-white" onClick={(event) => event.stopPropagation()}>
            <AdminSidebar activeTab="batches" setActiveTab={handleSidebar} mobile />
          </div>
        </div>
      )}

      <div className="flex min-h-[calc(100vh-114px)] gap-4 px-[10px] py-2">
        <aside className="hidden w-[250px] shrink-0 lg:block">
          <div className="sticky top-[122px] h-[calc(100vh-130px)] min-h-[702px] overflow-y-auto">
            <AdminSidebar activeTab="batches" setActiveTab={handleSidebar} />
          </div>
        </aside>

        <main className="min-w-0 flex-1 overflow-x-hidden px-4 py-6 pb-[96px] lg:pb-6 lg:px-4" aria-busy={isLoading}>
          {isLoading ? (
            <PageLoader />
          ) : isError || !batch ? (
            <div className="mx-auto max-w-xl border border-danger-300 bg-danger-50 p-8 text-center font-bold text-danger-800">
              تعذر تحميل بيانات الحلقة.
            </div>
          ) : (
            <div className="mx-auto flex w-full flex-col gap-9 xl:px-8">


              <section className="overflow-hidden rounded-xl bg-white shadow-[0_2px_10px_5px_rgba(0,10,1,0.25)]" aria-labelledby="honor-title">
                <div className="flex min-h-14 items-center justify-between gap-4 px-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <Award01 aria-hidden="true" size={26} className="shrink-0 text-warning-600" />
                    <h2 id="honor-title" className="truncate text-xl font-bold sm:text-[28px]">لوحة الشرف</h2>
                  </div>
                  <a href="#students" className="flex shrink-0 items-center gap-2 text-base font-bold text-success-800 sm:text-lg">
                    عرض الكل <ArrowLeft01 aria-hidden="true" size={22} />
                  </a>
                </div>
                <div className="grid grid-cols-1 divide-y divide-dashed divide-neutral-500/40 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:divide-x-reverse">
                  {students.slice(0, 3).map((student, index) => (
                    <button key={student.id} onClick={() => handleStudentClick(student)} className="flex min-h-[167px] flex-col items-center justify-center gap-3 px-3 py-4 hover:bg-success-50">
                      <div className="relative flex items-center justify-center">
                        <RankMedal rank={(index + 1) as 1 | 2 | 3} className="h-[84px] w-[60px]" />
                      </div>
                      <span className="max-w-full truncate text-xl sm:text-2xl font-bold">{student.name}</span>
                    </button>
                  ))}
                  {!students.length && <p className="col-span-3 py-12 text-center text-neutral-700">لا توجد نتائج بعد</p>}
                </div>
              </section>

              <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_450px]">
                <section id="students" className="min-w-0 scroll-mt-32 px-1" aria-labelledby="students-title">
                  <h2 id="students-title" className="mb-4 text-xl lg:text-2xl font-bold">الطلاب ({filteredStudents.length})</h2>
                  
                  <div className="mb-6 flex h-12 w-full items-center gap-4 px-4 lg:px-0">
                    <label className="relative h-12 min-w-0 flex-1">
                      <span className="sr-only">البحث عن طالب</span>
                      <input
                        type="search"
                        placeholder="أبحث عن طالب"
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        className="h-12 w-full rounded-2xl border-[1.5px] border-neutral-800 bg-white py-3 pr-11 pl-3 text-right text-base text-success-900 outline-none placeholder:text-success-900 focus:border-success-800"
                      />
                      <Search01 aria-hidden="true" size={24} className="absolute right-3 top-1/2 -translate-y-1/2 text-success-800" />
                    </label>
                    <label className="relative flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center text-neutral-800">
                      <span className="sr-only">ترتيب الطلاب</span>
                      <Filter aria-hidden="true" size={32} />
                      <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="absolute inset-0 cursor-pointer opacity-0">
                        <option value="points_desc">النقاط: الأعلى</option>
                        <option value="points_asc">النقاط: الأقل</option>
                        <option value="name_asc">الاسم (أ-ي)</option>
                        <option value="name_desc">الاسم (ي-أ)</option>
                      </select>
                    </label>
                  </div>
                  <div className="flex flex-col gap-2">
                    {filteredStudents.map((student) => (
                      <div
                        key={student.id}
                        className="grid min-h-12 w-full grid-cols-[36px_minmax(100px,1fr)_auto_24px] items-center gap-3 rounded-lg px-1 text-right hover:bg-success-50 sm:grid-cols-[36px_minmax(120px,1fr)_auto_auto_auto_24px]"
                      >
                        <button
                          onClick={() => handleStudentClick(student)}
                          className="col-span-1 flex items-center justify-center focus-visible:outline-2 focus-visible:outline-success-700 rounded-full"
                        >
                          <Avatar name={student.name} className="h-9 w-9 rounded-full text-sm" />
                        </button>
                        <button
                          onClick={() => handleStudentClick(student)}
                          className="truncate font-medium text-right focus-visible:outline-2 focus-visible:outline-success-700 rounded"
                        >
                          {student.name}
                        </button>
                        <span className="rounded-full bg-success-200 px-3 py-1 text-[11px] text-success-800">{student.points} نقطة</span>
                        <span className="hidden rounded-full bg-warning-200 px-3 py-1 text-[11px] text-warning-800 sm:inline">الترتيب {student.rank}</span>
                        <span className="hidden rounded-full bg-danger-200 px-3 py-1 text-[11px] text-danger-800 sm:inline">طالب</span>
                        {canManage ? (
                          <button
                            onClick={(e) => handleRemoveStudent(student, e)}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-danger-600 hover:bg-danger-100 transition-colors"
                            title="إزالة من الحلقة"
                          >
                            <Delete01 aria-hidden="true" size={22} />
                          </button>
                        ) : (
                          <MoreVertical aria-hidden="true" size={24} className="text-neutral-800" />
                        )}
                      </div>
                    ))}
                    {!filteredStudents.length && (
                      <div className="border border-neutral-300 py-10 text-center text-neutral-700">
                        {searchQuery ? "لا يوجد طالب بهذا الاسم" : "لا يوجد طلاب في هذه الحلقة"}
                      </div>
                    )}
                  </div>
                </section>

                <section className="rounded-2xl bg-white p-4 shadow-[0_2px_10px_5px_rgba(34,23,1,0.25)]" aria-labelledby="exams-title">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h2 id="exams-title" className="text-xl lg:text-2xl font-bold">الاختبارات السابقة</h2>
                    <Link href={`/batches/exams?batchId=${batchId}`} className="flex items-center gap-1 font-medium text-secondary-700">
                      {new Date().getFullYear()} <ArrowDown01 aria-hidden="true" size={24} />
                    </Link>
                  </div>
                  <div className="flex flex-col gap-2">
                    {examsLoading ? (
                      <p className="py-6 text-center text-neutral-700">جاري تحميل الاختبارات...</p>
                    ) : exams.length ? (
                      exams.slice(0, 3).map((exam) => (
                        <Link key={exam.id} href={`/batches/exams/grades?batchId=${batchId}&examId=${exam.id}`} className="flex min-h-[40px] items-center gap-2 hover:text-success-700">
                          <span className="min-w-0 flex-1 truncate">{exam.title}</span>
                          <span className="shrink-0 rounded-full bg-primary-200 px-4 py-2 text-sm text-primary-800">الدرجة من {exam.max_score}</span>
                          <ArrowLeft01 aria-hidden="true" size={24} />
                        </Link>
                      ))
                    ) : (
                      <p className="py-6 text-center text-neutral-700">لا توجد اختبارات سابقة</p>
                    )}
                  </div>
                  {canManage && (
                    <Link href={`/batches/exams?batchId=${batchId}`} className="mt-6 flex h-10 w-full items-center justify-center rounded-2xl border-2 border-success-700 font-bold hover:bg-success-100">
                      عرض وإدارة الاختبارات
                    </Link>
                  )}
                </section>
              </div>
            </div>
          )}
        </main>
      </div>

      {canManage && (
        <div className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-3 gap-2 border-t border-neutral-300 bg-white p-3 lg:hidden">
          <button onClick={() => setShowAddStudentModal(true)} className="flex h-11 items-center justify-center gap-2 rounded-xl bg-primary-600 text-sm font-bold text-white"><UserAdd01 size={20} /> إضافة طالب</button>
          <button onClick={() => setShowAddSessionModal(true)} className="flex h-11 items-center justify-center gap-2 rounded-xl bg-warning-600 text-sm font-bold text-white"><TaskAdd01 size={20} /> الحضور</button>
          <Link href={`/batches/exams?batchId=${batchId}`} className="flex h-11 items-center justify-center gap-2 rounded-xl bg-success-800 text-sm font-bold text-white"><Tv01 size={20} /> الاختبارات</Link>
        </div>
      )}

      <StudentHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        student={selectedStudent}
        batchId={Number(batchId)}
      />
    </div>
  );
}
