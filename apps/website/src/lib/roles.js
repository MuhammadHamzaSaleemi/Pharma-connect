// Roles that can sign in to /dashboard.
export const DASHBOARD_ROLES = ['SUPER_ADMIN', 'ADMIN', 'EXECUTIVE'];

// Which roles may open each dashboard section. Mirrors the @Roles(...) checks in admin-api,
// which are the real enforcement; this only keeps the UI from offering what the API would refuse.
// Paths not listed here (e.g. /dashboard itself) are open to every dashboard role.
const SECTION_ROLES = {
    '/dashboard/jobs': ['SUPER_ADMIN', 'ADMIN'],
    '/dashboard/scholarships': ['SUPER_ADMIN', 'ADMIN', 'EXECUTIVE'],
    '/dashboard/blogs': ['SUPER_ADMIN', 'ADMIN', 'EXECUTIVE'],
    '/dashboard/users': ['SUPER_ADMIN', 'ADMIN'],
};

export function canAccessDashboard(role) {
    return DASHBOARD_ROLES.includes(role);
}

export function canAccessPath(role, pathname) {
    if (!canAccessDashboard(role)) return false;
    const section = Object.keys(SECTION_ROLES).find((path) => pathname === path || pathname.startsWith(`${path}/`));
    return section ? SECTION_ROLES[section].includes(role) : true;
}
