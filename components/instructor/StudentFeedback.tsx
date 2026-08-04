"use client";

import { useState } from "react";
import Image from "next/image";
import { Message01, Star } from "@dga-icons/react/duotone-rounded";

export default function StudentFeedback() {
  const [selectedFilter, setSelectedFilter] = useState("الكل");

  const feedback = [
    {
      id: 1,
      studentName: "محمد أحمد",
      studentImage: "/images/students/student1.png",
      rating: 5,
      comment:
        "الأستاذ أحمد معلم ممتاز، يشرح بطريقة واضحة ومفهومة. استفدت كثيراً من دروس التجويد.",
      date: "منذ يومين",
      subject: "أحكام التجويد",
    },
    {
      id: 2,
      studentName: "فاطمة علي",
      studentImage: "/images/students/student2.png",
      rating: 5,
      comment:
        "جزاك الله خيراً أستاذ أحمد، طريقة تدريسك للقرآن الكريم ممتازة ومحفزة.",
      date: "منذ 3 أيام",
      subject: "حفظ القرآن",
    },
    {
      id: 3,
      studentName: "عبدالله محمد",
      studentImage: "/images/students/student3.png",
      rating: 4,
      comment:
        "معلم متمكن ومتفهم، لكن أتمنى المزيد من الأمثلة العملية في الدروس.",
      date: "منذ أسبوع",
      subject: "التفسير",
    },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={20}
        className={index < rating ? "text-warning-500" : "text-neutral-300"}
        aria-hidden="true"
      />
    ));
  };

  return (
    <div className="bg-white rounded-[24px] p-6 shadow-[0_2px_10px_5px_rgba(0,10,1,0.15)] border-[1.5px] border-success-200 font-cairo">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <h2 className="text-[28px] font-bold text-success-900 flex items-center gap-3">
          <Message01 aria-hidden="true" size={32} className="text-warning-600" />
          تقييمات الطلاب
        </h2>

        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          className="w-full sm:w-auto h-12 bg-white border-[1.5px] border-success-200 rounded-xl px-4 text-neutral-800 focus:ring-1 focus:ring-success-700 focus:border-success-700 transition-all font-bold cursor-pointer"
        >
          <option value="الكل">جميع التقييمات</option>
          <option value="5">5 نجوم</option>
          <option value="4">4 نجوم</option>
          <option value="3">3 نجوم</option>
        </select>
      </div>

      <div className="space-y-4">
        {feedback.map((item) => (
          <div
            key={item.id}
            className="border-[1.5px] border-neutral-200 rounded-2xl p-5 hover:shadow-md transition-all duration-300 hover:border-success-400 bg-neutral-50/50"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-sm">
                <Image
                  src={item.studentImage}
                  alt={item.studentName}
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div>
                    <h4 className="font-bold text-success-900 text-lg">
                      {item.studentName}
                    </h4>
                    <p className="text-sm font-bold text-neutral-500">
                      {item.subject}
                    </p>
                  </div>
                  <div className="flex flex-col sm:items-end">
                    <div className="flex items-center gap-1 mb-1">
                      {renderStars(item.rating)}
                    </div>
                    <p className="text-xs font-bold text-neutral-400">
                      {item.date}
                    </p>
                  </div>
                </div>

                <p className="text-neutral-700 leading-relaxed font-medium mt-3">
                  {item.comment}
                </p>

                <div className="flex justify-end mt-4">
                  <button className="text-primary-600 hover:text-primary-700 font-bold transition-colors">
                    رد على التقييم
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <button className="h-12 px-8 bg-success-50 text-success-800 rounded-xl font-bold hover:bg-success-100 transition-colors border border-success-200">
          عرض المزيد من التقييمات
        </button>
      </div>
    </div>
  );
}
