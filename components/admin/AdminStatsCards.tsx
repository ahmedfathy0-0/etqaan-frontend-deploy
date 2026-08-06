import type { AdminStats } from "@/api/admin";
import { LiveStreaming01, Muslim, Students, Tv01, UserGroup } from "@dga-icons/react/duotone-rounded";

const statIcons = {
  users: UserGroup,
  students: Students,
  sheikhs: Muslim,
  batches: Tv01,
};

function StatCard({ label, value, tone, icon, iconColor }: { label: string; value: number; tone: string; icon: keyof typeof statIcons; iconColor: string }) {
  const Icon = statIcons[icon];
  return (
    <article dir="rtl" className={`flex h-[118px] flex-col items-center justify-center gap-2 rounded-2xl p-4 text-right shadow-[0_2px_10px_5px_rgba(0,10,1,0.25)] lg:h-[134px] lg:items-stretch lg:px-4 lg:py-6 ${tone}`}>
      <div className="flex w-full items-center justify-center gap-2 lg:justify-start">
        <Icon aria-hidden="true" size={36} color={iconColor} className="h-7 w-7 lg:h-9 lg:w-9" />
        <h2 className="text-xl font-bold leading-8 lg:leading-9 lg:text-2xl text-success-900">{label}</h2>
      </div>
      <p className="w-full text-center text-2xl lg:text-[28px] leading-relaxed lg:leading-[42px] text-neutral-800">{value}</p>
    </article>
  );
}

function ActivityItem({ label, value, live = false }: { label: string; value: number; live?: boolean }) {
  return (
    <div dir="rtl" className="flex h-[134px] flex-col items-center justify-center gap-6 rounded-xl bg-[#FAFAFA] px-2 py-4 text-right lg:flex-1 lg:items-stretch">
      <div className="flex w-full items-center justify-center gap-2 lg:justify-start">
        {live && <span className="h-[14px] w-[14px] rounded-full bg-success-600" aria-label="نشط الآن" />}
        <h3 className="text-center text-xl lg:text-2xl font-bold leading-8 lg:leading-9 text-success-900 lg:text-right">{label}</h3>
      </div>
      <p className="text-center text-2xl lg:text-[28px] leading-relaxed lg:leading-[42px] text-neutral-800">{value}</p>
    </div>
  );
}

export default function AdminStatsCards({ stats }: { stats: AdminStats }) {
  return (
    <div dir="rtl" className="flex w-full flex-col gap-8 text-right lg:grid lg:grid-cols-2 lg:gap-x-6 lg:gap-y-8">
      <StatCard label="عدد المستخدمين" value={stats.totalUsers} tone="bg-success-100" icon="users" iconColor="#4FB057" />
      <StatCard label="عدد الطلاب" value={stats.totalStudents} tone="bg-warning-100" icon="students" iconColor="#B17C08" />
      <StatCard label="عدد المشايخ" value={stats.totalSheikhs} tone="bg-primary-100" icon="sheikhs" iconColor="#338AB3" />
      <StatCard label="عدد الحلقات" value={stats.totalBatches} tone="bg-danger-100" icon="batches" iconColor="#BB3535" />

      <section dir="rtl" className="flex w-full flex-col gap-4 rounded-2xl bg-white px-4 py-6 text-right shadow-[0_2px_10px_5px_rgba(0,10,1,0.25)] lg:col-span-2 lg:gap-6">
        <div className="flex w-full items-center justify-center gap-2 lg:justify-start">
          <LiveStreaming01 aria-hidden="true" size={36} color="#A7B0A8" className="h-7 w-7 lg:h-9 lg:w-9" />
          <h2 className="text-xl lg:text-2xl font-bold leading-8 lg:leading-9 text-success-900">نشاط التسميع</h2>
        </div>
        <div className="flex flex-col gap-4 lg:flex-row">
          <ActivityItem label="تسميع الاسبوع" value={stats.recentActivity.weekRecords} />
          <ActivityItem label="تسميع اليوم" value={stats.recentActivity.todayRecords} />
          <ActivityItem label="تسميع الآن" value={0} live />
        </div>
      </section>
    </div>
  );
}
