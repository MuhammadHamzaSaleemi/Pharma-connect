import { jobsApi } from "../services/jobs/jobs.api";
import { blogsApi } from "../services/blogs/blogs.api";
import { SITE_URL, jobPath, blogPath } from "../lib/site";
import { fetchAllPages } from "../lib/fetchAllPages";

// Built per request so new and expired listings show up immediately (without
// this, Next prerenders it once at build time and freezes the job list).
export const dynamic = "force-dynamic";

const STATIC_ROUTES = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/jobs", changeFrequency: "daily", priority: 0.9 },
  { path: "/blogs", changeFrequency: "weekly", priority: 0.8 },
  { path: "/scholarships", changeFrequency: "weekly", priority: 0.8 },
  { path: "/aboutus", changeFrequency: "monthly", priority: 0.6 },
  { path: "/contactus", changeFrequency: "yearly", priority: 0.5 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.2 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.2 },
];

// API down: still serve the static routes rather than a 500 sitemap.
const fetchAll = (api, params) => fetchAllPages(api, params).catch(() => []);

export default async function sitemap() {
  const [jobs, blogs] = await Promise.all([
    fetchAll(jobsApi, { status: "ACTIVE" }),
    fetchAll(blogsApi, { status: "PUBLISHED" }),
  ]);

  return [
    ...STATIC_ROUTES.map(({ path, ...rest }) => ({ url: `${SITE_URL}${path}`, ...rest })),
    ...jobs.map((job) => ({
      url: `${SITE_URL}${jobPath(job)}`,
      lastModified: job.updatedAt || job.createdAt,
      changeFrequency: "weekly",
      priority: 0.8,
    })),
    ...blogs.map((post) => ({
      url: `${SITE_URL}${blogPath(post)}`,
      lastModified: post.updatedAt || post.publishedAt,
      changeFrequency: "monthly",
      priority: 0.7,
    })),
  ];
}
