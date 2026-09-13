import React from "react";
import Link from "next/link";
import Icon from "./msIcon";

// One button component for every CTA on the site instead of hand-rolled
// class strings per usage. Renders a <Link> when `href` is given, a real
// <button> otherwise — same look, same focus/hover/disabled behavior.
const VARIANTS = {
  primary:
    "bg-primary hover:bg-primary-container text-on-primary shadow-sm hover:shadow-md border-0",
  secondary:
    "bg-surface-card hover:bg-surface-container-low text-navy-surface border border-border-subtle shadow-sm",
  ghost: "text-primary hover:text-primary-container",
  dark: "bg-white/10 hover:bg-white/20 text-white border border-white/20",
  solidDark: "bg-verified-green hover:opacity-90 text-white",
};

const SIZES = {
  sm: "px-3 py-1.5 text-xs gap-1 rounded-lg",
  md: "px-space-lg py-space-sm text-sm gap-space-xs rounded-xl",
  lg: "px-space-xl py-space-sm text-sm gap-space-xs rounded-xl",
};

export default function Button({
  href,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  fullWidth = false,
  className = "",
  children,
  ...rest
}) {
  const base = `inline-flex items-center justify-center font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${
    fullWidth ? "w-full" : ""
  } ${SIZES[size] ?? SIZES.md} ${VARIANTS[variant] ?? VARIANTS.primary} ${className}`;

  const content = (
    <>
      {icon && iconPosition === "left" && (
        <Icon name={icon} className="text-[18px]" />
      )}
      {children}
      {icon && iconPosition === "right" && (
        <Icon name={icon} className="text-[18px]" />
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={base} {...rest}>
        {content}
      </Link>
    );
  }

  return (
    <button className={base} {...rest}>
      {content}
    </button>
  );
}
