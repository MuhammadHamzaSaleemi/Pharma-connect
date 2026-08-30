import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

import Navbar from "../../componants/navbar";
import Footer from "../../componants/footer";
import ScrollTop from "../../componants/scrollTop";

import { blogsApi } from "../../../services/blogs/blogs.api";

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default async function BlogDetail({ params }){
    const { id } = params;

    let data;
    try {
        data = await blogsApi.getOne(id);
    } catch {
        notFound();
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
                            <span className="badge bg-primary">{data?.category || 'Blog'}</span>
                            <h5 className="heading fw-semibold mb-0 sub-heading text-white title-dark mt-4">{data?.title}</h5>

                            <ul className="list-inline text-center mb-0">
                                <li className="list-inline-item mx-4 mt-4">
                                    <span className="text-white-50 d-block">Date</span>
                                    <span className="text-white title-dark">{data?.publishedAt ? formatDate(data.publishedAt) : formatDate(data.createdAt)}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="position-middle-bottom">
                    <nav aria-label="breadcrumb" className="d-block">
                        <ul className="breadcrumb breadcrumb-muted mb-0 p-0">
                            <li className="breadcrumb-item"><Link href="/">PharmaConnect</Link></li>
                            <li className="breadcrumb-item"><Link href="/blogs">Blogs</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Detail</li>
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
                    <div className="col-12">
                        <div className="card border-0 shadow rounded overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={data?.featuredImage || '/images/blog/01.jpg'} className="img-fluid" style={{width:'100%', height:'auto'}} alt={data?.title}/>

                            <div className="card-body">
                                <div className="text-dark" dangerouslySetInnerHTML={{ __html: data?.content ?? '' }}/>

                                {(data?.tags ?? []).map((tag) => (
                                    <Link key={tag} href="#" className="badge badge-link bg-primary">{tag}</Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <Footer/>
        <ScrollTop/>
        </>
    )
}
