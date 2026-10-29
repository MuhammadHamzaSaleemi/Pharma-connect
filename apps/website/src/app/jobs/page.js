import React from "react";
import { pageMetadata } from "../../lib/site";

import SiteHeader from "../../componants/siteHeader";
import SiteFooter from "../../componants/siteFooter";
import ScrollTop from "../../componants/scrollTop";
import Breadcrumb from "../../componants/breadcrumb";
import JobsExplorer from "../../componants/jobsExplorer";

import { jobsApi } from "../../services/jobs/jobs.api";
import { fetchAllPages } from "../../lib/fetchAllPages";
import { SECTOR_VALUES } from "../../services/jobs/jobs.types";

export const metadata = pageMetadata({
  title: "Pharmacy Jobs in Pakistan & Abroad",
  description: "Browse verified pharmacy jobs in Pakistan and the Gulf: QA, QC, regulatory, medical affairs, sales, hospital and community pharmacy roles for Pharm-D graduates and pharmacists.",
  path: "/jobs",
});

// All filtering/sorting/pagination happens client-side in <JobsExplorer>
// against every active job (filters are React state). The one URL param,
// ?sector=, only seeds the sector filter so homepage category cards can link here.
export default async function JobsPage({ searchParams }) {
  const initialSector = SECTOR_VALUES.includes(searchParams?.sector) ? searchParams.sector : "";
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
        <JobsExplorer jobs={jobs} initialSector={initialSector} />
      </main>
      <SiteFooter />
      <ScrollTop />
    </div>
  );
}
