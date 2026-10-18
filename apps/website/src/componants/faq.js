"use client";
import React, { useState } from "react";
import Card from "./card";
import Icon from "./msIcon";

// Reusable accordion for any { q, a } list — About, Help Center, job/plan
// pages, wherever FAQ content shows up. Single item open at a time.
export default function Faq({ items, defaultOpenIndex = 0, className = "" }) {
  const [openIndex, setOpenIndex] = useState(defaultOpenIndex);

  return (
    <div className={`flex flex-col gap-space-sm ${className}`}>
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <Card
            key={item.q}
            padding="lg"
            hoverLift={false}
            className={open ? "shadow-md" : ""}
          >
            <div
              type="button"
              onClick={() => setOpenIndex(open ? -1 : i)}
              aria-expanded={open}
              className="w-full flex items-center justify-between gap-space-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-sm"
            >
              <span className="font-bold text-navy-surface">{item.q}</span>
              <Icon
                name="expand_more"
                className={`text-[22px] text-on-surface-variant shrink-0 transition-transform ${
                  open ? "rotate-180" : ""
                }`}
              />
            </div>
            {open && (
              <p className="text-sm text-on-surface-variant leading-relaxed mt-space-sm">
                {item.a}
              </p>
            )}
          </Card>
        );
      })}
    </div>
  );
}
