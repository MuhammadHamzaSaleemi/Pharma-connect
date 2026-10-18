import SiteHeader from "../../componants/siteHeader";
import { pageMetadata } from "../../lib/site";
import SiteFooter from "../../componants/siteFooter";
import ScrollTop from "../../componants/scrollTop";
import Breadcrumb from "../../componants/breadcrumb";
import BlogsExplorer from "../../componants/blogsExplorer";
import { blogsApi } from "../../services/blogs/blogs.api";
import { fetchAllPages } from "../../lib/fetchAllPages";

export const metadata = pageMetadata({
  title: "Pharmacy Career Blog: Guides & Industry News",
  description: "Career guides, licensing updates and pharmaceutical industry news for pharmacists, Pharm-D students and graduates in Pakistan and abroad.",
  path: "/blogs",
});

export default async function Blogs() {
  let blogs = [];
  try {
    blogs = await fetchAllPages(blogsApi, { status: "PUBLISHED" });
  } catch {
    blogs = [];
  }

  return (
    <div className="bg-surface font-sans text-on-surface antialiased">
      <SiteHeader />
      <main className="w-full pt-20 bg-surface">
        <Breadcrumb />
        <BlogsExplorer blogs={blogs} />
      </main>
      <SiteFooter />
      <ScrollTop />
    </div>
  );
}
