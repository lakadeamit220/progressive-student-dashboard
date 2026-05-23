import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';
import { Loader2, Users, Search, ChevronRight, Download, MessageSquare, X } from 'lucide-react';
import toast from 'react-hot-toast';

const MentorDashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState([]);
  const [recommendModal, setRecommendModal] = useState({ isOpen: false, student: null });
  const [recommendForm, setRecommendForm] = useState({ courseId: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mentorRes, coursesRes] = await Promise.all([
          api.get('/progress/mentor'),
          api.get('/courses')
        ]);
        setStudents(mentorRes.data);
        setCourses(coursesRes.data);
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleExportCSV = () => {
    if (students.length === 0) return;

    // Create CSV Header
    const headers = ['Name', 'Email', 'Completed Lessons', 'Total Time Spent (mins)', 'Last Active'];
    
    // Create CSV Rows
    const csvRows = students.map(s => {
      return [
        `"${s.name}"`,
        `"${s.email}"`,
        s.completedLessons,
        s.totalTimeSpent,
        `"${new Date(s.lastActive).toLocaleDateString()}"`
      ].join(',');
    });

    // Combine Header and Rows
    const csvContent = [headers.join(','), ...csvRows].join('\n');

    // Create Blob and Download Link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'student_progress_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const submitRecommendation = async () => {
    if (!recommendForm.courseId) return toast.error("Please select a course");
    setSubmitting(true);
    try {
      await api.post('/progress/recommend', {
        studentId: recommendModal.student._id,
        courseId: recommendForm.courseId,
        message: recommendForm.message || 'Your mentor recommends you check out this course!'
      });
      toast.success(`Recommendation sent to ${recommendModal.student.name}!`);
      setRecommendModal({ isOpen: false, student: null });
      setRecommendForm({ courseId: '', message: '' });
    } catch (error) {
      toast.error("Failed to send recommendation");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                <Users className="w-8 h-8 text-indigo-600" />
                Mentor Dashboard
              </h1>
              <p className="text-slate-500">Monitor your students' learning progress and engagement.</p>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
              <div className="relative w-full md:w-72">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 shadow-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-sm"
                />
              </div>
              <button
                onClick={handleExportCSV}
                disabled={students.length === 0}
                className="w-full md:w-auto px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </header>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Student</th>
                      <th className="px-6 py-4">Completed Lessons</th>
                      <th className="px-6 py-4">Total Time Spent</th>
                      <th className="px-6 py-4">Last Active</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                          No students found matching your search.
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((student) => (
                        <tr key={student._id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                                {student.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-semibold text-slate-900">{student.name}</div>
                                <div className="text-xs text-slate-500">{student.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {student.completedLessons} Lessons
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-700">
                            {student.totalTimeSpent} mins
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                            {new Date(student.lastActive).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-3">
                              <button 
                                onClick={() => setRecommendModal({ isOpen: true, student })}
                                className="text-indigo-600 hover:text-indigo-900 inline-flex items-center group transition-colors"
                              >
                                <MessageSquare className="w-4 h-4 mr-1" />
                                Recommend
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Recommendation Modal */}
      {recommendModal.isOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Recommend Course</h3>
              <button onClick={() => setRecommendModal({ isOpen: false, student: null })} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-slate-500 mb-6">Send a customized course recommendation directly to <strong>{recommendModal.student?.name}</strong>.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Select Course</label>
                <select 
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
                  value={recommendForm.courseId}
                  onChange={(e) => setRecommendForm({...recommendForm, courseId: e.target.value})}
                >
                  <option value="">-- Choose a course --</option>
                  {courses.map(c => (
                    <option key={c._id} value={c._id}>{c.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Custom Message (Optional)</label>
                <textarea 
                  rows="3"
                  placeholder="I noticed you struggling with X, this course might help!"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
                  value={recommendForm.message}
                  onChange={(e) => setRecommendForm({...recommendForm, message: e.target.value})}
                ></textarea>
              </div>
              <div className="pt-2">
                <button 
                  onClick={submitRecommendation}
                  disabled={submitting}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-70 flex items-center justify-center"
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Recommendation'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorDashboard;
