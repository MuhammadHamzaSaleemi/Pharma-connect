-- CreateEnum
CREATE TYPE "ScholarshipStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE', 'EXPIRED');

-- CreateTable
CREATE TABLE "scholarships" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "financialBenefits" TEXT NOT NULL,
    "eligibilityCriteria" TEXT NOT NULL,
    "howToApply" TEXT NOT NULL,
    "status" "ScholarshipStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scholarships_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "scholarships_status_idx" ON "scholarships"("status");

-- CreateIndex
CREATE INDEX "scholarships_country_idx" ON "scholarships"("country");

-- CreateIndex
CREATE INDEX "scholarships_startDate_idx" ON "scholarships"("startDate");

-- CreateIndex
CREATE INDEX "scholarships_endDate_idx" ON "scholarships"("endDate");
