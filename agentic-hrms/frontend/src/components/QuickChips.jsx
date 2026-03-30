import React from 'react';
import { useAuth } from '../context/AuthContext';
import { MessageSquarePlus } from 'lucide-react';

const QuickChips = ({ onSelect }) => {
  const { user } = useAuth();

  const employeePrompts = [
    "Apply for 2 days leave",
    "Show my leave balance",
    "Show my payslip for March",
    "Check my attendance"
  ];

  const managerPrompts = [
    "Show pending leave requests",
    "Show team attendance for today",
    "Check my team for any issues"
  ];

  const adminPrompts = [
    "Add a new employee",
    "Show current leave patterns",
    "Generate payroll summary"
  ];

  const getPrompts = () => {
    switch (user?.role) {
      case 'admin': return adminPrompts;
      case 'manager': return managerPrompts;
      case 'employee': return employeePrompts;
      default: return employeePrompts;
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {getPrompts().map((prompt, i) => (
        <button
          key={i}
          onClick={() => onSelect(prompt)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl glass hover:bg-accent-indigo/10 hover:border-accent-indigo/30 transition-all duration-300 text-sm font-medium text-white/70 hover:text-white group border border-white/5 active:scale-95"
        >
          <MessageSquarePlus size={16} className="text-accent-indigo group-hover:scale-110 transition-transform duration-300" />
          {prompt}
        </button>
      ))}
    </div>
  );
};

export default QuickChips;
