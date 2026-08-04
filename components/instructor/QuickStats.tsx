import { UserGroup, BookOpen01, Award01, Tv01 } from "@dga-icons/react/duotone-rounded";

export default function QuickStats() {
  const stats = [
    {
      title: "إجمالي الطلاب",
      value: "45",
      icon: <UserGroup aria-hidden="true" size={32} className="text-primary-600" />,
      color: "bg-primary-600",
      bgColor: "bg-primary-50",
      borderColor: "border-primary-200 hover:border-primary-500",
    },
    {
      title: "المحاضرات هذا الأسبوع",
      value: "12",
      icon: <BookOpen01 aria-hidden="true" size={32} className="text-success-600" />,
      color: "bg-success-600",
      bgColor: "bg-success-50",
      borderColor: "border-success-200 hover:border-success-500",
    },
    {
      title: "الطلاب المتفوقون",
      value: "18",
      icon: <Award01 aria-hidden="true" size={32} className="text-warning-600" />,
      color: "bg-warning-500 text-white",
      bgColor: "bg-warning-50",
      borderColor: "border-warning-200 hover:border-warning-500",
    },
    {
      title: "الامتحانات المعلقة",
      value: "7",
      icon: <Tv01 aria-hidden="true" size={32} className="text-danger-600" />,
      color: "bg-danger-600",
      bgColor: "bg-danger-50",
      borderColor: "border-danger-200 hover:border-danger-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 font-cairo">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`bg-white rounded-[24px] p-6 shadow-[0_2px_10px_5px_rgba(0,10,1,0.15)] border-[1.5px] ${stat.borderColor} hover:-translate-y-1 transition-all duration-300`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bgColor}`}>
              {stat.icon}
            </div>
            <div
              className={`min-w-[48px] h-12 px-4 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-md ${stat.color}`}
            >
              {stat.value}
            </div>
          </div>
          <h3 className="text-neutral-700 font-bold text-lg mt-2">
            {stat.title}
          </h3>
        </div>
      ))}
    </div>
  );
}
