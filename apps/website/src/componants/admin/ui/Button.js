'use client'
import React from "react";

const VARIANT_CLASSES = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300',
    secondary: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50',
    ghost: 'text-gray-600 hover:bg-gray-100 disabled:opacity-50',
    danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300',
    menuitem: 'w-full justify-start text-left text-gray-700 hover:bg-gray-50',
    default: 'bg-transparent text-white hover:bg-white/10',
};

// Applied instead of the variant's color classes when `active` is true —
// used for toggle-style buttons (e.g. a rich-text toolbar button that's "on").
const ACTIVE_CLASSES = 'bg-blue-100 text-blue-700 hover:bg-blue-100';

const SIZE_CLASSES = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    icon: 'p-1.5',
};

/**
 * Reusable button. Use `variant` for visual style and `size` for padding/
 * text scale. Pass `active` for toggle-style buttons (e.g. toolbar buttons)
 * to indicate a pressed/on state instead of mixing it into `className`.
 *
 * variant: 'primary' | 'secondary' | 'ghost' | 'danger' | 'menuitem'
 * size: 'sm' | 'md' | 'icon'
 */
export default function Button({
    variant = 'primary',
    size = 'md',
    active = false,
    type = 'button',
    className = '',
    disabled = false,
    children,
    ...props
}) {
    const colorClasses = active ? ACTIVE_CLASSES : (VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.primary);
    const sizeClasses = SIZE_CLASSES[size] ?? SIZE_CLASSES.md;

    return (
        <button
            type={type}
            disabled={disabled}
            className={`inline-flex items-center justify-center gap-2 rounded-md border-none font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:cursor-not-allowed ${sizeClasses} ${colorClasses} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
