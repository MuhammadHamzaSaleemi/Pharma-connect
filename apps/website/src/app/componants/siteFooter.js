import React from "react";
import Link from "next/link";
import Image from "next/image";
import Icon from "./msIcon";
import Badge from "./badge";
import Container from "./container";

const FOOTER_COLUMNS = [
  {
    title: "Explore Careers",
    links: [
      { label: "Find Jobs", href: "/jobs" },
      { label: "Scholarships", href: "/jobs" },
      { label: "Internships", href: "/jobs" },
      { label: "Top Employers", href: "/jobs" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/aboutus" },
      { label: "Editorial Team", href: "/aboutus" },
      { label: "DRAP Guidelines", href: "/blogs" },
      { label: "Contact Us", href: "/contactus" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/privacy" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="w-full bg-surface border-t border-border-subtle">
      <Container className="py-space-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-xl">
          <div>
            <div className="flex items-center gap-space-sm">
              <Image
                src="/images/logo.png"
                width={130}
                height={32}
                className="h-8 w-auto object-contain"
                alt="PharmaConnect"
              />
              <span className="text-lg font-extrabold text-navy-surface">
                PharmaConnect
              </span>
            </div>
            <p className="text-sm text-on-surface-variant mt-space-md max-w-xs">
              The premier dedicated network connecting pharmacists, clinical
              researchers, and healthcare professionals with verified career
              opportunities across Pakistan and abroad.
            </p>
            <div className="flex items-center gap-space-sm mt-space-md">
              <Link
                href="https://www.linkedin.com/company/pharmaconnect-pakistan/"
                target="_blank"
                className="w-9 h-9 rounded-full bg-surface-container-low text-primary hover:bg-primary hover:text-on-primary flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                aria-label="LinkedIn"
              >
                <Icon name="share" className="text-[18px]" />
              </Link>
              <Link
                href="https://wa.me/923244296468"
                target="_blank"
                className="w-9 h-9 rounded-full bg-surface-container-low text-primary hover:bg-primary hover:text-on-primary flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                aria-label="WhatsApp"
              >
                <Icon name="chat" className="text-[18px]" />
              </Link>
              <span className="w-9 h-9 rounded-full bg-surface-container-low text-verified-green flex items-center justify-center">
                <Icon name="verified" className="text-[18px]" />
              </span>
            </div>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-navy-surface mb-space-md">
                {col.title}
              </h4>
              <ul className="flex flex-col gap-space-sm">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-on-surface-variant hover:text-primary transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-space-2xl pt-space-lg border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-space-sm">
          <p className="text-xs text-on-surface-variant">
            © {new Date().getFullYear()}, PharmaConnect Pakistan. All Rights
            Reserved.
          </p>
          <Badge tone="verified">Pharm-D Verified Network</Badge>
        </div>
      </Container>
    </footer>
  );
}
