import React from "react";
import Skeleton from "./skeleton";

// Covers both BlogCard and FeaturedBlogCard layouts (`featured` toggles the
// taller image + excerpt + footer row) so both grids share one skeleton.
export default function BlogCardSkeleton({ featured = false }) {
  return (
    <div className="bg-surface-card rounded-2xl overflow-hidden shadow-sm border border-border-subtle flex flex-col">
      <Skeleton className={`w-full rounded-none ${featured ? "h-48" : "aspect-[16/10]"}`} />
      <div className="p-space-lg flex-1 flex flex-col justify-between gap-space-md">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-sm">
            <Skeleton className="h-3 w-20 rounded-full" />
            <Skeleton className="h-3 w-16 rounded-full" />
          </div>
          <Skeleton className="h-5 w-full rounded-full" />
          <Skeleton className="h-5 w-2/3 rounded-full" />
          {featured && (
            <>
              <Skeleton className="h-3 w-full rounded-full mt-1" />
              <Skeleton className="h-3 w-4/5 rounded-full" />
            </>
          )}
        </div>
        {featured ? (
          <div className="pt-space-sm border-t border-border-subtle flex items-center justify-between gap-space-xs">
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
        ) : (
          <Skeleton className="h-4 w-20 rounded-full" />
        )}
      </div>
    </div>
  );
}
