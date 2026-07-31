'use client'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "./auth.api";
import { authKeys } from "./auth.keys";

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

export function useRegisterMutation() {
    return useMutation({
        mutationFn: (payload) => authApi.register(payload),
    });
}

export function useLogoutMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (token) => authApi.logout(token),
        onSettled: () => queryClient.removeQueries({ queryKey: authKeys.all }),
    });
}
