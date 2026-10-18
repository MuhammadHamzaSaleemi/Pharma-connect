import { request, requestFull, toQueryString } from "../http/httpClient";

export const usersApi = {
    list: (token, params) => requestFull(`/users${toQueryString(params)}`, { token }),
    stats: (token) => request('/users/stats', { token }),
    create: (token, payload) => request('/users', { method: 'POST', token, body: payload }),
    update: (token, id, payload) => request(`/users/${id}`, { method: 'PATCH', token, body: payload }),
    remove: (token, id) => request(`/users/${id}`, { method: 'DELETE', token }),
};
