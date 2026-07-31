export const scholarshipsKeys = {
    all: ['scholarships'],
    lists: () => [...scholarshipsKeys.all, 'list'],
    list: (params) => [...scholarshipsKeys.lists(), params],
};
