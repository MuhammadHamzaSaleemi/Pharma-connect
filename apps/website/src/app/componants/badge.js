import React from "react";

// Reusable status/trust pill: rounded, subtle tinted background, small dot,
// uppercase tracked-out label. One visual language for "live", "verified",
// "active", or "trusted" anywhere on the site — job listings, section
// eyebrows, content tags.
const TONES = {
  primary: {
    pill: "bg-primary/10 text-primary",
    dot: "bg-verified-green",
  },
  verified: {
    pill: "bg-verified-green/10 text-verified-green",
    dot: "bg-verified-green",
  },
  neutral: {
    pill: "bg-surface-container-low text-on-surface-variant",
    dot: "bg-on-surface-variant",
  },
  warning: {
    pill: "bg-status-warning/10 text-status-warning",
    dot: "bg-status-warning",
  },
  // For badges sitting on a dark surface (e.g. the navy newsletter band) —
  // the tinted tones above assume a light background and lose contrast here.
  dark: {
    pill: "bg-white/10 text-primary-fixed-dim",
    dot: "bg-verified-green",
  },
  // For badges sitting directly on a photo — a subtle tint disappears
  // against arbitrary image content, so this one is solid instead.
  solid: {
    pill: "bg-primary text-on-primary",
    dot: "bg-white",
  },
};

export default function Badge({
  children,
  tone = "primary",
  dot = true,
  pulse = false,
  uppercase = true,
  className = "",
  ...rest
}) {
  const t = TONES[tone] ?? TONES.primary;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest whitespace-nowrap ${
        uppercase ? "uppercase" : ""
      } ${t.pill} ${className}`}
      {...rest}
    >
      {dot &&
        (pulse ? (
          <span className="relative flex h-2 w-2 shrink-0">
            <span
              className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${t.dot}`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${t.dot}`}
            />
          </span>
        ) : (
          <span className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${t.dot}`} />
        ))}
      {children}
    </span>
  );
}
