'use client'
import { useEffect, useState } from "react";

// Filter + page state for a dashboard list. `filters` drives the inputs; `appliedFilters`
// trails it by 400ms so typing in search doesn't fire a request per keystroke. Any filter
// change sends the list back to page 1.
export function useListFilters(emptyFilters) {
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState(emptyFilters);
    const [appliedFilters, setAppliedFilters] = useState(emptyFilters);

    useEffect(() => {
        const timer = setTimeout(() => {
            setAppliedFilters(filters);
            setPage(1);
        }, 400);
        return () => clearTimeout(timer);
    }, [filters]);

    const updateFilter = (name, value) => setFilters((prev) => ({ ...prev, [name]: value }));
    const isFiltered = Object.values(filters).some(Boolean);

    return { page, setPage, filters, appliedFilters, updateFilter, isFiltered };
}
