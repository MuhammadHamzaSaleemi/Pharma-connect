import React from "react";
import Link from "next/link";
import Icon from "./msIcon";
import Badge from "./badge";
import Container from "./container";
import JobsCards from "./jobsCards";

// Homepage section. Jobs are fetched server-side by the page so the listings
// (and their links) are in the initial HTML for crawlers.
export default function ExploreJobs({ jobs = [] }) {
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

        <JobsCards jobs={jobs} />
      </Container>
    </section>
  );
}
