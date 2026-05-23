import React from 'react';
import { NavLink } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { LayoutDashboard, BookOpen, Clock, LogOut, User as UserIcon } from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuthStore();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'My Courses', path: '/courses', icon: <BookOpen className="w-5 h-5" /> },
    { name: 'History', path: '/history', icon: <Clock className="w-5 h-5" /> },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen fixed left-0 top-0 shadow-sm">
      <div className="p-6">
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-indigo-600" />
          Progressive
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
            <UserIcon className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate capitalize">{user?.role}</p>
          </div>
        </div>
        
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
