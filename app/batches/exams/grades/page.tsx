"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useAuth, useRequireAuth } from "@/contexts/AuthContext";
import AdminHeader from "@/components/admin/AdminHeader";
import { AdminSidebar, TabId } from "@/components/admin/AdminSidebar";
import BackButton from "@/components/ui/BackButton";
import { toast } from "react-hot-toast";
import PageLoader from "@/components/ui/PageLoader";
import { useBatchDetails } from "@/queries/useBatches";
import { useExamDetails, useSaveExamGrades } from "@/queries/useExams";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Tv01, FloppyDisk, Calendar01, Menu01, BookOpen01 } from "@dga-icons/react/duotone-rounded";

interface Student {
  id: number;
  full_name: string;
  avatarIndex?: number;
}

interface BatchStudent {
  id: number;
  student: Student;
  league_points: number;
}

interface Exam {
  id: number;
  title: string;
  exam_date: string;
  max_score: number;
  exam_results?: Array<{
    batch_student_id: number;
    score: number;
  }>;
}

interface Batch {
  id: number;
  name: string;
  batch_students: BatchStudent[];
}

export default function ExamGradesPage() {
  const searchParams = useSearchParams();
  const batchId = searchParams.get("batchId") || "";
  const examId = searchParams.get("examId") || "";
  const router = useRouter();
  // Use useAuth to get user AND token
  const { user, token, logout, isLoading: authLoading } = useAuth();

  // Protect route
  // We can't use useRequireAuth easily here because we need "token" for fetch
  // and useRequireAuth returns user/isLoading only.
  // Actually we can check user role here.

  const { data: batchDetails, isLoading: isBatchLoading } = useBatchDetails(batchId);
  const { data: examData, isLoading: isExamLoading } = useExamDetails(examId);
  const { mutateAsync: saveGradesMutate } = useSaveExamGrades();

  const batch: Batch | null = batchDetails?.batch || null;
  const exam: Exam | null = examData || null;

  const [scores, setScores] = useState<Record<number, string>>({}); // batch_student_id -> score
  const [isSaving, setIsSaving] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    router.push(`${sidebarRoutes[tab]}?tab=${tab}`);
  };
  
  const isLoading = isBatchLoading || isExamLoading;



  useEffect(() => {
    if (examData && examData.exam_results && examData.exam_results.length > 0) {
      const initialScores: Record<number, string> = {};
      examData.exam_results.forEach((r: any) => {
        initialScores[r.batch_student_id] = r.score.toString();
      });
      setScores(initialScores);
    }
  }, [examData]);

  const handleScoreChange = (batchStudentId: number, value: string) => {
    // Validate max score
    if (exam && Number(value) > exam.max_score) {
      toast.error(`الدرجة لا يمكن أن تتجاوز ${exam.max_score}`);
      return;
    }
    setScores((prev) => ({
      ...prev,
      [batchStudentId]: value,
    }));
  };

  const handleSave = async () => {
    // Validate all inputs
    const results = Object.entries(scores).map(([bsId, score]) => ({
      batchStudentId: parseInt(bsId),
      score: parseFloat(score),
    }));

    if (results.length === 0) {
      toast.error("يرجى إدخال درجات للطلاب");
      return;
    }

    // Filter out invalid scores
    const validResults = results.filter((r) => !isNaN(r.score));

    if (validResults.length === 0) {
      toast.error("لا توجد درجات صالحة للحفظ");
      return;
    }

    try {
      setIsSaving(true);
      await saveGradesMutate({ examId, grades: validResults, batchId });

      toast.success("تم حفظ الدرجات وتحديث النقاط بنجاح! 🎉");
      router.push(`/batches/detail?id=${batchId}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "فشل حفظ الدرجات");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || authLoading) {
    return <PageLoader />;
  }

  if (!exam || !batch) return null;

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
                  <BackButton href={`/batches/exams?batchId=${batchId}`} label="العودة للامتحانات" />
                </div>
              </div>

              <div className="bg-success-800 rounded-[24px] shadow-sm p-6 border-[1.5px] border-success-200">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <h1 className="text-xl lg:text-[28px] font-bold text-white flex items-center gap-3 mb-2">
                      رصد درجات: {exam.title}
                    </h1>
                    <div className="flex items-center gap-6 text-success-100">
                      <p className="flex items-center gap-2">
                        <Calendar01 aria-hidden="true" size={20} />
                        تاريخ الامتحان: {new Date(exam.exam_date).toLocaleDateString("ar-EG")}
                      </p>
                      <p className="flex items-center gap-2">
                        <BookOpen01 aria-hidden="true" size={20} />
                        الدرجة العظمى: {exam.max_score}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full md:w-auto h-14 flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white rounded-full font-bold hover:bg-white hover:text-success-800 transition-colors disabled:opacity-50 px-8"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        جاري الحفظ...
                      </>
                    ) : (
                      <>
                        <FloppyDisk aria-hidden="true" size={24} />
                        حفظ الدرجات
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-[24px] shadow-sm border-[1.5px] border-success-200 overflow-hidden">
                <table className="w-full text-right text-success-900">
                  <thead className="bg-success-50 text-success-800">
                    <tr>
                      <th className="p-5 font-bold border-b border-success-200">#</th>
                      <th className="p-5 font-bold border-b border-success-200">اسم الطالب</th>
                      <th className="p-5 font-bold border-b border-success-200 w-48 text-center">
                        الدرجة (من {exam.max_score})
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-success-100">
                    {batch.batch_students.map((bs, index) => (
                      <tr
                        key={bs.id}
                        className="hover:bg-success-50/50 transition-colors"
                      >
                        <td className="p-5 text-neutral-500 font-medium">{index + 1}</td>
                        <td className="p-5 font-bold text-success-900">
                          {bs.student.full_name}
                        </td>
                        <td className="p-5">
                          <input
                            type="number"
                            min="0"
                            max={exam.max_score}
                            value={scores[bs.id] || ""}
                            onChange={(e) =>
                              handleScoreChange(bs.id, e.target.value)
                            }
                            placeholder="0"
                            className="w-full h-12 px-4 border-[1.5px] border-success-200 rounded-xl focus:outline-none focus:border-success-700 focus:ring-1 focus:ring-success-700 transition-all font-bold text-center text-neutral-800 bg-white"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {batch.batch_students.length === 0 && (
                  <div className="p-12 text-center text-neutral-500 font-medium">
                    لا يوجد طلاب في هذه الحلقة
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
