'use client'
import React, { useEffect, useState } from "react";
import { LuPencil, LuTrash2, LuSearch, LuCheckCircle2, LuX } from "react-icons/lu";
import { useAuth } from "../../../context/AuthContext";
import Table from "../../../componants/admin/Table";
import Modal from "../../../componants/admin/ui/Modal";
import Button from "../../../componants/admin/ui/Button";
import RowActions from "../../../componants/admin/ui/RowActions";
import ConfirmDialog from "../../../componants/admin/ui/ConfirmDialog";
import DynamicForm from "../../../componants/admin/forms/DynamicForm";
import { getUserFormFields, userFormInitialValues } from "../../../services/users/users.form";
import { USER_ROLE_VALUES, USER_STATUS_VALUES } from "../../../services/users/users.types";
import {
    useUsersQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
} from "../../../services/users/users.queries";
import { enumToOptions, formatEnumLabel } from "../../../lib/enumOptions";

const PAGE_SIZE = 10;
const EMPTY_FILTERS = { search: '', role: '', status: '' };
const CONTROL_BASE_CLASSES = 'h-10 w-full rounded-md border border-gray-300 bg-white text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500';
const CONTROL_CLASSES = `${CONTROL_BASE_CLASSES} px-3`;
// Bootstrap's `.px-3` is `!important` and would override a Tailwind `pl-*`, so the search input sets each side itself.
const SEARCH_INPUT_CLASSES = `${CONTROL_BASE_CLASSES} block pl-10 pr-3`;

const STATUS_BADGE_CLASSES = {
    ACTIVE: 'bg-green-50 text-green-700 ring-green-600/20',
    INACTIVE: 'bg-gray-100 text-gray-600 ring-gray-500/20',
    SUSPENDED: 'bg-red-50 text-red-700 ring-red-600/20',
    PENDING_VERIFICATION: 'bg-amber-50 text-amber-700 ring-amber-600/20',
};
const ROLE_BADGE_CLASSES = {
    SUPER_ADMIN: 'bg-purple-50 text-purple-700 ring-purple-600/20',
    ADMIN: 'bg-blue-50 text-blue-700 ring-blue-600/20',
    EXECUTIVE: 'bg-teal-50 text-teal-700 ring-teal-600/20',
};

function Badge({ value, classes }) {
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${classes[value] ?? 'bg-slate-50 text-slate-700 ring-slate-500/20'}`}>
            {formatEnumLabel(value)}
        </span>
    );
}

// Drop blanks so the API never sees `?role=` (rejected by IsEnum) or an empty password on edit.
const withoutEmpty = (object) => Object.fromEntries(Object.entries(object).filter(([, value]) => value !== ''));

export default function DashboardUsers() {
    const { accessToken, user: currentUser } = useAuth();
    const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState(EMPTY_FILTERS);
    const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [deletingUser, setDeletingUser] = useState(null);
    const [notice, setNotice] = useState('');

    // Debounce so typing in the search box doesn't fire a request per keystroke.
    useEffect(() => {
        const timer = setTimeout(() => {
            setAppliedFilters(filters);
            setPage(1);
        }, 400);
        return () => clearTimeout(timer);
    }, [filters]);

    useEffect(() => {
        if (!notice) return;
        const timer = setTimeout(() => setNotice(''), 4000);
        return () => clearTimeout(timer);
    }, [notice]);

    const usersQuery = useUsersQuery(accessToken, { page, limit: PAGE_SIZE, ...withoutEmpty(appliedFilters) });
    const createUserMutation = useCreateUserMutation(accessToken);
    const updateUserMutation = useUpdateUserMutation(accessToken);
    const deleteUserMutation = useDeleteUserMutation(accessToken);

    const users = usersQuery.data?.data ?? [];
    const meta = usersQuery.data?.meta ?? null;
    const isFiltered = Object.values(filters).some(Boolean);

    const updateFilter = (name, value) => setFilters((prev) => ({ ...prev, [name]: value }));

    const openAddModal = () => {
        setEditingUser(null);
        setIsFormOpen(true);
    };

    const openEditModal = (user) => {
        setEditingUser(user);
        setIsFormOpen(true);
    };

    const closeFormModal = () => {
        setIsFormOpen(false);
        setEditingUser(null);
    };

    const handleSubmitUser = async (values) => {
        const payload = withoutEmpty(values);
        if (editingUser) {
            await updateUserMutation.mutateAsync({ id: editingUser.id, payload });
            setNotice(`${payload.name} was updated.`);
        } else {
            await createUserMutation.mutateAsync(payload);
            setNotice(`${payload.name} was added.`);
            // Show the new user at the top of the default (newest first) list.
            setFilters(EMPTY_FILTERS);
            setPage(1);
        }
        closeFormModal();
    };

    // ConfirmDialog shows the error and keeps itself open if this throws.
    const handleConfirmDelete = async () => {
        await deleteUserMutation.mutateAsync(deletingUser.id);
        setNotice(`${deletingUser.name} was deleted.`);
        setDeletingUser(null);
        if (users.length === 1 && page > 1) {
            setPage(page - 1);
        }
    };

    const columns = [
        {
            header: 'Name',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold uppercase text-blue-700">
                        {row.name?.charAt(0)}
                    </span>
                    <span className="font-medium text-gray-900">
                        {row.name}
                        {row.id === currentUser?.id && <span className="ml-2 text-xs font-normal text-gray-400">(you)</span>}
                    </span>
                </div>
            ),
        },
        { header: 'Email', accessor: 'email' },
        { header: 'Role', render: (row) => <Badge value={row.role} classes={ROLE_BADGE_CLASSES} /> },
        { header: 'Status', render: (row) => <Badge value={row.status} classes={STATUS_BADGE_CLASSES} /> },
        { header: 'Created', render: (row) => new Date(row.createdAt).toLocaleDateString() },
        {
            header: 'Actions',
            className: 'w-px text-right',
            render: (row) => (
                // Only a super admin may touch a super admin account (the API enforces this too).
                row.role === 'SUPER_ADMIN' && !isSuperAdmin ? null : (
                    <RowActions
                        actions={[
                            { label: 'Edit', icon: LuPencil, onClick: () => openEditModal(row) },
                            ...(row.id === currentUser?.id
                                ? []
                                : [{ label: 'Delete', icon: LuTrash2, onClick: () => setDeletingUser(row), danger: true }]),
                        ]}
                    />
                )
            ),
        },
    ];

    return (
        <div>
            {notice && (
                <div role="status" className="mb-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    <LuCheckCircle2 className="h-4 w-4 flex-shrink-0" />
                    <span className="flex-1">{notice}</span>
                    <button type="button" onClick={() => setNotice('')} aria-label="Dismiss" className="border-none bg-transparent p-0 text-green-700 hover:text-green-900">
                        <LuX className="h-4 w-4" />
                    </button>
                </div>
            )}

            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <LuSearch className="h-4 w-4 text-gray-400" />
                    </span>
                    <input
                        type="search"
                        value={filters.search}
                        onChange={(event) => updateFilter('search', event.target.value)}
                        placeholder="Search by name or email..."
                        aria-label="Search users"
                        className={SEARCH_INPUT_CLASSES}
                    />
                </div>
                <div className="grid grid-cols-2 gap-3 sm:flex">
                    <select value={filters.role} onChange={(event) => updateFilter('role', event.target.value)} aria-label="Filter by role" className={`${CONTROL_CLASSES} select-chevron sm:w-40`}>
                        <option value="">All roles</option>
                        {enumToOptions(USER_ROLE_VALUES).map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                    <select value={filters.status} onChange={(event) => updateFilter('status', event.target.value)} aria-label="Filter by status" className={`${CONTROL_CLASSES} select-chevron sm:w-48`}>
                        <option value="">All statuses</option>
                        {enumToOptions(USER_STATUS_VALUES).map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>
                <Button onClick={openAddModal}>Add User</Button>
            </div>

            <Table
                columns={columns}
                data={users}
                isLoading={usersQuery.isLoading}
                error={usersQuery.isError ? (usersQuery.error?.message || 'Unable to load users') : ''}
                emptyMessage={isFiltered ? 'No users match your filters' : 'No users yet. Click "Add User" to create one.'}
                meta={meta}
                onPageChange={setPage}
            />

            <Modal
                isOpen={isFormOpen}
                onClose={closeFormModal}
                title={editingUser ? 'Edit User' : 'Add User'}
                maxWidth="2xl"
            >
                <DynamicForm
                    fields={getUserFormFields({ isEdit: !!editingUser, isSuperAdmin })}
                    initialValues={editingUser ?? userFormInitialValues}
                    onSubmit={handleSubmitUser}
                    onCancel={closeFormModal}
                    submitLabel={editingUser ? 'Update User' : 'Create User'}
                />
            </Modal>

            <ConfirmDialog
                isOpen={!!deletingUser}
                onClose={() => setDeletingUser(null)}
                onConfirm={handleConfirmDelete}
                title="Delete User"
                message={`Are you sure you want to delete "${deletingUser?.name}" (${deletingUser?.email})? This action cannot be undone.`}
                confirmLabel="Delete"
            />
        </div>
    );
}
