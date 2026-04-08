"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import StudentCard from "@/components/public/StudentCard";
import StudentSearchBar from "@/components/public/StudentSearchBar";
import StudentHistoryModal from "@/components/public/StudentHistoryModal";
import LeaderboardPreview from "@/components/public/LeaderboardPreview";
import RandomStars from "@/components/RandomStars";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import Modal from "@/components/ui/Modal";
import BackButton from "@/components/ui/BackButton";
import { toast } from "react-hot-toast";
import PageLoader from "@/components/ui/PageLoader";

interface Student {
  id: number;
  batch_student_id: number;
  name: string;
  points: number;
  avatarIndex?: number;
}

interface AvailableStudent {
  id: number;
  full_name: string;
  guardian_name?: string;
}

interface Batch {
  id: number;
  name: string;
  schedule_description?: string;
  term?: {
    name: string;
  };
  batch_sheikhs?: Array<{
    sheikh: {
      name: string;
    };
    is_head_sheikh: boolean;
  }>;
  exams?: Array<{
    id: number;
    title: string;
    exam_date: string;
    max_score: number;
  }>;
}

export default function BatchDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const batchId = params.batchId as string;
  const { user, token } = useAuth();

  const [batch, setBatch] = useState<Batch | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Modal states
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showAddSessionModal, setShowAddSessionModal] = useState(false);

  // Form states
  const [availableStudents, setAvailableStudents] = useState<
    AvailableStudent[]
  >([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const [showCreateStudentForm, setShowCreateStudentForm] = useState(false);
  const [newStudentData, setNewStudentData] = useState<{
    full_name: string;
    guardian_name: string;
    guardian_phone: string;
    gender: "male" | "female";
  }>({
    full_name: "",
    guardian_name: "",
    guardian_phone: "",
    gender: "male",
  });
  const [createStudentLoading, setCreateStudentLoading] = useState(false);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api-v1";

  const canManage =
    user?.role === "admin" ||
    user?.role === "super_admin" ||
    user?.role === "sheikh";

  const fetchBatchDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/batches/${batchId}`);
      if (!response.ok) throw new Error("فشل في تحميل بيانات الحلقة");
      const data = await response.json();
      setBatch(data);

      // Extract students from batch_students
      const studentsList =
        data.batch_students?.map((bs: any, index: number) => ({
          id: bs.student.id,
          batch_student_id: bs.id,
          name: bs.student.full_name,
          points: bs.league_points || 0,
          avatarIndex: index % 12,
        })) || [];

      // Sort by points for ranking
      studentsList.sort((a: Student, b: Student) => b.points - a.points);
      setStudents(studentsList);
    } catch (err) {
      // Mock data for development
      setBatch({
        id: parseInt(batchId),
        name: "حلقة الأسود 🦁",
        schedule_description: "السبت والاثنين والأربعاء - 5:00 م",
        term: { name: "الفصل الأول 2026" },
        batch_sheikhs: [
          { sheikh: { name: "أحمد محمد" }, is_head_sheikh: true },
        ],
      });
      setStudents([
        {
          id: 1,
          batch_student_id: 1,
          name: "عبدالرحمن أحمد",
          points: 150,
          avatarIndex: 0,
        },
        {
          id: 2,
          batch_student_id: 2,
          name: "محمد علي",
          points: 135,
          avatarIndex: 1,
        },
        {
          id: 3,
          batch_student_id: 3,
          name: "يوسف خالد",
          points: 120,
          avatarIndex: 2,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (batchId) {
      fetchBatchDetails();
    }
  }, [batchId, API_URL]);

  // Fetch available students when add student modal opens
  useEffect(() => {
    const fetchAvailableStudents = async () => {
      if (!showAddStudentModal || !token) return;
      try {
        const response = await fetch(`${API_URL}/students`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          // Filter out already enrolled students
          const enrolled = new Set(students.map((s) => s.id));
          setAvailableStudents(
            data.filter((s: AvailableStudent) => !enrolled.has(s.id)),
          );
        }
      } catch (err) {
        console.error("Error fetching students:", err);
      }
    };
    fetchAvailableStudents();
  }, [showAddStudentModal, token, students, API_URL]);

  // Add rank to students
  const rankedStudents = useMemo(() => {
    return students.map((student, index) => ({
      ...student,
      rank: index + 1,
    }));
  }, [students]);

  // Filter visible students based on role
  const visibleStudents = useMemo(() => {
    let visible = rankedStudents;

    if (!user || user.role === "student") {
      // For students and guests, show only top 3
      const top3 = rankedStudents.slice(0, 3);

      // If student logged in, ensure they are also visible
      if (user && user.role === "student") {
        const myStudent = rankedStudents.find((s) => s.id === user.id);
        if (myStudent && !top3.find((s) => s.id === myStudent.id)) {
          // Add detailed student record if not in top 3
          // We need to keep the array sorted or just append?
          // The UI renders a grid, appending is fine.
          // But maybe we should re-sort just in case, or just append.
          // Appending puts them at the end visually.
          return [...top3, myStudent];
        }
      }
      return top3;
    }

    return visible;
  }, [rankedStudents, user]);

  // Apply search filtering on visible students
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return visibleStudents;
    return visibleStudents.filter((student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [visibleStudents, searchQuery]);

  const handleStudentClick = (student: Student) => {
    // Access Control for History
    if (!user) {
      toast.error("يجب تسجيل الدخول لعرض التفاصيل");
      return;
    }

    const canViewAnyHistory = ["admin", "super_admin", "sheikh"].includes(
      user.role,
    );

    if (!canViewAnyHistory) {
      if (user.role === "student" && student.id === user.id) {
        // Allow student to view their own history
      } else {
        toast.error("عفواً، لا يمكنك عرض تفاصيل طلاب آخرين");
        return;
      }
    }

    setSelectedStudent(student);
    setShowHistoryModal(true);
  };

  // Create new student
  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentData.full_name) return;
    setCreateStudentLoading(true);
    setFormError("");
    try {
      const res = await fetch(`${API_URL}/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newStudentData),
      });
      if (res.ok) {
        const createdStudent = await res.json();
        setAvailableStudents((prev) => [...prev, createdStudent]);
        setSelectedStudentIds((prev) => [...prev, createdStudent.id]);
        setShowCreateStudentForm(false);
        setNewStudentData({
          full_name: "",
          guardian_name: "",
          guardian_phone: "",
          gender: "male",
        });
        toast.success("تم إنشاء الطالب وتحديده بنجاح");
      } else {
        const error = await res.json();
        setFormError(error.message || "فشل إنشاء الطالب");
      }
    } catch (err) {
      setFormError("حدث خطأ أثناء إنشاء الطالب");
    } finally {
      setCreateStudentLoading(false);
    }
  };

  // Enroll student in batch
  const handleEnrollStudent = async () => {
    if (selectedStudentIds.length === 0 || !token) return;
    setFormLoading(true);
    setFormError("");
    try {
      const res = await fetch(`${API_URL}/batches/${batchId}/bulk-enroll`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ studentIds: selectedStudentIds }),
      });
      if (res.ok) {
        setShowAddStudentModal(false);
        setSelectedStudentIds([]);
        fetchBatchDetails();
      } else {
        const error = await res.json();
        setFormError(error.message || "فشل إضافة الطلاب");
      }
    } catch (err) {
      setFormError("حدث خطأ أثناء إضافة الطلاب");
    } finally {
      setFormLoading(false);
    }
  };

  const headSheikh = batch?.batch_sheikhs?.find((bs) => bs.is_head_sheikh);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-purple-50 to-blue-50 relative">
      <RandomStars count={30} />

      {/* Add Student Modal */}
      <Modal
        isOpen={showAddStudentModal}
        onClose={() => {
          setShowAddStudentModal(false);
          setShowCreateStudentForm(false);
        }}
        title="👨‍🎓 إضافة طالب للحلقة"
        headerColorClass="bg-gradient-to-r from-blue-600 to-purple-600"
      >
        <div className="space-y-4">
          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl font-arabic text-sm">
              {formError}
            </div>
          )}
          
          {!showCreateStudentForm ? (
            <>
              <div>
                <label className="block font-arabic text-gray-700 mb-2">
                  اختر الطلاب ({selectedStudentIds.length})
                </label>
                <div className="border border-gray-300 rounded-xl max-h-60 overflow-y-auto">
                  {availableStudents.length === 0 ? (
                    <p className="p-4 text-center text-gray-500 font-arabic">
                      لا يوجد طلاب متاحين للإضافة
                    </p>
                  ) : (
                    availableStudents.map((s) => (
                      <label
                        key={s.id}
                        className="flex items-center gap-3 p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <input
                          type="checkbox"
                          checked={selectedStudentIds.includes(s.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedStudentIds([...selectedStudentIds, s.id]);
                            } else {
                              setSelectedStudentIds(
                                selectedStudentIds.filter((id) => id !== s.id),
                              );
                            }
                          }}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="font-arabic text-gray-700">
                          {s.full_name}{" "}
                          {s.guardian_name ? `(${s.guardian_name})` : ""}
                        </span>
                      </label>
                    ))
                  )}
                </div>
              </div>
              <div className="pt-2 pb-2 text-center">
                <button
                  type="button"
                  onClick={() => setShowCreateStudentForm(true)}
                  className="text-blue-600 hover:text-blue-700 font-arabic text-sm hover:underline flex items-center justify-center gap-1 mx-auto"
                >
                  <span>+</span>
                  إنشاء طالب جديد غير موجود بالقائمة
                </button>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleEnrollStudent}
                  disabled={selectedStudentIds.length === 0 || formLoading}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-arabic font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all"
                >
                  {formLoading
                    ? "جاري الإضافة..."
                    : `إضافة ${selectedStudentIds.length} طالب`}
                </button>
                <button
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-arabic hover:bg-gray-200 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleCreateStudent} className="space-y-3 font-arabic">
              <div>
                <label className="block text-gray-700 mb-1">اسم الطالب رباعي *</label>
                <input
                  type="text"
                  required
                  value={newStudentData.full_name}
                  onChange={(e) => setNewStudentData({ ...newStudentData, full_name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="مثال: أحمد محمد محمود"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">اسم ولي الأمر</label>
                <input
                  type="text"
                  value={newStudentData.guardian_name}
                  onChange={(e) => setNewStudentData({ ...newStudentData, guardian_name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="اختياري"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">رقم هاتف ولي الأمر</label>
                <input
                  type="tel"
                  value={newStudentData.guardian_phone}
                  onChange={(e) => setNewStudentData({ ...newStudentData, guardian_phone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-left"
                  placeholder="010XXXXXXXX"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">النوع *</label>
                <select
                  value={newStudentData.gender}
                  onChange={(e) => setNewStudentData({ ...newStudentData, gender: e.target.value as "male" | "female" })}
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="male">ذكر</option>
                  <option value="female">أنثى</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={createStudentLoading || !newStudentData.full_name}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-arabic font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all"
                >
                  {createStudentLoading ? "جاري الإنشاء..." : "إنشاء وتحديد الطالب"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateStudentForm(false)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-arabic hover:bg-gray-200 transition-colors"
                >
                  رجوع
                </button>
              </div>
            </form>
          )}
        </div>
      </Modal>

      {/* Add Session Modal */}
      <Modal
        isOpen={showAddSessionModal}
        onClose={() => setShowAddSessionModal(false)}
        title="📋 تسجيل الحضور"
        headerColorClass="bg-gradient-to-r from-emerald-600 to-teal-600"
      >
        <div className="space-y-4">
          <p className="text-gray-600 font-arabic text-center">
            سيتم توجيهك لصفحة تسجيل الحضور
          </p>
          <div className="flex gap-3 pt-4">
            <Link
              href={`/sheikh/session/new?batchId=${batchId}`}
              className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-arabic font-semibold text-center hover:from-emerald-700 hover:to-teal-700 transition-all"
            >
              الذهاب لتسجيل الحضور
            </Link>
            <button
              onClick={() => setShowAddSessionModal(false)}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-arabic hover:bg-gray-200 transition-colors"
            >
              إلغاء
            </button>
          </div>
        </div>
      </Modal>

      <div className="relative z-10">
        <Header />

        <main className="max-w-6xl mx-auto px-6 py-8">
          {/* Back button */}
          <div className="mb-6">
            <BackButton href="/batches" label="العودة للحلقات" />
          </div>

          {isLoading ? (
            <PageLoader />
          ) : (
            <>
              {/* Batch Header */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-6 mb-8 relative overflow-hidden text-white">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full"></div>

                <div className="relative z-10">
                  <h1 className="text-3xl md:text-4xl font-bold font-arabic mb-4">
                    {batch?.name}
                  </h1>

                  <div className="flex flex-wrap gap-4">
                    {batch?.schedule_description && (
                      <span className="bg-white/20 px-4 py-2 rounded-full font-arabic flex items-center gap-2">
                        <span>📅</span>
                        {batch.schedule_description}
                      </span>
                    )}
                    {headSheikh && (
                      <span className="bg-white/20 px-4 py-2 rounded-full font-arabic flex items-center gap-2">
                        <span>👨‍🏫</span>
                        الشيخ {headSheikh.sheikh.name}
                      </span>
                    )}
                    <span className="bg-white/20 px-4 py-2 rounded-full font-arabic flex items-center gap-2">
                      <span>👨‍🎓</span>
                      {students.length} طالب
                    </span>
                  </div>
                </div>
              </div>

              {/* Admin/Sheikh Action Buttons */}
              {canManage && (
                <div className="bg-white rounded-2xl p-4 mb-8 shadow-lg">
                  <h3 className="text-lg font-bold text-gray-800 font-arabic mb-4 flex items-center gap-2">
                    <span>⚙️</span>
                    إدارة الحلقة
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={() => setShowAddStudentModal(true)}
                      className="flex items-center justify-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-arabic transition-colors"
                    >
                      <span className="text-2xl">👨‍🎓</span>
                      إضافة طالب
                    </button>
                    <Link
                      href={`/batches/${batchId}/exams`}
                      className="flex items-center justify-center gap-2 p-4 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-xl font-arabic transition-colors"
                    >
                      <span className="text-2xl">📝</span>
                      إدارة الامتحانات
                    </Link>
                    <button
                      onClick={() => setShowAddSessionModal(true)}
                      className="flex items-center justify-center gap-2 p-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl font-arabic transition-colors"
                    >
                      <span className="text-2xl">📋</span>
                      تسجيل الحضور
                    </button>
                  </div>
                </div>
              )}

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Students List */}
                <div className="lg:col-span-2">
                  {/* Search Bar */}
                  <div className="mb-6">
                    <StudentSearchBar
                      onSearch={setSearchQuery}
                      placeholder="ابحث عن اسمك هنا... 🔍"
                    />
                  </div>

                  {/* Students Grid */}
                  <div className="space-y-3">
                    {filteredStudents.length === 0 ? (
                      <div className="bg-white rounded-2xl p-8 text-center">
                        <span className="text-6xl mb-4 block">🔍</span>
                        <p className="text-gray-500 font-arabic text-lg">
                          لم يتم العثور على طالب بهذا الاسم
                        </p>
                        <button
                          onClick={() => setSearchQuery("")}
                          className="mt-4 text-purple-600 font-arabic hover:underline"
                        >
                          عرض جميع الطلاب
                        </button>
                      </div>
                    ) : (
                      filteredStudents.map((student) => (
                        <StudentCard
                          key={student.id}
                          id={student.id}
                          name={student.name}
                          points={student.points}
                          avatarIndex={student.avatarIndex}
                          rank={student.rank}
                          onClick={() => handleStudentClick(student)}
                        />
                      ))
                    )}
                  </div>
                </div>

                {/* Sidebar - Leaderboard */}
                <div className="lg:col-span-1">
                  <LeaderboardPreview students={students.slice(0, 3)} />

                  {/* Quick Stats */}
                  <div className="bg-white rounded-2xl p-6 mt-6 shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 font-arabic mb-4 flex items-center gap-2">
                      <span>📊</span>
                      إحصائيات الحلقة
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <span className="text-gray-600 font-arabic">
                          إجمالي الطلاب
                        </span>
                        <span className="font-bold text-gray-800">
                          {students.length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl">
                        <span className="text-gray-600 font-arabic">
                          أعلى نقاط
                        </span>
                        <span className="font-bold text-yellow-600 flex items-center gap-1">
                          <span>⭐</span>
                          {students[0]?.points || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                        <span className="text-gray-600 font-arabic">
                          متوسط النقاط
                        </span>
                        <span className="font-bold text-purple-600">
                          {Math.round(
                            students.reduce((acc, s) => acc + s.points, 0) /
                              (students.length || 1),
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Student History Modal */}
      <StudentHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        student={selectedStudent}
        batchId={Number(batchId)}
      />
    </div>
  );
}
