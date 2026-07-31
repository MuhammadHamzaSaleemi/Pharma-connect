'use client'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { jobsApi } from "./jobs.api";
import { jobsKeys } from "./jobs.keys";

export function useJobsQuery(token, params) {
    return useQuery({
        queryKey: jobsKeys.list(params),
        queryFn: () => jobsApi.list(token, params),
        enabled: !!token,
        placeholderData: (previousData) => previousData,
    });
}

// For public, unauthenticated pages (e.g. the marketing website) — hits the
// same list endpoint without a token, since it's publicly accessible.
export function usePublicJobsQuery(params) {
    return useQuery({
        queryKey: jobsKeys.list(params),
        queryFn: () => jobsApi.list(undefined, params),
        placeholderData: (previousData) => previousData,
    });
}

export function useCreateJobMutation(token) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload) => jobsApi.create(token, payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: jobsKeys.lists() }),
    });
}

export function useUpdateJobMutation(token) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }) => jobsApi.update(token, id, payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: jobsKeys.lists() }),
    });
}

export function useDeleteJobMutation(token) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => jobsApi.remove(token, id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: jobsKeys.lists() }),
    });
}

export function useBulkUploadJobsMutation(token) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (formData) => jobsApi.bulkUpload(token, formData),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: jobsKeys.lists() }),
    });
}
