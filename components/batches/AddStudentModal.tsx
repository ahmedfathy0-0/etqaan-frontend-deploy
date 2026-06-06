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
      title="👨‍🎓 إضافة طالب للحلقة"
      headerColorClass="bg-gradient-to-r from-blue-600 to-purple-600"
      overflowVisible={true}
    >
      <div className="space-y-4">
        {formError && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl font-arabic text-sm">
            {formError}
          </div>
        )}

        <div>
          <label className="block font-arabic text-gray-700 mb-2">
            اختر الطلاب ({selectedStudentIds.length})
          </label>
          <MultiSearchableSelect
            options={options}
            value={selectedStudentIds}
            onChange={(val) => setSelectedStudentIds(val as number[])}
            placeholder="ابحث عن اسم الطالب..."
            className="mb-1"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={onEnroll}
            disabled={selectedStudentIds.length === 0 || formLoading}
            className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-arabic font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all"
          >
            {formLoading
              ? "جاري الإضافة..."
              : `إضافة ${selectedStudentIds.length} طالب`}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-arabic hover:bg-gray-200 transition-colors"
          >
            إلغاء
          </button>
        </div>
      </div>
    </Modal>
  );
}
