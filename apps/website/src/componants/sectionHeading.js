import React from "react";
import Badge from "./badge";

// The eyebrow + title + description block repeated at the top of every
// homepage section (Categories, Explore Jobs, Why PharmaConnect, Blog).
// The eyebrow renders as a Badge — same pill/dot language used for job
// listings and trust indicators, applied consistently to every section.
export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  eyebrowTone = "primary",
  className = "",
  descriptionClassName = "max-w-2xl",
}) {
  const centered = align === "center";

  return (
    <div className={`${centered ? "text-center mx-auto" : ""} ${className}`}>
      {eyebrow && (
        <Badge tone={eyebrowTone} dot={false} className="mb-2">
          {eyebrow}
        </Badge>
      )}
      <h2 className="text-3xl font-bold text-navy-surface">{title}</h2>
      {description && (
        <p
          className={`text-sm text-on-surface-variant mt-1 ${
            centered ? "mx-auto" : ""
          } ${descriptionClassName}`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
