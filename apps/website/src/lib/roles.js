export const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN'];

export function isAdminRole(role) {
  return ADMIN_ROLES.includes(role);
}
