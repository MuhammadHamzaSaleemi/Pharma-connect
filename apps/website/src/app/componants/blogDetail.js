import React from "react";
import Link from "next/link";
import Image from "next/image";
import Icon from "./msIcon";
import Badge from "./badge";
import Button from "./button";
import Card from "./card";
import Container from "./container";
import { formatDate, estimateReadTime } from "./blogCard";

export const PROSE_CLASSES = [
  "[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-navy-surface [&_h2]:mt-space-xl [&_h2]:mb-space-sm",
  "[&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-navy-surface [&_h3]:mt-space-lg [&_h3]:mb-space-xs",
  "[&_p]:text-on-surface-variant [&_p]:leading-relaxed [&_p]:mb-space-md",
  "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-space-md [&_ul]:text-on-surface-variant [&_ul]:space-y-1",
  "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-space-md [&_ol]:text-on-surface-variant [&_ol]:space-y-1",
  "[&_a]:text-primary [&_a]:font-semibold [&_a]:underline",
  "[&_img]:rounded-xl [&_img]:my-space-md [&_img]:w-full",
  "[&_strong]:text-navy-surface",
  "[&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:bg-surface-container-low [&_blockquote]:p-space-md [&_blockquote]:rounded-r-xl [&_blockquote]:italic [&_blockquote]:text-navy-surface [&_blockquote]:my-space-md",
  "[&_table]:w-full [&_table]:text-sm [&_table]:my-space-md",
  "[&_th]:bg-surface-container-low [&_th]:text-navy-surface [&_th]:text-left [&_th]:p-space-sm",
  "[&_td]:p-space-sm [&_td]:border-t [&_td]:border-border-subtle [&_td]:text-on-surface-variant",
].join(" ");

export default function BlogDetail({ post, related = [] }) {
  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <section className="w-full bg-surface-crisp py-space-xl">
        <Container>
          <div className="flex flex-col gap-space-md">
            <nav className="flex items-center gap-space-xs text-on-surface-variant text-sm font-semibold">
              <Link href="/" className="hover:text-primary flex items-center gap-1">
                <Icon name="home" className="text-[16px]" />
                Home
              </Link>
              <Icon name="chevron_right" className="text-[14px]" />
              <Link href="/blogs" className="hover:text-primary">
                Blogs
              </Link>
              <Icon name="chevron_right" className="text-[14px]" />
              <span className="text-primary font-bold truncate">{post.title}</span>
            </nav>

            <div className="flex flex-wrap items-center gap-space-sm">
              <Badge tone="primary" className="w-fit">
                {post.category || "Blog"}
              </Badge>
              <Badge tone="verified" dot={false} uppercase={false}>
                <Icon name="verified" className="text-[14px]" />
                Verified Content
              </Badge>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy-surface tracking-tight leading-tight max-w-4xl">
              {post.title}
            </h1>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md pt-space-xs pb-space-sm border-b border-border-subtle">
              <div className="flex flex-wrap items-center gap-space-md text-on-surface-variant text-sm">
                <span className="flex items-center gap-1">
                  <Icon name="calendar_today" className="text-[18px]" />
                  {formatDate(post.publishedAt || post.createdAt)}
                </span>
                <span className="text-outline">•</span>
                <span className="flex items-center gap-1">
                  <Icon name="schedule" className="text-[18px]" />
                  {estimateReadTime(post.content)}
                </span>
              </div>
              <div className="flex items-center gap-space-xs shrink-0">
                <a
                  href="https://www.linkedin.com/sharing/share-offsite/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-primary-fixed hover:text-primary transition-all"
                  aria-label="Share on LinkedIn"
                >
                  <Icon name="share" className="text-[18px]" />
                </a>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(post.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-surface-container-low text-verified-green hover:bg-surface-container transition-all"
                  aria-label="Share on WhatsApp"
                >
                  <Icon name="chat" className="text-[18px]" />
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Featured image */}
      {post.featuredImage && (
        <section className="w-full pt-space-xl">
          <Container>
            <div className="w-full flex flex-col gap-space-xs">
              <div className="relative w-full h-[280px] sm:h-[420px] rounded-2xl overflow-hidden shadow-sm bg-surface-dim">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
              {post.excerpt && (
                <p className="text-sm text-on-surface-variant italic">{post.excerpt}</p>
              )}
            </div>
          </Container>
        </section>
      )}

      {/* Content & sidebar */}
      <section className="w-full py-space-xl">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-2xl items-start">
            <article className="lg:col-span-8 flex flex-col gap-space-xl min-w-0">
              <div
                className={PROSE_CLASSES}
                dangerouslySetInnerHTML={{ __html: post.content ?? "" }}
              />

              {post.tags?.length > 0 && (
                <div className="flex flex-wrap gap-space-xs">
                  {post.tags.map((tag) => (
                    <Badge key={tag} tone="neutral" dot={false} uppercase={false}>
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="p-space-lg rounded-2xl bg-surface-container-low flex flex-col sm:flex-row items-start sm:items-center gap-space-md">
                <div className="w-14 h-14 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0">
                  <Icon name="verified_user" className="text-[24px]" />
                </div>
                <div>
                  <span className="block text-base font-bold text-navy-surface">
                    PharmaConnect Editorial Board
                  </span>
                  <span className="block text-sm text-on-surface-variant">
                    Verified content, reviewed for accuracy by clinical and career leads.
                  </span>
                </div>
              </div>
            </article>

            <aside className="lg:col-span-4 flex flex-col gap-space-lg lg:sticky lg:top-24">
              <Card padding="lg" hoverLift={false} className="bg-gradient-to-br from-verified-green/10 via-surface-card to-surface-card flex flex-col gap-space-sm">
                <div className="flex items-center gap-space-xs text-verified-green">
                  <Icon name="groups" className="text-[28px]" />
                  <h4 className="text-lg font-bold text-navy-surface">Join the Community</h4>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Connect with thousands of Pakistani pharmacists sharing career advice,
                  licensing updates, and job leads.
                </p>
                <Button
                  href="https://wa.me/923244296468"
                  target="_blank"
                  variant="solidDark"
                  icon="chat"
                  fullWidth
                >
                  Join WhatsApp Community
                </Button>
              </Card>

              {related.length > 0 && (
                <Card padding="lg" hoverLift={false} className="flex flex-col gap-space-md">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-navy-surface">
                    Related Articles
                  </h4>
                  <div className="flex flex-col gap-space-sm">
                    {related.map((item) => (
                      <Link
                        key={item.id}
                        href={`/blogs/${item.id}`}
                        className="p-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col gap-1"
                      >
                        <span className="text-xs font-bold text-primary uppercase">
                          {item.category || "Blog"}
                        </span>
                        <span className="text-sm font-bold text-navy-surface line-clamp-2">
                          {item.title}
                        </span>
                        <span className="text-xs text-on-surface-variant">
                          {estimateReadTime(item.content)}
                        </span>
                      </Link>
                    ))}
                  </div>
                </Card>
              )}
            </aside>
          </div>
        </Container>
      </section>

      {/* Bottom advisory CTA */}
      <section className="w-full pb-space-3xl">
        <Container>
          <div className="rounded-3xl bg-navy-deep text-on-primary p-space-xl sm:p-space-2xl flex flex-col md:flex-row items-center justify-between gap-space-xl">
            <div className="flex flex-col gap-space-sm max-w-2xl text-center md:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-bright">
                PharmaConnect Advisory Desk
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Have questions about your next career move?
              </h2>
              <p className="text-white/70">
                Connect directly with our team for guidance on licensing, job search, and
                career planning.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-space-sm shrink-0 w-full md:w-auto">
              <Button href="/contactus" variant="dark" fullWidth>
                Contact Us
              </Button>
              <Button
                href="https://wa.me/923244296468"
                target="_blank"
                variant="solidDark"
                icon="chat"
                fullWidth
              >
                WhatsApp Us
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
