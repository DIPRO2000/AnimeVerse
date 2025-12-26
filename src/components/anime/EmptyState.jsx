import React from 'react';
import { Search, Tv } from 'lucide-react';

export default function EmptyState({ 
  title = 'No anime found',
  message = 'Try adjusting your search or filters',
  icon: Icon = Search
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 px-4">
      <div className="h-20 w-20 rounded-full bg-slate-800/50 flex items-center justify-center">
        <Icon className="h-10 w-10 text-slate-500" />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
        <p className="text-slate-400 text-sm max-w-md">{message}</p>
      </div>
    </div>
  );
}