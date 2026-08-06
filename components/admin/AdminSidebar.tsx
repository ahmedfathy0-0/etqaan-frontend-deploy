import {
  DashboardCircle,
  Notification01,
  QuoteDown,
  Students,
  Tv01,
  UserGroup,
  PencilEdit01,
  BookOpen01,
  Award01,
  Logout01,
} from "@dga-icons/react/duotone-rounded";
import { useAuth } from "@/contexts/AuthContext";

export type TabId = "overview" | "users" | "students" | "batches" | "quotes" | "notices" | "exams" | "sessions" | "leaderboard";

interface AdminSidebarProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  mobile?: boolean;
}

const icons: Record<TabId, any> = {
  overview: DashboardCircle,
  users: UserGroup,
  students: Students,
  batches: Tv01,
  quotes: QuoteDown,
  notices: Notification01,
  exams: PencilEdit01,
  sessions: BookOpen01,
  leaderboard: Award01,
};

const adminTabs: { id: TabId; label: string }[] = [
  { id: "overview", label: "لوحة التحكم" },
  { id: "users", label: "المستخدمين" },
  { id: "batches", label: "الحلقات" },
  { id: "students", label: "الطلاب" },
  { id: "quotes", label: "مقولات تشجيعية" },
  { id: "notices", label: "تنويهات" },
];

const sheikhTabs: { id: TabId; label: string }[] = [
  { id: "overview", label: "لوحة التحكم" },
  { id: "batches", label: "الحلقات" },
  { id: "students", label: "الطلاب" },
];

const studentTabs: { id: TabId; label: string }[] = [
  { id: "overview", label: "لوحة الطالب" },
  { id: "batches", label: "الحلقات" },
];

export function AdminSidebar({ activeTab, setActiveTab, mobile = false }: AdminSidebarProps) {
  const { user, logout } = useAuth();
  let tabs = adminTabs;
  if (user?.role === "sheikh") tabs = sheikhTabs;
  if (user?.role === "student") tabs = studentTabs;

  return (
    <nav className={`flex h-full flex-col gap-4 bg-white px-2 py-6 ${mobile ? "w-full" : "w-[250px] border border-neutral-700/50 rounded-lg"}`} dir="rtl">
      {tabs.map((tab) => {
        const active = activeTab === tab.id;
        const Icon = icons[tab.id];
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex h-[43px] w-full items-center gap-2 rounded-lg px-[10px] text-lg font-bold transition-colors ${active ? "border-2 border-success-700 text-success-700" : "border-2 border-transparent text-success-900 hover:bg-neutral-100"}`}
          >
            <span className="min-w-0 flex-1 text-right">{tab.label}</span>
            <Icon aria-hidden="true" size={24} />
          </button>
        );
      })}

      <div className="flex-1" />
      
      <button
        onClick={logout}
        className="flex h-[43px] w-full items-center gap-2 rounded-lg px-[10px] text-lg font-bold transition-colors border-2 border-transparent text-red-600 hover:bg-red-50"
      >
        <span className="min-w-0 flex-1 text-right">تسجيل الخروج</span>
        <Logout01 aria-hidden="true" size={24} />
      </button>
    </nav>
  );
}
