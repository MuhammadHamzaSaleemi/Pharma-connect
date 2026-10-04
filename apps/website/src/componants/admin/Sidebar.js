'use client'
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LuLayoutDashboard, LuBriefcase, LuGraduationCap, LuNewspaper, LuPanelLeftClose, LuPanelLeftOpen } from "react-icons/lu";

export const SIDEBAR_ITEMS = [
    { label: 'Dashboard', href: '/dashboard', icon: LuLayoutDashboard },
    { label: 'Jobs', href: '/dashboard/jobs', icon: LuBriefcase },
    { label: 'Scholarships', href: '/dashboard/scholarships', icon: LuGraduationCap },
    { label: 'Blogs', href: '/dashboard/blogs', icon: LuNewspaper },
];

export const isActive = (pathname, href) =>
    href === '/dashboard' ? pathname === href : pathname.startsWith(href);

// The nav item for the current route; drives the header title and breadcrumbs too.
export const findCurrentItem = (pathname) =>
    SIDEBAR_ITEMS.find((item) => isActive(pathname, item.href)) ?? SIDEBAR_ITEMS[0];

// Fixed square for every icon. The collapsed width (68px) = 12px gutter + 44px slot + 12px gutter,
// so icons sit dead-centre when collapsed and never move while the width animates.
const ICON_SLOT = 'flex h-11 w-11 flex-shrink-0 items-center justify-center';

// Shared fade for anything that should disappear when the sidebar collapses.
const fade = (collapsed) => `transition-opacity duration-200 ${collapsed ? 'opacity-0' : 'opacity-100 delay-100'}`;

export default function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    // Start collapsed on small screens so the content area keeps its room.
    useEffect(() => {
        if (window.matchMedia('(max-width: 767px)').matches) setCollapsed(true);
    }, []);

    return (
        <aside
            className={`flex h-full flex-shrink-0 flex-col overflow-y-auto overflow-x-hidden bg-[#0F172A] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden text-slate-100 shadow-xl shadow-black/10 transition-[width] duration-300 ease-in-out ${
                collapsed ? 'w-[68px]' : 'w-64'
            }`}
        >
            {/* Logo: full wordmark when open, mark only when collapsed. Both stay mounted so they can crossfade. */}
            <Link
                href="/dashboard"
                aria-label="PharmaConnect dashboard"
                className="relative flex h-16 flex-shrink-0 items-center px-[20px] [border-bottom:1px_solid_rgb(255_255_255/0.1)]"
            >
                <Image
                    src="/images/logo.png"
                    alt="PharmaConnect"
                    width={525}
                    height={222}
                    priority
                    className={`h-10 w-auto ${fade(collapsed)}`}
                />
                <Image
                    src="/images/single-logo.png"
                    alt=""
                    width={512}
                    height={512}
                    priority
                    className={`absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 rounded-lg -translate-y-1/2 transition-opacity duration-200 ${
                        collapsed ? 'opacity-100 delay-100' : 'opacity-0'
                    }`}
                />
            </Link>

            <nav className="flex flex-col gap-[4px] px-[12px] py-[20px]">
                <p className={`mb-[8px] whitespace-nowrap px-[12px] text-[11px] font-semibold uppercase tracking-wider text-slate-500 ${fade(collapsed)}`}>
                    Menu
                </p>
                {SIDEBAR_ITEMS.map((item) => {
                    const active = isActive(pathname, item.href);
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            title={collapsed ? item.label : undefined}
                            aria-current={active ? 'page' : undefined}
                            className={`group relative flex h-11 items-center rounded-xl text-sm font-medium no-underline transition-colors duration-200 ${
                                active
                                    ? 'bg-blue-500/15 text-white'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            <span
                                className={`absolute -left-3 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-blue-500 transition-opacity duration-200 ${
                                    active ? 'opacity-100' : 'opacity-0'
                                }`}
                            />
                            <span className={ICON_SLOT}>
                                <Icon
                                    className={`h-5 w-5 transition-colors ${
                                        active ? 'text-blue-400' : 'text-slate-400 group-hover:text-white'
                                    }`}
                                />
                            </span>
                            <span className={`whitespace-nowrap ${fade(collapsed)}`}>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto flex flex-col gap-[12px] p-[12px]">
                <div
                    className={`overflow-hidden rounded-xl border-[1px] border-solid border-blue-500/30 bg-blue-500/10 transition-all duration-300 ${
                        collapsed ? 'max-h-0 p-0 opacity-0' : 'max-h-40 p-[16px] opacity-100'
                    }`}
                >
                    <p className="mb-0 whitespace-nowrap text-xs font-semibold tracking-wide text-blue-400">PRO SUPPORT</p>
                    <p className="mb-0 mt-1.5 w-52 text-xs leading-relaxed text-slate-300">
                        Regulatory compliance assistance is available 24/7.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setCollapsed((prev) => !prev)}
                    aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    aria-expanded={!collapsed}
                    title={collapsed ? 'Expand sidebar' : undefined}
                    className="flex h-11 items-center rounded-xl border-none bg-transparent p-0 text-sm font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                    <span className={ICON_SLOT}>
                        {collapsed ? <LuPanelLeftOpen className="h-5 w-5" /> : <LuPanelLeftClose className="h-5 w-5" />}
                    </span>
                    <span className={`whitespace-nowrap ${fade(collapsed)}`}>Collapse</span>
                </button>
            </div>
        </aside>
    );
}
