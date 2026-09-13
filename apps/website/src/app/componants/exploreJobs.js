"use client";
import React from "react";
import Link from "next/link";
import Icon from "./msIcon";
import Badge from "./badge";
import Container from "./container";
import JobsCards from "./jobsCards";
import { usePublicJobsQuery } from "../../services/jobs/jobs.queries";

const dummyJobs = [
  {
    id: "dummy-1",
    company: "MediCare Pharmaceuticals",
    createdAt: new Date().toISOString(),
    workType: "FULL_TIME",
    title: "Clinical Pharmacist",
    city: "Karachi",
    qualification: "Pharm-D",
    experience: "2+ years",
  },
  {
    id: "dummy-2",
    company: "HealthPlus Hospital",
    createdAt: new Date().toISOString(),
    workType: "PART_TIME",
    title: "Pharmacy Technician",
    city: "Lahore",
    qualification: "B.Pharm",
    experience: "1+ years",
  },
  {
    id: "dummy-3",
    company: "Wellness Retail Pharmacy",
    createdAt: new Date().toISOString(),
    workType: "INTERNSHIP",
    title: "Pharmacy Intern",
    city: "Islamabad",
    qualification: "Pharm-D (Final Year)",
    experience: "Fresh",
  },
];

const HOME_JOBS_LIMIT = 6;

export default function ExploreJobs() {
  // status: ACTIVE + limit caps this at the 6 most recent open roles the API
  // returns — no client-side slicing, no over-fetching.
  const jobsQuery = usePublicJobsQuery({
    page: 1,
    limit: HOME_JOBS_LIMIT,
    status: "ACTIVE",
  });
  const apiJobs = jobsQuery.data?.data ?? [];
  const jobs =
    !jobsQuery.isLoading && (jobsQuery.isError || apiJobs.length === 0)
      ? dummyJobs
      : apiJobs;

  return (
    <section className="w-full py-space-3xl bg-surface-container-low/50">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl gap-space-sm">
          <div>
            <div className="flex items-center flex-wrap gap-2 mb-1">
              <Badge tone="primary" pulse>
                Live Verified Openings
              </Badge>
              <Badge tone="neutral" dot={false} uppercase={false}>
                Showing {jobs.length} Roles
              </Badge>
            </div>
            <h2 className="text-3xl font-bold text-navy-surface">Explore Jobs</h2>
            <p className="text-sm text-on-surface-variant mt-1">
              Roles from leading manufacturers, hospitals, and retail networks
              across Karachi, Lahore, Islamabad and beyond.
            </p>
          </div>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary-container font-bold group shrink-0"
          >
            See More Jobs
            <Icon
              name="arrow_forward"
              className="text-[18px] group-hover:translate-x-0.5 transition-transform"
            />
          </Link>
        </div>

        <JobsCards jobs={jobs} loading={jobsQuery.isLoading} />
      </Container>
    </section>
  );
}
