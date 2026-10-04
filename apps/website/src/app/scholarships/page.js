import React from "react";
import { notFound } from "next/navigation";

import SiteHeader from "../componants/siteHeader";
import SiteFooter from "../componants/siteFooter";
import ScrollTop from "../componants/scrollTop";
import Breadcrumb from "../componants/breadcrumb";
import ScholarshipsExplorer from "../componants/scholarshipsExplorer";

import { scholarshipsApi } from "../../services/scholarships/scholarships.api";

// Same shape as /jobs: one server fetch, then all filtering/sorting/paging
// happens client-side in <ScholarshipsExplorer>.
const FETCH_LIMIT = 100; // backend caps `limit` at 100

export default async function ScholarshipsPage() {
  notFound(); // hidden for now; delete this line to bring /scholarships back

  let scholarships = [];
  try {
    const result = await scholarshipsApi.list(undefined, { status: "ACTIVE", page: 1, limit: FETCH_LIMIT });
    const now = Date.now();
    // Nothing flips scholarships to EXPIRED automatically, so hide past deadlines here.
    scholarships = (result?.data ?? []).filter((s) => new Date(s.endDate).getTime() >= now);
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
