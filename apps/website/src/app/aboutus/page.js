import React from "react";
import Image from "next/image";
import SiteHeader from "../componants/siteHeader";
import SiteFooter from "../componants/siteFooter";
import ScrollTop from "../componants/scrollTop";
import Breadcrumb from "../componants/breadcrumb";
import Container from "../componants/container";
import Badge from "../componants/badge";
import Button from "../componants/button";
import Card from "../componants/card";
import SectionHeading from "../componants/sectionHeading";
import Faq from "../componants/faq";
import Icon from "../componants/msIcon";
import "../assets/css/tailwind.css";

const PILLARS = [
  {
    icon: "flag",
    title: "Our Mission",
    desc: "Bridge the information gap between Pakistani pharmacy talent and global opportunities through honest, curated listings.",
    tone: "bg-primary/10 text-primary",
  },
  {
    icon: "visibility",
    title: "Our Vision",
    desc: "A pharmacy community where every student, graduate, and professional has equal access to opportunity.",
    tone: "bg-teal-clinical/10 text-teal-clinical",
  },
  {
    icon: "favorite",
    title: "Our Values",
    desc: "Curation over clutter. Trust over traffic. Community over clicks.",
    tone: "bg-berry-accent/10 text-berry-deep",
  },
];

const VERIFY_STEPS = [
  {
    step: "01",
    title: "Traceable Source Required",
    desc: "A listing only goes up if it names a real company and gives a traceable way to apply — a company email or a link to the official posting.",
    icon: "mail",
  },
  {
    step: "02",
    title: "Manually Reviewed",
    desc: "Every opportunity is curated from publicly available sources and checked by hand before it's shared — nothing is auto-scraped or bulk-imported.",
    icon: "search",
  },
  {
    step: "03",
    title: "Clearly Labeled",
    desc: "If a company or contact detail can't be confirmed, the listing carries a clear note instead of a false Verified badge.",
    icon: "info",
  },
];

const FOUNDERS = [
  {
    image: "/images/team/burhan.jpeg",
    name: "Muhammad Burhan Khan",
    title: "Founder, Pharmacist",
    detail: "Pharm-D graduate of COMSATS University Islamabad, with experience in community pharmacy, industrial quality assurance, and pharmaceutical research.",
    linkedin: "https://www.linkedin.com/in/muhammadburhankhan/",
  },
  {
    image: "/images/team/hamza.jpg",
    name: "Muhammad Hamza Saleemi",
    title: "Co-Founder, Software Engineer",
    detail: "Builds the platform behind PharmaConnect — search, verification tooling, and the infrastructure that keeps listings current.",
    linkedin: "https://www.linkedin.com/in/mhamzasaleemi/",
  },
];

const FAQS = [
  {
    q: "What does PharmaConnect do?",
    a: "PharmaConnect is a platform for local and global pharmacy jobs, scholarships, and career guidance, built for pharmacy students and professionals at any stage of their career, anywhere in the world.",
  },
  {
    q: "Who founded PharmaConnect, and when?",
    a: "PharmaConnect was founded in 2024 by Muhammad Burhan Khan, a Pharm-D graduate of COMSATS University Islamabad, with experience in community pharmacy, industrial quality assurance, and pharmaceutical research.",
  },
  {
    q: "How big is the PharmaConnect community?",
    a: "PharmaConnect reaches 10,000+ pharmacy professionals and students on LinkedIn across Karachi, Lahore, Islamabad, and beyond, with 1,000+ career opportunities curated and shared in the past year — growing entirely organically with no paid promotion.",
  },
  {
    q: "Are the opportunities on PharmaConnect verified?",
    a: "A listing is marked Verified when it names a real company and provides a traceable way to apply, such as a company email or a link to the company's official posting. If the company or contact details can't be confirmed, the listing carries a clear note instead.",
  },
];

export default function AboutUsPage() {
  return (
    <div className="bg-surface font-sans text-on-surface antialiased">
      <SiteHeader />

      <main className="w-full pt-20 bg-surface">
        <Breadcrumb />
        {/* HERO */}
        <section className="w-full bg-surface-card shadow-sm py-space-xl">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
              <div className="lg:col-span-7 flex flex-col gap-space-md">
                <Badge tone="primary" pulse className="w-fit">
                  About PharmaConnect · Pakistan&apos;s Premier Pharmacy Network
                </Badge>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-navy-surface tracking-tight leading-[1.15]">
                  Pharmacists helping pharmacists{" "}
                  <span className="text-primary">go further.</span>
                </h1>
                <p className="text-base text-on-surface-variant leading-relaxed">
                  PharmaConnect is a resource for pharmacy students,
                  professionals, and job seekers across Pakistan, sharing
                  scholarships, internships, summer programs, job openings,
                  and career development opportunities in the pharmaceutical
                  and healthcare sector.
                </p>
                <p className="text-sm text-navy-surface bg-surface-container-low p-space-md rounded-xl">
                  Founded in 2024 by{" "}
                  <strong className="font-semibold">
                    Muhammad Burhan Khan
                  </strong>{" "}
                  (a Pharm-D graduate of COMSATS University Islamabad),
                  PharmaConnect began as a LinkedIn page and has grown into a
                  community of{" "}
                  <strong className="text-primary font-semibold">
                    10,000+ pharmacists
                  </strong>{" "}
                  worldwide, most based in Pakistan.
                </p>

                <div className="flex flex-wrap items-center gap-space-sm pt-space-xs">
                  <Button href="/jobs" icon="arrow_forward" iconPosition="right">
                    Explore Jobs
                  </Button>
                  <Button
                    href="https://www.linkedin.com/company/pharmaconnect-pakistan/"
                    target="_blank"
                    variant="secondary"
                    icon="share"
                  >
                    Follow us on LinkedIn
                  </Button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-space-md pt-space-sm">
                  <div className="flex items-center gap-space-xs">
                    <Icon name="verified" className="text-[22px] text-verified-green" />
                    <div className="flex flex-col">
                      <span className="text-[11px] uppercase tracking-wide text-on-surface-variant">
                        Sourcing
                      </span>
                      <span className="text-sm font-bold text-navy-surface">
                        Curated, Not Scraped
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-space-xs">
                    <Icon name="medical_services" className="text-[22px] text-cyan-bright" />
                    <div className="flex flex-col">
                      <span className="text-[11px] uppercase tracking-wide text-on-surface-variant">
                        Founded By
                      </span>
                      <span className="text-sm font-bold text-navy-surface">
                        Pharm-D Graduate
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-space-xs">
                    <Icon name="public" className="text-[22px] text-berry-deep" />
                    <div className="flex flex-col">
                      <span className="text-[11px] uppercase tracking-wide text-on-surface-variant">
                        Reach
                      </span>
                      <span className="text-sm font-bold text-navy-surface">
                        Pakistan &amp; Gulf
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="relative rounded-3xl overflow-hidden shadow-xl border border-border-subtle">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/about/ab01.jpeg"
                    className="w-full h-[420px] object-cover"
                    alt="PharmaConnect pharmacy dispensary"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/80 via-transparent to-transparent" />
                  <div className="absolute top-5 left-5 bg-surface-card/95 backdrop-blur-md px-space-md py-space-sm rounded-2xl shadow-lg flex items-center gap-space-sm">
                    <span className="relative flex h-3 w-3 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-verified-green opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-verified-green" />
                    </span>
                    <div className="flex flex-col">
                      <span className="font-bold text-navy-surface leading-none">
                        10,000+
                      </span>
                      <span className="text-[11px] text-on-surface-variant">
                        Verified Pharmacists
                      </span>
                    </div>
                  </div>
                  <div className="absolute bottom-5 left-5 right-5 bg-surface-card/95 backdrop-blur-md p-space-md rounded-2xl shadow-lg flex items-center justify-between gap-space-sm">
                    <div className="flex items-center gap-space-sm">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Icon name="verified_user" className="text-[22px]" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-navy-surface leading-tight">
                          Pharm-D Led
                        </span>
                        <span className="text-[11px] text-on-surface-variant">
                          Direct Industry Insight
                        </span>
                      </div>
                    </div>
                    <Icon name="check_circle" className="text-[24px] text-verified-green" />
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* IMPACT STATS */}
        <section className="w-full bg-surface-card py-space-xl border-t border-border-subtle">
          <Container>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
              {[
                { icon: "groups", value: "10,000+", label: "LinkedIn Community" },
                { icon: "work", value: "1,000+", label: "Opportunities Curated" },
                { icon: "calendar_today", value: "2024", label: "Founded" },
                { icon: "verified", value: "Verified Only", label: "Every Listing Traceable" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="p-space-lg rounded-2xl bg-surface-container-low flex flex-col gap-space-sm"
                >
                  <Icon name={stat.icon} className="text-[26px] text-primary" />
                  <div className="text-2xl font-extrabold text-navy-surface tracking-tight">
                    {stat.value}
                  </div>
                  <p className="text-sm text-on-surface-variant">{stat.label}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* WHAT DRIVES PHARMACONNECT */}
        <section className="w-full py-space-3xl bg-surface">
          <Container>
            <SectionHeading
              eyebrow="Core Principles"
              title="What drives PharmaConnect"
              description="We don't post randomly; every job and recommendation we share follows a clear set of rules we believe in: be truthful, prioritize quality, and only share roles genuinely worth your time and trust."
              align="center"
              className="mb-space-2xl"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
              {PILLARS.map((p) => (
                <Card key={p.title} padding="lg" hoverLift={false}>
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-space-md ${p.tone}`}
                  >
                    <Icon name={p.icon} className="text-[28px]" />
                  </div>
                  <h3 className="text-lg font-bold text-navy-surface mb-space-xs">
                    {p.title}
                  </h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {p.desc}
                  </p>
                </Card>
              ))}
            </div>
          </Container>
        </section>

        {/* HOW WE VERIFY */}
        <section className="w-full py-space-3xl bg-surface-container-low/40">
          <Container>
            <SectionHeading
              eyebrow="Guaranteed Integrity"
              title="How We Verify Opportunities"
              description="A listing only earns a Verified badge after clearing all three checks below."
              align="center"
              className="mb-space-2xl"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
              {VERIFY_STEPS.map((s) => (
                <Card key={s.step} padding="lg" hoverLift={false}>
                  <div className="w-12 h-12 rounded-xl bg-primary text-on-primary font-extrabold flex items-center justify-center mb-space-md">
                    {s.step}
                  </div>
                  <h3 className="text-base font-bold text-navy-surface mb-space-xs">
                    {s.title}
                  </h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed mb-space-md">
                    {s.desc}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-clinical pt-space-sm border-t border-border-subtle/60">
                    <Icon name={s.icon} className="text-[16px]" />
                    Step {s.step}
                  </div>
                </Card>
              ))}
            </div>
          </Container>
        </section>

        {/* FOUNDERS */}
        <section className="w-full py-space-3xl bg-surface">
          <Container>
            <SectionHeading
              eyebrow="Stewardship"
              title="Meet the Founders"
              description="The people building PharmaConnect for Pakistan's pharmacy community and beyond."
              align="center"
              className="mb-space-2xl"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg mx-auto">
              {FOUNDERS.map((f) => (
                <Card key={f.name} padding="lg" hoverLift={false} className="flex gap-space-md items-start">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-surface-container-low">
                    <Image
                      src={f.image}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                      alt={f.name}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-space-xs">
                      <div>
                        <h3 className="font-bold text-navy-surface">{f.name}</h3>
                        <Badge tone="primary" dot={false} uppercase={false} className="mt-1">
                          {f.title}
                        </Badge>
                      </div>
                      <a
                        href={f.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${f.name} on LinkedIn`}
                        className="w-9 h-9 rounded-lg bg-surface-container-low text-primary hover:bg-primary hover:text-on-primary flex items-center justify-center transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                      >
                        <Icon name="share" className="text-[18px]" />
                      </a>
                    </div>
                    <p className="text-sm text-on-surface-variant leading-relaxed mt-space-sm">
                      {f.detail}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </Container>
        </section>

        {/* FAQ */}
        <section className="w-full py-space-3xl bg-surface-container-low/40">
          <Container>
            <SectionHeading
              eyebrow="Common Questions"
              title="Questions & Answers"
              description="Everything you need to know about how PharmaConnect works, from sourcing opportunities to joining our community."
              align="center"
              className="mb-space-2xl max-w-3xl mx-auto"
            />
            <Faq items={FAQS} className="mx-auto" />
          </Container>
        </section>

        {/* BOTTOM CTA */}
        <section className="w-full pb-space-3xl bg-surface">
          <Container>
            <div className="rounded-3xl bg-navy-deep text-on-primary p-space-2xl text-center">
              <Badge tone="dark" className="mx-auto w-fit mb-space-sm">
                Get In Touch
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold mb-space-sm">
                Have a question or an opportunity to share?
              </h2>
              <p className="text-sm text-white/70 max-w-xl mx-auto mb-space-md">
                If you have a job opportunity you&apos;d like to share, or any
                queries regarding PharmaConnect, feel free to contact us.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-space-sm">
                <Button href="/contactus" icon="mail">
                  Contact Us
                </Button>
                <Button
                  href="https://wa.me/923244296468"
                  target="_blank"
                  variant="solidDark"
                  icon="chat"
                >
                  WhatsApp Community
                </Button>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter />
      <ScrollTop />
    </div>
  );
}
