import React, { Suspense } from "react";

import Navbar from "../componants/navbar";
import FormSelect from "../componants/formSelect";
import JobResults from "../componants/jobResults";
import Footer from "../componants/footer";
import ScrollTop from "../componants/scrollTop";

import { jobsApi } from "../../services/jobs/jobs.api";

// Reading searchParams makes this route dynamic, so it re-runs on every filter
// change and <JobResults> always renders fresh results. The jobs fetch itself is
// cache: 'force-cache' by default, so changing the filter does not re-hit the API.
// Filtering + pagination run in <JobResults> against this one fetched list.
const FETCH_LIMIT = 100; // backend caps `limit` at 100

export default async function JobGridOne({ searchParams }){
    let jobs = [];
    try {
        const result = await jobsApi.list(undefined, { status: 'ACTIVE', page: 1, limit: FETCH_LIMIT });
        jobs = result?.data ?? [];
    } catch {
        jobs = [];
    }

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
                               {/* Suspense: both children read useSearchParams() */}
                               <Suspense fallback={null}>
                                   <FormSelect/>
                               </Suspense>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mt-60">
                <JobResults jobs={jobs} searchParams={searchParams}/>
            </div>
        </section>
        <Footer/>
        <ScrollTop/>
        </>
    )
}
