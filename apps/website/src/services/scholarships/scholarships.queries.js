'use client'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { scholarshipsApi } from "./scholarships.api";
import { scholarshipsKeys } from "./scholarships.keys";

export function useScholarshipsQuery(token, params) {
    return useQuery({
        queryKey: scholarshipsKeys.list(params),
        queryFn: () => scholarshipsApi.list(token, params),
        enabled: !!token,
        placeholderData: (previousData) => previousData,
    });
}

export function useCreateScholarshipMutation(token) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload) => scholarshipsApi.create(token, payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: scholarshipsKeys.lists() }),
    });
}

export function useUpdateScholarshipMutation(token) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }) => scholarshipsApi.update(token, id, payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: scholarshipsKeys.lists() }),
    });
}

export function useDeleteScholarshipMutation(token) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => scholarshipsApi.remove(token, id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: scholarshipsKeys.lists() }),
    });
}
