import React from 'react';
import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';
import LeaveCard from './LeaveCard';
import AttendanceTable from './AttendanceTable';
import PayslipCard from './PayslipCard';

const ChatBubble = ({ message, isLast }) => {
  const isAI = message.role === 'assistant';

  const renderContent = () => {
    switch (message.type) {
      case 'leave_card_confirmation':
        return <LeaveCard {...message.data} />;
      case 'attendance_table':
        return <AttendanceTable data={message.data.attendance} />;
      case 'payslip':
        return <PayslipCard data={message.data.payroll} />;
      case 'leave_list':
        return <div className="space-y-4">
          <p className="font-semibold text-sm mb-4">Pending Leave Requests:</p>
          {message.data.leaves && message.data.leaves.length > 0 ? (
            message.data.leaves.map(l => (
              <LeaveCard 
                key={l.id} 
                {...l} 
                onAction={(id, action) => window.dispatchEvent(new CustomEvent('sendMessage', { detail: `${action === 'approve' ? 'Approve' : 'Reject'} leave request #${id}` }))}
              />
            ))
          ) : (
            <p className="text-xs text-white/40 italic">No pending leave requests found.</p>
          )}
        </div>;
      case 'payslip_request_list':
        return <div className="space-y-4">
          <p className="font-semibold text-sm mb-4">Pending Payslip Requests:</p>
          {message.data.requests && message.data.requests.length > 0 ? (
            message.data.requests.map(r => (
              <div key={r.id} className="p-4 rounded-2xl glass border border-white/10 flex items-center justify-between gap-4">
                 <div>
                    <p className="font-bold text-sm">{r.user_name}</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest">{r.month}</p>
                 </div>
                 <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('sendMessage', { detail: `Generate payslip for ${r.user_name} for ${r.month} (Request #${r.id})` }))}
                  className="px-4 py-2 rounded-xl bg-accent-indigo text-[10px] font-bold uppercase tracking-widest hover:bg-accent-indigo/80 transition-all"
                 >
                   GENERATE
                 </button>
              </div>
            ))
          ) : (
            <p className="text-xs text-white/40 italic">No pending payslip requests found.</p>
          )}
        </div>;
      case 'employee_list':
        return <div className="space-y-3">
          <p className="font-semibold text-sm mb-2">Company Directory:</p>
          {message.data.employees && message.data.employees.map(e => (
            <div key={e.id} className="p-3 rounded-xl glass border border-white/10 flex justify-between items-center">
              <div>
                <p className="font-bold text-sm tracking-tight text-white/90">{e.name}</p>
                <p className="text-[10px] text-white/50">{e.email}</p>
              </div>
              <span className="px-2 py-1 text-[8px] uppercase font-bold tracking-widest bg-white/5 border border-white/10 rounded text-accent-indigo">{e.role}</span>
            </div>
          ))}
        </div>;
      case 'policy_list':
        return <div className="space-y-3">
          <p className="font-semibold text-sm mb-2">HR Policies:</p>
          {message.data.policies && message.data.policies.length > 0 ? message.data.policies.map(p => (
            <div key={p.id} className="p-3 rounded-xl glass border border-accent-emerald/20 bg-accent-emerald/5">
              <p className="font-bold text-sm text-accent-emerald uppercase tracking-widest text-[9px] mb-1">Policy #{p.id}</p>
              <p className="font-bold text-sm text-white/90">{p.title}</p>
              <p className="text-xs text-white/70 mt-1 leading-relaxed">{p.description}</p>
              <p className="text-[9px] text-white/30 uppercase tracking-widest mt-2 border-t border-white/5 pt-2">Updated: {new Date(p.updated_at).toLocaleDateString()}</p>
            </div>
          )) : <p className="text-xs text-white/40 italic">No policies found.</p>}
        </div>;
      default:
        return <p className="text-sm font-medium leading-relaxed tracking-tight">{message.content}</p>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-end gap-4 w-full mb-6 ${isAI ? 'justify-start' : 'justify-end'}`}
    >
      {isAI && (
        <div className="w-10 h-10 rounded-2xl glass-heavy flex items-center justify-center border border-white/10 shrink-0 mb-2">
          <Bot size={22} className="text-accent-indigo" />
        </div>
      )}

      <div className={`max-w-[80%] ${isAI ? '' : 'text-right'}`}>
        <div className={`p-4 rounded-3xl relative overflow-hidden transition-all duration-300
          ${isAI 
            ? 'glass border border-white/10 text-white' 
            : 'bg-accent-indigo/90 text-white border border-white/20'}`}
        >
          {renderContent()}
          
          <div className={`mt-2 text-[10px] opacity-40 font-mono ${isAI ? 'text-left' : 'text-right'}`}>
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

      {!isAI && (
        <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shrink-0 mb-2 overflow-hidden">
          <User size={22} className="text-white/40" />
        </div>
      )}
    </motion.div>
  );
};

export default ChatBubble;
