import React, { useEffect, useState } from 'react';
import { DollarSign, PieChart, Info, Download } from 'lucide-react';
import { motion, useSpring, useTransform } from 'framer-motion';

const AnimatedNumber = ({ value }) => {
  const spring = useSpring(0, { mass: 1, stiffness: 100, damping: 20 });
  const display = useTransform(spring, (current) => Math.floor(current).toLocaleString());

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span>{display}</motion.span>;
};

const PayslipCard = ({ data }) => {
  if (!data) return <p>No payslip data found.</p>;

  return (
    <div className="w-full glass rounded-3xl p-5 border border-white/10 relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 right-0 p-4 opacity-10 scale-150">
        <DollarSign size={80} />
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold tracking-tight mb-0.5">March 2026</h3>
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent-indigo">Payslip Overview</p>
        </div>
        <button className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/10 active:scale-95 group">
          <Download size={18} className="text-white group-hover:scale-110 transition-transform duration-300" />
        </button>
      </div>

      <div className="space-y-6">
        <div className="p-4 rounded-2xl bg-accent-indigo/10 border border-accent-indigo/20 flex flex-col justify-center gap-1 group">
          <span className="text-[10px] font-bold text-accent-indigo uppercase tracking-widest opacity-60">Net Salary</span>
          <span className="text-3xl font-mono font-bold text-white group-hover:tracking-wider transition-all duration-500">
            $<AnimatedNumber value={data.net_salary} />
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Basic</span>
            <p className="text-lg font-mono font-bold">$<AnimatedNumber value={data.basic} /></p>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Deductions</span>
            <p className="text-lg font-mono font-bold text-red-400">$<AnimatedNumber value={data.deductions} /></p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between p-4 rounded-2xl glass-heavy border border-white/5 group hover:bg-white/10 transition-colors duration-500">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-accent-emerald/10 text-accent-emerald group-hover:rotate-12 transition-transform duration-300">
            <PieChart size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold">Taxes Paid</p>
            <p className="text-[10px] text-white/40 tracking-wider">Processed 2 days ago</p>
          </div>
        </div>
        <Info size={16} className="text-white/20 group-hover:text-white/60 transition-colors" />
      </div>
    </div>
  );
};

export default PayslipCard;
