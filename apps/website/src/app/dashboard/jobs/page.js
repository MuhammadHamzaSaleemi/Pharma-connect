'use client'
import React, { useEffect, useState } from "react";
import { LuPencil, LuTrash2 } from "react-icons/lu";
import { useAuth } from "../../../context/AuthContext";
import Table from "../../../componants/admin/Table";
import Modal from "../../../componants/admin/ui/Modal";
import Button from "../../../componants/admin/ui/Button";
import RowActions from "../../../componants/admin/ui/RowActions";
import ConfirmDialog from "../../../componants/admin/ui/ConfirmDialog";
import DynamicForm from "../../../componants/admin/forms/DynamicForm";
import { jobFormFields, jobFormInitialValues } from "../../../services/jobs/jobs.form";
import { useJobsQuery, useCreateJobMutation, useUpdateJobMutation, useDeleteJobMutation, useBulkUploadJobsMutation } from "../../../services/jobs/jobs.queries";
import { WORK_TYPE_VALUES, SECTOR_VALUES, JOB_STATUS_VALUES } from "../../../services/jobs/jobs.types";
import { enumToOptions } from "../../../lib/enumOptions";

const PAGE_SIZE = 10;
const BULK_UPLOAD_COLUMNS = ['title', 'company', 'city', 'qualification', 'jobDescription', 'experience', 'workType', 'jobFunction', 'sector', 'status (optional)'];

const EMPTY_FILTERS = {
    search: '', status: '', city: '', workType: '', sector: '', jobFunction: '',
    experience: '', createdFrom: '', createdTo: '', sort: 'createdAt:desc',
};
const SELECT_FILTERS = [
    { name: 'status', label: 'Status', options: enumToOptions(JOB_STATUS_VALUES) },
    { name: 'workType', label: 'Job Type', options: enumToOptions(WORK_TYPE_VALUES) },
    { name: 'sector', label: 'Sector', options: enumToOptions(SECTOR_VALUES) },
];
const TEXT_FILTERS = [
    { name: 'city', label: 'City', placeholder: 'e.g. Lahore' },
    { name: 'jobFunction', label: 'Department / Function', placeholder: 'e.g. Production' },
    { name: 'experience', label: 'Experience', placeholder: 'e.g. 2-4 years' },
];
const SORT_OPTIONS = [
    { value: 'createdAt:desc', label: 'Newest first' },
    { value: 'createdAt:asc', label: 'Oldest first' },
    { value: 'title:asc', label: 'Title (A-Z)' },
    { value: 'company:asc', label: 'Company (A-Z)' },
];
const CONTROL_CLASSES = 'h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

// Date inputs give local calendar days; widen "to" to end of day so the range is inclusive.
function toApiParams({ sort, createdFrom, createdTo, ...rest }) {
    const [sortBy, sortOrder] = sort.split(':');
    return {
        ...rest,
        sortBy,
        sortOrder: sortOrder.toUpperCase(),
        createdFrom: createdFrom && new Date(`${createdFrom}T00:00:00`).toISOString(),
        createdTo: createdTo && new Date(`${createdTo}T23:59:59.999`).toISOString(),
    };
}

export default function DashboardJobs() {
    const { accessToken } = useAuth();
    const [page, setPage] = useState(1);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingJob, setEditingJob] = useState(null);
    const [deletingJob, setDeletingJob] = useState(null);
    const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
    const [bulkFile, setBulkFile] = useState(null);
    const [bulkResult, setBulkResult] = useState(null);
    const [filters, setFilters] = useState(EMPTY_FILTERS);
    const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);

    // Debounce so typing in text filters doesn't fire a request per keystroke.
    useEffect(() => {
        const timer = setTimeout(() => {
            setAppliedFilters(filters);
            setPage(1);
        }, 400);
        return () => clearTimeout(timer);
    }, [filters]);

    const updateFilter = (name, value) => setFilters((prev) => ({ ...prev, [name]: value }));
    const activeFilterCount = Object.keys(EMPTY_FILTERS).filter((key) => key !== 'sort' && filters[key]).length;
    const isFiltered = activeFilterCount > 0 || filters.sort !== EMPTY_FILTERS.sort;

    const jobsQuery = useJobsQuery(accessToken, { page, limit: PAGE_SIZE, ...toApiParams(appliedFilters) });
    const createJobMutation = useCreateJobMutation(accessToken);
    const updateJobMutation = useUpdateJobMutation(accessToken);
    const deleteJobMutation = useDeleteJobMutation(accessToken);
    const bulkUploadMutation = useBulkUploadJobsMutation(accessToken);

    const jobs = jobsQuery.data?.data ?? [];
    const meta = jobsQuery.data?.meta ?? null;

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
            <div className="mb-4 flex items-center justify-end">
                <div className="flex items-center gap-2">
                    <Button variant="secondary" onClick={openBulkUploadModal}>Bulk Upload</Button>
                    <Button onClick={openAddModal}>Add Job</Button>
                </div>
            </div>

            <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <h5 className="text-sm font-semibold text-gray-700">
                        Filters
                        {activeFilterCount > 0 && (
                            <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                                {activeFilterCount} active
                            </span>
                        )}
                    </h5>
                    <div className="flex items-center gap-3">
                        {meta && <span className="text-xs text-gray-500">{meta.total} result(s)</span>}
                        <Button variant="secondary" size="sm" onClick={() => setFilters(EMPTY_FILTERS)} disabled={!isFiltered}>
                            Clear Filters
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="sm:col-span-2">
                        <label htmlFor="filter-search" className="mb-1 block text-sm font-medium text-gray-700">Search</label>
                        <input
                            id="filter-search"
                            type="search"
                            value={filters.search}
                            placeholder="Title, company or city"
                            onChange={(e) => updateFilter('search', e.target.value)}
                            className={CONTROL_CLASSES}
                        />
                    </div>

                    {SELECT_FILTERS.map(({ name, label, options }) => (
                        <div key={name}>
                            <label htmlFor={`filter-${name}`} className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
                            <select
                                id={`filter-${name}`}
                                value={filters[name]}
                                onChange={(e) => updateFilter(name, e.target.value)}
                                className={CONTROL_CLASSES}
                            >
                                <option value="">All</option>
                                {options.map((option) => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>
                    ))}

                    {TEXT_FILTERS.map(({ name, label, placeholder }) => (
                        <div key={name}>
                            <label htmlFor={`filter-${name}`} className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
                            <input
                                id={`filter-${name}`}
                                type="text"
                                value={filters[name]}
                                placeholder={placeholder}
                                onChange={(e) => updateFilter(name, e.target.value)}
                                className={CONTROL_CLASSES}
                            />
                        </div>
                    ))}

                    <div>
                        <label htmlFor="filter-createdFrom" className="mb-1 block text-sm font-medium text-gray-700">Posted From</label>
                        <input
                            id="filter-createdFrom"
                            type="date"
                            value={filters.createdFrom}
                            max={filters.createdTo || undefined}
                            onChange={(e) => updateFilter('createdFrom', e.target.value)}
                            className={CONTROL_CLASSES}
                        />
                    </div>
                    <div>
                        <label htmlFor="filter-createdTo" className="mb-1 block text-sm font-medium text-gray-700">Posted To</label>
                        <input
                            id="filter-createdTo"
                            type="date"
                            value={filters.createdTo}
                            min={filters.createdFrom || undefined}
                            onChange={(e) => updateFilter('createdTo', e.target.value)}
                            className={CONTROL_CLASSES}
                        />
                    </div>
                    <div>
                        <label htmlFor="filter-sort" className="mb-1 block text-sm font-medium text-gray-700">Sort By</label>
                        <select
                            id="filter-sort"
                            value={filters.sort}
                            onChange={(e) => updateFilter('sort', e.target.value)}
                            className={CONTROL_CLASSES}
                        >
                            {SORT_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

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
