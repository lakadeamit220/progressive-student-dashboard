import React, { useEffect, useState } from 'react';
import useAuthStore from '../store/authStore';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import SummaryCard from '../components/SummaryCard';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle, BookOpen, ArrowRight, PlayCircle, MessageSquare } from 'lucide-react';

import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
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
          distributionData: data.distributionData,
          recommendedLesson: data.recommendedLesson
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
              Welcome back, {user?.name?.split(' ')[0]}!
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {metrics.recommendedLesson && (
                  <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl p-6 shadow-lg shadow-indigo-600/20 text-white flex flex-col justify-between gap-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shrink-0">
                        <PlayCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-indigo-200 text-sm font-medium mb-1">Recommended Next Step in {metrics.recommendedLesson.courseTitle}</p>
                        <h3 className="text-xl font-bold">{metrics.recommendedLesson.lessonTitle}</h3>
                      </div>
                    </div>
                    <Link 
                      to={`/courses/${metrics.recommendedLesson.courseId}`}
                      className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
                    >
                      Continue Learning
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}

                {/* Static Mentor Recommendation */}
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 shadow-lg shadow-emerald-600/20 text-white flex flex-col justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shrink-0">
                      <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-emerald-100 text-sm font-medium mb-1">Note from your Mentor</p>
                      <h3 className="text-lg font-medium italic">"You're making excellent progress! Try to wrap up the foundational lessons this week so we can move on to the advanced projects."</h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
                      MA
                    </div>
                    <span className="text-sm font-medium text-emerald-50">Mentor Admin</span>
                  </div>
                </div>
              </div>

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
                      <LineChart data={metrics.trendData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                        <XAxis 
                          dataKey="date" 
                          stroke="#94a3b8" 
                          fontSize={12} 
                          tickMargin={12} 
                          axisLine={false} 
                          tickLine={false}
                        />
                        <YAxis 
                          stroke="#94a3b8" 
                          fontSize={12} 
                          axisLine={false} 
                          tickLine={false} 
                        />
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#ffffff', 
                            borderColor: '#e2e8f0', 
                            borderRadius: '12px',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                          }}
                          itemStyle={{ color: '#0f172a', fontWeight: '600' }}
                          cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="timeSpent" 
                          stroke="#6366f1" 
                          strokeWidth={4} 
                          dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#ffffff' }}
                          activeDot={{ r: 8, fill: '#4f46e5', strokeWidth: 2, stroke: '#ffffff' }}
                        />
                      </LineChart>
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
