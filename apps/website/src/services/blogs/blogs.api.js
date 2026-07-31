import { request, requestFormData, requestFull, toQueryString } from "../http/httpClient";

export const blogsApi = {
    list: (token, params) => requestFull(`/blogs${toQueryString(params)}`, { token }),
    getOne: (id) => request(`/blogs/${id}`),
    create: (token, formData) => requestFormData('/blogs', { method: 'POST', token, body: formData }),
    update: (token, id, formData) => requestFormData(`/blogs/${id}`, { method: 'PATCH', token, body: formData }),
    remove: (token, id) => request(`/blogs/${id}`, { method: 'DELETE', token }),
};
