"use client";

import Avatar from "@/components/ui/Avatar";

interface LeaderboardPreviewProps {
  students: {
    id: number;
    name: string;
    points: number;
    avatarIndex?: number;
  }[];
  onViewFull?: () => void;
}

const podiumConfig = [
  {
    position: 1,
    medal: "🥇",
    height: "h-32",
    bg: "from-yellow-400 to-amber-500",
    order: 2,
  },
  {
    position: 2,
    medal: "🥈",
    height: "h-24",
    bg: "from-gray-300 to-gray-400",
    order: 1,
  },
  {
    position: 3,
    medal: "🥉",
    height: "h-20",
    bg: "from-amber-600 to-amber-700",
    order: 3,
  },
];

export default function LeaderboardPreview({
  students,
  onViewFull,
}: LeaderboardPreviewProps) {
  const topThree = students.slice(0, 3);

  return (
    <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full"></div>
        {/* Floating stars */}
        {[...Array(8)].map((_, i) => (
          <span
            key={i}
            className="absolute text-2xl animate-pulse"
            style={{
              top: `${10 + Math.random() * 30}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          >
            ⭐
          </span>
        ))}
      </div>

      {/* Title */}
      <div className="text-center mb-6 relative z-10">
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="text-3xl animate-bounce-gentle">🏆</span>
          <h3 className="text-2xl font-bold text-white font-arabic">
            لوحة الشرف
          </h3>
          <span
            className="text-3xl animate-bounce-gentle"
            style={{ animationDelay: "0.5s" }}
          >
            🏆
          </span>
        </div>
        <p className="text-white/70 font-arabic text-sm">
          أفضل 3 طلاب في الحلقة
        </p>
      </div>

      {/* Podium */}
      <div className="flex items-end justify-center gap-3 relative z-10 mb-6">
        {podiumConfig.map((config) => {
          const student = topThree[config.position - 1];
          if (!student) return null;

          return (
            <div
              key={config.position}
              className="flex flex-col items-center"
              style={{ order: config.order }}
            >
              {/* Avatar */}
              <Avatar 
                name={student.name} 
                className="w-16 h-16 rounded-2xl text-2xl mb-2 transform hover:scale-110 transition-transform" 
              />

              {/* Medal */}
              <span className="text-4xl mb-2">{config.medal}</span>

              {/* Name */}
              <span className="text-white font-arabic font-semibold text-sm mb-2 text-center line-clamp-1 max-w-[80px]">
                {student.name}
              </span>

              {/* Podium block */}
              <div
                className={`w-20 ${config.height} bg-gradient-to-t ${config.bg} rounded-t-xl flex flex-col items-center justify-start pt-2 shadow-lg`}
              >
                <span className="text-white font-bold text-xl">
                  {config.position}
                </span>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-yellow-300 text-sm">⭐</span>
                  <span className="text-white text-xs font-semibold">
                    {student.points}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* View full button */}
    </div>
  );
}
