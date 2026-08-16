import React from "react";
import Link from "next/link";

import Navbar from "../componants/navbar";
import Footer from "../componants/footer";
import ScrollTop from "../componants/scrollTop";

import { blogsApi } from "../../services/blogs/blogs.api";

import {FiClock, FiCalendar} from "../assets/icons/vander"

const PAGE_SIZE = 9;

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

function estimateReadTime(html) {
    const wordCount = (html || '').replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(wordCount / 200));
    return `${minutes} min read`;
}

export default async function Blogs({ searchParams }){
    const page = Math.max(1, Number(searchParams?.page) || 1);

    let blogs = [];
    let meta = null;
    try {
        const result = await blogsApi.list(undefined, { status: 'PUBLISHED', page, limit: PAGE_SIZE });
        blogs = result?.data ?? [];
        meta = result?.meta ?? null;
    } catch {
        blogs = [];
        meta = null;
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
                            <p className="text-white-50 para-desc mx-auto mb-0">Latest News</p>
                            <h5 className="heading fw-semibold mb-0 sub-heading text-white title-dark">Blogs & News</h5>
                        </div>
                    </div>
                </div>

                <div className="position-middle-bottom">
                    <nav aria-label="breadcrumb" className="d-block">
                        <ul className="breadcrumb breadcrumb-muted mb-0 p-0">
                            <li className="breadcrumb-item"><Link href="/">PharmaConnect</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Blogs</li>
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
                    {blogs.length === 0 && (
                        <div className="col-12 text-center">
                            <p className="text-muted mb-0">No blog posts found.</p>
                        </div>
                    )}

                    {blogs.map((item)=>{
                        return(
                        <div className="col-lg-4 col-md-6" key={item.id}>
                            <div className="card blog blog-primary shadow rounded overflow-hidden border-0">
                                <div className="card-img blog-image position-relative overflow-hidden rounded-0">
                                    <div className="position-relative overflow-hidden">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={item.featuredImage || '/images/blog/01.jpg'} style={{width:"100%", height:'auto'}} className="img-fluid" alt={item.title} loading="lazy"/>
                                        <div className="card-overlay"></div>
                                    </div>
                                </div>

                                <div className="card-body blog-content position-relative p-0">
                                    <div className="blog-tag px-4">
                                        <span className="badge bg-primary rounded-pill">{item.category || 'Blog'}</span>
                                    </div>
                                    <div className="p-4">
                                        <ul className="list-unstyled text-muted small mb-2">
                                            <li className="d-inline-flex align-items-center me-2"><FiCalendar className="fea icon-ex-sm me-1 text-dark"/>{formatDate(item.publishedAt || item.createdAt)}</li>
                                            <li className="d-inline-flex align-items-center"><FiClock className="fea icon-ex-sm me-1 text-dark"/>{estimateReadTime(item.content)}</li>
                                        </ul>

                                        <Link href={`/blogs/${item.id}`} className="title fw-semibold fs-5 text-dark">{item.title}</Link>

                                        <ul className="list-unstyled d-flex justify-content-between align-items-center text-muted mb-0 mt-3">
                                            <li className="list-inline-item me-2"><Link href={`/blogs/${item.id}`} className="btn btn-link primary text-dark">Read Now <i className="mdi mdi-arrow-right"></i></Link></li>
                                        </ul>
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
                                    <Link className="page-link" href={`/blogs?page=${Math.max(1, page - 1)}`} aria-label="Previous">
                                        <span aria-hidden="true"><i className="mdi mdi-chevron-left fs-6"></i></span>
                                    </Link>
                                </li>
                                {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((pageNumber) => (
                                    <li className={`page-item ${pageNumber === page ? 'active' : ''}`} key={pageNumber}>
                                        <Link className="page-link" href={`/blogs?page=${pageNumber}`}>{pageNumber}</Link>
                                    </li>
                                ))}
                                <li className={`page-item ${page >= meta.totalPages ? 'disabled' : ''}`}>
                                    <Link className="page-link" href={`/blogs?page=${Math.min(meta.totalPages, page + 1)}`} aria-label="Next">
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