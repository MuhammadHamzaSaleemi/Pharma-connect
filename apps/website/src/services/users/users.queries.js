'use client'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "./users.api";
import { usersKeys } from "./users.keys";

export function useUsersQuery(token, params) {
    return useQuery({
        queryKey: usersKeys.list(params),
        queryFn: () => usersApi.list(token, params),
        enabled: !!token,
        placeholderData: (previousData) => previousData,
    });
}

export function useUserStatsQuery(token) {
    return useQuery({
        queryKey: usersKeys.stats(),
        queryFn: () => usersApi.stats(token),
        enabled: !!token,
    });
}

export function useCreateUserMutation(token) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload) => usersApi.create(token, payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: usersKeys.lists() }),
    });
}

export function useUpdateUserMutation(token) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }) => usersApi.update(token, id, payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: usersKeys.lists() }),
    });
}

export function useDeleteUserMutation(token) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => usersApi.remove(token, id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: usersKeys.lists() }),
    });
}
