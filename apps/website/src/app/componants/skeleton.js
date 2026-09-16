import React from "react";

// Single shimmering block reused by every card skeleton — keeps loading
// markup consistent instead of each skeleton rolling its own pulse div.
export default function Skeleton({ className = "" }) {
  return (
    <div className={`animate-pulse bg-surface-container-high rounded-md ${className}`} />
  );
}
