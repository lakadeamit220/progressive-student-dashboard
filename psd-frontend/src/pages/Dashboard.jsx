import React, { useEffect, useState } from 'react';
import useAuthStore from '../store/authStore';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import SummaryCard from '../components/SummaryCard';
import { Clock, CheckCircle, BookOpen } from 'lucide-react';

import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend 
} from 'recharts';

const COLORS = ['#a855f7', '#3b82f6', '#ec4899', '#14b8a6', '#f59e0b'];

const Dashboard = () => {
  const { user } = useAuthStore();
  const [metrics, setMetrics] = useState({
    totalTimeSpent: 0,
    completedLessons: 0,
    coursesActive: 0,
    trendData: [],
    distributionData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await api.get('/progress/dashboard');
        setMetrics({
          totalTimeSpent: data.totalTimeSpent,
          completedLessons: data.completedLessons,
          coursesActive: data.distributionData.length,
          trendData: data.trendData,
          distributionData: data.distributionData
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-10">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Welcome back, {user?.name.split(' ')[0]}!
            </h1>
            <p className="text-slate-500">
              Here is your learning progress overview.
            </p>
          </header>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <>
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

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Trend Chart */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold mb-6 text-slate-800">Learning Activity (Time Spent)</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={metrics.trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={32}>
                        <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickMargin={10} />
                        <YAxis stroke="#94a3b8" fontSize={12} />
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px' }}
                          itemStyle={{ color: '#0f172a' }}
                          cursor={{ fill: '#f8fafc' }}
                        />
                        <Bar dataKey="timeSpent" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Distribution Chart */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold mb-6 text-slate-800">Course Completion</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={metrics.distributionData}
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="completedLessons"
                        >
                          {metrics.distributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', color: '#0f172a' }}
                        />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
