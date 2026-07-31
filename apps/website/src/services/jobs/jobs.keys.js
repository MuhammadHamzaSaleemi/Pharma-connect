export const jobsKeys = {
    all: ['jobs'],
    lists: () => [...jobsKeys.all, 'list'],
    list: (params) => [...jobsKeys.lists(), params],
};
