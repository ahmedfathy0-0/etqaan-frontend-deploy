"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBatches } from "@/queries/useBatches";
import { useCreateExam } from "@/queries/useExams";
import toast from "react-hot-toast";
import AdminHeader from "@/components/admin/AdminHeader";
import { AdminSidebar, TabId } from "@/components/admin/AdminSidebar";
import { PencilEdit01, FloppyDisk } from "@dga-icons/react/duotone-rounded";

export default function NewExamPage() {
  const { token, logout } = useAuth();
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const activeTab: TabId = "exams";

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
                  setMobileMenuOpen(false);
                  if (tab !== activeTab) router.push("/sheikh");
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
                setActiveTab={(tab) => {
                  if (tab !== activeTab) router.push("/sheikh");
                }} 
              />
            </div>
          </div>

          {/* Main Content Area */}
          <main className="w-full min-w-0 flex-1 pb-[96px] lg:w-auto lg:pb-0">
            <div className="min-h-[500px] w-full animate-fade-in overflow-x-hidden p-4 lg:px-6 lg:py-8" dir="rtl">
              <div className="flex items-center gap-4 mb-8">
                <Link
                  href="/sheikh"
                  className="w-10 h-10 bg-white border border-[#A3C3D7] hover:bg-[#F5F7F5] rounded-full flex items-center justify-center transition-colors shadow-sm"
                >
                  <span className="text-[#17481B] font-bold text-xl">→</span>
                </Link>
                <div className="flex items-center gap-2">
                  <PencilEdit01 aria-hidden="true" size={32} color="#17481B" />
                  <h1 className="text-2xl font-bold font-cairo text-[#17481B]">
                    إنشاء امتحان جديد
                  </h1>
                </div>
              </div>

              <div className="bg-white border border-[#A3C3D7] rounded-2xl p-6 lg:p-8 shadow-sm max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-6 flex flex-col gap-4">
                  {/* Batch Selection */}
                  <div className="flex flex-col items-start gap-[12px] w-full">
                    <label className="text-right text-[#17481B] font-medium text-[16px] leading-[150%] w-full">
                      الحلقة <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.batch_id}
                      onChange={(e) => setFormData((prev) => ({ ...prev, batch_id: e.target.value }))}
                      required
                      className="box-border flex flex-row items-center p-[8px] gap-[8px] w-full h-[48px] border border-[#A3C3D7] rounded-[8px] focus:outline-none focus:border-[#17481B] text-[#79817A] bg-white text-[14px] text-right leading-[150%] font-medium"
                    >
                      <option value="">-- اختر الحلقة --</option>
                      {batches.map((batch: any) => (
                        <option key={batch.id} value={batch.id}>
                          {batch.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Exam Title */}
                  <div className="flex flex-col items-start gap-[12px] w-full">
                    <label className="text-right text-[#17481B] font-medium text-[16px] leading-[150%] w-full">
                      عنوان الامتحان <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="مثال: امتحان سورة البقرة"
                      required
                      className="box-border flex flex-row items-center p-[8px] gap-[8px] w-full h-[48px] border border-[#A3C3D7] rounded-[8px] focus:outline-none focus:border-[#17481B] text-[#79817A] bg-white placeholder:text-[#79817A] text-[14px] text-right leading-[150%] font-medium"
                    />
                  </div>

                  {/* Max Score & Date */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    <div className="flex flex-col items-start gap-[12px] w-full">
                      <label className="text-right text-[#17481B] font-medium text-[16px] leading-[150%] w-full">
                        الدرجة الكاملة
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={formData.max_score}
                        onChange={(e) => setFormData((prev) => ({ ...prev, max_score: e.target.value }))}
                        className="box-border flex flex-row items-center p-[8px] gap-[8px] w-full h-[48px] border border-[#A3C3D7] rounded-[8px] focus:outline-none focus:border-[#17481B] text-[#79817A] bg-white placeholder:text-[#79817A] text-[14px] text-right leading-[150%] font-medium"
                      />
                    </div>
                    <div className="flex flex-col items-start gap-[12px] w-full">
                      <label className="text-right text-[#17481B] font-medium text-[16px] leading-[150%] w-full">
                        تاريخ الامتحان
                      </label>
                      <input
                        type="date"
                        value={formData.exam_date}
                        onChange={(e) => setFormData((prev) => ({ ...prev, exam_date: e.target.value }))}
                        className="box-border flex flex-row items-center p-[8px] gap-[8px] w-full h-[48px] border border-[#A3C3D7] rounded-[8px] focus:outline-none focus:border-[#17481B] text-[#79817A] bg-white text-[14px] text-right leading-[150%] font-medium"
                      />
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="pt-6 flex gap-4 w-full">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex-1 flex flex-row justify-center items-center py-[8px] px-[16px] gap-[16px] h-[56px] bg-[#17481B] rounded-[16px] transition-colors disabled:opacity-50"
                    >
                      {isSaving ? (
                        <span className="font-bold text-[18px] text-[#FBFFFC] leading-[150%] font-cairo">
                          جاري الحفظ...
                        </span>
                      ) : (
                        <>
                          <FloppyDisk aria-hidden="true" size={24} color="#E2F7E4" />
                          <span className="font-bold text-[18px] text-[#FBFFFC] leading-[150%] font-cairo">
                            إنشاء الامتحان
                          </span>
                        </>
                      )}
                    </button>
                    <Link
                      href="/sheikh"
                      className="flex justify-center items-center px-6 h-[56px] bg-[#E3E6E3] text-[#404641] font-cairo font-bold text-[18px] rounded-[16px] hover:bg-[#c9ccc9] transition-colors"
                    >
                      إلغاء
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
