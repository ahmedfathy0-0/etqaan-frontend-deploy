"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { UserGroup, TickDouble01, Alert01, Cancel01, Search01 } from "@dga-icons/react/duotone-rounded";

export default function StudentsManagement() {
  const [selectedLecture, setSelectedLecture] = useState("الكل");
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  // Lecture data matching the UpcomingLectures component
  const lectures = [
    { id: 1, title: "سورة البقرة (1-20)", level: "متوسط" },
    { id: 2, title: "أحكام التجويد - النون الساكنة", level: "متقدم" },
    { id: 3, title: "جزء عم - مراجعة", level: "مبتدئ" },
    { id: 4, title: "سورة آل عمران (1-50)", level: "متوسط" },
    { id: 5, title: "التفسير والمعاني", level: "متقدم" },
  ];

  const students = [
    {
      id: 1,
      name: "أحمد محمد علي",
      image: "/images/students/student1.png",
      lectures: ["سورة البقرة (1-20)", "أحكام التجويد - النون الساكنة"],
      progress: 85,
      attendance: "95%",
      lastEvaluation: "ممتاز",
      status: "active",
      phoneNumber: "0501234567",
      joinDate: "سبتمبر 2024",
    },
    {
      id: 2,
      name: "فاطمة علي أحمد",
      image: "/images/students/student2.png",
      lectures: ["أحكام التجويد - النون الساكنة", "التفسير والمعاني"],
      progress: 92,
      attendance: "100%",
      lastEvaluation: "ممتاز جداً",
      status: "excellent",
      phoneNumber: "0507654321",
      joinDate: "أغسطس 2024",
    },
    {
      id: 3,
      name: "عبدالله أحمد محمد",
      image: "/images/students/student3.png",
      lectures: ["جزء عم - مراجعة"],
      progress: 78,
      attendance: "88%",
      lastEvaluation: "جيد جداً",
      status: "needs-attention",
      phoneNumber: "0509876543",
      joinDate: "أكتوبر 2024",
    },
    {
      id: 4,
      name: "مريم محمد سالم",
      image: "/images/students/student4.png",
      lectures: ["سورة البقرة (1-20)", "سورة آل عمران (1-50)"],
      progress: 96,
      attendance: "100%",
      lastEvaluation: "ممتاز جداً",
      status: "excellent",
      phoneNumber: "0502468135",
      joinDate: "يوليو 2024",
    },
    {
      id: 5,
      name: "يوسف خالد أحمد",
      image: "/images/students/student5.png",
      lectures: ["جزء عم - مراجعة", "أحكام التجويد - النون الساكنة"],
      progress: 82,
      attendance: "92%",
      lastEvaluation: "جيد جداً",
      status: "active",
      phoneNumber: "0508642097",
      joinDate: "سبتمبر 2024",
    },
  ];

  const lectureOptions = ["الكل", ...lectures.map((lecture) => lecture.title)];

  const filteredStudents = useMemo(() => {
    if (selectedLecture === "الكل") {
      return students;
    }
    return students.filter((student) =>
      student.lectures.includes(selectedLecture)
    );
  }, [selectedLecture]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "border-success-300 bg-success-50";
      case "active":
        return "border-primary-300 bg-primary-50";
      case "needs-attention":
        return "border-warning-300 bg-warning-50";
      default:
        return "border-neutral-300 bg-neutral-50";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent":
        return <TickDouble01 aria-hidden="true" size={24} className="text-success-600" />;
      case "active":
        return <TickDouble01 aria-hidden="true" size={24} className="text-primary-600" />;
      case "needs-attention":
        return <Alert01 aria-hidden="true" size={24} className="text-warning-600" />;
      default:
        return <UserGroup aria-hidden="true" size={24} className="text-neutral-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "excellent":
        return "متفوق";
      case "active":
        return "نشط";
      case "needs-attention":
        return "يحتاج متابعة";
      default:
        return "عادي";
    }
  };

  const handleEvaluate = (student: any) => {
    setSelectedStudent(student);
    setShowEvaluationModal(true);
  };

  return (
    <>
      <div className="bg-white rounded-[24px] p-6 shadow-[0_2px_10px_5px_rgba(0,10,1,0.15)] border-[1.5px] border-success-200 font-cairo">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <h2 className="text-[28px] font-bold text-success-900 flex items-center gap-3">
            <UserGroup aria-hidden="true" size={32} className="text-primary-600" />
            إدارة الطلاب
          </h2>
          <div className="bg-primary-50 px-4 py-2 rounded-xl border border-primary-100">
            <span className="font-bold text-primary-700">
              {filteredStudents.length} طالب
            </span>
          </div>
        </div>

        {/* Enhanced Filter Section */}
        <div className="mb-6 p-5 bg-neutral-50 rounded-[20px] border border-neutral-100">
          <label className="block font-bold text-neutral-800 mb-3">
            فلترة حسب المحاضرة:
          </label>
          <select
            value={selectedLecture}
            onChange={(e) => setSelectedLecture(e.target.value)}
            className="w-full h-12 bg-white border-[1.5px] border-neutral-200 rounded-xl px-4 text-neutral-800 focus:ring-1 focus:ring-success-700 focus:border-success-700 transition-all font-bold cursor-pointer"
          >
            {lectureOptions.map((lecture) => (
              <option key={lecture} value={lecture}>
                {lecture}{" "}
                {lecture !== "الكل" &&
                  `(${
                    students.filter((s) => s.lectures.includes(lecture)).length
                  } طالب)`}
              </option>
            ))}
          </select>
        </div>

        {/* Students List */}
        <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              className={`border-[1.5px] rounded-2xl p-5 transition-all duration-300 hover:shadow-md bg-white hover:border-success-400`}
            >
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-[3px] border-white shadow-sm shrink-0">
                  <Image
                    src={student.image}
                    alt={student.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-success-900 mb-1">
                        {student.name}
                      </h4>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(student.status)}
                        <span className="font-bold text-sm text-neutral-600">
                          {getStatusText(student.status)}
                        </span>
                      </div>
                    </div>
                    <div className="w-full sm:w-32">
                      <div className="font-bold text-success-700 mb-1 text-left">
                        {student.progress}%
                      </div>
                      <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            student.progress >= 90
                              ? "bg-success-500"
                              : student.progress >= 75
                              ? "bg-primary-500"
                              : "bg-warning-500"
                          }`}
                          style={{ width: `${student.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100 font-medium">
                      <span className="text-neutral-500 ml-1">الحضور:</span>
                      <span className="text-neutral-800 font-bold">
                        {student.attendance}
                      </span>
                    </div>
                    <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100 font-medium">
                      <span className="text-neutral-500 ml-1">آخر تقييم:</span>
                      <span className="text-neutral-800 font-bold">
                        {student.lastEvaluation}
                      </span>
                    </div>
                    <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100 font-medium">
                      <span className="text-neutral-500 ml-1">تاريخ الانضمام:</span>
                      <span className="text-neutral-800 font-bold">{student.joinDate}</span>
                    </div>
                    <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100 font-medium">
                      <span className="text-neutral-500 ml-1">رقم الهاتف:</span>
                      <span className="text-neutral-800 font-bold" dir="ltr">
                        {student.phoneNumber}
                      </span>
                    </div>
                  </div>

                  <div className="mb-5">
                    <p className="text-sm font-bold text-neutral-500 mb-2">
                      المحاضرات المسجلة:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {student.lectures.map((lecture, index) => (
                        <span
                          key={index}
                          className="bg-success-50 text-success-700 px-3 py-1 rounded-lg text-sm font-bold border border-success-200"
                        >
                          {lecture}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-end gap-3">
                    <button
                      onClick={() => handleEvaluate(student)}
                      className="h-10 px-5 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors"
                    >
                      تقييم جديد
                    </button>
                    <button className="h-10 px-5 bg-neutral-200 text-neutral-800 rounded-xl font-bold hover:bg-neutral-300 transition-colors">
                      عرض السجل
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12 bg-success-50 rounded-2xl border-[1.5px] border-dashed border-success-200">
            <div className="text-success-300 mb-4 flex justify-center">
              <Search01 aria-hidden="true" size={64} />
            </div>
            <p className="text-xl font-bold text-success-900">
              لا يوجد طلاب في هذه المحاضرة
            </p>
          </div>
        )}

        <div className="mt-8 text-center">
          <button className="h-12 px-8 bg-success-50 text-success-800 rounded-xl font-bold hover:bg-success-100 transition-colors border border-success-200">
            عرض جميع الطلاب
          </button>
        </div>
      </div>

      {/* Enhanced Evaluation Modal */}
      {showEvaluationModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-cairo">
          <div className="bg-white rounded-[24px] p-8 max-w-lg w-full shadow-2xl border-[1.5px] border-success-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-success-900">
                تقييم الطالب
              </h3>
              <button
                onClick={() => setShowEvaluationModal(false)}
                className="text-neutral-400 hover:text-danger-600 transition-colors"
              >
                <Cancel01 aria-hidden="true" size={28} />
              </button>
            </div>

            <div className="mb-6 p-4 bg-success-50 rounded-2xl border border-success-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-[1.5px] border-white shadow-sm shrink-0">
                  <Image
                    src={selectedStudent.image}
                    alt={selectedStudent.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-success-900">
                    {selectedStudent.name}
                  </h4>
                  <p className="text-sm font-bold text-success-700">
                    التقدم الحالي: {selectedStudent.progress}%
                  </p>
                </div>
              </div>
            </div>

            <form className="space-y-5">
              <div>
                <label className="block font-bold text-neutral-800 mb-2">
                  المحاضرة:
                </label>
                <select className="w-full h-12 bg-white border-[1.5px] border-neutral-200 rounded-xl px-4 text-neutral-800 focus:ring-1 focus:ring-success-700 focus:border-success-700 transition-all font-bold">
                  {selectedStudent.lectures.map(
                    (lecture: string, index: number) => (
                      <option key={index} value={lecture}>
                        {lecture}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="block font-bold text-neutral-800 mb-2">
                  نوع التقييم:
                </label>
                <select className="w-full h-12 bg-white border-[1.5px] border-neutral-200 rounded-xl px-4 text-neutral-800 focus:ring-1 focus:ring-success-700 focus:border-success-700 transition-all font-bold">
                  <option>حفظ جديد</option>
                  <option>مراجعة</option>
                  <option>تجويد</option>
                  <option>امتحان شفهي</option>
                  <option>امتحان كتابي</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-neutral-800 mb-2">
                  التقييم:
                </label>
                <select className="w-full h-12 bg-white border-[1.5px] border-neutral-200 rounded-xl px-4 text-neutral-800 focus:ring-1 focus:ring-success-700 focus:border-success-700 transition-all font-bold">
                  <option>ممتاز جداً (95-100)</option>
                  <option>ممتاز (90-94)</option>
                  <option>جيد جداً (85-89)</option>
                  <option>جيد (80-84)</option>
                  <option>مقبول (70-79)</option>
                  <option>ضعيف (أقل من 70)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-neutral-800 mb-2">
                  الملاحظات:
                </label>
                <textarea
                  className="w-full bg-white border-[1.5px] border-neutral-200 rounded-xl p-4 text-neutral-800 h-32 resize-none focus:ring-1 focus:ring-success-700 focus:border-success-700 transition-all font-medium"
                  placeholder="اكتب ملاحظاتك وتوجيهاتك للطالب..."
                ></textarea>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 h-12 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors"
                >
                  حفظ التقييم
                </button>
                <button
                  type="button"
                  onClick={() => setShowEvaluationModal(false)}
                  className="flex-1 h-12 bg-neutral-200 text-neutral-800 rounded-xl font-bold hover:bg-neutral-300 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
