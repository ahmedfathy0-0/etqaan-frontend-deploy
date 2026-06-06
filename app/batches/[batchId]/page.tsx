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
import { useBatchDetails, useEnrollStudents } from "@/queries/useBatches";
import { useStudents, useCreateStudent } from "@/queries/useStudents";
import BatchHeader from "@/components/batches/BatchHeader";
import BatchStats from "@/components/batches/BatchStats";
import BatchAdminActions from "@/components/batches/BatchAdminActions";
import AddStudentModal from "@/components/batches/AddStudentModal";


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

  const [searchQuery, setSearchQuery] = useState("");
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



  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api-v1";

  const canManage =
    user?.role === "admin" ||
    user?.role === "super_admin" ||
    user?.role === "sheikh";

  const { data, isLoading } = useBatchDetails(batchId);

  const batch = data?.batch;
  const students: Student[] = data?.students || [];


  const { data: allStudents } = useStudents();
  
  // Update available students when allStudents changes
  useEffect(() => {
    if (!showAddStudentModal || !allStudents) return;
    const enrolled = new Set(students.map((s) => s.id));
    setAvailableStudents(
      allStudents.filter((s: AvailableStudent) => !enrolled.has(s.id)),
    );
  }, [showAddStudentModal, students, allStudents]);

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

  const { mutateAsync: createStudentMutate } = useCreateStudent();

  const { mutateAsync: enrollStudentsMutate } = useEnrollStudents();

  // Enroll student in batch
  const handleEnrollStudent = async () => {
    if (selectedStudentIds.length === 0 || !token) return;
    setFormLoading(true);
    setFormError("");
    try {
      await enrollStudentsMutate({ batchId, studentIds: selectedStudentIds });
      setShowAddStudentModal(false);
      setSelectedStudentIds([]);
    } catch (err: any) {
      setFormError(err.response?.data?.message || "حدث خطأ أثناء إضافة الطلاب");
    } finally {
      setFormLoading(false);
    }
  };

  const headSheikh = batch?.batch_sheikhs?.find((bs: any) => bs.is_head_sheikh);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-purple-50 to-blue-50 relative">
      <RandomStars count={30} />

      {/* Add Student Modal */}
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
              <BatchHeader
                name={batch?.name || ""}
                scheduleDescription={batch?.schedule_description}
                headSheikhName={headSheikh?.sheikh.name}
                studentsCount={students.length}
              />

              {/* Admin/Sheikh Action Buttons */}
              {canManage && (
                <BatchAdminActions
                  batchId={batchId}
                  onAddStudentClick={() => setShowAddStudentModal(true)}
                  onAddSessionClick={() => setShowAddSessionModal(true)}
                />
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
                  <BatchStats
                    studentsCount={students.length}
                    highestScore={students[0]?.points || 0}
                    averageScore={Math.round(
                      students.reduce((acc, s) => acc + s.points, 0) /
                        (students.length || 1),
                    )}
                  />
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
