import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingState({ message = 'Loading anime...', fullScreen = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-purple-500/20" />
        <Loader2 className="h-16 w-16 text-purple-500 animate-spin absolute inset-0" />
      </div>
      <p className="text-slate-400 text-sm animate-pulse">{message}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}