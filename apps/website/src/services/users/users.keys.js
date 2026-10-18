export const usersKeys = {
    all: ['users'],
    lists: () => [...usersKeys.all, 'list'],
    list: (params) => [...usersKeys.lists(), params],
    // Under lists() so any user mutation refreshes the dashboard counters.
    stats: () => [...usersKeys.lists(), 'stats'],
};
