import Modal from "@/components/ui/Modal";
import MultiSearchableSelect from "@/components/ui/MultiSearchableSelect";

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
}: AddStudentModalProps) {
  const options = availableStudents.map((s) => ({
    id: s.id,
    label: s.full_name + (s.guardian_name ? ` (${s.guardian_name})` : ""),
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={null}
      maxWidth="max-w-[430px]"
      overflowVisible={true}
    >
      <div className="flex flex-col gap-6 w-full font-cairo">
        <div className="flex flex-col gap-4 w-full">
          {formError && (
            <div className="w-full bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl font-arabic text-sm text-right">
              {formError}
            </div>
          )}

          <div className="flex flex-col gap-2 w-full">
            <label className="text-right text-success-800 font-bold text-lg w-full">
              اختر الطلاب ({selectedStudentIds.length})
            </label>
            <div className="w-full relative">
              <MultiSearchableSelect
                options={options}
                value={selectedStudentIds}
                onChange={(val) => setSelectedStudentIds(val as number[])}
                placeholder="ابحث عن اسم الطالب..."
                className="mb-1 [&>div]:!h-12 [&>div]:!border-2 [&>div]:!border-success-200 [&>div]:!rounded-xl focus:[&>div]:!border-success-700 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-3 w-full mt-2">
          <button
            onClick={onEnroll}
            disabled={selectedStudentIds.length === 0 || formLoading}
            className="flex-1 flex flex-row justify-center items-center gap-2 h-14 bg-success-800 hover:bg-success-900 rounded-2xl transition-colors disabled:opacity-50"
          >
            <span className="font-bold text-lg text-white">
              {formLoading ? "جاري الإضافة..." : `إضافة ${selectedStudentIds.length} طالب`}
            </span>
          </button>
          
          <button
            onClick={onClose}
            className="flex-1 flex flex-row justify-center items-center h-14 bg-neutral-100 hover:bg-neutral-200 border-2 border-neutral-200 rounded-2xl transition-colors"
          >
            <span className="font-bold text-lg text-neutral-700">
              إلغاء
            </span>
          </button>
        </div>
      </div>
    </Modal>
  );
}
