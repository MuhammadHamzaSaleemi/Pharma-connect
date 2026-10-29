// Canonical site identity, shared by metadata, sitemap, robots and JSON-LD.
// NEXT_PUBLIC_SITE_URL overrides the production origin (e.g. for staging).
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://pharmaconnect-pakistan.com').replace(/\/+$/, '');
export const SITE_NAME = 'PharmaConnect';
// AdSense publisher id ("ca-pub-" + 16 digits). Unset or malformed = no AdSense
// snippet and a 404 /ads.txt. NEXT_PUBLIC_ vars are inlined, so changing it needs a rebuild.
const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || '';
export const ADSENSE_CLIENT = /^ca-pub-\d{16}$/.test(adsenseClient) ? adsenseClient : '';
export const SITE_LOGO = `${SITE_URL}/images/logo.png`;
export const SITE_DESCRIPTION =
    'Verified pharmacy jobs, internships, scholarships and career guides for pharmacists, Pharm-D graduates and students across Pakistan and abroad.';
export const SOCIAL_LINKS = [
    'https://www.linkedin.com/company/pharmaconnect-pakistan/',
    'https://www.instagram.com/pharmaconnect_pakistan/',
    'https://www.facebook.com/pharmaconnectpakistan/',
];

/**
 * The post's byline as saved in the blog form. Every field is optional and stored as NULL when
 * blank: a missing name credits the site, and a missing image renders the default avatar.
 */
export function blogAuthor(post) {
    return {
        name: post?.authorName || SITE_NAME,
        jobTitle: post.authorTitle,
        bio: post.authorBio,
        image: post.authorImage,
        linkedin: post.authorLinkedin,
    };
}

export function absoluteUrl(path = '/') {
    return path.startsWith('http') ? path : `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}

export function slugify(text = '') {
    return text
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 80);
}

// Jobs have no slug column, so the URL is "<title-slug>-<id>". cuids never
// contain "-", so the id is always the last segment; a bare old "/jobs/<id>"
// link parses the same way and gets redirected to the canonical form.
export const jobPath = (job) => `/jobs/${[slugify(job.title), job.id].filter(Boolean).join('-')}`;
export const jobIdFromParam = (param) => safeDecode(param).split('-').pop();

// decodeURIComponent throws on a malformed escape like "%E0%A4"; a bad URL should 404, not 500.
export function safeDecode(value) {
    try {
        return decodeURIComponent(value);
    } catch {
        return value;
    }
}

export const blogPath = (post) => `/blogs/${post.slug || post.id}`;

// Plain-text summary for meta descriptions, from HTML content.
export function excerpt(html = '', max = 160) {
    const text = html.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
    return text.length > max ? `${text.slice(0, max - 1).replace(/\s+\S*$/, '')}…` : text;
}

// Per-page metadata with canonical + Open Graph/Twitter. Next replaces (not
// merges) a layout's openGraph when a page sets one, so siteName/locale are
// repeated here, and the default share card (app/opengraph-image.png) is set
// explicitly because a page-level openGraph drops the inherited file image.
export function pageMetadata({ title, description, path, type = 'website', image, absoluteTitle = false, ...rest }) {
    const images = [{ url: absoluteUrl(image || '/opengraph-image.png') }];
    return {
        title: absoluteTitle ? { absolute: title } : title,
        description,
        alternates: { canonical: path },
        openGraph: { title, description, url: path, type, siteName: SITE_NAME, locale: 'en_PK', images },
        twitter: { card: 'summary_large_image', title, description, images },
        ...rest,
    };
}
