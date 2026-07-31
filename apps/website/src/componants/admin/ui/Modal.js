'use client'
import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import Button from "./Button";

const MAX_WIDTH_CLASSES = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
};

/**
 * Reusable, configurable modal. Renders into a portal so it's never
 * clipped by an ancestor's overflow/z-index.
 *
 * Props:
 *   isOpen: boolean
 *   onClose: () => void
 *   title: string
 *   maxWidth: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'  (default 'lg')
 */
export default function Modal({ isOpen, onClose, title, maxWidth = 'lg', children }) {
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
            <div
                role="dialog"
                aria-modal="true"
                aria-label={title}
                className={`relative z-10 max-h-[90vh] w-full overflow-y-auto rounded-lg bg-white p-6 shadow-xl ${MAX_WIDTH_CLASSES[maxWidth] ?? MAX_WIDTH_CLASSES.lg}`}
            >
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                    <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" clipRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
                        </svg>
                    </Button>
                </div>
                {children}
            </div>
        </div>,
        document.body,
    );
}
