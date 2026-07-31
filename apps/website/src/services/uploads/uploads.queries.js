'use client'
import { useMutation } from "@tanstack/react-query";
import { uploadImage } from "./uploads.api";

/**
 * mutate({ file, onProgress? }) -> Promise<{ url: string }>
 */
export function useUploadImageMutation() {
    return useMutation({
        mutationFn: ({ file, onProgress }) => uploadImage(file, { onProgress }),
    });
}
