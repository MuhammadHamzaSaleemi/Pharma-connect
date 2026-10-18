'use client'
import React from "react";
import Link from "next/link";

// Row of dashboard counters. A card with an `href` is a link; one with a `status` ('' = all) is a
// button that calls onSelect(status) and shows as selected when it matches `selected`; one with
// neither is display-only. Values show a placeholder bar until `stats` (whatever the page's stats
// query returned) has loaded.
// Spacing and outlines use arbitrary values / rings: Bootstrap's !important p-/m-/gap-N,
// .border and .shadow-sm utilities override the same-named Tailwind classes.
export default function StatCards({ cards, stats, selected, onSelect, className = 'mb-[24px]' }) {
    return (
        <div className={`grid grid-cols-1 gap-[16px] sm:grid-cols-[repeat(auto-fit,minmax(220px,1fr))] ${className}`}>
            {cards.map(({ label, value, hint, icon: Icon, tone, status, href }) => {
                const clickable = status !== undefined;
                const isSelected = clickable && selected === status;
                const interactive = clickable || href;
                const Card = href ? Link : clickable ? 'button' : 'div';
                const props = href
                    ? { href }
                    : clickable && { type: 'button', onClick: () => onSelect(status), 'aria-pressed': isSelected };
                return (
                    <Card
                        key={label}
                        {...props}
                        className={`group flex min-w-0 items-start justify-between gap-[12px] rounded-xl border-0 bg-white px-[20px] py-[18px] text-left no-underline shadow-[0_1px_2px_rgba(16,24,40,0.05)] transition ${
                            isSelected ? 'ring-2 ring-blue-500' : 'ring-1 ring-gray-200'
                        } ${interactive && !isSelected ? 'hover:-translate-y-[1px] hover:shadow-[0_4px_12px_rgba(16,24,40,0.08)] hover:ring-blue-200' : ''}`}
                    >
                        <span className="flex min-w-0 flex-col gap-[4px]">
                            <span className="truncate text-sm font-medium text-gray-500">{label}</span>
                            {stats ? (
                                <span className="text-[28px] font-semibold leading-tight tabular-nums tracking-tight text-gray-900">{value ?? 0}</span>
                            ) : (
                                <span className="my-[6px] block h-[24px] w-[56px] animate-pulse rounded-md bg-gray-100" aria-label="Loading" />
                            )}
                            {hint && <span className="truncate text-xs text-gray-400">{stats ? hint : ' '}</span>}
                        </span>
                        <span className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${tone}`}>
                            <Icon className="h-5 w-5" />
                        </span>
                    </Card>
                );
            })}
        </div>
    );
}
