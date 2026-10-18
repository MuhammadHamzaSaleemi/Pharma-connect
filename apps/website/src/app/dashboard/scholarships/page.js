'use client'
import React, { useState } from "react";
import { LuCalendarClock, LuCheckCircle, LuFileText, LuGraduationCap, LuPencil, LuTrash2 } from "react-icons/lu";
import { useAuth } from "../../../context/AuthContext";
import Table from "../../../componants/admin/Table";
import Modal from "../../../componants/admin/ui/Modal";
import Button from "../../../componants/admin/ui/Button";
import RowActions from "../../../componants/admin/ui/RowActions";
import ConfirmDialog from "../../../componants/admin/ui/ConfirmDialog";
import StatCards from "../../../componants/admin/ui/StatCards";
import FilterBar from "../../../componants/admin/ui/FilterBar";
import DynamicForm from "../../../componants/admin/forms/DynamicForm";
import { scholarshipFormFields, scholarshipFormInitialValues } from "../../../services/scholarships/scholarships.form";
import {
    useScholarshipsQuery,
    useScholarshipStatsQuery,
    useCreateScholarshipMutation,
    useUpdateScholarshipMutation,
    useDeleteScholarshipMutation,
} from "../../../services/scholarships/scholarships.queries";
import { SCHOLARSHIP_STATUS_VALUES } from "../../../services/scholarships/scholarships.types";
import { enumToOptions } from "../../../lib/enumOptions";
import { COUNTRY_OPTIONS } from "../../../lib/countries";
import { useListFilters } from "../../../lib/useListFilters";

const PAGE_SIZE = 10;
const EMPTY_FILTERS = { search: '', status: '', country: '' };
const SELECT_FILTERS = [
    { name: 'status', label: 'All statuses', options: enumToOptions(SCHOLARSHIP_STATUS_VALUES) },
    { name: 'country', label: 'All countries', options: COUNTRY_OPTIONS },
];

function toDateInputValue(isoString) {
    return isoString ? isoString.slice(0, 10) : '';
}

export default function DashboardScholarships() {
    const { accessToken } = useAuth();
    const { page, setPage, filters, appliedFilters, updateFilter, isFiltered } = useListFilters(EMPTY_FILTERS);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingScholarship, setEditingScholarship] = useState(null);
    const [deletingScholarship, setDeletingScholarship] = useState(null);

    const scholarshipsQuery = useScholarshipsQuery(accessToken, { page, limit: PAGE_SIZE, ...appliedFilters });
    const statsQuery = useScholarshipStatsQuery(accessToken);
    const createScholarshipMutation = useCreateScholarshipMutation(accessToken);
    const updateScholarshipMutation = useUpdateScholarshipMutation(accessToken);
    const deleteScholarshipMutation = useDeleteScholarshipMutation(accessToken);

    const scholarships = scholarshipsQuery.data?.data ?? [];
    const meta = scholarshipsQuery.data?.meta ?? null;

    const stats = statsQuery.data;
    const statCards = [
        { label: 'Total Scholarships', value: stats?.total, hint: stats && `${stats.byStatus.INACTIVE} inactive · ${stats.byStatus.EXPIRED} expired`, icon: LuGraduationCap, tone: 'bg-blue-50 text-blue-600', status: '' },
        { label: 'Active', value: stats?.byStatus.ACTIVE, hint: 'Open for applications', icon: LuCheckCircle, tone: 'bg-green-50 text-green-600', status: 'ACTIVE' },
        { label: 'Drafts', value: stats?.byStatus.DRAFT, hint: 'Not published yet', icon: LuFileText, tone: 'bg-gray-100 text-gray-600', status: 'DRAFT' },
        { label: 'Closing Soon', value: stats?.closingSoon, hint: 'Deadline within 45 days', icon: LuCalendarClock, tone: 'bg-amber-50 text-amber-600' },
    ];

    const openAddModal = () => {
        setEditingScholarship(null);
        setIsFormOpen(true);
    };

    const openEditModal = (scholarship) => {
        setEditingScholarship({
            ...scholarship,
            startDate: toDateInputValue(scholarship.startDate),
            endDate: toDateInputValue(scholarship.endDate),
        });
        setIsFormOpen(true);
    };

    const handleSubmitScholarship = async (values) => {
        if (editingScholarship) {
            await updateScholarshipMutation.mutateAsync({ id: editingScholarship.id, payload: values });
        } else {
            await createScholarshipMutation.mutateAsync(values);
        }
        setIsFormOpen(false);
        setEditingScholarship(null);
        setPage(1);
    };

    const handleConfirmDelete = async () => {
        await deleteScholarshipMutation.mutateAsync(deletingScholarship.id);
        setDeletingScholarship(null);
        if (scholarships.length === 1 && page > 1) {
            setPage(page - 1);
        }
    };

    const columns = [
        { header: 'Country', accessor: 'country' },
        { header: 'Start Date', render: (row) => new Date(row.startDate).toLocaleDateString() },
        { header: 'End Date', render: (row) => new Date(row.endDate).toLocaleDateString() },
        { header: 'Eligibility Criteria', accessor: 'eligibilityCriteria' },
        { header: 'Status', accessor: 'status' },
        {
            header: 'Actions',
            className: 'w-px text-right',
            render: (row) => (
                <RowActions
                    actions={[
                        { label: 'Edit', icon: LuPencil, onClick: () => openEditModal(row) },
                        { label: 'Delete', icon: LuTrash2, onClick: () => setDeletingScholarship(row), danger: true },
                    ]}
                />
            ),
        },
    ];

    return (
        <div>
            <StatCards cards={statCards} stats={stats} selected={filters.status} onSelect={(status) => updateFilter('status', status)} />

            <FilterBar filters={filters} onChange={updateFilter} searchPlaceholder="Search country, benefits or eligibility" selects={SELECT_FILTERS}>
                <Button onClick={openAddModal}>Add Scholarship</Button>
            </FilterBar>

            <Table
                columns={columns}
                data={scholarships}
                isLoading={scholarshipsQuery.isLoading}
                error={scholarshipsQuery.isError ? (scholarshipsQuery.error?.message || 'Unable to load scholarships') : ''}
                emptyMessage={isFiltered ? "No scholarships match the selected filters" : "No scholarships found"}
                meta={meta}
                onPageChange={setPage}
            />

            <Modal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                title={editingScholarship ? 'Edit Scholarship' : 'Add Scholarship'}
                maxWidth="6xl"
            >
                <DynamicForm
                    fields={scholarshipFormFields}
                    initialValues={editingScholarship ?? scholarshipFormInitialValues}
                    onSubmit={handleSubmitScholarship}
                    onCancel={() => setIsFormOpen(false)}
                    submitLabel={editingScholarship ? 'Update Scholarship' : 'Create Scholarship'}
                />
            </Modal>

            <ConfirmDialog
                isOpen={!!deletingScholarship}
                onClose={() => setDeletingScholarship(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Scholarship"
                message={`Are you sure you want to delete the scholarship for "${deletingScholarship?.country}"? This action cannot be undone.`}
                confirmLabel="Delete"
            />
        </div>
    );
}
