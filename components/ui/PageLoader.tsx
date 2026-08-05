import AppLogo from "@/components/ui/AppLogo";

export default function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] py-20">
      <div className="mb-6 animate-pulse drop-shadow-sm">
        <AppLogo className="w-20 h-20 object-contain text-success-800" />
      </div>
      <div className="w-12 h-12 border-[5px] border-success-200 border-t-success-700 rounded-full animate-spin mb-4"></div>
      <p className="text-success-900 font-bold font-cairo text-lg">جاري التحميل...</p>
    </div>
  );
}
