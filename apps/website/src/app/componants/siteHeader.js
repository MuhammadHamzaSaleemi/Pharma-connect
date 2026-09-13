"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Icon from "./msIcon";
import Container from "./container";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Find Jobs", href: "/jobs" },
  { label: "About", href: "/aboutus" },
  { label: "Blogs", href: "/blogs" },
  { label: "Contact Us", href: "/contactus" },
];

// "/" only matches the homepage itself; every other link also covers its
// detail/sub-pages (e.g. /jobs/[id] or /blogs/[id] keep Jobs/Blogs active).
function isActive(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-surface-card/95 backdrop-blur-md shadow-[0_1px_8px_rgba(15,23,42,0.06)] border-b border-border-subtle/50">
      <Container className="h-20 flex items-center justify-between gap-space-md">
        <Link href="/" className="flex items-center gap-space-sm">
          <Image
            src="/images/logo.png"
            width={100}
            height={40}
            alt="PharmaConnect"
          />
        </Link>

        <nav className="hidden xl:flex items-center gap-space-lg text-sm font-semibold">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              aria-current={isActive(pathname, l.href) ? "page" : undefined}
              className={
                isActive(pathname, l.href)
                  ? "py-space-xs text-primary font-bold border-b-2 border-primary"
                  : "py-space-xs text-on-surface-variant hover:text-primary transition-colors"
              }
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="xl:hidden w-10 h-10 rounded-lg flex items-center justify-center text-navy-surface hover:bg-surface-container-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <Icon name={open ? "close" : "menu"} className="text-[24px]" />
        </button>
      </Container>

      {open && (
        <nav className="xl:hidden border-t border-border-subtle/50 bg-surface-card px-6 sm:px-12 py-space-sm flex flex-col">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              aria-current={isActive(pathname, l.href) ? "page" : undefined}
              className={
                isActive(pathname, l.href)
                  ? "py-space-sm text-sm font-bold text-primary"
                  : "py-space-sm text-sm font-semibold text-on-surface-variant hover:text-primary"
              }
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
