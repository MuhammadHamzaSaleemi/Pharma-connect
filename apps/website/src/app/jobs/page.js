import React from "react";
import Link from "next/link";
import Image from "next/image";

import Navbar from "../componants/navbar";
import FormSelect from "../componants/formSelect";
import Footer from "../componants/footer";
import ScrollTop from "../componants/scrollTop";

import { jobsApi } from "../../services/jobs/jobs.api";
import { formatEnumLabel } from "../../lib/enumOptions";
import {FiClock,FiMapPin} from "../assets/icons/vander"

const PAGE_SIZE = 9;

function daysAgo(dateString) {
    const diff = Date.now() - new Date(dateString).getTime();
    const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
    return days === 0 ? 'Today' : `${days} day${days === 1 ? '' : 's'} ago`;
}

export default async function JobGridOne({ searchParams }){
    const page = Math.max(1, Number(searchParams?.page) || 1);
    const search = searchParams?.search || undefined;
    const city = searchParams?.city || undefined;
    const workType = searchParams?.workType || undefined;

    const filterParams = { search, city, workType };

    let jobs = [];
    let meta = null;
    try {
        const result = await jobsApi.list(undefined, { status: 'ACTIVE', page, limit: PAGE_SIZE, ...filterParams });
        jobs = result?.data ?? [];
        meta = result?.meta ?? null;
    } catch {
        jobs = [];
        meta = null;
    }

    const buildPageHref = (pageNumber) => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (city) params.set('city', city);
        if (workType) params.set('workType', workType);
        params.set('page', String(pageNumber));
        return `/jobs?${params.toString()}`;
    };

    return(
        <>
        <Navbar navClass="defaultscroll sticky" navLight={true}/>
        <section className="bg-half-170 d-table w-100" style={{backgroundImage:"url('/images/hero/bg.jpg')", backgroundPosition:'top'}}>
            <div className="bg-overlay bg-gradient-overlay"></div>
            <div className="container">
                <div className="row mt-5 justify-content-center">
                    <div className="col-12">
                        <div className="title-heading text-center">
                            <h5 className="heading fw-semibold mb-0 sub-heading text-white title-dark">Job Vacancies</h5>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <div className="position-relative">
            <div className="shape overflow-hidden text-white">
                <svg viewBox="0 0 2880 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z" fill="currentColor"></path>
                </svg>
            </div>
        </div>
        <section className="section">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 mt-4">
                        <div className="features-absolute">
                            <div className="d-md-flex justify-content-between align-items-center bg-white shadow rounded p-4">
                               <FormSelect/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mt-60">
                <div className="row g-4">
                    {jobs.length === 0 && (
                        <div className="col-12 text-center">
                            <p className="text-muted mb-0">No job vacancies found.</p>
                        </div>
                    )}

                    {jobs.map((item)=>{
                        return(
                            <div className="col-lg-4 col-md-6 col-12" key={item.id}>
                                <div className="job-post rounded shadow p-4">
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
                                        <Link href={`/job-detail-one/${item.id}`} className="text-dark title h5">{item.title}</Link>

                                        <span className="text-muted d-flex align-items-center mt-2"><FiMapPin className="fea icon-sm me-1"/>{item.city}</span>

                                        <div className="progress-box mt-3">
                                            <span className="text-dark">{item.qualification} <span className="text-muted">&middot; {item.experience}</span></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                </div>

                {meta && meta.totalPages > 1 && (
                    <div className="row">
                        <div className="col-12 mt-4 pt-2">
                            <ul className="pagination justify-content-center mb-0">
                                <li className={`page-item ${page <= 1 ? 'disabled' : ''}`}>
                                    <Link className="page-link" href={buildPageHref(Math.max(1, page - 1))} aria-label="Previous">
                                        <span aria-hidden="true"><i className="mdi mdi-chevron-left fs-6"></i></span>
                                    </Link>
                                </li>
                                {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((pageNumber) => (
                                    <li className={`page-item ${pageNumber === page ? 'active' : ''}`} key={pageNumber}>
                                        <Link className="page-link" href={buildPageHref(pageNumber)}>{pageNumber}</Link>
                                    </li>
                                ))}
                                <li className={`page-item ${page >= meta.totalPages ? 'disabled' : ''}`}>
                                    <Link className="page-link" href={buildPageHref(Math.min(meta.totalPages, page + 1))} aria-label="Next">
                                        <span aria-hidden="true"><i className="mdi mdi-chevron-right fs-6"></i></span>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </section>
        <Footer/>
        <ScrollTop/>
        </>
    )
}