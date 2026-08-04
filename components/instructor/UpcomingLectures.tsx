"use client";

import { useState, useMemo } from "react";
import { Calendar01, Time02, UserGroup, BookOpen01, Home01, Book02 } from "@dga-icons/react/duotone-rounded";

export default function UpcomingLectures() {
  const [selectedFilter, setSelectedFilter] = useState("اليوم");

  // Dynamic lecture data with weekly recurring patterns
  const lectureTemplates = [
    {
      id: 1,
      title: "سورة البقرة (1-20)",
      dayOfWeek: 0, // Sunday
      time: "9:00 ص - 10:30 ص",
      students: 15,
      level: "متوسط",
      room: "قاعة 1",
      recurring: true,
    },
    {
      id: 2,
      title: "أحكام التجويد - النون الساكنة",
      dayOfWeek: 1, // Monday
      time: "11:00 ص - 12:30 م",
      students: 12,
      level: "متقدم",
      room: "قاعة 2",
      recurring: true,
    },
    {
      id: 3,
      title: "جزء عم - مراجعة",
      dayOfWeek: 2, // Tuesday
      time: "2:00 م - 3:30 م",
      students: 20,
      level: "مبتدئ",
      room: "قاعة 3",
      recurring: true,
    },
    {
      id: 4,
      title: "سورة آل عمران (1-50)",
      dayOfWeek: 3, // Wednesday
      time: "9:30 ص - 11:00 ص",
      students: 18,
      level: "متوسط",
      room: "قاعة 1",
      recurring: true,
    },
    {
      id: 5,
      title: "التفسير والمعاني",
      dayOfWeek: 4, // Thursday
      time: "1:00 م - 2:30 م",
      students: 22,
      level: "متقدم",
      room: "قاعة 4",
      recurring: true,
    },
  ];

  const dayNames = [
    "الأحد",
    "الاثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
  ];

  // Generate lectures for current week
  const generateWeeklyLectures = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const lectures: Array<{
      id: number;
      title: string;
      dayOfWeek: number;
      time: string;
      students: number;
      level: string;
      room: string;
      recurring: boolean;
      date: Date;
      dateString: string;
      dayName: string;
      status: string;
      isToday: boolean;
      isTomorrow: boolean;
    }> = [];

    lectureTemplates.forEach((template) => {
      const lectureDate = new Date(today);
      const dayDiff = template.dayOfWeek - currentDay;
      lectureDate.setDate(today.getDate() + dayDiff);

      let status = "scheduled";
      if (dayDiff === 0) {
        const now = new Date();
        const [startTime] = template.time.split(" - ");
        const [hours, period] = startTime.split(" ");
        const [hour] = hours.split(":");
        let lectureHour = parseInt(hour);
        if (period === "م" && lectureHour !== 12) lectureHour += 12;

        if (now.getHours() >= lectureHour && now.getHours() < lectureHour + 2) {
          status = "in-progress";
        } else if (now.getHours() > lectureHour + 2) {
          status = "completed";
        }
      } else if (dayDiff < 0) {
        status = "completed";
      }

      lectures.push({
        ...template,
        date: lectureDate,
        dateString: lectureDate.toLocaleDateString("ar-SA"),
        dayName: dayNames[template.dayOfWeek],
        status,
        isToday: dayDiff === 0,
        isTomorrow: dayDiff === 1,
      });
    });

    return lectures.sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const filteredLectures = useMemo(() => {
    const allLectures = generateWeeklyLectures();

    switch (selectedFilter) {
      case "اليوم":
        return allLectures.filter((lecture) => lecture.isToday);
      case "غداً":
        return allLectures.filter((lecture) => lecture.isTomorrow);
      case "هذا الأسبوع":
        return allLectures;
      case "المكتملة":
        return allLectures.filter((lecture) => lecture.status === "completed");
      case "الجارية":
        return allLectures.filter(
          (lecture) => lecture.status === "in-progress",
        );
      default:
        return allLectures;
    }
  }, [selectedFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-primary-50 text-primary-800 border-primary-200";
      case "in-progress":
        return "bg-success-50 text-success-800 border-success-200";
      case "completed":
        return "bg-neutral-50 text-neutral-600 border-neutral-200";
      default:
        return "bg-primary-50 text-primary-800 border-primary-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "scheduled":
        return "مجدولة";
      case "in-progress":
        return "جارية الآن";
      case "completed":
        return "مكتملة";
      default:
        return "مجدولة";
    }
  };

  return (
    <div className="bg-white rounded-[24px] p-6 shadow-[0_2px_10px_5px_rgba(0,10,1,0.15)] border-[1.5px] border-success-200 font-cairo">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <h2 className="text-[28px] font-bold text-success-900 flex items-center gap-3">
          <Calendar01 aria-hidden="true" size={32} className="text-warning-600" />
          المحاضرات القادمة
        </h2>

        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          className="w-full sm:w-auto h-12 bg-white border-[1.5px] border-success-200 rounded-xl px-4 text-neutral-800 focus:ring-1 focus:ring-success-700 focus:border-success-700 transition-all font-bold cursor-pointer"
        >
          <option value="اليوم">
            اليوم ({filteredLectures.filter((l) => l.isToday).length})
          </option>
          <option value="غداً">
            غداً ({filteredLectures.filter((l) => l.isTomorrow).length})
          </option>
          <option value="هذا الأسبوع">
            هذا الأسبوع ({generateWeeklyLectures().length})
          </option>
          <option value="الجارية">
            الجارية (
            {
              generateWeeklyLectures().filter((l) => l.status === "in-progress")
                .length
            }
            )
          </option>
          <option value="المكتملة">
            المكتملة (
            {
              generateWeeklyLectures().filter((l) => l.status === "completed")
                .length
            }
            )
          </option>
        </select>
      </div>

      {filteredLectures.length === 0 ? (
        <div className="text-center py-12 bg-success-50 rounded-2xl border-[1.5px] border-dashed border-success-200">
          <div className="text-success-300 mb-4 flex justify-center">
            <Book02 aria-hidden="true" size={64} />
          </div>
          <p className="text-xl font-bold text-success-900">
            لا توجد محاضرات {selectedFilter === "اليوم" ? "اليوم" : "في هذا التصنيف"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLectures.map((lecture) => (
            <div
              key={`${lecture.id}-${lecture.dateString}`}
              className={`border-[1.5px] rounded-2xl p-5 transition-all duration-300 hover:shadow-lg ${
                lecture.isToday
                  ? "border-success-300 bg-success-50"
                  : "border-success-200 bg-white hover:border-success-500"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-xl font-bold text-success-900 mb-1">
                    {lecture.title}
                  </h3>
                  <p className="text-neutral-500 font-medium">
                    {lecture.dayName} - {lecture.dateString}
                  </p>
                </div>
                <span
                  className={`px-4 py-2 rounded-xl border font-bold text-sm w-fit ${getStatusColor(
                    lecture.status,
                  )}`}
                >
                  {getStatusText(lecture.status)}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center gap-2 font-bold text-neutral-800">
                  <Time02 aria-hidden="true" size={20} className="text-success-700" />
                  <span>{lecture.time}</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-neutral-800">
                  <UserGroup aria-hidden="true" size={20} className="text-success-700" />
                  <span>{lecture.students} طالب</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-neutral-800">
                  <BookOpen01 aria-hidden="true" size={20} className="text-success-700" />
                  <span>{lecture.level}</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-neutral-800">
                  <Home01 aria-hidden="true" size={20} className="text-success-700" />
                  <span>{lecture.room}</span>
                </div>
              </div>

              <div className="flex flex-wrap justify-end gap-3">
                {lecture.status === "scheduled" && (
                  <button className="h-10 px-5 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors">
                    بدء المحاضرة
                  </button>
                )}
                {lecture.status === "in-progress" && (
                  <button className="h-10 px-5 bg-danger-600 hover:bg-danger-700 text-white rounded-xl font-bold transition-colors">
                    إنهاء المحاضرة
                  </button>
                )}
                <button className="h-10 px-5 bg-neutral-200 text-neutral-800 rounded-xl font-bold hover:bg-neutral-300 transition-colors">
                  عرض التفاصيل
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
