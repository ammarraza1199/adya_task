import React from 'react';
import { Calendar, Check, X, Clock } from 'lucide-react';

const LeaveCard = ({ id, user_name, start_date, end_date, reason, status, total_leaves, late_count, rejection_reason, onAction }) => {
  const isPending = status === 'pending';

  return (
    <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-300">
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-accent-indigo/10 text-accent-indigo border border-white/5">
            <Calendar size={22} />
          </div>
          <div>
            <h4 className="text-lg font-bold tracking-tight text-white">{user_name || 'My Request'}</h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-white/30 font-mono tracking-widest uppercase">REF: LEAVE-{id}</span>
              {total_leaves !== undefined && (
                <span className="text-[10px] font-bold text-accent-indigo/80 bg-accent-indigo/10 px-1.5 py-0.5 rounded uppercase tracking-wider">
                  {total_leaves} Left
                </span>
              )}
              {late_count !== undefined && late_count > 0 && (
                <span className="text-[10px] font-bold text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded uppercase tracking-wider">
                  {late_count} Delays
                </span>
              )}
            </div>
          </div>
        </div>
        <div className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border
          ${status === 'approved' ? 'bg-accent-emerald/10 text-accent-emerald border-accent-emerald/20' : 
            status === 'rejected' ? 'bg-red-400/10 text-red-100 border-red-500/20' : 
            'bg-accent-amber/5 text-accent-amber border-accent-amber/10 animate-pulse'}`}
        >
          {status}
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs font-mono text-white/60 mb-4 pb-4 border-b border-white/5">
        <div className="flex items-center gap-1.5">
          <Clock size={12} className="text-accent-indigo/60" />
          <span>{start_date}</span>
        </div>
        <div className="w-4 h-[1px] bg-white/10"></div>
        <div className="flex items-center gap-1.5">
          <Clock size={12} className="text-accent-indigo/60" />
          <span>{end_date}</span>
        </div>
      </div>

      <p className="text-sm text-white/50 mb-5 italic line-clamp-2 leading-relaxed">
        "{reason}"
      </p>

      {status === 'rejected' && rejection_reason && (
        <div className="mb-5 p-3 rounded-xl bg-red-500/5 border border-red-500/10">
          <p className="text-[10px] font-bold text-red-400/80 uppercase tracking-widest mb-1">Manager's Reason:</p>
          <p className="text-xs text-red-100/70 leading-relaxed font-medium">{rejection_reason}</p>
        </div>
      )}

      {isPending && onAction && (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onAction(id, 'approve')}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-accent-emerald/10 text-accent-emerald border border-accent-emerald/20 hover:bg-accent-emerald/20 transition-all font-bold text-xs"
          >
            <Check size={16} /> APPROVE
          </button>
          <button
            onClick={() => onAction(id, 'reject')}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-400/10 text-red-100 border border-red-500/20 hover:bg-red-400/20 transition-all font-bold text-xs"
          >
            <X size={16} /> REJECT
          </button>
        </div>
      )}
    </div>
  );
};

export default LeaveCard;
