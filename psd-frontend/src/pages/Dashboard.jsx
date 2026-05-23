import React from 'react';
import useAuthStore from '../store/authStore';

const Dashboard = () => {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Dashboard (Placeholder)</h1>
        <p className="mb-4">Welcome back, {user?.name}!</p>
        <button 
          onClick={logout}
          className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/30"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
