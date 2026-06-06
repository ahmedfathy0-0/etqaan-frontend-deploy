"use client";

import Avatar from "@/components/ui/Avatar";

interface StudentCardProps {
  id: number;
  name: string;
  avatarIndex?: number;
  points: number;
  rank?: number;
  onClick?: () => void;
}

// Get rank decoration
function getRankDecoration(rank?: number) {
  if (!rank) return null;
  switch (rank) {
    case 1:
      return {
        emoji: "🥇",
        label: "الأول",
        color: "from-yellow-400 to-amber-500",
      };
    case 2:
      return {
        emoji: "🥈",
        label: "الثاني",
        color: "from-gray-300 to-gray-400",
      };
    case 3:
      return {
        emoji: "🥉",
        label: "الثالث",
        color: "from-amber-600 to-amber-700",
      };
    default:
      return null;
  }
}

export default function StudentCard({
  id,
  name,
  avatarIndex,
  points,
  rank,
  onClick,
}: StudentCardProps) {
  const rankDeco = getRankDecoration(rank);

  return (
    <div
      onClick={onClick}
      className="group relative bg-white rounded-2xl p-4 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] cursor-pointer border-2 border-gray-100 hover:border-purple-200"
    >
      {/* Rank badge */}
      {rankDeco && (
        <div
          className={`absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br ${rankDeco.color} rounded-full flex items-center justify-center shadow-lg z-10 animate-bounce-gentle`}
        >
          <span className="text-2xl">{rankDeco.emoji}</span>
        </div>
      )}

      <div className="flex items-center gap-4">
        {/* Avatar */}
        <Avatar 
          name={name} 
          className="w-16 h-16 rounded-2xl text-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" 
        />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-gray-800 font-arabic text-lg truncate group-hover:text-purple-700 transition-colors">
            {name}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-yellow-500 text-lg">⭐</span>
            <span className="text-gray-600 font-arabic font-semibold">
              {points} نقطة
            </span>
          </div>
        </div>

        {/* Action indicator */}
        <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center group-hover:bg-purple-100 transition-colors">
          <span className="text-purple-500 text-xl group-hover:scale-125 transition-transform">
            👀
          </span>
        </div>
      </div>

      {/* Hover glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400/0 via-purple-400/10 to-purple-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
}
