"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import LeaderboardPreview from "@/components/public/LeaderboardPreview";
import Link from "next/link";
import PageLoader from "@/components/ui/PageLoader";
import StudentStatsCards from "@/components/student/StudentStatsCards";
import RecentSessionsList from "@/components/student/RecentSessionsList";
import MyBatchesList from "@/components/student/MyBatchesList";
import QuickTips from "@/components/student/QuickTips";

interface Batch {
  id: number;
  name: string;
  schedule_description?: string;
  rank?: number;
  points?: number;
}

interface RecentSession {
  id: number;
  date: string;
  attendance: string;
  jadeed_grade?: string;
  muraja_grade?: string;
}

export default function StudentDashboardPage() {
  const { user, logout } = useAuth();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [recentSessions, setRecentSessions] = useState<RecentSession[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPoints, setTotalPoints] = useState(0);
  const [myRank, setMyRank] = useState(0);

  useEffect(() => {
    // Mock data for development
    setTimeout(() => {
      setBatches([
        {
          id: 1,
          name: "حلقة الأسود 🦁",
          schedule_description: "السبت والاثنين والأربعاء",
          rank: 3,
          points: 120,
        },
      ]);
      setRecentSessions([
        {
          id: 1,
          date: "2026-02-05",
          attendance: "حاضر",
          jadeed_grade: "ممتاز",
          muraja_grade: "جيد جداً",
        },
        {
          id: 2,
          date: "2026-02-03",
          attendance: "حاضر",
          jadeed_grade: "جيد جداً",
          muraja_grade: "ممتاز",
        },
        {
          id: 3,
          date: "2026-02-01",
          attendance: "متأخر",
          jadeed_grade: "جيد",
          muraja_grade: "-",
        },
      ]);
      setLeaderboard([
        { id: 1, name: "عبدالرحمن أحمد", points: 150, avatarIndex: 0 },
        { id: 2, name: "محمد علي", points: 135, avatarIndex: 1 },
        { id: 3, name: "يوسف خالد", points: 120, avatarIndex: 2 },
      ]);
      setTotalPoints(120);
      setMyRank(3);
      setIsLoading(false);
    }, 500);
  }, []);

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 shadow-lg">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold font-arabic flex items-center gap-3">
                  <span className="text-3xl">🎓</span>
                  لوحة الطالب
                </h1>
                <p className="text-blue-100 font-arabic mt-1">
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
              <StudentStatsCards
                totalPoints={totalPoints}
                myRank={myRank}
                batchesCount={batches.length}
              />

              {/* Main Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Sessions */}
                <div className="lg:col-span-2">
                  <RecentSessionsList sessions={recentSessions} />

                  {/* My Batches */}
                  <MyBatchesList batches={batches} />
                </div>

                {/* Sidebar - Leaderboard */}
                <div className="lg:col-span-1">
                  <LeaderboardPreview students={leaderboard} />

                  {/* Quick Tips */}
                  <QuickTips />
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
