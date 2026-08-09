'use client'
import React, { useEffect, useRef, useState } from "react";
import { LuUploadCloud, LuX } from "react-icons/lu";
import { useUploadImageMutation } from "../../../services/uploads/uploads.queries";

/**
 * Reusable drag-and-drop image upload box.
 *
 * mode='upload' (default): uploads the file to /api/upload (local disk
 * storage on the website server) and reports back only the resulting URL —
 * `onChange` receives a string, never a File.
 *
 * mode='file': keeps the raw File instead of uploading it anywhere —
 * `onChange` receives a File, and it's previewed locally via an object URL.
 * Use this when the destination endpoint accepts the file directly
 * (multipart/form-data), e.g. the blogs API.
 *
 * Props:
 *   value: string (image URL) | File
 *   onChange: (value: string | File) => void
 *   disabled: boolean
 *   mode: 'upload' | 'file'
 */
export default function ImageUpload({ value, onChange, disabled = false, mode = 'upload' }) {
    const inputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [progress, setProgress] = useState(null);
    const [error, setError] = useState('');
    const [objectUrl, setObjectUrl] = useState('');
    const uploadImageMutation = useUploadImageMutation();

    useEffect(() => {
        if (!(value instanceof File)) {
            setObjectUrl('');
            return;
        }
        const url = URL.createObjectURL(value);
        setObjectUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [value]);

    const previewSrc = value instanceof File ? objectUrl : value;

    const handleFile = async (file) => {
        if (!file || disabled) return;
        setError('');

        if (mode === 'file') {
            onChange(file);
            return;
        }

        setProgress(0);
        try {
            const { url } = await uploadImageMutation.mutateAsync({ file, onProgress: setProgress });
            onChange(url);
        } catch (err) {
            setError(err.message || 'Upload failed');
        } finally {
            setProgress(null);
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragging(false);
        handleFile(event.dataTransfer.files?.[0]);
    };

    return (
        <div>
            <div
                role="button"
                tabIndex={0}
                onClick={() => !disabled && inputRef.current?.click()}
                onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') inputRef.current?.click();
                }}
                onDragOver={(event) => {
                    event.preventDefault();
                    if (!disabled) setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-8 text-center transition-colors ${
                    disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                } ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}
            >
                <LuUploadCloud className="mb-2 h-8 w-8 text-gray-400" />
                <p className="text-sm font-medium text-gray-600">
                    Drag &amp; drop your image here, or <span className="text-blue-600">click to upload</span>
                </p>
                <p className="mt-1 text-xs text-gray-400">PNG, JPG, WEBP, or GIF up to 5MB</p>
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    disabled={disabled}
                    className="hidden"
                    onChange={(event) => handleFile(event.target.files?.[0])}
                />
            </div>

            {progress !== null && (
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                    <div className="h-full bg-blue-600 transition-all" style={{ width: `${progress}%` }} />
                </div>
            )}

            {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

            {previewSrc && (
                <div className="relative mt-3 inline-block h-32 w-32 overflow-hidden rounded-md border border-gray-200 bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        key={previewSrc}
                        src={previewSrc}
                        alt="Preview"
                        className="h-full w-full object-cover"
                        onError={(event) => { event.currentTarget.style.display = 'none'; }}
                    />
                    <button
                        type="button"
                        onClick={() => onChange('')}
                        disabled={disabled}
                        aria-label="Remove image"
                        className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                    >
                        <LuX className="h-3 w-3" />
                    </button>
                </div>
            )}
        </div>
    );
}
