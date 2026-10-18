import React from "react";
import { pageMetadata } from "../../lib/site";

import SiteHeader from "../../componants/siteHeader";
import SiteFooter from "../../componants/siteFooter";
import ScrollTop from "../../componants/scrollTop";
import Breadcrumb from "../../componants/breadcrumb";
import JobsExplorer from "../../componants/jobsExplorer";

import { jobsApi } from "../../services/jobs/jobs.api";
import { fetchAllPages } from "../../lib/fetchAllPages";

export const metadata = pageMetadata({
  title: "Pharmacy Jobs in Pakistan & Abroad",
  description: "Browse verified pharmacy jobs in Pakistan and the Gulf: QA, QC, regulatory, medical affairs, sales, hospital and community pharmacy roles for Pharm-D graduates and pharmacists.",
  path: "/jobs",
});

// All filtering/sorting/pagination happens client-side in <JobsExplorer>
// against every active job, so this stays a plain server fetch with no
// searchParams dependency (filters are React state, not URL params).
export default async function JobsPage() {
  let jobs = [];
  try {
    const all = await fetchAllPages(jobsApi, { status: "ACTIVE" });
    // The cards never show the description; leave the HTML out of the page payload.
    jobs = all.map(({ jobDescription, ...job }) => job);
  } catch {
    jobs = [];
  }

  return (
    <div className="bg-surface font-sans text-on-surface antialiased">
      <SiteHeader />
      <main className="w-full pt-20 bg-surface">
        <Breadcrumb />
        <JobsExplorer jobs={jobs} />
      </main>
      <SiteFooter />
      <ScrollTop />
    </div>
  );
}
