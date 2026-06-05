"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import PageLoader from "@/components/ui/PageLoader";
import MultiSearchableSelect from "@/components/ui/MultiSearchableSelect";
import Modal from "@/components/ui/Modal";
import { useAdminStats } from "@/queries/useAdmin";
import { useUsers, useCreateUser, useDeleteUser } from "@/queries/useUsers";
import { useBatches, useCreateBatch, useDeleteBatch } from "@/queries/useBatches";
import AdminStatsCards from "@/components/admin/AdminStatsCards";
import AdminUsersTab from "@/components/admin/AdminUsersTab";
import AdminBatchesTab from "@/components/admin/AdminBatchesTab";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
  plain_password?: string;
}

interface Batch {
  id: number;
  name: string;
  schedule_description: string;
  term_id: number;
  _count?: {
    batch_students: number;
    batch_sheikhs: number;
  };
}

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const { data: stats = {
    totalUsers: 0,
    totalStudents: 0,
    totalSheikhs: 0,
    totalBatches: 0,
    totalAdmins: 0,
    recentActivity: { todayRecords: 0, weekRecords: 0 }
  }, isLoading: loadingStats } = useAdminStats();
  
  const { data: users = [], isLoading: loadingUsers } = useUsers();
  const { data: batches = [], isLoading: loadingBatches } = useBatches();
  
  const isLoading = loadingStats || loadingUsers || loadingBatches;
  const error = ""; 
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "batches">(
    "overview",
  );
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const [showUserModal, setShowUserModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "sheikh" as string,
  });
  const [newBatch, setNewBatch] = useState({
    name: "",
    schedule_description: "",
    term_id: 1,
    sheikh_ids: [] as number[],
  });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const { mutateAsync: createUserMutate } = useCreateUser();
  const { mutateAsync: createBatchMutate } = useCreateBatch();
  const { mutateAsync: deleteUserMutate } = useDeleteUser();
  const { mutateAsync: deleteBatchMutate } = useDeleteBatch();

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setFormLoading(true);
    setFormError("");

    try {
      await createUserMutate(newUser);
      setShowUserModal(false);
      setNewUser({ name: "", email: "", password: "", role: "sheikh" });
    } catch (err: any) {
      console.error("Error creating user:", err);
      setFormError(err.response?.data?.message || "حدث خطأ أثناء إنشاء المستخدم");
    } finally {
      setFormLoading(false);
    }
  };

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setFormLoading(true);
    setFormError("");

    try {
      await createBatchMutate(newBatch);
      setShowBatchModal(false);
      setNewBatch({
        name: "",
        schedule_description: "",
        term_id: 1,
        sheikh_ids: [],
      });
    } catch (err: any) {
      console.error("Error creating batch:", err);
      setFormError(err.response?.data?.message || "حدث خطأ أثناء إنشاء الحلقة");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!token) return;

    try {
      await deleteUserMutate(userId);
      setDeleteConfirm(null);
    } catch (err: any) {
      console.error("Error deleting user:", err);
      alert(err.response?.data?.message || "حدث خطأ أثناء حذف المستخدم");
    }
  };

  const handleDeleteBatch = async (batchId: number) => {
    if (!token) return;

    try {
      await deleteBatchMutate(batchId);
      setDeleteConfirm(null);
    } catch (err: any) {
      console.error("Error deleting batch:", err);
      alert(err.response?.data?.message || "حدث خطأ أثناء حذف الحلقة");
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "super_admin":
        return "مدير عام";
      case "admin":
        return "مدير";
      case "sheikh":
        return "شيخ";
      case "student":
        return "طالب";
      default:
        return role;
    }
  };

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewUser({ ...newUser, password });
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
        <Modal
          isOpen={showUserModal}
          onClose={() => setShowUserModal(false)}
          title="➕ إضافة مستخدم جديد"
        >
          <form onSubmit={handleCreateUser} className="space-y-4">
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl font-arabic text-sm">
                {formError}
              </div>
            )}

            <div>
              <label className="block font-arabic text-gray-700 mb-1">
                الاسم
              </label>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-arabic text-gray-900 bg-white"
                placeholder="أدخل اسم المستخدم"
                required
              />
            </div>

            <div>
              <label className="block font-arabic text-gray-700 mb-1">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white"
                placeholder="example@email.com"
                dir="ltr"
                required
              />
            </div>

            <div>
              <label className="block font-arabic text-gray-700 mb-1">
                كلمة المرور
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white"
                  placeholder="كلمة المرور"
                  dir="ltr"
                  required
                />
                <button
                  type="button"
                  onClick={generatePassword}
                  className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                  title="إنشاء كلمة مرور عشوائية"
                >
                  🎲
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1 font-arabic">
                احفظ كلمة المرور لإعطائها للمستخدم
              </p>
            </div>

            <div>
              <label className="block font-arabic text-gray-700 mb-1">
                الدور
              </label>
              <select
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-arabic text-gray-900 bg-white"
              >
                {user?.role === "super_admin" && (
                  <option value="super_admin">مدير عام</option>
                )}
                <option value="admin">مدير</option>
                <option value="sheikh">شيخ</option>
                <option value="student">طالب</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={formLoading}
                className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-arabic font-semibold hover:bg-purple-700 disabled:opacity-50"
              >
                {formLoading ? "جاري الإنشاء..." : "إنشاء المستخدم"}
              </button>
              <button
                type="button"
                onClick={() => setShowUserModal(false)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-arabic hover:bg-gray-200"
              >
                إلغاء
              </button>
            </div>
          </form>
        </Modal>

        <Modal
          isOpen={showBatchModal}
          onClose={() => setShowBatchModal(false)}
          title="📚 إنشاء حلقة جديدة"
          headerColorClass="bg-gradient-to-r from-emerald-600 to-blue-600"
        >
          <form onSubmit={handleCreateBatch} className="space-y-4">
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl font-arabic text-sm">
                {formError}
              </div>
            )}

            <div>
              <label className="block font-arabic text-gray-700 mb-1">
                اسم الحلقة
              </label>
              <input
                type="text"
                value={newBatch.name}
                onChange={(e) =>
                  setNewBatch({ ...newBatch, name: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-arabic text-gray-900 bg-white"
                placeholder="مثال: حلقة النجوم ⭐"
                required
              />
            </div>

            <div>
              <label className="block font-arabic text-gray-700 mb-1">
                جدول الحلقة
              </label>
              <input
                type="text"
                value={newBatch.schedule_description}
                onChange={(e) =>
                  setNewBatch({
                    ...newBatch,
                    schedule_description: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-arabic text-gray-900 bg-white"
                placeholder="مثال: السبت والاثنين - 5:00 م"
              />
            </div>

            <div>
              <label className="block font-arabic text-gray-700 mb-1">
                اختر الشيوخ
              </label>
              <MultiSearchableSelect
                options={users
                  .filter((u) => u.role === "sheikh")
                  .map((u) => ({ id: u.id, label: u.name }))}
                value={newBatch.sheikh_ids}
                onChange={(val) =>
                  setNewBatch({ ...newBatch, sheikh_ids: val as number[] })
                }
                placeholder="اختر الشيوخ..."
                className="mb-1"
              />
              {newBatch.sheikh_ids.length > 0 && (
                <p className="text-xs text-emerald-600 mt-1 font-arabic">
                  تم اختيار {newBatch.sheikh_ids.length} شيخ
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={formLoading}
                className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-xl font-arabic font-semibold hover:from-emerald-700 hover:to-blue-700 disabled:opacity-50 transition-all"
              >
                {formLoading ? "جاري الإنشاء..." : "إنشاء الحلقة"}
              </button>
              <button
                type="button"
                onClick={() => setShowBatchModal(false)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-arabic hover:bg-gray-200 transition-colors"
              >
                إلغاء
              </button>
            </div>
          </form>
        </Modal>

        <header className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white p-4 md:p-6 shadow-lg">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-xl md:text-2xl font-bold font-arabic flex items-center gap-2 md:gap-3">
                  <span className="text-2xl md:text-3xl">🛡️</span>
                  لوحة تحكم المدير
                </h1>
                <p className="text-purple-200 font-arabic mt-1 text-sm md:text-base">
                  مرحباً، {user?.name} ({getRoleLabel(user?.role || "")})
                </p>
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem("etqaan_token");
                  localStorage.removeItem("etqaan_user");
                  window.location.href = "/login";
                }}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl font-arabic transition-colors flex items-center gap-2"
              >
                <span>🚪</span>
                تسجيل الخروج
              </button>
            </div>

            <div className="mt-4 md:mt-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {[
                { id: "overview", label: "نظرة عامة", icon: "📊" },
                { id: "users", label: "المستخدمين", icon: "👥" },
                { id: "batches", label: "الحلقات", icon: "📚" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 md:px-6 py-2 md:py-3 rounded-xl font-arabic transition-all flex items-center gap-2 whitespace-nowrap text-sm md:text-base ${
                    activeTab === tab.id
                      ? "bg-white text-purple-700 shadow-md"
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
          {isLoading ? (
            <PageLoader />
          ) : error ? (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center">
              <span className="text-4xl mb-4 block">⚠️</span>
              <p className="text-red-700 font-arabic">{error}</p>
            </div>
          ) : (
            <>
              {activeTab === "overview" && (
                <AdminStatsCards stats={stats} />
              )}

              {activeTab === "users" && (
                <AdminUsersTab
                  users={users}
                  onDeleteConfirm={handleDeleteUser}
                  deleteConfirm={deleteConfirm}
                  setDeleteConfirm={setDeleteConfirm}
                  setShowUserModal={setShowUserModal}
                />
              )}

              {activeTab === "batches" && (
                <AdminBatchesTab
                  batches={batches}
                  onDeleteConfirm={handleDeleteBatch}
                  deleteConfirm={deleteConfirm}
                  setDeleteConfirm={setDeleteConfirm}
                  setShowBatchModal={setShowBatchModal}
                />
              )}
            </>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
