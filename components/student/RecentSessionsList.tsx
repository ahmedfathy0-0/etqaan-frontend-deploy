interface RecentSession {
  id: number;
  date: string;
  attendance: string;
  jadeed_grade?: string;
  muraja_grade?: string;
}

interface RecentSessionsListProps {
  sessions: RecentSession[];
}

export default function RecentSessionsList({ sessions }: RecentSessionsListProps) {
  const getAttendanceStyle = (attendance: string) => {
    switch (attendance) {
      case "حاضر":
        return "bg-green-100 text-green-700";
      case "غائب":
        return "bg-red-100 text-red-700";
      case "متأخر":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h2 className="text-xl font-bold text-gray-800 font-arabic mb-4 flex items-center gap-2">
        <span>📅</span>
        آخر الجلسات
      </h2>

      <div className="space-y-3">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-arabic text-gray-800 font-semibold">
                {new Date(session.date).toLocaleDateString("ar-EG", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-arabic ${getAttendanceStyle(
                  session.attendance,
                )}`}
              >
                {session.attendance}
              </span>
            </div>
            <div className="flex gap-4 text-sm text-gray-600 font-arabic">
              {session.jadeed_grade && (
                <span>
                  الحفظ: <span className="font-semibold">{session.jadeed_grade}</span>
                </span>
              )}
              {session.muraja_grade && (
                <span>
                  المراجعة: <span className="font-semibold">{session.muraja_grade}</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
