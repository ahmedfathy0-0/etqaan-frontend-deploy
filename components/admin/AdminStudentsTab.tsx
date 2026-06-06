import { useState } from "react";
import { AvailableStudent } from "@/api/students";
import Avatar from "@/components/ui/Avatar";

interface AdminStudentsTabProps {
  students: AvailableStudent[];
  onDeleteConfirm: (studentId: number) => void;
  deleteConfirm: number | null;
  setDeleteConfirm: (id: number | null) => void;
  setShowStudentModal: (show: boolean) => void;
  onEditStudent: (student: AvailableStudent) => void;
}

export default function AdminStudentsTab({
  students,
  onDeleteConfirm,
  deleteConfirm,
  setDeleteConfirm,
  setShowStudentModal,
  onEditStudent,
}: AdminStudentsTabProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = students?.filter(
    (s) =>
      s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.guardian_name && s.guardian_name.toLowerCase().includes(searchTerm.toLowerCase())),
  ) || [];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="w-full sm:w-96 relative">
          <input
            type="text"
            placeholder="بحث عن طالب..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-arabic text-gray-900"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>
        </div>
        <button
          onClick={() => setShowStudentModal(true)}
          className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-xl font-arabic font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <span>+</span>
          إضافة طالب
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead className="bg-gray-50 text-gray-600 font-arabic text-sm">
            <tr>
              <th className="p-4 font-semibold">اسم الطالب</th>
              <th className="p-4 font-semibold">اسم ولي الأمر</th>
              <th className="p-4 font-semibold">رقم التواصل</th>
              <th className="p-4 font-semibold">الجنس</th>
              <th className="p-4 font-semibold">تاريخ الإضافة</th>
              <th className="p-4 font-semibold">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredStudents.map((student: any) => (
              <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={student.full_name} className="w-10 h-10 text-base rounded-full" />
                    <span className="font-semibold text-gray-800">
                      {student.full_name}
                    </span>
                  </div>
                </td>
                <td className="p-4 text-gray-600">
                  {student.guardian_name || "-"}
                </td>
                <td className="p-4 text-gray-600" dir="ltr">
                  {student.guardian_phone || "-"}
                </td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold font-arabic
                    ${
                      student.gender === "female"
                        ? "bg-pink-100 text-pink-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {student.gender === "female" ? "أنثى" : "ذكر"}
                  </span>
                </td>
                <td className="p-4 text-gray-500 text-sm">
                  {new Date(student.created_at || Date.now()).toLocaleDateString("ar-EG")}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {deleteConfirm === student.id ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onDeleteConfirm(student.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded text-xs font-bold hover:bg-red-700"
                        >
                          تأكيد
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-xs font-bold hover:bg-gray-300"
                        >
                          إلغاء
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-1">
                        <button
                          onClick={() => onEditStudent(student)}
                          className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                          title="تعديل"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(student.id)}
                          className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="حذف"
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filteredStudents.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500 font-arabic">
                  لا يوجد طلاب بهذا البحث
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
