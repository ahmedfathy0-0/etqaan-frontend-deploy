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
import { api } from "@/lib/api";
import { TaskAdd01, Calendar01, Book01, BookOpen01, Award01, FloppyDisk, Note01 } from "@dga-icons/react/duotone-rounded";

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

  const parseRange = (rangeString: string | null) => {
    if (!rangeString) return { startSurahId: "", startAyah: "", endSurahId: "", endAyah: "" };
    const parts = rangeString.split("-").map(p => p.trim());
    let startStr = parts[0] || "";
    let endStr = parts.length > 1 ? parts[1] : "";

    let startSurah = null;
    let startAyah = "";
    for (const s of SURAHS) {
      if (startStr.startsWith(s.name)) {
        startSurah = s;
        startAyah = startStr.substring(s.name.length).trim();
        break;
      }
    }

    let endSurah = startSurah;
    let endAyah = "";
    if (endStr) {
      let foundEndSurah = null;
      for (const s of SURAHS) {
        if (endStr.startsWith(s.name)) {
          foundEndSurah = s;
          endAyah = endStr.substring(s.name.length).trim();
          break;
        }
      }
      if (foundEndSurah) {
        endSurah = foundEndSurah;
      } else {
        endAyah = endStr;
      }
    }

    return {
      startSurahId: startSurah ? startSurah.id : "",
      startAyah: startAyah,
      endSurahId: endSurah ? endSurah.id : "",
      endAyah: endAyah
    };
  };

  const mapGradeToNumber = (grade: string | null) => {
    switch (grade) {
      case "excellent": return 100;
      case "very_good": return 90;
      case "good": return 80;
      case "acceptable": return 70;
      case "weak": return 50;
      case "redo": return 0;
      default: return "";
    }
  };

  // Fetch existing records when batch or date changes
  useEffect(() => {
    if (!selectedBatchId || !sessionDate || !token) return;

    const fetchExistingRecords = async () => {
      try {
        const res = await api.get(`/sessions/records`, {
          params: { batchId: selectedBatchId, date: sessionDate }
        });
        
        if (res.data && Array.isArray(res.data)) {
          setRecords((prev) => {
            // First, reset all students to default empty state
            const reset: Record<number, AttendanceRecord> = {};
            students.forEach((s: any) => {
              reset[s.id] = {
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

            // Then merge fetched records
            res.data.forEach((r: any) => {
              if (!r.studentId) return;
              
              const jadeedParsed = parseRange(r.jadeed_range);
              const murajaParsed = parseRange(r.muraja_range);
              
              reset[r.studentId] = {
                studentId: r.studentId,
                status: r.attendance_status || "",
                jadeedStartAyah: jadeedParsed.startAyah,
                jadeedStartSurahId: jadeedParsed.startSurahId,
                jadeedEndSurahId: jadeedParsed.endSurahId,
                jadeedEndAyah: jadeedParsed.endAyah,
                jadeedGrade: mapGradeToNumber(r.jadeed_grade),
                murajaStartAyah: murajaParsed.startAyah,
                murajaStartSurahId: murajaParsed.startSurahId,
                murajaEndSurahId: murajaParsed.endSurahId,
                murajaEndAyah: murajaParsed.endAyah,
                murajaGrade: mapGradeToNumber(r.muraja_grade),
                behaviorNote: r.behavior_note || "",
                bonus: r.bonus_points ? r.bonus_points : "",
              };
            });
            return reset;
          });
        }
      } catch (err) {
        console.error("Failed to load existing session data", err);
      }
    };

    fetchExistingRecords();
  }, [selectedBatchId, sessionDate, token]);

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
      const errMsg = err.response?.data?.message || "فشل حفظ الحضور";
      setError(errMsg);
      toast.error(errMsg);
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
                if (tab !== activeTab) router.push(`/sheikh?tab=${tab}`);
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
                if (tab !== activeTab) router.push(`/sheikh?tab=${tab}`);
              }} 
            />
          </div>
        </div>

        {/* Main Content Area */}
        <main className="w-full min-w-0 flex-1 pb-[96px] lg:w-auto lg:pb-0">
          <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8" dir="rtl">
            <div className="mb-6 flex">
              <BackButton
                href={selectedBatchId ? `/batches/detail?id=${selectedBatchId}` : "/batches"}
                label="العودة للحلقة"
              />
            </div>
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <TaskAdd01 className="text-primary-600" size={32} />
            تسجيل الحضور والمتابعة
          </h1>

          {/* Session Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 font-semibold">
                <Note01 size={20} className="text-gray-400" />
                الحلقة
              </label>
              <div className="w-full px-4 py-3 bg-neutral-100 border border-gray-200 rounded-xl text-neutral-900 font-bold transition-all font-arabic flex items-center">
                {batches.find(b => b.id === selectedBatchId)?.name || "جاري التحميل..."}
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 font-semibold">
                <Calendar01 size={20} className="text-primary-600" />
                تاريخ الجلسة
              </label>
              <input
                type="date"
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-neutral-900 font-bold focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-arabic"
              />
            </div>
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
                      className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-4 md:p-6 hover:shadow-md hover:border-primary-300 transition-all"
                    >
                      <div className="flex flex-col md:flex-row md:items-start gap-6">
                        {/* Student Name & Status */}
                        <div className="md:w-1/3 space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold text-xl text-neutral-900 flex items-center gap-3">
                              <span className="w-8 h-8 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-sm shrink-0">
                                {student.id}
                              </span>
                              {student.name || student.full_name}
                            </h3>
                            <button
                              onClick={() => handleSubmit(student.id)}
                              disabled={savingStudent[student.id]}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 px-6 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:hover:transform-none flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                            >
                              <FloppyDisk size={18} />
                              {savingStudent[student.id] ? "جاري الحفظ..." : "حفظ"}
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { id: "present", label: "حاضر", activeClass: "bg-emerald-500 text-white border-emerald-600 shadow-md" },
                              { id: "late", label: "متأخر", activeClass: "bg-amber-500 text-white border-amber-600 shadow-md" },
                              { id: "absent", label: "غائب", activeClass: "bg-red-500 text-white border-red-600 shadow-md" },
                              { id: "excused", label: "معذور", activeClass: "bg-neutral-500 text-white border-neutral-600 shadow-md" },
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
                                className={`px-3 py-2 rounded-xl text-sm font-bold transition-all border ${
                                  record.status === status.id
                                    ? status.activeClass
                                    : "bg-neutral-50 text-neutral-600 hover:bg-neutral-100 border-neutral-200"
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
                            <div className="space-y-4 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100/50">
                              <label className="flex items-center gap-2 text-sm font-bold text-emerald-800">
                                <Book01 size={18} />
                                الجديد
                              </label>

                              {/* From */}
                              <div className="flex gap-2 items-center">
                                <span className="text-xs font-bold text-emerald-600/70 w-6">من</span>
                                <div className="flex-1">
                                  <SearchableSelect
                                    options={SURAHS.map((s) => ({
                                      id: s.id,
                                      label: s.name,
                                    }))}
                                    value={record.jadeedStartSurahId}
                                    onChange={(val) =>
                                      handleRecordChange(student.id, "jadeedStartSurahId", val)
                                    }
                                    placeholder="سورة..."
                                  />
                                </div>
                                <input
                                  type="number"
                                  placeholder="لآية"
                                  value={record.jadeedStartAyah}
                                  onChange={(e) =>
                                    handleRecordChange(student.id, "jadeedStartAyah", e.target.value)
                                  }
                                  className="w-16 sm:w-20 px-2 py-2.5 border border-emerald-200 rounded-lg text-sm font-bold text-neutral-900 bg-white placeholder-emerald-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                                />
                              </div>

                              {/* To */}
                              <div className="flex gap-2 items-center">
                                <span className="text-xs font-bold text-emerald-600/70 w-6">إلى</span>
                                <div className="flex-1">
                                  <SearchableSelect
                                    options={SURAHS.map((s) => ({
                                      id: s.id,
                                      label: s.name,
                                    }))}
                                    value={record.jadeedEndSurahId}
                                    onChange={(val) =>
                                      handleRecordChange(student.id, "jadeedEndSurahId", val)
                                    }
                                    placeholder="سورة..."
                                  />
                                </div>
                                <input
                                  type="number"
                                  placeholder="لآية"
                                  value={record.jadeedEndAyah}
                                  onChange={(e) =>
                                    handleRecordChange(student.id, "jadeedEndAyah", e.target.value)
                                  }
                                  className="w-16 sm:w-20 px-2 py-2.5 border border-emerald-200 rounded-lg text-sm font-bold text-neutral-900 bg-white placeholder-emerald-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                                />
                              </div>

                              <select
                                value={record.jadeedGrade}
                                onChange={(e) =>
                                  handleRecordChange(student.id, "jadeedGrade", e.target.value)
                                }
                                className="w-full px-3 py-2.5 border border-emerald-200 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-bold bg-white text-neutral-900 transition-all"
                              >
                                <option value="">تقييم الجديد...</option>
                                {gradeOptions.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Muraja (Revision) */}
                            {/* Muraja (Revision) */}
                            <div className="space-y-4 bg-sky-50/50 p-4 rounded-xl border border-sky-100/50">
                              <label className="flex items-center gap-2 text-sm font-bold text-sky-800">
                                <BookOpen01 size={18} />
                                المراجعة
                              </label>

                              {/* From */}
                              <div className="flex gap-2 items-center">
                                <span className="text-xs font-bold text-sky-600/70 w-6">من</span>
                                <div className="flex-1">
                                  <SearchableSelect
                                    options={SURAHS.map((s) => ({
                                      id: s.id,
                                      label: s.name,
                                    }))}
                                    value={record.murajaStartSurahId}
                                    onChange={(val) =>
                                      handleRecordChange(student.id, "murajaStartSurahId", val)
                                    }
                                    placeholder="سورة..."
                                  />
                                </div>
                                <input
                                  type="number"
                                  placeholder="لآية"
                                  value={record.murajaStartAyah}
                                  onChange={(e) =>
                                    handleRecordChange(student.id, "murajaStartAyah", e.target.value)
                                  }
                                  className="w-16 sm:w-20 px-2 py-2.5 border border-sky-200 rounded-lg text-sm font-bold text-neutral-900 bg-white placeholder-sky-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                                />
                              </div>

                              {/* To */}
                              <div className="flex gap-2 items-center">
                                <span className="text-xs font-bold text-sky-600/70 w-6">إلى</span>
                                <div className="flex-1">
                                  <SearchableSelect
                                    options={SURAHS.map((s) => ({
                                      id: s.id,
                                      label: s.name,
                                    }))}
                                    value={record.murajaEndSurahId}
                                    onChange={(val) =>
                                      handleRecordChange(student.id, "murajaEndSurahId", val)
                                    }
                                    placeholder="سورة..."
                                  />
                                </div>
                                <input
                                  type="number"
                                  placeholder="لآية"
                                  value={record.murajaEndAyah}
                                  onChange={(e) =>
                                    handleRecordChange(student.id, "murajaEndAyah", e.target.value)
                                  }
                                  className="w-16 sm:w-20 px-2 py-2.5 border border-sky-200 rounded-lg text-sm font-bold text-neutral-900 bg-white placeholder-sky-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                                />
                              </div>

                              <select
                                value={record.murajaGrade}
                                onChange={(e) =>
                                  handleRecordChange(student.id, "murajaGrade", e.target.value)
                                }
                                className="w-full px-3 py-2.5 border border-sky-200 rounded-lg focus:ring-1 focus:ring-sky-500 focus:border-sky-500 text-sm font-bold bg-white text-neutral-900 transition-all"
                              >
                                <option value="">تقييم المراجعة...</option>
                                {gradeOptions.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Behavior Note & Bonus */}
                            <div className="md:col-span-2 mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                              <div className="md:col-span-3">
                                <input
                                  type="text"
                                  placeholder="ملاحظات (سلوك / حفظ)..."
                                  value={record.behaviorNote}
                                  onChange={(e) =>
                                    handleRecordChange(student.id, "behaviorNote", e.target.value)
                                  }
                                  className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm font-bold text-neutral-900 bg-white placeholder-neutral-400 transition-all"
                                />
                              </div>
                              <div className="md:col-span-1">
                                <div className="relative">
                                  <input
                                    type="number"
                                    placeholder="نقاط+"
                                    value={record.bonus}
                                    onChange={(e) =>
                                      handleRecordChange(student.id, "bonus", e.target.value)
                                    }
                                    className="w-full pl-3 pr-8 py-2.5 border border-amber-300 rounded-lg text-sm font-bold bg-amber-50 text-amber-900 placeholder-amber-400 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all"
                                  />
                                  <Award01 className="absolute right-2.5 top-1/2 -translate-y-1/2 text-amber-500" size={16} />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {selectedBatchId && !loadingStudents && students.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              لا يوجد طلاب في هذه الحلقة
            </div>
          )}

          </div>
        </main>
      </div>
    </div>
  );
}
