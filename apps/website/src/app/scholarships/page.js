import React from "react";
import { notFound } from "next/navigation";

import SiteHeader from "../../componants/siteHeader";
import SiteFooter from "../../componants/siteFooter";
import ScrollTop from "../../componants/scrollTop";
import Breadcrumb from "../../componants/breadcrumb";
import ScholarshipsExplorer from "../../componants/scholarshipsExplorer";

import { scholarshipsApi } from "../../services/scholarships/scholarships.api";
import { fetchAllPages } from "../../lib/fetchAllPages";

// Same shape as /jobs: one server fetch, then all filtering/sorting/paging
// happens client-side in <ScholarshipsExplorer>.

export default async function ScholarshipsPage() {
  notFound(); // hidden for now; delete this line to bring /scholarships back

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
