import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Calendar, Users, DollarSign, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import RoleSwitcher from './RoleSwitcher';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', roles: ['admin', 'manager', 'employee'] },
    { name: 'Chat', icon: MessageSquare, path: '/chat', roles: ['admin', 'manager', 'employee'] },
    { name: 'Leaves', icon: Calendar, path: '/leaves', roles: ['admin', 'manager', 'employee'] },
    { name: 'Payroll', icon: DollarSign, path: '/payroll', roles: ['admin', 'manager', 'employee'] },
    { name: 'Employees', icon: Users, path: '/employees', roles: ['admin'] },
  ];

  const filteredItems = navItems.filter(item => item.roles.includes(user?.role));

  return (
    <aside className="w-72 h-full flex flex-col border-r border-white/5 bg-background/50 backdrop-blur-xl">
      <div className="p-8">
        <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-br from-white to-white/40 bg-clip-text text-transparent">
          Agentic HRMS
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {filteredItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
              ${isActive 
                ? 'bg-accent-indigo/10 text-white border-l-2 border-accent-indigo' 
                : 'text-white/50 hover:text-white hover:bg-white/5'}`
            }
          >
            <item.icon size={20} className="group-hover:scale-110 transition-transform duration-300" />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-6 mt-auto border-t border-white/5">
        <RoleSwitcher />
        
        <div className="flex items-center gap-3 mt-6 p-4 rounded-2xl bg-white/5">
          <div className="w-10 h-10 rounded-full bg-accent-indigo flex items-center justify-center font-bold">
            {user?.name?.[0] || 'U'}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="font-semibold text-sm truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-white/40 capitalize">{user?.role || 'Role'}</p>
          </div>
          <button onClick={logout} className="text-white/40 hover:text-white transition-colors">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
