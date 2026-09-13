import React from "react";
import Link from "next/link";
import Icon from "./msIcon";
import Badge from "./badge";
import { formatDate, estimateReadTime } from "./blogCard";
import Image from "next/image";

const FEATURED_CARD_STYLES = [
  { icon: "local_hospital", dot: "bg-berry-accent", gradient: "from-navy-deep/80 to-primary/40", button: "bg-berry-deep hover:bg-berry-accent" },
  { icon: "local_pharmacy", dot: "bg-cyan-bright", gradient: "from-navy-deep/80 to-teal-clinical/50", button: "bg-primary hover:bg-primary-container" },
  { icon: "clinical_notes", dot: "bg-verified-green", gradient: "from-navy-deep/80 to-verified-green/40", button: "bg-primary hover:bg-primary-container" },
];

export default function FeaturedBlogCard({ post, index = 0 }) {
  const style = FEATURED_CARD_STYLES[index % FEATURED_CARD_STYLES.length];
  const label = index === 0 ? "Featured" : post.category || "Article";

  return (
    <article className="flex flex-col bg-surface-card rounded-2xl border border-border-subtle shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden group">
      <div className="relative h-48 w-full overflow-hidden bg-surface-container-high">
        {post.featuredImage ? (
          <Image
            src={post.featuredImage}
            alt={post.title}
            height={192}
            width={384}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-t ${style.gradient} flex items-center justify-center`}>
            <Icon name={style.icon} className="text-[64px] text-on-primary/70" />
          </div>
        )}
        <div className="absolute top-space-xs left-space-xs flex items-center gap-1.5 px-space-sm py-1 rounded-full bg-navy-surface/90 backdrop-blur-md text-on-primary">
          <span className={`w-2 h-2 rounded-full ${style.dot}`} />
          <span className="text-[11px] font-bold uppercase tracking-wider">{label}</span>
        </div>
      </div>
      <div className="p-space-lg flex flex-col flex-1 justify-between gap-space-md">
        <div className="flex flex-col gap-space-xs">
          <div className="flex flex-wrap items-center gap-space-xs text-on-surface-variant text-[11px] font-semibold">
            <span className="px-2 py-0.5 rounded-full bg-surface-container text-primary font-bold">
              {post.category || "Blog"}
            </span>
            <span>•</span>
            <span>{formatDate(post.publishedAt || post.createdAt)}</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-teal-clinical font-semibold">
              <Icon name="schedule" className="text-[14px]" />
              {estimateReadTime(post.content)}
            </span>
          </div>
          <Link href={`/blogs/${post.id}`} className="hover:text-primary transition-colors">
            <h6 className="text-lg font-bold text-navy-surface tracking-tight leading-snug pt-1">
              {post.title}
            </h6>
          </Link>
          {post.excerpt && (
            <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-2">
              {post.excerpt}
            </p>
          )}
        </div>
        <div className="pt-space-sm border-t border-border-subtle flex items-center justify-between gap-space-xs mt-auto">
          <Badge tone="verified" dot={false} uppercase={false} className="text-[11px]">
            <Icon name="verified" className="text-[14px]" />
            Verified Source
          </Badge>
          <Link
            href={`/blogs/${post.id}`}
            className={`inline-flex items-center gap-1 px-space-md py-2 text-sm font-bold rounded-lg shadow-sm transition-colors shrink-0`}
          >
            Read Now
            <Icon name="arrow_forward" className="text-[16px]" />
          </Link>
        </div>
      </div>
    </article>
  );
}
