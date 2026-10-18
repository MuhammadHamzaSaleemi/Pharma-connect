-- Emails are now trimmed and lowercased on the way in (NormalizeEmail), so existing rows must match
-- or those users could no longer sign in. If two accounts differ only by case this fails on the
-- unique index: merge or rename one of them, then rerun.
UPDATE "users"
SET "email" = LOWER(TRIM("email"))
WHERE "email" <> LOWER(TRIM("email"));
