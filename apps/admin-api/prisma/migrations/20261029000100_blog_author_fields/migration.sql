-- AlterTable
ALTER TABLE "blogs" ADD COLUMN     "authorBio" TEXT DEFAULT 'Pharm-D graduate of COMSATS University Islamabad, with experience in community pharmacy, industrial quality assurance, and pharmaceutical research.',
ADD COLUMN     "authorImage" TEXT DEFAULT '/images/team/burhan.webp',
ADD COLUMN     "authorLinkedin" TEXT DEFAULT 'https://www.linkedin.com/in/muhammadburhankhan/',
ADD COLUMN     "authorName" TEXT NOT NULL DEFAULT 'Muhammad Burhan Khan',
ADD COLUMN     "authorTitle" TEXT DEFAULT 'Founder, Pharmacist (Pharm-D)';

