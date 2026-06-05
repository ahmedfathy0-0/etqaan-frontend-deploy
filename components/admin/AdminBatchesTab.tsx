import { useState } from "react";
import Link from "next/link";

interface Batch {
  id: number;
  name: string;
  schedule_description?: string;
  term?: {
    name: string;
  };
  batch_sheikhs?: Array<{
    sheikh: {
      name: string;
    };
  }>;
}

interface AdminBatchesTabProps {
  batches: Batch[];
  onDeleteConfirm: (batchId: number) => void;
  deleteConfirm: number | null;
  setDeleteConfirm: (id: number | null) => void;
  setShowBatchModal: (show: boolean) => void;
}

export default function AdminBatchesTab({
  batches,
  onDeleteConfirm,
  deleteConfirm,
  setDeleteConfirm,
  setShowBatchModal,
}: AdminBatchesTabProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBatches = batches.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="w-full sm:w-96 relative">
          <input
            type="text"
            placeholder="بحث عن حلقة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-arabic text-gray-900"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>
        </div>
        <button
          onClick={() => setShowBatchModal(true)}
          className="w-full sm:w-auto px-6 py-3 bg-orange-500 text-white rounded-xl font-arabic font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
        >
          <span>+</span>
          إضافة حلقة
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {filteredBatches.map((batch) => (
          <div
            key={batch.id}
            className="border border-gray-100 rounded-xl p-6 hover:shadow-lg transition-shadow relative group"
          >
            <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
              {deleteConfirm === batch.id ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => onDeleteConfirm(batch.id)}
                    className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                  >
                    تأكيد الحذف
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs hover:bg-gray-300"
                  >
                    إلغاء
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setDeleteConfirm(batch.id)}
                  className="text-red-500 hover:text-red-700 p-2 bg-red-50 rounded-lg"
                >
                  🗑️
                </button>
              )}
            </div>

            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-2xl mb-4">
              📚
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 font-arabic">
              {batch.name}
            </h3>
            <div className="space-y-2 text-sm text-gray-600 font-arabic mb-4">
              <p className="flex items-center gap-2">
                <span>📅</span>
                {batch.schedule_description || "لم يحدد الموعد"}
              </p>
              <p className="flex items-center gap-2">
                <span>👨‍🏫</span>
                {batch.batch_sheikhs?.[0]?.sheikh?.name || "لم يعين شيخ"}
              </p>
              <p className="flex items-center gap-2">
                <span>🏷️</span>
                {batch.term?.name || "لم يحدد الفصل"}
              </p>
            </div>
            <Link
              href={`/batches/${batch.id}`}
              className="block w-full py-2 text-center bg-gray-50 hover:bg-orange-50 text-gray-700 hover:text-orange-600 rounded-lg font-arabic font-semibold transition-colors"
            >
              عرض التفاصيل
            </Link>
          </div>
        ))}
        {filteredBatches.length === 0 && (
          <div className="col-span-full p-8 text-center text-gray-500 font-arabic">
            لا توجد حلقات بهذا البحث
          </div>
        )}
      </div>
    </div>
  );
}
