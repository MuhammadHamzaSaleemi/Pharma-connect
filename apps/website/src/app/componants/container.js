import React from "react";

// One content-width + horizontal-padding rule for every section, instead of
// repeating `max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-16` per section.
export default function Container({ children, className = "" }) {
  return (
    <div className={`max-w-container mx-auto px-6 sm:px-12 lg:px-16 ${className}`}>
      {children}
    </div>
  );
}
