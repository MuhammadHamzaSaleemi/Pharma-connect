'use client'
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import Button from "./ui/Button";

export default function Header() {
    const router = useRouter();
    const { user, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = async () => {
        setMenuOpen(false);
        await logout();
        router.push('/login');
    };

    return (
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
            <div />
            <div className="relative">
                <Button variant="ghost" size="sm" onClick={() => setMenuOpen(!menuOpen)}>
                    <Image src="/images/team/01.jpg" height={32} width={32} className="rounded-full" alt="" />
                    <span className="text-sm font-semibold text-gray-800">{user?.name}</span>
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
        </header>
    );
}
