import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import LeaveCard from '../components/LeaveCard';
import { useAuth } from '../context/AuthContext';
import { Calendar, Filter, Plus, Search, ChevronDown, ListFilter } from 'lucide-react';

const Leaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const { token, user } = useAuth();

  const fetchLeaves = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/leaves`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setLeaves(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [token]);

  const handleAction = async (id, action) => {
    let reason = null;
    if (action === 'reject') {
      reason = window.prompt("Please provide a reason for rejecting this leave:");
      if (!reason) return; // User cancelled or entered empty string
    }

    const status = action === 'approve' ? 'approved' : 'rejected';
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/leaves/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status, reason })
      });
      fetchLeaves();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredLeaves = leaves.filter(l => filter === 'all' || l.status === filter);

  return (
    <div className="flex h-screen bg-background text-white font-sora relative overflow-hidden">
      <Sidebar />

      <main className="flex-1 p-14 overflow-y-auto custom-scrollbar">
        <header className="mb-14 flex items-center justify-between">
           <div>
              <div className="flex items-center gap-3 mb-2 text-accent-indigo">
                 <Calendar size={18} />
                 <span className="text-[10px] uppercase font-bold tracking-widest">Employee Portal / Absence Record</span>
              </div>
              <h1 className="text-5xl font-bold tracking-tighter bg-gradient-to-br from-white to-white/40 bg-clip-text text-transparent">Leave Management</h1>
           </div>

           <div className="flex items-center gap-3">
              <div className="relative group">
                 <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-accent-indigo transition-colors" />
                 <input 
                   type="text" 
                   placeholder="Search records..." 
                   className="glass rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-accent-indigo/40 border border-white/5 shadow-xl transition-all font-medium text-sm w-80" 
                 />
              </div>
              <button className="flex items-center gap-2.5 px-6 py-4 rounded-2xl bg-accent-indigo text-white font-bold transition-all hover:bg-accent-indigo/90 shadow-xl shadow-accent-indigo/20 active:scale-95 group">
                 <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                 APPLY LEAVE
              </button>
           </div>
        </header>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-4 custom-scrollbar">
          <div className="p-2.5 rounded-2xl glass-heavy border border-white/10 text-white/50 mr-4">
             <ListFilter size={20} />
          </div>
          {['all', 'pending', 'approved', 'rejected'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-8 py-3 rounded-2xl transition-all duration-300 text-sm font-bold uppercase tracking-widest border border-white/5 shadow-lg relative overflow-hidden
                ${filter === s ? 'bg-accent-indigo text-white border-accent-indigo/20' : 'glass text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              {filter === s && <motion.div layoutId="filter-bg" className="absolute top-0 right-0 p-1 opacity-10"><Filter size={32} /></motion.div>}
              {s}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 rounded-3xl shimmer border border-white/5"></div>
            ))}
          </div>
        ) : filteredLeaves.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredLeaves.map((l) => (
                <motion.div
                  key={l.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <LeaveCard 
                    {...l} 
                    onAction={user?.role === 'manager' || user?.role === 'admin' ? handleAction : null} 
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center h-80 glass rounded-[3rem] border border-white/5 border-dashed">
             <Calendar size={48} className="text-white/10 mb-4" />
             <p className="text-white/30 font-bold uppercase tracking-widest italic">No leave records found</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Leaves;
