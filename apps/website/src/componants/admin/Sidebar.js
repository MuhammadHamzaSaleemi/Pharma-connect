'use client'
import React, { useState } from "react";
import Link from "next/link";
import Button from "@/componants/admin/ui/Button";
import { usePathname } from "next/navigation";
import { LuLayoutDashboard, LuBriefcase, LuGraduationCap, LuNewspaper, LuMenu, LuX, LuPanelLeftClose, LuPanelLeftOpen } from "react-icons/lu";

const SIDEBAR_ITEMS = [
    { label: 'Dashboard', href: '/dashboard', icon: LuLayoutDashboard },
    { label: 'Jobs', href: '/dashboard/jobs', icon: LuBriefcase },
    { label: 'Scholarships', href: '/dashboard/scholarships', icon: LuGraduationCap },
    { label: 'Blogs', href: '/dashboard/blogs', icon: LuNewspaper },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside
            className={`relative flex flex-shrink-0 flex-col overflow-hidden bg-[#0F172A] text-slate-100 shadow-2xl shadow-black/20 transition-[width] duration-300 ease-in-out ${
                collapsed ? 'w-20' : 'w-[260px]'
            }`}
        >
            <div className="flex items-center justify-between gap-2 p-3">
                <div className={`overflow-hidden transition-all duration-300 ${collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                    <Link href="/dashboard" className="block whitespace-nowrap text-lg font-bold text-white no-underline">
                        PharmaConnect
                    </Link>
                    <p className="mt-0.5 whitespace-nowrap text-xs text-slate-400">Professional Portal</p>
                </div>

                <Button
                    type="button"
                    onClick={() => setCollapsed((prev) => !prev)}
                    aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    aria-expanded={!collapsed}
                    variant="default"
                    size="icon"
                    className="focus:outline-none"
                >
                    {collapsed ? <LuPanelLeftOpen className="h-5 w-5" /> : <LuPanelLeftClose className="h-5 w-5" />}
                </Button>
            </div>

            <nav className="flex flex-col gap-1.5 px-3">
                {SIDEBAR_ITEMS.map((item) => {
                    const active = pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            title={collapsed ? item.label : undefined}
                            className={`group relative flex items-center gap-3 rounded-2xl py-3.5 text-sm font-medium no-underline transition-all duration-200 ${
                                collapsed ? 'justify-center' : 'justify-start px-4'
                            } ${
                                active
                                    ? 'bg-blue-500/15 text-white'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            <span
                                className={`absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-blue-500 transition-opacity duration-200 ${
                                    active && !collapsed ? 'opacity-100' : 'opacity-0'
                                }`}
                            />
                            <Icon className={`h-5 w-5 flex-shrink-0 ${active ? 'text-blue-400' : ''}`} />
                            <span
                                className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
                                    collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                                }`}
                            >
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto p-4">
                <div
                    className={`overflow-hidden rounded-2xl border border-blue-500/30 bg-blue-500/10 p-4 transition-all duration-300 ${
                        collapsed ? 'max-h-0 p-0 opacity-0' : 'max-h-40 opacity-100'
                    }`}
                >
                    <p className="whitespace-nowrap text-xs font-semibold tracking-wide text-blue-400">PRO SUPPORT</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
                        Regulatory compliance assistance is available 24/7.
                    </p>
                </div>
            </div>
        </aside>
    );
}
