"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import PageLoader from "@/components/ui/PageLoader";
import { useAdminStats } from "@/queries/useAdmin";
import { useUsers, useDeleteUser } from "@/queries/useUsers";
import { useBatches, useDeleteBatch } from "@/queries/useBatches";
import { useStudents, useDeleteStudent } from "@/queries/useStudents";
import AdminStatsCards from "@/components/admin/AdminStatsCards";
import AdminUsersTab from "@/components/admin/AdminUsersTab";
import AdminStudentsTab from "@/components/admin/AdminStudentsTab";
import AdminBatchesTab from "@/components/admin/AdminBatchesTab";
import { AdminSidebar, TabId } from "@/components/admin/AdminSidebar";

// Modals and Headers
import AdminHeader from "@/components/admin/AdminHeader";
import AdminMobileActions from "@/components/admin/AdminMobileActions";
import AdminUserModal from "@/components/admin/modals/AdminUserModal";
import AdminBatchModal from "@/components/admin/modals/AdminBatchModal";
import AdminStudentModal from "@/components/admin/modals/AdminStudentModal";
import { Alert02, Clock01 } from "@dga-icons/react/duotone-rounded";

export default function AdminDashboard() {
  const { token, logout } = useAuth();
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
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  // Modals Visibility
  const [showUserModal, setShowUserModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);

  // Edit Targets
  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [editUserInitialData, setEditUserInitialData] = useState<any>(undefined);

  const [editBatchId, setEditBatchId] = useState<number | null>(null);
  const [editBatchInitialData, setEditBatchInitialData] = useState<any>(undefined);

  const [editStudentId, setEditStudentId] = useState<number | null>(null);
  const [editStudentInitialData, setEditStudentInitialData] = useState<any>(undefined);

  const { mutateAsync: deleteUserMutate } = useDeleteUser();
  const { mutateAsync: deleteBatchMutate } = useDeleteBatch();
  const { mutateAsync: deleteStudentMutate } = useDeleteStudent();

  const handleEditUser = (u: any) => {
    setEditUserId(u.id);
    setEditUserInitialData({
      name: u.name,
      email: u.email,
      password: u.plain_password || "",
      role: u.role,
    });
    setShowUserModal(true);
  };

  const closeUserModal = () => {
    setShowUserModal(false);
    setEditUserId(null);
    setEditUserInitialData(undefined);
  };

  const handleEditBatch = (batch: any) => {
    setEditBatchId(batch.id);
    setEditBatchInitialData({
      name: batch.name,
      schedule_description: batch.schedule_description || "",
      term_id: batch.term_id || 1,
      sheikh_ids: batch.batch_sheikhs?.map((bs: any) => bs.sheikh?.id).filter(Boolean) || [],
    });
    setShowBatchModal(true);
  };

  const closeBatchModal = () => {
    setShowBatchModal(false);
    setEditBatchId(null);
    setEditBatchInitialData(undefined);
  };

  const handleEditStudent = (student: any) => {
    setEditStudentId(student.id);
    setEditStudentInitialData({
      full_name: student.full_name,
      guardian_name: student.guardian_name || "",
      guardian_phone: student.guardian_phone || "",
      gender: student.gender || "male",
      user_id: student.user_id,
      email: student.user?.email || "",
      password: student.user?.plain_password || "",
    });
    setShowStudentModal(true);
  };

  const closeStudentModal = () => {
    setShowStudentModal(false);
    setEditStudentId(null);
    setEditStudentInitialData(undefined);
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

  return (
    <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
      <div className="min-h-screen bg-success-50 font-cairo flex flex-col">
        
        <AdminHeader 
          onLogout={logout} 
          onAddUser={() => setShowUserModal(true)} 
          onAddBatch={() => setShowBatchModal(true)} 
          onToggleMenu={() => setMobileMenuOpen((open) => !open)}
          activeTab={activeTab}
        />

        {mobileMenuOpen && (
          <div className="fixed inset-0 top-[149px] z-40 bg-black/30 lg:hidden" onClick={() => setMobileMenuOpen(false)}>
            <div className="h-full w-[280px] bg-white" onClick={(event) => event.stopPropagation()}>
              <AdminSidebar
                activeTab={activeTab}
                setActiveTab={(tab) => {
                  setActiveTab(tab);
                  setMobileMenuOpen(false);
                }}
                mobile
              />
            </div>
          </div>
        )}

        <div className="flex flex-1 flex-col bg-success-50 lg:flex-row lg:gap-4 lg:bg-white lg:px-[10px] lg:py-2">
          {/* Desktop Sidebar */}
          <div className="hidden w-[250px] shrink-0 bg-white lg:block">
            <div className="sticky top-[122px] h-[calc(100vh-130px)] min-h-[702px] overflow-y-auto overflow-x-hidden">
              <AdminSidebar 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
              />
            </div>
          </div>

          {/* Main Content Area */}
          <main className="w-full min-w-0 flex-1 pb-[96px] lg:w-auto lg:pb-0">
            {isLoading ? (
              <PageLoader />
            ) : error ? (
              <div className="bg-danger-50 border-2 border-danger-200 p-6 text-center">
                <Alert02 aria-hidden="true" size={40} className="mx-auto mb-4" />
                <p className="text-danger-700 font-bold font-cairo">{error}</p>
              </div>
            ) : (
              <div className="min-h-[500px] w-full animate-fade-in overflow-x-hidden p-4 lg:px-6 lg:py-8">
                {activeTab === "overview" && (
                  <AdminStatsCards 
                    stats={stats} 
                  />
                )}

                {activeTab === "users" && (
                  <div className="animate-slide-up">
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
                  <div className="animate-slide-up">
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
                  <div className="animate-slide-up">
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

                {(activeTab === "quotes" || activeTab === "notices") && (
                  <div className="flex flex-col items-center justify-center min-h-[400px] text-neutral-500 animate-slide-up">
                    <Clock01 aria-hidden="true" size={64} className="mb-4 text-neutral-300" />
                    <h2 className="text-2xl font-bold font-cairo mb-2">قريباً</h2>
                    <p className="font-cairo">هذا القسم قيد التطوير وسيتم إضافته قريباً.</p>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>

        <AdminMobileActions 
          onAddBatch={() => setShowBatchModal(true)}
          onAddUser={() => setShowUserModal(true)}
          activeTab={activeTab}
        />

        <AdminUserModal 
          isOpen={showUserModal} 
          onClose={closeUserModal} 
          editUserId={editUserId} 
          initialData={editUserInitialData} 
        />
        
        <AdminBatchModal 
          isOpen={showBatchModal} 
          onClose={closeBatchModal} 
          editBatchId={editBatchId} 
          initialData={editBatchInitialData} 
          users={users} 
        />
        
        <AdminStudentModal 
          isOpen={showStudentModal} 
          onClose={closeStudentModal} 
          editStudentId={editStudentId} 
          initialData={editStudentInitialData} 
        />

      </div>
    </ProtectedRoute>
  );
}
