import React from "react";
import Link from "next/link";
import Image from "next/image";

import Navbar from "../componants/navbar";
import About from "../componants/aboutUs";
import Footer from "../componants/footer";
import ScrollTop from "../componants/scrollTop";

import { servicesData, teamData } from "../data/data";
import {
  FiFacebook,
  FiInstagram,
  FiLinkedin,
  FiHelpCircle,
} from "../assets/icons/vander";

export default function AboutUs() {
  return (
    <>
      <Navbar navClass="defaultscroll sticky" navLight={true} />
      <section
        className="bg-half-170 d-table w-100"
        style={{
          backgroundImage: "url('/images/hero/bg.jpg')",
          backgroundPosition: "top",
        }}
      >
        <div className="bg-overlay bg-gradient-overlay"></div>
        <div className="container">
          <div className="row mt-5 justify-content-center">
            <div className="col-12">
              <div className="title-heading text-center">
                <h5 className="heading fw-semibold mb-0 sub-heading text-white title-dark">
                  About Us
                </h5>
              </div>
            </div>
          </div>

          <div className="position-middle-bottom">
            <nav aria-label="breadcrumb" className="d-block">
              <ul className="breadcrumb breadcrumb-muted mb-0 p-0 justify-content-center">
                <li className="breadcrumb-item">
                  <Link href="/">PharmaConnect</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  About us
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </section>
      <div className="position-relative">
        <div className="shape overflow-hidden text-white">
          <svg
            viewBox="0 0 2880 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </div>

      <section className="section">
        <About
          containerClass="container"
          title="Pharmacists helping pharmacists go further."
          ctaText="Follow us on LinkedIn"
          ctaHref="https://www.linkedin.com/company/pharmaconnect-pakistan"
          body={
            <>
              <p className="text-muted para-desc mb-0">
                PharmaConnect is a resource for pharmacy students,
                professionals, and job seekers across Pakistan, sharing
                scholarships, internships, summer programs, job openings, and
                career development opportunities in the pharmaceutical and
                healthcare sector.
              </p>
              <p className="text-muted para-desc mb-0 mt-3">
                Founded in 2024 by Muhammad Burhan Khan, PharmaConnect began as
                a LinkedIn page and has grown into a community of 10,000+
                pharmacists worldwide, most of them based in Pakistan.
              </p>
              <p className="text-muted para-desc mb-0 mt-3">
                This website extends that work, letting the pharmacy community
                browse and search a database of current opportunities, or submit
                their own postings for others to find.
              </p>
              <p className="text-muted para-desc mb-0 mt-3">
                All opportunities shared are curated from publicly available
                sources. Always verify details with the official source before
                applying.
              </p>
            </>
          }
        />

        <div className="container mt-100 mt-60">
          <div className="row justify-content-center mb-4 pb-2">
            <div className="col-12">
              <div className="section-title text-center">
                <h4 className="title mb-3">What drives PharmaConnect</h4>
                <p className="text-muted para-desc mx-auto mb-0">
                  We don&apos;t post randomly; every job and recommendation we
                  share follows a clear set of rules we believe in. These rules
                  are simple: be truthful, prioritize quality, and only share
                  roles that are genuinely worth your time and trust.
                </p>
              </div>
            </div>
          </div>

          <div className="row">
            {servicesData.map((item, index) => {
              let Icon = item.icon;
              return (
                <div
                  className="col-lg-4 col-md-4 col-sm-12 col-12 mt-4 pt-2"
                  key={index}
                >
                  <div className="position-relative features text-center p-4 rounded shadow bg-white h-100">
                    <div className="feature-icon bg-soft-primary rounded shadow mx-auto position-relative overflow-hidden d-flex justify-content-center align-items-center">
                      <Icon className="fea icon-ex-md" />
                    </div>

                    <div className="mt-4">
                      <Link href="" className="title h5 text-dark">
                        {item.title}
                      </Link>
                      <p className="text-muted mt-3 mb-0">{item.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="container mt-100 mt-60">
          <div className="row justify-content-center">
            <div className="col">
              <div className="section-title text-center mb-4 pb-2">
                <h4 className="title mb-3">Meet the Team</h4>
                <p className="text-muted para-desc mb-0 mx-auto">
                  The people building PharmaConnect for Pakistan&apos;s pharmacy
                  community and beyond.
                </p>
              </div>
            </div>
          </div>

          <div className="row g-4 mt-0 justify-content-center">
            {teamData.map((item, index) => {
              return (
                <div className="col-lg-3 col-md-4 col-12" key={index}>
                  <div className="card team team-primary text-center">
                    <div className="card-img team-image d-inline-block mx-auto rounded-pill avatar avatar-ex-large overflow-hidden">
                      <Image
                        src={item.image}
                        width={0}
                        height={0}
                        sizes="100vw"
                        style={{ width: "100%", height: "auto" }}
                        className="img-fluid"
                        alt=""
                      />
                      <div className="card-overlay avatar avatar-ex-large rounded-pill"></div>

                      <ul className="list-unstyled team-social mb-0">
                        {item.facebook && (
                          <li className="list-inline-item">
                            <Link
                              href={item.facebook}
                              target="_blank"
                              className="btn btn-sm btn-pills btn-icon"
                            >
                              <FiFacebook className="icons fea-social" />
                            </Link>
                          </li>
                        )}
                        {item.instagram && (
                          <li className="list-inline-item">
                            <Link
                              href={item.instagram}
                              target="_blank"
                              className="btn btn-sm btn-pills btn-icon"
                            >
                              <FiInstagram className="icons fea-social" />
                            </Link>
                          </li>
                        )}
                        {item.linkedin && (
                          <li className="list-inline-item">
                            <Link
                              href={item.linkedin}
                              target="_blank"
                              className="btn btn-sm btn-pills btn-icon"
                            >
                              <FiLinkedin className="icons fea-social" />
                            </Link>
                          </li>
                        )}
                      </ul>
                    </div>

                    <div className="content mt-3">
                      <Link href="#" className="text-dark h5 mb-0 title">
                        {item.name}
                      </Link>
                      <h6 className="text-muted mb-0 fw-normal">
                        {item.title}
                      </h6>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="container mt-100 mt-60">
          <div className="row justify-content-center">
            <div className="col">
              <div className="section-title text-center mb-4 pb-2">
                <h4 className="title mb-3">Questions & Answers</h4>
                <p className="text-muted para-desc mb-0 mx-auto">
                  Everything you need to know about how PharmaConnect works,
                  from sourcing opportunities to joining our community of
                  pharmacists.
                </p>
              </div>
            </div>
          </div>

          <div className="row mt-4 pt-2">
            <div className="col-md-6 col-12">
              <div className="d-flex">
                <FiHelpCircle className="fea icon-ex-md text-primary me-2 mt-1" />
                <div className="flex-1">
                  <h5 className="mt-0">
                    What does{" "}
                    <span className="text-primary">PharmaConnect</span> do ?
                  </h5>
                  <p className="answer text-muted mb-0">
                    PharmaConnect is a platform for local and global pharmacy
                    jobs, scholarships, and career guidance, built for pharmacy
                    students and professionals at any stage of their career,
                    anywhere in the world.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-12 mt-4 mt-sm-0 pt-2 pt-sm-0">
              <div className="d-flex">
                <FiHelpCircle className="fea icon-ex-md text-primary me-2 mt-1" />
                <div className="flex-1">
                  <h5 className="mt-0">
                    {" "}
                    Who founded PharmaConnect, and when?
                  </h5>
                  <p className="answer text-muted mb-0">
                    PharmaConnect was founded in 2024 by Muhammad Burhan Khan, a
                    Pharm-D graduate of COMSATS University Islamabad, with
                    experience in community pharmacy, industrial quality
                    assurance, and pharmaceutical research.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-12 mt-4 pt-2">
              <div className="d-flex">
                <FiHelpCircle className="fea icon-ex-md text-primary me-2 mt-1" />
                <div className="flex-1">
                  <h5 className="mt-0">
                    {" "}
                    How big is the PharmaConnect community?
                  </h5>
                  <p className="answer text-muted mb-0">
                    PharmaConnect reaches 6,000+ pharmacy professionals and
                    students on LinkedIn across Karachi, Lahore, Islamabad, and
                    beyond, with 1000+ career opportunities curated and shared
                    in the past year, growing entirely organically with no paid
                    promotion.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-12 mt-4 pt-2">
              <div className="d-flex">
                <FiHelpCircle className="fea icon-ex-md text-primary me-2 mt-1" />
                <div className="flex-1">
                  <h5 className="mt-0">
                    {" "}
                    Are the opportunities on{" "}
                    <span className="text-primary">PharmaConnect</span> verified
                    ?
                  </h5>
                  <p className="answer text-muted mb-0">
                    A listing is marked Verified when it names a real company
                    and provides a traceable way to apply, such as:
                  </p>

                  <ul className="list-unstyled text-muted mb-0">
                    <li className="mb-1">
                      <i className="mdi mdi-circle-medium me-1"></i>A company
                      email
                    </li>
                    <li className="mb-1">
                      <i className="mdi mdi-circle-medium me-1"></i>A link to
                      the company&apos;s official posting{" "}
                    </li>
                  </ul>
                  <p className="answer text-muted mb-0">
                    If the company or contact details cannot be confirmed, the
                    listing carries a clear note instead.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-md-5 pt-md-3 mt-4 pt-2 justify-content-center">
            <div className="col-12 text-center">
              <div className="section-title">
                <h4 className="title mb-4">Have Question ? Get in touch!</h4>
                <p className="text-muted para-desc mx-auto">
                  If you have a job opportunity you’d like to share or any queries regarding {" "}
                  <span className="text-primary fw-bold">PharmaConnect</span> , please feel free to contact us.
                </p>
                <Link href="/contactus" className="btn btn-primary mt-3">
                  <i className="uil uil-phone"></i> Contact us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
      <ScrollTop />
    </>
  );
}
