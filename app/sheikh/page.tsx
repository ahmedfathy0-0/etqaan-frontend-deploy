"use client";
import { useState } from "react";


import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import PageLoader from "@/components/ui/PageLoader";

import { useBatches } from "@/queries/useBatches";

interface Batch {
  id: number;
  name: string;
  schedule_description?: string;
  _count?: {
    batch_students: number;
  };
}

export default function SheikhDashboard() {
  const { user, logout } = useAuth();
  
  const { data: fetchedBatches = [], isLoading } = useBatches();
  
  const batches: Batch[] = fetchedBatches || [];
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name_asc");
  
  const stats = {
    totalStudents: batches.reduce((acc: number, batch: Batch) => acc + (batch._count?.batch_students || 0), 0),
    todaySessions: 0,
    upcomingExams: 0,
  };
  return (
    <ProtectedRoute allowedRoles={["sheikh"]}>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        {/* Header */}
        <header className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 shadow-lg">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold font-arabic flex items-center gap-3">
                  <span className="text-3xl">🕌</span>
                  لوحة تحكم الشيخ
                </h1>
                <p className="text-emerald-100 font-arabic mt-1">
                  مرحباً، {user?.name}
                </p>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl font-arabic transition-colors flex items-center gap-2"
              >
                <span>🚪</span>
                تسجيل الخروج
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8">
          {isLoading ? (
            <PageLoader />
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <span className="text-3xl">👨‍🎓</span>
                    </div>
                    <div>
                      <p className="text-gray-500 font-arabic text-sm">
                        إجمالي الطلاب
                      </p>
                      <p className="text-3xl font-bold text-gray-800">
                        {stats.totalStudents}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                      <span className="text-3xl">📅</span>
                    </div>
                    <div>
                      <p className="text-gray-500 font-arabic text-sm">
                        جلسات اليوم
                      </p>
                      <p className="text-3xl font-bold text-gray-800">
                        {stats.todaySessions}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                      <span className="text-3xl">📝</span>
                    </div>
                    <div>
                      <p className="text-gray-500 font-arabic text-sm">
                        امتحانات قادمة
                      </p>
                      <p className="text-3xl font-bold text-gray-800">
                        {stats.upcomingExams}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* My Batches */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                  <h2 className="text-xl font-bold text-gray-800 font-arabic flex items-center gap-2">
                    <span>📚</span>
                    حلقاتي
                  </h2>
                  <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="relative w-full sm:w-64">
                      <input
                        type="text"
                        placeholder="بحث عن حلقة..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-arabic text-sm text-gray-900"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        🔍
                      </span>
                    </div>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full sm:w-auto px-4 py-2 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-arabic text-sm text-gray-900 bg-white"
                    >
                      <option value="name_asc">الاسم (أ-ي)</option>
                      <option value="name_desc">الاسم (ي-أ)</option>
                      <option value="students_desc">عدد الطلاب (الأكثر)</option>
                      <option value="students_asc">عدد الطلاب (الأقل)</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {batches
                    .filter((b) => b.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    .sort((a, b) => {
                      if (sortBy === "name_asc") return a.name.localeCompare(b.name, "ar");
                      if (sortBy === "name_desc") return b.name.localeCompare(a.name, "ar");
                      if (sortBy === "students_desc") return (b._count?.batch_students || 0) - (a._count?.batch_students || 0);
                      if (sortBy === "students_asc") return (a._count?.batch_students || 0) - (b._count?.batch_students || 0);
                      return 0;
                    })
                    .map((batch) => (
                    <Link
                      key={batch.id}
                      href={`/batches/${batch.id}`}
                      className="border-2 border-gray-100 hover:border-emerald-200 rounded-xl p-5 transition-all hover:shadow-md group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-gray-800 font-arabic text-lg group-hover:text-emerald-700 transition-colors">
                            {batch.name}
                          </h3>
                          <p className="text-gray-500 font-arabic text-sm mt-1">
                            {batch.schedule_description}
                          </p>
                        </div>
                        <div className="text-center">
                          <span className="text-3xl block mb-1">👨‍🎓</span>
                          <span className="text-gray-600 font-arabic text-sm">
                            {batch._count?.batch_students || 0} طالب
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
