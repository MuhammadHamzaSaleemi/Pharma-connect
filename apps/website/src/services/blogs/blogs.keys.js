export const blogsKeys = {
    all: ['blogs'],
    lists: () => [...blogsKeys.all, 'list'],
    list: (params) => [...blogsKeys.lists(), params],
};
