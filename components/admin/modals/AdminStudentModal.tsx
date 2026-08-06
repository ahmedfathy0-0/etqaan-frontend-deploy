import React, { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateStudent, useUpdateStudent } from "@/queries/useStudents";
import { useCreateUser, useUpdateUser, useDeleteUser } from "@/queries/useUsers";
import { ArrowDown01, FloppyDisk } from "@dga-icons/react/duotone-rounded";

interface AdminStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  editStudentId: number | null;
  initialData?: {
    full_name: string;
    guardian_name: string;
    guardian_phone: string;
    gender: "male" | "female";
    user_id?: number | null;
    email?: string;
    password?: string;
  };
}

export default function AdminStudentModal({
  isOpen,
  onClose,
  editStudentId,
  initialData,
}: AdminStudentModalProps) {
  const { token } = useAuth();
  const { mutateAsync: createStudentMutate } = useCreateStudent();
  const { mutateAsync: updateStudentMutate } = useUpdateStudent();
  
  const { mutateAsync: createUserMutate } = useCreateUser();
  const { mutateAsync: updateUserMutate } = useUpdateUser();
  const { mutateAsync: deleteUserMutate } = useDeleteUser();

  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [hasAccount, setHasAccount] = useState(false);
  const [newStudent, setNewStudent] = useState({
    full_name: "",
    guardian_name: "",
    guardian_phone: "",
    gender: "male" as "male" | "female",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setNewStudent({
          full_name: initialData.full_name,
          guardian_name: initialData.guardian_name || "",
          guardian_phone: initialData.guardian_phone || "",
          gender: initialData.gender || "male",
          email: initialData.email || "",
          password: initialData.password || "",
        });
        setHasAccount(!!initialData.user_id);
      } else {
        setNewStudent({
          full_name: "",
          guardian_name: "",
          guardian_phone: "",
          gender: "male",
          email: "",
          password: "",
        });
        setHasAccount(false);
      }
      setFormError("");
    }
  }, [isOpen, initialData]);

  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (hasAccount && !newStudent.email) {
      setFormError("يجب إدخال البريد الإلكتروني للحساب");
      return;
    }

    if (hasAccount && !editStudentId && !newStudent.password) {
      setFormError("يجب إدخال كلمة المرور للحساب الجديد");
      return;
    }
    
    if (hasAccount && !initialData?.user_id && !newStudent.password) {
      setFormError("يجب إدخال كلمة المرور للحساب الجديد");
      return;
    }

    setFormLoading(true);
    setFormError("");

    try {
      if (editStudentId) {
        let finalUserId = initialData?.user_id || null;

        // User unlinked the account
        if (initialData?.user_id && !hasAccount) {
          // 1. Update student to remove user_id connection
          await updateStudentMutate({ 
            id: editStudentId, 
            data: { user_id: null } as any
          });
          // 2. Delete the user
          await deleteUserMutate(initialData.user_id);
          finalUserId = null;
        }
        // User created a new account for this student
        else if (!initialData?.user_id && hasAccount) {
          const newUser = await createUserMutate({
            name: newStudent.full_name,
            email: newStudent.email,
            password: newStudent.password,
            role: "student"
          });
          finalUserId = newUser.id;
        }
        // User updated an existing account
        else if (initialData?.user_id && hasAccount) {
          await updateUserMutate({
            id: initialData.user_id,
            data: {
              name: newStudent.full_name,
              email: newStudent.email,
              ...(newStudent.password ? { password: newStudent.password } : {}),
            }
          });
        }

        // Final student update
        await updateStudentMutate({ 
          id: editStudentId, 
          data: {
            full_name: newStudent.full_name,
            guardian_name: newStudent.guardian_name,
            guardian_phone: newStudent.guardian_phone,
            gender: newStudent.gender,
            ...(finalUserId !== (initialData?.user_id || null) ? { user_id: finalUserId } : {})
          } as any
        });
      } else {
        // Creating entirely new student
        let finalUserId = null;
        if (hasAccount) {
          const newUser = await createUserMutate({
            name: newStudent.full_name,
            email: newStudent.email,
            password: newStudent.password,
            role: "student"
          });
          finalUserId = newUser.id;
        }
        await createStudentMutate({
          full_name: newStudent.full_name,
          guardian_name: newStudent.guardian_name,
          guardian_phone: newStudent.guardian_phone,
          gender: newStudent.gender,
          ...(finalUserId ? { user_id: finalUserId } : {})
        } as any);
      }
      
      onClose();
    } catch (err: any) {
      console.error("Error saving student:", err);
      setFormError(err.response?.data?.message || "حدث خطأ أثناء حفظ الطالب");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={null}
      maxWidth="max-w-[430px]"
      overflowVisible={true}
    >
      <form onSubmit={handleSaveStudent} className="flex flex-col gap-6 w-full font-cairo">
        <div className="flex flex-col gap-4 w-full max-h-[60vh] overflow-y-auto px-1">
          {formError && (
            <div className="w-full bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl font-arabic text-sm text-right">
              {formError}
            </div>
          )}

          <div className="flex flex-col gap-2 w-full">
            <label className="text-right text-success-800 font-bold text-lg w-full">اسم الطالب</label>
            <input
              type="text"
              value={newStudent.full_name}
              onChange={(e) =>
                setNewStudent({ ...newStudent, full_name: e.target.value })
              }
              className="w-full h-12 px-4 border-2 border-success-200 rounded-xl focus:outline-none focus:border-success-700 focus:ring-1 focus:ring-success-700 text-neutral-800 bg-white placeholder:text-neutral-500 text-base font-medium text-right transition-all"
              placeholder="مثال: أحمد محمد"
              required
            />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <label className="text-right text-success-800 font-bold text-lg w-full">اسم ولي الأمر (اختياري)</label>
            <input
              type="text"
              value={newStudent.guardian_name}
              onChange={(e) =>
                setNewStudent({ ...newStudent, guardian_name: e.target.value })
              }
              className="w-full h-12 px-4 border-2 border-success-200 rounded-xl focus:outline-none focus:border-success-700 focus:ring-1 focus:ring-success-700 text-neutral-800 bg-white placeholder:text-neutral-500 text-base font-medium text-right transition-all"
              placeholder="مثال: محمد علي"
            />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <label className="text-right text-success-800 font-bold text-lg w-full">رقم هاتف ولي الأمر (اختياري)</label>
            <input
              type="text"
              value={newStudent.guardian_phone}
              onChange={(e) =>
                setNewStudent({ ...newStudent, guardian_phone: e.target.value })
              }
              className="w-full h-12 px-4 border-2 border-success-200 rounded-xl focus:outline-none focus:border-success-700 focus:ring-1 focus:ring-success-700 text-neutral-800 bg-white placeholder:text-neutral-500 text-base font-medium text-right transition-all"
              placeholder="0500000000"
              dir="ltr"
            />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <label className="text-right text-success-800 font-bold text-lg w-full">الجنس</label>
            <div className="w-full relative">
              <select
                value={newStudent.gender}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, gender: e.target.value as "male" | "female" })
                }
                className="w-full h-12 px-4 pl-10 border-2 border-success-200 rounded-xl focus:outline-none focus:border-success-700 focus:ring-1 focus:ring-success-700 text-neutral-800 bg-white text-base font-medium text-right appearance-none transition-all"
                dir="rtl"
              >
                <option value="male">ذكر</option>
                <option value="female">أنثى</option>
              </select>
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <ArrowDown01 aria-hidden="true" size={20} className="text-neutral-500" />
              </div>
            </div>
          </div>

          <div className="flex flex-row items-center justify-start gap-3 w-full mt-2 pt-4 border-t border-success-100">
            <input 
              type="checkbox" 
              id="hasAccountToggle"
              checked={hasAccount}
              onChange={(e) => setHasAccount(e.target.checked)}
              className="w-5 h-5 accent-success-700 cursor-pointer"
            />
            <label htmlFor="hasAccountToggle" className="text-right text-success-800 font-bold text-lg cursor-pointer select-none">
              ربط/إنشاء حساب للمنصة لهذا الطالب
            </label>
          </div>

          {hasAccount && (
            <div className="flex flex-col gap-4 bg-success-50 p-4 rounded-xl border border-success-100 mt-2">
              <div className="flex flex-col gap-2 w-full">
                <label className="text-right text-success-800 font-bold text-[15px] w-full">البريد الإلكتروني للحساب</label>
                <input
                  type="email"
                  value={newStudent.email}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, email: e.target.value })
                  }
                  className="w-full h-11 px-4 border border-success-200 rounded-lg focus:outline-none focus:border-success-700 focus:ring-1 focus:ring-success-700 text-neutral-800 bg-white placeholder:text-neutral-400 text-sm font-medium text-right transition-all"
                  dir="ltr"
                  placeholder="student@example.com"
                />
              </div>

              <div className="flex flex-col gap-2 w-full">
                <label className="text-right text-success-800 font-bold text-[15px] w-full">كلمة المرور للحساب</label>
                <input
                  type="text"
                  value={newStudent.password}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, password: e.target.value })
                  }
                  className="w-full h-11 px-4 border border-success-200 rounded-lg focus:outline-none focus:border-success-700 focus:ring-1 focus:ring-success-700 text-neutral-800 bg-white placeholder:text-neutral-400 text-sm font-medium text-right transition-all"
                  placeholder={initialData?.user_id ? "أدخل كلمة مرور جديدة للتغيير (اتركه فارغاً للإبقاء)" : "أدخل كلمة مرور للحساب الجديد"}
                  dir="ltr"
                />
              </div>
            </div>
          )}

        </div>

        <div className="flex flex-row gap-3 w-full mt-2">
          <button
            type="submit"
            className="flex-1 flex flex-row justify-center items-center gap-2 h-14 bg-success-800 hover:bg-success-900 rounded-2xl transition-colors disabled:opacity-50"
            disabled={formLoading}
          >
            <FloppyDisk aria-hidden="true" size={24} className="text-white" />
            <span className="font-bold text-lg text-white">
               {formLoading ? "جاري الحفظ..." : "حفظ الطالب"}
            </span>
          </button>
          
          <button
            type="button"
            onClick={onClose}
            className="flex-1 flex flex-row justify-center items-center h-14 bg-neutral-100 hover:bg-neutral-200 border-2 border-neutral-200 rounded-2xl transition-colors"
          >
            <span className="font-bold text-lg text-neutral-700">
              إلغاء
            </span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
