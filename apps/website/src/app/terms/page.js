import React from "react";
import LegalPage, { LegalP, LegalList, LegalLink, EmailLink } from "../componants/legalPage";

export const metadata = {
  title: "Terms of Service - PharmaConnect Pakistan",
  description: "Terms of Service for PharmaConnect Pakistan",
};

const SECTIONS = [
  {
    title: "What the Site Is",
    body: (
      <>
        <LegalP>PharmaConnect aggregates and shares information about pharmacy-related job openings, scholarships, and internships sourced from companies, recruiters, third-party job platforms, and public postings. We also publish original career guidance content.</LegalP>
        <LegalP>We are an information-sharing platform, not an employer, recruiter, staffing agency, or party to any employment, internship, or scholarship arrangement. We do not hire, employ, or place anyone, and we are not responsible for the hiring decisions, conduct, or practices of any company, recruiter, or institution whose listing appears on the Site.</LegalP>
      </>
    ),
  },
  {
    title: "Eligibility",
    body: (
      <>
        <LegalP>You must be at least 18 years old to use the Site. By using the Site, you confirm that you meet this requirement.</LegalP>
        <LegalP>This 18+ requirement is the condition of use for the Site. Separately, our <LegalLink href="/privacy">Privacy Policy</LegalLink> describes additional data-protection safeguards that apply under law if a child under 13 (or under 16 in the EEA/UK) is found to have used the Site despite this requirement &mdash; those safeguards exist as a backstop for that scenario and do not lower or replace the 18+ eligibility requirement stated here.</LegalP>
      </>
    ),
  },
  {
    title: "Verified and Unverified Listings",
    body: (
      <>
        <LegalP>To help you assess a listing before you act on it, we mark each one:</LegalP>
        <LegalList
          items={[
            <><strong className="text-navy-surface">Verified</strong> &mdash; the listing names a real company and includes a traceable way to apply (a company email, a link to the company&apos;s own posting, or a listing sourced from a trusted job platform).</>,
            <><strong className="text-navy-surface">Unverified</strong> &mdash; we could not fully confirm the company or contact details behind the listing. These carry a visible note saying so.</>,
          ]}
        />
        <LegalP>A Verified label means we could confirm the source of the listing &mdash; it is not a guarantee that the job, scholarship, or internship itself is legitimate, still open, accurately described, or free of scams run by an otherwise real company. Fraud can occur even through real companies or real contact channels. Always use your own judgment, and treat the Verified/Unverified label as a starting point for your own research, not a substitute for it.</LegalP>
        <LegalP>If something looks wrong, use our reporting feature (see Section 6) &mdash; please don&apos;t rely solely on the badge shown.</LegalP>
      </>
    ),
  },
  {
    title: "No Warranty on Listing Accuracy or Outcomes",
    body: (
      <>
        <LegalP>The Site and all listings, guidance content, and other information are provided &quot;as is&quot; and &quot;as available,&quot; without warranties of any kind, express or implied. We do not guarantee that:</LegalP>
        <LegalList
          items={[
            "Any listing is accurate, current, complete, or still open",
            "Any company, recruiter, or institution named in a listing is legitimate or will respond to your application",
            "Using the Site will result in an interview, job offer, scholarship, internship, or any other outcome",
            "The Site will be uninterrupted, error-free, or available at all times",
          ]}
        />
        <LegalP>You are solely responsible for verifying any listing and for your own decisions to contact, apply to, or share personal information with any third party found through the Site.</LegalP>
      </>
    ),
  },
  {
    title: "Leaving the Site / Third-Party Interactions",
    body: (
      <>
        <LegalP>When you contact an employer, apply for a role, or click a link to an external site &mdash; including WhatsApp numbers, email addresses, or third-party job platforms listed in a posting &mdash; you are leaving PharmaConnect and dealing directly with that third party, under their own terms and privacy practices, which we do not control and are not responsible for.</LegalP>
        <LegalP>We encourage you to independently verify any Unverified listing, and to be cautious about sharing sensitive personal information (such as ID numbers, bank details, or payment of any kind) with any party you reach through a listing on the Site. PharmaConnect never charges a fee to apply for, or to be considered for, any job, scholarship, or internship listed on the Site. If anyone asks you to pay to apply, treat it as a red flag and report it to us.</LegalP>
      </>
    ),
  },
  {
    title: "Reporting a Suspicious Listing",
    body: (
      <>
        <LegalP>If you believe a listing is fraudulent, misleading, or inaccurate, you can report it through our <LegalLink href="/contactus">Contact page</LegalLink> or by emailing <EmailLink />. We review reports and may investigate, correct, or remove a listing as a result. We do not share your identity as the reporter with the company or individual associated with the reported listing.</LegalP>
        <LegalP>Reporting a listing does not guarantee any specific action, timeframe, or outcome, and we are not liable for harm that occurs before a report is made, while a report is under review, or if we are unable to fully verify a report.</LegalP>
      </>
    ),
  },
  {
    title: "Acceptable Use",
    body: (
      <>
        <LegalP>When using the Site, you agree not to:</LegalP>
        <LegalList
          items={[
            "Submit a fake, misleading, or fraudulent job, scholarship, or internship listing, or impersonate a real company or person",
            "Use the Contact form, reporting feature, or newsletter signup to send spam, harassment, or unlawful content",
            <>Scrape, copy, or republish substantial parts of the Site&apos;s content or listing database without our permission</>,
            "Attempt to interfere with, disrupt, or gain unauthorized access to the Site or its underlying systems",
            "Use the Site for any unlawful purpose, or in a way that could harm PharmaConnect, other users, or third parties named in listings",
          ]}
        />
        <LegalP>We may remove content, restrict access, or take other reasonable action in response to a violation of this section.</LegalP>
      </>
    ),
  },
  {
    title: "Intellectual Property",
    body: (
      <>
        <LegalP>The Site&apos;s design, original written content (including career guidance articles), branding, and logo belong to PharmaConnect, except where a listing or other content is attributed to a third-party source. You may share links to our content, but you may not copy, republish, or redistribute substantial portions of the Site without our written permission.</LegalP>
        <LegalP>Job listings themselves generally originate from the companies, recruiters, or platforms that posted them; we do not claim ownership over the underlying job opportunity or company-provided details.</LegalP>
      </>
    ),
  },
  {
    title: "Advertising",
    body: (
      <LegalP>The Site may display advertisements, including through Google AdSense. Ads are served by Google and its partners, subject to their own terms. See our <LegalLink href="/privacy#cookies">Privacy Policy</LegalLink> for details on advertising cookies and your choices. We are not responsible for the content of third-party advertisements or for any transaction you enter into with an advertiser.</LegalP>
    ),
  },
  {
    title: "Limitation of Liability",
    body: (
      <>
        <LegalP>To the fullest extent permitted by applicable law, PharmaConnect and its founder are not liable for any indirect, incidental, or consequential damages arising from your use of the Site, including but not limited to: loss of income or job opportunity, fraud committed by a third party through a listing on the Site, or reliance on any information, listing, or guidance content published here.</LegalP>
        <LegalP>The Site is provided free of charge, and our total liability for any claim relating to your use of the Site, to the extent liability cannot be fully excluded under applicable law, is limited to the greater of a nominal amount or any amount you have actually paid us in the 12 months before the claim arose (which, for most users, will be zero, as the Site is free to use).</LegalP>
        <LegalP>Nothing in these Terms is intended to exclude liability that cannot be excluded under applicable law.</LegalP>
      </>
    ),
  },
  {
    title: "Verification Process and Good-Faith Reliance",
    body: (
      <>
        <LegalP>Most listings on the Site originate from companies, recruiters, or third-party platforms, not from other users. We check each listing using the process described in Section 3 before publishing it and assigning a Verified or Unverified label.</LegalP>
        <LegalP>If we followed this verification process in good faith, we are not liable for harm arising from a listing that later turns out to be fraudulent or inaccurate, including a listing we labeled Verified, provided we did not act with actual knowledge of the fraud or with reckless disregard for obvious signs of it. This reflects that we check listings on a best-efforts basis and are not in a position to guarantee the ongoing legitimacy of any third party&apos;s business or hiring practices.</LegalP>
        <LegalP>If you submit a listing, report, or other content to the Site yourself, you agree to indemnify and hold PharmaConnect harmless from any claim, loss, or damage arising from that submission, to the extent it was false, misleading, infringing, or submitted in violation of these Terms.</LegalP>
        <LegalP>Where a fraudulent listing can be traced to a specific company or recruiter, we may pursue our own recovery or other remedies against that party; this does not create any obligation for us to do so on your behalf, and does not limit your own right to pursue a claim directly against that third party.</LegalP>
      </>
    ),
  },
  {
    title: "Changes to the Site or These Terms",
    body: (
      <LegalP>We may update, suspend, or discontinue any part of the Site at any time. We may also update these Terms from time to time; changes will be posted on this page with an updated &quot;Last updated&quot; date. Continued use of the Site after a change means you accept the updated Terms.</LegalP>
    ),
  },
  {
    title: "Restricting Access",
    body: (
      <LegalP>The Site is browse-only and does not currently require an account. If you violate Section 7 (Acceptable Use), we may block or restrict your access to the Site by reasonable means available to us (for example, blocking an IP address or email), at any time and without prior notice. You may stop using the Site at any time.</LegalP>
    ),
  },
  {
    title: "Governing Law and Disputes",
    body: (
      <>
        <LegalP>These Terms are governed by the laws of Pakistan, without regard to conflict-of-law principles, unless a mandatory law in your own jurisdiction requires otherwise (for example, certain consumer-protection rights that cannot be waived under EU or UK law for users located there).</LegalP>
        <LegalP>If a dispute arises, we ask that you first contact us at <EmailLink /> and give us a reasonable opportunity &mdash; at least 30 days &mdash; to resolve it informally before pursuing any other action. Most concerns can be resolved this way faster than through any formal process.</LegalP>
      </>
    ),
  },
  {
    title: "Contact Us",
    body: (
      <LegalP>Questions about these Terms can be sent to <EmailLink /> or via our <LegalLink href="/contactus">Contact page</LegalLink>.</LegalP>
    ),
  },
];

export default function Terms() {
  return (
    <LegalPage
      eyebrow="Legal · Terms of Use"
      eyebrowIcon="verified_user"
      title="Terms of"
      accent="Service"
      description="The rules for using PharmaConnect Pakistan, including how we label listings, what we can and can't guarantee, and how to report a suspicious posting."
      updated="July 17, 2026"
      intro={
        <>
          <LegalP>These Terms of Service (&quot;Terms&quot;) govern your use of pharmaconnect-pakistan.com (the &quot;Site&quot;), operated by PharmaConnect Pakistan (&quot;PharmaConnect,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), an independently run platform sharing pharmacy job listings, scholarships, internships, and career guidance. PharmaConnect is not currently operated through a registered company entity.</LegalP>
          <LegalP>By accessing or using the Site, you agree to these Terms. If you don&apos;t agree, please don&apos;t use the Site. These Terms should be read together with our <LegalLink href="/privacy">Privacy Policy</LegalLink>, which explains how we handle your information. If these two documents ever conflict, these Terms govern matters relating to use of the Site (such as listing accuracy, acceptable use, and liability), and the Privacy Policy governs matters relating to your personal data.</LegalP>
        </>
      }
      sections={SECTIONS}
      disclaimer="These Terms are provided for informational purposes and do not constitute legal advice. If you have specific legal questions about your rights or obligations, consult a qualified attorney."
    />
  );
}
