export const jobsKeys = {
    all: ['jobs'],
    lists: () => [...jobsKeys.all, 'list'],
    list: (params) => [...jobsKeys.lists(), params],
    // Dashboard list (role-scoped by the API); kept under lists() so mutations invalidate it too.
    manageList: (params) => [...jobsKeys.lists(), 'manage', params],
    // Also under lists() so any job mutation refreshes the dashboard counters.
    stats: () => [...jobsKeys.lists(), 'stats'],
};
