-- The @unique constraint on "slug" already creates "blogs_slug_key", so this plain index was a duplicate.
DROP INDEX "blogs_slug_idx";
