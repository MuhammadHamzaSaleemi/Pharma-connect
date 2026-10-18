'use client'
import { useMutation } from "@tanstack/react-query";
import { uploadImage } from "./uploads.api";

/**
 * mutate(file) -> Promise<{ url: string }>
 */
export function useUploadImageMutation(token) {
    return useMutation({
        mutationFn: (file) => uploadImage(token, file),
    });
}
