import { request, requestFormData, requestFull, toQueryString } from "../http/httpClient";

export const jobsApi = {
    list: (token, params) => requestFull(`/jobs${toQueryString(params)}`, { token }),
    getOne: (id) => request(`/jobs/${id}`),
    create: (token, payload) => request('/jobs', { method: 'POST', token, body: payload }),
    update: (token, id, payload) => request(`/jobs/${id}`, { method: 'PATCH', token, body: payload }),
    remove: (token, id) => request(`/jobs/${id}`, { method: 'DELETE', token }),
    bulkUpload: (token, formData) => requestFormData('/jobs/bulk-upload', { method: 'POST', token, body: formData }),
};
