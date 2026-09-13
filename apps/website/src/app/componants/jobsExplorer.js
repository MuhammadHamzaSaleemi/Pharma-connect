"use client";
import React, { useEffect, useMemo, useState } from "react";
import Icon from "./msIcon";
import Badge from "./badge";
import Button from "./button";
import Card from "./card";
import Container from "./container";
import JobsCards from "./jobsCards";
import { COUNTRY_OPTIONS, cityOptionsFor } from "../../lib/countryCities";
import { EXPERIENCE_OPTIONS, experienceMatches } from "../../lib/experience";
import { enumToOptions } from "../../lib/enumOptions";
import { SECTOR_VALUES, WORK_TYPE_VALUES } from "../../services/jobs/jobs.types";
import "../assets/css/tailwind.css";

const PAGE_SIZE = 9;
const SECTOR_OPTIONS = enumToOptions(SECTOR_VALUES);
const WORK_TYPE_OPTIONS = enumToOptions(WORK_TYPE_VALUES);
// Free-text field — matched by substring rather than an exact enum, same way
// the city filter already handles Job.city.
const QUALIFICATION_KEYWORDS = ["Pharm-D", "MBA", "M.Phil", "MSc", "B.Sc", "BS"];
// Curated real sectors/work types for the one-tap quick pills under the
// search bar. Every count here comes from the actual dataset — no invented
// numbers for facets the schema doesn't have (employment type, salary bands).
const QUICK_TAGS = [
  { label: "Hospital Pharmacy", type: "sector", value: "HOSPITAL_PHARMACY" },
  { label: "Regulatory Affairs", type: "sector", value: "REGULATORY_AFFAIRS" },
  { label: "Community Pharmacy", type: "sector", value: "COMMUNITY_PHARMACY" },
  { label: "Remote / Hybrid", type: "workType", values: ["REMOTE", "HYBRID"] },
];

function toggleValue(list, value) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function getPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = [1];
  if (current > 3) pages.push("...");
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
    pages.push(p);
  }
  if (current < total - 2) pages.push("...");
  pages.push(total);
  return pages;
}

function FacetCheckbox({ label, count, checked, onChange }) {
  return (
    <label className="flex items-center justify-between gap-space-sm cursor-pointer text-sm text-on-surface-variant hover:text-navy-surface">
      <span className="flex items-center gap-space-xs">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="w-4 h-4 rounded-sm accent-primary"
        />
        {label}
      </span>
      {count != null && (
        <span className="text-xs bg-surface-container-low px-2 py-0.5 rounded-full text-on-surface-variant">
          {count}
        </span>
      )}
    </label>
  );
}

export default function JobsExplorer({ jobs }) {
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [sector, setSector] = useState("");
  const [workTypes, setWorkTypes] = useState([]);
  const [experienceBands, setExperienceBands] = useState([]);
  const [qualifications, setQualifications] = useState([]);
  const [sort, setSort] = useState("recent");
  const [page, setPage] = useState(1);

  const cityOptions = useMemo(() => cityOptionsFor(country), [country]);

  const filtered = useMemo(() => {
    const searchNeedle = search.trim().toLowerCase();
    const cityNeedle = city.trim().toLowerCase();
    const countryCities = cityOptions.map((o) => o.value.toLowerCase());

    return jobs.filter((job) => {
      if (searchNeedle) {
        const haystack = `${job.title} ${job.company}`.toLowerCase();
        if (!haystack.includes(searchNeedle)) return false;
      }
      const jobCity = (job.city ?? "").toLowerCase();
      if (cityNeedle) {
        if (!jobCity.includes(cityNeedle)) return false;
      } else if (countryCities.length && !countryCities.includes(jobCity)) {
        return false;
      }
      if (sector && job.sector !== sector) return false;
      if (workTypes.length && !workTypes.includes(job.workType)) return false;
      if (
        experienceBands.length &&
        !experienceBands.some((band) => experienceMatches(job.experience, band))
      ) {
        return false;
      }
      if (qualifications.length) {
        const q = (job.qualification ?? "").toLowerCase();
        if (!qualifications.some((k) => q.includes(k.toLowerCase()))) return false;
      }
      return true;
    });
  }, [jobs, search, city, cityOptions, sector, workTypes, experienceBands, qualifications]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sort === "company") {
      arr.sort((a, b) => a.company.localeCompare(b.company));
    } else {
      arr.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return arr;
  }, [filtered, sort]);

  useEffect(() => {
    setPage(1);
  }, [search, country, city, sector, workTypes, experienceBands, qualifications, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageJobs = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const workTypeCounts = useMemo(() => {
    const counts = {};
    WORK_TYPE_VALUES.forEach((v) => {
      counts[v] = jobs.filter((j) => j.workType === v).length;
    });
    return counts;
  }, [jobs]);

  const experienceCounts = useMemo(() => {
    const counts = {};
    EXPERIENCE_OPTIONS.forEach((o) => {
      counts[o.value] = jobs.filter((j) => experienceMatches(j.experience, o.value)).length;
    });
    return counts;
  }, [jobs]);

  const qualificationCounts = useMemo(() => {
    const counts = {};
    QUALIFICATION_KEYWORDS.forEach((k) => {
      counts[k] = jobs.filter((j) => (j.qualification ?? "").toLowerCase().includes(k.toLowerCase()))
        .length;
    });
    return counts;
  }, [jobs]);

  const quickTagCounts = useMemo(() => {
    return QUICK_TAGS.map((tag) => ({
      ...tag,
      count:
        tag.type === "sector"
          ? jobs.filter((j) => j.sector === tag.value).length
          : jobs.filter((j) => tag.values.includes(j.workType)).length,
    }));
  }, [jobs]);

  function resetAll() {
    setSearch("");
    setCountry("");
    setCity("");
    setSector("");
    setWorkTypes([]);
    setExperienceBands([]);
    setQualifications([]);
    setSort("recent");
  }

  function applyQuickTag(tag) {
    resetAll();
    if (tag.type === "sector") setSector(tag.value);
    else setWorkTypes(tag.values);
  }

  const hasActiveFilters =
    search || country || city || sector || workTypes.length || experienceBands.length || qualifications.length;

  return (
    <>
      {/* SEARCH HERO */}
      <section className="w-full bg-surface-card shadow-sm py-space-xl">
        <Container>
          <div className="max-w-3xl mb-space-lg">
            <Badge tone="primary" pulse className="mb-space-sm">
              Live Healthcare Registry · Pakistan &amp; Gulf
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-navy-surface tracking-tight mb-space-xs">
              Find Verified <span className="text-primary">Pharmacy</span> Jobs
            </h1>
            <p className="text-base text-on-surface-variant leading-relaxed">
              Browse {jobs.length}+ authenticated roles across pharmaceutical
              manufacturing, tertiary hospitals, clinical trials, community
              chains, and regulatory bodies in Pakistan and abroad.
            </p>
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="bg-surface-container-low rounded-xl shadow-sm p-space-sm md:p-space-md"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-space-sm items-center">
              <div className="lg:col-span-4 relative flex items-center">
                <Icon
                  name="search"
                  className="absolute left-3 text-outline pointer-events-none text-[20px]"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Job title, company, or specialty..."
                  className="w-full pl-11 pr-space-md py-3 bg-surface-card rounded-lg border-0 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <div className="lg:col-span-3 relative flex items-center">
                <Icon
                  name="location_on"
                  className="absolute left-3 text-outline pointer-events-none text-[20px]"
                />
                <select
                  value={country}
                  onChange={(e) => {
                    setCountry(e.target.value);
                    setCity("");
                  }}
                  className="w-full pl-11 pr-space-md py-3 bg-surface-card rounded-lg border-0 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                >
                  <option value="">All Pakistan &amp; Gulf (Any)</option>
                  {COUNTRY_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <Icon
                  name="expand_more"
                  className="absolute right-3 text-outline pointer-events-none text-[18px]"
                />
              </div>

              <div className="lg:col-span-3 relative flex items-center">
                <Icon
                  name="biotech"
                  className="absolute left-3 text-outline pointer-events-none text-[20px]"
                />
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full pl-11 pr-space-md py-3 bg-surface-card rounded-lg border-0 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                >
                  <option value="">All Sectors / Functions</option>
                  {SECTOR_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <Icon
                  name="expand_more"
                  className="absolute right-3 text-outline pointer-events-none text-[18px]"
                />
              </div>

              <div className="lg:col-span-2">
                <Button type="submit" icon="filter_list" fullWidth className="border-0">
                  Search Jobs
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
                All ({jobs.length})
              </button>
              {quickTagCounts.map((tag) => (
                <button
                  key={tag.label}
                  type="button"
                  onClick={() => applyQuickTag(tag)}
                  className="px-3 py-1 rounded-full border-0 text-xs font-medium bg-surface-container text-on-surface-variant hover:bg-secondary-container transition-colors"
                >
                  {tag.label} ({tag.count})
                </button>
              ))}
            </div>
          </form>
        </Container>
      </section>

      {/* RESULTS */}
      <section className="w-full py-space-2xl">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
            {/* FILTER SIDEBAR */}
            <aside className="lg:col-span-4 xl:col-span-3">
              <Card hoverLift={false} className="space-y-space-lg lg:sticky lg:top-24">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Icon name="tune" className="text-primary text-[20px]" />
                    <span className="font-bold text-navy-surface">Filters</span>
                  </div>
                  <Button
                    type="button"
                    onClick={resetAll}
                    className="border-0"
                    disabled={!hasActiveFilters}
                  >
                    Reset All
                  </Button>
                </div>

                <div className="bg-surface-container-low rounded-lg p-space-sm flex items-center gap-space-xs">
                  <div className="w-8 h-8 rounded-full bg-verified-green/10 flex items-center justify-center text-verified-green shrink-0">
                    <Icon name="verified" className="text-[18px]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-navy-surface">
                      Pharm-D Verified
                    </span>
                    <span className="text-xs text-on-surface-variant">
                      Every listing shown is authenticated
                    </span>
                  </div>
                </div>

                <div>
                  <h6 className="text-[11px] font-bold uppercase tracking-widest text-navy-surface mb-space-sm">
                    Work Model
                  </h6>
                  <div className="flex flex-col gap-space-xs">
                    {WORK_TYPE_OPTIONS.map((o) => (
                      <FacetCheckbox
                        key={o.value}
                        label={o.label}
                        count={workTypeCounts[o.value]}
                        checked={workTypes.includes(o.value)}
                        onChange={() => setWorkTypes((prev) => toggleValue(prev, o.value))}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h6 className="text-[11px] font-bold uppercase tracking-widest text-navy-surface mb-space-sm">
                    Experience Level
                  </h6>
                  <div className="flex flex-col gap-space-xs">
                    {EXPERIENCE_OPTIONS.map((o) => (
                      <FacetCheckbox
                        key={o.value}
                        label={o.label}
                        count={experienceCounts[o.value]}
                        checked={experienceBands.includes(o.value)}
                        onChange={() =>
                          setExperienceBands((prev) => toggleValue(prev, o.value))
                        }
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h6 className="text-[11px] font-bold uppercase tracking-widest text-navy-surface mb-space-sm">
                    Required Qualification
                  </h6>
                  <div className="flex flex-col gap-space-xs">
                    {QUALIFICATION_KEYWORDS.map((k) => (
                      <FacetCheckbox
                        key={k}
                        label={k}
                        count={qualificationCounts[k]}
                        checked={qualifications.includes(k)}
                        onChange={() =>
                          setQualifications((prev) => toggleValue(prev, k))
                        }
                      />
                    ))}
                  </div>
                </div>

                <div className="rounded-xl bg-navy-deep text-white p-space-md">
                  <span className="text-[11px] uppercase tracking-wider text-cyan-bright font-bold">
                    Authentic Directory
                  </span>
                  <p className="font-bold leading-snug mt-1">
                    Paperless DRAP &amp; Hospital Sourcing
                  </p>
                  <p className="text-xs text-white/60 mt-1">
                    Every vacancy is manually cross-checked with hospital
                    boards and manufacturing directories.
                  </p>
                </div>
              </Card>
            </aside>

            {/* RESULTS STREAM */}
            <div className="lg:col-span-8 xl:col-span-9 space-y-space-md">
              <Card padding="md" hoverLift={false} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm">
                <div>
                  <h2 className="font-extrabold text-navy-surface">
                    Showing <span className="text-primary">{sorted.length}</span>{" "}
                    verified pharmacy vacancies
                  </h2>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Sourced directly from hospital boards, manufacturers, and
                    verified recruiters
                  </p>
                </div>
                <div className="flex items-center gap-space-xs shrink-0">
                  <span className="text-[11px] text-outline uppercase tracking-wider">
                    Sort:
                  </span>
                  <div className="relative">
                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                      className="pl-space-sm pr-8 py-1.5 bg-surface-container-low text-sm text-navy-surface rounded-lg focus:outline-none cursor-pointer appearance-none"
                    >
                      <option value="recent">Most Recent</option>
                      <option value="company">Company A–Z</option>
                    </select>
                    <Icon
                      name="expand_more"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[16px]"
                    />
                  </div>
                </div>
              </Card>

              <JobsCards jobs={pageJobs} />

              {totalPages > 1 && (
                <div className="pt-space-lg flex flex-col sm:flex-row items-center justify-between gap-space-md">
                  <p className="text-xs text-on-surface-variant text-center sm:text-left">
                    Showing page <span className="font-bold text-navy-surface">{currentPage}</span>{" "}
                    of <span className="font-bold text-navy-surface">{totalPages}</span> (
                    {sorted.length} results)
                  </p>
                  <nav className="flex items-center gap-1 text-sm">
                    <button
                      type="button"
                      disabled={currentPage <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="w-9 h-9 flex items-center justify-center rounded-lg bg-surface-card border border-border-subtle text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-40 disabled:pointer-events-none"
                      aria-label="Previous page"
                    >
                      <Icon name="chevron_left" className="text-[18px]" />
                    </button>
                    {getPageNumbers(currentPage, totalPages).map((p, i) =>
                      p === "..." ? (
                        <span key={`ellipsis-${i}`} className="w-8 text-center text-outline">
                          ...
                        </span>
                      ) : (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPage(p)}
                          className={`w-9 h-9 flex items-center justify-center rounded-lg font-bold transition-colors ${
                            p === currentPage
                              ? "bg-primary text-on-primary border-0"
                              : "bg-surface-card border border-border-subtle text-on-surface-variant hover:bg-surface-container-low"
                          }`}
                        >
                          {p}
                        </button>
                      ),
                    )}
                    <button
                      type="button"
                      disabled={currentPage >= totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className="w-9 h-9 flex items-center justify-center rounded-lg bg-surface-card border border-border-subtle text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-40 disabled:pointer-events-none"
                      aria-label="Next page"
                    >
                      <Icon name="chevron_right" className="text-[18px]" />
                    </button>
                  </nav>
                </div>
              )}

              {/* PROMO BAND */}
              <div className="rounded-2xl bg-navy-deep text-white p-space-lg flex flex-col sm:flex-row items-center justify-between gap-space-md mt-space-lg">
                <div className="flex items-center gap-space-sm">
                  <div className="w-11 h-11 rounded-xl bg-verified-green/15 text-verified-green flex items-center justify-center shrink-0">
                    <Icon name="chat" className="text-[22px]" />
                  </div>
                  <div>
                    <Badge tone="dark" dot={false} className="mb-1">
                      Fast Community Dispatch
                    </Badge>
                    <p className="font-bold">Don&apos;t see your desired vacancy?</p>
                    <p className="text-sm text-white/60">
                      Join 18,500+ Pharm-D graduates receiving verified job
                      circulars directly on WhatsApp as soon as hospital HR
                      departments publish them.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-space-sm shrink-0">
                  <Button
                    href="https://wa.me/923244296468"
                    target="_blank"
                    variant="solidDark"
                    icon="chat"
                  >
                    Join Free WhatsApp Alerts
                  </Button>
                  <Button href="/contactus" variant="dark">
                    Employer? Post a Role
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
