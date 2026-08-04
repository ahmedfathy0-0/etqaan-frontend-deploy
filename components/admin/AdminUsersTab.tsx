import { useState } from "react";
import { SearchBar } from "@/components/ui/SearchBar";
import { Delete01, Edit01, Filter, UserAdd01, UserGroup } from "@dga-icons/react/duotone-rounded";

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

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex flex-col items-center p-0 lg:py-[24px] lg:px-[16px] gap-[24px] w-full max-w-full mx-auto" dir="rtl">
      
      {/* Mobile Title / Tags Section */}
      <div className="lg:hidden w-full flex flex-col items-end px-4 pb-8 pt-6 bg-[#17481B] mb-6 gap-6">
        <div className="flex w-full items-center justify-between">
          <span className="text-[#FFFFFF] font-cairo font-bold text-[18px]">المستخدمين</span>
        </div>
        <div className="flex flex-row items-center">
          <div className="flex flex-row justify-center items-center py-[8px] px-[16px] gap-[10px] bg-[#E2F7E4] rounded-[48px] mb-4">
            <svg className="hidden" width="24" height="18" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path opacity="0.4" d="M7.83398 11.8613C10.23 10.3798 13.27 10.3798 15.666 11.8613C16.6878 12.4931 19.3671 13.7831 17.7354 15.3975C16.9383 16.186 16.0506 16.7499 14.9346 16.75H8.56543C7.44942 16.7499 6.56168 16.186 5.76465 15.3975C4.13295 13.7831 6.81221 12.4931 7.83398 11.8613ZM5.75 2.75C7.13071 2.75 8.25 3.86929 8.25 5.25C8.25 6.63071 7.13071 7.75 5.75 7.75C4.36929 7.75 3.25 6.63071 3.25 5.25C3.25 3.86929 4.36929 2.75 5.75 2.75ZM17.75 2.75C19.1307 2.75 20.25 3.86929 20.25 5.25C20.25 6.63071 19.1307 7.75 17.75 7.75C16.3693 7.75 15.25 6.63071 15.25 5.25C15.25 3.86929 16.3693 2.75 17.75 2.75Z" fill="#17481B"/>
              <path d="M7.4393 11.2236C10.077 9.59277 13.4237 9.59264 16.0614 11.2236C16.139 11.2716 16.2376 11.3295 16.3504 11.3955C16.8627 11.6953 17.6765 12.1714 18.2313 12.7354C18.5795 13.0895 18.9266 13.5723 18.9901 14.1738C19.0579 14.8178 18.7849 15.4147 18.2635 15.9307C17.402 16.783 16.3337 17.4999 14.9344 17.5H8.56625C7.16691 17.5 6.09874 16.783 5.23715 15.9307C4.71572 15.4147 4.44279 14.8179 4.51059 14.1738C4.57407 13.572 4.92192 13.0895 5.27035 12.7354C5.82519 12.1715 6.63802 11.6952 7.15024 11.3955C7.26305 11.3295 7.36168 11.2716 7.4393 11.2236ZM15.2723 12.499C13.1181 11.167 10.3826 11.1671 8.22836 12.499C8.09918 12.5789 7.96013 12.6609 7.81723 12.7451C7.30554 13.0468 6.73783 13.3825 6.33969 13.7871C6.0948 14.036 6.01381 14.2175 6.0018 14.3311C5.99427 14.4026 5.99852 14.5731 6.29281 14.8643C7.02524 15.5888 7.73362 16 8.56625 16H14.9344C15.7669 15.9999 16.4755 15.5888 17.2079 14.8643C17.5019 14.5733 17.5064 14.4026 17.4989 14.3311C17.4869 14.2175 17.4065 14.0358 17.162 13.7871C16.7638 13.3824 16.1952 13.0469 15.6834 12.7451C15.5405 12.6608 15.4015 12.5789 15.2723 12.499ZM4.68246 9.00293C5.09486 8.96579 5.4596 9.27019 5.49692 9.68262C5.53411 10.095 5.22961 10.4597 4.81723 10.4971C4.17706 10.555 3.53248 10.8024 2.94223 11.2568C2.84714 11.3301 2.74782 11.4024 2.64828 11.4756C2.30879 11.7251 1.95998 11.9825 1.71078 12.2979C1.56281 12.4852 1.50923 12.6262 1.50082 12.7256C1.49449 12.8014 1.50578 12.9348 1.67758 13.1465C2.17277 13.7566 2.57608 13.9998 2.97543 14C3.38957 14.0001 3.72543 14.3358 3.72543 14.75C3.72543 15.1642 3.38957 15.4999 2.97543 15.5C1.8767 15.4998 1.08828 14.7999 0.513518 14.0918C0.137961 13.6291 -0.0374849 13.1212 0.00668181 12.5986C0.0489058 12.1 0.282717 11.6851 0.533049 11.3682C0.924922 10.8721 1.50678 10.449 1.8475 10.2012C1.91923 10.149 1.98085 10.104 2.02719 10.0684C2.83142 9.44913 3.74404 9.08783 4.68246 9.00293ZM18.8172 9.00293C19.7556 9.08786 20.6683 9.44913 21.4725 10.0684C21.5189 10.1041 21.5805 10.149 21.6522 10.2012C21.9929 10.4491 22.5748 10.8721 22.9666 11.3682C23.217 11.6851 23.4508 12.1 23.493 12.5986C23.5372 13.1211 23.3617 13.6291 22.9862 14.0918C22.4114 14.7999 21.623 15.4998 20.5243 15.5C20.11 15.5 19.7743 15.1642 19.7743 14.75C19.7743 14.3358 20.11 14 20.5243 14C20.9236 13.9998 21.3269 13.7566 21.8221 13.1465C21.9939 12.9348 22.0052 12.8014 21.9989 12.7256C21.9905 12.6262 21.9368 12.4851 21.7889 12.2979C21.5397 11.9825 21.1909 11.7251 20.8514 11.4756C20.7519 11.4024 20.6526 11.3301 20.5575 11.2568C19.9672 10.8023 19.3226 10.5551 18.6825 10.4971C18.27 10.4598 17.9656 10.0951 18.0028 9.68262C18.0401 9.27016 18.4048 8.96573 18.8172 9.00293ZM5.24985 2C5.66399 2.00008 5.99985 2.33584 5.99985 2.75C5.99985 3.16416 5.66399 3.49992 5.24985 3.5C4.28337 3.50002 3.49985 4.28352 3.49985 5.25C3.49985 6.21648 4.28337 6.99998 5.24985 7C5.66399 7.00008 5.99985 7.33584 5.99985 7.75C5.99985 8.16416 5.66399 8.49992 5.24985 8.5C3.45494 8.49998 1.99985 7.04491 1.99985 5.25C1.99985 3.45509 3.45494 2.00002 5.24985 2ZM11.7498 0C14.0969 0.000228001 15.9998 1.90293 15.9998 4.25C15.9998 6.59707 14.0969 8.49977 11.7498 8.5C9.40283 8.49977 7.49985 6.59707 7.49985 4.25C7.49985 1.90293 9.40283 0.00022805 11.7498 0ZM17.7498 2C19.5447 2.00008 20.9998 3.45513 20.9998 5.25C20.9998 7.04487 19.5447 8.49992 17.7498 8.5C17.3356 8.5 16.9998 8.16421 16.9998 7.75C16.9998 7.33579 17.3356 7 17.7498 7C18.7163 6.99992 19.4998 6.21645 19.4998 5.25C19.4998 4.28355 18.7163 3.50008 17.7498 3.5C17.3356 3.5 16.9998 3.16421 16.9998 2.75C16.9998 2.33579 17.3356 2 17.7498 2ZM11.7498 1.5C10.2313 1.50023 8.99985 2.73136 8.99985 4.25C8.99985 5.76864 10.2313 6.99977 11.7498 7C13.2684 6.99977 14.4998 5.76864 14.4998 4.25C14.4998 2.73136 13.2684 1.50023 11.7498 1.5Z" fill="#17481B"/>
            </svg>
            <UserGroup aria-hidden="true" size={24} color="#17481B" />
            <span className="font-cairo font-normal text-[14px] leading-[150%] text-[#17481B] text-right">{users.length} مستخدم</span>
          </div>
        </div>
      </div>

      {/* Search Bar Container */}
      <div className="flex flex-row items-center px-[16px] gap-[16px] w-full lg:w-[850px] h-[48px]">
        {/* filter icon */}
        <button className="w-[48px] h-[48px] flex-shrink-0 cursor-pointer flex items-center justify-center bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors">
          <svg className="hidden" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.4" d="M11.8099 16.6748C8.49201 14.1942 6.12752 11.4655 4.83645 9.93155C4.43679 9.4567 4.30584 9.10919 4.2271 8.49707C3.95749 6.40107 3.82268 5.35307 4.43727 4.67654C5.05186 4 6.13872 4 8.31243 4H23.6876C25.8613 4 26.9481 4 27.5627 4.67654C28.1773 5.35307 28.0425 6.40107 27.7729 8.49707C27.6942 9.10921 27.5632 9.45672 27.1635 9.93156C25.8707 11.4675 23.5014 14.2009 20.1768 16.6847C19.876 16.9094 19.6777 17.2756 19.6409 17.6819C19.3116 21.3226 19.0079 23.3168 18.8188 24.3256C18.5137 25.9543 16.2042 26.9341 14.968 27.8085C14.2321 28.3288 13.3391 27.7093 13.2437 26.9037C13.0619 25.3682 12.7195 22.2485 12.3457 17.6819C12.3121 17.2719 12.1131 16.9014 11.8099 16.6748Z" fill="#404641"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M8.24284 2.99707C8.26595 2.99707 8.28914 2.99707 8.31241 2.99707L23.7571 2.99707C24.7845 2.99703 25.6567 2.99699 26.3449 3.09081C27.0733 3.19012 27.7697 3.41429 28.3029 4.0012C28.8407 4.59325 28.988 5.30675 28.9993 6.0361C29.0098 6.71725 28.9009 7.56337 28.774 8.54988L28.7647 8.62173C28.7198 8.97084 28.6525 9.30849 28.512 9.64655C28.3694 9.98978 28.1731 10.2821 27.9285 10.5726C26.6223 12.1245 24.1939 14.9289 20.7752 17.4829C20.7199 17.5242 20.6502 17.6222 20.6369 17.7691C20.3047 21.4396 20.0125 23.3817 19.8017 24.5068C19.5737 25.7235 18.6457 26.5656 17.8455 27.1454C17.4268 27.4488 16.9823 27.722 16.5864 27.9629C16.5547 27.9823 16.5233 28.0013 16.4924 28.0202C16.1225 28.245 15.8081 28.4362 15.5453 28.622C14.8247 29.1316 13.9932 29.0959 13.3577 28.7256C12.758 28.3763 12.3359 27.7391 12.2506 27.0184C12.0633 25.4365 11.7238 22.3396 11.349 17.7605C11.337 17.6136 11.314 17.571 11.3121 17.5675C11.3108 17.565 11.3074 17.5588 11.2962 17.5465C11.2837 17.5327 11.2587 17.5083 11.2111 17.4728C7.79936 14.922 5.37576 12.1224 4.07134 10.5726C3.82774 10.2831 3.62561 9.99775 3.4815 9.6507C3.34041 9.31096 3.28026 8.97159 3.23525 8.62173C3.23216 8.5977 3.22908 8.57374 3.22601 8.54987C3.09905 7.56336 2.99016 6.71724 3.00071 6.0361C3.012 5.30675 3.15923 4.59325 3.69707 4.0012C4.23025 3.41429 4.9267 3.19012 5.65507 3.09081C6.34321 2.99699 7.21542 2.99703 8.24284 2.99707ZM5.92525 5.07247C5.41312 5.1423 5.25885 5.2564 5.17743 5.34602C5.10068 5.4305 5.00802 5.57927 5.00047 6.06706C4.99243 6.58657 5.08016 7.28789 5.21891 8.36657C5.25747 8.66631 5.29124 8.79379 5.32857 8.88369C5.36287 8.96628 5.42364 9.07336 5.60151 9.2847C6.87923 10.8028 9.18462 13.4605 12.4087 15.871C12.6677 16.0646 12.9054 16.3044 13.0773 16.6272C13.2467 16.9453 13.3161 17.2762 13.3423 17.5974C13.7151 22.1515 14.0522 25.2243 14.2367 26.7832C14.2424 26.8308 14.2597 26.8777 14.2863 26.9185C14.3136 26.9603 14.3438 26.9855 14.3644 26.9975C14.3671 26.999 14.3694 27.0003 14.3714 27.0012C14.3761 26.9987 14.3825 26.9948 14.3906 26.989C14.7135 26.7608 15.0881 26.5331 15.4418 26.3182C15.477 26.2968 15.512 26.2756 15.5467 26.2544C15.9451 26.012 16.3261 25.7764 16.672 25.5258C17.4011 24.9975 17.7587 24.5505 17.8359 24.1385C18.0312 23.0961 18.3163 21.2212 18.645 17.5888C18.7052 16.9233 19.032 16.2888 19.5782 15.8807C22.8089 13.4671 25.119 10.8047 26.3984 9.28466C26.5536 9.10033 26.6226 8.98148 26.6651 8.87921C26.7097 8.77177 26.7472 8.6296 26.781 8.36657C26.9198 7.28789 27.0075 6.58657 26.9995 6.06706C26.9919 5.57927 26.8993 5.4305 26.8225 5.34602C26.7411 5.2564 26.5868 5.1423 26.0747 5.07247C25.5378 4.99927 24.8036 4.99707 23.6875 4.99707H8.31241C7.19635 4.99707 6.46214 4.99927 5.92525 5.07247ZM14.3609 27.0059C14.3609 27.0058 14.3616 27.0056 14.3628 27.0053L14.3609 27.0059Z" fill="#404641"/>
          </svg>
          <Filter aria-hidden="true" size={32} color="#404641" />
        </button>

        {/* search input */}
        <div className="w-full lg:w-[770px]">
          <SearchBar 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="أبحث عن مستخدم"
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

      {/* Mobile Floating Action Button - Quick Actions Area */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full h-[88px] bg-[#F5F7F5] shadow-[0px_-2px_30px_4px_rgba(0,0,0,0.15)] rounded-t-[16px] flex flex-row items-center justify-center p-[8px_16px] gap-[8px] z-30">
        <button
          onClick={() => setShowUserModal(true)}
          className="flex flex-row justify-center items-center py-[8px] px-[16px] gap-[16px] w-full max-w-[448px] h-[56px] bg-[#B17C08] rounded-[16px]"
        >
          <UserAdd01 aria-hidden="true" size={24} color="#FEFFFF" />
          <span className="font-cairo font-bold text-[16px] leading-[150%] text-[#FBFFFC]">إضافة مستخدم</span>
        </button>
      </div>
    </div>
  );
}
