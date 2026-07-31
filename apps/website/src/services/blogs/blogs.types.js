// Mirrors apps/admin-api/src/common/enums/blogs/blog-status.enum.ts
export const BLOG_STATUS_VALUES = ['DRAFT', 'PUBLISHED'];

/**
 * @typedef {Object} Blog
 * @property {string} id
 * @property {string} title
 * @property {string} slug
 * @property {string} content
 * @property {string} [excerpt]
 * @property {string} [featuredImage]
 * @property {string} [category]
 * @property {string[]} tags
 * @property {string} status
 * @property {boolean} isFeatured
 * @property {string} [seoTitle]
 * @property {string} [seoDescription]
 * @property {string} [publishedAt]
 */

/**
 * @typedef {Object} BlogListParams
 * @property {number} [page]
 * @property {number} [limit]
 */

export {};
