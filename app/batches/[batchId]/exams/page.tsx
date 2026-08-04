"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import AdminHeader from "@/components/admin/AdminHeader";
import { AdminSidebar, TabId } from "@/components/admin/AdminSidebar";
import BackButton from "@/components/ui/BackButton";
import Modal from "@/components/ui/Modal";
import Link from "next/link";
import { toast } from "react-hot-toast";
import PageLoader from "@/components/ui/PageLoader";
import { useBatchDetails } from "@/queries/useBatches";
import { useCreateExam } from "@/queries/useExams";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Tv01, Add01, Calendar01, Menu01, BookOpen01, Award01 } from "@dga-icons/react/duotone-rounded";

interface Exam {
  id: number;
  title: string;
  exam_date: string;
  max_score: number;
}

interface Batch {
  id: number;
  name: string;
  exams: Exam[];
}

export default function ExamDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const batchId = params.batchId as string;
  const { user, token, logout, isLoading: authLoading } = useAuth();

  const { data: batchDetails, isLoading: isBatchLoading } = useBatchDetails(batchId);
  const batch: Batch | null = batchDetails?.batch || null;
  const exams = batch?.exams || [];
  const isLoading = isBatchLoading;

  // Create Exam State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [examForm, setExamForm] = useState({
    title: "",
    examDate: "",
    maxScore: 100,
  });

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

  const handleSidebar = (tab: TabId) => {
    setMobileMenuOpen(false);
    router.push(sidebarRoutes[tab]);
  };
  
  const { mutateAsync: createExamMutate } = useCreateExam();

  // Handle Create Exam
  const handleCreateExam = async () => {
    if (!examForm.title || !examForm.examDate) return;

    try {
      await createExamMutate({
        batch_id: parseInt(batchId),
        title: examForm.title,
        exam_date: examForm.examDate,
        max_score: examForm.maxScore,
      } as any);

      toast.success("تم إنشاء الامتحان بنجاح");
      setShowCreateModal(false);
      setExamForm({ title: "", examDate: "", maxScore: 100 });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "فشل إنشاء الامتحان");
    }
  };

  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 font-arabic flex items-center justify-center">
        <PageLoader />
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["admin", "super_admin", "sheikh"]}>
      <div className="min-h-screen bg-white font-cairo text-success-900" dir="rtl">
        <AdminHeader
          onLogout={logout}
          activeTab="exams"
          onToggleMenu={() => setMobileMenuOpen(true)}
        />

        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setMobileMenuOpen(false)}>
            <div className="h-full w-[280px] bg-white" onClick={(e) => e.stopPropagation()}>
              <AdminSidebar activeTab="exams" setActiveTab={handleSidebar} mobile />
            </div>
          </div>
        )}

        <div className="flex min-h-[calc(100vh-114px)] gap-4 px-[10px] py-2">
          <aside className="hidden w-[250px] shrink-0 lg:block">
            <div className="sticky top-[122px] h-[calc(100vh-130px)] min-h-[702px] overflow-y-auto">
              <AdminSidebar activeTab="exams" setActiveTab={handleSidebar} />
            </div>
          </aside>

          <main className="min-w-0 flex-1 overflow-x-hidden px-4 py-6 lg:px-4">
            <div className="mx-auto flex w-full max-w-[962px] flex-col gap-9">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="w-full sm:w-auto flex justify-start">
                  <BackButton href={`/batches/${batchId}`} label="العودة للحلقة" />
                </div>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="w-full sm:w-auto flex h-14 min-w-[190px] items-center justify-center gap-4 rounded-2xl bg-primary-600 px-5 font-bold text-white hover:bg-primary-700 transition-colors"
                >
                  <Add01 aria-hidden="true" size={24} /> إنشاء امتحان جديد
                </button>
              </div>

              <div className="bg-success-800 rounded-[24px] shadow-sm p-6 border-[1.5px] border-success-200">
                <h1 className="text-[28px] font-bold text-white mb-2 flex items-center gap-3">
                  <Tv01 aria-hidden="true" size={36} className="text-warning-500" />
                  امتحانات {batch?.name}
                </h1>
                <p className="text-success-100 text-lg">
                  أدر الامتحانات وارصد الدرجات للطلاب من هنا
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exams.map((exam) => (
                  <div
                    key={exam.id}
                    className="bg-white rounded-[24px] p-6 shadow-[0_2px_10px_5px_rgba(0,10,1,0.15)] hover:shadow-[0_4px_20px_10px_rgba(0,10,1,0.2)] transition-all flex flex-col justify-between group border-[1.5px] border-success-200 hover:border-success-700"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="text-warning-600 group-hover:scale-110 transition-transform duration-300">
                          <BookOpen01 aria-hidden="true" size={48} />
                        </div>
                        <span className="bg-warning-100 text-warning-800 px-3 py-1 rounded-full text-sm font-bold border border-warning-200">
                          {exam.max_score} درجة
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-success-900 mb-2 transition-colors">
                        {exam.title}
                      </h3>
                      <p className="text-neutral-600 text-sm mb-6 flex items-center gap-2">
                        <Calendar01 aria-hidden="true" size={20} className="text-success-800" />
                        {new Date(exam.exam_date).toLocaleDateString("ar-EG")}
                      </p>
                    </div>

                    <Link
                      href={`/batches/${batchId}/exams/${exam.id}/grades`}
                      className="w-full h-12 flex items-center justify-center gap-2 bg-success-50 text-success-800 rounded-xl font-bold hover:bg-success-800 hover:text-white transition-all border-[1.5px] border-transparent"
                    >
                      <Award01 aria-hidden="true" size={24} /> رصد الدرجات
                    </Link>
                  </div>
                ))}

                {exams.length === 0 && (
                  <div className="col-span-full py-20 bg-success-50 rounded-[24px] border-[1.5px] border-dashed border-success-200 flex flex-col items-center justify-center text-center">
                    <div className="text-success-300 mb-6">
                      <Tv01 aria-hidden="true" size={64} />
                    </div>
                    <h3 className="text-2xl font-bold text-success-900 mb-2">
                      لا يوجد امتحانات بعد
                    </h3>
                    <p className="text-neutral-600">
                      ابدأ بإنشاء أول امتحان لهذه الحلقة
                    </p>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>

      {/* Create Exam Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="إنشاء امتحان جديد"
        headerColorClass="bg-success-800"
      >
        <div className="space-y-4">
          <div>
            <label className="block font-cairo font-bold text-success-900 mb-1">
              عنوان الامتحان
            </label>
            <input
              type="text"
              value={examForm.title}
              onChange={(e) =>
                setExamForm({ ...examForm, title: e.target.value })
              }
              className="w-full h-12 px-4 bg-white border-[1.5px] border-success-200 rounded-xl focus:outline-none focus:border-success-700 focus:ring-1 focus:ring-success-700 font-cairo text-neutral-800"
              placeholder="مثال: امتحان سورة البقرة"
              required
            />
          </div>
          <div>
            <label className="block font-cairo font-bold text-success-900 mb-1">
              تاريخ الامتحان
            </label>
            <input
              type="date"
              value={examForm.examDate}
              onChange={(e) =>
                setExamForm({ ...examForm, examDate: e.target.value })
              }
              className="w-full h-12 px-4 bg-white border-[1.5px] border-success-200 rounded-xl focus:outline-none focus:border-success-700 focus:ring-1 focus:ring-success-700 text-neutral-800"
              required
            />
          </div>
          <div>
            <label className="block font-cairo font-bold text-success-900 mb-1">
              الدرجة العظمى
            </label>
            <input
              type="number"
              value={examForm.maxScore}
              onChange={(e) =>
                setExamForm({
                  ...examForm,
                  maxScore: Number(e.target.value),
                })
              }
              className="w-full h-12 px-4 bg-white border-[1.5px] border-success-200 rounded-xl focus:outline-none focus:border-success-700 focus:ring-1 focus:ring-success-700 text-neutral-800"
              min={1}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleCreateExam}
              disabled={!examForm.title || !examForm.examDate}
              className="flex-1 h-14 bg-primary-600 text-white rounded-2xl font-cairo font-bold hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              إنشاء الامتحان
            </button>
            <button
              onClick={() => setShowCreateModal(false)}
              className="px-6 h-14 bg-neutral-200 text-neutral-800 rounded-2xl font-cairo font-bold hover:bg-neutral-300 transition-colors"
            >
              إلغاء
            </button>
          </div>
        </div>
      </Modal>
      </div>
    </ProtectedRoute>
  );
}
