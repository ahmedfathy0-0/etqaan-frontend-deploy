import { useState } from "react";
import { SearchBar } from "@/components/ui/SearchBar";
import { Delete01, Edit01, Filter, UserAdd01, UserGroup, Search01 } from "@dga-icons/react/duotone-rounded";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

interface AdminUsersTabProps {
  users: User[];
  onDeleteConfirm: (userId: number) => void;
  deleteConfirm: number | null;
  setDeleteConfirm: (id: number | null) => void;
  setShowUserModal: (show: boolean) => void;
  onEditUser: (user: User) => void;
}

export default function AdminUsersTab({
  users,
  onDeleteConfirm,
  deleteConfirm,
  setDeleteConfirm,
  setShowUserModal,
  onEditUser,
}: AdminUsersTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name_asc");

  const filteredUsers = users
    .filter(
      (u) =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "name_desc") return b.name.localeCompare(a.name, "ar");
      if (sortBy === "role_asc") return a.role.localeCompare(b.role, "ar");
      if (sortBy === "role_desc") return b.role.localeCompare(a.role, "ar");
      return a.name.localeCompare(b.name, "ar");
    });

  return (
    <div className="flex flex-col items-center p-0 lg:py-[24px] lg:px-[16px] gap-[24px] w-full max-w-full mx-auto" dir="rtl">
      
      {/* Mobile Tags Section */}
      <div className="lg:hidden w-full flex flex-row items-center justify-start px-4 mb-2 gap-2">
        <div className="flex flex-row items-center py-1.5 px-3 gap-2 bg-[#E2F7E4] rounded-full">
          <UserGroup aria-hidden="true" size={20} color="#17481B" />
          <span className="font-cairo font-bold text-sm text-[#17481B]">{users.length} مستخدم</span>
        </div>
      </div>

      <div className="mb-6 flex h-12 w-full items-center gap-4 px-4 lg:px-0">
        <label className="relative h-12 min-w-0 flex-1">
          <span className="sr-only">البحث عن مستخدم</span>
          <input
            type="search"
            placeholder="أبحث عن مستخدم"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="h-12 w-full rounded-2xl border-[1.5px] border-neutral-800 bg-white py-3 pr-11 pl-3 text-right text-base text-success-900 outline-none placeholder:text-success-900 focus:border-success-800"
          />
          <Search01 aria-hidden="true" size={24} className="absolute right-3 top-1/2 -translate-y-1/2 text-success-800" />
        </label>

        <label className="relative flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center text-neutral-800">
          <span className="sr-only">ترتيب المستخدمين</span>
          <Filter aria-hidden="true" size={32} />
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="absolute inset-0 cursor-pointer opacity-0"
          >
            <option value="name_asc">الاسم (أ-ي)</option>
            <option value="name_desc">الاسم (ي-أ)</option>
            <option value="role_asc">الدور (أ-ي)</option>
            <option value="role_desc">الدور (ي-أ)</option>
          </select>
        </label>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:flex flex-col items-end p-0 w-full overflow-x-auto border border-gray-200 rounded-[16px] overflow-hidden shadow-sm">
        <div className="min-w-[700px] w-full flex flex-col">
          {/* Header Row */}
          <div className="flex flex-row justify-center items-center py-[16px] px-0 gap-[16px] w-full bg-[#308337] min-h-[68px]">
            <div className="flex-1 text-center font-cairo font-bold text-[24px] leading-[150%] text-[#FBFFFC]">
              الأسم
            </div>
            <div className="w-[295px] text-center font-cairo font-bold text-[24px] leading-[150%] text-[#FBFFFC]">
              البريد الإلكتروني
            </div>
            <div className="w-[150px] text-center font-cairo font-bold text-[24px] leading-[150%] text-[#FBFFFC]">
              كلمة المرور
            </div>
            <div className="flex-1 text-center font-cairo font-bold text-[24px] leading-[150%] text-[#FBFFFC]">
              الدور
            </div>
            <div className="flex-1 text-center font-cairo font-bold text-[24px] leading-[150%] text-[#FBFFFC]">
              الإجراءات
            </div>
          </div>

          {/* Rows */}
          {filteredUsers.map((user, index) => (
            <div 
              key={user.id} 
              className={`flex flex-row justify-center items-center py-[16px] px-0 gap-[16px] w-full ${index % 2 === 0 ? "bg-[#FFFFFF]" : "bg-[#E3E6E3]"}`}
            >
              {/* Name */}
              <div className="flex-1 text-center font-cairo font-bold text-[18px] leading-[150%] text-[#000000] break-words">
                {user.name}
              </div>

              {/* Email */}
              <div className="w-[295px] text-center font-cairo font-bold text-[18px] leading-[150%] text-[#000000] break-words">
                {user.email}
              </div>

              {/* Password */}
              <div className="w-[150px] text-center font-cairo font-bold text-[18px] leading-[150%] text-[#000000]">
                ********
              </div>

              {/* Role */}
              <div className="flex-1 flex justify-center items-center">
                <div className={`flex flex-row justify-center items-center py-[8px] px-[16px] gap-[10px] w-[72px] h-[37px] rounded-[48px] ${
                  user.role === "admin" || user.role === "super_admin"
                    ? "bg-[#D9EEF7]" 
                    : user.role === "sheikh"
                      ? "bg-[#F7EACF]"
                      : "bg-[#E2F7E4]"
                  }`}>
                  <span className={`font-cairo font-normal text-[14px] leading-[150%] text-center whitespace-nowrap ${
                    user.role === "admin" || user.role === "super_admin"
                      ? "text-[#00354E]"
                      : user.role === "sheikh"
                        ? "text-[#4A3200]"
                        : "text-[#17481B]"
                    }`}>
                    {user.role === "admin"
                      ? "مشرف"
                      : user.role === "super_admin"
                        ? "مدير عام"
                        : user.role === "sheikh"
                          ? "شيخ"
                          : "طالب"}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex-1 flex flex-row justify-center items-center gap-[16px]">
                {deleteConfirm === user.id ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => onDeleteConfirm(user.id)}
                      className="px-2 py-1 bg-red-600 text-white rounded text-xs font-bold hover:bg-red-700"
                    >
                      تأكيد
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="px-2 py-1 bg-gray-400 text-white rounded text-xs font-bold hover:bg-gray-500"
                    >
                      إلغاء
                    </button>
                  </div>
                ) : (
                  <>
                    <button onClick={() => onEditUser(user)} className="flex justify-center items-center w-[24px] h-[24px]">
                      <Edit01 aria-hidden="true" size={24} color="#035D86" />
                    </button>
                    <button onClick={() => setDeleteConfirm(user.id)} disabled={user.role === "super_admin"} className="flex justify-center items-center w-[24px] h-[24px] disabled:opacity-50">
                      <Delete01 aria-hidden="true" size={24} color="#930404" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}

          {filteredUsers.length === 0 && (
            <div className="w-full p-8 text-center text-gray-500 font-cairo bg-white">
              لا يوجد مستخدمين بهذا البحث
            </div>
          )}
        </div>
      </div>

      {/* Mobile Cards View */}
      <div className="lg:hidden w-full flex flex-col gap-4 px-4 pb-[100px]">
        {filteredUsers.map((user) => (
          <div key={user.id} className="flex flex-col bg-white border border-[#A3C3D7] rounded-[16px] p-4 gap-4 shadow-sm">
            <div className="flex justify-between items-center w-full">
              <span className="font-cairo font-bold text-[18px] text-[#000000]">
                {user.name}
              </span>
              <div className={`flex flex-row justify-center items-center py-[4px] px-[12px] gap-[10px] rounded-[48px] ${
                  user.role === "admin" || user.role === "super_admin"
                    ? "bg-[#D9EEF7]" 
                    : user.role === "sheikh"
                      ? "bg-[#F7EACF]"
                      : "bg-[#E2F7E4]"
                  }`}>
                  <span className={`font-cairo font-normal text-[12px] text-center ${
                    user.role === "admin" || user.role === "super_admin"
                      ? "text-[#00354E]"
                      : user.role === "sheikh"
                        ? "text-[#4A3200]"
                        : "text-[#17481B]"
                    }`}>
                    {user.role === "admin"
                      ? "مشرف"
                      : user.role === "super_admin"
                        ? "مدير عام"
                        : user.role === "sheikh"
                          ? "شيخ"
                          : "طالب"}
                  </span>
              </div>
            </div>

            <div className="flex flex-col gap-1 w-full text-right">
              <span className="font-cairo text-[#79817A] text-[14px]">{user.email}</span>
            </div>

            <div className="flex justify-end gap-4 mt-2 pt-4 border-t border-gray-100">
               {deleteConfirm === user.id ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => onDeleteConfirm(user.id)}
                      className="px-4 py-1.5 bg-red-600 text-white rounded-[8px] font-cairo font-bold text-[14px]"
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
                    <button onClick={() => onEditUser(user)} className="flex items-center gap-2 px-3 py-1.5 rounded-[8px] bg-blue-50 text-[#035D86] font-cairo text-[14px] font-bold">
                       <Edit01 aria-hidden="true" size={18} />
                      تعديل
                    </button>
                    <button onClick={() => setDeleteConfirm(user.id)} disabled={user.role === "super_admin"} className="flex items-center gap-2 px-3 py-1.5 rounded-[8px] bg-red-50 text-[#930404] font-cairo text-[14px] font-bold disabled:opacity-50">
                       <Delete01 aria-hidden="true" size={18} />
                      حذف
                    </button>
                  </>
                )}
            </div>
          </div>
        ))}

        {filteredUsers.length === 0 && (
          <div className="w-full p-8 text-center text-gray-500 font-cairo bg-white rounded-2xl">
            لا يوجد مستخدمين بهذا البحث
          </div>
        )}
      </div>


    </div>
  );
}
