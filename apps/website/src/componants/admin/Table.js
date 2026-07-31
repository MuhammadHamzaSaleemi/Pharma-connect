'use client'
import React from "react";
import Pagination from "./Pagination";

/**
 * Reusable dashboard table.
 *
 * columns: Array<{
 *   header: string,
 *   accessor?: string,           // key on each row, used when `render` is omitted
 *   render?: (row) => ReactNode, // custom cell renderer
 *   className?: string,          // extra classes for both th and td
 * }>
 * data: Array<object>
 * keyField: string               // unique field on each row, defaults to 'id'
 * meta: { page, limit, total, totalPages } | null   // omit to render without pagination
 * onPageChange: (page: number) => void
 */
export default function Table({
    columns,
    data = [],
    keyField = 'id',
    isLoading = false,
    error = '',
    emptyMessage = 'No records found',
    meta = null,
    onPageChange,
}) {
    return (
        <div className="w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.accessor ?? column.header}
                                    className={`whitespace-nowrap px-4 py-3 text-left font-semibold text-gray-600 ${column.className ?? ''}`}
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading && (
                            <tr>
                                <td colSpan={columns.length} className="px-4 py-6 text-center text-gray-500">
                                    Loading...
                                </td>
                            </tr>
                        )}

                        {!isLoading && error && (
                            <tr>
                                <td colSpan={columns.length} className="px-4 py-6 text-center text-red-600">
                                    {error}
                                </td>
                            </tr>
                        )}

                        {!isLoading && !error && data.length === 0 && (
                            <tr>
                                <td colSpan={columns.length} className="px-4 py-6 text-center text-gray-500">
                                    {emptyMessage}
                                </td>
                            </tr>
                        )}

                        {!isLoading && !error && data.map((row) => (
                            <tr key={row[keyField]} className="hover:bg-gray-50">
                                {columns.map((column) => (
                                    <td
                                        key={column.accessor ?? column.header}
                                        className={`whitespace-nowrap px-4 py-3 text-gray-700 ${column.className ?? ''}`}
                                    >
                                        {column.render ? column.render(row) : row[column.accessor]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {onPageChange && <Pagination meta={meta} onPageChange={onPageChange} />}
        </div>
    );
}
