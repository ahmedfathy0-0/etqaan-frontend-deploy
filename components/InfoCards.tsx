import { Calendar01, BookOpen01, Award01, TickDouble01, UserGroup } from "@dga-icons/react/duotone-rounded";

export default function InfoCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 font-cairo">
      {/* Sessions Card */}
      <div className="bg-white rounded-[24px] shadow-[0_2px_10px_5px_rgba(0,10,1,0.15)] overflow-hidden border-[1.5px] border-success-200 hover:border-success-700 hover:-translate-y-1 transition-all duration-300">
        <div className="p-5 bg-success-50 border-b border-success-100 flex items-center justify-center gap-2">
          <Calendar01 aria-hidden="true" size={24} className="text-success-800" />
          <h3 className="text-xl font-bold text-success-900">الجلسات</h3>
        </div>
        <div className="p-6 text-center">
          <p className="mt-2 text-sm text-neutral-500 font-medium mb-4">
            20 أبريل، 2024
          </p>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between bg-neutral-50 p-3 rounded-xl border border-neutral-100">
              <span className="text-neutral-700 font-bold">الحفظ</span>
              <div className="flex items-center gap-1 text-success-700 font-bold bg-success-50 px-3 py-1 rounded-full">
                <TickDouble01 aria-hidden="true" size={16} /> ممتازة
              </div>
            </div>
            <div className="flex items-center justify-between bg-neutral-50 p-3 rounded-xl border border-neutral-100">
              <span className="text-neutral-700 font-bold">الحضور</span>
              <div className="flex items-center gap-1 text-primary-600 font-bold bg-primary-50 px-3 py-1 rounded-full">
                <UserGroup aria-hidden="true" size={16} /> حاضر
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Exams Card */}
      <div className="bg-white rounded-[24px] shadow-[0_2px_10px_5px_rgba(0,10,1,0.15)] overflow-hidden border-[1.5px] border-success-200 hover:border-success-700 hover:-translate-y-1 transition-all duration-300">
        <div className="p-5 bg-warning-50 border-b border-warning-100 flex items-center justify-center gap-2">
          <BookOpen01 aria-hidden="true" size={24} className="text-warning-800" />
          <h3 className="text-xl font-bold text-warning-900">
            الامتحانات
          </h3>
        </div>
        <div className="p-6 text-center flex flex-col justify-between h-full min-h-[180px]">
          <div>
            <p className="mt-2 text-neutral-800 font-bold text-lg">
              سورة البقرة 1-5
            </p>
            <p className="text-neutral-500 font-medium text-sm mt-1">
              5 مايو، 2024
            </p>
          </div>
          <div className="mt-4 flex items-center justify-center">
            <div className="w-20 h-20 bg-success-800 rounded-full flex items-center justify-center text-white border-4 border-success-100 shadow-md">
              <span className="text-3xl font-bold">90</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ranking Card */}
      <div className="bg-white rounded-[24px] shadow-[0_2px_10px_5px_rgba(0,10,1,0.15)] overflow-hidden border-[1.5px] border-success-200 hover:border-success-700 hover:-translate-y-1 transition-all duration-300">
        <div className="p-5 bg-primary-50 border-b border-primary-100 flex items-center justify-center gap-2">
          <Award01 aria-hidden="true" size={24} className="text-primary-800" />
          <h3 className="text-xl font-bold text-primary-900">الترتيب</h3>
        </div>
        <div className="p-6 text-center flex flex-col items-center justify-center h-[180px]">
          <div className="text-warning-500 mb-4 animate-bounce">
            <Award01 aria-hidden="true" size={48} />
          </div>
          <p className="text-neutral-600 font-medium text-sm mb-2">
            ترتيب الدفعة
          </p>
          <p className="text-3xl font-bold text-primary-700 bg-primary-50 px-6 py-2 rounded-xl border border-primary-100">
            الثاني
          </p>
        </div>
      </div>
    </div>
  );
}
