import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

import Navbar from "../../componants/navbar";
import BlogsSidebars from "../../componants/blogsSidebars";
import Footer from "../../componants/footer";
import ScrollTop from "../../componants/scrollTop";

import { commentsData } from "../../data/data";
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
                    <div className="col-lg-8 col-md-7">
                        <div className="card border-0 shadow rounded overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={data?.featuredImage || '/images/blog/01.jpg'} className="img-fluid" style={{width:'100%', height:'auto'}} alt={data?.title}/>

                            <div className="card-body">
                                <div className="text-muted" dangerouslySetInnerHTML={{ __html: data?.content ?? '' }}/>

                                {(data?.tags ?? []).map((tag) => (
                                    <Link key={tag} href="#" className="badge badge-link bg-primary">{tag}</Link>
                                ))}
                            </div>
                        </div>

                        <div className="card shadow rounded border-0 mt-4">
                            <div className="card-body">
                                <h5 className="card-title mb-0">Comments :</h5>

                                <ul className="media-list list-unstyled mb-0">
                                    {commentsData.map((item,index)=>{
                                        return(
                                        <li className="mt-4" key={index}>
                                            <div className="d-flex justify-content-between">
                                                <div className="d-flex align-items-center">
                                                    <Link className="pe-3" href="#">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img src={item.image} width={45} height={45} className="img-fluid avatar avatar-md-sm rounded-circle shadow" alt="img" loading="lazy"/>
                                                    </Link>
                                                    <div className="commentor-detail">
                                                        <h6 className="mb-0"><Link href="#" className="text-dark media-heading">{item.name}</Link></h6>
                                                        <small className="text-muted">{item.time}</small>
                                                    </div>
                                                </div>
                                                <Link href="#" className="text-muted"><i className="mdi mdi-reply"></i> Reply</Link>
                                            </div>
                                            <div className="mt-3">
                                                <p className="text-muted fst-italic p-3 bg-light rounded">{item.desc}</p>
                                            </div>
                                        </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        </div>

                        <div className="card shadow rounded mt-4">
                            <div className="card-body">
                                <h5 className="card-title mb-0">Leave A Comment :</h5>

                                <form className="mt-4">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="mb-3">
                                                <label className="form-label">Your Comment</label>
                                                <textarea id="message" placeholder="Your Comment" rows="5" name="message" className="form-control" required=""></textarea>
                                            </div>
                                        </div>

                                        <div className="col-lg-6">
                                            <div className="mb-3">
                                                <label className="form-label">Name <span className="text-danger">*</span></label>
                                                <input id="name" name="name" type="text" placeholder="Name" className="form-control" required=""/>
                                            </div>
                                        </div>

                                        <div className="col-lg-6">
                                            <div className="mb-3">
                                                <label className="form-label">Your Email <span className="text-danger">*</span></label>
                                                <input id="email" type="email" placeholder="Email" name="email" className="form-control" required=""/>
                                            </div>
                                        </div>

                                        <div className="col-md-12">
                                            <div className="send d-grid">
                                                <button type="submit" className="btn btn-primary">Send Message</button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <BlogsSidebars/>
                </div>
            </div>
        </section>
        <Footer/>
        <ScrollTop/>
        </>
    )
}
