'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import ModalVideo from 'react-modal-video';
import 'react-modal-video/scss/modal-video.scss';

export default function AboutUs({containerClass}){
    let [isOpen, setOpen] = useState(false);
    return(
        <>
            <div className={containerClass}>
                <div className="row g-4 align-items-center">
                    <div className="col-lg-6 col-md-6 mb-5">
                        <div className="about-left">
                            <div className="position-relative shadow rounded img-one">
                                <Image src='/images/about/ab01.jpeg' width={0} height={0} sizes='100vw' style={{width:'100%',height:'auto'}} className="img-fluid rounded" alt=""/>
                            </div>

                            
                        </div>
                    </div>

                    <div className="col-lg-6 col-md-6">
                        <div className="section-title ms-lg-5">
                            <h4 className="title mb-3">Pharmacy Job Platform. <br/> Find the right opportunity you deserve.</h4>
                            <p className="text-muted para-desc mb-0">PharmaConnect Pakistan connects pharmacists, technicians, and students with verified job openings, scholarships, and internships across Pakistan and beyond.</p>
                        
                            <ul className="list-unstyled text-muted mb-0 mt-3">
                                <li className="mb-1"><span className="text-primary h5 me-2"><i className="mdi mdi-check-circle-outline align-middle"></i></span>Every listing is marked Verified or Unverified based on confirmed source information.</li>
                                <li className="mb-1"><span className="text-primary h5 me-2"><i className="mdi mdi-check-circle-outline align-middle"></i></span>Founded by a Pharm-D graduate with direct pharmacy industry experience.</li>
                                <li className="mb-1"><span className="text-primary h5 me-2"><i className="mdi mdi-check-circle-outline align-middle"></i></span>600+ curated pharma careers. 800,000+ impressions. Pakistan&apos;s most active pharmacy community.</li>
                            </ul>

                            <div className="mt-4">
                                <Link href="/aboutus" className="btn btn-primary">About Us <i className="mdi mdi-arrow-right align-middle"></i></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}