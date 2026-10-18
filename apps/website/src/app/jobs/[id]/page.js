import React, { cache } from "react";
import { notFound, permanentRedirect } from "next/navigation";

import SiteHeader from "../../../componants/siteHeader";
import SiteFooter from "../../../componants/siteFooter";
import ScrollTop from "../../../componants/scrollTop";
import Breadcrumb from "../../../componants/breadcrumb";
import JobDetail from "../../../componants/jobDetail";
import JsonLd from "../../../componants/jsonLd";

import { jobsApi } from "../../../services/jobs/jobs.api";
import { COUNTRY_CITIES } from "../../../lib/countryCities";
import { formatEnumLabel } from "../../../lib/enumOptions";
import { SITE_NAME, SITE_URL, SITE_LOGO, absoluteUrl, excerpt, jobIdFromParam, jobPath, pageMetadata, safeDecode } from "../../../lib/site";

// JobsService.removeExpiredJobs deletes jobs 21 days after createdAt.
const JOB_LIFETIME_MS = 21 * 24 * 60 * 60 * 1000;

const COUNTRY_CODES = {
    Pakistan: "PK", "United Arab Emirates": "AE", "Saudi Arabia": "SA", Qatar: "QA", Oman: "OM",
    Bahrain: "BH", Kuwait: "KW", "United States": "US", "United Kingdom": "GB", Canada: "CA",
    Australia: "AU", Germany: "DE", India: "IN",
};

function countryCodeFor(city = "") {
    const c = city.trim().toLowerCase();
    const country = Object.keys(COUNTRY_CITIES).find((k) => COUNTRY_CITIES[k].some((x) => x.toLowerCase() === c));
    return COUNTRY_CODES[country];
}

// Shared by generateMetadata and the page (one API call per request). Only
// ACTIVE jobs are public: drafts and closed roles 404 so they never get indexed.
const getJob = cache(async (id) => {
    try {
        const job = await jobsApi.getOne(id);
        return job?.status === "ACTIVE" ? job : null;
    } catch {
        return null;
    }
});

export async function generateMetadata({ params }) {
    const job = await getJob(jobIdFromParam(params.id));
    if (!job) return { title: "Job Not Found", robots: { index: false } };

    const facts = [job.qualification, job.experience].filter(Boolean).join(", ");
    return pageMetadata({
        title: `${job.title} at ${job.company}, ${job.city}`,
        description: excerpt(`${job.title} job at ${job.company} in ${job.city}.${facts ? ` ${facts}.` : ""} ${excerpt(job.jobDescription, 300)}`),
        path: jobPath(job),
    });
}

function jobPostingSchema(job) {
    const country = countryCodeFor(job.city);
    const address = { "@type": "PostalAddress", addressLocality: job.city, ...(country && { addressCountry: country }) };
    return {
        "@context": "https://schema.org",
        "@type": "JobPosting",
        title: job.title,
        description: job.jobDescription,
        datePosted: job.createdAt,
        validThrough: new Date(new Date(job.createdAt).getTime() + JOB_LIFETIME_MS).toISOString(),
        identifier: { "@type": "PropertyValue", name: SITE_NAME, value: job.id },
        hiringOrganization: { "@type": "Organization", name: job.company },
        jobLocation: { "@type": "Place", address },
        ...(job.workType === "REMOTE" && {
            jobLocationType: "TELECOMMUTE",
            ...(country && { applicantLocationRequirements: { "@type": "Country", name: country } }),
        }),
        industry: "Pharmaceuticals",
        ...(job.sector && { occupationalCategory: formatEnumLabel(job.sector) }),
        ...(job.qualification && { qualifications: job.qualification }),
        ...(job.experience && { experienceRequirements: job.experience }),
        directApply: false,
        url: absoluteUrl(jobPath(job)),
        provider: { "@type": "Organization", name: SITE_NAME, sameAs: SITE_URL, logo: SITE_LOGO },
    };
}

export default async function JobDetailPage({ params }) {
    const id = jobIdFromParam(params.id);
    const data = await getJob(id);
    if (!data) notFound();

    // Old "/jobs/<id>" links and renamed titles land on the one canonical URL.
    const canonical = jobPath(data);
    if (`/jobs/${safeDecode(params.id)}` !== canonical) permanentRedirect(canonical);

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
            <JsonLd data={jobPostingSchema(data)} />
            <SiteHeader />
            <main className="w-full pt-20 bg-surface">
                <Breadcrumb items={[{ label: "Find Jobs", href: "/jobs" }, { label: data.title }]} />
                <JobDetail job={data} related={related} />
            </main>
            <SiteFooter />
            <ScrollTop />
        </div>
    );
}
