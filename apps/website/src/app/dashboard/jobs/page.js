'use client'
import React, { useState } from "react";
import { LuBriefcase, LuCheckCircle, LuFileText, LuHourglass, LuPencil, LuTrash2 } from "react-icons/lu";
import { useAuth } from "../../../context/AuthContext";
import Table from "../../../componants/admin/Table";
import Modal from "../../../componants/admin/ui/Modal";
import Button from "../../../componants/admin/ui/Button";
import RowActions from "../../../componants/admin/ui/RowActions";
import ConfirmDialog from "../../../componants/admin/ui/ConfirmDialog";
import StatCards from "../../../componants/admin/ui/StatCards";
import FilterBar from "../../../componants/admin/ui/FilterBar";
import DynamicForm from "../../../componants/admin/forms/DynamicForm";
import { jobFormFields, jobFormInitialValues } from "../../../services/jobs/jobs.form";
import { useJobsQuery, useJobStatsQuery, useCreateJobMutation, useUpdateJobMutation, useDeleteJobMutation, useBulkUploadJobsMutation } from "../../../services/jobs/jobs.queries";
import { WORK_TYPE_VALUES, JOB_STATUS_VALUES } from "../../../services/jobs/jobs.types";
import { enumToOptions } from "../../../lib/enumOptions";
import { useListFilters } from "../../../lib/useListFilters";

const PAGE_SIZE = 10;
const BULK_UPLOAD_COLUMNS = ['title', 'company', 'city', 'qualification', 'jobDescription', 'experience', 'workType', 'jobFunction', 'sector', 'status (optional)'];

const EMPTY_FILTERS = { search: '', status: '', workType: '' };
const SELECT_FILTERS = [
    { name: 'status', label: 'All statuses', options: enumToOptions(JOB_STATUS_VALUES) },
    { name: 'workType', label: 'All job types', options: enumToOptions(WORK_TYPE_VALUES) },
];

export default function DashboardJobs() {
    const { accessToken } = useAuth();
    const { page, setPage, filters, appliedFilters, updateFilter, isFiltered } = useListFilters(EMPTY_FILTERS);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingJob, setEditingJob] = useState(null);
    const [deletingJob, setDeletingJob] = useState(null);
    const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
    const [bulkFile, setBulkFile] = useState(null);
    const [bulkResult, setBulkResult] = useState(null);

    const jobsQuery = useJobsQuery(accessToken, { page, limit: PAGE_SIZE, ...appliedFilters });
    const statsQuery = useJobStatsQuery(accessToken);
    const createJobMutation = useCreateJobMutation(accessToken);
    const updateJobMutation = useUpdateJobMutation(accessToken);
    const deleteJobMutation = useDeleteJobMutation(accessToken);
    const bulkUploadMutation = useBulkUploadJobsMutation(accessToken);

    const jobs = jobsQuery.data?.data ?? [];
    const meta = jobsQuery.data?.meta ?? null;

    const stats = statsQuery.data;
    const statCards = [
        { label: 'Total Jobs', value: stats?.total, hint: stats && `${stats.byStatus.INACTIVE} inactive · ${stats.byStatus.CLOSED} closed`, icon: LuBriefcase, tone: 'bg-blue-50 text-blue-600', status: '' },
        { label: 'Active', value: stats?.byStatus.ACTIVE, hint: 'Live on the website', icon: LuCheckCircle, tone: 'bg-green-50 text-green-600', status: 'ACTIVE' },
        { label: 'Drafts', value: stats?.byStatus.DRAFT, hint: 'Not published yet', icon: LuFileText, tone: 'bg-gray-100 text-gray-600', status: 'DRAFT' },
        { label: 'Expiring Soon', value: stats?.expiringSoon, hint: 'Deleted within 7 days', icon: LuHourglass, tone: 'bg-amber-50 text-amber-600' },
    ];

    const openAddModal = () => {
        setEditingJob(null);
        setIsFormOpen(true);
    };

    const openEditModal = (job) => {
        setEditingJob(job);
        setIsFormOpen(true);
    };

    const handleSubmitJob = async (values) => {
        if (editingJob) {
            await updateJobMutation.mutateAsync({ id: editingJob.id, payload: values });
        } else {
            await createJobMutation.mutateAsync(values);
        }
        setIsFormOpen(false);
        setEditingJob(null);
        setPage(1);
    };

    const handleConfirmDelete = async () => {
        await deleteJobMutation.mutateAsync(deletingJob.id);
        setDeletingJob(null);
        if (jobs.length === 1 && page > 1) {
            setPage(page - 1);
        }
    };

    const openBulkUploadModal = () => {
        setBulkFile(null);
        setBulkResult(null);
        setIsBulkUploadOpen(true);
    };

    const handleBulkUpload = async () => {
        if (!bulkFile) return;
        const formData = new FormData();
        formData.append('file', bulkFile);
        const result = await bulkUploadMutation.mutateAsync(formData);
        setBulkResult(result);
        setBulkFile(null);
        setPage(1);
    };

    const columns = [
        { header: 'Title', accessor: 'title' },
        { header: 'Company', accessor: 'company' },
        { header: 'Qualification', accessor: 'qualification' },
        { header: 'Experience', accessor: 'experience' },
        { header: 'Work Type', accessor: 'workType' },
        { header: 'City', accessor: 'city' },
        { header: 'Status', accessor: 'status' },
        {
            header: 'Actions',
            className: 'w-px text-right',
            render: (row) => (
                <RowActions
                    actions={[
                        { label: 'Edit', icon: LuPencil, onClick: () => openEditModal(row) },
                        { label: 'Delete', icon: LuTrash2, onClick: () => setDeletingJob(row), danger: true },
                    ]}
                />
            ),
        },
    ];

    return (
        <div>
            <StatCards cards={statCards} stats={stats} selected={filters.status} onSelect={(status) => updateFilter('status', status)} />

            <FilterBar filters={filters} onChange={updateFilter} searchPlaceholder="Search title, company or city" selects={SELECT_FILTERS}>
                <Button variant="secondary" onClick={openBulkUploadModal}>Bulk Upload</Button>
                <Button onClick={openAddModal}>Add Job</Button>
            </FilterBar>

            <Table
                columns={columns}
                data={jobs}
                isLoading={jobsQuery.isLoading}
                error={jobsQuery.isError ? (jobsQuery.error?.message || 'Unable to load jobs') : ''}
                emptyMessage={isFiltered ? "No jobs match the selected filters" : "No jobs found"}
                meta={meta}
                onPageChange={setPage}
            />

            <Modal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                title={editingJob ? 'Edit Job' : 'Add Job'}
                maxWidth="6xl"
            >
                <DynamicForm
                    fields={jobFormFields}
                    initialValues={editingJob ?? jobFormInitialValues}
                    onSubmit={handleSubmitJob}
                    onCancel={() => setIsFormOpen(false)}
                    submitLabel={editingJob ? 'Update Job' : 'Create Job'}
                />
            </Modal>

            <ConfirmDialog
                isOpen={!!deletingJob}
                onClose={() => setDeletingJob(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Job"
                message={`Are you sure you want to delete "${deletingJob?.title}"? This action cannot be undone.`}
                confirmLabel="Delete"
            />

            <Modal isOpen={isBulkUploadOpen} onClose={() => setIsBulkUploadOpen(false)} title="Bulk Upload Jobs">
                <p className="mb-3 text-sm text-gray-600">
                    Upload an Excel (.xlsx) file whose first row has these column headers:
                </p>
                <p className="mb-4 rounded bg-gray-50 p-2 font-mono text-xs text-gray-700">
                    {BULK_UPLOAD_COLUMNS.join(', ')}
                </p>
                <a
                    href="/samples/jobs-bulk-upload-sample.xlsx"
                    download
                    className="mb-4 inline-block text-sm text-blue-600 hover:underline"
                >
                    Download sample file
                </a>

                <input
                    type="file"
                    accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    onChange={(e) => setBulkFile(e.target.files?.[0] ?? null)}
                    className="mb-4 block w-full text-sm text-gray-600"
                />

                {bulkUploadMutation.isError && (
                    <p className="mb-4 text-sm text-red-600">
                        {bulkUploadMutation.error?.message || 'Bulk upload failed'}
                    </p>
                )}

                {bulkResult && (
                    <div className="mb-4 rounded border border-gray-200 p-3 text-sm">
                        <p className="text-gray-800">
                            {bulkResult.created} of {bulkResult.totalRows} row(s) created
                            {bulkResult.failed > 0 ? `, ${bulkResult.failed} failed` : ''}.
                        </p>
                        {bulkResult.errors?.length > 0 && (
                            <ul className="mt-2 list-inside list-disc text-red-600">
                                {bulkResult.errors.map((error) => (
                                    <li key={error.row}>Row {error.row}: {error.message}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                <div className="flex justify-end gap-2">
                    <Button variant="secondary" onClick={() => setIsBulkUploadOpen(false)}>Close</Button>
                    <Button onClick={handleBulkUpload} disabled={!bulkFile || bulkUploadMutation.isPending}>
                        {bulkUploadMutation.isPending ? 'Uploading...' : 'Upload'}
                    </Button>
                </div>
            </Modal>
        </div>
    );
}
