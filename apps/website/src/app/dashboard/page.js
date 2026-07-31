'use client'
import React from "react";
import { useAuth } from "../../context/AuthContext";

export default function DashboardHome() {
    const { user } = useAuth();

    return (
        <div>
            <h4 className="mb-1 text-lg font-semibold text-gray-800">Welcome, {user?.name}</h4>
            <p className="text-sm text-gray-500">Signed in as {user?.role}.</p>
        </div>
    );
}
