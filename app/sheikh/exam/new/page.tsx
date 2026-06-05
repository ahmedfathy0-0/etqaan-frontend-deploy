"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useBatches } from "@/queries/useBatches";
import { useCreateExam } from "@/queries/useExams";
import toast from "react-hot-toast";

export default function NewExamPage() {
  const { token } = useAuth();
  const router = useRouter();
  const { data: batches = [], isLoading } = useBatches();
  const { mutateAsync: createExamMutate } = useCreateExam();

  const [formData, setFormData] = useState({
    batch_id: "",
    title: "",
    max_score: "100",
    exam_date: new Date().toISOString().split("T")[0],
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await createExamMutate({
        batch_id: parseInt(formData.batch_id),
        title: formData.title,
        max_score: parseInt(formData.max_score),
        exam_date: formData.exam_date,
      } as any);

      toast.success("تم إنشاء الامتحان بنجاح");
      router.push("/sheikh?success=exam_created");
    } catch (error: any) {
      console.error("Error creating exam:", error);
      toast.error(error.response?.data?.message || "حدث خطأ أثناء إنشاء الامتحان");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["sheikh", "admin", "super_admin"]}>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        {/* Header */}
        <header className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            <Link
              href="/sheikh"
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            >
              <span className="text-xl">→</span>
            </Link>
            <div>
              <h1 className="text-2xl font-bold font-arabic flex items-center gap-3">
                <span className="text-3xl">📝</span>
                إنشاء امتحان جديد
              </h1>
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-6 py-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Batch Selection */}
              <div>
                <label className="block font-arabic font-semibold text-gray-700 mb-2">
                  الحلقة <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.batch_id}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      batch_id: e.target.value,
                    }))
                  }
                  required
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 font-arabic focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                >
                  <option value="">-- اختر الحلقة --</option>
                  {batches.map((batch) => (
                    <option key={batch.id} value={batch.id}>
                      {batch.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Exam Title */}
              <div>
                <label className="block font-arabic font-semibold text-gray-700 mb-2">
                  عنوان الامتحان <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="مثال: امتحان سورة البقرة"
                  required
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 font-arabic focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                />
              </div>

              {/* Max Score & Date */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block font-arabic font-semibold text-gray-700 mb-2">
                    الدرجة الكاملة
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.max_score}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        max_score: e.target.value,
                      }))
                    }
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 font-arabic focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                  />
                </div>
                <div>
                  <label className="block font-arabic font-semibold text-gray-700 mb-2">
                    تاريخ الامتحان
                  </label>
                  <input
                    type="date"
                    value={formData.exam_date}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        exam_date: e.target.value,
                      }))
                    }
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 font-arabic focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4 flex gap-4">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-arabic font-bold rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <span>✅</span>
                      إنشاء الامتحان
                    </>
                  )}
                </button>
                <Link
                  href="/sheikh"
                  className="px-6 py-4 bg-gray-100 text-gray-700 font-arabic font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  إلغاء
                </Link>
              </div>
            </form>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
