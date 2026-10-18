export const blogsKeys = {
    all: ['blogs'],
    lists: () => [...blogsKeys.all, 'list'],
    list: (params) => [...blogsKeys.lists(), params],
    // Dashboard list (drafts included); kept under lists() so mutations invalidate it too.
    manageList: (params) => [...blogsKeys.lists(), 'manage', params],
    // Under lists() so the create/update/delete invalidation refreshes the dashboard counters too.
    stats: () => [...blogsKeys.lists(), 'stats'],
};
