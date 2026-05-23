import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import { PlayCircle, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const CoursePlayer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [completedLessonIds, setCompletedLessonIds] = useState(new Set()); // Simulating local state for UI responsiveness

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const [lessonsRes, completedRes] = await Promise.all([
          api.get(`/courses/${courseId}/lessons`),
          api.get(`/progress/course/${courseId}/completed`)
        ]);
        
        setLessons(lessonsRes.data);
        setCompletedLessonIds(new Set(completedRes.data));

        if (lessonsRes.data.length > 0) {
          // Find the first uncompleted lesson to show by default
          const firstUncompleted = lessonsRes.data.find(l => !completedRes.data.includes(l._id));
          setCurrentLesson(firstUncompleted || lessonsRes.data[0]);
        }
      } catch (error) {
        console.error('Failed to fetch lessons:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, [courseId]);

  const handleMarkComplete = async () => {
    if (!currentLesson || marking || completedLessonIds.has(currentLesson._id)) return;
    
    setMarking(true);
    try {
      // POST event to log progress (hardcoded 15 mins for demonstration)
      await api.post('/progress/event', {
        courseId,
        lessonId: currentLesson._id,
        timeSpent: 15,
        status: 'completed'
      });
      
      // Update local state to reflect completion instantly in the UI
      setCompletedLessonIds(prev => new Set(prev).add(currentLesson._id));
      toast.success('Lesson marked as complete!');
    } catch (error) {
      console.error('Failed to mark lesson as complete:', error);
      toast.error('Failed to update progress.');
    } finally {
      setMarking(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      <Sidebar />
      <main className="flex-1 ml-64 flex flex-col">
        
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 p-4 px-8 flex items-center justify-between sticky top-0 z-10">
          <button 
            onClick={() => navigate('/courses')}
            className="flex items-center text-slate-500 hover:text-slate-800 transition-colors font-medium text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Courses
          </button>
          <div className="flex gap-2 items-center">
            <span className="text-sm text-slate-500 font-medium">
              {completedLessonIds.size} / {lessons.length} Completed
            </span>
          </div>
        </header>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
          </div>
        ) : (
          <div className="flex-1 flex overflow-hidden">
            
            {/* Main Video/Content Area */}
            <div className="flex-1 flex flex-col bg-slate-50 p-8 overflow-y-auto">
              <div className="max-w-4xl mx-auto w-full">
                
                {/* Video Placeholder */}
                <div className="w-full aspect-video bg-slate-900 rounded-2xl shadow-lg flex flex-col items-center justify-center text-white relative overflow-hidden group">
                  <PlayCircle className="w-20 h-20 text-white/50 group-hover:text-white/80 group-hover:scale-110 transition-all cursor-pointer" />
                  <p className="mt-4 text-slate-400 font-medium text-sm">Interactive Video Placeholder</p>
                </div>

                {/* Lesson Info & Action */}
                <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">{currentLesson?.title}</h1>
                    <p className="text-slate-500">Lesson {currentLesson?.orderIndex}</p>
                  </div>
                  
                  <button
                    onClick={handleMarkComplete}
                    disabled={marking || completedLessonIds.has(currentLesson?._id)}
                    className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all ${
                      completedLessonIds.has(currentLesson?._id)
                        ? 'bg-green-100 text-green-700 cursor-default'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20'
                    }`}
                  >
                    {marking ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                    {completedLessonIds.has(currentLesson?._id) ? 'Completed' : 'Mark as Complete'}
                  </button>
                </div>

              </div>
            </div>

            {/* Right Sidebar (Lesson List) */}
            <div className="w-80 bg-white border-l border-slate-200 overflow-y-auto flex flex-col shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)]">
              <div className="p-6 border-b border-slate-100">
                <h3 className="font-bold text-slate-800">Course Content</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {lessons.map((lesson) => (
                  <button
                    key={lesson._id}
                    onClick={() => setCurrentLesson(lesson)}
                    className={`w-full text-left p-4 rounded-xl flex items-start gap-3 transition-colors ${
                      currentLesson?._id === lesson._id
                        ? 'bg-indigo-50 border border-indigo-100'
                        : 'hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div className="mt-0.5">
                      {completedLessonIds.has(lesson._id) ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <PlayCircle className={`w-5 h-5 ${currentLesson?._id === lesson._id ? 'text-indigo-600' : 'text-slate-400'}`} />
                      )}
                    </div>
                    <div>
                      <p className={`font-medium text-sm leading-tight ${currentLesson?._id === lesson._id ? 'text-indigo-900' : 'text-slate-700'}`}>
                        {lesson.title}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">Lesson {lesson.orderIndex}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default CoursePlayer;
