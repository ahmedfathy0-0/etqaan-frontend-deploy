interface BatchStatsProps {
  studentsCount: number;
  highestScore: number;
  averageScore: number;
}

export default function BatchStats({
  studentsCount,
  highestScore,
  averageScore,
}: BatchStatsProps) {
  return (
    <div className="bg-white rounded-2xl p-6 mt-6 shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 font-arabic mb-4 flex items-center gap-2">
        <span>📊</span>
        إحصائيات الحلقة
      </h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
          <span className="text-gray-600 font-arabic">إجمالي الطلاب</span>
          <span className="font-bold text-gray-800">{studentsCount}</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl">
          <span className="text-gray-600 font-arabic">أعلى نقاط</span>
          <span className="font-bold text-yellow-600 flex items-center gap-1">
            <span>⭐</span>
            {highestScore}
          </span>
        </div>
        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
          <span className="text-gray-600 font-arabic">متوسط النقاط</span>
          <span className="font-bold text-purple-600">{averageScore}</span>
        </div>
      </div>
    </div>
  );
}
