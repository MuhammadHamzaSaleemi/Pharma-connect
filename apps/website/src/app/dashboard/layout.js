'use client'
import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { canAccessDashboard, canAccessPath } from "../../lib/roles";
import AdminLayout from "../../componants/admin/AdminLayout";
import "./tailwind.css";

export default function DashboardLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isAuthenticated, isLoading } = useAuth();
    const authorized = isAuthenticated && canAccessPath(user?.role, pathname);

    useEffect(() => {
        if (isLoading) return;
        if (!isAuthenticated) {
            router.replace('/login');
            return;
        }
        if (!canAccessDashboard(user?.role)) {
            router.replace('/');
            return;
        }
        // Typed or bookmarked a section this role can't open: send them to the dashboard home.
        if (!canAccessPath(user?.role, pathname)) {
            router.replace('/dashboard');
        }
    }, [isLoading, isAuthenticated, user, pathname, router]);

    if (isLoading || !authorized) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" role="status"></div>
            </div>
        );
    }

    return <AdminLayout>{children}</AdminLayout>;
}
