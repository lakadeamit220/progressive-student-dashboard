import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { BookOpen, TrendingUp, Users, ArrowRight } from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <nav className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl tracking-tight">
            <BookOpen className="w-6 h-6" />
            ProgDash
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Sign In
            </Link>
            <Link 
              to="/login" 
              className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-indigo-700 hover:shadow-indigo-600/20 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 text-center">
        <div className="max-w-4xl mx-auto relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
            Master your skills with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-sky-500">intelligent tracking.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto">
            Progressive Student Dashboard helps you stay focused, learn faster, and track your educational journey with powerful analytics and interactive courses.
          </p>
          <div className="flex items-center justify-center gap-4 flex-col sm:flex-row">
            <Link 
              to="/login"
              className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 group"
            >
              Start Learning Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything you need to succeed</h2>
            <p className="text-slate-500">Built for students and mentors alike.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:border-indigo-100 transition-colors">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Visual Progress</h3>
              <p className="text-slate-500 leading-relaxed">
                Watch your knowledge grow with beautiful data visualizations tracking every minute of your learning journey.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:border-indigo-100 transition-colors">
              <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center mb-6">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Interactive Courses</h3>
              <p className="text-slate-500 leading-relaxed">
                Dive deep into meticulously structured lessons with an intuitive, distraction-free player environment.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:border-indigo-100 transition-colors">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Mentor Dashboard</h3>
              <p className="text-slate-500 leading-relaxed">
                Teachers get a bird's-eye view of their entire class, identifying top performers and those who need a hand.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Progressive Student Dashboard. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
