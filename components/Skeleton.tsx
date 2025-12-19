
import React from 'react';

interface SkeletonProps {
  variant?: 'vertical' | 'horizontal' | 'compact';
}

const Skeleton: React.FC<SkeletonProps> = ({ variant = 'vertical' }) => {
  if (variant === 'horizontal') {
    return (
      <div className="flex flex-col sm:flex-row gap-5 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 animate-pulse">
        <div className="sm:w-5/12 bg-slate-200 dark:bg-slate-800 rounded-xl h-48 sm:h-auto"></div>
        <div className="sm:w-7/12 space-y-4 py-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-4/6"></div>
          <div className="mt-auto pt-4 border-t border-slate-50 dark:border-slate-800 flex gap-4">
             <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-20"></div>
             <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-20"></div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="flex gap-4 items-start p-4 animate-pulse">
        <div className="w-24 h-24 bg-slate-200 dark:bg-slate-800 rounded-lg flex-shrink-0"></div>
        <div className="flex-grow space-y-3">
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
          <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 animate-pulse flex flex-col h-full">
      <div className="h-52 bg-slate-200 dark:bg-slate-800"></div>
      <div className="p-5 space-y-4 flex-grow">
        <div className="flex justify-between items-center">
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-24"></div>
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-6"></div>
        </div>
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
        <div className="space-y-2">
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
        </div>
        <div className="pt-4 border-t border-slate-50 dark:border-slate-800 mt-auto flex items-center gap-2">
           <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800"></div>
           <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-16"></div>
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
