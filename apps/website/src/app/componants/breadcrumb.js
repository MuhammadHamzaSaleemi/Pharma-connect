"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "./msIcon";
import Container from "./container";

// Friendly labels for known top-level routes. Unlisted segments (dynamic
// [id] params) fall back to a humanized version of the URL segment, so a
// page with a real title (job/blog detail) should pass `items` instead.
const ROUTE_LABELS = {
  jobs: "Find Jobs",
  blogs: "Blogs",
  aboutus: "About Us",
  contactus: "Contact Us",
};

function humanize(segment) {
  return decodeURIComponent(segment)
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function trailFromPathname(pathname) {
  const segments = pathname.split("/").filter(Boolean);
  return segments.map((segment, i) => ({
    label: ROUTE_LABELS[segment] || humanize(segment),
    href: i < segments.length - 1 ? `/${segments.slice(0, i + 1).join("/")}` : undefined,
  }));
}

// One consistent "Home / Parent / Current" trail for every page. Auto-derives
// the trail from the route when no `items` are given; pass `items` (an array
// of { label, href? }, href omitted on the current/last item) when a segment
// needs a label the URL can't provide, e.g. a job or blog title on a
// dynamic [id] route.
export default function Breadcrumb({ items }) {
  const pathname = usePathname();
  const trail = items ?? trailFromPathname(pathname);

  if (trail.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="w-full bg-white pt-5">
      <Container>
        <ol className="list-none m-0 p-0 flex items-center gap-space-xs py-space-sm text-sm font-semibold text-on-surface-variant">
          <li className="shrink-0">
            <Link href="/" className="flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors">
              <Icon name="home" className="text-[16px]" />
              Home
            </Link>
          </li>
          {trail.map((item, i) => (
            <li
              key={`${item.label}-${i}`}
              className={`flex items-center gap-space-xs ${i === trail.length - 1 ? "min-w-0" : "shrink-0"}`}
            >
              <Icon name="chevron_right" className="text-[14px] shrink-0 opacity-70" />
              {item.href ? (
                <Link href={item.href} className="text-on-surface-variant hover:text-primary transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-primary font-bold truncate" aria-current="page">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </Container>
    </nav>
  );
}
