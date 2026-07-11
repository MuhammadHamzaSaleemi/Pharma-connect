-- CreateEnum
CREATE TYPE "JobWorkType" AS ENUM ('ON_SITE', 'HYBRID', 'REMOTE', 'FIELD_BASED');

-- CreateEnum
CREATE TYPE "JobSector" AS ENUM ('PRODUCTION', 'QUALITY_ASSURANCE', 'QUALITY_CONTROL', 'REGULATORY_AFFAIRS', 'PHARMACOVIGILANCE', 'CLINICAL_RESEARCH', 'MEDICAL_AFFAIRS', 'SALES_MARKETING', 'WAREHOUSE', 'SUPPLY_CHAIN', 'COMMUNITY_PHARMACY', 'HOSPITAL_PHARMACY', 'ACADEMIA', 'MANUFACTURING', 'FORMULATION_DEVELOPMENT', 'VALIDATION', 'MICROBIOLOGY', 'BIOTECHNOLOGY', 'HOSPITALITY', 'GOVERNMENT', 'NGO');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE', 'CLOSED');

-- CreateTable
CREATE TABLE "jobs" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "qualification" TEXT NOT NULL,
    "jobDescription" TEXT NOT NULL,
    "experience" TEXT NOT NULL,
    "workType" "JobWorkType" NOT NULL,
    "jobFunction" TEXT NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'DRAFT',
    "sector" "JobSector" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "jobs_status_idx" ON "jobs"("status");

-- CreateIndex
CREATE INDEX "jobs_sector_idx" ON "jobs"("sector");

-- CreateIndex
CREATE INDEX "jobs_workType_idx" ON "jobs"("workType");

-- CreateIndex
CREATE INDEX "jobs_city_idx" ON "jobs"("city");
