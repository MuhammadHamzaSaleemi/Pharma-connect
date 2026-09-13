import React from "react";
import Link from "next/link";
import Image from "next/image";

import {FiShoppingCart, FiDribbble, FiLinkedin, FiFacebook, FiInstagram, FiTwitter,FiBookmark, FaWhatsapp} from '../assets/icons/vander'

export default function Footer({top}){
    return(
        <footer className="bg-footer">
            {top === true ? 
            <div className="py-5">
                <div className="container">
                    <div className="row align-items-end">
                        <div className="col-md-7">
                            <div className="section-title">
                                <div className="d-flex align-items-center">
                                    <FiBookmark className="fea icon-lg"/>
                                    <div className="flex-1 ms-3">
                                        <h4 className="fw-bold text-white mb-2">Explore a job now!</h4>
                                        <p className="text-white-50 mb-0">Search all the open positions on the web. Get your own personalized salary estimate. Read reviews on over 30000+ companies worldwide.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-5 mt-4 mt-sm-0">
                            <div className="text-md-end ms-5 ms-sm-0">
                                <Link href="/contactus" className="btn btn-soft-primary my-1">Contact Us</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div> : ''}
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="py-5 footer-bar">
                            <div className="row align-items-center">
                                <div className="col-sm-3">
                                    <div className="text-center text-sm-start">
                                        <Link href=""><Image src='/images/logo.png' height={50} width={150} alt=""/></Link>
                                    </div>
                                </div>
        
                                <div className="col-sm-9 mt-4 mt-sm-0">
                                    <ul className="list-unstyled footer-list terms-service text-center text-sm-end mb-0">
                                       
                                        <li className="list-inline-item my-2"><Link href="/aboutus" className="text-foot fs-6 fw-medium me-2"><i className="mdi mdi-circle-small"></i> About us</Link></li>
                                        <li className="list-inline-item my-2"><Link href="/contactus" className="text-foot fs-6 fw-medium me-2"><i className="mdi mdi-circle-small"></i> Contact</Link></li>
                                        <li className="list-inline-item my-2"><Link href="/privacy" className="text-foot fs-6 fw-medium me-2"><i className="mdi mdi-circle-small"></i> Privacy Policy</Link></li>
                                        <li className="list-inline-item my-2"><Link href="/terms" className="text-foot fs-6 fw-medium"><i className="mdi mdi-circle-small"></i> Terms of Service</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-4 footer-bar">
                <div className="container text-center">
                    <div className="row align-items-center">
                        <div className="col-sm-6">
                            <div className="text-sm-start">
                                <p className="mb-0 fw-medium">© {new Date().getFullYear()}, PharmaConnect. All Rights Reserved.</p>
                            </div>
                        </div>

                        <div className="col-sm-6 mt-4 mt-sm-0 pt-2 pt-sm-0">
                            <ul className="list-unstyled social-icon foot-social-icon text-sm-end mb-0">
                                {/* <li className="list-inline-item"><Link href="https://1.envato.market/jobnova-next" target="_blank" className="rounded"><FiShoppingCart className="fea icon-sm align-middle"/></Link></li>
                                <li className="list-inline-item"><Link href="https://dribbble.com/shreethemes" target="_blank" className="rounded"><FiDribbble className="fea icon-sm align-middle"/></Link></li> */}
                                {/* rounded-2 (not bare .rounded): on /jobs this footer shares a page with the
                                    Tailwind homepage CSS, which redefines .rounded with a different radius. */}
                                <li className="list-inline-item"><Link href="https://www.linkedin.com/company/pharmaconnect-pakistan/" target="_blank" className="rounded-2"><FiLinkedin className="fea icon-sm align-middle"/></Link></li>
                                <li className="list-inline-item"><Link href="https://wa.me/923244296468" target="_blank" className="rounded-2"><FaWhatsapp className="fea icon-sm align-middle"/></Link></li>
                                {/* <li className="list-inline-item"><Link href="https://www.facebook.com/shreethemes" target="_blank" className="rounded"><FiFacebook className="fea icon-sm align-middle"/></Link></li>
                                <li className="list-inline-item"><Link href="https://www.instagram.com/shreethemes/" target="_blank" className="rounded"><FiInstagram className="fea icon-sm align-middle"/></Link></li>
                                <li className="list-inline-item"><Link href="https://twitter.com/shreethemes" target="_blank" className="rounded"><FiTwitter className="fea icon-sm align-middle"/></Link></li> */}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}