import React from 'react';

const SummaryCard = ({ title, value, icon, colorClass }) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 shadow-xl relative overflow-hidden group">
      {/* Abstract Background Glow */}
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity ${colorClass}`} />
      
      <div className="flex items-center justify-between relative z-10">
        <div>
          <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${colorClass} bg-opacity-20 text-white`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
