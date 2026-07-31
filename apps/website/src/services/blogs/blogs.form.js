import { enumToOptions } from "../../lib/enumOptions";
import { BLOG_STATUS_VALUES } from "./blogs.types";

export const blogFormFields = [
    { name: 'featuredImage', label: 'Featured Image', type: 'imagefile', colSpan: 'full' },
    { name: 'title', label: 'Title', type: 'text', required: true, colSpan: 'half', placeholder: 'Understanding Pharmacovigilance in 2026' },
    { name: 'category', label: 'Category', type: 'text', colSpan: 'half', placeholder: 'Regulatory Affairs' },
    { name: 'status', label: 'Status', type: 'select', colSpan: 'half', options: enumToOptions(BLOG_STATUS_VALUES) },
    { name: 'publishedAt', label: 'Published Date', type: 'date', colSpan: 'half' },
    { name: 'tags', label: 'Tags', type: 'text', colSpan: 'full', placeholder: 'pharmacovigilance, compliance' },
    { name: 'isFeatured', label: 'Feature this post', type: 'checkbox', colSpan: 'full' },
    { name: 'excerpt', label: 'Excerpt', type: 'textarea', colSpan: 'full', rows: 3, placeholder: 'A short summary of the article' },
    { name: 'content', label: 'Content', type: 'richtext', required: true, colSpan: 'full', placeholder: 'Write the full article...' },
    { name: 'seoTitle', label: 'SEO Title', type: 'text', colSpan: 'half', placeholder: 'Understanding Pharmacovigilance | PharmaConnect' },
    { name: 'seoDescription', label: 'SEO Description', type: 'textarea', colSpan: 'half', rows: 3, placeholder: 'Learn the fundamentals of pharmacovigilance in this guide.' },
];

export const blogFormInitialValues = {
    status: 'DRAFT',
    isFeatured: false,
};

// Builds the multipart/form-data payload the admin-api blogs endpoint expects.
// featuredImage is only appended when the user picked a new file — leaving it
// untouched on edit keeps the existing image on the server.
export function buildBlogFormData(values) {
    const formData = new FormData();

    formData.append('title', values.title ?? '');
    formData.append('content', values.content ?? '');
    if (values.excerpt) formData.append('excerpt', values.excerpt);
    if (values.category) formData.append('category', values.category);
    if (values.tags) {
        const tags = values.tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean);
        if (tags.length) formData.append('tags', tags.join(','));
    }
    if (values.status) formData.append('status', values.status);
    formData.append('isFeatured', String(!!values.isFeatured));
    if (values.seoTitle) formData.append('seoTitle', values.seoTitle);
    if (values.seoDescription) formData.append('seoDescription', values.seoDescription);
    if (values.publishedAt) formData.append('publishedAt', values.publishedAt);
    if (values.featuredImage instanceof File) formData.append('featuredImage', values.featuredImage);

    return formData;
}
