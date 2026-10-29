import React, { cache } from "react";
import { notFound, permanentRedirect } from "next/navigation";

import SiteHeader from "../../../componants/siteHeader";
import SiteFooter from "../../../componants/siteFooter";
import ScrollTop from "../../../componants/scrollTop";
import Breadcrumb from "../../../componants/breadcrumb";
import BlogDetail from "../../../componants/blogDetail";
import JsonLd from "../../../componants/jsonLd";

import { blogsApi } from "../../../services/blogs/blogs.api";
import { SITE_NAME, SITE_URL, SITE_LOGO, absoluteUrl, blogAuthor, blogPath, excerpt, pageMetadata, safeDecode } from "../../../lib/site";

// Shared by generateMetadata and the page (one API call per request). The
// [id] segment accepts a slug or a legacy id. Drafts 404 so they never get indexed.
const getPost = cache(async (idOrSlug) => {
    try {
        const post = await blogsApi.getOne(idOrSlug);
        return post?.status === "PUBLISHED" ? post : null;
    } catch {
        return null;
    }
});

const description = (post) => post.seoDescription || post.excerpt || excerpt(post.content);

export async function generateMetadata({ params }) {
    const post = await getPost(params.id);
    if (!post) return { title: "Article Not Found", robots: { index: false } };

    const title = post.seoTitle || post.title;
    return pageMetadata({
        title,
        // Editors sometimes include the brand in seoTitle; don't append it twice.
        absoluteTitle: /pharmaconnect/i.test(title),
        description: description(post),
        path: blogPath(post),
        type: "article",
        image: post.featuredImage,
        ...(post.tags?.length && { keywords: post.tags }),
    });
}

function articleSchema(post) {
    const url = absoluteUrl(blogPath(post));
    const author = blogAuthor(post);
    const publisher = { "@type": "Organization", name: SITE_NAME, url: SITE_URL, logo: { "@type": "ImageObject", url: SITE_LOGO } };
    return {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: description(post),
        ...(post.featuredImage && { image: [absoluteUrl(post.featuredImage)] }),
        datePublished: post.publishedAt || post.createdAt,
        dateModified: post.updatedAt || post.publishedAt || post.createdAt,
        // No author name saved = the post is credited to the site itself.
        author: post.authorName
            ? {
                  "@type": "Person",
                  name: author.name,
                  ...(author.jobTitle && { jobTitle: author.jobTitle }),
                  url: `${SITE_URL}/aboutus`,
                  ...(author.linkedin && { sameAs: [author.linkedin] }),
              }
            : publisher,
        publisher,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        url,
        ...(post.category && { articleSection: post.category }),
        ...(post.tags?.length && { keywords: post.tags.join(", ") }),
    };
}

export default async function BlogDetailPage({ params }) {
    const data = await getPost(params.id);
    if (!data) notFound();

    // Legacy "/blogs/<id>" links and renamed titles land on the one slug URL.
    const canonical = blogPath(data);
    if (`/blogs/${safeDecode(params.id)}` !== canonical) permanentRedirect(canonical);

    let related = [];
    try {
        const result = await blogsApi.list(undefined, { status: "PUBLISHED", page: 1, limit: 4 });
        related = (result?.data ?? []).filter((b) => b.id !== data.id).slice(0, 3);
    } catch {
        related = [];
    }

    return (
        <div className="bg-surface font-sans text-on-surface antialiased">
            <JsonLd data={articleSchema(data)} />
            <SiteHeader />
            <main className="w-full pt-20 bg-surface">
                <Breadcrumb items={[{ label: "Blogs", href: "/blogs" }, { label: data.title }]} />
                <BlogDetail post={data} related={related} />
            </main>
            <SiteFooter />
            <ScrollTop />
        </div>
    );
}
