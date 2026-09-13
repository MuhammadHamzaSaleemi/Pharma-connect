import React from "react";
import { notFound } from "next/navigation";

import SiteHeader from "../../componants/siteHeader";
import SiteFooter from "../../componants/siteFooter";
import ScrollTop from "../../componants/scrollTop";
import BlogDetail from "../../componants/blogDetail";

import { blogsApi } from "../../../services/blogs/blogs.api";

export default async function BlogDetailPage({ params }) {
    const { id } = params;

    let data;
    try {
        data = await blogsApi.getOne(id);
    } catch {
        notFound();
    }

    let related = [];
    try {
        const result = await blogsApi.list(undefined, { status: "PUBLISHED", page: 1, limit: 4 });
        related = (result?.data ?? []).filter((b) => b.id !== id).slice(0, 3);
    } catch {
        related = [];
    }

    return (
        <div className="bg-surface font-sans text-on-surface antialiased">
            <SiteHeader />
            <main className="w-full pt-20 bg-surface">
                <BlogDetail post={data} related={related} />
            </main>
            <SiteFooter />
            <ScrollTop />
        </div>
    );
}
