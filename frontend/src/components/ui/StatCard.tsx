import React from 'react';
import Link from 'next/link';
import { LucideIcon, ArrowRight } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
  loading?: boolean;
  link: string;
  description: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon: Icon,
  color,
  loading = false,
  link,
  description,
}) => {
  return (
    <Link
      href={link}
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
          {loading ? (
            <div className="h-10 w-20 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            <p className="text-4xl font-bold text-gray-900 truncate">{value}</p>
          )}
          <p className="text-xs text-gray-500 mt-2">{description}</p>
        </div>
        <div className={`${color} p-3 rounded-xl shadow-sm`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="flex items-center text-sm text-blue-600 group-hover:text-blue-700 font-medium">
        View details
        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
};
