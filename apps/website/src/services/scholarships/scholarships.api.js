import { request, requestFull, toQueryString } from "../http/httpClient";

export const scholarshipsApi = {
    // Public list: the API only ever returns active scholarships here.
    list: (token, params) => requestFull(`/scholarships${toQueryString(params)}`, { token }),
    // Dashboard list, drafts and expired ones included.
    listManage: (token, params) => requestFull(`/scholarships/manage${toQueryString(params)}`, { token }),
    stats: (token) => request('/scholarships/stats', { token }),
    create: (token, payload) => request('/scholarships', { method: 'POST', token, body: payload }),
    update: (token, id, payload) => request(`/scholarships/${id}`, { method: 'PATCH', token, body: payload }),
    remove: (token, id) => request(`/scholarships/${id}`, { method: 'DELETE', token }),
};
