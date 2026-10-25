import React from "react";

import SiteHeader from "../../componants/siteHeader";
import SiteFooter from "../../componants/siteFooter";
import ScrollTop from "../../componants/scrollTop";
import Breadcrumb from "../../componants/breadcrumb";
import ScholarshipsExplorer from "../../componants/scholarshipsExplorer";

import { scholarshipsApi } from "../../services/scholarships/scholarships.api";
import { fetchAllPages } from "../../lib/fetchAllPages";
import { pageMetadata } from "../../lib/site";

export const metadata = pageMetadata({
  title: "Pharmacy Scholarships: Pakistan & Abroad",
  description: "Active scholarships for pharmacy students, Pharm-D graduates and pharmacists in Pakistan and abroad, with deadlines and eligibility.",
  path: "/scholarships",
});

// Same shape as /jobs: one server fetch, then all filtering/sorting/paging
// happens client-side in <ScholarshipsExplorer>.

export default async function ScholarshipsPage() {
  let scholarships = [];
  try {
    const all = await fetchAllPages(scholarshipsApi, { status: "ACTIVE" });
    const now = Date.now();
    // The API's nightly job only marks scholarships EXPIRED at midnight; hide ones whose deadline passed today.
    scholarships = all.filter((s) => new Date(s.endDate).getTime() >= now);
  } catch {
    scholarships = [];
  }

  return (
    <div className="bg-surface font-sans text-on-surface antialiased">
      <SiteHeader />
      <main className="w-full pt-20 bg-surface">
        <Breadcrumb />
        <ScholarshipsExplorer scholarships={scholarships} />
      </main>
      <SiteFooter />
      <ScrollTop />
    </div>
  );
}
