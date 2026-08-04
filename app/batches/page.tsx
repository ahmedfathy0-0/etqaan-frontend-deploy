"use client";

import { useState } from "react";
import Header from "@/components/Header";
import BatchCard from "@/components/public/BatchCard";
import RandomStars from "@/components/RandomStars";
import Link from "next/link";
import PageLoader from "@/components/ui/PageLoader";
import { useAuth } from "@/contexts/AuthContext";
import { usePublicBatches } from "@/queries/useBatches";
import { BookOpen01, Search01, UserGroup, Login01, Alert02 } from "@dga-icons/react/duotone-rounded";



export default function BatchesPage() {
  const { user } = useAuth();
  const { data: fetchedBatches, isLoading, error } = usePublicBatches();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name_asc");

  const batches = fetchedBatches || [];


  return (
    <div className="min-h-screen bg-success-50 font-cairo">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Title Section */}
        <div className="text-center mb-16">
          <div className="flex flex-col items-center justify-center gap-6 mb-6">
            <div className="w-20 h-20 bg-success-100 text-success-800 rounded-full flex items-center justify-center shadow-md">
              <BookOpen01 aria-hidden="true" size={48} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-success-900 leading-tight">
              اختر حلقتك
            </h1>
          </div>
          <p className="text-neutral-700 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            ابحث عن اسمك في الحلقة وتتبع تقدمك نحو التميز
          </p>
        </div>

          {/* Loading State */}
          {isLoading && <PageLoader />}

          {/* Error State */}
          {error && !isLoading && batches.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[24px] shadow-sm max-w-2xl mx-auto border-[1.5px] border-danger-200">
              <div className="flex justify-center mb-6 text-danger-500">
                <Alert02 aria-hidden="true" size={64} />
              </div>
              <p className="text-danger-800 text-lg font-bold mb-6">{error?.message || String(error)}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-3 bg-danger-600 text-white rounded-xl font-bold hover:bg-danger-700 transition-colors shadow-md"
              >
                حاول مرة أخرى
              </button>
            </div>
          )}

          {/* Search and Sort */}
          {!isLoading && batches.length > 0 && (
            <div className="flex flex-col md:flex-row gap-4 mb-12 max-w-3xl mx-auto">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="بحث عن حلقة..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-[52px] pl-12 pr-4 bg-white border-[1.5px] border-success-200 rounded-xl focus:outline-none focus:border-success-700 focus:ring-1 focus:ring-success-700 text-neutral-800 shadow-sm font-medium transition-all"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-success-800">
                  <Search01 aria-hidden="true" size={24} />
                </span>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-[52px] px-4 min-w-[200px] border-[1.5px] border-success-200 rounded-xl focus:outline-none focus:border-success-700 focus:ring-1 focus:ring-success-700 text-neutral-800 bg-white shadow-sm font-medium cursor-pointer transition-all"
              >
                <option value="name_asc">الاسم (أ-ي)</option>
                <option value="name_desc">الاسم (ي-أ)</option>
                <option value="students_desc">الأكثر طلاباً</option>
                <option value="students_asc">الأقل طلاباً</option>
              </select>
            </div>
          )}

          {/* Batches Grid */}
          {!isLoading && batches.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <BatchCard
                  key={batch.id}
                  id={batch.id}
                  name={batch.name}
                  description={batch.schedule_description || ""}
                  studentCount={batch._count?.batch_students || 0}
                />
              ))}
            </div>
          )}

          {/* Login CTA */}
          {!user && (
            <div className="mt-20 text-center flex justify-center">
              <div className="bg-white rounded-[24px] p-8 shadow-[0_2px_10px_5px_rgba(0,10,1,0.15)] border-[1.5px] border-success-200 max-w-xl w-full">
                <p className="text-neutral-800 text-lg font-bold mb-6">
                  هل لديك حساب؟ سجل دخولك للوصول لمميزات أكثر!
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-success-800 text-white font-bold rounded-2xl hover:bg-success-900 transition-colors shadow-md w-full sm:w-auto min-w-[200px]"
                >
                  <Login01 aria-hidden="true" size={24} />
                  تسجيل الدخول
                </Link>
              </div>
            </div>
          )}
        </main>
    </div>
  );
}
