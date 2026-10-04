import React from "react";
import SiteHeader from "./componants/siteHeader";
import SiteFooter from "./componants/siteFooter";
import ScrollTop from "./componants/scrollTop";
import Breadcrumb from "./componants/breadcrumb";
import Container from "./componants/container";
import Badge from "./componants/badge";
import Button from "./componants/button";
import Card from "./componants/card";
import GoBackButton from "./componants/goBackButton";
import Icon from "./componants/msIcon";
import "./assets/css/tailwind.css";

export const metadata = {
  title: "Page Not Found | PharmaConnect",
};

// Icons must be in the Material Symbols subset in layout.js.
const QUICK_LINKS = [
  { icon: "work", title: "Find Jobs", desc: "Browse verified pharmacy openings.", href: "/jobs" },
  { icon: "article", title: "Blogs", desc: "Career guides and industry insights.", href: "/blogs" },
  { icon: "mail", title: "Contact Us", desc: "Tell us what you were looking for.", href: "/contactus" },
];

export default function NotFound() {
  return (
    <div className="bg-surface font-sans text-on-surface antialiased">
      <SiteHeader />

      <main className="w-full pt-20 bg-surface">
        <Breadcrumb items={[{ label: "Page Not Found" }]} />

        <section className="w-full bg-surface-card shadow-sm py-space-2xl sm:py-space-3xl">
          <Container>
            <div className="max-w-2xl mx-auto flex flex-col items-center text-center gap-space-md">
              <Badge tone="primary" pulse>Error 404</Badge>

              <div className="relative select-none" aria-hidden="true">
                <span className="block text-[96px] sm:text-[140px] lg:text-[168px] font-extrabold leading-none tracking-tighter text-primary/10">
                  404
                </span>
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-primary text-on-primary shadow-lg">
                    <Icon name="search_off" className="text-[32px] sm:text-[40px]" />
                  </span>
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-surface tracking-tight leading-[1.15] m-0">
                Page <span className="text-primary">not found.</span>
              </h1>
              <p className="text-base text-on-surface-variant leading-relaxed m-0">
                The page you&apos;re looking for could not be found. It may have
                been moved, removed, or the link might be incorrect.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-space-sm pt-space-xs w-full sm:w-auto">
                <Button href="/" icon="home">Back to Home</Button>
                <GoBackButton />
              </div>
            </div>
          </Container>
        </section>

        <section className="w-full py-space-2xl">
          <Container>
            <p className="text-center text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-space-lg">
              Or try one of these
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md max-w-4xl mx-auto">
              {QUICK_LINKS.map((l) => (
                <Card key={l.href} href={l.href} className="group flex items-start gap-space-md no-underline">
                  <span className="flex items-center justify-center w-11 h-11 shrink-0 rounded-xl bg-primary/10 text-primary">
                    <Icon name={l.icon} className="text-[22px]" />
                  </span>
                  <span className="flex flex-col gap-1 min-w-0">
                    <span className="flex items-center gap-1 font-bold text-navy-surface group-hover:text-primary transition-colors">
                      {l.title}
                      <Icon name="arrow_forward" className="text-[16px] transition-transform group-hover:translate-x-0.5" />
                    </span>
                    <span className="text-sm text-on-surface-variant">{l.desc}</span>
                  </span>
                </Card>
              ))}
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter />
      <ScrollTop />
    </div>
  );
}
