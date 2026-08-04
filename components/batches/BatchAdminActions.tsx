import Link from "next/link";

interface BatchAdminActionsProps {
  batchId: string | number;
  onAddStudentClick: () => void;
  onAddSessionClick: () => void;
}

export default function BatchAdminActions({
  batchId,
  onAddStudentClick,
  onAddSessionClick,
}: BatchAdminActionsProps) {
  return (
    <div className="bg-white rounded-2xl p-4 mb-8 shadow-lg">
      <h3 className="text-lg font-bold text-gray-800 font-arabic mb-4 flex items-center gap-2">
        <span>⚙️</span>
        إدارة الحلقة
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={onAddStudentClick}
          className="flex items-center justify-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-arabic transition-colors"
        >
          <span className="text-2xl">👨‍🎓</span>
          إضافة طالب
        </button>
        <Link
          href={`/batches/exams?batchId=${batchId}`}
          className="flex items-center justify-center gap-2 p-4 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-xl font-arabic transition-colors"
        >
          <span className="text-2xl">📝</span>
          إدارة الامتحانات
        </Link>
        <button
          onClick={onAddSessionClick}
          className="flex items-center justify-center gap-2 p-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl font-arabic transition-colors"
        >
          <span className="text-2xl">📋</span>
          تسجيل الحضور
        </button>
      </div>
    </div>
  );
}
