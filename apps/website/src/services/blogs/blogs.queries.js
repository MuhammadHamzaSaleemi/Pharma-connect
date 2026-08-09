'use client'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { blogsApi } from "./blogs.api";
import { blogsKeys } from "./blogs.keys";

export function useBlogsQuery(token, params) {
    return useQuery({
        queryKey: blogsKeys.list(params),
        queryFn: () => blogsApi.list(token, params),
        enabled: !!token,
        placeholderData: (previousData) => previousData,
    });
}

// For public, unauthenticated pages (e.g. the marketing website) — hits the
// same list endpoint without a token, since it's publicly accessible.
export function usePublicBlogsQuery(params) {
    return useQuery({
        queryKey: blogsKeys.list(params),
        queryFn: () => blogsApi.list(undefined, params),
        placeholderData: (previousData) => previousData,
    });
}

export function useCreateBlogMutation(token) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (formData) => blogsApi.create(token, formData),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: blogsKeys.lists() }),
    });
}

export function useUpdateBlogMutation(token) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, formData }) => blogsApi.update(token, id, formData),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: blogsKeys.lists() }),
    });
}

export function useDeleteBlogMutation(token) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => blogsApi.remove(token, id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: blogsKeys.lists() }),
    });
}
