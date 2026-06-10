import React from 'react';

type TagColor = 'blue' | 'cyan' | 'green' | 'amber' | 'red' | 'slate';

interface TagProps {
  children: React.ReactNode;
  color?: TagColor;
  className?: string;
  onClick?: () => void;
}

const colorMap: Record<TagColor, string> = {
  blue: 'bg-[#DBEAFE] text-[#1D4ED8]',
  cyan: 'bg-cyan-50 text-[#06B6D4]',
  green: 'bg-emerald-50 text-[#10B981]',
  amber: 'bg-amber-50 text-[#F59E0B]',
  red: 'bg-red-50 text-[#EF4444]',
  slate: 'bg-slate-100 text-[#64748B]',
};

export default function Tag({ children, color = 'blue', className = '', onClick }: TagProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colorMap[color]} ${onClick ? 'cursor-pointer hover:opacity-80' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </span>
  );
}
