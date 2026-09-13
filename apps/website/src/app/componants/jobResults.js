import React from "react";
import Link from "next/link";

import JobsCards from "./jobsCards";
import { COUNTRY_CITIES } from "../../lib/countryCities";
import { experienceMatches } from "../../lib/experience";

const PAGE_SIZE = 9;

// Client-side filter — same semantics the backend used: city is a
// case-insensitive substring match; country (no backend field) matches any job
// whose city is one of that country's known cities.
function filterJobs(jobs, country, city, experience) {
    const cityNeedle = city.trim().toLowerCase();
    const countryCities = (COUNTRY_CITIES[country] ?? []).map((c) => c.toLowerCase());

    return jobs.filter((job) => {
        if (!experienceMatches(job.experience, experience)) return false;

        const jobCity = (job.city ?? '').toLowerCase();
        if (cityNeedle) return jobCity.includes(cityNeedle);
        if (countryCities.length) return countryCities.includes(jobCity);
        return true;
    });
}

// Server component: re-renders on every navigation because /jobs reads
// searchParams (dynamic). Reads the filter straight off the searchParams prop so
// repeated filter changes always produce fresh results.
export default function JobResults({ jobs, searchParams }) {
    const country = searchParams?.country ?? '';
    const city = searchParams?.city ?? '';
    const experience = searchParams?.experience ?? '';
    const requestedPage = Math.max(1, Number(searchParams?.page) || 1);

    const filtered = filterJobs(jobs, country, city, experience);
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const page = Math.min(requestedPage, totalPages); // clamp if the filter shrank the set
    const pageJobs = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const buildPageHref = (pageNumber) => {
        const params = new URLSearchParams();
        if (country) params.set('country', country);
        if (city) params.set('city', city);
        if (experience) params.set('experience', experience);
        params.set('page', String(pageNumber));
        return `/jobs?${params.toString()}`;
    };

    return (
        <>
            <JobsCards jobs={pageJobs} />

            {totalPages > 1 && (
                <div className="row">
                    <div className="col-12 mt-4 pt-2">
                        <ul className="pagination justify-content-center mb-0">
                            <li className={`page-item ${page <= 1 ? 'disabled' : ''}`}>
                                <Link className="page-link" href={buildPageHref(Math.max(1, page - 1))} aria-label="Previous">
                                    <span aria-hidden="true"><i className="mdi mdi-chevron-left fs-6"></i></span>
                                </Link>
                            </li>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                                <li className={`page-item ${pageNumber === page ? 'active' : ''}`} key={pageNumber}>
                                    <Link className="page-link" href={buildPageHref(pageNumber)}>{pageNumber}</Link>
                                </li>
                            ))}
                            <li className={`page-item ${page >= totalPages ? 'disabled' : ''}`}>
                                <Link className="page-link" href={buildPageHref(Math.min(totalPages, page + 1))} aria-label="Next">
                                    <span aria-hidden="true"><i className="mdi mdi-chevron-right fs-6"></i></span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </>
    );
}
