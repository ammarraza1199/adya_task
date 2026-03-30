import React from 'react';
import { CheckCircle2, XCircle, AlertCircle, Clock } from 'lucide-react';

const AttendanceTable = ({ data }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return <CheckCircle2 size={16} className="text-accent-emerald" />;
      case 'absent': return <XCircle size={16} className="text-red-400" />;
      case 'late': return <Clock size={16} className="text-accent-amber" />;
      default: return <AlertCircle size={16} className="text-white/40" />;
    }
  };

  return (
    <div className="w-full glass rounded-3xl p-4 overflow-hidden shadow-xl border border-white/10">
      <h3 className="text-sm font-semibold mb-4 px-2 flex items-center justify-between">
        <span className="text-white/70">Attendance History</span>
        <span className="text-[10px] uppercase tracking-widest text-accent-indigo">Last {data.length} records</span>
      </h3>
      <div className="space-y-0.5 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
        {(!data || data.length === 0) ? (
          <div className="p-4 text-center text-xs text-white/40 italic">No attendance records found.</div>
        ) : (
          data.map((item) => (
            <div 
              key={item.id} 
              className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3">
                <div className="font-mono text-xs text-white/50">{item.date}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider capitalize 
                  ${item.status === 'present' ? 'text-accent-emerald' : 
                    item.status === 'absent' ? 'text-red-400' : 'text-accent-amber'}`}
                >
                  {item.status}
                </span>
                {getStatusIcon(item.status)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AttendanceTable;
