import { request } from "../http/httpClient";

export const authApi = {
    login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
    register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
    logout: (token) => request('/auth/logout', { method: 'POST', token }),
    me: (token) => request('/auth/me', { token }),
    refreshToken: (refreshToken) => request('/auth/refresh-token', { method: 'POST', body: { refreshToken } }),
};
