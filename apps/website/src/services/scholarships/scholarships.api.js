import { request, requestFull, toQueryString } from "../http/httpClient";

export const scholarshipsApi = {
    list: (token, params) => requestFull(`/scholarships${toQueryString(params)}`, { token }),
    create: (token, payload) => request('/scholarships', { method: 'POST', token, body: payload }),
    update: (token, id, payload) => request(`/scholarships/${id}`, { method: 'PATCH', token, body: payload }),
    remove: (token, id) => request(`/scholarships/${id}`, { method: 'DELETE', token }),
};
