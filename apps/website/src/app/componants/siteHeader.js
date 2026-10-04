"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Container from "./container";
import Button from "./button";
import Icon from "./msIcon";
// Every Tailwind page renders this header; without this, a direct load of a
// page whose components don't import it (e.g. /contactus) gets no utilities.
import "../assets/css/tailwind.css";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Find Jobs", href: "/jobs" },
  { label: "About", href: "/aboutus" },
  { label: "Blogs", href: "/blogs" },
  { label: "Contact Us", href: "/contactus" },
];

// Same CTAs the homepage hero and community band already use.
const WHATSAPP_URL = "https://wa.me/923244296468";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2";

// "/" only matches the homepage itself; every other link also covers its
// detail/sub-pages (e.g. /jobs/[id] or /blogs/[id] keep Jobs/Blogs active).
function isActive(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const menuButtonRef = useRef(null);

  // Lift the header off the page (shadow) only once content scrolls under it.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape closes the mobile menu and returns focus to its button.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      menuButtonRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const raised = scrolled || open;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 backdrop-blur-md transition-[background-color,box-shadow] duration-300 ease-out motion-reduce:transition-none ${
        raised
          ? "bg-surface-card/95 shadow-[0_6px_24px_-12px_rgba(15,23,42,0.18)]"
          : "bg-surface-card/80 shadow-[0_1px_0_rgba(15,23,42,0.05)]"
      }`}
    >
      <Container className="h-20 flex items-center gap-space-lg">
        <Link
          href="/"
          aria-label="PharmaConnect home"
          className={`shrink-0 flex items-center rounded-lg transition-opacity hover:opacity-80 ${FOCUS_RING}`}
        >
          <Image src="/images/logo.png" width={100} height={40} alt="PharmaConnect" priority />
        </Link>

        {/* Desktop links */}
        <nav aria-label="Main" className="hidden lg:flex flex-1 items-center justify-center gap-1">
          {NAV_LINKS.map((l) => {
            const active = isActive(pathname, l.href);
            return (
              <Link
                key={l.label}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`px-3.5 py-2 rounded-full text-sm no-underline whitespace-nowrap transition-colors duration-200 ${FOCUS_RING} ${
                  active
                    ? "font-bold text-primary bg-primary/10"
                    : "font-semibold text-on-surface-variant hover:text-primary hover:bg-surface-container-low"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop actions */}
        <div className="hidden lg:flex shrink-0 items-center gap-space-xs">
          <Button href="/contactus" variant="ghost" className="hidden xl:inline-flex no-underline hover:bg-surface-container-low">
            <Icon name="add_circle" className="text-[18px] text-teal-clinical" />
            Post Opportunity
          </Button>
          <Button
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            icon="chat"
            className="no-underline hover:-translate-y-px"
          >
            Job Alerts
          </Button>
        </div>

        {/* Mobile menu button: borderless, blue, bars fold into an X.
            border-0/bg-transparent are explicit: preflight is off, so the
            browser's default button border would otherwise show. */}
        <button
          ref={menuButtonRef}
          type="button"
          className={`lg:hidden ml-auto relative w-11 h-11 shrink-0 rounded-xl border-0 bg-transparent text-primary cursor-pointer transition-[background-color,transform] duration-200 ease-out hover:bg-primary/10 active:scale-90 active:bg-primary/15 motion-reduce:transition-none ${FOCUS_RING} ${
            open ? "bg-primary/10" : ""
          }`}
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
            {[
              open ? "rotate-45" : "-translate-y-[6px]",
              open ? "opacity-0 scale-x-0" : "",
              open ? "-rotate-45" : "translate-y-[6px]",
            ].map((state, i) => (
              <span
                key={i}
                className={`absolute h-0.5 w-[22px] rounded-full bg-current transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none ${state}`}
              />
            ))}
          </span>
        </button>
      </Container>

      {/* Mobile menu. Always rendered so it can animate: the 0fr -> 1fr grid
          row gives a smooth height transition without measuring, and
          `invisible` keeps closed links out of the tab order / a11y tree. */}
      <div
        className={`lg:hidden grid transition-[grid-template-rows,visibility] duration-300 ease-out motion-reduce:transition-none ${
          open ? "grid-rows-[1fr] visible" : "grid-rows-[0fr] invisible"
        }`}
      >
        <div className="overflow-hidden">
          <nav id="mobile-nav" aria-label="Main" className="border-t border-border-subtle/60">
            <Container className="py-space-md flex flex-col gap-space-md">
              <ul className="list-none m-0 p-0 flex flex-col gap-1">
                {NAV_LINKS.map((l, i) => {
                  const active = isActive(pathname, l.href);
                  return (
                    <li
                      key={l.label}
                      // Light stagger on open; everything leaves together on close.
                      style={{ transitionDelay: open ? `${40 + i * 30}ms` : "0ms" }}
                      className={`transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none ${
                        open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1.5"
                      }`}
                    >
                      <Link
                        href={l.href}
                        aria-current={active ? "page" : undefined}
                        onClick={() => setOpen(false)}
                        className={`flex items-center justify-between px-space-md py-space-sm rounded-xl text-[15px] no-underline transition-colors ${FOCUS_RING} ${
                          active
                            ? "font-bold text-primary bg-primary/10"
                            : "font-semibold text-navy-surface hover:text-primary hover:bg-surface-container-low"
                        }`}
                      >
                        {l.label}
                        <Icon
                          name="chevron_right"
                          className={`text-[20px] ${active ? "text-primary" : "text-outline-variant"}`}
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div
                style={{ transitionDelay: open ? `${40 + NAV_LINKS.length * 30}ms` : "0ms" }}
                className={`grid grid-cols-1 sm:grid-cols-2 gap-space-xs pt-space-md border-t border-border-subtle/60 transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none ${
                  open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1.5"
                }`}
              >
                <Button href="/contactus" variant="secondary" fullWidth className="no-underline" onClick={() => setOpen(false)}>
                  <Icon name="add_circle" className="text-[18px] text-teal-clinical" />
                  Post Opportunity
                </Button>
                <Button
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  icon="chat"
                  fullWidth
                  className="no-underline"
                >
                  Join Job Alerts
                </Button>
              </div>
            </Container>
          </nav>
        </div>
      </div>
    </header>
  );
}
