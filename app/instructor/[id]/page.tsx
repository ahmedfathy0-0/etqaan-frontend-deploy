import Header from "@/components/Header";
import BackgroundPattern from "@/components/BackgroundPattern";
import InstructorOverview from "@/components/instructor/InstructorOverview";
import UpcomingLectures from "@/components/instructor/UpcomingLectures";
import StudentFeedback from "@/components/instructor/StudentFeedback";
import StudentsManagement from "@/components/instructor/StudentsManagement";
import QuickStats from "@/components/instructor/QuickStats";

export default async function InstructorDashboard({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="bg-success-50 min-h-screen font-cairo" dir="rtl">
      <Header />

      <main className="p-6 max-w-7xl mx-auto py-12">
          {/* Welcome Section */}
          <InstructorOverview instructorId={id} />

          {/* Quick Stats */}
          <QuickStats />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            {/* Left Column - Lectures & Feedback */}
            <div className="lg:col-span-2 space-y-8">
              <UpcomingLectures />
              <StudentFeedback />
            </div>

            {/* Right Column - Students Management */}
            <div className="lg:col-span-1">
              <StudentsManagement />
            </div>
          </div>
        </main>
    </div>
  );
}
