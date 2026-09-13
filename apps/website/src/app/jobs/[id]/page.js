import React from "react";
import { notFound } from "next/navigation";

import SiteHeader from "../../componants/siteHeader";
import SiteFooter from "../../componants/siteFooter";
import ScrollTop from "../../componants/scrollTop";
import JobDetail from "../../componants/jobDetail";

import { jobsApi } from "../../../services/jobs/jobs.api";

export default async function JobDetailPage({ params }) {
    const { id } = params;

    let data;
    try {
        data = await jobsApi.getOne(id);
    } catch {
        notFound();
    }

    let related = [];
    try {
        const result = await jobsApi.list(undefined, { status: "ACTIVE", page: 1, limit: 20 });
        const pool = (result?.data ?? []).filter((job) => job.id !== id);
        const sameSector = pool.filter((job) => job.sector === data.sector);
        const sameCity = pool.filter((job) => job.city === data.city);
        const ranked = [...sameSector, ...sameCity, ...pool];
        related = [...new Map(ranked.map((job) => [job.id, job])).values()].slice(0, 3);
    } catch {
        related = [];
    }

    return (
        <div className="bg-surface font-sans text-on-surface antialiased">
            <SiteHeader />
            <main className="w-full pt-20 bg-surface">
                <JobDetail job={data} related={related} />
            </main>
            <SiteFooter />
            <ScrollTop />
        </div>
    );
}
