import React from "react";
import JobCard from "./jobCard";
import JobCardSkeleton from "./jobCardSkeleton";
import StateMessage from "./stateMessage";

// Presentational only — no data fetching, no pagination. The Home page and
// the /jobs page each own their own fetching/pagination and just hand this
// the slice of jobs they want rendered.
export default function JobsCards({
  jobs,
  loading = false,
  skeletonCount = 6,
  emptyMessage = "No job vacancies found.",
  // Pass "xl:grid-cols-3" when rendered beside a sidebar (narrower column).
  threeColsAt = "lg:grid-cols-3",
}) {
  if (loading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 ${threeColsAt} gap-space-lg`}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <JobCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return <StateMessage icon="search_off">{emptyMessage}</StateMessage>;
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 ${threeColsAt} gap-space-lg`}>
      {jobs.map((job, index) => (
        <JobCard key={job.id} job={job} index={index} />
      ))}
    </div>
  );
}
