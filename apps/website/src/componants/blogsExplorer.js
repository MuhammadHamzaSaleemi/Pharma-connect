"use client";
import React, { useMemo, useState } from "react";
import Link from "next/link";
import Icon from "./msIcon";
import Badge from "./badge";
import Button from "./button";
import Card from "./card";
import Container from "./container";
import StateMessage from "./stateMessage";
import BlogCard from "./blogCard";
import FeaturedBlogCard from "./featuredBlogCard";

const PAGE_SIZE = 9;

function getPageNumbers(current, total) {
  const pages = [];
  const start = Math.max(1, current - 1);
  const end = Math.min(total, start + 2);
  for (let i = start; i <= end; i++) pages.push(i);
  return pages;
}

export default function BlogsExplorer({ blogs }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Topics");
  const [sort, setSort] = useState("recent");
  const [page, setPage] = useState(1);

  const categories = useMemo(() => {
    const counts = new Map();
    blogs.forEach((b) => {
      const cat = b.category || "Uncategorized";
      counts.set(cat, (counts.get(cat) || 0) + 1);
    });
    return ["All Topics", ...Array.from(counts.keys())];
  }, [blogs]);

  const filtered = useMemo(() => {
    let list = blogs;
    if (category !== "All Topics") {
      list = list.filter((b) => (b.category || "Uncategorized") === category);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (b) =>
          b.title?.toLowerCase().includes(q) ||
          b.excerpt?.toLowerCase().includes(q) ||
          b.category?.toLowerCase().includes(q),
      );
    }
    const sorted = [...list].sort((a, b) => {
      if (sort === "title") return (a.title || "").localeCompare(b.title || "");
      return (
        new Date(b.publishedAt || b.createdAt || 0) -
        new Date(a.publishedAt || a.createdAt || 0)
      );
    });
    return sorted;
  }, [blogs, category, search, sort]);

  const featuredList = filtered.slice(0, 3);
  const rest = filtered.slice(3);

  const totalPages = Math.max(1, Math.ceil(rest.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = rest.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <div className="flex flex-col w-full">
      {/* Hero header */}
      <section className="w-full bg-surface-card shadow-sm py-space-xl sm:py-space-2xl">
        <Container>
          <div className="flex flex-col gap-space-md">
            <Badge tone="primary" pulse className="w-fit">
              Knowledge Base &amp; Career Intelligence • Pakistan &amp; Global
            </Badge>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md lg:gap-space-2xl items-end">
              <div className="lg:col-span-8">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy-surface tracking-tight leading-tight">
                  Insights, Pathways &amp; Regulatory Updates for Pharmacists
                </h1>
              </div>
              <div className="lg:col-span-4">
                <p className="text-on-surface-variant leading-relaxed">
                  Verified career roadmaps, overseas licensing guides,
                  industrial quality compliance, and updates curated for
                  pharmacists, students, and clinical professionals.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Search & filters */}
      <section className="w-full bg-surface-card py-space-lg shadow-sm">
        <Container>
          <div className="flex flex-col gap-space-md">
            <div className="w-full flex flex-col md:flex-row items-center gap-space-sm bg-surface-container-low p-1.5 rounded-xl shadow-sm">
              <div className="flex-1 flex items-center gap-space-sm px-space-md py-2 w-full bg-surface-card rounded-lg shadow-sm">
                <Icon name="search" className="text-primary text-[22px]" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search articles or topics..."
                  className="w-full bg-transparent border-none outline-none text-navy-surface placeholder:text-on-surface-variant text-sm"
                />
              </div>
              <div className="flex items-center gap-space-sm w-full md:w-auto shrink-0 justify-between md:justify-end">
                <div className="relative inline-flex items-center min-w-0 bg-surface-card px-space-md py-2 rounded-lg shadow-sm text-on-surface-variant">
                  <Icon
                    name="sort"
                    className="text-[18px] mr-1 text-teal-clinical"
                  />
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="min-w-0 max-w-full bg-transparent border-none outline-none text-navy-surface text-sm font-semibold cursor-pointer"
                  >
                    <option value="recent">Sort by: Latest Published</option>
                    <option value="title">Sort by: Title (A-Z)</option>
                  </select>
                </div>
                <Button
                  variant="primary"
                  size="md"
                  icon="tune"
                  iconPosition="right"
                >
                  Filter
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-space-xs overflow-x-auto pb-1">
              {categories.map((cat) => (
                <Button
                  variant={category === cat ? "primary" : "secondary"}
                  size="sm"
                  key={cat}
                  onClick={() => {
                    setCategory(cat);
                    setPage(1);
                  }}
                  className={`shrink-0 px-space-md py-1.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                    category === cat
                      ? "bg-primary text-on-primary shadow-sm"
                      : "bg-surface-container-low text-on-surface-variant hover:text-navy-surface"
                  }`}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Featured spotlight */}
      {featuredList.length > 0 && (
        <section className="w-full py-space-2xl">
          <Container>
            <div className="flex flex-col gap-space-lg">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-xs">
                <div>
                  <div className="flex items-center gap-space-xs mb-1">
                    <span className="w-2 h-2 rounded-full bg-teal-clinical" />
                    <span className="text-primary text-xs font-bold uppercase tracking-wider">
                      Featured Editorial Intelligence
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-navy-surface tracking-tight">
                    Curated Career Pathways &amp; Industry Guides
                  </h2>
                </div>
                <span className="text-sm text-on-surface-variant font-semibold">
                  Updated weekly by our editorial team
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
                {featuredList.map((post, index) => (
                  <FeaturedBlogCard key={post.id} post={post} index={index} />
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* Grid */}
      <section className="w-full py-space-xl">
        <Container>
          {filtered.length === 0 && (
            <StateMessage icon="search_off">No blog posts found.</StateMessage>
          )}
          {pageItems.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
              {pageItems.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-space-xs mt-space-xl">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-surface-container-low text-on-surface-variant disabled:opacity-40"
              >
                <Icon name="chevron_left" className="text-[18px]" />
              </button>
              {getPageNumbers(currentPage, totalPages).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-semibold ${
                    n === currentPage
                      ? "bg-primary text-on-primary"
                      : "bg-surface-container-low text-on-surface-variant"
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-surface-container-low text-on-surface-variant disabled:opacity-40"
              >
                <Icon name="chevron_right" className="text-[18px]" />
              </button>
            </div>
          )}
        </Container>
      </section>

      {/* Document library / suggest a topic CTA */}
      <section className="w-full pt-space-lg pb-space-3xl">
        <Container>
          <Card
            padding="lg"
            hoverLift={false}
            className="flex flex-col lg:flex-row items-center justify-between gap-space-lg"
          >
            <div className="flex items-start gap-space-md">
              <div className="w-14 h-14 rounded-2xl bg-surface-container-low flex items-center justify-center text-primary shrink-0">
                <Icon name="article" className="text-[28px]" />
              </div>
              <div>
                <span className="text-teal-clinical text-xs font-bold uppercase tracking-wider">
                  Official Document Library
                </span>
                <h3 className="text-lg font-bold text-navy-surface mt-0.5">
                  Have a topic you&apos;d like us to cover?
                </h3>
                <p className="text-on-surface-variant text-sm max-w-xl">
                  Send us your suggestions for career guides, licensing
                  pathways, DRAP circulars, or industry insights you&apos;d like
                  covered.
                </p>
              </div>
            </div>
            <Link href="/contactus">
              <Button variant="secondary">
                Suggest a Topic
                <Icon name="arrow_forward" className="text-[18px]" />
              </Button>
            </Link>
          </Card>
        </Container>
      </section>
    </div>
  );
}
