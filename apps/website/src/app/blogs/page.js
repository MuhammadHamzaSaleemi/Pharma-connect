import SiteHeader from "../componants/siteHeader";
import SiteFooter from "../componants/siteFooter";
import ScrollTop from "../componants/scrollTop";
import Breadcrumb from "../componants/breadcrumb";
import BlogsExplorer from "../componants/blogsExplorer";
import { blogsApi } from "../../services/blogs/blogs.api";

const FETCH_LIMIT = 100;

export default async function Blogs() {
  let blogs = [];
  try {
    const result = await blogsApi.list(undefined, {
      status: "PUBLISHED",
      page: 1,
      limit: FETCH_LIMIT,
    });
    blogs = result?.data ?? [];
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
