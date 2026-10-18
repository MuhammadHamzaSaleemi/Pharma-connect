import { request, requestFormData, requestFull, toQueryString } from "../http/httpClient";

export const blogsApi = {
    // Public list: the API only ever returns published posts here.
    list: (token, params) => requestFull(`/blogs${toQueryString(params)}`, { token }),
    // Dashboard list, drafts included.
    listManage: (token, params) => requestFull(`/blogs/manage${toQueryString(params)}`, { token }),
    stats: (token) => request('/blogs/stats', { token }),
    getOne: (id) => request(`/blogs/${id}`),
    create: (token, formData) => requestFormData('/blogs', { method: 'POST', token, body: formData }),
    update: (token, id, formData) => requestFormData(`/blogs/${id}`, { method: 'PATCH', token, body: formData }),
    remove: (token, id) => request(`/blogs/${id}`, { method: 'DELETE', token }),
};
