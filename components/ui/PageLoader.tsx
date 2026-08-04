import Image from "next/image";

export default function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] py-20">
      <div className="mb-6 animate-pulse drop-shadow-sm">
        <Image src="/images/logo.png" alt="شعار دار الرحمن" width={80} height={80} className="object-contain" priority />
      </div>
      <div className="w-12 h-12 border-[5px] border-success-200 border-t-success-700 rounded-full animate-spin mb-4"></div>
      <p className="text-success-900 font-bold font-cairo text-lg">جاري التحميل...</p>
    </div>
  );
}
