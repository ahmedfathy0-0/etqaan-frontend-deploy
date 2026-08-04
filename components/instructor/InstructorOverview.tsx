import Image from "next/image";
import { Star, Award01, UserGroup, BookOpen01 } from "@dga-icons/react/duotone-rounded";

interface InstructorOverviewProps {
  instructorId: string;
}

export default function InstructorOverview({
  instructorId,
}: InstructorOverviewProps) {
  const instructorImagePath = "/images/profile/teacher.png";

  return (
    <div className="bg-success-800 rounded-[24px] p-8 text-white shadow-[0_2px_10px_5px_rgba(0,10,1,0.15)] border-[1.5px] border-success-200 font-cairo">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-right">
          <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center overflow-hidden border-[3px] border-warning-500 shadow-lg shrink-0">
            <Image
              src={instructorImagePath}
              alt="صورة المعلم"
              width={96}
              height={96}
              className="rounded-full object-cover"
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-3 text-white">
              مرحباً، الأستاذ أحمد محمد
            </h1>
            <p className="text-success-100 text-xl font-bold mb-4">
              معلم القرآن الكريم والتجويد
            </p>
            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3">
              <span className="flex items-center gap-2 bg-success-900/50 px-4 py-2 rounded-full text-sm font-bold border border-success-700">
                <BookOpen01 aria-hidden="true" size={16} className="text-warning-500" />
                خبرة 8 سنوات
              </span>
              <span className="flex items-center gap-2 bg-success-900/50 px-4 py-2 rounded-full text-sm font-bold border border-success-700">
                <Award01 aria-hidden="true" size={16} className="text-warning-500" />
                إجازة في القراءات
              </span>
              <span className="flex items-center gap-2 bg-success-900/50 px-4 py-2 rounded-full text-sm font-bold border border-success-700">
                <UserGroup aria-hidden="true" size={16} className="text-warning-500" />
                45 طالب
              </span>
            </div>
          </div>
        </div>

        <div className="text-center bg-white/10 rounded-2xl p-6 border border-success-700 min-w-[200px]">
          <div className="text-warning-500 mb-3 flex justify-center">
            <Star aria-hidden="true" size={48} />
          </div>
          <div className="text-4xl font-bold mb-2 text-white">
            4.9
          </div>
          <div className="text-success-100 text-base font-bold">
            تقييم الطلاب
          </div>
          <div className="text-success-200 text-sm mt-2 font-medium">
            من 127 تقييم
          </div>
        </div>
      </div>
    </div>
  );
}
