"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import AdminHeader from "@/components/admin/AdminHeader";
import { AdminSidebar, TabId } from "@/components/admin/AdminSidebar";
import { SURAHS } from "@/constants/surahs";
import SearchableSelect from "@/components/ui/SearchableSelect";
import BackButton from "@/components/ui/BackButton";
import { useBatches, useBatchDetails } from "@/queries/useBatches";
import { useCreateSession } from "@/queries/useSessions";

interface Batch {
  id: number;
  name: string;
  schedule_description?: string;
  _count?: {
    batch_students: number;
  };
}

interface Student {
  id: number;
  full_name: string;
  batch_student_id: number;
}

interface AttendanceRecord {
  studentId: number;
  status: "present" | "absent" | "late" | "excused";
  // Jadeed
  jadeedStartSurahId: string | number;
  jadeedStartAyah: string;
  jadeedEndSurahId: string | number;
  jadeedEndAyah: string;
  jadeedGrade: number | "";
  // Muraja
  murajaStartSurahId: string | number;
  murajaStartAyah: string;
  murajaEndSurahId: string | number;
  murajaEndAyah: string;
  murajaGrade: number | "";
  behaviorNote: string;
  bonus: number | "";
}

export default function NewSessionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, token } = useAuth();
  const [selectedBatchId, setSelectedBatchId] = useState<number | "">(
    searchParams.get("batchId") ? Number(searchParams.get("batchId")) : ""
  );
  const [records, setRecords] = useState<Record<number, AttendanceRecord>>({});
  const [savingStudent, setSavingStudent] = useState<Record<number, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split("T")[0]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const activeTab: TabId = "sessions";

  const { data: batches = [] } = useBatches();
  const { data: batchDetails, isLoading: loadingStudents } = useBatchDetails(selectedBatchId || "");
  const students = batchDetails?.students || [];
  
  const { mutateAsync: createSessionMutate } = useCreateSession();

  // Initialize records when students load
  useEffect(() => {
    if (students.length > 0 && Object.keys(records).length === 0) {
      const initialRecords: Record<number, AttendanceRecord> = {};
      students.forEach((s: any) => {
        initialRecords[s.id] = {
          studentId: s.id,
          status: "present",
          jadeedStartSurahId: "",
          jadeedStartAyah: "",
          jadeedEndSurahId: "",
          jadeedEndAyah: "",
          jadeedGrade: "",
          murajaStartSurahId: "",
          murajaStartAyah: "",
          murajaEndSurahId: "",
          murajaEndAyah: "",
          murajaGrade: "",
          behaviorNote: "",
          bonus: "",
        };
      });
      setRecords(initialRecords);
    }
  }, [students]);

  const handleRecordChange = (
    studentId: number,
    field: keyof AttendanceRecord,
    value: any,
  ) => {
    setRecords((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (studentId?: number) => {
    if (!selectedBatchId || !token) return;

    if (studentId) {
      setSavingStudent((prev) => ({ ...prev, [studentId]: true }));
    } else {
      setSubmitting(true);
    }
    setError("");

    // Prepare payload
    let recordsToSave: AttendanceRecord[] = [];
    if (studentId) {
      if (records[studentId]) {
        recordsToSave = [records[studentId]];
      } else {
        // Should not happen, but safe check
        return;
      }
    } else {
      recordsToSave = Object.values(records);
    }

    const payload = {
      batchId: selectedBatchId,
      date: sessionDate,
      records: recordsToSave.map((r) => {
        // Format Jadeed Range
        const jadeedStartSurah = SURAHS.find(
          (s) => s.id === Number(r.jadeedStartSurahId),
        );
        const jadeedEndSurah = SURAHS.find(
          (s) => s.id === Number(r.jadeedEndSurahId),
        );

        let jadeedRange = "";
        if (jadeedStartSurah) {
          jadeedRange = `${jadeedStartSurah.name} ${r.jadeedStartAyah || ""}`;
          if (jadeedEndSurah || r.jadeedEndAyah) {
            jadeedRange += " - ";
            if (jadeedEndSurah && jadeedEndSurah.id !== jadeedStartSurah.id) {
              jadeedRange += `${jadeedEndSurah.name} `;
            }
            jadeedRange += `${r.jadeedEndAyah || ""}`;
          }
        }

        // Format Muraja Range
        const murajaStartSurah = SURAHS.find(
          (s) => s.id === Number(r.murajaStartSurahId),
        );
        const murajaEndSurah = SURAHS.find(
          (s) => s.id === Number(r.murajaEndSurahId),
        );

        let murajaRange = "";
        if (murajaStartSurah) {
          murajaRange = `${murajaStartSurah.name} ${r.murajaStartAyah || ""}`;
          if (murajaEndSurah || r.murajaEndAyah) {
            murajaRange += " - ";
            if (murajaEndSurah && murajaEndSurah.id !== murajaStartSurah.id) {
              murajaRange += `${murajaEndSurah.name} `;
            }
            murajaRange += `${r.murajaEndAyah || ""}`;
          }
        }

        return {
          studentId: r.studentId,
          status: r.status,
          jadeedRange,
          jadeedGrade: r.jadeedGrade === "" ? undefined : Number(r.jadeedGrade),
          murajaRange,
          murajaGrade: r.murajaGrade === "" ? undefined : Number(r.murajaGrade),
          behaviorNote: r.behaviorNote,
          bonus: r.bonus === "" ? undefined : Number(r.bonus),
        };
      }),
    };

    try {
      await createSessionMutate(payload);

      if (!studentId) {
        toast.success("تم حفظ الحضور بنجاح");
        router.push(`/batches/detail?id=${selectedBatchId}`);
      } else {
        toast.success("تم حفظ الطالب");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "فشل حفظ الحضور");
    } finally {
      if (studentId) {
        setSavingStudent((prev) => ({ ...prev, [studentId]: false }));
      } else {
        setSubmitting(false);
      }
    }
  };

  const gradeOptions = [
    { value: 100, label: "ممتاز (100)" },
    { value: 90, label: "جيد جداً (90)" },
    { value: 80, label: "جيد (80)" },
    { value: 70, label: "مقبول (70)" },
    { value: 50, label: "ضعيف (50)" },
    { value: 0, label: "إعادة (0)" },
  ];

  return (
    <div className="min-h-screen bg-success-50 font-cairo flex flex-col">
      <AdminHeader 
        onLogout={() => {}} 
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
          <div className="max-w-5xl mx-auto px-4 py-8" dir="rtl">
            <div className="mb-6 flex">
              <BackButton
                href={selectedBatchId ? `/batches/detail?id=${selectedBatchId}` : "/batches"}
                label="العودة للحلقة"
              />
            </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span>📋</span>
            تسجيل الحضور والمتابعة
          </h1>

          {/* Session Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-gray-700 mb-2 font-semibold">
                اختر الحلقة
              </label>
              <select
                value={selectedBatchId || ""}
                onChange={(e) => setSelectedBatchId(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-arabic"
              >
                <option value="">-- اختر الحلقة --</option>
                {batches.map((batch) => (
                  <option key={batch.id} value={batch.id}>
                    {batch.name} ({batch._count?.batch_students || 0} طالب)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-semibold">
                تاريخ الجلسة
              </label>
              <input
                type="date"
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6">
              {error}
            </div>
          )}

          {selectedBatchId && students.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">
                  قائمة الطلاب ({students.length})
                </h2>
              </div>

              {/* Students List */}
              <div className="space-y-4">
                {students.map((student: any) => {
                  const record = records[student.id];
                  if (!record) return null;

                  return (
                    <div
                      key={student.id}
                      className="border border-gray-200 rounded-xl p-4 md:p-6 bg-white hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
                        {/* Student Name & Status */}
                        <div className="md:w-1/4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-bold text-lg text-gray-800">
                              {student.full_name}
                            </h3>
                            <button
                              onClick={() => handleSubmit(student.id)}
                              disabled={savingStudent[student.id]}
                              className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg text-sm font-bold shadow-sm disabled:opacity-50"
                            >
                              {savingStudent[student.id] ? "..." : "حفظ"}
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {[
                              {
                                id: "present",
                                label: "حاضر",
                                color: "emerald",
                              },
                              { id: "absent", label: "غائب", color: "red" },
                              { id: "late", label: "متأخر", color: "yellow" },
                              { id: "excused", label: "معذور", color: "gray" },
                            ].map((status) => (
                              <button
                                key={status.id}
                                onClick={() =>
                                  handleRecordChange(
                                    student.id,
                                    "status",
                                    status.id,
                                  )
                                }
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                  record.status === status.id
                                    ? `bg-${status.color}-100 text-${status.color}-700 border border-${status.color}-200 ring-1 ring-${status.color}-300`
                                    : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                                }`}
                              >
                                {status.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Performance Inputs (Only if present/late) */}
                        {(record.status === "present" ||
                          record.status === "late") && (
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 border-t md:border-t-0 md:border-r border-gray-100 pt-4 md:pt-0 md:pr-4">
                            {/* Jadeed (New Lesson) */}
                            <div className="space-y-3">
                              <label className="text-sm font-semibold text-gray-600 block">
                                الجديد
                              </label>

                              {/* From */}
                              <div className="flex gap-2 items-center">
                                <span className="text-xs text-gray-400 w-6">
                                  من
                                </span>
                                <div className="flex-1">
                                  <SearchableSelect
                                    options={SURAHS.map((s) => ({
                                      id: s.id,
                                      label: s.name,
                                    }))}
                                    value={record.jadeedStartSurahId}
                                    onChange={(val) =>
                                      handleRecordChange(
                                        student.id,
                                        "jadeedStartSurahId",
                                        val,
                                      )
                                    }
                                    placeholder="سورة..."
                                  />
                                </div>
                                <input
                                  type="number"
                                  placeholder="لآية"
                                  value={record.jadeedStartAyah}
                                  onChange={(e) =>
                                    handleRecordChange(
                                      student.id,
                                      "jadeedStartAyah",
                                      e.target.value,
                                    )
                                  }
                                  className="w-20 px-2 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white placeholder-gray-400"
                                />
                              </div>

                              {/* To */}
                              <div className="flex gap-2 items-center">
                                <span className="text-xs text-gray-400 w-6">
                                  إلى
                                </span>
                                <div className="flex-1">
                                  <SearchableSelect
                                    options={SURAHS.map((s) => ({
                                      id: s.id,
                                      label: s.name,
                                    }))}
                                    value={record.jadeedEndSurahId}
                                    onChange={(val) =>
                                      handleRecordChange(
                                        student.id,
                                        "jadeedEndSurahId",
                                        val,
                                      )
                                    }
                                    placeholder="سورة..."
                                  />
                                </div>
                                <input
                                  type="number"
                                  placeholder="لآية"
                                  value={record.jadeedEndAyah}
                                  onChange={(e) =>
                                    handleRecordChange(
                                      student.id,
                                      "jadeedEndAyah",
                                      e.target.value,
                                    )
                                  }
                                  className="w-20 px-2 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white placeholder-gray-400"
                                />
                              </div>

                              <select
                                value={record.jadeedGrade}
                                onChange={(e) =>
                                  handleRecordChange(
                                    student.id,
                                    "jadeedGrade",
                                    e.target.value,
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-emerald-500 text-sm bg-gray-50 text-gray-900"
                              >
                                <option value="">الدرجة...</option>
                                {gradeOptions.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Muraja (Revision) */}
                            <div className="space-y-3">
                              <label className="text-sm font-semibold text-gray-600 block">
                                المراجعة
                              </label>

                              {/* From */}
                              <div className="flex gap-2 items-center">
                                <span className="text-xs text-gray-400 w-6">
                                  من
                                </span>
                                <div className="flex-1">
                                  <SearchableSelect
                                    options={SURAHS.map((s) => ({
                                      id: s.id,
                                      label: s.name,
                                    }))}
                                    value={record.murajaStartSurahId}
                                    onChange={(val) =>
                                      handleRecordChange(
                                        student.id,
                                        "murajaStartSurahId",
                                        val,
                                      )
                                    }
                                    placeholder="سورة..."
                                  />
                                </div>
                                <input
                                  type="number"
                                  placeholder="لآية"
                                  value={record.murajaStartAyah}
                                  onChange={(e) =>
                                    handleRecordChange(
                                      student.id,
                                      "murajaStartAyah",
                                      e.target.value,
                                    )
                                  }
                                  className="w-20 px-2 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white placeholder-gray-400"
                                />
                              </div>

                              {/* To */}
                              <div className="flex gap-2 items-center">
                                <span className="text-xs text-gray-400 w-6">
                                  إلى
                                </span>
                                <div className="flex-1">
                                  <SearchableSelect
                                    options={SURAHS.map((s) => ({
                                      id: s.id,
                                      label: s.name,
                                    }))}
                                    value={record.murajaEndSurahId}
                                    onChange={(val) =>
                                      handleRecordChange(
                                        student.id,
                                        "murajaEndSurahId",
                                        val,
                                      )
                                    }
                                    placeholder="سورة..."
                                  />
                                </div>
                                <input
                                  type="number"
                                  placeholder="لآية"
                                  value={record.murajaEndAyah}
                                  onChange={(e) =>
                                    handleRecordChange(
                                      student.id,
                                      "murajaEndAyah",
                                      e.target.value,
                                    )
                                  }
                                  className="w-20 px-2 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white placeholder-gray-400"
                                />
                              </div>

                              <select
                                value={record.murajaGrade}
                                onChange={(e) =>
                                  handleRecordChange(
                                    student.id,
                                    "murajaGrade",
                                    e.target.value,
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-emerald-500 text-sm bg-gray-50 text-gray-900"
                              >
                                <option value="">الدرجة...</option>
                                {gradeOptions.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Behavior Note & Bonus */}
                            <div className="md:col-span-2 mt-2 grid grid-cols-1 md:grid-cols-4 gap-2">
                              <div className="md:col-span-3">
                                <input
                                  type="text"
                                  placeholder="ملاحظات (سلوك / حفظ)..."
                                  value={record.behaviorNote}
                                  onChange={(e) =>
                                    handleRecordChange(
                                      student.id,
                                      "behaviorNote",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-emerald-500 text-sm text-gray-900 bg-white placeholder-gray-400"
                                />
                              </div>
                              <div className="md:col-span-1">
                                <input
                                  type="number"
                                  placeholder="نقاط إضافية"
                                  value={record.bonus}
                                  onChange={(e) =>
                                    handleRecordChange(
                                      student.id,
                                      "bonus",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-emerald-200 rounded-lg text-sm bg-emerald-50 text-emerald-800 placeholder-emerald-400 focus:ring-emerald-500 border-2"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Submit Button */}
              <div className="sticky bottom-4 bg-white p-4 rounded-xl shadow-lg border border-gray-100 flex items-center justify-between">
                <div className="text-gray-600 text-sm">
                  يتم الحفظ لـ{" "}
                  {
                    Object.values(records).filter(
                      (r) => r.status === "present" || r.status === "late",
                    ).length
                  }{" "}
                  طالب حاضر
                </div>
                <button
                  onClick={() => handleSubmit()}
                  disabled={submitting}
                  className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50"
                >
                  {submitting ? "جاري الحفظ..." : "حفظ الكل"}
                </button>
              </div>
            </div>
          )}

          {selectedBatchId && !loadingStudents && students.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              لا يوجد طلاب في هذه الحلقة
            </div>
          )}
        </div>
          </div>
        </main>
      </div>
    </div>
  );
}
