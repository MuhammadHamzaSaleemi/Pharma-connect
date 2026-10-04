import React from "react";
import Link from "next/link";
import SiteHeader from "./siteHeader";
import SiteFooter from "./siteFooter";
import ScrollTop from "./scrollTop";
import Breadcrumb from "./breadcrumb";
import Container from "./container";
import Badge from "./badge";
import Button from "./button";
import Card from "./card";
import Icon from "./msIcon";
import "../assets/css/tailwind.css";

const CONTACT_EMAIL = "info@pharmaconnect-pakistan.com";

// Building blocks for legal copy. Explicit margins everywhere because the
// public site keeps Bootstrap's base styles (preflight is off), which would
// otherwise add their own p/ul/h margins.
export function LegalP({ children, className = "" }) {
  return <p className={`m-0 text-[15px] leading-relaxed text-on-surface-variant ${className}`}>{children}</p>;
}

export function LegalSub({ children }) {
  return <h3 className="m-0 pt-space-xs text-base font-bold text-navy-surface">{children}</h3>;
}

export function LegalList({ items }) {
  return (
    <ul className="list-none m-0 p-0 flex flex-col gap-space-sm">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-space-sm text-[15px] leading-relaxed text-on-surface-variant">
          <span className="mt-[9px] w-1.5 h-1.5 rounded-full bg-primary shrink-0" aria-hidden="true" />
          <span className="min-w-0">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function LegalLink({ href, children }) {
  return (
    <Link href={href} className="font-semibold text-primary no-underline hover:underline break-words">
      {children}
    </Link>
  );
}

export function EmailLink() {
  return <LegalLink href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</LegalLink>;
}

const sectionId = (s, i) => s.id ?? `section-${i + 1}`;

function TocLinks({ sections }) {
  return (
    <ol className="list-none m-0 p-0 flex flex-col gap-1">
      {sections.map((s, i) => (
        <li key={sectionId(s, i)}>
          <a
            href={`#${sectionId(s, i)}`}
            className="flex items-start gap-space-xs px-space-sm py-1.5 rounded-lg text-sm text-on-surface-variant no-underline hover:bg-surface-container-low hover:text-primary transition-colors"
          >
            <span className="w-5 shrink-0 font-bold text-primary tabular-nums">{i + 1}.</span>
            <span>{s.title}</span>
          </a>
        </li>
      ))}
    </ol>
  );
}

// Shared layout for /privacy and /terms: same shell as every other public
// page (SiteHeader, Breadcrumb, SiteFooter) with a hero, numbered sections,
// and a sticky table of contents on desktop.
export default function LegalPage({ eyebrow, eyebrowIcon, title, accent, description, updated, intro, sections, disclaimer }) {
  return (
    <div className="bg-surface font-sans text-on-surface antialiased">
      <SiteHeader />

      <main className="w-full pt-20 bg-surface">
        <Breadcrumb />

        {/* HERO */}
        <section className="w-full bg-surface-card shadow-sm py-space-xl">
          <Container>
            <div className="max-w-3xl flex flex-col gap-space-md">
              <Badge tone="primary" pulse className="w-fit">{eyebrow}</Badge>
              <h1 className="m-0 text-4xl sm:text-5xl font-extrabold text-navy-surface tracking-tight leading-[1.15]">
                {title} <span className="text-primary">{accent}</span>
              </h1>
              <p className="m-0 text-base text-on-surface-variant leading-relaxed">{description}</p>
              <div className="flex flex-wrap items-center gap-x-space-lg gap-y-space-xs pt-space-xs text-sm text-on-surface-variant">
                <span className="flex items-center gap-1.5">
                  <Icon name="calendar_today" className="text-[18px] text-primary" />
                  Last updated: <strong className="font-semibold text-navy-surface">{updated}</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <Icon name={eyebrowIcon} className="text-[18px] text-verified-green" />
                  {sections.length} sections
                </span>
              </div>
            </div>
          </Container>
        </section>

        {/* BODY */}
        <section className="w-full py-space-2xl">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-2xl items-start">
              <article className="lg:col-span-8 flex flex-col gap-space-lg min-w-0">
                {/* Mobile/tablet table of contents; desktop gets the sticky sidebar. */}
                <details className="lg:hidden group bg-surface-card rounded-2xl border border-border-subtle shadow-sm">
                  <summary className="flex items-center justify-between gap-space-sm p-space-md cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                    <span className="flex items-center gap-space-xs text-sm font-bold text-navy-surface">
                      <Icon name="article" className="text-[20px] text-primary" />
                      On this page
                    </span>
                    <Icon name="expand_more" className="text-[22px] text-on-surface-variant transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="px-space-xs pb-space-sm">
                    <TocLinks sections={sections} />
                  </div>
                </details>

                <Card padding="none" hoverLift={false} className="relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-cyan-bright to-berry-accent" />
                  <div className="p-space-lg sm:p-space-xl flex flex-col gap-space-xl">
                    {intro && <div className="flex flex-col gap-space-md">{intro}</div>}

                    {sections.map((s, i) => (
                      <section
                        key={sectionId(s, i)}
                        id={sectionId(s, i)}
                        className="scroll-mt-28 flex flex-col gap-space-md pt-space-xl border-t border-border-subtle first:pt-0 first:border-t-0"
                      >
                        <h2 className="m-0 flex items-start gap-space-sm text-xl sm:text-2xl font-bold text-navy-surface tracking-tight">
                          <span className="flex items-center justify-center w-9 h-9 shrink-0 rounded-xl bg-primary/10 text-primary text-base font-extrabold tabular-nums">
                            {i + 1}
                          </span>
                          <span className="pt-0.5">{s.title}</span>
                        </h2>
                        {s.body}
                      </section>
                    ))}

                    {disclaimer && (
                      <div className="flex items-start gap-space-sm p-space-md rounded-xl bg-surface-container-low">
                        <Icon name="info" className="text-[20px] text-primary shrink-0" />
                        <p className="m-0 text-sm italic leading-relaxed text-on-surface-variant">{disclaimer}</p>
                      </div>
                    )}
                  </div>
                </Card>
              </article>

              <aside className="lg:col-span-4 flex flex-col gap-space-lg lg:sticky lg:top-24">
                <Card padding="lg" hoverLift={false} className="hidden lg:flex flex-col gap-space-sm">
                  <h4 className="m-0 text-xs font-bold uppercase tracking-widest text-navy-surface">On this page</h4>
                  <div className="max-h-[calc(100vh-22rem)] overflow-y-auto -mx-space-sm">
                    <TocLinks sections={sections} />
                  </div>
                </Card>

                <Card padding="lg" hoverLift={false} className="flex flex-col gap-space-sm">
                  <div className="flex items-center gap-space-xs text-teal-clinical">
                    <Icon name="mail" className="text-[22px]" />
                    <h4 className="m-0 text-base font-bold text-navy-surface">Questions about this page?</h4>
                  </div>
                  <p className="m-0 text-sm text-on-surface-variant">
                    Email us at <EmailLink /> and we&apos;ll get back to you.
                  </p>
                  <Button href="/contactus" icon="arrow_forward" iconPosition="right" fullWidth>
                    Contact Us
                  </Button>
                </Card>
              </aside>
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter />
      <ScrollTop />
    </div>
  );
}
