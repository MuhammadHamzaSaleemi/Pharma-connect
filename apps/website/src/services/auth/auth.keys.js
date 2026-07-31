export const authKeys = {
    all: ['auth'],
    me: (token) => [...authKeys.all, 'me', token],
};
