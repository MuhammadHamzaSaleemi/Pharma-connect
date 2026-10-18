'use client'
import React, { useState } from "react";
import { LuCheckCircle, LuFileText, LuNewspaper, LuStar, LuPencil, LuTrash2 } from "react-icons/lu";
import { useAuth } from "../../../context/AuthContext";
import Table from "../../../componants/admin/Table";
import Modal from "../../../componants/admin/ui/Modal";
import Button from "../../../componants/admin/ui/Button";
import RowActions from "../../../componants/admin/ui/RowActions";
import ConfirmDialog from "../../../componants/admin/ui/ConfirmDialog";
import StatCards from "../../../componants/admin/ui/StatCards";
import FilterBar from "../../../componants/admin/ui/FilterBar";
import DynamicForm from "../../../componants/admin/forms/DynamicForm";
import { blogFormFields, blogFormInitialValues, buildBlogFormData } from "../../../services/blogs/blogs.form";
import {
    useBlogsQuery,
    useBlogStatsQuery,
    useCreateBlogMutation,
    useUpdateBlogMutation,
    useDeleteBlogMutation,
} from "../../../services/blogs/blogs.queries";
import { BLOG_STATUS_VALUES } from "../../../services/blogs/blogs.types";
import { enumToOptions } from "../../../lib/enumOptions";
import { useListFilters } from "../../../lib/useListFilters";

const PAGE_SIZE = 10;
const EMPTY_FILTERS = { search: '', status: '', isFeatured: '' };
const SELECT_FILTERS = [
    { name: 'status', label: 'All statuses', options: enumToOptions(BLOG_STATUS_VALUES) },
    { name: 'isFeatured', label: 'All posts', options: [{ value: 'true', label: 'Featured' }, { value: 'false', label: 'Not featured' }] },
];

function toDateInputValue(isoString) {
    return isoString ? isoString.slice(0, 10) : '';
}

export default function DashboardBlogs() {
    const { accessToken } = useAuth();
    const { page, setPage, filters, appliedFilters, updateFilter, isFiltered } = useListFilters(EMPTY_FILTERS);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);
    const [deletingBlog, setDeletingBlog] = useState(null);

    const blogsQuery = useBlogsQuery(accessToken, { page, limit: PAGE_SIZE, ...appliedFilters });
    const statsQuery = useBlogStatsQuery(accessToken);
    const createBlogMutation = useCreateBlogMutation(accessToken);
    const updateBlogMutation = useUpdateBlogMutation(accessToken);
    const deleteBlogMutation = useDeleteBlogMutation(accessToken);

    const blogs = blogsQuery.data?.data ?? [];
    const meta = blogsQuery.data?.meta ?? null;

    const stats = statsQuery.data;
    const statCards = [
        { label: 'Total Blogs', value: stats?.total, hint: 'All posts', icon: LuNewspaper, tone: 'bg-blue-50 text-blue-600', status: '' },
        { label: 'Published', value: stats?.byStatus.PUBLISHED, hint: 'Status: published', icon: LuCheckCircle, tone: 'bg-green-50 text-green-600', status: 'PUBLISHED' },
        { label: 'Drafts', value: stats?.byStatus.DRAFT, hint: 'Not published yet', icon: LuFileText, tone: 'bg-gray-100 text-gray-600', status: 'DRAFT' },
        { label: 'Featured', value: stats?.featured, hint: 'Marked as featured', icon: LuStar, tone: 'bg-amber-50 text-amber-600' },
    ];

    const openAddModal = () => {
        setEditingBlog(null);
        setIsFormOpen(true);
    };

    const openEditModal = (blog) => {
        setEditingBlog({
            ...blog,
            tags: (blog.tags ?? []).join(', '),
            publishedAt: toDateInputValue(blog.publishedAt),
        });
        setIsFormOpen(true);
    };

    const handleSubmitBlog = async (values) => {
        const formData = buildBlogFormData(values);
        if (editingBlog) {
            await updateBlogMutation.mutateAsync({ id: editingBlog.id, formData });
        } else {
            await createBlogMutation.mutateAsync(formData);
        }
        setIsFormOpen(false);
        setEditingBlog(null);
        setPage(1);
    };

    const handleConfirmDelete = async () => {
        await deleteBlogMutation.mutateAsync(deletingBlog.id);
        setDeletingBlog(null);
        if (blogs.length === 1 && page > 1) {
            setPage(page - 1);
        }
    };

    const columns = [
        { header: 'Title', accessor: 'title' },
        { header: 'Category', accessor: 'category' },
        { header: 'Status', accessor: 'status' },
        { header: 'Featured', render: (row) => (row.isFeatured ? 'Yes' : 'No') },
        { header: 'Published', render: (row) => (row.publishedAt ? new Date(row.publishedAt).toLocaleDateString() : '—') },
        {
            header: 'Actions',
            className: 'w-px text-right',
            render: (row) => (
                <RowActions
                    actions={[
                        { label: 'Edit', icon: LuPencil, onClick: () => openEditModal(row) },
                        { label: 'Delete', icon: LuTrash2, onClick: () => setDeletingBlog(row), danger: true },
                    ]}
                />
            ),
        },
    ];

    return (
        <div>
            <StatCards cards={statCards} stats={stats} selected={filters.status} onSelect={(status) => updateFilter('status', status)} />

            <FilterBar filters={filters} onChange={updateFilter} searchPlaceholder="Search title, category or excerpt" selects={SELECT_FILTERS}>
                <Button onClick={openAddModal}>Add Blog</Button>
            </FilterBar>

            <Table
                columns={columns}
                data={blogs}
                isLoading={blogsQuery.isLoading}
                error={blogsQuery.isError ? (blogsQuery.error?.message || 'Unable to load blogs') : ''}
                emptyMessage={isFiltered ? "No blogs match the selected filters" : "No blogs found"}
                meta={meta}
                onPageChange={setPage}
            />

            <Modal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                title={editingBlog ? 'Edit Blog' : 'Add Blog'}
                maxWidth="6xl"
            >
                <DynamicForm
                    fields={blogFormFields}
                    initialValues={editingBlog ?? blogFormInitialValues}
                    onSubmit={handleSubmitBlog}
                    onCancel={() => setIsFormOpen(false)}
                    submitLabel={editingBlog ? 'Update Blog' : 'Create Blog'}
                />
            </Modal>

            <ConfirmDialog
                isOpen={!!deletingBlog}
                onClose={() => setDeletingBlog(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Blog"
                message={`Are you sure you want to delete "${deletingBlog?.title}"? This action cannot be undone.`}
                confirmLabel="Delete"
            />
        </div>
    );
}
