import React from 'react';
import { Users, Phone, LayoutGrid, Heart, Activity } from 'lucide-react';
import { toBengaliDigits } from '../utils';

interface SiteStatsProps {
  totalUsers: number;
  totalContacts: number;
  totalCategories: number;
  totalBloodDonors: number;
}

export function SiteStats({ totalUsers, totalContacts, totalCategories, totalBloodDonors }: SiteStatsProps) {
  const stats = [
    { icon: <Phone className="w-6 h-6 text-emerald-500" />, label: 'মোট নাম্বার', value: totalContacts },
    { icon: <Users className="w-6 h-6 text-blue-500" />, label: 'নিবন্ধিত ইউজার', value: totalUsers },
    { icon: <Heart className="w-6 h-6 text-rose-500" />, label: 'রক্তদাতা', value: totalBloodDonors },
    { icon: <LayoutGrid className="w-6 h-6 text-purple-500" />, label: 'ক্যাটাগরি', value: totalCategories },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 mb-6 mt-4">
      <h2 className="text-xl font-bold text-center text-slate-800 mb-6 flex items-center justify-center gap-2">
        <Activity className="w-6 h-6 text-emerald-600" />
        সাইটের একনজরে পরিসংখ্যান
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center transform transition-transform hover:scale-105">
            <div className="bg-slate-50 p-3 rounded-full mb-3">
              {stat.icon}
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-1">
              {toBengaliDigits(stat.value)}
            </h3>
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
