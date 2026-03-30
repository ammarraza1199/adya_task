import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  Search, 
  Plus, 
  MoreHorizontal, 
  ShieldCheck, 
  UserCog, 
  User, 
  Mail, 
  ChevronRight,
  Filter
} from 'lucide-react';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { token, user } = useAuth();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchEmployees = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/employees`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setEmployees(data);
      } else {
        setEmployees([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [token]);

  const filtered = employees.filter(e => 
    e.name.toLowerCase().includes(search.toLowerCase()) || 
    e.email.toLowerCase().includes(search.toLowerCase())
  );

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <ShieldCheck size={18} className="text-accent-amber" />;
      case 'manager': return <UserCog size={18} className="text-accent-emerald" />;
      default: return <User size={18} className="text-accent-indigo" />;
    }
  };

  return (
    <div className="flex h-screen bg-background text-white font-sora relative overflow-hidden">
      <Sidebar />

      <main className="flex-1 p-14 overflow-y-auto custom-scrollbar relative z-10 transition-all duration-700">
        <header className="mb-14 flex items-center justify-between">
           <div>
              <div className="flex items-center gap-3 mb-2 text-accent-indigo">
                 <Users size={18} />
                 <span className="text-[10px] uppercase font-bold tracking-widest">Global Directory / Management</span>
              </div>
              <h1 className="text-5xl font-bold tracking-tighter bg-gradient-to-br from-white to-white/40 bg-clip-text text-transparent">Employee Database</h1>
           </div>

           <div className="flex items-center gap-3">
              <div className="relative group/search">
                 <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/search:text-accent-indigo transition-colors" />
                 <input 
                   type="text" 
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                   placeholder="Search directory..." 
                   className="glass rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-accent-indigo/40 border border-white/5 shadow-xl transition-all font-medium text-sm w-96 group-focus-within/search:w-[400px] duration-500" 
                 />
              </div>
              <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2.5 px-6 py-4 rounded-2xl bg-accent-indigo text-white font-bold transition-all hover:bg-accent-indigo/90 shadow-xl shadow-accent-indigo/20 active:scale-95 group">
                 <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                 NEW HIRE
              </button>
           </div>
        </header>

        {/* Table View */}
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           className="glass-heavy rounded-[3rem] border border-white/5 shadow-3xl overflow-hidden relative"
        >
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-10 py-6 text-[10px] uppercase font-bold tracking-widest text-white/30">Personnel</th>
                <th className="px-10 py-6 text-[10px] uppercase font-bold tracking-widest text-white/30">Privileges</th>
                <th className="px-10 py-6 text-[10px] uppercase font-bold tracking-widest text-white/30">Performance</th>
                <th className="px-10 py-6 text-[10px] uppercase font-bold tracking-widest text-white/30">System Status</th>
                <th className="px-10 py-6 text-[10px] uppercase font-bold tracking-widest text-white/30">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                [1,2,3,4,5].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="5" className="px-10 py-8"><div className="h-4 bg-white/5 rounded-full w-3/4"></div></td>
                  </tr>
                ))
              ) : filtered.map((e) => (
                <tr key={e.id} className="group hover:bg-white/5 transition-all duration-300">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-accent-indigo/10 flex items-center justify-center font-bold text-accent-indigo border border-accent-indigo/20 group-hover:scale-110 transition-transform duration-500">
                          {e.name[0]}
                       </div>
                       <div className="flex flex-col">
                          <span className="font-bold tracking-tight text-white/90 group-hover:text-accent-indigo transition-colors">{e.name}</span>
                          <span className="text-xs text-white/30 font-mono tracking-tighter">{e.email}</span>
                       </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-2">
                       <div className="p-2 rounded-xl bg-white/5 group-hover:bg-accent-indigo/10 transition-colors">
                          {getRoleIcon(e.role)}
                       </div>
                       <span className="text-xs font-bold uppercase tracking-widest">{e.role}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6 font-mono text-xs text-white/40">
                     <div className="flex items-center gap-1.5 text-accent-emerald">
                        <TrendingUp size={14} /> EXCELLENT
                     </div>
                  </td>
                  <td className="px-10 py-6">
                     <span className="px-3 py-1 rounded-lg bg-accent-emerald/10 text-accent-emerald text-[10px] font-bold uppercase tracking-widest border border-accent-emerald/20">Active</span>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 rounded-xl hover:bg-white/10 transition-all active:scale-90"><ShieldCheck size={18} /></button>
                      <button className="p-2 rounded-xl hover:bg-white/10 transition-all active:scale-90"><MoreHorizontal size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filtered.length === 0 && !loading && (
             <div className="p-20 text-center flex flex-col items-center justify-center opacity-40 italic">
                <Search size={48} className="mb-4" />
                <p className="text-sm font-bold tracking-widest">NO PERSONNEL DETECTED / SYSTEM VOID</p>
             </div>
          )}
        </motion.div>
      </main>

      {/* Add Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 bg-black/80 backdrop-blur-3xl z-[100] flex items-center justify-center p-10"
          >
             <motion.div
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
                className="w-full max-w-2xl glass-heavy rounded-[3.5rem] p-12 border border-white/10 shadow-3xl text-center relative overflow-hidden"
             >
                <button onClick={() => setIsAddModalOpen(false)} className="absolute top-8 right-8 p-3 rounded-2xl glass hover:bg-white/10 transition-all border border-white/10">
                   <Plus className="rotate-45" size={20} />
                </button>
                <Users size={48} className="text-accent-indigo mx-auto mb-8 animate-pulse" />
                <h3 className="text-3xl font-bold tracking-tighter mb-4">Initialize New Entity</h3>
                <p className="text-white/40 mb-10 text-sm font-medium leading-relaxed">System architecture requires node verification before adding new personnel.</p>
                <div className="space-y-6 text-left mb-10 max-w-md mx-auto">
                   <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-accent-indigo group-focus-within/input:text-accent-indigo transition-colors"><User size={18} /></div>
                      <input type="text" placeholder="Legal Name" className="w-full glass rounded-2xl py-4 pl-12 pr-4 outline-none border border-white/5 focus:border-accent-indigo/40 transition-all font-medium text-sm" />
                   </div>
                   <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-accent-indigo transition-colors"><Mail size={18} /></div>
                      <input type="email" placeholder="Enterprise Email" className="w-full glass rounded-2xl py-4 pl-12 pr-4 outline-none border border-white/5 focus:border-accent-indigo/40 transition-all font-medium text-sm" />
                   </div>
                </div>
                <button className="px-12 py-5 rounded-3xl bg-accent-indigo text-white font-bold tracking-widest text-sm shadow-2xl shadow-accent-indigo/30 hover:scale-105 active:scale-95 transition-all">INITIALIZE HANDSHAKE</button>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Simple TrendingUp icon
const TrendingUp = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

export default Employees;
