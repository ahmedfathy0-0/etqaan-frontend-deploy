import { useState } from "react";
import { AvailableStudent } from "@/api/students";
import { SearchBar } from "@/components/ui/SearchBar";
import { Delete01, Edit01, Filter, UserAdd01, UserGroup, Search01 } from "@dga-icons/react/duotone-rounded";

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
  const [sortBy, setSortBy] = useState("name_asc");

  const sortedAndFiltered = (students || [])
    .filter(
      (s) =>
        s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.guardian_name && s.guardian_name.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === "name_desc") return b.full_name.localeCompare(a.full_name, "ar");
      return a.full_name.localeCompare(b.full_name, "ar");
    });

  const studentsWithAccount = sortedAndFiltered.filter(s => s.user_id != null);
  const studentsWithoutAccount = sortedAndFiltered.filter(s => s.user_id == null);

  const renderTable = (title: string, list: AvailableStudent[]) => (
    <div className="w-full flex flex-col gap-4 mb-8">
      <h3 className="text-xl lg:text-2xl font-bold font-cairo text-success-900 text-right px-4 lg:px-0">{title} ({list.length})</h3>
      
      {/* Desktop Table View */}
      <div className="hidden lg:flex flex-col items-end p-0 w-full overflow-x-auto border border-gray-200 rounded-[16px] overflow-hidden shadow-sm">
        <div className="min-w-[700px] w-full flex flex-col">
          {/* Header Row */}
          <div className="flex flex-row justify-center items-center py-[16px] px-0 gap-[16px] w-full bg-[#308337] min-h-[68px]">
            <div className="flex-1 text-center font-cairo font-bold text-lg lg:text-[24px] leading-[150%] text-[#FBFFFC]">الأسم</div>
            <div className="flex-1 text-center font-cairo font-bold text-lg lg:text-[24px] leading-[150%] text-[#FBFFFC]">ولي الأمر</div>
            <div className="flex-1 text-center font-cairo font-bold text-lg lg:text-[24px] leading-[150%] text-[#FBFFFC]">رقم التواصل</div>
            <div className="w-[120px] text-center font-cairo font-bold text-lg lg:text-[24px] leading-[150%] text-[#FBFFFC]">الجنس</div>
            <div className="flex-1 text-center font-cairo font-bold text-lg lg:text-[24px] leading-[150%] text-[#FBFFFC]">الإجراءات</div>
          </div>

          {/* Rows */}
          {list.map((student, index) => (
            <div key={student.id} className={`flex flex-row justify-center items-center py-[16px] px-0 gap-[16px] w-full ${index % 2 === 0 ? "bg-[#FFFFFF]" : "bg-[#E3E6E3]"}`}>
              <div className="flex-1 text-center font-cairo font-bold text-base lg:text-[18px] leading-[150%] text-[#000000] break-words">{student.full_name}</div>
              <div className="flex-1 text-center font-cairo font-bold text-base lg:text-[18px] leading-[150%] text-[#000000] break-words">{student.guardian_name || "-"}</div>
              <div className="flex-1 text-center font-cairo font-bold text-base lg:text-[18px] leading-[150%] text-[#000000]" dir="ltr">{student.guardian_phone || "-"}</div>
              <div className="w-[120px] flex justify-center items-center">
                <div className={`flex flex-row justify-center items-center py-[8px] px-[16px] gap-[10px] w-[72px] h-[37px] rounded-[48px] ${student.gender === "female" ? "bg-[#F7D9E4]" : "bg-[#D9EEF7]"}`}>
                  <span className={`font-cairo font-normal text-[14px] leading-[150%] text-center whitespace-nowrap ${student.gender === "female" ? "text-[#4E0027]" : "text-[#00354E]"}`}>
                    {student.gender === "female" ? "أنثى" : "ذكر"}
                  </span>
                </div>
              </div>
              <div className="flex-1 flex flex-row justify-center items-center gap-[16px]">
                {deleteConfirm === student.id ? (
                  <div className="flex gap-2">
                    <button onClick={() => onDeleteConfirm(student.id)} className="px-2 py-1 bg-[#930404] text-white rounded-[8px] text-xs font-bold font-cairo hover:bg-red-800">تأكيد</button>
                    <button onClick={() => setDeleteConfirm(null)} className="px-2 py-1 bg-gray-400 text-white rounded-[8px] text-xs font-bold font-cairo hover:bg-gray-500">إلغاء</button>
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

          {list.length === 0 && (
            <div className="w-full p-8 text-center text-gray-500 font-cairo bg-white">لا يوجد طلاب بهذا البحث</div>
          )}
        </div>
      </div>

      {/* Mobile Cards View */}
      <div className="lg:hidden w-full flex flex-col gap-4 px-4 pb-4">
        {list.map((student) => (
          <div key={student.id} className="flex flex-col bg-white border border-[#A3C3D7] rounded-[16px] p-4 gap-4 shadow-sm">
            <div className="flex justify-between items-center w-full">
              <span className="font-cairo font-bold text-base text-[#000000]">{student.full_name}</span>
              <div className={`flex flex-row justify-center items-center py-[4px] px-[12px] gap-[10px] rounded-[48px] ${student.gender === "female" ? "bg-[#F7D9E4]" : "bg-[#D9EEF7]"}`}>
                  <span className={`font-cairo font-normal text-[12px] text-center ${student.gender === "female" ? "text-[#4E0027]" : "text-[#00354E]"}`}>
                    {student.gender === "female" ? "أنثى" : "ذكر"}
                  </span>
              </div>
            </div>
            <div className="flex flex-col gap-1 w-full text-right">
              {student.guardian_name && <span className="font-cairo text-[#79817A] text-sm">ولي الأمر: {student.guardian_name}</span>}
              {student.guardian_phone && <span className="font-cairo text-[#79817A] text-sm" dir="ltr">{student.guardian_phone}</span>}
            </div>
            <div className="flex justify-end gap-4 mt-2 pt-4 border-t border-gray-100">
               {deleteConfirm === student.id ? (
                  <div className="flex gap-2">
                    <button onClick={() => onDeleteConfirm(student.id)} className="px-4 py-1.5 bg-[#930404] text-white rounded-[8px] font-cairo font-bold text-sm">تأكيد החذف</button>
                    <button onClick={() => setDeleteConfirm(null)} className="px-4 py-1.5 bg-gray-400 text-white rounded-[8px] font-cairo font-bold text-sm">إلغاء</button>
                  </div>
                ) : (
                  <>
                    <button onClick={() => onEditStudent(student)} className="flex items-center gap-2 px-3 py-1.5 rounded-[8px] bg-blue-50 text-[#035D86] font-cairo text-sm font-bold">
                       <Edit01 aria-hidden="true" size={18} />
                      تعديل
                    </button>
                    <button onClick={() => setDeleteConfirm(student.id)} className="flex items-center gap-2 px-3 py-1.5 rounded-[8px] bg-red-50 text-[#930404] font-cairo text-sm font-bold">
                       <Delete01 aria-hidden="true" size={18} />
                      حذف
                    </button>
                  </>
                )}
            </div>
          </div>
        ))}
        {list.length === 0 && (
          <div className="w-full p-8 text-center text-gray-500 font-cairo bg-white rounded-2xl">لا يوجد طلاب بهذا البحث</div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center p-0 lg:py-[24px] lg:px-[16px] gap-[24px] w-full max-w-full mx-auto" dir="rtl">
      
      {/* Mobile Tags Section */}
      <div className="lg:hidden w-full flex flex-row items-center justify-start px-4 mb-2 gap-2">
        <div className="flex flex-row items-center py-1.5 px-3 gap-2 bg-[#E2F7E4] rounded-full">
          <UserGroup aria-hidden="true" size={20} color="#17481B" />
          <span className="font-cairo font-bold text-sm text-[#17481B]">{studentsWithAccount.length} لديهم حساب</span>
        </div>
        <div className="flex flex-row items-center py-1.5 px-3 gap-2 bg-red-100 rounded-full">
          <UserGroup aria-hidden="true" size={20} color="#930404" />
          <span className="font-cairo font-bold text-sm text-[#930404]">{studentsWithoutAccount.length} ليس لديهم حساب</span>
        </div>
      </div>

      <div className="mb-6 flex h-12 w-full items-center gap-4 px-4 lg:px-0">
        <label className="relative h-12 min-w-0 flex-1">
          <span className="sr-only">البحث عن طالب</span>
          <input
            type="search"
            placeholder="أبحث عن طالب"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="h-12 w-full rounded-2xl border-[1.5px] border-neutral-800 bg-white py-3 pr-11 pl-3 text-right text-base text-success-900 outline-none placeholder:text-success-900 focus:border-success-800"
          />
          <Search01 aria-hidden="true" size={24} className="absolute right-3 top-1/2 -translate-y-1/2 text-success-800" />
        </label>

        <label className="relative flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center text-neutral-800">
          <span className="sr-only">ترتيب الطلاب</span>
          <Filter aria-hidden="true" size={32} />
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="absolute inset-0 cursor-pointer opacity-0"
          >
            <option value="name_asc">الاسم (أ-ي)</option>
            <option value="name_desc">الاسم (ي-أ)</option>
          </select>
        </label>
      </div>

      {renderTable("الطلاب (ليس لديهم حساب)", studentsWithoutAccount)}
      {renderTable("الطلاب (لديهم حساب)", studentsWithAccount)}

      <div className="w-full h-[100px] lg:hidden"></div>


    </div>
  );
}
