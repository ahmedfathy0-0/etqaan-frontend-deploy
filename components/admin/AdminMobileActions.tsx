import { BatchIcon, UserAddIcon } from "./AdminHeader";
import { TabId } from "./AdminSidebar";
import { UserAdd01 } from "@dga-icons/react/duotone-rounded";

interface AdminMobileActionsProps {
  onAddUser?: () => void;
  onAddBatch?: () => void;
  onAddStudent?: () => void;
  activeTab: TabId;
}

export default function AdminMobileActions({
  onAddUser,
  onAddBatch,
  onAddStudent,
  activeTab,
}: AdminMobileActionsProps) {
  if (!["overview", "users", "batches", "students"].includes(activeTab)) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 flex h-[88px] gap-2 rounded-t-2xl bg-neutral-200 px-4 py-4 shadow-[0_-2px_30px_4px_rgba(0,0,0,0.15)] lg:hidden" dir="rtl">
      {(activeTab === "overview" || activeTab === "batches") && onAddBatch && <button 
        onClick={onAddBatch}
        className="flex h-14 min-w-0 flex-1 items-center justify-center gap-4 rounded-2xl bg-warning-600 px-4 font-bold text-success-50 active:scale-[0.98]"
      >
        <BatchIcon />
        إضافة حلقة
      </button>}
      {(activeTab === "overview" || activeTab === "users") && onAddUser && <button 
        onClick={onAddUser}
        className="flex h-14 min-w-0 flex-1 items-center justify-center gap-4 rounded-2xl bg-primary-600 px-4 font-bold text-success-50 active:scale-[0.98]"
      >
        <UserAddIcon />
        إضافة مستخدم
      </button>}
      {activeTab === "students" && onAddStudent && <button 
        onClick={onAddStudent}
        className="flex h-14 min-w-0 flex-1 items-center justify-center gap-4 rounded-2xl bg-[#B17C08] px-4 font-bold text-success-50 active:scale-[0.98]"
      >
        <UserAdd01 aria-hidden="true" size={24} />
        إضافة طالب
      </button>}
    </div>
  );
}
