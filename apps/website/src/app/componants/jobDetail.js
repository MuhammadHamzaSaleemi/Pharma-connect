import React from "react";
import Link from "next/link";
import Icon from "./msIcon";
import Badge from "./badge";
import Button from "./button";
import Card from "./card";
import Container from "./container";
import { formatEnumLabel } from "../../lib/enumOptions";
import { daysAgo } from "./jobCard";
import { PROSE_CLASSES } from "./blogDetail";

function applyWhatsappHref(job) {
  const text = `Hi PharmaConnect, I'd like to apply for "${job.title}" at ${job.company}.`;
  return `https://wa.me/923244296468?text=${encodeURIComponent(text)}`;
}

function applyMailtoHref(job) {
  const subject = `Application: ${job.title} (${job.company})`;
  const body = `Hi PharmaConnect,\n\nI'd like to apply for the "${job.title}" role at ${job.company}. Please find my CV attached.\n\nThanks.`;
  return `mailto:info@pharmaconnect-pakistan.com?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
}

const SNAPSHOT_ICONS = {
  workType: "work",
  sector: "biotech",
  qualification: "school",
  experience: "trending_up",
  city: "location_on",
};

export default function JobDetail({ job, related = [] }) {
  const snapshot = [
    job.workType && { label: "Work Model", value: formatEnumLabel(job.workType), icon: SNAPSHOT_ICONS.workType },
    job.sector && { label: "Sector", value: formatEnumLabel(job.sector), icon: SNAPSHOT_ICONS.sector },
    job.qualification && { label: "Qualification", value: job.qualification, icon: SNAPSHOT_ICONS.qualification },
    job.experience && { label: "Experience", value: job.experience, icon: SNAPSHOT_ICONS.experience },
    job.city && { label: "Location", value: job.city, icon: SNAPSHOT_ICONS.city },
  ].filter(Boolean);

  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <section className="w-full bg-surface-card shadow-sm py-space-xl">
        <Container>
          <div className="flex flex-col gap-space-md">
            <Card padding="lg" hoverLift={false} className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-cyan-bright to-berry-accent" />
              <div className="flex flex-col gap-space-md pt-space-xs">
                <div className="flex items-start gap-space-md">
                  <div className="w-14 h-14 rounded-xl bg-surface-container-low flex items-center justify-center text-primary shrink-0">
                    <Icon name="local_hospital" className="text-[30px]" />
                  </div>
                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-space-xs flex-wrap">
                      <h2 className="text-lg font-bold text-navy-surface">{job.company}</h2>
                      <Badge tone="verified" dot={false} uppercase={false}>
                        <Icon name="verified" className="text-[14px]" />
                        Verified Source
                      </Badge>
                    </div>
                    {job.city && (
                      <div className="flex items-center gap-1 text-on-surface-variant text-sm">
                        <Icon name="location_on" className="text-[16px] text-teal-clinical" />
                        {job.city}
                      </div>
                    )}
                  </div>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-navy-surface tracking-tight leading-tight">
                  {job.title}
                </h1>

                <div className="flex flex-wrap items-center gap-space-xs">
                  {job.workType && (
                    <Badge tone="primary" dot={false} uppercase={false}>
                      {formatEnumLabel(job.workType)}
                    </Badge>
                  )}
                  {job.sector && (
                    <Badge tone="neutral" dot={false} uppercase={false}>
                      {formatEnumLabel(job.sector)}
                    </Badge>
                  )}
                  {job.qualification && (
                    <Badge tone="neutral" dot={false} uppercase={false}>
                      {job.qualification}
                    </Badge>
                  )}
                  {job.experience && (
                    <Badge tone="neutral" dot={false} uppercase={false}>
                      {job.experience}
                    </Badge>
                  )}
                </div>

                {job.createdAt && (
                  <div className="flex items-center gap-1 text-on-surface-variant text-sm">
                    <Icon name="schedule" className="text-[16px] text-teal-clinical" />
                    Posted {daysAgo(job.createdAt)}
                  </div>
                )}

                <div className="flex items-start gap-space-sm p-space-sm rounded-lg bg-surface-container-low">
                  <Icon name="verified_user" className="text-teal-clinical text-[20px] shrink-0 mt-0.5" />
                  <p className="text-sm text-on-surface-variant leading-snug">
                    <strong className="text-navy-surface">Verified Listing —</strong>{" "}
                    reviewed for HR legitimacy before publishing. Free to apply, no
                    recruitment fees.
                  </p>
                </div>

               
              </div>
            </Card>
          </div>
        </Container>
      </section>

      {/* Description & sidebar */}
      <section className="w-full py-space-xl">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-2xl items-start">
            <article className="lg:col-span-8 flex flex-col gap-space-lg min-w-0">
              <Card padding="lg" hoverLift={false} className="flex flex-col gap-space-md">
                <h3 className="text-lg font-bold text-navy-surface">Job Description</h3>
                <div
                  className={PROSE_CLASSES}
                  dangerouslySetInnerHTML={{ __html: job.jobDescription ?? "" }}
                />
              </Card>
            </article>

            <aside className="lg:col-span-4 flex flex-col gap-space-lg lg:sticky lg:top-24">
              <Card padding="lg" hoverLift={false} className="flex flex-col gap-space-sm">
                <h4 className="text-base font-bold text-navy-surface">Opportunity Snapshot</h4>
                <div className="flex flex-col gap-1">
                  {snapshot.map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between text-sm py-1 border-b border-border-subtle last:border-0"
                    >
                      <span className="text-on-surface-variant flex items-center gap-1.5">
                        <Icon name={row.icon} className="text-[16px] text-outline" />
                        {row.label}
                      </span>
                      <span className="font-semibold text-navy-surface text-right">
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
               
              </Card>

              <Card padding="lg" hoverLift={false} className="flex items-center gap-space-sm bg-gradient-to-br from-verified-green/10 via-surface-card to-surface-card">
                <div className="w-11 h-11 rounded-full bg-verified-green/10 text-verified-green flex items-center justify-center shrink-0">
                  <Icon name="verified" className="text-[24px]" />
                </div>
                <div>
                  <span className="text-sm font-bold text-navy-surface block">
                    Authenticated Listing
                  </span>
                  <span className="text-xs text-on-surface-variant leading-tight">
                    Every listing shown is reviewed before it&apos;s published.
                  </span>
                </div>
              </Card>

              <Card padding="lg" hoverLift={false} className="flex flex-col gap-space-sm">
                <div className="flex items-center gap-space-xs text-teal-clinical">
                  <Icon name="groups" className="text-[22px]" />
                  <h4 className="text-base font-bold text-navy-surface">
                    Get Verified Job Alerts
                  </h4>
                </div>
                <p className="text-sm text-on-surface-variant">
                  Join 18,500+ Pharm-D graduates receiving verified job circulars on
                  WhatsApp as soon as hospitals and employers publish them.
                </p>
                <Button href="https://wa.me/923244296468" target="_blank" variant="solidDark" icon="chat" fullWidth>
                  Join WhatsApp Alerts
                </Button>
              </Card>

              {related.length > 0 && (
                <Card padding="lg" hoverLift={false} className="flex flex-col gap-space-md">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-navy-surface">
                      Related Roles
                    </h4>
                    <Link href="/jobs" className="text-xs font-semibold text-primary hover:underline">
                      View All
                    </Link>
                  </div>
                  <div className="flex flex-col gap-space-sm">
                    {related.map((item) => (
                      <Link
                        key={item.id}
                        href={`/jobs/${item.id}`}
                        className="p-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col gap-1"
                      >
                        <span className="text-xs font-bold text-primary">{item.company}</span>
                        <span className="text-sm font-bold text-navy-surface line-clamp-2">
                          {item.title}
                        </span>
                        <span className="text-xs text-on-surface-variant flex items-center gap-1">
                          <Icon name="location_on" className="text-[14px]" />
                          {item.city}
                        </span>
                      </Link>
                    ))}
                  </div>
                </Card>
              )}
            </aside>
          </div>
        </Container>
      </section>

      {/* Institutional recruitment CTA */}
      <section className="w-full pb-space-3xl">
        <Container>
          <div className="rounded-3xl bg-navy-surface text-on-primary p-space-xl sm:p-space-2xl flex flex-col md:flex-row items-center justify-between gap-space-xl">
            <div className="flex flex-col gap-space-xs max-w-2xl text-center md:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-bright">
                Institutional Recruitment Network
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Have a Pharmacy Vacancy at Your Healthcare Center?
              </h2>
              <p className="text-white/70">
                Reach verified Pharm-D candidates, clinical specialists, and industrial
                professionals directly through PharmaConnect.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-space-sm shrink-0">
              <Button href="/contactus" variant="primary" icon="add_circle">
                Post an Authenticated Listing
              </Button>
              <Button href="/contactus" variant="dark">
                Employer Solutions
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
