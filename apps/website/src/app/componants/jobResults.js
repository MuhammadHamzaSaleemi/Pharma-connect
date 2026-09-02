import React from "react";
import Link from "next/link";
import Image from "next/image";

import { formatEnumLabel } from "../../lib/enumOptions";
import { COUNTRY_CITIES } from "../../lib/countryCities";
import { experienceMatches } from "../../lib/experience";
import { FiClock, FiMapPin } from "../assets/icons/vander";

const PAGE_SIZE = 9;

function daysAgo(dateString) {
    const diff = Date.now() - new Date(dateString).getTime();
    const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
    return days === 0 ? 'Today' : `${days} day${days === 1 ? '' : 's'} ago`;
}

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
            <div className="row g-4">
                {pageJobs.length === 0 && (
                    <div className="col-12 text-center">
                        <p className="text-muted mb-0">No job vacancies found.</p>
                    </div>
                )}

                {pageJobs.map((item) => (
                    <div className="col-lg-4 col-md-6 col-12 d-flex" key={item.id}>
                        {/* d-flex on the column + h-100/w-100 here => every card in a row is as tall as the tallest */}
                        <div className="job-post rounded shadow p-4 h-100 w-100">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <Image src='/images/company/circle-logo.png' width={65} height={65} className="avatar avatar-small rounded shadow p-3 bg-white" alt=""/>

                                    <div className="ms-3">
                                        <span className="h5 company text-dark">{item.company}</span>
                                        <span className="text-muted d-flex align-items-center small mt-2"><FiClock className="fea icon-sm me-1"/>{daysAgo(item.createdAt)}</span>
                                    </div>
                                </div>

                                <span className="badge bg-soft-primary">{formatEnumLabel(item.workType)}</span>
                            </div>

                            <div className="mt-4">
                                <Link href={`/jobs/${item.id}`} className="text-dark title h5">{item.title}</Link>

                                <span className="text-muted d-flex align-items-center mt-2"><FiMapPin className="fea icon-sm me-1"/>{item.city}</span>

                                <div className="progress-box mt-3">
                                    <span className="text-dark">{item.qualification} <span className="text-muted">&middot; {item.experience}</span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

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
