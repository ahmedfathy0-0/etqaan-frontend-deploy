import React, { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateStudent, useUpdateStudent } from "@/queries/useStudents";
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

  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [newStudent, setNewStudent] = useState({
    full_name: "",
    guardian_name: "",
    guardian_phone: "",
    gender: "male" as "male" | "female",
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setNewStudent({
          full_name: initialData.full_name,
          guardian_name: initialData.guardian_name || "",
          guardian_phone: initialData.guardian_phone || "",
          gender: initialData.gender || "male",
        });
      } else {
        setNewStudent({
          full_name: "",
          guardian_name: "",
          guardian_phone: "",
          gender: "male",
        });
      }
      setFormError("");
    }
  }, [isOpen, initialData]);

  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setFormLoading(true);
    setFormError("");

    try {
      if (editStudentId) {
        await updateStudentMutate({ id: editStudentId, data: newStudent });
      } else {
        await createStudentMutate(newStudent);
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
      <form onSubmit={handleSaveStudent} className="flex flex-col items-center gap-[32px] w-full font-cairo">
        {/* Frame 1 */}
        <div className="flex flex-col items-end gap-[16px] w-full max-w-[398px]">
          {formError && (
            <div className="w-full bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl font-arabic text-sm text-right">
              {formError}
            </div>
          )}

          <div className="flex flex-col items-end gap-[12px] w-full">
            <label className="text-right text-[#17481B] font-medium text-[16px] leading-[150%] w-full">اسم الطالب</label>
            <input
              type="text"
              value={newStudent.full_name}
              onChange={(e) =>
                setNewStudent({ ...newStudent, full_name: e.target.value })
              }
              className="box-border flex flex-row items-center p-[8px] gap-[8px] w-full h-[48px] border border-[#A3C3D7] rounded-[8px] focus:outline-none focus:border-[#17481B] text-[#79817A] bg-white placeholder:text-[#79817A] text-[14px] text-right leading-[150%] font-medium"
              placeholder="مثال: أحمد محمد"
              required
            />
          </div>

          <div className="flex flex-col items-end gap-[12px] w-full">
            <label className="text-right text-[#17481B] font-medium text-[16px] leading-[150%] w-full">اسم ولي الأمر</label>
            <input
              type="text"
              value={newStudent.guardian_name}
              onChange={(e) =>
                setNewStudent({ ...newStudent, guardian_name: e.target.value })
              }
              className="box-border flex flex-row items-center p-[8px] gap-[8px] w-full h-[48px] border border-[#A3C3D7] rounded-[8px] focus:outline-none focus:border-[#17481B] text-[#79817A] bg-white placeholder:text-[#79817A] text-[14px] text-right leading-[150%] font-medium"
              placeholder="مثال: محمد علي"
            />
          </div>

          <div className="flex flex-col items-end gap-[12px] w-full">
            <label className="text-right text-[#17481B] font-medium text-[16px] leading-[150%] w-full">رقم هاتف ولي الأمر</label>
            <input
              type="text"
              value={newStudent.guardian_phone}
              onChange={(e) =>
                setNewStudent({ ...newStudent, guardian_phone: e.target.value })
              }
              className="box-border flex flex-row items-center p-[8px] gap-[8px] w-full h-[48px] border border-[#A3C3D7] rounded-[8px] focus:outline-none focus:border-[#17481B] text-[#79817A] bg-white placeholder:text-[#79817A] text-[14px] text-right leading-[150%] font-medium"
              placeholder="0500000000"
              dir="ltr"
            />
          </div>

          <div className="flex flex-col items-end gap-[12px] w-full">
            <label className="text-right text-[#17481B] font-medium text-[16px] leading-[150%] w-full">الجنس</label>
            <div className="w-full relative">
              <select
                value={newStudent.gender}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, gender: e.target.value as "male" | "female" })
                }
                className="box-border flex flex-row items-center p-[8px] gap-[8px] w-full h-[48px] border border-[#A3C3D7] rounded-[8px] focus:outline-none focus:border-[#17481B] text-[#79817A] bg-white text-[14px] text-right leading-[150%] font-medium appearance-none"
                dir="rtl"
              >
                <option value="male">ذكر</option>
                <option value="female">أنثى</option>
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
             {formLoading ? "جاري الحفظ..." : "حفظ الطالب"}
          </span>
        </button>
      </form>
    </Modal>
  );
}
