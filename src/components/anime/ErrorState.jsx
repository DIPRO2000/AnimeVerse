import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ErrorState({ 
  message = 'Failed to load anime data', 
  onRetry,
  fullScreen = false 
}) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4 py-20 px-4">
      <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center">
        <AlertTriangle className="h-8 w-8 text-red-400" />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-white mb-1">Oops! Something went wrong</h3>
        <p className="text-slate-400 text-sm max-w-md">{message}</p>
      </div>
      {onRetry && (
        <Button 
          onClick={onRetry}
          variant="outline"
          className="mt-2 border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      )}
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