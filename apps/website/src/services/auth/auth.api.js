import { request } from "../http/httpClient";

export const authApi = {
    login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
    logout: (token) => request('/auth/logout', { method: 'POST', token }),
    me: (token) => request('/auth/me', { token }),
    refreshToken: (refreshToken) => request('/auth/refresh-token', { method: 'POST', body: { refreshToken } }),
    updateProfile: (token, payload) => request('/auth/me', { method: 'PATCH', token, body: payload }),
    changePassword: (token, payload) => request('/auth/change-password', { method: 'POST', token, body: payload }),
};
