interface Stats {
  totalUsers: number;
  totalStudents: number;
  totalSheikhs: number;
  totalBatches: number;
  totalAdmins: number;
  recentActivity: {
    todayRecords: number;
    weekRecords: number;
  };
}

interface AdminStatsCardsProps {
  stats: Stats;
  onAddUser?: () => void;
  onAddBatch?: () => void;
  onAddStudent?: () => void;
}

export default function AdminStatsCards({ 
  stats,
  onAddUser,
  onAddBatch,
  onAddStudent
}: AdminStatsCardsProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-arabic">
                إجمالي المستخدمين
              </p>
              <h3 className="text-2xl font-bold text-gray-800">
                {stats.totalUsers}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center">
              <span className="text-2xl">👨‍🎓</span>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-arabic">الطلاب</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {stats.totalStudents}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center">
              <span className="text-2xl">👨‍🏫</span>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-arabic">المشايخ</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {stats.totalSheikhs}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-arabic">الحلقات</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {stats.totalBatches}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 font-arabic mb-6 flex items-center gap-2">
            <span>📈</span>
            نشاط التسميع
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500 font-arabic mb-1">
                تسميع اليوم
              </p>
              <p className="text-2xl font-bold text-gray-800">
                {stats.recentActivity.todayRecords}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500 font-arabic mb-1">
                هذا الأسبوع
              </p>
              <p className="text-2xl font-bold text-gray-800">
                {stats.recentActivity.weekRecords}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 font-arabic mb-6 flex items-center gap-2">
            <span>⚡</span>
            إجراءات سريعة
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <button 
              onClick={onAddUser}
              className="p-4 bg-blue-50 text-blue-700 rounded-xl font-arabic font-semibold hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
            >
              <span>+</span>
              مستخدم جديد
            </button>
            <button 
              onClick={onAddBatch}
              className="p-4 bg-emerald-50 text-emerald-700 rounded-xl font-arabic font-semibold hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2"
            >
              <span>+</span>
              حلقة جديدة
            </button>
            <button 
              onClick={onAddStudent}
              className="p-4 bg-purple-50 text-purple-700 rounded-xl font-arabic font-semibold hover:bg-purple-100 transition-colors flex items-center justify-center gap-2"
            >
              <span>+</span>
              طالب جديد
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
