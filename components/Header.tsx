"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import AppLogo from "@/components/ui/AppLogo";
import { Home01, DashboardCircle, BookOpen01, InformationCircle, Search01, Login01, Logout01 } from "@dga-icons/react/duotone-rounded";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  // Determine the route type and user info
  const routeInfo = useMemo(() => {
    if (pathname.startsWith("/admin")) {
      return {
        type: "admin",
        title: "لوحة المدير",
        navItems: [
          { href: "/", label: "الرئيسية", icon: <Home01 aria-hidden="true" size={24} /> },
          { href: "/admin", label: "لوحة التحكم", icon: <DashboardCircle aria-hidden="true" size={24} /> },
        ],
      };
    } else if (pathname.startsWith("/sheikh")) {
      return {
        type: "sheikh",
        title: "لوحة الشيخ",
        navItems: [
          { href: "/", label: "الرئيسية", icon: <Home01 aria-hidden="true" size={24} /> },
          { href: "/sheikh", label: "لوحة التحكم", icon: <DashboardCircle aria-hidden="true" size={24} /> },
        ],
      };
    } else if (pathname.startsWith("/student/dashboard")) {
      return {
        type: "student-dashboard",
        title: "لوحة الطالب",
        navItems: [
          { href: "/", label: "الرئيسية", icon: <Home01 aria-hidden="true" size={24} /> },
          { href: "/student/dashboard", label: "لوحة التحكم", icon: <DashboardCircle aria-hidden="true" size={24} /> },
        ],
      };
    } else if (pathname.startsWith("/batches")) {
      return {
        type: "batches",
        title: "",
        navItems: [
          { href: "/", label: "الرئيسية", icon: <Home01 aria-hidden="true" size={24} /> },
          { href: "/batches", label: "الحلقات", icon: <BookOpen01 aria-hidden="true" size={24} /> },
        ],
      };
    } else if (pathname.startsWith("/login")) {
      return {
        type: "login",
        title: "",
        navItems: [{ href: "/", label: "الرئيسية", icon: <Home01 aria-hidden="true" size={24} /> }],
      };
    } else {
      return {
        type: "general",
        title: "",
        navItems: [
          { href: "/", label: "الرئيسية", icon: <Home01 aria-hidden="true" size={24} /> },
          { href: "/batches", label: "الحلقات", icon: <BookOpen01 aria-hidden="true" size={24} /> },
          { href: "/about", label: "من نحن", icon: <InformationCircle aria-hidden="true" size={24} /> },
        ],
      };
    }
  }, [pathname]);

  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const getDashboardLink = () => {
    if (!user) return null;
    switch (user.role) {
      case "super_admin":
      case "admin":
        return "/admin";
      case "sheikh":
        return "/sheikh";
      case "student":
        return "/student/dashboard";
      default:
        return null;
    }
  };

  return (
    <header className="bg-success-800 text-white p-4 shadow-md font-cairo" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Top Row - Logo and User Info */}
        <div className="flex justify-between items-center mb-4">
          <Link
            href="/"
            className="text-2xl font-bold hover:text-white/80 transition-all duration-300 flex items-center"
          >
            <AppLogo className="ml-3 w-20 h-20 object-contain text-white" />
            {routeInfo.title ? `دار الرحمن - ${routeInfo.title}` : "دار الرحمن"}
          </Link>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            {isLoading ? (
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : isAuthenticated && user ? (
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <div className="font-semibold font-cairo">
                    مرحباً، {user.name}
                  </div>
                  <div className="text-sm text-success-100 font-cairo">
                    {user.role === "super_admin" && "مدير عام"}
                    {user.role === "admin" && "مدير"}
                    {user.role === "sheikh" && "شيخ"}
                    {user.role === "student" && "طالب"}
                  </div>
                </div>
                {getDashboardLink() &&
                  !pathname.startsWith(getDashboardLink()!) && (
                    <Link
                      href={getDashboardLink()!}
                      className="px-4 py-2 bg-success-700 hover:bg-success-600 rounded-xl font-cairo transition-colors font-bold"
                    >
                      لوحة التحكم
                    </Link>
                  )}
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-danger-600 hover:bg-danger-700 rounded-xl font-cairo transition-colors flex items-center gap-2 font-bold"
                >
                  <Logout01 aria-hidden="true" size={20} />
                  <span className="hidden sm:inline">خروج</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/batches"
                  className="px-4 py-2 bg-success-700 hover:bg-success-600 rounded-xl font-cairo transition-colors flex items-center gap-2 font-bold"
                >
                  <Search01 aria-hidden="true" size={20} />
                  <span className="hidden sm:inline">ابحث عن حلقتك</span>
                </Link>
                <Link
                  href="/login"
                  className="px-4 py-2 bg-warning-600 text-warning-50 hover:bg-warning-700 rounded-xl font-cairo font-bold transition-colors flex items-center gap-2"
                >
                  <Login01 aria-hidden="true" size={20} />
                  تسجيل الدخول
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Row */}
        <nav className="border-t border-success-700 pt-4 mt-2">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2 bg-success-900/50 rounded-full p-2">
              {routeInfo.navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 font-cairo font-bold
                    ${isActiveLink(item.href)
                      ? "bg-warning-600 text-warning-50 shadow-md"
                      : "hover:bg-success-700 text-success-100 hover:text-white"
                    }
                  `}
                >
                  <span className="flex items-center justify-center">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
