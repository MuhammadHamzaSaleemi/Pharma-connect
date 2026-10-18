import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AdminLayout({ children }) {
    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            <Sidebar />
            <div className="flex min-w-0 flex-1 flex-col">
                <Header />
                <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-[16px] py-[16px] sm:px-[24px] sm:py-[24px]">{children}</main>
            </div>
        </div>
    );
}
