import { useState } from "react";
import Link from "next/link";
import { Delete02, Edit02, Filter, Search01 } from "@dga-icons/react/duotone-rounded";

interface Batch {
  id: number;
  name: string;
  schedule_description?: string;
  is_active?: boolean;
  _count?: { batch_students: number };
}

interface AdminBatchesTabProps {
  batches: Batch[];
  onDeleteConfirm: (batchId: number) => void;
  deleteConfirm: number | null;
  setDeleteConfirm: (id: number | null) => void;
  setShowBatchModal: (show: boolean) => void;
  onEditBatch: (batch: Batch) => void;
}

export default function AdminBatchesTab({
  batches,
  onDeleteConfirm,
  deleteConfirm,
  setDeleteConfirm,
  onEditBatch,
}: AdminBatchesTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name_asc");

  const filteredBatches = batches
    .filter((batch) => batch.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "name_desc") return b.name.localeCompare(a.name, "ar");
      if (sortBy === "students_desc") return (b._count?.batch_students || 0) - (a._count?.batch_students || 0);
      if (sortBy === "students_asc") return (a._count?.batch_students || 0) - (b._count?.batch_students || 0);
      return a.name.localeCompare(b.name, "ar");
    });

  return (
    <section className="w-full" dir="rtl">
      <div className="mb-6 flex h-12 w-full items-center gap-4">
        <label className="relative h-12 min-w-0 flex-1">
          <span className="sr-only">البحث عن حلقة</span>
          <input
            type="search"
            placeholder="أبحث عن"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="h-12 w-full rounded-2xl border-[1.5px] border-neutral-800 bg-white py-3 pr-11 pl-3 text-right text-base text-success-900 outline-none placeholder:text-success-900 focus:border-success-800"
          />
          <Search01 aria-hidden="true" size={24} className="absolute right-3 top-1/2 -translate-y-1/2 text-success-800" />
        </label>

        <label className="relative flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center text-neutral-800">
          <span className="sr-only">ترتيب الحلقات</span>
          <Filter aria-hidden="true" size={32} />
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="absolute inset-0 cursor-pointer opacity-0"
          >
            <option value="name_asc">الاسم (أ-ي)</option>
            <option value="name_desc">الاسم (ي-أ)</option>
            <option value="students_desc">عدد الطلاب (الأكثر)</option>
            <option value="students_asc">عدد الطلاب (الأقل)</option>
          </select>
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredBatches.map((batch) => (
          <article
            key={batch.id}
            className="flex min-h-[164px] flex-col gap-5 rounded-2xl bg-white p-4 text-right shadow-[0_2px_10px_5px_rgba(0,10,1,0.25)]"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <h2 className="truncate text-2xl font-bold leading-9 text-success-900">{batch.name}</h2>
                <span
                  className={`h-3.5 w-3.5 shrink-0 rounded-full ${batch.is_active === false ? "bg-neutral-600" : "bg-success-600"}`}
                  aria-label={batch.is_active === false ? "غير نشطة" : "نشطة"}
                />
              </div>

              <div className="flex shrink-0 items-center gap-4" dir="ltr">
                {deleteConfirm === batch.id ? (
                  <div className="flex gap-1 text-xs font-bold" dir="rtl">
                    <button onClick={() => onDeleteConfirm(batch.id)} className="rounded-md bg-danger-700 px-2 py-1 text-white">حذف</button>
                    <button onClick={() => setDeleteConfirm(null)} className="rounded-md bg-neutral-300 px-2 py-1 text-neutral-900">إلغاء</button>
                  </div>
                ) : (
                  <>
                    <button onClick={() => setDeleteConfirm(batch.id)} aria-label={`حذف ${batch.name}`} className="text-danger-700 hover:text-danger-800">
                      <Delete02 aria-hidden="true" size={24} />
                    </button>
                    <button onClick={() => onEditBatch(batch)} aria-label={`تعديل ${batch.name}`} className="text-neutral-800 hover:text-success-700">
                      <Edit02 aria-hidden="true" size={24} />
                    </button>
                  </>
                )}
              </div>
            </div>

            <p className="truncate text-base leading-6 text-neutral-800">
              {batch.schedule_description || `${batch._count?.batch_students || 0} طالب`}
            </p>

            <Link
              href={`/batches/${batch.id}`}
              className="mt-auto flex h-10 w-full items-center justify-center rounded-2xl border-2 border-success-700 text-lg font-bold text-success-900 transition-colors hover:bg-success-100"
            >
              عرض التفاصيل
            </Link>
          </article>
        ))}
      </div>

      {filteredBatches.length === 0 && (
        <div className="py-16 text-center text-neutral-700">لا توجد حلقات بهذا البحث</div>
      )}
    </section>
  );
}
