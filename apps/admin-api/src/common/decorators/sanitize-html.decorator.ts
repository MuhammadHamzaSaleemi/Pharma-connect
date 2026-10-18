import { Transform } from 'class-transformer';
import sanitizeHtml from 'sanitize-html';

// What the dashboard's TipTap editor (StarterKit + Underline + Link) produces. Anything else —
// scripts, event handlers, styles, iframes, javascript: links — is stripped before it is stored,
// because the website renders these fields with dangerouslySetInnerHTML.
const RICH_TEXT_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: 'p br h1 h2 h3 h4 h5 h6 strong b em i u s code pre blockquote ul ol li hr a'.split(
    ' ',
  ),
  allowedAttributes: { a: ['href', 'target', 'rel'] },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
};

export function sanitizeRichText(html: string): string {
  return sanitizeHtml(html, RICH_TEXT_OPTIONS);
}

/** Sanitizes a rich-text (HTML) DTO field on the way in. Runs before validation. */
export const SanitizeHtml = (): PropertyDecorator =>
  Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? sanitizeRichText(value) : value,
  );
