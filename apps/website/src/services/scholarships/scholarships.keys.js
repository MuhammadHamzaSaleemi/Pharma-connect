export const scholarshipsKeys = {
    all: ['scholarships'],
    lists: () => [...scholarshipsKeys.all, 'list'],
    list: (params) => [...scholarshipsKeys.lists(), params],
    // Dashboard list (drafts and expired included); kept under lists() so mutations invalidate it too.
    manageList: (params) => [...scholarshipsKeys.lists(), 'manage', params],
    // Under lists() so the create/update/delete invalidation refreshes the dashboard counters too.
    stats: () => [...scholarshipsKeys.lists(), 'stats'],
};
