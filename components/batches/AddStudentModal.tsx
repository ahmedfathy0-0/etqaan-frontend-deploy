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
      <div className="flex flex-col items-center gap-[32px] w-full font-cairo">
        <div className="flex flex-col items-end gap-[16px] w-full max-w-[398px]">
          {formError && (
            <div className="w-full bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl font-arabic text-sm text-right">
              {formError}
            </div>
          )}

          <div className="flex flex-col items-end gap-[12px] w-full">
            <label className="text-right text-[#17481B] font-medium text-[24px] leading-[150%] w-full">
              اختر الطلاب ({selectedStudentIds.length})
            </label>
            <div className="w-full relative">
              <MultiSearchableSelect
                options={options}
                value={selectedStudentIds}
                onChange={(val) => setSelectedStudentIds(val as number[])}
                placeholder="ابحث عن اسم الطالب..."
                className="mb-1"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full max-w-[398px]">
          <button
            onClick={onEnroll}
            disabled={selectedStudentIds.length === 0 || formLoading}
            className="flex flex-row justify-center items-center py-[8px] px-[4px] gap-[16px] w-full h-[56px] bg-[#17481B] rounded-[16px] transition-colors disabled:opacity-50"
          >
            <span className="font-bold text-[18px] text-[#FBFFFC] leading-[150%]">
              {formLoading ? "جاري الإضافة..." : `إضافة ${selectedStudentIds.length} طالب`}
            </span>
          </button>
          <button
            onClick={onClose}
            className="flex flex-row justify-center items-center py-[8px] px-[4px] gap-[16px] w-full h-[56px] bg-gray-100 rounded-[16px] transition-colors"
          >
            <span className="font-bold text-[18px] text-gray-700 leading-[150%]">
              إلغاء
            </span>
          </button>
        </div>
      </div>
    </Modal>
  );
}
