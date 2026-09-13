"use client";
import React, { useState } from "react";
import Link from "next/link";
import Icon from "./msIcon";
import Badge from "./badge";
import Button from "./button";
import Card from "./card";
import Container from "./container";
import SectionHeading from "./sectionHeading";
import Faq from "./faq";

const CATEGORY_OPTIONS = [
  {
    value: "licensing",
    label: "Overseas Licensing Consultation (PSI, DHA, MOH, GPhC)",
  },
  {
    value: "post-job",
    label: "Post a New Institutional Vacancy (Hospitals/Pharma)",
  },
  { value: "verification", label: "Job Verification & Credential Validation" },
  {
    value: "scholarship",
    label: "Submit Scholarship / Research Fellowship Announcement",
  },
  { value: "inaccuracy", label: "Report Expired or Non-Compliant Job Listing" },
  { value: "general", label: "Institutional Partnership & Editorial" },
];

const PERSONAS = [
  {
    key: "candidate",
    label: "Candidate / Pharm-D",
    icon: "school",
    category: "licensing",
    banner:
      "Candidate Career Desk: need credential verification, scholarship advice, or guidance on overseas registration? Submit your query below.",
  },
  {
    key: "employer",
    label: "Hospital / Employer",
    icon: "work",
    category: "post-job",
    banner:
      "Institutional HR Desk: post a verified hospital, clinical, or pharmaceutical vacancy. Every listing is reviewed before it reaches candidates.",
  },
  {
    key: "academic",
    label: "Academic / Grants",
    icon: "science",
    category: "scholarship",
    banner:
      "Academic & Grants Desk: share fellowships, postdoctoral calls, conferences, or student research opportunities with our network.",
  },
  {
    key: "regulatory",
    label: "Regulatory / Media",
    icon: "policy",
    category: "verification",
    banner:
      "Regulatory & Media Desk: official queries about compliance, verification requests, or press and partnership inquiries.",
  },
];

const FAQS = [
  {
    q: "How do healthcare institutions and employers post a vacancy?",
    a: "Hospitals, community pharmacy chains, and pharmaceutical manufacturers can submit opportunities through the form above. Our team reviews each submission before it's published to the candidate network.",
  },
  {
    q: "Is there any fee charged to Pharm-D candidates or job seekers?",
    a: "No. PharmaConnect is free for applicants — neither our platform nor any listed employer should ever ask candidates for a recruitment or processing fee.",
  },
  {
    q: "How can I get guidance on overseas licensing (Ireland PSI, UK GPhC, UAE DHA)?",
    a: 'Select "Overseas Licensing Consultation" in the form above, or browse our Blogs section for detailed, step-by-step licensing guides.',
  },
  {
    q: "How quickly will I hear back?",
    a: "WhatsApp is the fastest way to reach us directly. For form submissions, our team reviews inquiries during regular business days.",
  },
];

function buildMailto(form) {
  const subject = `[${form.category.label}] Inquiry from ${form.name || "PharmaConnect visitor"}`;
  const bodyLines = [
    `Name: ${form.name}`,
    `Email: ${form.email}`,
    `WhatsApp/Contact: ${form.phone}`,
    form.affiliation ? `Professional Affiliation: ${form.affiliation}` : null,
    `Category: ${form.category.label}`,
    "",
    form.message,
  ].filter(Boolean);
  return `mailto:info@pharmaconnect-pakistan.com?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
}

export default function ContactExplorer() {
  const [persona, setPersona] = useState(PERSONAS[0]);
  const [category, setCategory] = useState(PERSONAS[0].category);
  const [sent, setSent] = useState(false);

  function handlePersona(p) {
    setPersona(p);
    setCategory(p.category);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const categoryOption =
      CATEGORY_OPTIONS.find((c) => c.value === form.category.value) ??
      CATEGORY_OPTIONS[0];
    const mailto = buildMailto({
      name: form.name.value,
      email: form.email.value,
      phone: form.phone.value,
      affiliation: form.affiliation.value,
      message: form.message.value,
      category: categoryOption,
    });
    window.location.href = mailto;
    setSent(true);
  }

  return (
    <div className="flex flex-col w-full">
      {/* Hero header */}
      <section className="w-full bg-surface-crisp py-space-xl">
        <Container>
          <div className="flex flex-col gap-space-xs max-w-3xl">
            <Badge tone="primary" pulse className="w-fit">
              Institutional Inquiries &amp; Candidate Support • Pakistan &amp;
              Global
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy-surface tracking-tight mt-1">
              Get in Touch with the{" "}
              <span className="text-primary">PharmaConnect</span> Team
            </h1>
            <p className="text-lg text-on-surface-variant leading-relaxed">
              Whether you represent a hospital HR department, an academic
              institution with scholarships, a pharmaceutical manufacturer, or
              you&apos;re a Pharm-D professional seeking career guidance,
              we&apos;re here to help.
            </p>
            <div className="flex flex-wrap items-center gap-space-md pt-space-xs">
              <span className="flex items-center gap-1.5 text-verified-green text-sm font-semibold">
                <Icon name="verified_user" className="text-[18px]" />
                Free for Candidates
              </span>
              <span className="flex items-center gap-1.5 text-primary text-sm font-semibold">
                <Icon name="chat" className="text-[18px]" />
                WhatsApp for Fastest Response
              </span>
              <span className="flex items-center gap-1.5 text-secondary text-sm font-semibold">
                <Icon name="local_pharmacy" className="text-[18px]" />
                Pharmacy Council Compliant
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* Form + channels */}
      <section className="w-full py-space-xl">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
            {/* Form column */}
            <div className="lg:col-span-7 flex flex-col gap-space-lg">
              <Card
                padding="lg"
                hoverLift={false}
                className="flex flex-col gap-space-lg"
              >
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-space-xs">
                    Select Your Category
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-xs p-2 bg-surface-container-low rounded-lg">
                    {PERSONAS.map((p) => (
                      <Button
                        key={p.key}
                        size="sm"
                         variant={persona.key === p.key ? "primary" : "secondary"}
                        type="button"
                        onClick={() => handlePersona(p)}
                        className={`shrink-0 px-space-md py-1.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                          persona.key === p.key
                            ? "bg-primary text-on-primary shadow-sm"
                            : "bg-surface-container-low text-on-surface-variant hover:text-navy-surface"
                        }`}
                      >
                        {p.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex items-start gap-space-sm p-space-sm rounded-lg bg-surface-container-low">
                  <Icon
                    name={persona.icon}
                    className="text-primary text-[20px] shrink-0 mt-0.5"
                  />
                  <p className="text-sm text-on-surface-variant">
                    {persona.banner}
                  </p>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-space-md"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                    <div className="flex flex-col gap-space-2xs">
                      <label
                        htmlFor="name"
                        className="text-sm font-semibold text-navy-surface"
                      >
                        Full Name <span className="text-error">*</span>
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        placeholder="e.g. Dr. Ayesha Malik, Pharm-D"
                        className="w-full bg-surface-container-low text-navy-surface rounded-lg border-none px-space-md py-space-xs text-sm placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                    </div>
                    <div className="flex flex-col gap-space-2xs">
                      <label
                        htmlFor="email"
                        className="text-sm font-semibold text-navy-surface"
                      >
                        Official Email <span className="text-error">*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="you@domain.com"
                        className="w-full bg-surface-container-low text-navy-surface rounded-lg border-none px-space-md py-space-xs text-sm placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                    <div className="flex flex-col gap-space-2xs">
                      <label
                        htmlFor="phone"
                        className="text-sm font-semibold text-navy-surface"
                      >
                        WhatsApp / Contact <span className="text-error">*</span>
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        placeholder="+92 324 4296468"
                        className="w-full bg-surface-container-low text-navy-surface rounded-lg border-none px-space-md py-space-xs text-sm placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                    </div>
                    <div className="flex flex-col gap-space-2xs">
                      <label
                        htmlFor="category"
                        className="text-sm font-semibold text-navy-surface"
                      >
                        Inquiry Category <span className="text-error">*</span>
                      </label>
                      <select
                        id="category"
                        name="category"
                        required
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-surface-container-low text-navy-surface rounded-lg border-none px-space-md py-space-sm text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40"
                      >
                        {CATEGORY_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-space-2xs">
                    <label
                      htmlFor="affiliation"
                      className="text-sm font-semibold text-navy-surface flex items-center justify-between"
                    >
                      <span>
                        Professional Affiliation / Category Registration
                      </span>
                      <span className="text-on-surface-variant font-normal text-xs">
                        Optional
                      </span>
                    </label>
                    <input
                      id="affiliation"
                      name="affiliation"
                      type="text"
                      placeholder="e.g. Registered Pharmacist, Category A"
                      className="w-full bg-surface-container-low text-navy-surface rounded-lg border-none px-space-md py-space-xs text-sm placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>

                  <div className="flex flex-col gap-space-2xs">
                    <label
                      htmlFor="message"
                      className="text-sm font-semibold text-navy-surface"
                    >
                      Detailed Inquiry or Position Specification{" "}
                      <span className="text-error">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      placeholder="Please share your hospital/enterprise details, role specifications, or candidate inquiry..."
                      className="w-full bg-surface-container-low text-navy-surface rounded-lg border-none px-space-md py-space-xs text-sm placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/40 resize-y"
                    />
                  </div>

                  <label className="flex items-start gap-space-sm p-space-sm bg-surface-container-low rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      className="mt-1 w-4 h-4 rounded accent-primary shrink-0"
                    />
                    <span className="text-sm text-on-surface-variant leading-snug">
                      I confirm this request complies with{" "}
                      <strong className="text-navy-surface">
                        Drug Regulatory Authority of Pakistan (DRAP)
                      </strong>{" "}
                      and Pharmacy Council standards, and involves no
                      application fees for candidates.
                    </span>
                  </label>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-space-md pt-space-xs">
                    <span className="flex items-center gap-1.5 text-on-surface-variant text-xs">
                      <Icon
                        name="verified"
                        className="text-verified-green text-[16px]"
                      />
                      Sent directly to our team
                    </span>
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      icon="arrow_forward"
                      iconPosition="right"
                      fullWidth
                      className="sm:w-auto"
                    >
                      Send Message
                    </Button>
                  </div>

                  {sent && (
                    <div className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container text-navy-surface mt-space-xs">
                      <span className="flex items-center gap-space-xs text-sm">
                        <Icon
                          name="check_circle"
                          className="text-verified-green"
                        />
                        Opening your email client to send this inquiry — if it
                        doesn&apos;t open, email us directly at{" "}
                        <a
                          href="mailto:info@pharmaconnect-pakistan.com"
                          className="text-primary font-semibold"
                        >
                          info@pharmaconnect-pakistan.com
                        </a>
                        .
                      </span>
                      <button
                        type="button"
                        onClick={() => setSent(false)}
                        className="text-on-surface-variant hover:text-navy-surface"
                        aria-label="Dismiss"
                      >
                        <Icon name="close" className="text-[18px]" />
                      </button>
                    </div>
                  )}
                </form>
              </Card>

              <Card
                padding="lg"
                hoverLift={false}
                className="flex items-center justify-between gap-space-md flex-wrap"
              >
                <div className="flex items-center gap-space-md">
                  <div className="w-12 h-12 rounded-lg bg-surface-container-low flex items-center justify-center text-primary shrink-0">
                    <Icon name="policy" className="text-[28px]" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-navy-surface">
                      Verified Listings Only
                    </h2>
                    <p className="text-sm text-on-surface-variant">
                      Every vacancy is reviewed for HR legitimacy before it
                      reaches candidates.
                    </p>
                  </div>
                </div>
                <Link
                  href="/aboutus"
                  className="text-sm font-semibold text-primary hover:underline whitespace-nowrap flex items-center gap-1"
                >
                  Learn more
                  <Icon name="arrow_forward" className="text-[16px]" />
                </Link>
              </Card>
            </div>

            {/* Channels column */}
            <div className="lg:col-span-5 flex flex-col gap-space-lg">
              <Card
                padding="lg"
                hoverLift={false}
                className="flex flex-col gap-space-md"
              >
                <div className="flex items-center gap-space-xs">
                  <span className="w-2 h-2 rounded-full bg-verified-green" />
                  <span className="text-xs font-bold uppercase tracking-wider text-verified-green">
                    WhatsApp Official Hotline
                  </span>
                </div>
                <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col gap-space-xs">
                  <span className="text-xl font-bold text-navy-surface tracking-tight">
                    +92 324 4296468
                  </span>
                  <p className="text-sm text-on-surface-variant">
                    The fastest way to reach our team for job dispatch,
                    verification, or general queries.
                  </p>
                  <Button
                    href="https://wa.me/923244296468"
                    target="_blank"
                    variant="solidDark"
                    icon="chat"
                    fullWidth
                    className="mt-1"
                  >
                    Connect via WhatsApp
                  </Button>
                </div>

                <div className="flex items-start gap-space-sm p-space-xs rounded-lg hover:bg-surface-container-low transition-colors">
                  <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-primary shrink-0">
                    <Icon name="mail" className="text-[18px]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-on-surface-variant uppercase font-semibold">
                      General &amp; Editorial Inquiries
                    </span>
                    <a
                      href="https://mail.google.com/mail/?view=cm&fs=1&to=info@pharmaconnect-pakistan.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-bold text-navy-surface hover:text-primary transition-colors"
                    >
                      info@pharmaconnect-pakistan.com
                    </a>
                  </div>
                </div>
              </Card>

              <div className="rounded-2xl p-space-md bg-navy-surface text-on-primary flex items-center justify-between gap-space-md shadow-md">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary-fixed-dim">
                    Network Distribution
                  </span>
                  <div className="text-xl font-bold mt-0.5">
                    15,000+ Healthcare Professionals
                  </div>
                  <p className="text-sm text-white/60 mt-1">
                    LinkedIn community &amp; active job dispatch channels.
                  </p>
                </div>
                <a
                  href="https://www.linkedin.com/company/pharmaconnect-pakistan/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-space-md py-space-xs bg-primary hover:bg-primary-container text-on-primary rounded-lg text-sm font-semibold transition-colors shrink-0"
                >
                  Join
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="w-full bg-surface-container-low py-space-2xl">
        <Container>
          <SectionHeading
            eyebrow="Frequently Asked Questions"
            title="Immediate Clarifications"
            description="How vacancies are vetted, whether candidates pay any charges, and how to reach the right desk."
            align="center"
            className="max-w-2xl mb-space-xl"
          />
          <Faq items={FAQS} className="max-w-3xl mx-auto" />
        </Container>
      </section>

      {/* Bottom CTA strip */}
      <section className="w-full py-space-xl">
        <Container>
          <Card
            padding="lg"
            hoverLift={false}
            className="flex flex-col md:flex-row items-center justify-between gap-space-lg"
          >
            <div className="flex items-center gap-space-md">
              <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Icon name="medical_services" className="text-[28px]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-navy-surface">
                  Have an immediate query?
                </h3>
                <p className="text-on-surface-variant text-sm">
                  Our team reviews incoming correspondence throughout the
                  working week.
                </p>
              </div>
            </div>
            <Button
              href="https://wa.me/923244296468"
              target="_blank"
              variant="primary"
              icon="chat"
            >
              Direct WhatsApp Desk
            </Button>
          </Card>
        </Container>
      </section>
    </div>
  );
}
