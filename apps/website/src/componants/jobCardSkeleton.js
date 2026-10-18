import React from "react";
import Skeleton from "./skeleton";

// Mirrors JobCard's structure/spacing exactly so the grid doesn't jump when
// real data replaces it.
export default function JobCardSkeleton() {
  return (
    <div className="bg-surface-card rounded-2xl p-space-lg !shadow-sm !border border-border-subtle flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-space-xs mb-space-md">
          <div className="flex items-center gap-space-sm min-w-0 flex-1">
            <Skeleton className="w-11 h-11 rounded-xl shrink-0" />
            <div className="flex flex-col gap-2 min-w-0 flex-1">
              <Skeleton className="h-3 w-24 rounded-full" />
              <Skeleton className="h-2.5 w-16 rounded-full" />
            </div>
          </div>
          <Skeleton className="h-5 w-16 rounded-full shrink-0" />
        </div>

        <Skeleton className="h-4 w-5/6 rounded-full mb-2" />
        <Skeleton className="h-3 w-1/3 rounded-full mb-space-sm" />

        <div className="flex flex-wrap gap-1.5 mb-space-md">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-28 rounded-full" />
        <Skeleton className="h-4 w-14 rounded-full" />
      </div>
    </div>
  );
}
