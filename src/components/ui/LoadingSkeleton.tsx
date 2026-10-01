import React from 'react';

interface LoadingSkeletonProps {
  type?: 'dashboard' | 'transactions' | 'budget' | 'insights' | 'reports';
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ type = 'dashboard' }) => {
  if (type === 'dashboard') {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Stat cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-xl border border-[#E5E7EB] bg-[#F7F8F6] p-5">
              <div className="h-3 w-20 bg-neutral-200 rounded mb-4" />
              <div className="h-7 w-32 bg-neutral-200 rounded mb-2" />
              <div className="h-3 w-24 bg-neutral-200 rounded" />
            </div>
          ))}
        </div>

        {/* Budget + Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 h-80 rounded-xl border border-[#E5E7EB] bg-[#F7F8F6] p-6">
            <div className="h-4 w-32 bg-neutral-200 rounded mb-4" />
            <div className="h-8 w-40 bg-neutral-200 rounded mb-6" />
            <div className="h-3 w-full bg-neutral-200 rounded mb-6" />
            <div className="space-y-3">
              <div className="h-3 w-3/4 bg-neutral-200 rounded" />
              <div className="h-3 w-2/3 bg-neutral-200 rounded" />
            </div>
          </div>
          <div className="lg:col-span-8 h-80 rounded-xl border border-[#E5E7EB] bg-[#F7F8F6] p-6">
            <div className="h-4 w-40 bg-neutral-200 rounded mb-6" />
            <div className="h-48 w-full bg-neutral-200/60 rounded" />
          </div>
        </div>

        {/* Recent Transactions Skeleton */}
        <div className="rounded-xl border border-[#E5E7EB] bg-[#F7F8F6] p-6">
          <div className="h-4 w-48 bg-neutral-200 rounded mb-6" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-neutral-200/60">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-neutral-200" />
                  <div className="space-y-1.5">
                    <div className="h-3.5 w-32 bg-neutral-200 rounded" />
                    <div className="h-2.5 w-24 bg-neutral-200 rounded" />
                  </div>
                </div>
                <div className="h-4 w-20 bg-neutral-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 w-64 bg-neutral-200 rounded mb-6" />
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-16 rounded-xl border border-[#E5E7EB] bg-[#F7F8F6] p-4 flex items-center justify-between">
          <div className="h-4 w-40 bg-neutral-200 rounded" />
          <div className="h-4 w-24 bg-neutral-200 rounded" />
        </div>
      ))}
    </div>
  );
};
