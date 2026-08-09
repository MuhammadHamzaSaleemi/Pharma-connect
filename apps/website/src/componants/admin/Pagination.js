'use client'
import React from "react";
import Button from "./ui/Button";

export default function Pagination({ meta, onPageChange }) {
    if (!meta || !meta.totalPages || meta.totalPages <= 1) return null;

    const { page, totalPages, total, limit } = meta;
    const from = total === 0 ? 0 : (page - 1) * limit + 1;
    const to = Math.min(page * limit, total);

    const goTo = (targetPage) => {
        if (targetPage < 1 || targetPage > totalPages || targetPage === page) return;
        onPageChange(targetPage);
    };

    return (
        <div className="flex flex-col gap-2 border-t border-gray-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-600">
                Showing <span className="font-medium">{from}</span>-<span className="font-medium">{to}</span> of{' '}
                <span className="font-medium">{total}</span>
            </p>
            <div className="flex items-center gap-1">
                <Button variant="secondary" size="sm" onClick={() => goTo(page - 1)} disabled={page <= 1}>
                    Previous
                </Button>
                <span className="px-3 py-1.5 text-sm text-gray-600 whitespace-nowrap">
                    Page {page} of {totalPages}
                </span>
                <Button variant="secondary" size="sm" onClick={() => goTo(page + 1)} disabled={page >= totalPages}>
                    Next
                </Button>
            </div>
        </div>
    );
}
