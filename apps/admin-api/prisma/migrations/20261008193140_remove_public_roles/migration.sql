-- Move users off the removed roles first, or the type cast below would fail.
-- They become EXECUTIVE but INACTIVE, so nobody gains dashboard access until a
-- super admin reactivates them from the Users page.
UPDATE "users"
SET "role" = 'EXECUTIVE', "status" = 'INACTIVE', "refreshTokenHash" = NULL, "tokenValidFrom" = NOW()
WHERE "role" IN ('PHARMACIST', 'MANAGER', 'VIEWER');

-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'EXECUTIVE');
ALTER TABLE "public"."users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "public"."UserRole_old";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'ADMIN';
COMMIT;
