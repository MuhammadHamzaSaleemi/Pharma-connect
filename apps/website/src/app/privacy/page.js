import React from "react";
import LegalPage, { LegalP, LegalSub, LegalList, LegalLink, EmailLink } from "../componants/legalPage";

export const metadata = {
  title: "Privacy Policy - PharmaConnect Pakistan",
  description: "Privacy Policy for PharmaConnect Pakistan",
};

const SECTIONS = [
  {
    title: "Information We Collect",
    body: (
      <>
        <LegalSub>Information you provide directly</LegalSub>
        <LegalList
          items={[
            <>Contact submissions — when you click the Contact Us button, your device&apos;s own email or WhatsApp app opens with our address pre-filled. Any name, email, message, or subject details you send are transmitted directly from your device to our inbox (info@pharmaconnect-pakistan.com) or WhatsApp Business number. We do not use a third-party form-processing service to collect or relay this information — it goes straight from you to us.</>,
            "Newsletter subscription details (email address), if you choose to subscribe",
            "Any information you submit when reporting a job listing as suspicious or unverified",
          ]}
        />
        <LegalSub>Information collected automatically</LegalSub>
        <LegalList
          items={[
            "Standard technical data: IP address, browser type, device type, operating system, referring page, and pages visited",
            "Cookies and similar tracking technologies (see Section 2)",
            "Approximate location inferred from IP address (country/city level — we do not collect precise GPS location)",
          ]}
        />
        <LegalP>We do not knowingly collect sensitive personal information such as national ID numbers, financial account details, or health records through the Site. Please don&apos;t include this kind of information in Contact form messages or listing reports.</LegalP>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies and Similar Technologies",
    body: (
      <>
        <LegalP>A cookie is a small text file stored on your device that helps a website remember information about your visit. We use three categories:</LegalP>
        <LegalList
          items={[
            <><strong className="text-navy-surface">Essential</strong> — required for the Site to function (e.g. remembering your search filters). These don&apos;t require consent and can&apos;t be switched off through our Site (though you can block them in your browser, which may break some features).</>,
            <><strong className="text-navy-surface">Analytics</strong> — help us understand how visitors use the Site so we can improve it.</>,
            <><strong className="text-navy-surface">Advertising</strong> — used to serve and measure ads, including through Google AdSense.</>,
          ]}
        />
        <LegalSub>Consent</LegalSub>
        <LegalP>Analytics and advertising cookies may be set when you visit the Site, and you can opt out at any time using the controls described below (your browser settings, or the Google Ads Settings link). We do not currently operate a cookie consent banner. For visitors from the EEA, UK, and Switzerland, if you&apos;d prefer not to receive personalized ads, you can opt out via Google Ads Settings or your browser settings — we recommend doing so, as our current setup relies on this opt-out rather than an upfront consent prompt or automatic non-personalized serving for these regions.</LegalP>
        <LegalSub>Google AdSense and Advertising Cookies</LegalSub>
        <LegalP>This Site may display advertisements served by Google AdSense. Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to this website or other websites. Google&apos;s use of advertising cookies enables it and its partners to serve ads to you based on your visit to this Site and other sites on the internet.</LegalP>
        <LegalP>You may opt out of personalized advertising by visiting Google Ads Settings. You can also learn more about how Google uses data at Google&apos;s &quot;How Google uses data&quot; page.</LegalP>
        <LegalP>You can control or disable cookies generally through your browser settings. Disabling cookies may affect how parts of the Site function.</LegalP>
      </>
    ),
  },
  {
    title: "How We Use Information",
    body: (
      <>
        <LegalP>We use the information we collect to:</LegalP>
        <LegalList
          items={[
            "Respond to messages sent through the Contact form",
            "Investigate and act on reports of suspicious or unverified job listings",
            <>Send newsletter updates, if you&apos;ve subscribed (you can unsubscribe at any time)</>,
            "Understand Site usage and improve content, navigation, and performance",
            "Serve and measure the performance of advertising, including through Google AdSense",
            "Maintain the security and proper functioning of the Site",
          ]}
        />
        <LegalP>We do not sell your personal information to third parties in the ordinary sense of a data sale. Depending on how AdSense is configured, sharing data with Google for ad personalization may be treated as &quot;sharing&quot; under some laws (see Section 6) — see that section for your opt-out options.</LegalP>
      </>
    ),
  },
  {
    title: "Third-Party Links and Job Listings",
    body: (
      <>
        <LegalP>The Site shares information about job openings, scholarships, and internships sourced from companies, recruiters, and public postings. Some listings are marked Verified (confirmed via an official company source or trusted platform) and others Unverified (source could not be fully confirmed).</LegalP>
        <LegalP><strong className="text-navy-surface">Important:</strong> When you contact an employer, apply for a role, or click a link to an external site (including WhatsApp numbers, email addresses, or third-party job platforms listed in a posting), you are leaving PharmaConnect and interacting directly with that third party. We are not responsible for the privacy practices, accuracy, or legitimacy of external parties, and we encourage you to independently verify any Unverified listing before sharing personal information or applying.</LegalP>
        <LegalP><strong className="text-navy-surface">Reporting a listing:</strong> If you report a listing as suspicious or unverified, the information you submit is used internally to investigate the report. We do not share your identity as the reporter with the company or individual who posted the listing.</LegalP>
      </>
    ),
  },
  {
    title: "Third-Party Service Providers",
    body: (
      <>
        <LegalP>We may use third-party services to operate the Site, including but not limited to:</LegalP>
        <LegalList
          items={[
            "Google AdSense — for displaying advertisements (see Section 2)",
            "Analytics providers (e.g. Google Analytics) — to understand Site traffic and usage patterns",
            "Email/newsletter platforms — to manage newsletter subscriptions",
          ]}
        />
        <LegalP>These providers may process information outside Pakistan, including in the United States, under their own privacy policies and safeguards, in addition to this one.</LegalP>
      </>
    ),
  },
  {
    title: "Your Rights and Choices",
    body: (
      <>
        <LegalP>Regardless of where you&apos;re located, you may:</LegalP>
        <LegalList
          items={[
            "Request access to the personal information we hold about you",
            "Request correction of inaccurate information",
            "Request deletion of your personal information",
            "Unsubscribe from our newsletter at any time via the link in any newsletter email",
            "Opt out of personalized advertising via Google Ads Settings",
          ]}
        />
        <LegalP>To exercise any of these rights, email <EmailLink />. We will ask for enough information to verify it&apos;s really you making the request, and we aim to respond within 30 days.</LegalP>
        <LegalSub>EEA and UK residents (GDPR)</LegalSub>
        <LegalP>If you are located in the European Economic Area (EEA) or UK, you additionally have rights under the GDPR, including to:</LegalP>
        <LegalList
          items={[
            "Object to processing based on legitimate interests",
            "Restrict processing in certain circumstances",
            "Receive a copy of your data in a portable format",
            "Withdraw consent at any time, without affecting processing already carried out",
            "Lodge a complaint with your local data protection authority",
          ]}
        />
        <LegalP>Our lawful basis for non-essential cookies is our legitimate interest in operating and funding the Site, subject to your right to object and opt out at any time. For the newsletter, our basis is your consent when you subscribe; for contact form messages, our basis is our legitimate interest in responding to you. Where your data is transferred to service providers outside the EEA (e.g. Google, based in the US), we rely on the safeguards those providers offer, such as Standard Contractual Clauses.</LegalP>
        <LegalSub>California residents (CCPA/CPRA)</LegalSub>
        <LegalP>If you are a California resident, you additionally have rights under the CCPA/CPRA, including the right to know what personal information is collected, the right to request deletion, and the right to opt out of the &quot;sharing&quot; of personal information for cross-context behavioral advertising. If AdSense on this Site is configured for personalized ads, that may constitute &quot;sharing&quot; under CPRA; you can opt out via Google Ads Settings or by emailing us at the address above.</LegalP>
      </>
    ),
  },
  {
    title: "Children's Privacy",
    body: (
      <LegalP>The Site is not directed at children, and we do not knowingly collect personal information from anyone under 13 (or under 16, for users in the EEA/UK, where a higher age of consent applies for information-society services). If you believe a child has provided us with personal information, please contact us at <EmailLink /> and we will take steps to delete it.</LegalP>
    ),
  },
  {
    title: "Data Retention and Security",
    body: (
      <>
        <LegalP>We retain personal information only as long as necessary for the purposes described in this policy, generally as follows:</LegalP>
        <LegalList
          items={[
            "Contact form submissions and listing reports: up to 12 months from submission, unless an investigation is ongoing",
            "Newsletter subscriber emails: for as long as you remain subscribed, plus a short period after unsubscribing to process the request",
            "Technical/analytics data: as retained by our analytics provider under its own retention settings",
          ]}
        />
        <LegalP>We use reasonable technical and organizational measures to protect your information (such as HTTPS encryption and access controls limiting who can view submitted data), but no method of transmission or storage is 100% secure, and we cannot guarantee absolute security. If we become aware of a data breach affecting your personal information, we will notify affected users without undue delay, as required by applicable law.</LegalP>
      </>
    ),
  },
  {
    title: "Contact Us",
    body: (
      <LegalP>If you have questions about this Privacy Policy or wish to exercise any of your rights, email us at <EmailLink /> or reach out via our <LegalLink href="/contactus">Contact page</LegalLink>.</LegalP>
    ),
  },
  {
    title: "Changes to This Policy",
    body: (
      <LegalP>We may update this Privacy Policy from time to time, including as our user base grows into new jurisdictions and our practices adapt accordingly. Changes will be posted on this page with an updated &quot;Last updated&quot; date. We encourage you to review this page periodically.</LegalP>
    ),
  },
];

export default function Privacy() {
  return (
    <LegalPage
      eyebrow="Legal · Your Data & Privacy"
      eyebrowIcon="policy"
      title="Privacy"
      accent="Policy"
      description="How PharmaConnect Pakistan collects, uses, and protects your information when you browse jobs, read our guides, or get in touch."
      updated="July 17, 2026"
      intro={
        <>
          <LegalP>PharmaConnect Pakistan (&quot;PharmaConnect,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates pharmaconnect-pakistan.com (the &quot;Site&quot;), a platform sharing pharmacy job listings, scholarships, internships, and career guidance.</LegalP>
          <LegalP><strong className="text-navy-surface">Who we are:</strong> PharmaConnect Pakistan is an independently run platform and is not currently operated through a registered company entity. You can reach us at <EmailLink /> for any question about this policy or your information.</LegalP>
          <LegalP><strong className="text-navy-surface">Where this applies:</strong> Our primary audience today is users in Pakistan, and this policy is written with that audience in mind. As our user base grows internationally, we intend to update this policy and our practices (including cookie consent and data-subject rights processes) to meet the requirements of other jurisdictions — see Section 6 for how we currently handle visitors from the EEA/UK and California.</LegalP>
          <LegalP>By using the Site, you agree to the practices described in this policy. If you don&apos;t agree, please don&apos;t use the Site. This policy should be read together with our <LegalLink href="/terms">Terms of Service</LegalLink>, which cover listing accuracy, acceptable use, and liability. If these two documents ever conflict, this Privacy Policy governs matters relating to your personal data, and the Terms of Service govern matters relating to use of the Site.</LegalP>
        </>
      }
      sections={SECTIONS}
      disclaimer="This Privacy Policy is provided for informational purposes and does not constitute legal advice. If you have specific legal concerns about compliance in your jurisdiction — particularly before serving ads or accepting users from the EEA, UK, or California at scale — consult a qualified attorney."
    />
  );
}
