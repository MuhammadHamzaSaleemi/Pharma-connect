'use client'
import React, { useState } from "react";
import { LuPencil, LuTrash2 } from "react-icons/lu";
import { useAuth } from "../../../context/AuthContext";
import Table from "../../../componants/admin/Table";
import Modal from "../../../componants/admin/ui/Modal";
import Button from "../../../componants/admin/ui/Button";
import ConfirmDialog from "../../../componants/admin/ui/ConfirmDialog";
import DynamicForm from "../../../componants/admin/forms/DynamicForm";
import { scholarshipFormFields, scholarshipFormInitialValues } from "../../../services/scholarships/scholarships.form";
import {
    useScholarshipsQuery,
    useCreateScholarshipMutation,
    useUpdateScholarshipMutation,
    useDeleteScholarshipMutation,
} from "../../../services/scholarships/scholarships.queries";

const PAGE_SIZE = 10;

function toDateInputValue(isoString) {
    return isoString ? isoString.slice(0, 10) : '';
}

export default function DashboardScholarships() {
    const { accessToken } = useAuth();
    const [page, setPage] = useState(1);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingScholarship, setEditingScholarship] = useState(null);
    const [deletingScholarship, setDeletingScholarship] = useState(null);

    const scholarshipsQuery = useScholarshipsQuery(accessToken, { page, limit: PAGE_SIZE });
    const createScholarshipMutation = useCreateScholarshipMutation(accessToken);
    const updateScholarshipMutation = useUpdateScholarshipMutation(accessToken);
    const deleteScholarshipMutation = useDeleteScholarshipMutation(accessToken);

    const scholarships = scholarshipsQuery.data?.data ?? [];
    const meta = scholarshipsQuery.data?.meta ?? null;

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
            render: (row) => (
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" title="Edit" onClick={() => openEditModal(row)}>
                        <LuPencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Delete" onClick={() => setDeletingScholarship(row)}>
                        <LuTrash2 className="h-4 w-4 text-red-600" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <div className="mb-4 flex items-center justify-between">
                <h4 className="text-lg font-semibold text-gray-800">Scholarships</h4>
                <Button onClick={openAddModal}>Add Scholarship</Button>
            </div>

            <Table
                columns={columns}
                data={scholarships}
                isLoading={scholarshipsQuery.isLoading}
                error={scholarshipsQuery.isError ? (scholarshipsQuery.error?.message || 'Unable to load scholarships') : ''}
                emptyMessage="No scholarships found"
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
