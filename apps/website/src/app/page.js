"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import SiteHeader from "./componants/siteHeader";
import SiteFooter from "./componants/siteFooter";
import ExploreJobs from "./componants/exploreJobs";
import Icon from "./componants/msIcon";
import Badge from "./componants/badge";
import Button from "./componants/button";
import Card from "./componants/card";
import Container from "./componants/container";
import SectionHeading from "./componants/sectionHeading";
import StateMessage from "./componants/stateMessage";
import BlogCard from "./componants/blogCard";
import ScrollTop from "./componants/scrollTop";
import { usePublicBlogsQuery } from "../services/blogs/blogs.queries";
import "./assets/css/tailwind.css";

const QUICK_LINKS = [
  { label: "Jobs", icon: "work", href: "/jobs" },
  { label: "Scholarships", icon: "school", href: "/jobs" },
  { label: "Internships", icon: "clinical_notes", href: "/jobs" },
  { label: "Blogs", icon: "article", href: "/blogs" },
];

const CATEGORIES = [
  { title: "Medical Affairs", count: 38, icon: "medical_services", tone: "cyan" },
  { title: "Sales & Marketing", count: 85, icon: "trending_up", tone: "berry" },
  { title: "Quality Control & QA", count: 42, icon: "biotech", tone: "teal" },
  { title: "Hospital Pharmacy", count: 64, icon: "local_hospital", tone: "primary" },
  { title: "Warehouse & Logistics", count: 29, icon: "inventory_2", tone: "warning" },
  { title: "Community Pharmacy", count: 51, icon: "local_pharmacy", tone: "cyan" },
  { title: "DRAP & Regulatory", count: 19, icon: "policy", tone: "teal" },
  { title: "R&D & Formulations", count: 22, icon: "science", tone: "berry" },
];

const CATEGORY_TONES = {
  cyan: "bg-cyan-bright/10 text-cyan-bright group-hover:bg-primary group-hover:text-on-primary",
  berry: "bg-berry-accent/10 text-berry-deep group-hover:bg-berry-deep group-hover:text-on-primary",
  teal: "bg-teal-clinical/10 text-teal-clinical group-hover:bg-teal-clinical group-hover:text-on-primary",
  primary: "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-on-primary",
  warning: "bg-status-warning/10 text-status-warning group-hover:bg-status-warning group-hover:text-on-primary",
};

const WHY_FEATURES = [
  {
    title: "Curated, Not Scraped",
    desc: "Every listing is reviewed for relevance and verified against accredited institutional sources.",
    icon: "verified",
    tone: "bg-cyan-bright/10 text-cyan-bright",
  },
  {
    title: "Built for Community",
    desc: "Made by pharmacists, for pharmacists, students, graduates, and clinical professionals.",
    icon: "groups",
    tone: "bg-teal-clinical/10 text-teal-clinical",
  },
  {
    title: "Quick and Easy to Use",
    desc: "Easy interface and medical faceted filters available, making job searching straightforward.",
    icon: "bolt",
    tone: "bg-primary/10 text-primary",
  },
  {
    title: "No Clutter",
    desc: "Expired opportunities are hidden automatically. Zero broken deadlines or clutter, ever.",
    icon: "filter_alt_off",
    tone: "bg-berry-accent/10 text-berry-deep",
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
  const blogsQuery = usePublicBlogsQuery({
    page: 1,
    limit: 3,
    status: "PUBLISHED",
  });

  const apiBlogs = blogsQuery.data?.data ?? [];
  const blogs =
    !blogsQuery.isLoading && (blogsQuery.isError || apiBlogs.length === 0)
      ? dummyBlogs
      : apiBlogs;

  return (
    <div className="bg-surface font-sans text-on-surface antialiased">
      <SiteHeader />

      <main className="w-full pt-20 bg-surface">
        {/* HERO */}
        <section className="relative w-full bg-gradient-to-b from-surface-container-low/70 via-surface to-surface overflow-hidden pb-space-3xl pt-space-xl">
          <div className="absolute -top-28 right-0 w-96 h-96 rounded-full bg-cyan-bright/10 blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 -left-20 w-80 h-80 rounded-full bg-berry-accent/5 blur-3xl pointer-events-none" />
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
              <div className="lg:col-span-7 flex flex-col gap-space-md z-10">
                <Badge tone="primary" pulse className="w-fit shadow-sm">
                  Pakistan&apos;s Premier Pharmacy Career Network
                </Badge>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-navy-surface tracking-tight leading-[1.15]">
                  Discover Pharmacy{" "}
                  <span className="text-primary block">Opportunities</span> that
                  matter.
                </h1>
                <p className="text-base sm:text-lg text-on-surface-variant max-w-xl">
                  Jobs, scholarships, and internships for pharmacists,
                  technicians, and students across Pakistan and abroad.
                </p>

                <div className="flex flex-wrap items-center gap-space-sm pt-space-xs">
                  <Button
                    href="/jobs"
                    size="lg"
                    icon="search"
                    className="shadow-lg shadow-primary/20 hover:scale-[1.02]"
                  >
                    Explore Jobs
                  </Button>
                  <Button href="/contactus" variant="secondary" size="lg">
                    <Icon
                      name="add_circle"
                      className="text-[20px] text-teal-clinical"
                    />
                    Post Opportunity
                  </Button>
                </div>

                <div className="flex flex-wrap items-center gap-space-xs pt-space-sm">
                  {QUICK_LINKS.map((q) => (
                    <Link
                      key={q.label}
                      href={q.href}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-card text-on-surface-variant font-semibold text-xs shadow-sm hover:bg-primary hover:text-on-primary border border-border-subtle/70 transition-all"
                    >
                      <Icon name={q.icon} className="text-[17px]" />
                      {q.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 relative flex justify-end items-end">
                <div className="relative w-full max-w-[440px] aspect-square flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-bright/15 via-surface-container to-berry-accent/15 -rotate-6 scale-105" />
                  <Image
                    src="/images/hero2.png"
                    width={440}
                    height={440}
                    className="relative z-10 w-full h-full object-contain drop-shadow-xl"
                    alt="PharmaConnect careers"
                  />
                  <div className="absolute -top-4 -left-4 z-20 bg-surface-card/95 backdrop-blur-md px-space-md py-space-xs rounded-xl shadow-md border border-border-subtle flex items-center gap-space-xs">
                    <div className="w-8 h-8 rounded-lg bg-verified-green/15 text-verified-green flex items-center justify-center">
                      <Icon name="verified_user" className="text-[20px]" />
                    </div>
                    <div>
                      <span className="block text-sm font-bold text-navy-surface">
                        600+ Roles
                      </span>
                      <span className="block text-[11px] text-on-surface-variant">
                        Curated Pharma Careers
                      </span>
                    </div>
                  </div>
                  <div className="absolute -bottom-4 -right-2 z-20 bg-surface-card/95 backdrop-blur-md px-space-md py-space-xs rounded-xl shadow-md border border-border-subtle flex items-center gap-space-xs">
                    <div className="w-8 h-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
                      <Icon name="visibility" className="text-[20px]" />
                    </div>
                    <div>
                      <span className="block text-sm font-bold text-navy-surface">
                        800,000+
                      </span>
                      <span className="block text-[11px] text-on-surface-variant">
                        Verified Impressions
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* POPULAR CATEGORIES */}
        <section className="w-full py-space-3xl bg-surface">
          <Container>
            <SectionHeading
              eyebrow="Career Clusters"
              title="Popular Categories"
              description="These are the most sought after categories across pharmaceutical manufacturing, clinical research, and hospital networks."
              className="mb-space-2xl"
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md">
              {CATEGORIES.map((c) => (
                <Card
                  key={c.title}
                  href="/jobs"
                  className="text-left group flex flex-col items-start"
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-space-md transition-colors ${CATEGORY_TONES[c.tone]}`}
                  >
                    <Icon name={c.icon} className="text-[26px]" />
                  </div>
                  <h5 className="font-bold text-navy-surface group-hover:text-primary transition-colors">
                    {c.title}
                  </h5>
                  <span className="text-xs text-on-surface-variant mt-1">
                    {c.count} open positions
                  </span>
                </Card>
              ))}
            </div>
          </Container>
        </section>

        {/* EXPLORE JOBS */}
        <ExploreJobs />

        {/* WHY PHARMACONNECT */}
        <section className="w-full py-space-3xl bg-surface">
          <Container>
            <SectionHeading
              eyebrow="Guaranteed Integrity"
              title="Why PharmaConnect?"
              description="All the open authentic positions curated here with their source mentioned."
              align="center"
              className="mb-space-2xl"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-lg">
              {WHY_FEATURES.map((f) => (
                <Card
                  key={f.title}
                  padding="lg"
                  hoverLift={false}
                  className="text-center flex flex-col items-center"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-space-md ${f.tone}`}
                  >
                    <Icon name={f.icon} className="text-[28px]" />
                  </div>
                  <h3 className="text-lg text-navy-surface font-bold mb-space-xs">
                    {f.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-on-surface-variant">
                    {f.desc}
                  </p>
                </Card>
              ))}
            </div>
          </Container>
        </section>

        {/* ABOUT */}
        <section className="w-full py-space-3xl bg-surface-container-low/40">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-2xl items-center">
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border-subtle">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/about/ab01.jpeg"
                    className="w-full h-auto object-cover max-h-[500px]"
                    alt="PharmaConnect dispensary"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-surface/85 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-on-primary">
                    <Badge tone="dark" dot={false} className="mb-2">
                      Direct Field Experience
                    </Badge>
                    <p className="text-xl font-bold">
                      Standardizing Pharmacy Recruitment across Pakistan
                    </p>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-4 bg-surface-card p-space-md rounded-2xl shadow-xl items-center gap-space-sm hidden sm:flex border border-border-subtle">
                  <div className="w-10 h-10 rounded-full bg-verified-green text-on-primary flex items-center justify-center">
                    <Icon name="check_circle" className="text-[22px]" />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-navy-surface">
                      Pharm-D Led
                    </span>
                    <span className="block text-xs text-on-surface-variant">
                      Direct Industry Insight
                    </span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 flex flex-col gap-space-md">
                <Badge tone="primary" className="w-fit">
                  About The Platform
                </Badge>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl text-navy-surface font-bold leading-tight">
                  Pharmacy Job Platform. Find the right opportunity you deserve.
                </h2>
                <p className="text-base text-on-surface-variant leading-relaxed">
                  PharmaConnect Pakistan connects pharmacists, technicians, and
                  students with verified job openings, scholarships, and
                  internships across Pakistan and beyond.
                </p>
                <div className="flex flex-col gap-space-sm my-space-xs">
                  {[
                    {
                      tone: "bg-verified-green/15 text-verified-green",
                      strong: "Source Veracity:",
                      rest: " Every listing is marked Verified or Unverified based on confirmed source information directly from hospitals, MNCs, and drug authorities.",
                    },
                    {
                      tone: "bg-teal-clinical/15 text-teal-clinical",
                      strong: "Practitioner Founded:",
                      rest: " Founded by a Pharm-D graduate with direct pharmacy industry experience, ensuring clinical nuances are never lost.",
                    },
                    {
                      tone: "bg-berry-accent/15 text-berry-deep",
                      strong: "Unrivaled Reach:",
                      rest: " 600+ curated pharma careers, 800,000+ impressions, making it Pakistan's most active and trusted pharmacy community.",
                    },
                  ].map((p) => (
                    <div key={p.strong} className="flex items-start gap-space-sm">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${p.tone}`}
                      >
                        <Icon name="check" className="text-[16px]" />
                      </div>
                      <p className="text-sm text-navy-surface">
                        <strong>{p.strong}</strong>
                        {p.rest}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="pt-space-xs">
                  <Button href="/aboutus" icon="arrow_forward" iconPosition="right">
                    Learn More About Us
                  </Button>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* LATEST BLOG */}
        <section className="w-full py-space-3xl bg-surface">
          <Container>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-2xl gap-space-sm">
              <SectionHeading
                eyebrow="Knowledge Base & Guides"
                title="Latest Blog or News"
                description="Verified pharmacy blogs and news for Pakistani and global professionals. Every article sourced from authentic international and local channels."
              />
              <Link
                href="/blogs"
                className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary-container font-bold shrink-0"
              >
                Browse All Articles
                <Icon name="arrow_forward" className="text-[18px]" />
              </Link>
            </div>

            {blogsQuery.isLoading ? (
              <StateMessage loading>Loading blog posts...</StateMessage>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
                {blogs.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </Container>
        </section>

        {/* NEWSLETTER BAND */}
        <section className="w-full pb-space-3xl bg-surface">
          <Container>
            <div className="rounded-3xl bg-navy-deep text-on-primary p-space-2xl grid grid-cols-1 lg:grid-cols-2 gap-space-xl items-center">
              <div>
                <Badge tone="dark">Join 15,000+ Healthcare Professionals</Badge>
                <h3 className="text-2xl sm:text-3xl font-bold mt-space-xs">
                  Instant Pharmacy Job Alerts Directly to Your Phone
                </h3>
                <p className="text-sm text-white/70 mt-space-sm max-w-md">
                  Receive verified opportunities before they go live on major job
                  boards. Connect directly with hiring managers across Pakistan
                  and the Middle East.
                </p>
                <div className="flex flex-wrap gap-space-sm mt-space-md">
                  <Button
                    href="https://wa.me/923244296468"
                    target="_blank"
                    variant="solidDark"
                    icon="chat"
                  >
                    Join WhatsApp Community
                  </Button>
                  <Button
                    href="https://www.linkedin.com/company/pharmaconnect-pakistan/"
                    target="_blank"
                    variant="dark"
                  >
                    LinkedIn Network
                  </Button>
                </div>
              </div>

              <form
                action="/contactus"
                className="rounded-2xl bg-white/[0.04] border border-white/10 p-space-xl"
              >
                <h4 className="text-lg font-bold text-white">
                  Subscribe to Weekly Digest
                </h4>
                <p className="text-xs text-white/60 mt-space-2xs">
                  A single email every Monday morning with top clinical, QC, and
                  sales positions.
                </p>
                <div className="relative mt-space-md">
                  <Icon
                    name="mail"
                    className="text-[18px] text-white/40 absolute left-3 top-1/2 -translate-y-1/2"
                  />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Enter your work email (e.g. name@pharmacy.com)"
                    className="w-full rounded-xl bg-white/[0.06] border border-white/10 text-sm text-white placeholder:text-white/40 pl-10 pr-3 py-space-sm focus:outline-none focus:ring-2 focus:ring-primary-fixed-dim/40 focus:border-primary-fixed-dim transition-shadow"
                  />
                </div>
                <Button
                  type="submit"
                  icon="notifications_active"
                  fullWidth
                  className="mt-space-sm"
                >
                  Subscribe for Alerts
                </Button>
                <p className="text-[11px] text-white/40 text-center mt-space-sm">
                  Zero spam. Unsubscribe in one click anytime.
                </p>
              </form>
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter />

      <ScrollTop />
    </div>
  );
}
