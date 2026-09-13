import React from "react";

import SiteHeader from "../componants/siteHeader";
import SiteFooter from "../componants/siteFooter";
import ScrollTop from "../componants/scrollTop";
import JobsExplorer from "../componants/jobsExplorer";

import { jobsApi } from "../../services/jobs/jobs.api";

// All filtering/sorting/pagination now happens client-side in <JobsExplorer>
// against this one fetched batch, so this stays a plain server fetch with no
// searchParams dependency (filters are React state, not URL params).
const FETCH_LIMIT = 100; // backend caps `limit` at 100

export default async function JobsPage() {
  let jobs = [];
  try {
    const result = await jobsApi.list(undefined, { status: "ACTIVE", page: 1, limit: FETCH_LIMIT });
    jobs = result?.data ?? [];
  } catch {
    jobs = [];
  }

  return (
    <div className="bg-surface font-sans text-on-surface antialiased">
      <SiteHeader />
      <main className="w-full pt-20 bg-surface">
        <JobsExplorer jobs={jobs} />
      </main>
      <SiteFooter />
      <ScrollTop />
    </div>
  );
}
