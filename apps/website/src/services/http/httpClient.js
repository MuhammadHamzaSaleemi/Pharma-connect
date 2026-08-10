// Shared low-level HTTP transport used by every service's `*.api.js`.
// This is transport plumbing, not a service in itself — no endpoint-specific
// logic (routes, DTOs, query keys) belongs here, with one exception: the
// silent access-token refresh below. That lives here (rather than going
// through services/auth) because every authenticated call, from any
// service, must transparently recover from a 401 the same way.
import { getAccessToken, getRefreshToken, setSession, clearSession } from "../auth/tokenStorage";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1').replace(/\/+$/, '');

// Shared by every concurrent 401 so only one refresh call is ever in flight —
// callers that arrive while a refresh is already running just await it.
let refreshPromise = null;

function refreshAccessToken() {
    if (!refreshPromise) {
        refreshPromise = (async () => {
            const refreshToken = getRefreshToken();
            if (!refreshToken) {
                throw new Error('No refresh token available');
            }

            const res = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken }),
            });
            const json = await res.json().catch(() => null);

            if (!res.ok) {
                throw new Error(json?.message || 'Unable to refresh session');
            }

            setSession({ accessToken: json.data.accessToken, refreshToken: json.data.refreshToken });
            return json.data;
        })().finally(() => {
            refreshPromise = null;
        });
    }

    return refreshPromise;
}

function doFetch(path, { method, body, token, headers, isFormData }) {
    return fetch(`${API_BASE_URL}${path}`, {
        method,
        headers: {
            ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...headers,
        },
        body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    });
}

// Global auth handler: this is the one place that decides a session is
// truly dead (as opposed to just needing a refresh) and reacts — clears the
// stored tokens and hard-redirects to /login. A full navigation (rather
// than the Next.js router) is deliberate: this module runs outside any
// React component, so there's no router instance to call, and a fresh load
// guarantees no stale React/query state lingers behind the login screen.
// `hasRedirected` just stops several concurrent 401s from all calling
// `location.assign` at once — it resets naturally on the next page load.
let hasRedirected = false;

function handleSessionExpired() {
    clearSession();
    if (typeof window === 'undefined' || hasRedirected) return;
    if (window.location.pathname.startsWith('/login')) return;
    hasRedirected = true;
    window.location.assign('/login');
}

// Core request executor. On a 401 from an authenticated call (one that sent
// a token), transparently refreshes the access token and retries exactly
// once — the caller never sees the expiry. The session only ends (tokens
// cleared, user redirected to /login) if the refresh itself fails
// (expired/invalid/revoked refresh token, or the request fails outright) or
// the retried request still comes back 401 with a fresh token.
async function performRequest(path, options = {}) {
    const { method = 'GET', body, token, headers, isFormData = false, isRetry = false } = options;
    const res = await doFetch(path, { method, body, token, headers, isFormData });

    if (res.status === 401 && token) {
        if (isRetry) {
            handleSessionExpired();
            throw new Error('Your session has expired. Please log in again.');
        }

        let refreshed = false;
        try {
            await refreshAccessToken();
            refreshed = true;
        } catch {
            // Refresh failed outright (expired/invalid/revoked refresh
            // token, or the request itself failing) — handled below.
        }

        if (!refreshed) {
            handleSessionExpired();
            throw new Error('Your session has expired. Please log in again.');
        }

        return performRequest(path, { method, body, token: getAccessToken(), headers, isFormData, isRetry: true });
    }

    const json = await res.json().catch(() => null);

    if (!res.ok) {
        throw new Error(json?.message || `Request failed with status ${res.status}`);
    }

    return json;
}

export async function requestFull(path, options) {
    return performRequest(path, options);
}

export async function request(path, options) {
    const json = await performRequest(path, options);
    return json?.data;
}

// Like `request`, but sends a FormData body (multipart/form-data) without a
// JSON Content-Type header, so the browser can set the multipart boundary.
export async function requestFormData(path, { method = 'POST', body, token } = {}) {
    const json = await performRequest(path, { method, body, token, isFormData: true });
    return json?.data;
}

export function toQueryString(params = {}) {
    const query = Object.entries(params)
        .filter(([, value]) => value !== undefined && value !== null && value !== '')
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
    return query ? `?${query}` : '';
}
