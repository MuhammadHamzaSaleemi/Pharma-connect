'use client'
import React, { useState } from "react";
import { LuPencil, LuTrash2 } from "react-icons/lu";
import { useAuth } from "../../../context/AuthContext";
import Table from "../../../componants/admin/Table";
import Modal from "../../../componants/admin/ui/Modal";
import Button from "../../../componants/admin/ui/Button";
import ConfirmDialog from "../../../componants/admin/ui/ConfirmDialog";
import DynamicForm from "../../../componants/admin/forms/DynamicForm";
import { jobFormFields, jobFormInitialValues } from "../../../services/jobs/jobs.form";
import { useJobsQuery, useCreateJobMutation, useUpdateJobMutation, useDeleteJobMutation, useBulkUploadJobsMutation } from "../../../services/jobs/jobs.queries";

const PAGE_SIZE = 10;
const BULK_UPLOAD_COLUMNS = ['title', 'company', 'city', 'qualification', 'jobDescription', 'experience', 'workType', 'jobFunction', 'sector', 'status (optional)'];

export default function DashboardJobs() {
    const { accessToken } = useAuth();
    const [page, setPage] = useState(1);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingJob, setEditingJob] = useState(null);
    const [deletingJob, setDeletingJob] = useState(null);
    const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
    const [bulkFile, setBulkFile] = useState(null);
    const [bulkResult, setBulkResult] = useState(null);

    const jobsQuery = useJobsQuery(accessToken, { page, limit: PAGE_SIZE });
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
            render: (row) => (
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" title="Edit" onClick={() => openEditModal(row)}>
                        <LuPencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Delete" onClick={() => setDeletingJob(row)}>
                        <LuTrash2 className="h-4 w-4 text-red-600" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <div className="mb-4 flex items-center justify-between">
                <h4 className="text-lg font-semibold text-gray-800">Jobs</h4>
                <div className="flex items-center gap-2">
                    <Button variant="secondary" onClick={openBulkUploadModal}>Bulk Upload</Button>
                    <Button onClick={openAddModal}>Add Job</Button>
                </div>
            </div>

            <Table
                columns={columns}
                data={jobs}
                isLoading={jobsQuery.isLoading}
                error={jobsQuery.isError ? (jobsQuery.error?.message || 'Unable to load jobs') : ''}
                emptyMessage="No jobs found"
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
