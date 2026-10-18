import { Transform } from 'class-transformer';

/**
 * Trims and lowercases an email DTO field, so `Jane@X.com` and `jane@x.com` are one account and log
 * in the same way. Stored emails are lowercased by migration 20261012000000_lowercase_user_emails.
 */
export const NormalizeEmail = (): PropertyDecorator =>
  Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  );
