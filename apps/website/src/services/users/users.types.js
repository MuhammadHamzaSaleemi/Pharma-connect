// Mirrors apps/admin-api/src/common/enums/user-role.enum.ts and user-status.enum.ts
export const USER_ROLE_VALUES = ['SUPER_ADMIN', 'ADMIN', 'EXECUTIVE'];
export const USER_STATUS_VALUES = ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION'];

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} role
 * @property {string} status
 * @property {string} createdAt
 */

/**
 * @typedef {Object} UserListParams
 * @property {number} [page]
 * @property {number} [limit]
 * @property {string} [search]
 * @property {string} [role]
 * @property {string} [status]
 */

export {};
