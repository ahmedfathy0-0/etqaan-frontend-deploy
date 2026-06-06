"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import BackButton from "@/components/ui/BackButton";
import Modal from "@/components/ui/Modal";
import Link from "next/link";
import { toast } from "react-hot-toast";
import PageLoader from "@/components/ui/PageLoader";
import { useBatchDetails } from "@/queries/useBatches";
import { useCreateExam } from "@/queries/useExams";
import ProtectedRoute from "@/components/ProtectedRoute";

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
  const { user, token, isLoading: authLoading } = useAuth();

  const { data: batchDetails, isLoading: isBatchLoading } = useBatchDetails(batchId);
  const batch: Batch | null = batchDetails?.batch || null;
  const exams = batch?.exams || [];
  const isLoading = isBatchLoading;

  // Create Exam State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [examForm, setExamForm] = useState({
    title: "",
    examDate: "",
    maxScore: 100,
  });
  
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
      <div className="min-h-screen bg-gray-50 font-arabic">
      <Header />
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div className="w-full sm:w-auto flex justify-start">
            <BackButton href={`/batches/${batchId}`} label="العودة للحلقة" />
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
          >
            <span className="text-xl">📝</span>
            إنشاء امتحان جديد
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            <span>📚</span>
            امتحانات {batch?.name}
          </h1>
          <p className="text-gray-500">
            أدر الامتحانات وارصد الدرجات للطلاب من هنا
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
                    📝
                  </span>
                  <span className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-sm font-bold border border-orange-100">
                    {exam.max_score} درجة
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors">
                  {exam.title}
                </h3>
                <p className="text-gray-500 text-sm mb-6 flex items-center gap-2">
                  <span>📅</span>
                  {new Date(exam.exam_date).toLocaleDateString("ar-EG")}
                </p>
              </div>

              <Link
                href={`/batches/${batchId}/exams/${exam.id}/grades`}
                className="w-full py-3 bg-gray-50 text-gray-700 rounded-xl font-bold hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200 border border-transparent transition-all flex items-center justify-center gap-2"
              >
                <span>📊</span>
                رصد الدرجات
              </Link>
            </div>
          ))}

          {exams.length === 0 && (
            <div className="col-span-full py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
              <span className="text-6xl mb-4 opacity-50">📭</span>
              <h3 className="text-xl font-bold text-gray-400 mb-2">
                لا يوجد امتحانات بعد
              </h3>
              <p className="text-gray-400">
                ابدأ بإنشاء أول امتحان لهذه الحلقة
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Create Exam Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="📝 إنشاء امتحان جديد"
        headerColorClass="bg-gradient-to-r from-orange-500 to-red-500"
      >
        <div className="space-y-4">
          <div>
            <label className="block font-arabic text-gray-700 mb-1">
              عنوان الامتحان
            </label>
            <input
              type="text"
              value={examForm.title}
              onChange={(e) =>
                setExamForm({ ...examForm, title: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-arabic text-gray-900"
              placeholder="مثال: امتحان سورة البقرة"
              required
            />
          </div>
          <div>
            <label className="block font-arabic text-gray-700 mb-1">
              تاريخ الامتحان
            </label>
            <input
              type="date"
              value={examForm.examDate}
              onChange={(e) =>
                setExamForm({ ...examForm, examDate: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
              required
            />
          </div>
          <div>
            <label className="block font-arabic text-gray-700 mb-1">
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
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
              min={1}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleCreateExam}
              disabled={!examForm.title || !examForm.examDate}
              className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-arabic font-semibold hover:from-orange-600 hover:to-red-600 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              إنشاء الامتحان
            </button>
            <button
              onClick={() => setShowCreateModal(false)}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-arabic hover:bg-gray-200 transition-colors"
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
