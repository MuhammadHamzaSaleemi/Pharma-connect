import React from "react";

// Material Symbols glyph. Keep the icon_names subset in src/app/layout.js in
// sync with whatever names get used across the Tailwind homepage components.
export default function Icon({ name, className = "" }) {
  return (
    <span className={`material-symbols-outlined ${className}`}>{name}</span>
  );
}
