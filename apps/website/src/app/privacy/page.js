import React from "react";
import Link from "next/link";

import Navbar from "../componants/navbar";
import Footer from "../componants/footer";
import ScrollTop from "../componants/scrollTop";

import { FiArrowRight } from "../assets/icons/vander";

export const metadata = {
    title: "Privacy Policy - PharmaConnect Pakistan",
    description: "Privacy Policy for PharmaConnect Pakistan",
};

export default function Privacy(){
    return(
        <>
        <Navbar navClass="defaultscroll sticky" navLight={true}/>
        <section className="bg-half-170 d-table w-100" style={{backgroundImage:"url('/images/hero/bg.jpg')", backgroundPosition:'top'}}>
            <div className="bg-overlay bg-gradient-overlay"></div>
            <div className="container">
                <div className="row mt-5 justify-content-center">
                    <div className="col-12">
                        <div className="title-heading text-center">
                            <h5 className="heading fw-semibold mb-0 sub-heading text-white title-dark">Privacy Policy</h5>
                        </div>
                    </div>
                </div>

                <div className="position-middle-bottom">
                    <nav aria-label="breadcrumb" className="d-block">
                        <ul className="breadcrumb breadcrumb-muted mb-0 p-0">
                            <li className="breadcrumb-item"><Link href="/">PharmaConnect</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">PRIVACY</li>
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
                <div className="row justify-content-center">
                    <div className="col-lg-9">
                        <div className="card shadow rounded border-0">
                            <div className="card-body">
                                <p className="text-muted"><strong>Last updated:</strong> July 17, 2026</p>

                                <p className="text-muted">PharmaConnect Pakistan (&quot;PharmaConnect,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates pharmaconnect-pakistan.com (the &quot;Site&quot;), a platform sharing pharmacy job listings, scholarships, internships, and career guidance.</p>
                                <p className="text-muted"><strong>Who we are:</strong> PharmaConnect Pakistan is an independently run platform and is not currently operated through a registered company entity. You can reach us at <Link href="mailto:info@pharmaconnect-pakistan.com" className="text-primary">info@pharmaconnect-pakistan.com</Link> for any question about this policy or your information.</p>
                                <p className="text-muted"><strong>Where this applies:</strong> Our primary audience today is users in Pakistan, and this policy is written with that audience in mind. As our user base grows internationally, we intend to update this policy and our practices (including cookie consent and data-subject rights processes) to meet the requirements of other jurisdictions — see Section 6 for how we currently handle visitors from the EEA/UK and California.</p>
                                <p className="text-muted">By using the Site, you agree to the practices described in this policy. If you don&apos;t agree, please don&apos;t use the Site. This policy should be read together with our Terms of Service, which cover listing accuracy, acceptable use, and liability. If these two documents ever conflict, this Privacy Policy governs matters relating to your personal data, and the Terms of Service govern matters relating to use of the Site.</p>

                                <h5 className="card-title mt-4">1. Information We Collect</h5>
                                <p className="text-muted mb-1"><strong>Information you provide directly:</strong></p>
                                <ul className="list-unstyled text-muted">
                                    <li className="mt-2"><FiArrowRight className="fea icon-sm me-2"/>Contact form submissions (name, email, message, and subject category — e.g. job inquiry, report a listing, partnership, feedback), sent via EmailJS to our own email account (see Section 5)</li>
                                    <li className="mt-2"><FiArrowRight className="fea icon-sm me-2"/>Newsletter subscription details (email address), if you choose to subscribe</li>
                                    <li className="mt-2"><FiArrowRight className="fea icon-sm me-2"/>Any information you submit when reporting a job listing as suspicious or unverified</li>
                                </ul>
                                <p className="text-muted mb-1 mt-3"><strong>Information collected automatically:</strong></p>
                                <ul className="list-unstyled text-muted">
                                    <li className="mt-2"><FiArrowRight className="fea icon-sm me-2"/>Standard technical data: IP address, browser type, device type, operating system, referring page, and pages visited</li>
                                    <li className="mt-2"><FiArrowRight className="fea icon-sm me-2"/>Cookies and similar tracking technologies (see Section 2)</li>
                                    <li className="mt-2"><FiArrowRight className="fea icon-sm me-2"/>Approximate location inferred from IP address (country/city level — we do not collect precise GPS location)</li>
                                </ul>
                                <p className="text-muted mt-3">We do not knowingly collect sensitive personal information such as national ID numbers, financial account details, or health records through the Site. Please don&apos;t include this kind of information in Contact form messages or listing reports.</p>

                                <h5 className="card-title mt-4">2. Cookies and Similar Technologies</h5>
                                <p className="text-muted">A cookie is a small text file stored on your device that helps a website remember information about your visit. We use three categories:</p>
                                <ul className="list-unstyled text-muted">
                                    <li className="mt-2"><FiArrowRight className="fea icon-sm me-2"/><strong>Essential</strong> — required for the Site to function (e.g. remembering your search filters). These don&apos;t require consent and can&apos;t be switched off through our Site (though you can block them in your browser, which may break some features).</li>
                                    <li className="mt-2"><FiArrowRight className="fea icon-sm me-2"/><strong>Analytics</strong> — help us understand how visitors use the Site so we can improve it.</li>
                                    <li className="mt-2"><FiArrowRight className="fea icon-sm me-2"/><strong>Advertising</strong> — used to serve and measure ads, including through Google AdSense.</li>
                                </ul>

                                <p className="text-muted mb-1 mt-3"><strong>Consent</strong></p>
                                <p className="text-muted">Analytics and advertising cookies may be set when you visit the Site, and you can opt out at any time using the controls described below (your browser settings, or the Google Ads Settings link). We do not currently operate a cookie consent banner. For visitors from the EEA, UK, and Switzerland, if you&apos;d prefer not to receive personalized ads, you can opt out via Google Ads Settings or your browser settings — we recommend doing so, as our current setup relies on this opt-out rather than an upfront consent prompt or automatic non-personalized serving for these regions.</p>

                                <p className="text-muted mb-1 mt-3"><strong>Google AdSense and Advertising Cookies</strong></p>
                                <p className="text-muted">This Site may display advertisements served by Google AdSense. Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to this website or other websites. Google&apos;s use of advertising cookies enables it and its partners to serve ads to you based on your visit to this Site and other sites on the internet.</p>
                                <p className="text-muted">You may opt out of personalized advertising by visiting Google Ads Settings. You can also learn more about how Google uses data at Google&apos;s &quot;How Google uses data&quot; page.</p>
                                <p className="text-muted">You can control or disable cookies generally through your browser settings. Disabling cookies may affect how parts of the Site function.</p>

                                <h5 className="card-title mt-4">3. How We Use Information</h5>
                                <p className="text-muted">We use the information we collect to:</p>
                                <ul className="list-unstyled text-muted">
                                    <li className="mt-2"><FiArrowRight className="fea icon-sm me-2"/>Respond to messages sent through the Contact form</li>
                                    <li className="mt-2"><FiArrowRight className="fea icon-sm me-2"/>Investigate and act on reports of suspicious or unverified job listings</li>
                                    <li className="mt-2"><FiArrowRight className="fea icon-sm me-2"/>Send newsletter updates, if you&apos;ve subscribed (you can unsubscribe at any time)</li>
                                    <li className="mt-2"><FiArrowRight className="fea icon-sm me-2"/>Understand Site usage and improve content, navigation, and performance</li>
                                    <li className="mt-2"><FiArrowRight className="fea icon-sm me-2"/>Serve and measure the performance of advertising, including through Google AdSense</li>
                                    <li className="mt-2"><FiArrowRight className="fea icon-sm me-2"/>Maintain the security and proper functioning of the Site</li>
                                </ul>
                                <p className="text-muted mt-3">We do not sell your personal information to third parties in the ordinary sense of a data sale. Depending on how AdSense is configured, sharing data with Google for ad personalization may be treated as &quot;sharing&quot; under some laws (see Section 6) — see that section for your opt-out options.</p>

                                <h5 className="card-title mt-4">4. Third-Party Links and Job Listings</h5>
                                <p className="text-muted">The Site shares information about job openings, scholarships, and internships sourced from companies, recruiters, and public postings. Some listings are marked Verified (confirmed via an official company source or trusted platform) and others Unverified (source could not be fully confirmed).</p>
                                <p className="text-muted"><strong>Important:</strong> When you contact an employer, apply for a role, or click a link to an external site (including WhatsApp numbers, email addresses, or third-party job platforms listed in a posting), you are leaving PharmaConnect and interacting directly with that third party. We are not responsible for the privacy practices, accuracy, or legitimacy of external parties, and we encourage you to independently verify any Unverified listing before sharing personal information or applying.</p>
                                <p className="text-muted"><strong>Reporting a listing:</strong> If you report a listing as suspicious or unverified, the information you submit is used internally to investigate the report. We do not share your identity as the reporter with the company or individual who posted the listing.</p>

                                <h5 className="card-title mt-4">5. Third-Party Service Providers</h5>
                                <p className="text-muted">We may use third-party services to operate the Site, including but not limited to:</p>
                                <ul className="list-unstyled text-muted">
                                    <li className="mt-2"><FiArrowRight className="fea icon-sm me-2"/>Google AdSense — for displaying advertisements (see Section 2)</li>
                                    <li className="mt-2"><FiArrowRight className="fea icon-sm me-2"/>Analytics providers (e.g. Google Analytics) — to understand Site traffic and usage patterns</li>
                                    <li className="mt-2"><FiArrowRight className="fea icon-sm me-2"/>Email/newsletter platforms — to manage newsletter subscriptions</li>
                                    <li className="mt-2"><FiArrowRight className="fea icon-sm me-2"/>EmailJS — to deliver messages submitted through our Contact form (including job inquiries, partnership requests, feedback, and listing reports) directly to our own email account</li>
                                </ul>
                                <p className="text-muted mt-3">These providers may process information outside Pakistan, including in the United States, under their own privacy policies and safeguards, in addition to this one.</p>

                                <h5 className="card-title mt-4">6. Your Rights and Choices</h5>
                                <p className="text-muted">Regardless of where you&apos;re located, you may:</p>
                                <ul className="list-unstyled text-muted">
                                    <li className="mt-2"><FiArrowRight className="fea icon-sm me-2"/>Request access to the personal information we hold about you</li>
                                    <li className="mt-2"><FiArrowRight className="fea icon-sm me-2"/>Request correction of inaccurate information</li>
                                    <li className="mt-2"><FiArrowRight className="fea icon-sm me-2"/>Request deletion of your personal information</li>
                                    <li className="mt-2"><FiArrowRight className="fea icon-sm me-2"/>Unsubscribe from our newsletter at any time via the link in any newsletter email</li>
                                    <li className="mt-2"><FiArrowRight className="fea icon-sm me-2"/>Opt out of personalized advertising via Google Ads Settings</li>
                                </ul>
                                <p className="text-muted mt-3">To exercise any of these rights, email <Link href="mailto:info@pharmaconnect-pakistan.com" className="text-primary">info@pharmaconnect-pakistan.com</Link>. We will ask for enough information to verify it&apos;s really you making the request, and we aim to respond within 30 days.</p>

                                <p className="text-muted">If you are located in the European Economic Area (EEA) or UK, you additionally have rights under the GDPR, including to:</p>
                                <ul className="list-unstyled text-muted">
                                    <li className="mt-2"><FiArrowRight className="fea icon-sm me-2"/>Object to processing based on legitimate interests</li>
                                    <li className="mt-2"><FiArrowRight className="fea icon-sm me-2"/>Restrict processing in certain circumstances</li>
                                    <li className="mt-2"><FiArrowRight className="fea icon-sm me-2"/>Receive a copy of your data in a portable format</li>
                                    <li className="mt-2"><FiArrowRight className="fea icon-sm me-2"/>Withdraw consent at any time, without affecting processing already carried out</li>
                                    <li className="mt-2"><FiArrowRight className="fea icon-sm me-2"/>Lodge a complaint with your local data protection authority</li>
                                </ul>
                                <p className="text-muted mt-3">Our lawful basis for non-essential cookies is our legitimate interest in operating and funding the Site, subject to your right to object and opt out at any time. For the newsletter, our basis is your consent when you subscribe; for contact form messages, our basis is our legitimate interest in responding to you. Where your data is transferred to service providers outside the EEA (e.g. Google, based in the US), we rely on the safeguards those providers offer, such as Standard Contractual Clauses.</p>
                                <p className="text-muted">If you are a California resident, you additionally have rights under the CCPA/CPRA, including the right to know what personal information is collected, the right to request deletion, and the right to opt out of the &quot;sharing&quot; of personal information for cross-context behavioral advertising. If AdSense on this Site is configured for personalized ads, that may constitute &quot;sharing&quot; under CPRA; you can opt out via Google Ads Settings or by emailing us at the address above.</p>

                                <h5 className="card-title mt-4">7. Children&apos;s Privacy</h5>
                                <p className="text-muted">The Site is not directed at children, and we do not knowingly collect personal information from anyone under 13 (or under 16, for users in the EEA/UK, where a higher age of consent applies for information-society services). If you believe a child has provided us with personal information, please contact us at <Link href="mailto:info@pharmaconnect-pakistan.com" className="text-primary">info@pharmaconnect-pakistan.com</Link> and we will take steps to delete it.</p>

                                <h5 className="card-title mt-4">8. Data Retention and Security</h5>
                                <p className="text-muted">We retain personal information only as long as necessary for the purposes described in this policy, generally as follows:</p>
                                <ul className="list-unstyled text-muted">
                                    <li className="mt-2"><FiArrowRight className="fea icon-sm me-2"/>Contact form submissions and listing reports: up to 12 months from submission, unless an investigation is ongoing</li>
                                    <li className="mt-2"><FiArrowRight className="fea icon-sm me-2"/>Newsletter subscriber emails: for as long as you remain subscribed, plus a short period after unsubscribing to process the request</li>
                                    <li className="mt-2"><FiArrowRight className="fea icon-sm me-2"/>Technical/analytics data: as retained by our analytics provider under its own retention settings</li>
                                </ul>
                                <p className="text-muted mt-3">We use reasonable technical and organizational measures to protect your information (such as HTTPS encryption and access controls limiting who can view submitted data), but no method of transmission or storage is 100% secure, and we cannot guarantee absolute security. If we become aware of a data breach affecting your personal information, we will notify affected users without undue delay, as required by applicable law.</p>

                                <h5 className="card-title mt-4">9. Contact Us</h5>
                                <p className="text-muted">If you have questions about this Privacy Policy or wish to exercise any of your rights, email us at <Link href="mailto:info@pharmaconnect-pakistan.com" className="text-primary">info@pharmaconnect-pakistan.com</Link> or reach out via our <Link href="/contactus" className="text-primary">Contact page</Link>.</p>

                                <h5 className="card-title mt-4">10. Changes to This Policy</h5>
                                <p className="text-muted">We may update this Privacy Policy from time to time, including as our user base grows into new jurisdictions and our practices adapt accordingly. Changes will be posted on this page with an updated &quot;Last updated&quot; date. We encourage you to review this page periodically.</p>

                                <p className="text-muted fst-italic mt-4 mb-0">This Privacy Policy is provided for informational purposes and does not constitute legal advice. If you have specific legal concerns about compliance in your jurisdiction — particularly before serving ads or accepting users from the EEA, UK, or California at scale — consult a qualified attorney.</p>
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
