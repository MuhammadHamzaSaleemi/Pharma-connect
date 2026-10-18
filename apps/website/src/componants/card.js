import React from "react";
import Link from "next/link";

// Shared surface for every card on the site: category tiles, feature tiles,
// blog cards, job cards. Renders a <Link> when `href` is given, a plain
// <div> otherwise, so hover/lift/border/radius/shadow stay identical
// regardless of whether the card is clickable.
const PADDING = {
  none: "",
  sm: "p-space-md",
  md: "p-space-lg",
  lg: "p-space-xl",
};

export default function Card({
  href,
  children,
  padding = "md",
  hoverLift = true,
  className = "",
  ...rest
}) {
  const base = `bg-surface-card rounded-2xl border border-border-subtle shadow-sm hover:shadow-md transition-all ${
    hoverLift ? "hover:-translate-y-1" : ""
  } ${PADDING[padding] ?? PADDING.md} ${className}`;

  if (href) {
    return (
      <Link href={href} className={base} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <div className={base} {...rest}>
      {children}
    </div>
  );
}
