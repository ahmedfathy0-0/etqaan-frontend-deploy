interface StudentStatsCardsProps {
  totalPoints: number;
  myRank: number;
  batchesCount: number;
}

export default function StudentStatsCards({
  totalPoints,
  myRank,
  batchesCount,
}: StudentStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-yellow-100">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center">
            <span className="text-3xl">⭐</span>
          </div>
          <div>
            <p className="text-gray-500 font-arabic text-sm">نقاطي</p>
            <p className="text-3xl font-bold text-gray-800">{totalPoints}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-100">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
            <span className="text-3xl">🏆</span>
          </div>
          <div>
            <p className="text-gray-500 font-arabic text-sm">ترتيبي</p>
            <p className="text-3xl font-bold text-gray-800">#{myRank}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-green-100">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
            <span className="text-3xl">📚</span>
          </div>
          <div>
            <p className="text-gray-500 font-arabic text-sm">حلقاتي</p>
            <p className="text-3xl font-bold text-gray-800">{batchesCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
