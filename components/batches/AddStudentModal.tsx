import Modal from "@/components/ui/Modal";
import { useState } from "react";

interface AvailableStudent {
  id: number;
  full_name: string;
  guardian_name?: string;
}

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableStudents: AvailableStudent[];
  selectedStudentIds: number[];
  setSelectedStudentIds: (ids: number[]) => void;
  formError: string;
  formLoading: boolean;
  onEnroll: () => void;
  showCreateStudentForm: boolean;
  setShowCreateStudentForm: (show: boolean) => void;
  newStudentData: any;
  setNewStudentData: (data: any) => void;
  onCreateStudent: (e: React.FormEvent) => void;
  createStudentLoading: boolean;
}

export default function AddStudentModal({
  isOpen,
  onClose,
  availableStudents,
  selectedStudentIds,
  setSelectedStudentIds,
  formError,
  formLoading,
  onEnroll,
  showCreateStudentForm,
  setShowCreateStudentForm,
  newStudentData,
  setNewStudentData,
  onCreateStudent,
  createStudentLoading,
}: AddStudentModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
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
                onClick={onEnroll}
                disabled={selectedStudentIds.length === 0 || formLoading}
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-arabic font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all"
              >
                {formLoading
                  ? "جاري الإضافة..."
                  : `إضافة ${selectedStudentIds.length} طالب`}
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-arabic hover:bg-gray-200 transition-colors"
              >
                إلغاء
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={onCreateStudent} className="space-y-3 font-arabic">
            <div>
              <label className="block text-gray-700 mb-1">
                اسم الطالب رباعي *
              </label>
              <input
                type="text"
                required
                value={newStudentData.full_name}
                onChange={(e) =>
                  setNewStudentData({
                    ...newStudentData,
                    full_name: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 placeholder-gray-400 bg-white"
                placeholder="مثال: أحمد محمد محمود"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">اسم ولي الأمر</label>
              <input
                type="text"
                value={newStudentData.guardian_name}
                onChange={(e) =>
                  setNewStudentData({
                    ...newStudentData,
                    guardian_name: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 placeholder-gray-400 bg-white"
                placeholder="اختياري"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">
                رقم هاتف ولي الأمر
              </label>
              <input
                type="tel"
                value={newStudentData.guardian_phone}
                onChange={(e) =>
                  setNewStudentData({
                    ...newStudentData,
                    guardian_phone: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 placeholder-gray-400 bg-white text-left"
                placeholder="010XXXXXXXX"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">النوع *</label>
              <select
                value={newStudentData.gender}
                onChange={(e) =>
                  setNewStudentData({
                    ...newStudentData,
                    gender: e.target.value as "male" | "female",
                  })
                }
                className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 bg-white"
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
                {createStudentLoading
                  ? "جاري الإنشاء..."
                  : "إنشاء وتحديد الطالب"}
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
  );
}
