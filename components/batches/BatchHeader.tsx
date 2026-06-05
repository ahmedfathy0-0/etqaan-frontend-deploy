interface BatchHeaderProps {
  name: string;
  scheduleDescription?: string;
  headSheikhName?: string;
  studentsCount: number;
}

export default function BatchHeader({
  name,
  scheduleDescription,
  headSheikhName,
  studentsCount,
}: BatchHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-6 mb-8 relative overflow-hidden text-white">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full"></div>

      <div className="relative z-10">
        <h1 className="text-3xl md:text-4xl font-bold font-arabic mb-4">
          {name}
        </h1>

        <div className="flex flex-wrap gap-4">
          {scheduleDescription && (
            <span className="bg-white/20 px-4 py-2 rounded-full font-arabic flex items-center gap-2">
              <span>📅</span>
              {scheduleDescription}
            </span>
          )}
          {headSheikhName && (
            <span className="bg-white/20 px-4 py-2 rounded-full font-arabic flex items-center gap-2">
              <span>👨‍🏫</span>
              الشيخ {headSheikhName}
            </span>
          )}
          <span className="bg-white/20 px-4 py-2 rounded-full font-arabic flex items-center gap-2">
            <span>👨‍🎓</span>
            {studentsCount} طالب
          </span>
        </div>
      </div>
    </div>
  );
}
