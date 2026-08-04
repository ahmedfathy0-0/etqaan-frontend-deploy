import React, { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import MultiSearchableSelect from "@/components/ui/MultiSearchableSelect";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateBatch, useUpdateBatch } from "@/queries/useBatches";
import { FloppyDisk } from "@dga-icons/react/duotone-rounded";

interface AdminBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  editBatchId: number | null;
  initialData?: {
    name: string;
    schedule_description: string;
    term_id: number;
    sheikh_ids: number[];
  };
  users: any[];
}

export default function AdminBatchModal({
  isOpen,
  onClose,
  editBatchId,
  initialData,
  users,
}: AdminBatchModalProps) {
  const { token } = useAuth();
  const { mutateAsync: createBatchMutate } = useCreateBatch();
  const { mutateAsync: updateBatchMutate } = useUpdateBatch();

  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [newBatch, setNewBatch] = useState({
    name: "",
    schedule_description: "",
    term_id: 1,
    sheikh_ids: [] as number[],
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setNewBatch({
          name: initialData.name,
          schedule_description: initialData.schedule_description || "",
          term_id: initialData.term_id || 1,
          sheikh_ids: initialData.sheikh_ids || [],
        });
      } else {
        setNewBatch({
          name: "",
          schedule_description: "",
          term_id: 1,
          sheikh_ids: [],
        });
      }
      setFormError("");
    }
  }, [isOpen, initialData]);

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setFormLoading(true);
    setFormError("");

    try {
      if (editBatchId) {
        await updateBatchMutate({ batchId: editBatchId, data: newBatch });
      } else {
        await createBatchMutate(newBatch);
      }
      onClose();
    } catch (err: any) {
      console.error("Error saving batch:", err);
      setFormError(err.response?.data?.message || "حدث خطأ أثناء حفظ الحلقة");
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
      <form onSubmit={handleCreateBatch} className="flex flex-col items-center gap-[32px] w-full font-cairo">
        {/* Frame 1 */}
        <div className="flex flex-col items-end gap-[16px] w-full max-w-[398px]">
          {formError && (
            <div className="w-full bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl font-arabic text-sm text-right">
              {formError}
            </div>
          )}

          {/* text fieled */}
          <div className="flex flex-col items-end gap-[12px] w-full">
            <label className="text-right text-[#17481B] font-medium text-[16px] leading-[150%] w-full">أسم الحلقة</label>
            <input
              type="text"
              value={newBatch.name}
              onChange={(e) => setNewBatch({ ...newBatch, name: e.target.value })}
              className="box-border flex flex-row items-center p-[8px] gap-[8px] w-full h-[48px] border border-[#A3C3D7] rounded-[8px] focus:outline-none focus:border-[#17481B] text-[#79817A] bg-white placeholder:text-[#79817A] text-[14px] text-right leading-[150%] font-medium"
              placeholder="حلقة المستوى الثاني"
              required
            />
          </div>

          {/* text fieled */}
          <div className="flex flex-col items-end gap-[12px] w-full">
            <label className="text-right text-[#17481B] font-medium text-[16px] leading-[150%] w-full">أسم الشيخ / المعلمة</label>
            <div className="w-full relative">
              <MultiSearchableSelect
                options={users
                  .filter((u) => ["sheikh", "admin", "super_admin"].includes(u.role))
                  .map((u) => ({ id: u.id, label: u.name }))}
                value={newBatch.sheikh_ids}
                onChange={(val) =>
                  setNewBatch({ ...newBatch, sheikh_ids: val as number[] })
                }
                placeholder="الشيخ حمزة"
                className="mb-1"
              />
              {newBatch.sheikh_ids.length > 0 && (
                <p className="text-[12px] text-emerald-600 mt-1 text-right font-arabic">
                  تم اختيار {newBatch.sheikh_ids.length} شيخ
                </p>
              )}
            </div>
          </div>

          {/* text fieled */}
          <div className="flex flex-col items-end gap-[12px] w-full">
            <label className="text-right text-[#17481B] font-medium text-[16px] leading-[150%] w-full">موعد الحلقة</label>
            <input
              type="text"
              value={newBatch.schedule_description}
              onChange={(e) =>
                setNewBatch({ ...newBatch, schedule_description: e.target.value })
              }
              className="box-border flex flex-row items-center p-[8px] gap-[8px] w-full h-[48px] border border-[#A3C3D7] rounded-[8px] focus:outline-none focus:border-[#17481B] text-[#79817A] bg-white placeholder:text-[#79817A] text-[14px] text-right leading-[150%] font-medium"
              placeholder="السبت والإثنين: بعد صلاة المغرب"
            />
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
             {formLoading ? "جاري الحفظ..." : "حفظ الحلقة"}
          </span>
        </button>
      </form>
    </Modal>
  );
}
