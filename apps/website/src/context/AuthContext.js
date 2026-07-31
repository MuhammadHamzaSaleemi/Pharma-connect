'use client'
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useMeQuery, useLoginMutation, useLogoutMutation } from '../services/auth/auth.queries';
import { authKeys } from '../services/auth/auth.keys';
import { getAccessToken, setSession, clearSession as clearStoredSession, subscribeToSession } from '../services/auth/tokenStorage';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isTokenRestored, setIsTokenRestored] = useState(false);

  const loginMutation = useLoginMutation();
  const logoutMutation = useLogoutMutation();
  // `me` is a normal query, so it goes through httpClient like everything
  // else — an expired access token here is refreshed silently and retried
  // just like on any other page, instead of forcing a re-login on load.
  const meQuery = useMeQuery(accessToken);

  const userRef = useRef(user);
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  // tokenStorage is the source of truth. This state only ever mirrors it —
  // on mount, and whenever httpClient rotates or clears tokens in the
  // background (a silent refresh, or a refresh failure) outside of any
  // React event.
  useEffect(() => {
    setAccessToken(getAccessToken());
    setIsTokenRestored(true);

    return subscribeToSession(() => {
      const token = getAccessToken();
      setAccessToken(token);
      if (!token) {
        setUser(null);
      } else if (userRef.current) {
        // Same user, just a rotated token — seed the cache under the new
        // key so `me` isn't re-fetched on every silent refresh.
        queryClient.setQueryData(authKeys.me(token), userRef.current);
      }
    });
  }, [queryClient]);

  useEffect(() => {
    if (meQuery.data) setUser(meQuery.data);
  }, [meQuery.data]);

  useEffect(() => {
    // meQuery only ends up in an error state here once httpClient has
    // already tried (and failed) to refresh the token — an expired/invalid/
    // revoked refresh token, or the refresh request failing outright. That
    // path already cleared tokenStorage; this just mirrors it into state.
    if (meQuery.isError) clearStoredSession();
  }, [meQuery.isError]);

  const login = useCallback(async (email, password) => {
    const data = await loginMutation.mutateAsync({ email, password });
    setSession({ accessToken: data.accessToken, refreshToken: data.refreshToken });
    queryClient.setQueryData(authKeys.me(data.accessToken), data);
    setUser(data);
    setAccessToken(data.accessToken);
    return data;
  }, [loginMutation, queryClient]);

  const logout = useCallback(async () => {
    const token = getAccessToken();
    try {
      if (token) await logoutMutation.mutateAsync(token);
    } catch {
      // Best-effort server-side invalidation — the local session is cleared
      // either way below, so the user is logged out regardless.
    } finally {
      clearStoredSession();
    }
  }, [logoutMutation]);

  const isLoading = !isTokenRestored || (!!accessToken && meQuery.isLoading);

  return (
    <AuthContext.Provider value={{ user, accessToken, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
