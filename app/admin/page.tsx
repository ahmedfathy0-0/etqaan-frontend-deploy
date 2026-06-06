"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import PageLoader from "@/components/ui/PageLoader";
import MultiSearchableSelect from "@/components/ui/MultiSearchableSelect";
import Modal from "@/components/ui/Modal";
import { useAdminStats } from "@/queries/useAdmin";
import { useUsers, useCreateUser, useDeleteUser, useUpdateUser } from "@/queries/useUsers";
import { useBatches, useCreateBatch, useDeleteBatch, useUpdateBatch } from "@/queries/useBatches";
import { useStudents, useCreateStudent, useUpdateStudent, useDeleteStudent } from "@/queries/useStudents";
import AdminStatsCards from "@/components/admin/AdminStatsCards";
import AdminUsersTab from "@/components/admin/AdminUsersTab";
import AdminStudentsTab from "@/components/admin/AdminStudentsTab";
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
  const { user, token, logout } = useAuth();
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
  const { data: students = [], isLoading: loadingStudents } = useStudents();
  
  const isLoading = loadingStats || loadingUsers || loadingBatches || loadingStudents;
  const error = ""; 
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "students" | "batches">(
    "overview",
  );
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const [showUserModal, setShowUserModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [editBatchId, setEditBatchId] = useState<number | null>(null);

  const [editUserId, setEditUserId] = useState<number | null>(null);

  const [showStudentModal, setShowStudentModal] = useState(false);
  const [editStudentId, setEditStudentId] = useState<number | null>(null);
  const [newStudent, setNewStudent] = useState({
    full_name: "",
    guardian_name: "",
    guardian_phone: "",
    gender: "male" as "male" | "female",
  });

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
  const { mutateAsync: updateUserMutate } = useUpdateUser();
  const { mutateAsync: createBatchMutate } = useCreateBatch();
  const { mutateAsync: updateBatchMutate } = useUpdateBatch();
  const { mutateAsync: deleteUserMutate } = useDeleteUser();
  const { mutateAsync: deleteBatchMutate } = useDeleteBatch();
  const { mutateAsync: createStudentMutate } = useCreateStudent();
  const { mutateAsync: updateStudentMutate } = useUpdateStudent();
  const { mutateAsync: deleteStudentMutate } = useDeleteStudent();

  const handleEditUser = (user: any) => {
    setEditUserId(user.id);
    setNewUser({
      name: user.name,
      email: user.email,
      password: user.plain_password || "",
      role: user.role,
    });
    setShowUserModal(true);
  };

  const closeUserModal = () => {
    setShowUserModal(false);
    setEditUserId(null);
    setNewUser({ name: "", email: "", password: "", role: "sheikh" });
  };

  const handleEditBatch = (batch: any) => {
    setEditBatchId(batch.id);
    setNewBatch({
      name: batch.name,
      schedule_description: batch.schedule_description || "",
      term_id: batch.term_id || 1,
      sheikh_ids: batch.batch_sheikhs?.map((bs: any) => bs.sheikh?.id).filter(Boolean) || [],
    });
    setShowBatchModal(true);
  };

  const handleEditStudent = (student: any) => {
    setEditStudentId(student.id);
    setNewStudent({
      full_name: student.full_name,
      guardian_name: student.guardian_name || "",
      guardian_phone: student.guardian_phone || "",
      gender: student.gender || "male",
    });
    setShowStudentModal(true);
  };

  const closeStudentModal = () => {
    setShowStudentModal(false);
    setEditStudentId(null);
    setNewStudent({
      full_name: "",
      guardian_name: "",
      guardian_phone: "",
      gender: "male",
    });
  };

  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setFormLoading(true);
    setFormError("");

    try {
      if (editStudentId) {
        await updateStudentMutate({ id: editStudentId, data: newStudent });
      } else {
        await createStudentMutate(newStudent);
      }
      closeStudentModal();
    } catch (err: any) {
      console.error("Error saving student:", err);
      setFormError(err.response?.data?.message || "حدث خطأ أثناء حفظ الطالب");
    } finally {
      setFormLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setFormLoading(true);
    setFormError("");

    try {
      if (editUserId) {
        // If editing, only send password if it's not empty, otherwise don't send it to avoid overwriting with empty
        const dataToUpdate = { ...newUser };
        if (!dataToUpdate.password) {
          delete (dataToUpdate as any).password;
        }
        await updateUserMutate({ id: editUserId, data: dataToUpdate });
      } else {
        await createUserMutate(newUser);
      }
      closeUserModal();
    } catch (err: any) {
      console.error("Error saving user:", err);
      setFormError(err.response?.data?.message || "حدث خطأ أثناء حفظ المستخدم");
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
      if (editBatchId) {
        await updateBatchMutate({ batchId: editBatchId, data: newBatch });
      } else {
        await createBatchMutate(newBatch);
      }
      setShowBatchModal(false);
      setEditBatchId(null);
      setNewBatch({
        name: "",
        schedule_description: "",
        term_id: 1,
        sheikh_ids: [],
      });
    } catch (err: any) {
      console.error("Error saving batch:", err);
      setFormError(err.response?.data?.message || "حدث خطأ أثناء حفظ الحلقة");
    } finally {
      setFormLoading(false);
    }
  };

  const closeBatchModal = () => {
    setShowBatchModal(false);
    setEditBatchId(null);
    setNewBatch({
      name: "",
      schedule_description: "",
      term_id: 1,
      sheikh_ids: [],
    });
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

  const handleDeleteStudent = async (studentId: number) => {
    if (!token) return;

    try {
      await deleteStudentMutate(studentId);
      setDeleteConfirm(null);
    } catch (err: any) {
      console.error("Error deleting student:", err);
      alert(err.response?.data?.message || "حدث خطأ أثناء حذف الطالب");
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
          onClose={closeUserModal}
          title={editUserId ? "✏️ تعديل مستخدم" : "➕ إضافة مستخدم جديد"}
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
                كلمة المرور {editUserId && "(اتركها فارغة لعدم التغيير)"}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white"
                  placeholder={editUserId ? "كلمة المرور الجديدة" : "كلمة المرور"}
                  dir="ltr"
                  required={!editUserId}
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
                type="button"
                onClick={closeUserModal}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-arabic font-semibold hover:bg-gray-200 transition-colors"
                disabled={formLoading}
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-arabic font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={formLoading}
              >
                {formLoading ? "جاري الحفظ..." : editUserId ? "حفظ التعديلات" : "إضافة مستخدم"}
              </button>
            </div>
          </form>
        </Modal>

        <Modal
          isOpen={showBatchModal}
          onClose={closeBatchModal}
          title={editBatchId ? "✏️ تحديث الحلقة" : "📚 إنشاء حلقة جديدة"}
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
                  .filter((u) => ["sheikh", "admin", "super_admin"].includes(u.role))
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
                {formLoading ? (editBatchId ? "جاري التحديث..." : "جاري الإنشاء...") : (editBatchId ? "تحديث الحلقة" : "إنشاء الحلقة")}
              </button>
              <button
                type="button"
                onClick={closeBatchModal}
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
                onClick={logout}
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
                { id: "students", label: "الطلاب", icon: "👨‍🎓" },
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
                <div className="animate-fadeIn">
                  <AdminUsersTab
                    users={users}
                    onDeleteConfirm={handleDeleteUser}
                    deleteConfirm={deleteConfirm}
                    setDeleteConfirm={setDeleteConfirm}
                    setShowUserModal={setShowUserModal}
                    onEditUser={handleEditUser}
                  />
                </div>
              )}

              {activeTab === "students" && (
                <div className="animate-fadeIn">
                  <AdminStudentsTab
                    students={students}
                    onDeleteConfirm={handleDeleteStudent}
                    deleteConfirm={deleteConfirm}
                    setDeleteConfirm={setDeleteConfirm}
                    setShowStudentModal={setShowStudentModal}
                    onEditStudent={handleEditStudent}
                  />
                </div>
              )}

              {activeTab === "batches" && (
                <div className="animate-fadeIn">
                  <AdminBatchesTab
                    batches={batches}
                    onDeleteConfirm={handleDeleteBatch}
                    deleteConfirm={deleteConfirm}
                    setDeleteConfirm={setDeleteConfirm}
                    setShowBatchModal={setShowBatchModal}
                    onEditBatch={handleEditBatch}
                  />
                </div>
              )}
            </>
          )}

          <Modal
            isOpen={showStudentModal}
            onClose={closeStudentModal}
            title={editStudentId ? "✏️ تعديل طالب" : "➕ إضافة طالب جديد"}
          >
            <form onSubmit={handleSaveStudent} className="space-y-4">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl font-arabic text-sm">
                  {formError}
                </div>
              )}

              <div>
                <label className="block font-arabic text-gray-700 mb-1">
                  اسم الطالب
                </label>
                <input
                  type="text"
                  value={newStudent.full_name}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, full_name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-arabic text-gray-900 bg-white"
                  placeholder="أدخل اسم الطالب رباعي"
                  required
                />
              </div>

              <div>
                <label className="block font-arabic text-gray-700 mb-1">
                  اسم ولي الأمر
                </label>
                <input
                  type="text"
                  value={newStudent.guardian_name}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, guardian_name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-arabic text-gray-900 bg-white"
                  placeholder="أدخل اسم ولي الأمر"
                />
              </div>

              <div>
                <label className="block font-arabic text-gray-700 mb-1">
                  رقم جوال ولي الأمر
                </label>
                <input
                  type="tel"
                  value={newStudent.guardian_phone}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, guardian_phone: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-arabic text-gray-900 bg-white"
                  placeholder="05XXXXXXXX"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block font-arabic text-gray-700 mb-1">
                  الجنس
                </label>
                <select
                  value={newStudent.gender}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, gender: e.target.value as "male" | "female" })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-arabic text-gray-900 bg-white"
                >
                  <option value="male">ذكر</option>
                  <option value="female">أنثى</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeStudentModal}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-arabic font-semibold hover:bg-gray-200 transition-colors"
                  disabled={formLoading}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-arabic font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                  disabled={formLoading}
                >
                  {formLoading ? "جاري الحفظ..." : editStudentId ? "حفظ التعديلات" : "إضافة طالب"}
                </button>
              </div>
            </form>
          </Modal>
        </main>
      </div>
    </ProtectedRoute>
  );
}
