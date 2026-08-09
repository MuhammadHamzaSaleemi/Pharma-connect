'use client'
import React, { useState } from "react";
import Modal from "./Modal";
import Button from "./Button";

/**
 * Reusable confirmation dialog (e.g. delete confirmation). Wraps Modal.
 *
 * Props:
 *   isOpen, onClose
 *   onConfirm: () => Promise<void> | void — throw/reject to show an error and keep the dialog open
 *   title, message, confirmLabel, cancelLabel
 *   variant: Button variant for the confirm action (default 'danger')
 */
export default function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title = 'Are you sure?',
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'danger',
}) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleConfirm = async () => {
        setError('');
        setIsSubmitting(true);
        try {
            await onConfirm();
        } catch (err) {
            setError(err.message || 'Something went wrong');
            setIsSubmitting(false);
            return;
        }
        setIsSubmitting(false);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
            {message && <p className="text-sm text-gray-600">{message}</p>}
            {error && (
                <div className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>
            )}
            <div className="mt-6 flex justify-end gap-2">
                <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
                    {cancelLabel}
                </Button>
                <Button variant={variant} onClick={handleConfirm} disabled={isSubmitting}>
                    {isSubmitting ? 'Please wait...' : confirmLabel}
                </Button>
            </div>
        </Modal>
    );
}
