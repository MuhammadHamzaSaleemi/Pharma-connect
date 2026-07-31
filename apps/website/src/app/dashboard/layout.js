'use client'
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { isAdminRole } from "../../lib/roles";
import AdminLayout from "../../componants/admin/AdminLayout";
import "./tailwind.css";

export default function DashboardLayout({ children }) {
    const router = useRouter();
    const { user, isAuthenticated, isLoading } = useAuth();
    const authorized = isAuthenticated && isAdminRole(user?.role);

    useEffect(() => {
        if (isLoading) return;
        if (!isAuthenticated) {
            router.replace('/login');
            return;
        }
        if (!isAdminRole(user?.role)) {
            router.replace('/');
        }
    }, [isLoading, isAuthenticated, user, router]);

    if (isLoading || !authorized) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" role="status"></div>
            </div>
        );
    }

    return <AdminLayout>{children}</AdminLayout>;
}
