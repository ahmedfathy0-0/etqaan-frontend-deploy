import React, { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateUser, useUpdateUser } from "@/queries/useUsers";
import { ArrowDown01, Dice, FloppyDisk } from "@dga-icons/react/duotone-rounded";

interface AdminUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  editUserId: number | null;
  initialData?: {
    name: string;
    email: string;
    password?: string;
    role: string;
  };
}

export default function AdminUserModal({
  isOpen,
  onClose,
  editUserId,
  initialData,
}: AdminUserModalProps) {
  const { user, token } = useAuth();
  const { mutateAsync: createUserMutate } = useCreateUser();
  const { mutateAsync: updateUserMutate } = useUpdateUser();

  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "student", // Changing default to student to match screenshot
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setNewUser({
          name: initialData.name,
          email: initialData.email,
          password: initialData.password || "",
          role: initialData.role || "student",
        });
      } else {
        setNewUser({ name: "", email: "", password: "", role: "student" });
      }
      setFormError("");
    }
  }, [isOpen, initialData]);

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let pass = "";
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewUser({ ...newUser, password: pass });
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setFormLoading(true);
    setFormError("");

    try {
      if (editUserId) {
        const dataToUpdate = { ...newUser };
        if (!dataToUpdate.password) {
          delete (dataToUpdate as any).password;
        }
        await updateUserMutate({ id: editUserId, data: dataToUpdate });
      } else {
        await createUserMutate(newUser);
      }
      onClose();
    } catch (err: any) {
      console.error("Error saving user:", err);
      setFormError(err.response?.data?.message || "حدث خطأ أثناء حفظ المستخدم");
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
      <form onSubmit={handleCreateUser} className="flex flex-col items-center gap-[32px] w-full font-cairo">
        {/* Frame 1 */}
        <div className="flex flex-col items-end gap-[16px] w-full max-w-[398px]">
          {formError && (
            <div className="w-full bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl font-arabic text-sm text-right">
              {formError}
            </div>
          )}

          <div className="flex flex-col items-end gap-[12px] w-full">
            <label className="text-right text-[#17481B] font-medium text-[16px] leading-[150%] w-full">أسم المستخدم</label>
            <input
              type="text"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="box-border flex flex-row items-center p-[8px] gap-[8px] w-full h-[48px] border border-[#A3C3D7] rounded-[8px] focus:outline-none focus:border-[#17481B] text-[#79817A] bg-white placeholder:text-[#79817A] text-[14px] text-right leading-[150%] font-medium"
              placeholder="محمد عمرو"
              required
            />
          </div>

          <div className="flex flex-col items-end gap-[12px] w-full">
            <label className="text-right text-[#17481B] font-medium text-[16px] leading-[150%] w-full">البريد الإلكتروني</label>
            <input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="box-border flex flex-row items-center p-[8px] gap-[8px] w-full h-[48px] border border-[#A3C3D7] rounded-[8px] focus:outline-none focus:border-[#17481B] text-[#79817A] bg-white placeholder:text-[#79817A] text-[14px] text-right leading-[150%] font-medium"
              placeholder="Example@gmail.com"
              dir="rtl"
              required
            />
          </div>

          <div className="flex flex-col items-end gap-[12px] w-full">
            <label className="text-right text-[#17481B] font-medium text-[16px] leading-[150%] w-full">
              كلمة المرور
            </label>
            <div className="flex flex-row w-full gap-2">
              <input
                type="text"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="box-border flex-1 flex flex-row items-center p-[8px] gap-[8px] h-[48px] border border-[#A3C3D7] rounded-[8px] focus:outline-none focus:border-[#17481B] text-[#79817A] bg-white placeholder:text-[#79817A] text-[14px] text-right leading-[150%] font-medium"
                placeholder="********"
                dir="rtl"
                required={!editUserId}
              />
              <button
                type="button"
                onClick={generatePassword}
                className="h-[48px] px-4 bg-gray-100 hover:bg-gray-200 rounded-[8px] transition-colors"
                title="إنشاء كلمة مرور عشوائية"
              >
                <Dice aria-hidden="true" size={24} />
              </button>
            </div>
          </div>

          <div className="flex flex-col items-end gap-[12px] w-full">
            <label className="text-right text-[#17481B] font-medium text-[16px] leading-[150%] w-full">دور المستخدم</label>
            <div className="w-full relative">
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                className="box-border flex flex-row items-center p-[8px] gap-[8px] w-full h-[48px] border border-[#A3C3D7] rounded-[8px] focus:outline-none focus:border-[#17481B] text-[#79817A] bg-white text-[14px] text-right leading-[150%] font-medium appearance-none"
                dir="rtl"
              >
                {user?.role === "super_admin" && (
                  <option value="super_admin">مدير عام</option>
                )}
                <option value="admin">مدير</option>
                <option value="sheikh">شيخ / معلمة</option>
                <option value="student">طالب</option>
              </select>
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <ArrowDown01 aria-hidden="true" size={24} color="#79817A" />
              </div>
            </div>
          </div>
        </div>

        {/* Button */}
        <button
          type="submit"
          className="flex flex-row justify-center items-center py-[8px] px-[4px] gap-[16px] w-full max-w-[398px] h-[56px] bg-[#17481B] rounded-[16px] transition-colors disabled:opacity-50"
          disabled={formLoading}
        >
          <FloppyDisk aria-hidden="true" size={24} color="#E2F7E4" />
          <span className="font-bold text-[18px] text-[#FBFFFC] leading-[150%]">
             {formLoading ? "جاري الحفظ..." : "حفظ المستخدم"}
          </span>
        </button>
      </form>
    </Modal>
  );
}
