import React, { useEffect, useState } from 'react';
import useAuthStore from '../store/authStore';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import SummaryCard from '../components/SummaryCard';
import { Clock, CheckCircle, BookOpen } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [metrics, setMetrics] = useState({
    totalTimeSpent: 0,
    completedLessons: 0,
    coursesActive: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await api.get('/progress/dashboard');
        setMetrics({
          totalTimeSpent: data.totalTimeSpent,
          completedLessons: data.completedLessons,
          coursesActive: data.distributionData.length
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-10">
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {user?.name.split(' ')[0]}! 👋
            </h1>
            <p className="text-slate-400">
              Here is your learning progress overview.
            </p>
          </header>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <SummaryCard 
                title="Total Time Spent" 
                value={`${metrics.totalTimeSpent} min`}
                icon={<Clock className="w-6 h-6" />}
                colorClass="bg-blue-500"
              />
              <SummaryCard 
                title="Lessons Completed" 
                value={metrics.completedLessons}
                icon={<CheckCircle className="w-6 h-6" />}
                colorClass="bg-purple-500"
              />
              <SummaryCard 
                title="Active Courses" 
                value={metrics.coursesActive}
                icon={<BookOpen className="w-6 h-6" />}
                colorClass="bg-pink-500"
              />
            </div>
          )}

          {/* Placeholder for Recharts in Phase 7 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex items-center justify-center h-64 border-dashed">
            <p className="text-slate-500 font-medium">Visualizations will be added in Phase 7</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
