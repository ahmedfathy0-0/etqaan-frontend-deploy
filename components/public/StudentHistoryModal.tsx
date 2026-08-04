"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Modal from "@/components/ui/Modal";
import Avatar from "@/components/ui/Avatar";
import {
  Star,
  Award01,
  ThumbsUp,
  OkFinger,
  Books01,
  Reload,
  CheckmarkCircle01,
  CancelCircle,
  Clock01,
  Hospital01,
  Calendar01,
  PencilEdit01,
  Mailbox,
  Gift,
  Clipboard,
  BookOpen01
} from "@dga-icons/react/duotone-rounded";

interface DailyRecord {
  id: number;
  record_date: string;
  attendance_status: "present" | "absent" | "late" | "excused";
  jadeed_range?: string;
  jadeed_grade?: string;
  muraja_range?: string;
  muraja_grade?: string;
  behavior_note?: string;
  bonus_points?: number;
}

interface ExamResult {
  id: number;
  score: number;
  exam: {
    id: number;
    title: string;
    max_score: number;
    exam_date: string;
  };
}

interface StudentHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: {
    id: number;
    name: string;
    points: number;
    avatarIndex?: number;
  } | null;
  batchStudentId?: number;
  batchId?: number;
}

const gradeEmojis: Record<string, React.ReactNode> = {
  excellent: <Award01 size={18} />,
  very_good: <Star size={18} />,
  good: <ThumbsUp size={18} />,
  acceptable: <OkFinger size={18} />,
  weak: <Books01 size={18} />,
  redo: <Reload size={18} />,
};

const gradeLabels: Record<string, string> = {
  excellent: "ممتاز",
  very_good: "جيد جداً",
  good: "جيد",
  acceptable: "مقبول",
  weak: "ضعيف",
  redo: "إعادة",
};

const attendanceIcons: Record<
  string,
  { icon: React.ReactNode; label: string; color: string }
> = {
  present: { icon: <CheckmarkCircle01 size={20} />, label: "حاضر", color: "text-success-600" },
  absent: { icon: <CancelCircle size={20} />, label: "غائب", color: "text-red-600" },
  late: { icon: <Clock01 size={20} />, label: "متأخر", color: "text-yellow-600" },
  excused: { icon: <Hospital01 size={20} />, label: "معذور", color: "text-blue-600" },
};

export default function StudentHistoryModal({
  isOpen,
  onClose,
  student,
  batchStudentId,
  batchId,
}: StudentHistoryModalProps) {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<"sessions" | "exams">("sessions");
  const [dailyRecords, setDailyRecords] = useState<DailyRecord[]>([]);
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api-v1";

  useEffect(() => {
    if (isOpen && student && token) {
      setIsLoading(true);
      const fetchHistory = async () => {
        try {
          const query = batchId ? `?batchId=${batchId}` : "";
          const res = await fetch(
            `${API_URL}/students/${student.id}/history${query}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          if (res.ok) {
            const data = await res.json();
            setDailyRecords(data.dailyRecords);
            setExamResults(data.examResults);
          }
        } catch (error) {
          console.error("Failed to fetch history", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchHistory();
    }
  }, [isOpen, student, batchId, token, API_URL]);

  if (!isOpen || !student) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-4">
          <Avatar 
            name={student.name} 
            className="w-12 h-12 rounded-xl text-xl" 
          />
          <div>
            <div className="text-lg md:text-xl font-bold text-neutral-800 font-arabic">
              {student.name}
            </div>
            <div className="flex items-center gap-1.5 text-sm text-yellow-600 font-arabic font-bold mt-1">
              <Star size={16} />
              {student.points} نقطة
            </div>
          </div>
        </div>
      }
      maxWidth="max-w-2xl"
    >
      {/* Tabs */}
      <div className="flex border-b border-neutral-200 bg-white">
        <button
          onClick={() => setActiveTab("sessions")}
          className={`flex-1 py-4 font-cairo font-bold transition-all flex items-center justify-center gap-2 text-lg ${
            activeTab === "sessions"
              ? "text-success-800 border-b-[3px] border-success-800 bg-success-50/50"
              : "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50"
          }`}
        >
          <Calendar01 size={22} />
          الحضور والدرجات
        </button>
        <button
          onClick={() => setActiveTab("exams")}
          className={`flex-1 py-4 font-cairo font-bold transition-all flex items-center justify-center gap-2 text-lg ${
            activeTab === "exams"
              ? "text-success-800 border-b-[3px] border-success-800 bg-success-50/50"
              : "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50"
          }`}
        >
          <PencilEdit01 size={22} />
          الامتحانات
        </button>
      </div>

      {/* Content */}
      <div className="p-6 max-h-[50vh] overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-[5px] border-success-200 border-t-success-800 rounded-full animate-spin mb-4"></div>
            <p className="text-success-900 font-bold font-cairo text-lg">جاري التحميل...</p>
          </div>
        ) : activeTab === "sessions" ? (
          <div className="space-y-4">
            {dailyRecords.length === 0 ? (
              <div className="text-center py-12 flex flex-col items-center justify-center">
                <Mailbox size={64} className="mb-4 text-neutral-400 opacity-80" />
                <p className="text-neutral-500 font-cairo font-medium text-lg">
                  لا توجد سجلات حضور بعد
                </p>
              </div>
            ) : (
              dailyRecords.map((record) => (
                <div
                  key={record.id}
                  className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 transition-all hover:border-success-200 hover:shadow-sm"
                >
                  {/* Date and attendance */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-neutral-700 font-cairo font-bold text-lg">
                      {new Date(record.record_date).toLocaleDateString(
                        "ar-EG",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </span>
                    <span
                      className={`flex items-center gap-1.5 font-cairo font-bold ${
                        attendanceIcons[record.attendance_status].color
                      }`}
                    >
                      {attendanceIcons[record.attendance_status].icon}
                      {attendanceIcons[record.attendance_status].label}
                    </span>
                  </div>

                  {/* Grades */}
                  <div className="grid grid-cols-2 gap-3">
                    {record.jadeed_range && (
                      <div className="bg-white rounded-xl p-3 border border-neutral-100 shadow-sm">
                        <div className="text-sm text-neutral-500 font-cairo font-medium mb-1">
                          الحفظ الجديد
                        </div>
                        <div className="font-cairo font-bold text-neutral-800">
                          {record.jadeed_range}
                        </div>
                        {record.jadeed_grade && (
                          <div className="flex items-center gap-1 mt-1">
                            <span>{gradeEmojis[record.jadeed_grade]}</span>
                            <span className="text-sm text-neutral-600 font-cairo font-medium">
                              {gradeLabels[record.jadeed_grade]}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                    {record.muraja_range && (
                      <div className="bg-white rounded-xl p-3 border border-neutral-100 shadow-sm">
                        <div className="text-sm text-neutral-500 font-cairo font-medium mb-1">
                          المراجعة
                        </div>
                        <div className="font-cairo font-bold text-neutral-800">
                          {record.muraja_range}
                        </div>
                        {record.muraja_grade && (
                          <div className="flex items-center gap-1 mt-1">
                            <span>{gradeEmojis[record.muraja_grade]}</span>
                            <span className="text-sm text-neutral-600 font-cairo font-medium">
                              {gradeLabels[record.muraja_grade]}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Bonus */}
                  {record.bonus_points && record.bonus_points > 0 && (
                    <div className="mt-3 flex items-center gap-1.5 text-yellow-600 font-cairo font-bold text-sm bg-yellow-50 p-2 rounded-lg inline-flex">
                      <Gift size={16} />
                      نقاط إضافية: +{record.bonus_points}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {examResults.length === 0 ? (
              <div className="text-center py-12 flex flex-col items-center justify-center">
                <Clipboard size={64} className="mb-4 text-neutral-400 opacity-80" />
                <p className="text-neutral-500 font-cairo font-medium text-lg">
                  لا توجد نتائج امتحانات بعد
                </p>
              </div>
            ) : (
              examResults.map((result) => {
                const percentage = (result.score / result.exam.max_score) * 100;
                const isExcellent = percentage >= 90;
                const isPassing = percentage >= 60;

                return (
                  <div
                    key={result.id}
                    className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 transition-all hover:border-success-200 hover:shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-cairo font-bold text-neutral-800 text-lg">
                          {result.exam.title}
                        </h4>
                        <span className="text-sm text-neutral-500 font-cairo font-medium">
                          {new Date(result.exam.exam_date).toLocaleDateString(
                            "ar-EG",
                          )}
                        </span>
                      </div>
                      <div className="text-center bg-white p-2 rounded-xl shadow-sm border border-neutral-100 min-w-[80px]">
                        <div
                          className={`text-3xl font-bold font-cairo leading-none ${
                            isExcellent
                              ? "text-success-600"
                              : isPassing
                                ? "text-blue-600"
                                : "text-red-600"
                          }`}
                        >
                          {result.score}
                        </div>
                        <div className="text-xs text-neutral-500 font-cairo font-bold mt-1">
                          من {result.exam.max_score}
                        </div>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="h-3 bg-neutral-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isExcellent
                            ? "bg-gradient-to-r from-success-400 to-success-600"
                            : isPassing
                              ? "bg-gradient-to-r from-blue-400 to-blue-600"
                              : "bg-gradient-to-r from-red-400 to-red-600"
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>

                    <div className="mt-3 flex items-center justify-end gap-2">
                      <span
                        className={`flex items-center gap-1.5 font-cairo font-bold text-sm py-1.5 px-3 rounded-lg ${
                          isExcellent
                            ? "bg-success-50 text-success-700"
                            : isPassing
                              ? "bg-blue-50 text-blue-700"
                              : "bg-red-50 text-red-700"
                        }`}
                      >
                        {isExcellent ? (
                          <>
                            <Award01 size={18} />
                            ممتاز!
                          </>
                        ) : isPassing ? (
                          <>
                            <ThumbsUp size={18} />
                            جيد
                          </>
                        ) : (
                          <>
                            <BookOpen01 size={18} />
                            يحتاج مراجعة
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Footer / Buttons */}
      <div className="p-4 border-t border-neutral-200 bg-neutral-50 rounded-b-2xl">
        <button
          onClick={onClose}
          className="w-full flex flex-row justify-center items-center h-14 bg-neutral-800 hover:bg-neutral-900 text-white rounded-2xl transition-all shadow-sm font-cairo"
        >
          <span className="font-bold text-lg">
            إغلاق
          </span>
        </button>
      </div>
    </Modal>
  );
}
