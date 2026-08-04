import Header from "@/components/Header";
import WelcomeCard from "@/components/WelcomeCard";
import InfoCards from "@/components/InfoCards";
import { Calendar01, Target01, TickDouble01, Time02 } from "@dga-icons/react/duotone-rounded";

export default async function StudentDashboard() {
  return (
    <div className="bg-success-50 min-h-screen font-cairo" dir="rtl">
      <Header />

      <main className="p-6 max-w-5xl mx-auto py-12">
          <WelcomeCard />
          <InfoCards />

          {/* Additional Content */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-[24px] p-6 shadow-[0_2px_10px_5px_rgba(0,10,1,0.15)] border-[1.5px] border-success-200">
              <h3 className="text-xl font-bold text-success-900 mb-6 flex items-center gap-3">
                <Calendar01 aria-hidden="true" size={28} className="text-success-800" />
                الجدول الأسبوعي
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-success-50 rounded-xl border border-success-100">
                  <span className="font-bold text-success-900">
                    السبت
                  </span>
                  <span className="text-success-700 font-bold flex items-center gap-2">
                    <Time02 aria-hidden="true" size={20} />
                    9:00 ص - 11:00 ص
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-success-50 rounded-xl border border-success-100">
                  <span className="font-bold text-success-900">
                    الاثنين
                  </span>
                  <span className="text-success-700 font-bold flex items-center gap-2">
                    <Time02 aria-hidden="true" size={20} />
                    9:00 ص - 11:00 ص
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-success-50 rounded-xl border border-success-100">
                  <span className="font-bold text-success-900">
                    الأربعاء
                  </span>
                  <span className="text-success-700 font-bold flex items-center gap-2">
                    <Time02 aria-hidden="true" size={20} />
                    9:00 ص - 11:00 ص
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[24px] p-6 shadow-[0_2px_10px_5px_rgba(0,10,1,0.15)] border-[1.5px] border-success-200">
              <h3 className="text-xl font-bold text-success-900 mb-6 flex items-center gap-3">
                <Target01 aria-hidden="true" size={28} className="text-warning-600" />
                الأهداف الشهرية
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-success-50 rounded-xl border border-success-100">
                  <span className="font-bold text-success-900">
                    حفظ جزء عم
                  </span>
                  <TickDouble01 aria-hidden="true" size={24} className="text-success-600" />
                </div>
                <div className="flex items-center justify-between p-4 bg-warning-50 rounded-xl border border-warning-100">
                  <span className="font-bold text-warning-900">
                    مراجعة سورة البقرة
                  </span>
                  <Time02 aria-hidden="true" size={24} className="text-warning-600" />
                </div>
                <div className="flex items-center justify-between p-4 bg-success-50 rounded-xl border border-success-100">
                  <span className="font-bold text-success-900">
                    تعلم أحكام النون الساكنة
                  </span>
                  <TickDouble01 aria-hidden="true" size={24} className="text-success-600" />
                </div>
              </div>
            </div>
          </div>
        </main>
    </div>
  );
}
