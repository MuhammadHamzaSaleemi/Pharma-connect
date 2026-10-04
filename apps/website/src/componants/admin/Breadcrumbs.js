'use client'
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuHome, LuChevronRight } from "react-icons/lu";
import { SIDEBAR_ITEMS, findCurrentItem } from "./Sidebar";

// Spacing uses arbitrary values: Bootstrap's !important p-/m-/gap-N utilities override Tailwind's.
export default function Breadcrumbs() {
    const current = findCurrentItem(usePathname());
    const home = SIDEBAR_ITEMS[0];
    const crumbs = current === home ? [home] : [home, current];

    return (
        <nav aria-label="Breadcrumb">
            <ol className="mb-0 flex list-none items-center gap-[4px] pl-0 text-xs">
                {crumbs.map((crumb, i) => {
                    const last = i === crumbs.length - 1;
                    return (
                        <li key={crumb.href} className="flex items-center gap-[4px]">
                            {i > 0 && <LuChevronRight className="h-3 w-3 text-gray-300" aria-hidden="true" />}
                            {last ? (
                                <span aria-current="page" className="flex items-center gap-[4px] font-medium text-gray-700">
                                    {i === 0 && <LuHome className="h-3.5 w-3.5" aria-hidden="true" />}
                                    {crumb.label}
                                </span>
                            ) : (
                                <Link
                                    href={crumb.href}
                                    className="flex items-center gap-[4px] text-gray-400 no-underline transition-colors hover:text-blue-600"
                                >
                                    {i === 0 && <LuHome className="h-3.5 w-3.5" aria-hidden="true" />}
                                    {crumb.label}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
