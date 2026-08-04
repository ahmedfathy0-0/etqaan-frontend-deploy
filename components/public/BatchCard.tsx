"use client";

import Link from "next/link";
import { UserGroup, ArrowLeft01, BookOpen01 } from "@dga-icons/react/duotone-rounded";

interface BatchCardProps {
  id: number;
  name: string;
  description?: string;
  studentCount: number;
  sheikhName?: string;
  color?: string;
  mascot?: string;
}

export default function BatchCard({
  id,
  name,
  description,
  studentCount,
  sheikhName,
}: BatchCardProps) {

  return (
    <Link href={`/batches/detail?id=${id}`}>
      <div className="group relative bg-white rounded-[24px] overflow-hidden shadow-[0_2px_10px_5px_rgba(0,10,1,0.15)] hover:shadow-[0_4px_20px_10px_rgba(0,10,1,0.2)] transition-all duration-300 cursor-pointer border-[1.5px] border-success-200 hover:border-success-700 font-cairo">
        {/* Header */}
        <div className="bg-success-800 p-6 relative overflow-hidden flex flex-col justify-between min-h-[140px]">
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full"></div>
          <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/5 rounded-full"></div>

          {/* Icon */}
          <div className="absolute top-4 left-4 text-warning-500 transform group-hover:scale-110 transition-transform duration-500">
            <BookOpen01 aria-hidden="true" size={48} />
          </div>

          {/* Name */}
          <h3 className="text-[28px] font-bold text-white text-right relative z-10 mt-8 truncate pr-2 border-r-4 border-warning-600">
            {name}
          </h3>
        </div>

        {/* Body */}
        <div className="p-5 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 bg-success-50 px-3 py-1.5 rounded-full text-success-800">
              <UserGroup aria-hidden="true" size={20} />
              <span className="font-bold text-sm">{studentCount} طالب</span>
            </div>
            
            {sheikhName && (
              <div className="flex items-center gap-2 bg-warning-50 px-3 py-1.5 rounded-full text-warning-800">
                <span className="font-bold text-sm">الشيخ {sheikhName}</span>
              </div>
            )}
          </div>

          {description && (
            <p className="text-neutral-700 text-sm mb-4 line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}

          {/* Action hint */}
          <div className="mt-2 flex items-center justify-between border-t border-success-100 pt-4">
            <span className="text-success-800 font-bold text-base">
              عرض التفاصيل
            </span>
            <div className="w-10 h-10 bg-success-100 text-success-800 rounded-full flex items-center justify-center group-hover:bg-success-800 group-hover:text-white transition-colors">
              <ArrowLeft01 aria-hidden="true" size={24} className="group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
