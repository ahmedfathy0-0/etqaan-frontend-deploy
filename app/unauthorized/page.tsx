"use client";

import Link from "next/link";
import { Alert02, ArrowRight01, Home01 } from "@dga-icons/react/duotone-rounded";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-success-50 font-cairo flex items-center justify-center p-4">
      <div className="bg-white rounded-[24px] shadow-[0_2px_10px_5px_rgba(0,10,1,0.15)] p-8 max-w-lg w-full text-center relative z-10 border-[1.5px] border-danger-200">
        <div className="w-24 h-24 bg-danger-50 text-danger-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Alert02 aria-hidden="true" size={48} />
        </div>

        <h1 className="text-3xl font-bold text-danger-800 mb-4">
          عفواً، غير مسموح لك بالدخول
        </h1>

        <p className="text-neutral-700 text-lg mb-8 leading-relaxed">
          ليس لديك الصلاحيات الكافية للوصول إلى هذه الصفحة. يرجى التواصل مع
          المسؤول إذا كنت تعتقد أن هذا خطأ.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 px-8 py-3 bg-success-800 text-white rounded-xl font-bold hover:bg-success-900 transition-colors shadow-md"
          >
            <Home01 aria-hidden="true" size={24} />
            العودة للرئيسية
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex-1 flex items-center justify-center gap-2 px-8 py-3 bg-white border-2 border-neutral-200 text-neutral-700 rounded-xl font-bold hover:bg-neutral-50 hover:text-success-800 transition-colors"
          >
            رجوع
            <ArrowRight01 aria-hidden="true" size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
