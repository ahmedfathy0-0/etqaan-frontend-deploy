"use client";

import { useState } from "react";
import Header from "@/components/Header";
import BatchCard from "@/components/public/BatchCard";
import Link from "next/link";
import PageLoader from "@/components/ui/PageLoader";
import { useAuth } from "@/contexts/AuthContext";
import { usePublicBatches } from "@/queries/useBatches";
import { BookOpen01, Search01, Login01, Alert02, User, Tv01, Filter } from "@dga-icons/react/duotone-rounded";
import { api } from "@/lib/api";

export default function BatchesPage() {
  const { user } = useAuth();
  const { data: fetchedBatches, isLoading, error } = usePublicBatches();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name_asc");
  const [lookupQuery, setLookupQuery] = useState("");
  const [lookupResult, setLookupResult] = useState<any | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState("");

  const batches = fetchedBatches || [];

  const handleLookup = async () => {
    if (!lookupQuery.trim()) return;
    setLookupLoading(true);
    setLookupError("");
    setLookupResult(null);
    try {
      const res = await api.get(`/students/lookup?q=${encodeURIComponent(lookupQuery.trim())}`);
      if (res.data) {
        setLookupResult(res.data);
      } else {
        setLookupError("لم يتم العثور على طالب بهذا الرقم");
      }
    } catch {
      setLookupError("لم يتم العثور على طالب بهذا الرقم");
    } finally {
      setLookupLoading(false);
    }
  };

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

          {/* Student Lookup */}
          {!user && (
            <div className="mb-16 max-w-xl mx-auto">
              <div className="bg-white rounded-[24px] p-6 shadow-[0_2px_10px_5px_rgba(0,10,1,0.15)] border-[1.5px] border-success-200">
                <div className="flex items-center gap-3 mb-4">
                  <User aria-hidden="true" size={28} className="text-success-700" />
                  <h2 className="text-xl font-bold text-success-900">ابحث عن بياناتك</h2>
                </div>
                <p className="text-neutral-600 text-sm mb-4">أدخل رقم هاتفك أو رقم هاتف ولي الأمر أو رقم الطالب للعثور على بياناتك</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    dir="ltr"
                    placeholder="05xxxxxxxx أو رقم الطالب"
                    value={lookupQuery}
                    onChange={(e) => setLookupQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLookup()}
                    className="flex-1 h-12 px-4 border-[1.5px] border-success-200 rounded-xl focus:outline-none focus:border-success-700 text-neutral-800 text-sm"
                  />
                  <button
                    onClick={handleLookup}
                    disabled={lookupLoading}
                    className="h-12 px-5 bg-success-800 text-white font-bold rounded-xl hover:bg-success-900 transition-colors disabled:opacity-60"
                  >
                    {lookupLoading ? "..." : "بحث"}
                  </button>
                </div>
                {lookupError && <p className="mt-3 text-danger-700 text-sm text-center">{lookupError}</p>}
                {lookupResult && (
                  <div className="mt-4 border border-success-200 rounded-2xl p-4 bg-success-50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 bg-success-200 rounded-full flex items-center justify-center text-success-900 font-bold text-sm">
                        {lookupResult.full_name?.[0]}
                      </div>
                      <div>
                        <p className="font-bold text-success-900">{lookupResult.full_name}</p>
                        {lookupResult.guardian_name && <p className="text-neutral-500 text-xs">ولي الأمر: {lookupResult.guardian_name}</p>}
                      </div>
                    </div>
                    {lookupResult.batch_students?.length > 0 && (
                      <div className="flex flex-col gap-2 mt-2">
                        <p className="text-sm font-bold text-neutral-700">الحلقات:</p>
                        {lookupResult.batch_students.map((bs: any) => (
                          <div key={bs.id} className="flex items-center justify-between bg-white rounded-xl px-3 py-2 border border-neutral-200">
                            <div className="flex items-center gap-2">
                              <Tv01 size={16} className="text-success-700" />
                              <span className="text-sm font-medium text-success-900">{bs.batch?.name}</span>
                            </div>
                            <span className="text-xs bg-success-200 text-success-800 px-2 py-1 rounded-full font-bold">{bs.league_points} نقطة</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

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
            <div className="mb-8 flex h-12 w-full max-w-3xl mx-auto items-center gap-4 px-4 lg:px-0">
              <label className="relative h-12 min-w-0 flex-1">
                <span className="sr-only">البحث عن حلقة</span>
                <input
                  type="search"
                  placeholder="أبحث عن حلقة..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-12 w-full rounded-2xl border-[1.5px] border-neutral-800 bg-white py-3 pr-11 pl-3 text-right text-base text-success-900 outline-none placeholder:text-success-900 focus:border-success-800 transition-all"
                />
                <Search01 aria-hidden="true" size={24} className="absolute right-3 top-1/2 -translate-y-1/2 text-success-800" />
              </label>
              <label className="relative flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center text-neutral-800">
                <span className="sr-only">ترتيب الحلقات</span>
                <Filter aria-hidden="true" size={32} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="absolute inset-0 cursor-pointer opacity-0"
                >
                  <option value="name_asc">الاسم (أ-ي)</option>
                  <option value="name_desc">الاسم (ي-أ)</option>
                  <option value="students_desc">الأكثر طلاباً</option>
                  <option value="students_asc">الأقل طلاباً</option>
                </select>
              </label>
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
            <div className="mt-8 text-center flex justify-center">
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
