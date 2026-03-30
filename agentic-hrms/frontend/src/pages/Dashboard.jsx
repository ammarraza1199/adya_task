import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  CalendarCheck, 
  DollarSign, 
  Clock, 
  TrendingUp, 
  ArrowUpRight, 
  MoreHorizontal,
  LayoutGrid
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

const data = [
  { name: 'Mon', attendance: 85 },
  { name: 'Tue', attendance: 92 },
  { name: 'Wed', attendance: 88 },
  { name: 'Thu', attendance: 95 },
  { name: 'Fri', attendance: 90 },
  { name: 'Sat', attendance: 20 },
  { name: 'Sun', attendance: 10 }
];

const payrollData = [
  { name: 'Jan', amount: 45000 },
  { name: 'Feb', amount: 46500 },
  { name: 'Mar', amount: 48000 }
];

const StatCard = ({ title, value, icon: Icon, trend, color, accent }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -8, scale: 1.02 }}
    className={`p-10 rounded-[3rem] glass-heavy border border-white/5 relative overflow-hidden group transition-all duration-700 shadow-3xl hover:bg-${color}/5`}
  >
    <div className={`absolute top-0 right-0 w-40 h-40 bg-${color}/10 blur-[80px] rounded-full translate-x-20 -translate-y-20 group-hover:scale-150 transition-transform duration-700 opacity-60`}></div>
    
    <div className="flex flex-col h-full gap-8 relative z-10">
      <div className="flex items-center justify-between">
        <div className={`p-4 rounded-3xl bg-white/5 border border-white/10 text-white/50 group-hover:text-white transition-all duration-500`}>
          <Icon size={24} strokeWidth={1.5} />
        </div>
        <div className={`px-4 py-1.5 rounded-2xl bg-${color}/10 text-${color} text-xs font-bold font-mono tracking-tighter flex items-center gap-1.5 border border-white/5`}>
          <ArrowUpRight size={14} />
          {trend}
        </div>
      </div>
      
      <div>
        <p className="text-sm font-bold text-white/40 uppercase tracking-[0.2em] mb-1">{title}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-mono font-bold tracking-tighter">{value}</span>
          {accent && <span className="text-sm font-bold text-white/20 uppercase tracking-widest">{accent}</span>}
        </div>
      </div>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (user && user.id) {
      axios.get(`/api/dashboard/${user.id}`)
        .then(res => setStats(res.data))
        .catch(err => console.error('Failed to load dashboard stats', err));
    }
  }, [user]);

  return (
    <div className="flex h-screen bg-background text-white font-sora relative overflow-hidden">
      <Sidebar />

      <main className="flex-1 px-14 py-14 overflow-y-auto custom-scrollbar">
        {/* Header */}
        <section className="mb-14 flex items-center justify-between">
          <div className="space-y-1">
             <div className="flex items-center gap-3 mb-2 text-accent-indigo">
                <LayoutGrid size={18} />
                <span className="text-[10px] uppercase font-bold tracking-widest">Command Center / Dashboard</span>
             </div>
             <h1 className="text-5xl font-bold tracking-tighter bg-gradient-to-br from-white via-white to-white/40 bg-clip-text text-transparent">
               Welcome back, <span className="text-accent-indigo">{user?.name?.split(' ')[0]}</span>.
             </h1>
             <p className="text-lg text-white/40 font-medium tracking-tight">Your enterprise overview for the current month is ready.</p>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="text-right flex flex-col justify-center">
                <span className="text-sm font-bold text-white/60 mb-0.5">{new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                <span className="text-xs font-mono font-bold text-accent-emerald uppercase tracking-widest text-right">System Healthy / Green State</span>
             </div>
             <div className="w-16 h-16 rounded-3xl glass flex items-center justify-center border border-white/10 hover:bg-white/5 cursor-pointer shadow-xl transition-all active:scale-95 group">
                <TrendingUp size={24} className="text-accent-indigo group-hover:scale-110 transition-transform duration-300" />
             </div>
          </div>
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-8 mb-14">
          {user?.role === 'admin' && (
            <>
              <StatCard title="Total Staff" value={stats?.totalStaff || '...'} icon={Users} trend="+12%" color="accent-indigo" accent="Personnel" />
              <StatCard title="Today's Attendance" value={stats?.todaysAttendance || '...'} icon={CalendarCheck} trend="+4%" color="accent-emerald" accent="Checked-in" />
              <StatCard title="Payroll Budget" value={stats?.payrollBudget ? `$${(stats.payrollBudget/1000).toFixed(1)}k` : '...'} icon={DollarSign} trend="+2.5%" color="accent-indigo" accent="Total Cost" />
              <StatCard title="Pending Requests" value={stats?.pendingRequests !== undefined ? stats.pendingRequests : '...'} icon={Clock} trend="-15%" color="accent-amber" accent="Requires Action" />
            </>
          )}
          {user?.role === 'manager' && (
            <>
              <StatCard title="My Team" value={stats?.myTeamCount || '...'} icon={Users} trend="+0%" color="accent-emerald" accent="Members" />
              <StatCard title="Team Presence" value={stats?.teamPresence ? `${stats.teamPresence}%` : '...'} icon={CalendarCheck} trend="+2%" color="accent-emerald" accent="Daily Avg" />
              <StatCard title="Dept Spend" value={stats?.deptSpend ? `$${(stats.deptSpend/1000).toFixed(1)}k` : '...'} icon={DollarSign} trend="+1.2%" color="accent-indigo" accent="This Month" />
              <StatCard title="Approvals" value={stats?.pendingApprovals !== undefined ? stats.pendingApprovals : '...'} icon={Clock} trend="-5%" color="accent-amber" accent="Pending" />
            </>
          )}
          {user?.role === 'employee' && (
            <>
              <StatCard title="Leave Balance" value={stats?.leaveBalance !== undefined ? stats.leaveBalance : '...'} icon={CalendarCheck} trend={stats?.leaveBalance < 5 ? 'Low' : '0'} color="accent-indigo" accent="Days Left" />
              <StatCard title="My Presence" value={stats?.presence !== undefined ? `${stats.presence}%` : '...'} icon={Clock} trend={stats?.presence >= 90 ? '+0.5%' : '-'} color="accent-emerald" accent="This Month" />
              <StatCard title="Net Salary" value={stats?.netSalary ? `$${(stats.netSalary/1000).toFixed(1)}k` : '...'} icon={DollarSign} trend="+0%" color="accent-indigo" accent="Last Month" />
              <StatCard title="Active Tasks" value={stats?.activeTasks || '...'} icon={LayoutGrid} trend="+2" color="accent-amber" accent="In Progress" />
            </>
          )}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-2 gap-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-[3rem] glass flex flex-col p-10 min-h-[500px] border border-white/5 shadow-2xl relative group overflow-hidden bg-white/5"
          >
            <div className="flex items-center justify-between mb-10">
               <div>
                  <h3 className="text-xl font-bold tracking-tight mb-1">Attendance Patterns</h3>
                  <p className="text-xs text-white/30 uppercase tracking-[0.15em] font-bold">Standard 7-day visualization</p>
               </div>
               <button className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/10">
                  <MoreHorizontal size={18} />
               </button>
            </div>
            
            <div className="flex-1 group-hover:scale-[1.02] transition-transform duration-700">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAttend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ borderRadius: '20px', backgroundColor: '#0A0A0F', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                    itemStyle={{ color: '#6366F1' }}
                  />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em' }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="attendance" 
                    stroke="#6366F1" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorAttend)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Bar Chart for Payroll */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="rounded-[3rem] glass-heavy flex flex-col p-10 min-h-[500px] border border-white/5 shadow-2xl relative group overflow-hidden bg-white/5"
          >
            <div className="flex items-center justify-between mb-10">
               <div>
                  <h3 className="text-xl font-bold tracking-tight mb-1">Expenditure Breakdown</h3>
                  <p className="text-xs text-white/30 uppercase tracking-[0.15em] font-bold">Monthly payroll distribution</p>
               </div>
               <button className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/10">
                  <MoreHorizontal size={18} />
               </button>
            </div>

            <div className="flex-1 group-hover:scale-[1.02] transition-transform duration-700">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={payrollData}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em' }} 
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.02)', radius: 15 }}
                    contentStyle={{ borderRadius: '20px', backgroundColor: '#0A0A0F', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                  />
                  <Bar dataKey="amount" fill="#6366F1" radius={[15, 15, 15, 15]} barSize={50}>
                    {payrollData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 2 ? '#10B981' : '#6366F1'} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
