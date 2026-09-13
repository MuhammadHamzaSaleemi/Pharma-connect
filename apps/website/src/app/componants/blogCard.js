import React from "react";
import Link from "next/link";
import Icon from "./msIcon";
import Badge from "./badge";
import Image from "next/image";
import "../assets/css/tailwind.css";

export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function estimateReadTime(html) {
  const wordCount = (html || "")
    .replace(/<[^>]+>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return `${Math.max(1, Math.ceil(wordCount / 200))} min read`;
}

export default function BlogCard({ post }) {
  return (
    <article className="bg-surface-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col border border-border-subtle">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          height={200}
          width={320}
          src={post.featuredImage || "/images/blog/01.jpg"}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          alt={post.title}
          loading="lazy"
        />
        <Badge
          tone="solid"
          dot={false}
          uppercase={false}
          className="absolute top-4 left-4 shadow-sm"
        >
          {post.category || "Blog"}
        </Badge>
      </div>
      <div className="p-space-lg flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-space-sm text-on-surface-variant text-xs mb-space-xs">
            <span className="flex items-center gap-1">
              <Icon name="calendar_today" className="text-[16px]" />
              {formatDate(post.publishedAt || post.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <Icon name="schedule" className="text-[16px]" />
              {estimateReadTime(post.content)}
            </span>
          </div>
          <Link
            href={`/blogs/${post.id}`}
            className="text-lg font-bold text-navy-surface hover:text-primary transition-colors block"
          >
            {post.title}
          </Link>
        </div>
        <Link
          href={`/blogs/${post.id}`}
          className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary-container font-bold mt-space-md"
        >
          Read Now
          <Icon name="arrow_forward" className="text-[16px]" />
        </Link>
      </div>
    </article>
  );
}
