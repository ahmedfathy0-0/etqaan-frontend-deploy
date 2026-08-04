import Image from "next/image";
import Link from "next/link";
import { Login01, Menu01, Tv01, UserAdd01 } from "@dga-icons/react/duotone-rounded";

import { useAuth } from "@/contexts/AuthContext";
import { TabId } from "./AdminSidebar";

import { ReactNode } from "react";

interface AdminHeaderProps {
  onLogout: () => void;
  onAddUser?: () => void;
  onAddBatch?: () => void;
  onToggleMenu: () => void;
  activeTab: TabId;
  children?: ReactNode;
  customTitle?: string;
}

const BatchIcon = ({ size = 24 }: { size?: number }) => (
  <Tv01 aria-hidden="true" size={size} />
);

const UserAddIcon = ({ size = 24 }: { size?: number }) => (
  <UserAdd01 aria-hidden="true" size={size} />
);

const titles: Record<TabId, string> = {
  overview: "لوحة التحكم",
  users: "المستخدمين",
  students: "الطلاب",
  batches: "الحلقات",
  quotes: "مقولات تشجيعية",
  notices: "تنويهات",
  exams: "الامتحانات",
  sessions: "الجلسات",
  leaderboard: "لوحة الشرف",
};

export default function AdminHeader({ onLogout, onAddUser, onAddBatch, onToggleMenu, activeTab, children, customTitle }: AdminHeaderProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";

  return (
    <>
      <header className="sticky top-0 z-30 hidden h-[114px] items-center justify-between bg-white px-6 shadow-[0_2px_10px_5px_rgba(0,10,1,0.25)] lg:flex">
        <div className="flex items-center gap-6" dir="rtl">
          {children ? children : (
            <>
              {isAdmin && activeTab !== "batches" && onAddUser && <button onClick={onAddUser} className="flex h-14 w-[195px] items-center justify-center gap-4 rounded-2xl bg-primary-600 px-4 text-base font-bold text-success-50 hover:bg-primary-700">
                <UserAddIcon />
                إضافة مستخدم
              </button>}
              {isAdmin && (activeTab === "overview" || activeTab === "batches") && onAddBatch && <button onClick={onAddBatch} className="flex h-14 w-[155px] items-center justify-center gap-4 rounded-2xl bg-warning-600 px-4 text-base font-bold text-warning-50 hover:bg-warning-700">
                <BatchIcon />
                إضافة حلقة
              </button>}
            </>
          )}
        </div>
        <Link href="/" aria-label="الصفحة الرئيسية">
          <Image src="/images/logo.png" alt="شعار دار الرحمن" width={66} height={66} className="h-[66px] w-[66px] object-contain" priority />
        </Link>
      </header>

      <header className="relative z-30 flex h-[149px] flex-col bg-success-800 p-4 text-white lg:hidden">
        <div className="flex h-[66px] w-full items-start justify-between">
          <div className="flex items-center gap-2 pt-1">
            <button onClick={onToggleMenu} aria-label="فتح القائمة" className="flex h-8 w-8 items-center justify-center text-white">
              <Menu01 aria-hidden="true" size={24} />
            </button>
            <button onClick={onLogout} aria-label="تسجيل الخروج" className="flex h-[18px] w-[18px] items-center justify-center rounded-full border border-success-50 bg-neutral-700 text-success-50">
              <Login01 aria-hidden="true" size={12} />
            </button>
          </div>
          <Image src="/images/logo.png" alt="شعار دار الرحمن" width={66} height={66} className="h-[66px] w-[66px] object-contain" priority />
        </div>
        <h1 className="mt-4 truncate text-right text-lg font-bold leading-[27px]" dir="rtl">{customTitle || titles[activeTab]}</h1>
      </header>
    </>
  );
}

export { BatchIcon, UserAddIcon };
