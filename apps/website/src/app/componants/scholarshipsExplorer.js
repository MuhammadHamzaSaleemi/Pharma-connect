"use client";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Icon from "./msIcon";
import Badge from "./badge";
import Button from "./button";
import Card from "./card";
import Container from "./container";
import Pagination from "./pagination";
import StateMessage from "./stateMessage";
import { FacetCheckbox, toggleValue } from "./jobsExplorer";
import { formatDate } from "./blogCard";
import { PROSE_CLASSES } from "./blogDetail";
import "../assets/css/tailwind.css";

const PAGE_SIZE = 8;
const CLOSING_SOON_DAYS = 45;
const DAY_MS = 1000 * 60 * 60 * 24;

function daysUntil(dateString) {
  return Math.ceil((new Date(dateString).getTime() - Date.now()) / DAY_MS);
}

function StatTile({ icon, tone, value, label }) {
  return (
    <Card padding="sm" hoverLift={false} className="flex items-center gap-space-md">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${tone}`}>
        <Icon name={icon} className="text-[24px]" />
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-navy-deep leading-none">{value}</span>
        <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mt-1">
          {label}
        </span>
      </div>
    </Card>
  );
}

function ScholarshipCard({ scholarship }) {
  const [open, setOpen] = useState(false);
  const daysLeft = daysUntil(scholarship.endDate);
  const closingSoon = daysLeft <= CLOSING_SOON_DAYS;

  return (
    <Card hoverLift={false} className="flex flex-col gap-space-md group">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
        <div className="flex flex-wrap items-center gap-space-xs">
          <Badge tone="primary" dot={false} uppercase={false}>
            <Icon name="public" className="text-[14px]" />
            {scholarship.country}
          </Badge>
          {closingSoon && (
            <Badge tone="warning" uppercase={false}>
              Closes in {daysLeft} day{daysLeft === 1 ? "" : "s"}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1 text-berry-deep text-xs font-bold">
          <Icon name="schedule" className="text-[16px]" />
          Deadline: {formatDate(scholarship.endDate)}
        </div>
      </div>

      <div className="flex items-center gap-space-md">
        <Image
          src={scholarship.image}
          alt={`${scholarship.country} scholarship`}
          width={80}
          height={80}
          className="w-20 h-20 rounded-xl object-cover shrink-0 bg-surface-container-low"
          loading="lazy"
        />
        <div className="flex flex-col gap-1 min-w-0">
          <h2 className="text-lg font-bold text-navy-deep group-hover:text-primary transition-colors">
            {scholarship.country} Scholarship
          </h2>
          <span className="flex items-center gap-1 text-sm text-on-surface-variant">
            <Icon name="calendar_today" className="text-[16px]" />
            {formatDate(scholarship.startDate)} – {formatDate(scholarship.endDate)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm bg-surface-crisp p-space-sm rounded-lg">
        <div className="flex flex-col min-w-0">
          <span className="text-[11px] text-outline uppercase font-bold tracking-wider">
            Funding Package
          </span>
          {/* Rich-text HTML from the admin editor, see SECURITY.md. */}
          <div
            className={`text-sm font-semibold text-verified-green mt-0.5 [&_*]:m-0 ${open ? "" : "line-clamp-3"}`}
            dangerouslySetInnerHTML={{ __html: scholarship.financialBenefits ?? "" }}
          />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[11px] text-outline uppercase font-bold tracking-wider">
            Eligibility &amp; Credentials
          </span>
          <p className={`text-sm text-on-surface mt-0.5 m-0 whitespace-pre-line ${open ? "" : "line-clamp-3"}`}>
            {scholarship.eligibilityCriteria}
          </p>
        </div>
      </div>

      {open && (
        <div className="border-t border-border-subtle pt-space-md">
          <h3 className="text-sm font-bold uppercase tracking-wider text-navy-deep mb-space-sm">
            How to Apply
          </h3>
          <div
            className={`text-sm ${PROSE_CLASSES}`}
            dangerouslySetInnerHTML={{ __html: scholarship.howToApply ?? "" }}
          />
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-space-sm">
        <Badge tone="verified" dot={false} uppercase={false}>
          <Icon name="verified" className="text-[14px]" />
          Verified Source
        </Badge>
        <Button
          type="button"
          size="sm"
          icon={open ? "expand_less" : "arrow_outward"}
          iconPosition="right"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Hide Details" : "How to Apply"}
        </Button>
      </div>
    </Card>
  );
}

export default function ScholarshipsExplorer({ scholarships }) {
  const [search, setSearch] = useState("");
  const [countries, setCountries] = useState([]);
  const [closingSoonOnly, setClosingSoonOnly] = useState(false);
  const [sort, setSort] = useState("deadline");
  const [page, setPage] = useState(1);

  // Country facet built from the data itself, most listings first.
  const countryCounts = useMemo(() => {
    const counts = {};
    scholarships.forEach((s) => {
      counts[s.country] = (counts[s.country] ?? 0) + 1;
    });
    return Object.entries(counts)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count || a.country.localeCompare(b.country));
  }, [scholarships]);

  const closingSoonCount = useMemo(
    () => scholarships.filter((s) => daysUntil(s.endDate) <= CLOSING_SOON_DAYS).length,
    [scholarships],
  );

  const sorted = useMemo(() => {
    const needle = search.trim().toLowerCase();
    const arr = scholarships.filter((s) => {
      if (needle) {
        const haystack =
          `${s.country} ${s.eligibilityCriteria} ${s.financialBenefits}`.toLowerCase();
        if (!haystack.includes(needle)) return false;
      }
      if (countries.length && !countries.includes(s.country)) return false;
      if (closingSoonOnly && daysUntil(s.endDate) > CLOSING_SOON_DAYS) return false;
      return true;
    });
    if (sort === "recent") {
      arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      arr.sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
    }
    return arr;
  }, [scholarships, search, countries, closingSoonOnly, sort]);

  useEffect(() => {
    setPage(1);
  }, [search, countries, closingSoonOnly, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const hasActiveFilters = search || countries.length || closingSoonOnly;

  function resetAll() {
    setSearch("");
    setCountries([]);
    setClosingSoonOnly(false);
    setSort("deadline");
  }

  const selectClasses =
    "w-full pl-11 pr-space-md py-3 bg-surface-card rounded-lg border-0 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer";

  return (
    <>
      {/* SEARCH HERO */}
      <section className="w-full bg-surface-card shadow-sm py-space-xl">
        <Container>
          <div className="max-w-4xl mb-space-lg">
            <Badge tone="primary" className="mb-space-sm">
              Global &amp; Domestic Academic Opportunities
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-navy-deep tracking-tight mb-space-xs">
              Verified <span className="text-primary">Scholarships</span> &amp; Grants for Pharmacists
            </h1>
            <p className="text-base text-on-surface-variant leading-relaxed">
              Postgraduate scholarships, fellowships, and tuition funding for
              Pharm-D graduates, M.Phil scholars, and clinical researchers in
              Pakistan and abroad.
            </p>
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="bg-surface-container-low rounded-xl shadow-sm p-space-sm md:p-space-md"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-space-sm items-center">
              <div className="lg:col-span-6 relative flex items-center">
                <Icon name="search" className="absolute left-3 text-outline pointer-events-none text-[20px]" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by country, funding, or eligibility..."
                  aria-label="Search scholarships"
                  className="w-full pl-11 pr-space-md py-3 bg-surface-card rounded-lg border-0 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <div className="lg:col-span-4 relative flex items-center">
                <Icon name="public" className="absolute left-3 text-outline pointer-events-none text-[20px]" />
                <select
                  value={countries.length === 1 ? countries[0] : ""}
                  onChange={(e) => setCountries(e.target.value ? [e.target.value] : [])}
                  aria-label="Destination country"
                  className={selectClasses}
                >
                  <option value="">All Destinations</option>
                  {countryCounts.map(({ country }) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
                <Icon name="expand_more" className="absolute right-3 text-outline pointer-events-none text-[18px]" />
              </div>

              <div className="lg:col-span-2 md:col-span-2">
                <Button type="submit" icon="search" fullWidth className="border-0">
                  Search Grants
                </Button>
              </div>
            </div>

            <div className="mt-space-md pt-space-sm flex items-center gap-space-xs flex-wrap">
              <span className="text-[11px] uppercase tracking-wider text-outline mr-1 font-bold">
                Quick Tags:
              </span>
              <button
                type="button"
                onClick={resetAll}
                className={`px-3 py-1 rounded-full border-0 text-xs font-semibold transition-colors ${
                  !hasActiveFilters
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                All Grants ({scholarships.length})
              </button>
              {countryCounts.slice(0, 4).map(({ country, count }) => (
                <button
                  key={country}
                  type="button"
                  onClick={() => {
                    resetAll();
                    setCountries([country]);
                  }}
                  className="px-3 py-1 rounded-full border-0 text-xs font-medium bg-surface-container text-on-surface-variant hover:bg-secondary-container transition-colors"
                >
                  {country} ({count})
                </button>
              ))}
              {closingSoonCount > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    resetAll();
                    setClosingSoonOnly(true);
                  }}
                  className="px-3 py-1 rounded-full border-0 text-xs font-medium bg-surface-container text-on-surface-variant hover:bg-secondary-container transition-colors"
                >
                  Closing Soon ({closingSoonCount})
                </button>
              )}
            </div>
          </form>
        </Container>
      </section>

      {/* METRICS */}
      <section className="w-full bg-surface-container-low py-space-lg">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
            <StatTile icon="verified" tone="bg-primary/10 text-primary" value={scholarships.length} label="Active Grants" />
            <StatTile icon="public" tone="bg-teal-clinical/10 text-teal-clinical" value={countryCounts.length} label="Destination Countries" />
            <StatTile icon="timer" tone="bg-berry-accent/10 text-berry-deep" value={closingSoonCount} label={`Closing in ${CLOSING_SOON_DAYS} days`} />
          </div>
        </Container>
      </section>

      {/* RESULTS */}
      <section className="w-full py-space-2xl">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
            {/* FILTER SIDEBAR */}
            <aside className="lg:col-span-4 xl:col-span-3 flex flex-col gap-space-md lg:sticky lg:top-24">
              <Card hoverLift={false} className="space-y-space-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Icon name="tune" className="text-primary text-[20px]" />
                    <span className="font-bold text-navy-surface">Filters</span>
                  </div>
                  <Button type="button" onClick={resetAll} className="border-0" disabled={!hasActiveFilters}>
                    Reset All
                  </Button>
                </div>

                <label className="bg-surface-container-low rounded-lg p-space-sm flex items-center justify-between gap-space-sm cursor-pointer">
                  <span className="text-sm font-medium text-on-surface">
                    Upcoming deadlines (&lt; {CLOSING_SOON_DAYS} days)
                  </span>
                  <input
                    type="checkbox"
                    checked={closingSoonOnly}
                    onChange={(e) => setClosingSoonOnly(e.target.checked)}
                    className="w-4 h-4 rounded-sm accent-primary"
                  />
                </label>

                {countryCounts.length > 0 && (
                  <div>
                    <h6 className="text-[11px] font-bold uppercase tracking-widest text-navy-surface mb-space-sm">
                      Region &amp; Country
                    </h6>
                    <div className="flex flex-col gap-space-xs">
                      {countryCounts.map(({ country, count }) => (
                        <FacetCheckbox
                          key={country}
                          label={country}
                          count={count}
                          checked={countries.includes(country)}
                          onChange={() => setCountries((prev) => toggleValue(prev, country))}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </Card>

              <div className="rounded-xl bg-surface-container-high p-space-md flex flex-col gap-space-xs">
                <div className="flex items-center gap-space-xs">
                  <Icon name="verified_user" className="text-verified-green text-[22px]" />
                  <span className="font-bold text-navy-deep">Official Direct Track</span>
                </div>
                <p className="text-sm text-on-surface-variant m-0">
                  Apply directly through the official portals. PharmaConnect
                  never charges agency or placement fees.
                </p>
              </div>
            </aside>

            {/* RESULTS STREAM */}
            <div className="lg:col-span-8 xl:col-span-9 space-y-space-md">
              <Card padding="md" hoverLift={false} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm">
                <h2 className="font-extrabold text-navy-surface m-0">
                  Showing <span className="text-primary">{sorted.length}</span> scholarship
                  {sorted.length === 1 ? "" : "s"}
                </h2>
                <div className="flex items-center gap-space-xs shrink-0">
                  <span className="text-[11px] text-outline uppercase tracking-wider">Sort:</span>
                  <div className="relative">
                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                      aria-label="Sort scholarships"
                      className="pl-space-sm pr-8 py-1.5 bg-surface-container-low text-sm text-navy-surface rounded-lg focus:outline-none cursor-pointer appearance-none"
                    >
                      <option value="deadline">Deadline (Nearest First)</option>
                      <option value="recent">Most Recent</option>
                    </select>
                    <Icon name="expand_more" className="absolute right-2 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[16px]" />
                  </div>
                </div>
              </Card>

              {pageItems.length === 0 ? (
                <StateMessage icon="search_off">No scholarships match your filters.</StateMessage>
              ) : (
                pageItems.map((s) => <ScholarshipCard key={s.id} scholarship={s} />)
              )}

              <Pagination
                page={currentPage}
                totalPages={totalPages}
                totalResults={sorted.length}
                onChange={setPage}
              />

              {/* GUIDANCE BAND */}
              <div className="rounded-2xl bg-navy-deep text-white p-space-lg flex flex-col sm:flex-row items-center justify-between gap-space-md mt-space-lg">
                <div className="flex items-center gap-space-sm">
                  <div className="w-11 h-11 rounded-xl bg-verified-green/15 text-verified-green flex items-center justify-center shrink-0">
                    <Icon name="school" className="text-[22px]" />
                  </div>
                  <div>
                    <Badge tone="dark" dot={false} className="mb-1">
                      Mentorship &amp; Peer SOP Review
                    </Badge>
                    <p className="font-bold m-0">Need guidance on your application or SOP?</p>
                    <p className="text-sm text-white/60 m-0">
                      Connect with Pharm-D alumni who have been through
                      Commonwealth, Fulbright, and Erasmus applications.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-space-sm shrink-0">
                  <Button href="https://wa.me/923244296468" target="_blank" variant="solidDark" icon="chat">
                    Join WhatsApp Group
                  </Button>
                  <Button href="/contactus" variant="dark">
                    Contact Us
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
