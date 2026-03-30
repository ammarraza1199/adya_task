import React, { useState } from 'react';
import { ChevronRight, ShieldCheck, User, UserCog } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RoleSwitcher = () => {
  const { user, switchRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const roles = [
    { name: 'Admin', icon: ShieldCheck, color: 'text-accent-amber', bg: 'bg-accent-amber/10', role: 'admin' },
    { name: 'Manager', icon: UserCog, color: 'text-accent-emerald', bg: 'bg-accent-emerald/10', role: 'manager' },
    { name: 'Employee', icon: User, color: 'text-accent-indigo', bg: 'bg-accent-indigo/10', role: 'employee' },
  ];

  const currentRole = roles.find(r => r.role === user?.role) || roles[2];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-3 rounded-2xl glass transition-all duration-300 hover:bg-white/5 border border-white/10`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${currentRole.bg} ${currentRole.color}`}>
            <currentRole.icon size={18} />
          </div>
          <span className="font-semibold text-sm">{currentRole.name}</span>
        </div>
        <ChevronRight size={16} className={`text-white/40 transform transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-14 left-0 w-full glass rounded-2xl p-2 z-50 space-y-1 overflow-hidden shadow-2xl border border-white/10">
          {roles.map((role) => (
            <button
              key={role.role}
              onClick={() => {
                switchRole(role.role);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 hover:bg-white/5 ${user?.role === role.role ? 'bg-white/5' : ''}`}
            >
              <div className={`p-2 rounded-xl ${role.bg} ${role.color}`}>
                <role.icon size={16} />
              </div>
              <span className="text-sm font-medium">{role.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoleSwitcher;
