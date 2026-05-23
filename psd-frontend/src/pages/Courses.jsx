import React from 'react';
import Sidebar from '../components/Sidebar';

const Courses = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">My Courses</h1>
          <p className="text-slate-400 mb-10">Manage and view your enrolled courses here.</p>
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 border-dashed flex items-center justify-center">
            <p className="text-slate-500 font-medium">Course list coming soon...</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Courses;
