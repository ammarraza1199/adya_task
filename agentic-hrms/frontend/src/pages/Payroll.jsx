import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import PayslipCard from '../components/PayslipCard';
import { useAuth } from '../context/AuthContext';
import { DollarSign, Filter, MoreHorizontal, Download, History, Calculator, TrendingUp, Zap, ChevronRight } from 'lucide-react';

const Payroll = () => {
  const [payroll, setPayroll] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, user } = useAuth();

  const fetchPayroll = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/payroll/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setPayroll(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayroll();
  }, [token]);

  return (
    <div className="flex h-screen bg-background text-white font-sora relative overflow-hidden">
      <Sidebar />

      <main className="flex-1 p-14 overflow-y-auto custom-scrollbar relative">
        {/* Animated Background Sparklies */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
           <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-accent-indigo/10 blur-[100px] rounded-full"></div>
           <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-accent-emerald/10 blur-[100px] rounded-full"></div>
        </div>

        <header className="mb-14 flex items-center justify-between relative z-10">
           <div>
              <div className="flex items-center gap-3 mb-2 text-accent-indigo">
                 <DollarSign size={18} />
                 <span className="text-[10px] uppercase font-bold tracking-widest text-white/50">Financial Operations / System Compensation</span>
              </div>
              <h1 className="text-5xl font-bold tracking-tighter bg-gradient-to-br from-white to-white/40 bg-clip-text text-transparent">Earnings Hub</h1>
           </div>

           <div className="flex items-center gap-4">
              <div className="flex flex-col text-right mr-4">
                 <span className="text-xs font-bold text-accent-emerald uppercase tracking-widest">Next payout in 14 days</span>
                 <span className="text-sm font-mono text-white/40">Expected Total: <span className="text-white">$4,920.00</span></span>
              </div>
              <button className="flex items-center gap-2.5 px-8 py-5 rounded-2xl bg-accent-indigo text-white font-bold transition-all hover:bg-accent-indigo/90 shadow-xl shadow-accent-indigo/20 active:scale-95 group">
                 <History size={20} className="group-hover:rotate-12 transition-transform duration-300" />
                 EXPORT ALL RECORDS
              </button>
           </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
           {/* Current Month Detail (Main Focus) */}
           <div className="lg:col-span-4 space-y-10">
              <div className="glass-heavy p-10 rounded-[3rem] border border-white/5 shadow-3xl text-center group transition-all duration-700 hover:bg-accent-indigo/5 cursor-pointer overflow-hidden relative">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-indigo/40 to-transparent"></div>
                 <Calculator size={48} className="text-accent-indigo mx-auto mb-8 animate-bounce transition-all group-hover:scale-125 duration-1000" />
                 <h2 className="text-3xl font-bold tracking-tighter mb-4">Latest Payslip</h2>
                 <p className="text-white/30 text-sm font-medium mb-10 leading-relaxed px-6 italic">Full distribution analysis for the current enterprise cycle.</p>
                 {loading ? (
                    <div className="h-64 rounded-3xl shimmer"></div>
                 ) : payroll[0] ? (
                    <PayslipCard data={payroll[0]} />
                 ) : (
                    <div className="p-20 opacity-20 italic">No cycles processed.</div>
                 )}
              </div>

              {/* Quick Info Cards */}
              <div className="space-y-6">
                 <div className="p-8 rounded-[2.5rem] glass border border-white/5 hover:bg-white/10 transition-all flex items-center justify-between group cursor-pointer group shadow-2xl">
                    <div className="flex items-center gap-5">
                       <div className="p-4 rounded-3xl bg-accent-emerald/10 text-accent-emerald group-hover:scale-110 transition-all duration-500"><TrendingUp size={24} /></div>
                       <div>
                          <p className="text-xs font-bold text-white/30 uppercase tracking-widest">Tax Deductions</p>
                          <p className="text-2xl font-mono font-bold">-$420.00</p>
                       </div>
                    </div>
                    <Zap size={24} className="text-white/10 group-hover:text-white/40 transition-colors" />
                 </div>

                 <div className="p-8 rounded-[2.5rem] glass border border-white/5 hover:bg-white/10 transition-all flex items-center justify-between group cursor-pointer group shadow-2xl">
                    <div className="flex items-center gap-5">
                       <div className="p-4 rounded-3xl bg-accent-amber/10 text-accent-amber group-hover:scale-110 transition-all duration-500"><DollarSign size={24} /></div>
                       <div>
                          <p className="text-xs font-bold text-white/30 uppercase tracking-widest">Bonus Credits</p>
                          <p className="text-2xl font-mono font-bold">+$150.00</p>
                       </div>
                    </div>
                    <ChevronRight size={24} className="text-white/10 group-hover:text-white/40 transition-colors" />
                 </div>
              </div>
           </div>

           {/* Historical List */}
           <div className="lg:col-span-8">
              <div className="glass rounded-[3.5rem] p-10 border border-white/5 min-h-full shadow-3xl flex flex-col relative overflow-hidden bg-white/5">
                 <div className="flex items-center justify-between mb-10 px-4">
                    <div className="flex items-center gap-4">
                       <History size={24} className="text-accent-indigo" />
                       <h3 className="text-2xl font-bold tracking-tighter">Archived Records</h3>
                    </div>
                    <div className="flex items-center gap-2">
                       <button className="p-3 rounded-2xl glass hover:bg-white/5 text-white/40 hover:text-white transition-all border border-white/5 shadow-xl"><Filter size={18} /></button>
                       <button className="p-3 rounded-2xl glass hover:bg-white/5 text-white/40 hover:text-white transition-all border border-white/5 shadow-xl"><MoreHorizontal size={18} /></button>
                    </div>
                 </div>

                 <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[700px]">
                    {loading ? (
                       [1,2,3,4,5].map(i => <div key={i} className="h-24 rounded-3xl shimmer border border-white/5"></div>)
                    ) : payroll.length > 0 ? (
                       payroll.map((p, i) => (
                          <div key={p.id || i} className="group p-8 rounded-[2rem] glass-heavy border border-white/5 hover:bg-white/10 transition-all duration-500 flex items-center justify-between cursor-pointer shadow-xl hover:scale-[1.01] hover:-translate-y-1">
                             <div className="flex items-center gap-8">
                                <div className="p-4 rounded-2xl bg-white/5 flex flex-col items-center justify-center font-bold text-white/20 border border-white/10 group-hover:bg-accent-indigo/10 group-hover:text-accent-indigo transition-all duration-500">
                                   <span className="text-[10px] uppercase font-bold tracking-tighter opacity-60 font-mono">Month</span>
                                   <span className="text-lg tracking-tighter font-mono">{p.month.split('-')[1]}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                   <p className="text-xl font-bold tracking-tight text-white/90 group-hover:text-white transition-all">{p.month}</p>
                                   <p className="text-[10px] text-white/20 tracking-[0.2em] font-bold uppercase">System Transaction Log</p>
                                </div>
                             </div>

                             <div className="flex items-center gap-12">
                                <div className="text-right flex flex-col gap-1">
                                   <p className="text-2xl font-mono font-bold tracking-tighter text-accent-indigo">${p.net_salary.toLocaleString()}</p>
                                   <p className="text-[10px] text-accent-emerald font-bold tracking-widest uppercase">Verified System</p>
                                </div>
                                <button className="p-4 rounded-2xl bg-white/5 text-white/30 hover:bg-accent-indigo/10 hover:text-accent-indigo transition-all duration-500 group-hover:scale-110 active:scale-95 shadow-xl border border-white/5">
                                   <Download size={22} />
                                </button>
                             </div>
                          </div>
                       ))
                    ) : (
                       <div className="p-20 text-center opacity-30 italic font-medium tracking-widest">NO FINANCE LOGS DETECTED</div>
                    )}
                 </div>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
};

export default Payroll;
