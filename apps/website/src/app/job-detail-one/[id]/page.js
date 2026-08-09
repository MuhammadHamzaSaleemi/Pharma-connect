import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

import Navbar from "../../componants/navbar";
import Footer from "../../componants/footer";
import ScrollTop from "../../componants/scrollTop";

import {FiLayout, FiMapPin,FiUserCheck, FiClock, FiMonitor, FiBriefcase, FiBook} from "../../assets/icons/vander"
import { jobsApi } from "../../../services/jobs/jobs.api";
import { formatEnumLabel } from "../../../lib/enumOptions";

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
}

function daysAgo(dateString) {
    const diff = Date.now() - new Date(dateString).getTime()
    const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)))
    return days === 0 ? 'Today' : `${days} day${days === 1 ? '' : 's'} ago`
}

export default async function JobDetailOne({ params }){
    const { id } = params;

    let data;
    try {
        data = await jobsApi.getOne(id);
    } catch {
        notFound();
    }

    let relatedJobs = [];
    try {
        const related = await jobsApi.list(undefined, { limit: 4, status: 'ACTIVE' });
        relatedJobs = (related?.data ?? []).filter((job) => job.id !== id).slice(0, 3);
    } catch {
        relatedJobs = [];
    }

    return(
        <>
        <Navbar navClass="defaultscroll sticky" navLight={true}/>

        <section className="bg-half-170 d-table w-100" style={{backgroundImage:'url("/images/hero/bg.jpg")', backgroundPosition:'top'}}>
            <div className="bg-overlay bg-gradient-overlay"></div>
            <div className="container">
                <div className="row mt-5 justify-content-center">
                    <div className="col-12">
                        <div className="title-heading text-center">
                            <Image src='/images/company/circle-logo.png' height={65} width={65} className="avatar avatar-small rounded-pill p-2 bg-white" alt=""/>
                            <h5 className="heading fw-semibold mb-0 sub-heading text-white title-dark mt-3">{data?.title}</h5>
                        </div>
                    </div>
                </div>

                <div className="position-middle-bottom">
                    <nav aria-label="breadcrumb" className="d-block">
                        <ul className="breadcrumb breadcrumb-muted mb-0 p-0">
                            <li className="breadcrumb-item"><Link href="/">Jobnova</Link></li>
                            <li className="breadcrumb-item"><Link href="/job-grid-one">Jobs</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Job Detail</li>
                        </ul>
                    </nav>
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
                <div className="row g-4">
                    <div className="col-lg-4 col-md-6 col-12">
                        <div className="card bg-white rounded shadow sticky-bar">
                            <div className="p-4">
                                <h5 className="mb-0">Job Information</h5>
                            </div>

                            <div className="card-body p-4 border-top">
                                <div className="d-flex widget align-items-center">
                                    <FiLayout className="fea icon-ex-md me-3"/>
                                    <div className="flex-1">
                                        <h6 className="widget-title mb-0">Company Name:</h6>
                                        <small className="text-primary mb-0">{data?.company}</small>
                                    </div>
                                </div>

                                <div className="d-flex widget align-items-center mt-3">
                                    <FiUserCheck className="fea icon-ex-md me-3"/>
                                    <div className="flex-1">
                                        <h6 className="widget-title mb-0">Employee Type:</h6>
                                        <small className="text-primary mb-0">{formatEnumLabel(data?.workType)}</small>
                                    </div>
                                </div>

                                <div className="d-flex widget align-items-center mt-3">
                                    <FiMapPin className="fea icon-ex-md me-3"/>
                                    <div className="flex-1">
                                        <h6 className="widget-title mb-0">Location:</h6>
                                        <small className="text-primary mb-0">{data?.city}</small>
                                    </div>
                                </div>

                                <div className="d-flex widget align-items-center mt-3">
                                    <FiMonitor className="fea icon-ex-md me-3" />
                                    <div className="flex-1">
                                        <h6 className="widget-title mb-0">Sector:</h6>
                                        <small className="text-primary mb-0">{formatEnumLabel(data?.sector)}</small>
                                    </div>
                                </div>

                                <div className="d-flex widget align-items-center mt-3">
                                    <FiBriefcase className="fea icon-ex-md me-3"/>
                                    <div className="flex-1">
                                        <h6 className="widget-title mb-0">Experience:</h6>
                                        <small className="text-primary mb-0">{data?.experience}</small>
                                    </div>
                                </div>

                                <div className="d-flex widget align-items-center mt-3">
                                    <FiBook className="fea icon-ex-md me-3"/>
                                    <div className="flex-1">
                                        <h6 className="widget-title mb-0">Qualifications:</h6>
                                        <small className="text-primary mb-0">{data?.qualification}</small>
                                    </div>
                                </div>

                                <div className="d-flex widget align-items-center mt-3">
                                    <FiClock className="fea icon-ex-md me-3"/>
                                    <div className="flex-1">
                                        <h6 className="widget-title mb-0">Date posted:</h6>
                                        <small className="text-primary mb-0">{data?.createdAt ? formatDate(data.createdAt) : ''}</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-8 col-md-6 col-12">
                        <h5>Job Description: </h5>
                        <div className="text-muted" dangerouslySetInnerHTML={{ __html: data?.jobDescription ?? '' }}/>

                        <div className="mt-4">
                            <Link href="/job-apply" className="btn btn-outline-primary">Apply Now <i className="mdi mdi-send"></i></Link>
                        </div>
                    </div>
                </div>
            </div>

            {relatedJobs.length > 0 && (
                <div className="container mt-100 mt-60">
                    <div className="row justify-content-center mb-4 pb-2">
                        <div className="col-12">
                            <div className="section-title text-center">
                                <h4 className="title mb-3">Related Vacancies</h4>
                                <p className="text-muted para-desc mx-auto mb-0">Search all the open positions on the web. Get your own personalized salary estimate. Read reviews on over 30000+ companies worldwide.</p>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {relatedJobs.map((item)=>{
                            return(
                                <div className="col-lg-4 col-md-6 col-12 mt-4 pt-2" key={item.id}>
                                    <div className="job-post rounded shadow p-4">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="d-flex align-items-center">
                                                <Image src='/images/company/circle-logo.png' width={65} height={65} className="avatar avatar-small rounded shadow p-3 bg-white" alt=""/>

                                                <div className="ms-3">
                                                    <span className="h5 company text-dark">{item.company}</span>
                                                    <span className="text-muted d-flex align-items-center small mt-2"><FiClock className="fea icon-sm me-1"/> {daysAgo(item.createdAt)}</span>
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
                </div>
            )}
        </section>
        <Footer top={true}/>
        <ScrollTop/>
        </>
    )
}
