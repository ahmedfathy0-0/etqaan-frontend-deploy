import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto text-center">
        {/* Main Title */}
        <div className="mb-8">
          <span className="text-7xl animate-bounce-gentle inline-block">
            🕌
          </span>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 font-arabic leading-tight">
          دار الرحمن لتحفيظ القرآن الكريم
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 mb-10 max-w-3xl mx-auto font-arabic leading-relaxed">
          نحن نقدم تعليم القرآن الكريم بأحدث الطرق التعليمية مع متابعة دقيقة
          لتقدم كل طالب
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/batches"
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-arabic font-bold text-xl rounded-2xl hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3"
          >
            <span className="text-2xl">🔍</span>
            ابحث عن حلقتك
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 bg-white text-gray-800 font-arabic font-semibold text-xl rounded-2xl hover:bg-gray-50 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg border-2 border-gray-200 flex items-center gap-3"
          >
            <span className="text-2xl">🔐</span>
            تسجيل الدخول
          </Link>
        </div>

        {/* Vision & Mission Cards */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <div className="w-full md:w-1/2">
            <div
              className="rounded-3xl p-8 card-shadow-lg border border-white/20 hover:transform hover:-translate-y-1 transition-all"
              style={{ backgroundColor: "rgba(194, 226, 241, 0.9)" }}
            >
              <div className="text-5xl mb-4">🎯</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4 font-arabic">
                رؤيتنا
              </h2>
              <p className="text-gray-800 text-lg font-arabic leading-relaxed">
                إعداد جيل مؤمن متمسك بكتاب الله، قادر على حفظه وفهمه وتطبيقه في
                حياته اليومية
              </p>
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <div
              className="rounded-3xl p-8 card-shadow-lg border border-white/20 hover:transform hover:-translate-y-1 transition-all"
              style={{ backgroundColor: "rgba(255, 213, 79, 0.9)" }}
            >
              <div className="text-5xl mb-4">📚</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4 font-arabic">
                رسالتنا
              </h2>
              <p className="text-gray-800 text-lg font-arabic leading-relaxed">
                تقديم تعليم قرآني متميز باستخدام أساليب حديثة ومتابعة شخصية لكل
                طالب
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
