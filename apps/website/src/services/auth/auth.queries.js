'use client'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "./auth.api";
import { authKeys } from "./auth.keys";
import { setSession } from "./tokenStorage";

export function useMeQuery(token) {
    return useQuery({
        queryKey: authKeys.me(token),
        queryFn: () => authApi.me(token),
        enabled: !!token,
        retry: false,
    });
}

export function useLoginMutation() {
    return useMutation({
        mutationFn: ({ email, password }) => authApi.login(email, password),
    });
}


export function useLogoutMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (token) => authApi.logout(token),
        onSettled: () => queryClient.removeQueries({ queryKey: authKeys.all }),
    });
}

// The response is the fresh profile, so write it straight into `me` and
// every consumer of useAuth() (header, sidebar) updates without a refetch.
export function useUpdateProfileMutation(token) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload) => authApi.updateProfile(token, payload),
        onSuccess: (user) => queryClient.setQueryData(authKeys.me(token), user),
    });
}

// The API revokes every session on a password change and returns a new
// token pair for this one. Storing it keeps the user signed in here; the
// AuthContext session subscription picks up the new token.
export function useChangePasswordMutation(token) {
    return useMutation({
        mutationFn: (payload) => authApi.changePassword(token, payload),
        onSuccess: (data) => setSession({ accessToken: data.accessToken, refreshToken: data.refreshToken }),
    });
}
