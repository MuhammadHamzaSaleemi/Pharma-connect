import React from "react";
import JobCard from "./jobCard";
import StateMessage from "./stateMessage";

// Presentational only — no data fetching, no pagination. The Home page and
// the /jobs page each own their own fetching/pagination and just hand this
// the slice of jobs they want rendered.
export default function JobsCards({
  jobs,
  loading = false,
  loadingMessage = "Loading jobs...",
  emptyMessage = "No job vacancies found.",
}) {
  if (loading) {
    return <StateMessage loading>{loadingMessage}</StateMessage>;
  }

  if (!jobs || jobs.length === 0) {
    return <StateMessage icon="search_off">{emptyMessage}</StateMessage>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
      {jobs.map((job, index) => (
        <JobCard key={job.id} job={job} index={index} />
      ))}
    </div>
  );
}
