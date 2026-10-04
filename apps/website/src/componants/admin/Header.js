'use client'
import React, { useEffect, useState } from "react";
import { LuCalendar, LuChevronDown, LuClock } from "react-icons/lu";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import Button from "./ui/Button";
import { findCurrentItem } from "./Sidebar";
import Breadcrumbs from "./Breadcrumbs";

// Current time, refreshed every 30s. Starts null so the server render and first client render match.
function useNow() {
    const [now, setNow] = useState(null);
    useEffect(() => {
        setNow(new Date());
        const id = setInterval(() => setNow(new Date()), 30000);
        return () => clearInterval(id);
    }, []);
    return now;
}

export default function Header() {
    const router = useRouter();
    const { user, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const title = findCurrentItem(usePathname()).label;
    const now = useNow();

    const handleLogout = async () => {
        setMenuOpen(false);
        await logout();
        router.push('/login');
    };

    return (
        <header className="flex h-16 flex-shrink-0 items-center justify-between gap-[16px] bg-white px-[24px] [border-bottom:1px_solid_rgb(229_231_235)]">
            <div className="flex min-w-0 flex-col gap-[2px]">
                <h1 className="mb-0 truncate text-lg font-semibold leading-tight text-gray-900">{title}</h1>
                <Breadcrumbs />
            </div>
            <div className="flex flex-shrink-0 items-center gap-[12px]">
                {now && (
                    <time
                        dateTime={now.toISOString()}
                        className="hidden h-9 items-center gap-[8px] whitespace-nowrap rounded-full bg-gray-50 px-[14px] text-sm text-gray-600 ring-1 ring-gray-200 md:flex"
                    >
                        <LuCalendar className="h-4 w-4 text-gray-400" aria-hidden="true" />
                        {now.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                        <span className="h-1 w-1 rounded-full bg-gray-300" aria-hidden="true" />
                        <LuClock className="h-4 w-4 text-gray-400" aria-hidden="true" />
                        <span className="font-medium tabular-nums text-gray-900">
                            {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </time>
                )}
                <div className="relative">
                    <Button variant="ghost" size="sm" className="h-9 rounded-full bg-transparent" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen}>
                        <Image src="/images/team/01.jpg" height={28} width={28} className="rounded-full" alt="" />
                        <span className="whitespace-nowrap text-sm font-semibold text-gray-900">{user?.name}</span>
                        <LuChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
                    </Button>

                    {menuOpen && (
                        <div className="absolute right-0 z-10 mt-2 w-48 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                            <span className="block px-4 py-2 text-xs text-gray-500">{user?.role}</span>
                            <div className="my-1 border-t border-gray-100" />
                            <Button variant="menuitem" size="sm" onClick={handleLogout}>
                                Logout
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
