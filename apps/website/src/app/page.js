"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "./componants/navbar";

import {
  FiClock,
  FiMapPin,
  FiCalendar,
  FiBriefcase,
  FiAward,
  FiActivity,
  FiFileText,
  FiLink2,
  FiShare2,
  FiBook,
  FiImage,
} from "./assets/icons/vander";
import AboutUs from "./componants/aboutUs";
import Categories from "./componants/categories";
import AboutTwo from "./componants/aboutTwo";
import Companies from "./componants/companies";
import Footer from "./componants/footer";
import ScrollTop from "./componants/scrollTop";
import { usePublicJobsQuery } from "../services/jobs/jobs.queries";
import { usePublicBlogsQuery } from "../services/blogs/blogs.queries";
import { formatEnumLabel } from "../lib/enumOptions";

function daysAgo(dateString) {
  const diff = Date.now() - new Date(dateString).getTime();
  const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  return days === 0 ? "Today" : `${days} day${days === 1 ? "" : "s"} ago`;
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const dummyJobs = [
  {
    id: "dummy-1",
    company: "MediCare Pharmaceuticals",
    createdAt: new Date().toISOString(),
    workType: "FULL_TIME",
    title: "Clinical Pharmacist",
    city: "Karachi",
    qualification: "Pharm-D",
    experience: "2+ years",
  },
  {
    id: "dummy-2",
    company: "HealthPlus Hospital",
    createdAt: new Date().toISOString(),
    workType: "PART_TIME",
    title: "Pharmacy Technician",
    city: "Lahore",
    qualification: "B.Pharm",
    experience: "1+ years",
  },
  {
    id: "dummy-3",
    company: "Wellness Retail Pharmacy",
    createdAt: new Date().toISOString(),
    workType: "INTERNSHIP",
    title: "Pharmacy Intern",
    city: "Islamabad",
    qualification: "Pharm-D (Final Year)",
    experience: "Fresh",
  },
];

const dummyBlogs = [
  {
    id: "dummy-blog-1",
    featuredImage: "/images/blog/01.jpg",
    title: "5 Skills Every Pharmacy Graduate Needs in 2026",
    category: "Careers",
    publishedAt: new Date().toISOString(),
  },
  {
    id: "dummy-blog-2",
    featuredImage: "/images/blog/02.jpg",
    title: "How to Land Your First Hospital Pharmacy Job",
    category: "Guides",
    publishedAt: new Date().toISOString(),
  },
  {
    id: "dummy-blog-3",
    featuredImage: "/images/blog/03.jpg",
    title: "Scholarships for Pharm-D Students in Pakistan",
    category: "Scholarships",
    publishedAt: new Date().toISOString(),
  },
];

export default function Home() {
  const jobsQuery = usePublicJobsQuery({ page: 1, limit: 6, status: "ACTIVE" });
  const blogsQuery = usePublicBlogsQuery({
    page: 1,
    limit: 3,
    status: "PUBLISHED",
  });

  const apiJobs = jobsQuery.data?.data ?? [];
  const jobs =
    !jobsQuery.isLoading && (jobsQuery.isError || apiJobs.length === 0)
      ? dummyJobs
      : apiJobs;
  const apiBlogs = blogsQuery.data?.data ?? [];
  const blogs =
    !blogsQuery.isLoading && (blogsQuery.isError || apiBlogs.length === 0)
      ? dummyBlogs
      : apiBlogs;

  return (
    <>
      <Navbar />

      <section
        className="bg-half-170 d-table w-100 position-relative overflow-hidden"
        style={{
          backgroundImage: "url('/images/hero-lab-bg.jpg')",
          backgroundPosition: "center",
        }}
      >
        <div
          className="position-absolute top-0 start-0 w-100 h-100 bg-primary"
          style={{ opacity: 0.8, mixBlendMode: "multiply" }}
        ></div>
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background:
              "linear-gradient(to right, rgba(2,10,20,0.85), transparent)",
          }}
        ></div>

        <div className="container position-relative">
          <div className="row g-4 align-items-center">
            <div className="col-md-6">
              <div className="title-heading">
                <h1 className="heading text-white fw-bold">
                  Discover Pharmacy <br /> Opportunities <br />
                  that matter.
                </h1>
                <p className="para-desc text-white mb-0">
                  Jobs, scholarships, and internships for pharmacists,
                  technicians, and students across Pakistan and abroad.
                </p>

                <div className="d-flex flex-wrap gap-2 mt-4">
                  <Link href="/jobs" className="btn btn-secondary btn-hero shadow-sm">
                    Explore Jobs
                  </Link>
                  <Link href="/job-post" className="btn btn-glass btn-hero">
                    Post Opportunity
                  </Link>
                </div>

                <div className="row g-3 mt-1" style={{ maxWidth: "560px" }}>
                  {[
                    { label: "Jobs", icon: FiBriefcase, href: "/jobs" },
                    { label: "Scholarships", icon: FiAward, href: "#" },
                    { label: "Internships", icon: FiActivity, href: "#" },
                    { label: "Blogs", icon: FiFileText, href: "/blogs" },
                  ].map(({ label, icon: Icon, href }) => (
                    <div className="col-6 col-md-3" key={label}>
                      <Link
                        href={href}
                        className="d-flex flex-column align-items-center justify-content-center text-white text-decoration-none rounded p-3"
                        style={{
                          background: "rgba(255,255,255,0.1)",
                          border: "1px solid rgba(255,255,255,0.2)",
                          backdropFilter: "blur(6px)",
                        }}
                      >
                        <Icon className="fea icon-md mb-2" />
                        <span className="fw-medium">{label}</span>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="position-relative ms-lg-5">
                <Image
                  src="/images/hero2.png"
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{ width: "100%", height: "auto" }}
                  className="img-fluid p-5"
                  alt=""
                />

                <div className="spinner">
                  <div className="position-absolute top-0 start-50 translate-middle-x" style={{ marginTop: "-16px" }}>
                    <span className="avatar avatar-md-sm rounded shadow p-2 bg-white d-flex align-items-center justify-content-center text-danger">
                      <FiLink2 className="fea icon-20" />
                    </span>
                  </div>
                  <div className="position-absolute top-50 start-0 translate-middle-y" style={{ marginLeft: "-16px" }}>
                    <span className="avatar avatar-md-sm rounded shadow p-2 bg-white d-flex align-items-center justify-content-center text-primary">
                      <FiBook className="fea icon-20" />
                    </span>
                  </div>
                  <div className="position-absolute top-50 end-0 translate-middle-y" style={{ marginRight: "-16px" }}>
                    <span className="avatar avatar-md-sm rounded shadow p-2 bg-white d-flex align-items-center justify-content-center text-danger">
                      <FiImage className="fea icon-20" />
                    </span>
                  </div>
                  <div className="position-absolute bottom-0 start-50 translate-middle-x" style={{ marginBottom: "-16px" }}>
                    <span className="avatar avatar-md-sm rounded shadow p-2 bg-white d-flex align-items-center justify-content-center text-primary">
                      <FiShare2 className="fea icon-20" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <AboutUs containerClass="container" />
        <Categories />
        <div className="container mt-100 mt-60">
          <div className="row align-items-end mb-4 pb-2">
            <div className="col-lg-6 col-md-9">
              <div className="section-title text-md-start text-center">
                <h4 className="title mb-3">Explore Jobs</h4>
                <p className="text-muted para-desc mb-0">
                  Roles from leading manufacturers, hospitals, and retail networks across Karachi, Lahore, Islamabad and beyond.
                </p>
              </div>
            </div>

            <div className="col-lg-6 col-md-3 d-none d-md-block">
              <div className="text-md-end">
                <Link
                  href="/job-grid-one"
                  className="btn btn-link primary text-muted"
                >
                  See More Jobs <i className="mdi mdi-arrow-right"></i>
                </Link>
              </div>
            </div>
          </div>

          <div className="row g-4 mt-0">
            {jobsQuery.isLoading && (
              <div className="col-12 text-center text-muted">
                Loading jobs...
              </div>
            )}

            {jobs.map((item) => {
              return (
                <div className="col-lg-4 col-md-6 col-12" key={item.id}>
                  <div className="job-post rounded shadow p-4 h-100" style={{minHeight:'230px'}}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <Image
                          src="/images/company/circle-logo.png"
                          width={45}
                          height={45}
                          className="avatar avatar-small rounded shadow p-3 bg-white"
                          alt=""
                        />

                        <div className="ms-3">
                          <span className="h5 company text-dark">
                            {item.company}
                          </span>
                          <span className="text-muted d-flex align-items-center small mt-2">
                            <FiClock className="fea icon-sm me-1" />{" "}
                            {daysAgo(item.createdAt)}
                          </span>
                        </div>
                      </div>

                      <span className="badge bg-soft-primary">
                        {formatEnumLabel(item.workType)}
                      </span>
                    </div>

                    <div className="mt-4">
                      <Link
                        href={`/job-detail-one/${item.id}`}
                        className="text-dark title h5"
                      >
                        {item.title}
                      </Link>

                      <span className="text-muted d-flex align-items-center mt-2">
                        <FiMapPin className="fea icon-sm me-1" />
                        {item.city}
                      </span>

                      <div className="progress-box mt-3">
                        <span className="text-dark">
                          {item.qualification}{" "}
                          <span className="text-muted">
                            &middot; {item.experience}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="col-12 d-md-none d-block">
              <div className="text-center">
                <Link
                  href="/jobs"
                  className="btn btn-link primary text-muted"
                >
                  See More Jobs <i className="mdi mdi-arrow-right"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <AboutTwo />

        {/* <div className="container mt-100 mt-60">
          <Companies />
        </div> */}

        <div className="container mt-100 mt-60">
          <div className="row justify-content-center">
            <div className="col">
              <div className="section-title text-center mb-4 pb-2">
                <h4 className="title mb-3">Latest Blog or News</h4>
                <p className="text-muted para-desc mb-0 mx-auto">
                  Search all the open positions on the web. Get your own
                  personalized salary estimate. Read reviews on over 30000+
                  companies worldwide.
                </p>
              </div>
            </div>
          </div>

          <div className="row g-4 mt-0">
            {blogsQuery.isLoading && (
              <div className="col-12 text-center text-muted">
                Loading blog posts...
              </div>
            )}

            {blogs.map((item) => {
              return (
                <div className="col-lg-4 col-md-6" key={item.id}>
                  <div className="card blog blog-primary shadow rounded overflow-hidden border-0">
                    <div className="card-img blog-image position-relative overflow-hidden rounded-0">
                      <div className="position-relative overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.featuredImage || "/images/blog/01.jpg"}
                          className="img-fluid"
                          style={{
                            width: "100%",
                            height: "220px",
                            objectFit: "cover",
                          }}
                          alt={item.title}
                          loading="lazy"
                        />
                        <div className="card-overlay"></div>
                      </div>
                    </div>

                    <div className="card-body blog-content position-relative p-0">
                      <div className="blog-tag px-4">
                        <span className="badge bg-primary rounded-pill">
                          {item.category || "Blog"}
                        </span>
                      </div>
                      <div className="p-4">
                        <ul className="list-unstyled text-muted small mb-2">
                          <li className="d-inline-flex align-items-center me-2">
                            <FiCalendar className="fea icon-ex-sm me-1 text-dark" />
                            {formatDate(item.publishedAt || item.createdAt)}
                          </li>
                        </ul>

                        <Link
                          href={`/blog-detail/${item.id}`}
                          className="title fw-semibold fs-5 text-dark"
                        >
                          {item.title}
                        </Link>

                        <ul className="list-unstyled d-flex justify-content-between align-items-center text-muted mb-0 mt-3">
                          <li className="list-inline-item">
                            <Link
                              href={`/blog-detail/${item.id}`}
                              className="btn btn-link primary text-dark"
                            >
                              Read Now <i className="mdi mdi-arrow-right"></i>
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <Footer />
      <ScrollTop />
    </>
  );
}
