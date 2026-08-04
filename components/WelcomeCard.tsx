import Image from "next/image";

export default function WelcomeCard() {
  const studentImagePath = "/images/students/Memorization.png";

  return (
    <div className="bg-success-800 rounded-[24px] p-8 flex flex-col md:flex-row items-center justify-between shadow-[0_2px_10px_5px_rgba(0,10,1,0.15)] border-[1.5px] border-success-200 overflow-hidden relative font-cairo">
      {/* Decorative background circle */}
      <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full pointer-events-none"></div>
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full pointer-events-none"></div>

      <div className="w-full md:w-2/3 relative z-10">
        <h2 className="text-[28px] font-bold text-white mb-4">
          أهلاً وسهلاً، أحمد!
        </h2>
        <p className="text-success-100 font-bold text-lg mb-4">
          تقدم الحفظ
        </p>
        
        <div className="flex items-center gap-4">
          <div className="flex-1 bg-success-900/50 h-6 rounded-full overflow-hidden shadow-inner border border-success-700">
            <div
              className="bg-warning-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(255,213,79,0.5)] relative overflow-hidden"
              style={{ width: "75%" }}
            >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
            </div>
          </div>
          <p className="text-2xl font-bold text-warning-400 w-16 text-left">75%</p>
        </div>
      </div>
      
      <div className="w-full md:w-1/3 flex justify-center mt-8 md:mt-0 relative z-10">
        <div className="w-40 h-40 relative rounded-full p-2 bg-white/10 border-[1.5px] border-warning-500/50 backdrop-blur-sm">
          <Image
            src={studentImagePath}
            alt="الطالب"
            fill
            className="rounded-full object-cover shadow-lg border-[3px] border-white"
          />
        </div>
      </div>
    </div>
  );
}
