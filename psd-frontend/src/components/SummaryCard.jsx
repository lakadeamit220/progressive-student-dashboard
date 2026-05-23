import React from 'react';

const SummaryCard = ({ title, value, icon, colorClass }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
      <div className="flex items-center justify-between relative z-10">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{value}</h3>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${colorClass}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
