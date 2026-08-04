import { useState } from "react";
import { AvailableStudent } from "@/api/students";
import { SearchBar } from "@/components/ui/SearchBar";
import { Delete01, Edit01, Filter, UserAdd01, UserGroup } from "@dga-icons/react/duotone-rounded";

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
      (s.guardian_name && s.guardian_name.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  return (
    <div className="flex flex-col items-center p-0 lg:py-[24px] lg:px-[16px] gap-[24px] w-full max-w-full mx-auto" dir="rtl">
      
      {/* Mobile Title / Tags Section */}
      <div className="lg:hidden w-full flex flex-col items-end px-4 pb-8 pt-6 bg-[#17481B] mb-6 gap-6">
        <div className="flex w-full items-center justify-between">
          <span className="text-[#FFFFFF] font-cairo font-bold text-[18px]">الطلاب</span>
        </div>
        <div className="flex flex-row items-center">
          <div className="flex flex-row justify-center items-center py-[8px] px-[16px] gap-[10px] bg-[#E2F7E4] rounded-[48px] mb-4">
            <UserGroup aria-hidden="true" size={24} color="#17481B" />
            <span className="font-cairo font-normal text-[14px] leading-[150%] text-[#17481B] text-right">{students?.length || 0} طالب</span>
          </div>
        </div>
      </div>

      {/* Search Bar Container */}
      <div className="flex flex-row items-center px-[16px] gap-[16px] w-full lg:w-[850px] h-[48px]">
        {/* filter icon */}
        <button className="w-[48px] h-[48px] flex-shrink-0 cursor-pointer flex items-center justify-center bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors">
          <Filter aria-hidden="true" size={32} color="#404641" />
        </button>

        {/* search input */}
        <div className="w-full lg:w-[770px]">
          <SearchBar 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="أبحث عن طالب"
          />
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:flex flex-col items-end p-0 w-full overflow-x-auto border border-gray-200 rounded-[16px] overflow-hidden shadow-sm">
        <div className="min-w-[700px] w-full flex flex-col">
          {/* Header Row */}
          <div className="flex flex-row justify-center items-center py-[16px] px-0 gap-[16px] w-full bg-[#308337] min-h-[68px]">
            <div className="flex-1 text-center font-cairo font-bold text-[24px] leading-[150%] text-[#FBFFFC]">
              الأسم
            </div>
            <div className="flex-1 text-center font-cairo font-bold text-[24px] leading-[150%] text-[#FBFFFC]">
              ولي الأمر
            </div>
            <div className="flex-1 text-center font-cairo font-bold text-[24px] leading-[150%] text-[#FBFFFC]">
              رقم التواصل
            </div>
            <div className="w-[120px] text-center font-cairo font-bold text-[24px] leading-[150%] text-[#FBFFFC]">
              الجنس
            </div>
            <div className="flex-1 text-center font-cairo font-bold text-[24px] leading-[150%] text-[#FBFFFC]">
              الإجراءات
            </div>
          </div>

          {/* Rows */}
          {filteredStudents.map((student, index) => (
            <div 
              key={student.id} 
              className={`flex flex-row justify-center items-center py-[16px] px-0 gap-[16px] w-full ${index % 2 === 0 ? "bg-[#FFFFFF]" : "bg-[#E3E6E3]"}`}
            >
              {/* Name */}
              <div className="flex-1 text-center font-cairo font-bold text-[18px] leading-[150%] text-[#000000] break-words">
                {student.full_name}
              </div>

              {/* Guardian */}
              <div className="flex-1 text-center font-cairo font-bold text-[18px] leading-[150%] text-[#000000] break-words">
                {student.guardian_name || "-"}
              </div>

              {/* Phone */}
              <div className="flex-1 text-center font-cairo font-bold text-[18px] leading-[150%] text-[#000000]" dir="ltr">
                {student.guardian_phone || "-"}
              </div>

              {/* Gender */}
              <div className="w-[120px] flex justify-center items-center">
                <div className={`flex flex-row justify-center items-center py-[8px] px-[16px] gap-[10px] w-[72px] h-[37px] rounded-[48px] ${
                    student.gender === "female" ? "bg-[#F7D9E4]" : "bg-[#D9EEF7]"
                  }`}>
                  <span className={`font-cairo font-normal text-[14px] leading-[150%] text-center whitespace-nowrap ${
                      student.gender === "female" ? "text-[#4E0027]" : "text-[#00354E]"
                    }`}>
                    {student.gender === "female" ? "أنثى" : "ذكر"}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex-1 flex flex-row justify-center items-center gap-[16px]">
                {deleteConfirm === student.id ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => onDeleteConfirm(student.id)}
                      className="px-2 py-1 bg-[#930404] text-white rounded-[8px] text-xs font-bold font-cairo hover:bg-red-800"
                    >
                      تأكيد
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="px-2 py-1 bg-gray-400 text-white rounded-[8px] text-xs font-bold font-cairo hover:bg-gray-500"
                    >
                      إلغاء
                    </button>
                  </div>
                ) : (
                  <>
                    <button onClick={() => onEditStudent(student)} className="flex justify-center items-center w-[24px] h-[24px]">
                      <Edit01 aria-hidden="true" size={24} color="#035D86" />
                    </button>
                    <button onClick={() => setDeleteConfirm(student.id)} className="flex justify-center items-center w-[24px] h-[24px]">
                      <Delete01 aria-hidden="true" size={24} color="#930404" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}

          {filteredStudents.length === 0 && (
            <div className="w-full p-8 text-center text-gray-500 font-cairo bg-white">
              لا يوجد طلاب بهذا البحث
            </div>
          )}
        </div>
      </div>

      {/* Mobile Cards View */}
      <div className="lg:hidden w-full flex flex-col gap-4 px-4 pb-[100px]">
        {filteredStudents.map((student) => (
          <div key={student.id} className="flex flex-col bg-white border border-[#A3C3D7] rounded-[16px] p-4 gap-4 shadow-sm">
            <div className="flex justify-between items-center w-full">
              <span className="font-cairo font-bold text-[18px] text-[#000000]">
                {student.full_name}
              </span>
              <div className={`flex flex-row justify-center items-center py-[4px] px-[12px] gap-[10px] rounded-[48px] ${
                  student.gender === "female" ? "bg-[#F7D9E4]" : "bg-[#D9EEF7]"
                }`}>
                  <span className={`font-cairo font-normal text-[12px] text-center ${
                      student.gender === "female" ? "text-[#4E0027]" : "text-[#00354E]"
                    }`}>
                    {student.gender === "female" ? "أنثى" : "ذكر"}
                  </span>
              </div>
            </div>

            <div className="flex flex-col gap-1 w-full text-right">
              {student.guardian_name && (
                <span className="font-cairo text-[#79817A] text-[14px]">ولي الأمر: {student.guardian_name}</span>
              )}
              {student.guardian_phone && (
                <span className="font-cairo text-[#79817A] text-[14px]" dir="ltr">{student.guardian_phone}</span>
              )}
            </div>

            <div className="flex justify-end gap-4 mt-2 pt-4 border-t border-gray-100">
               {deleteConfirm === student.id ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => onDeleteConfirm(student.id)}
                      className="px-4 py-1.5 bg-[#930404] text-white rounded-[8px] font-cairo font-bold text-[14px]"
                    >
                      تأكيد החذف
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="px-4 py-1.5 bg-gray-400 text-white rounded-[8px] font-cairo font-bold text-[14px]"
                    >
                      إلغاء
                    </button>
                  </div>
                ) : (
                  <>
                    <button onClick={() => onEditStudent(student)} className="flex items-center gap-2 px-3 py-1.5 rounded-[8px] bg-blue-50 text-[#035D86] font-cairo text-[14px] font-bold">
                       <Edit01 aria-hidden="true" size={18} />
                      تعديل
                    </button>
                    <button onClick={() => setDeleteConfirm(student.id)} className="flex items-center gap-2 px-3 py-1.5 rounded-[8px] bg-red-50 text-[#930404] font-cairo text-[14px] font-bold">
                       <Delete01 aria-hidden="true" size={18} />
                      حذف
                    </button>
                  </>
                )}
            </div>
          </div>
        ))}

        {filteredStudents.length === 0 && (
          <div className="w-full p-8 text-center text-gray-500 font-cairo bg-white rounded-2xl">
            لا يوجد طلاب بهذا البحث
          </div>
        )}
      </div>

      {/* Mobile Floating Action Button - Quick Actions Area */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full h-[88px] bg-[#F5F7F5] shadow-[0px_-2px_30px_4px_rgba(0,0,0,0.15)] rounded-t-[16px] flex flex-row items-center justify-center p-[8px_16px] gap-[8px] z-30">
        <button
          onClick={() => setShowStudentModal(true)}
          className="flex flex-row justify-center items-center py-[8px] px-[16px] gap-[16px] w-full max-w-[448px] h-[56px] bg-[#B17C08] rounded-[16px]"
        >
          <UserAdd01 aria-hidden="true" size={24} color="#FEFFFF" />
          <span className="font-cairo font-bold text-[16px] leading-[150%] text-[#FBFFFC]">إضافة طالب</span>
        </button>
      </div>
    </div>
  );
}
