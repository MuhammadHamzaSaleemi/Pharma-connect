// Single source of truth for the persisted auth session. Both the React
// AuthContext and the transport layer (httpClient's silent refresh-on-401
// retry) read/write through here so neither can drift out of sync with the
// other — httpClient rotates tokens in the background outside of React, and
// AuthContext reacts to that via `subscribeToSession`.
//
// SECURITY TRADEOFF: tokens live in localStorage, not an httpOnly cookie.
// That means any script that manages to run on this origin (a successful
// XSS) can read and exfiltrate both tokens. This is a deliberate, accepted
// risk for now, NOT a fully mitigated one — see SECURITY.md at the repo
// root for the honest rationale, the known open exposure (unsanitized
// blog/job HTML rendered via dangerouslySetInnerHTML), and what closing
// this properly would take.
const ACCESS_TOKEN_KEY = 'pharmaconnect_access_token';
const REFRESH_TOKEN_KEY = 'pharmaconnect_refresh_token';

const listeners = new Set();

function notify() {
    listeners.forEach((listener) => listener());
}

export function getAccessToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setSession({ accessToken, refreshToken }) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    notify();
}

export function clearSession() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    notify();
}

// Notifies on every setSession/clearSession, including ones triggered
// outside of React (e.g. httpClient's background refresh-on-401). Returns
// an unsubscribe function.
export function subscribeToSession(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}
