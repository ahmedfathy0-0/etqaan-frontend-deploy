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
      <form onSubmit={handleCreateBatch} className="flex flex-col gap-6 w-full font-cairo">
        {/* Frame 1 */}
        <div className="flex flex-col gap-4 w-full">
          {formError && (
            <div className="w-full bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl font-arabic text-sm text-right">
              {formError}
            </div>
          )}

          {/* text fieled */}
          <div className="flex flex-col gap-2 w-full">
            <label className="text-right text-success-800 font-bold text-lg w-full">أسم الحلقة</label>
            <input
              type="text"
              value={newBatch.name}
              onChange={(e) => setNewBatch({ ...newBatch, name: e.target.value })}
              className="w-full h-12 px-4 border-2 border-success-200 rounded-xl focus:outline-none focus:border-success-700 focus:ring-1 focus:ring-success-700 text-neutral-800 bg-white placeholder:text-neutral-500 text-base font-medium text-right transition-all"
              placeholder="حلقة المستوى الثاني"
              required
            />
          </div>

          {/* text fieled */}
          <div className="flex flex-col gap-2 w-full">
            <label className="text-right text-success-800 font-bold text-lg w-full">أسم الشيخ / المعلمة</label>
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
                className="mb-1 [&>div]:!h-12 [&>div]:!border-2 [&>div]:!border-success-200 [&>div]:!rounded-xl focus:[&>div]:!border-success-700 transition-all"
              />
              {newBatch.sheikh_ids.length > 0 && (
                <p className="text-sm text-success-600 mt-1 text-right font-arabic">
                  تم اختيار {newBatch.sheikh_ids.length} شيخ
                </p>
              )}
            </div>
          </div>

          {/* text fieled */}
          <div className="flex flex-col gap-2 w-full">
            <label className="text-right text-success-800 font-bold text-lg w-full">موعد الحلقة</label>
            <input
              type="text"
              value={newBatch.schedule_description}
              onChange={(e) =>
                setNewBatch({ ...newBatch, schedule_description: e.target.value })
              }
              className="w-full h-12 px-4 border-2 border-success-200 rounded-xl focus:outline-none focus:border-success-700 focus:ring-1 focus:ring-success-700 text-neutral-800 bg-white placeholder:text-neutral-500 text-base font-medium text-right transition-all"
              placeholder="السبت والإثنين: بعد صلاة المغرب"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-row gap-3 w-full mt-2">
          <button
            type="submit"
            className="flex-1 flex flex-row justify-center items-center gap-2 h-14 bg-success-800 hover:bg-success-900 rounded-2xl transition-colors disabled:opacity-50"
            disabled={formLoading}
          >
            <FloppyDisk aria-hidden="true" size={24} className="text-white" />
            <span className="font-bold text-lg text-white">
               {formLoading ? "جاري الحفظ..." : "حفظ الحلقة"}
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
