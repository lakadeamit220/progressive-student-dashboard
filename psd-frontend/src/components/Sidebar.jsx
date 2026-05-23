import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Clock, Settings, LogOut, Users } from 'lucide-react';
import useAuthStore from '../store/authStore';

const Sidebar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const studentLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'My Courses', path: '/courses', icon: <BookOpen size={20} /> },
    { name: 'History', path: '/history', icon: <Clock size={20} /> },
  ];

  const mentorLinks = [
    { name: 'Mentor Dashboard', path: '/mentor-dashboard', icon: <Users size={20} /> },
  ];

  const commonLinks = [
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  const navLinks = user?.role === 'mentor' 
    ? [...mentorLinks, ...commonLinks] 
    : [...studentLinks, ...commonLinks];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 h-screen bg-white border-r border-slate-200 fixed left-0 top-0 flex flex-col z-20 shadow-sm">
      <div className="p-6">
        <div className="flex items-center gap-3 text-indigo-600 mb-2">
          <BookOpen size={28} className="drop-shadow-md" />
          <h2 className="text-2xl font-bold tracking-tight">ProgDash</h2>
        </div>
        <div className="text-xs font-semibold text-slate-400 tracking-wider uppercase ml-10">
          {user?.role === 'mentor' ? 'Mentor Portal' : 'Student Portal'}
        </div>
      </div>

      <nav className="flex-1 px-4 mt-6">
        <ul className="space-y-2">
          {navLinks.map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                {link.icon}
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 px-4 py-3 mb-4 rounded-xl bg-slate-50 border border-slate-100">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all font-medium"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
