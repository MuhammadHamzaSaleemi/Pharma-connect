'use client'
import React from "react";

const CONTROL_CLASSES = 'h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

// Toolbar above a dashboard table: search box and select filters on the left, page actions
// (`children`) on the right. `selects` items are { name, label, options }; `label` doubles as
// the "all" option. The filter values themselves live in `filters` (see useListFilters).
export default function FilterBar({ filters, onChange, searchPlaceholder, selects, children }) {
    return (
        <div className="mb-3 flex flex-col gap-2 lg:flex-row lg:items-center">
            <div className="flex flex-1 flex-col gap-2 sm:flex-row">
                <input
                    type="search"
                    aria-label={searchPlaceholder}
                    value={filters.search}
                    placeholder={searchPlaceholder}
                    onChange={(e) => onChange('search', e.target.value)}
                    className={`${CONTROL_CLASSES} sm:max-w-xs`}
                />
                {selects.map(({ name, label, options }) => (
                    <select
                        key={name}
                        aria-label={label}
                        value={filters[name]}
                        onChange={(e) => onChange(name, e.target.value)}
                        className={`${CONTROL_CLASSES} select-chevron sm:w-44`}
                    >
                        <option value="">{label}</option>
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                ))}
            </div>
            <div className="flex shrink-0 justify-end gap-2">{children}</div>
        </div>
    );
}
