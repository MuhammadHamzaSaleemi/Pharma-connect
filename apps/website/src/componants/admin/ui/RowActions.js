'use client'
import React, { useEffect, useRef, useState } from "react";
import { LuMoreVertical } from "react-icons/lu";
import Button from "./Button";

const MENU_WIDTH = 160;

/**
 * Three-dot (⋮) row actions menu for dashboard tables.
 *
 * actions: Array<{ label: string, icon?: IconComponent, onClick: () => void, danger?: boolean }>
 *
 * The menu is `position: fixed` (anchored to the trigger) so the table's
 * overflow containers can't clip it. It flips upward near the viewport bottom.
 */
export default function RowActions({ actions }) {
    const [position, setPosition] = useState(null);
    const triggerRef = useRef(null);
    const menuRef = useRef(null);
    const isOpen = position !== null;

    const close = () => setPosition(null);

    const toggle = () => {
        if (isOpen) return close();
        const rect = triggerRef.current.getBoundingClientRect();
        const menuHeight = actions.length * 36 + 8;
        const openUp = rect.bottom + menuHeight + 8 > window.innerHeight;
        setPosition({
            left: Math.max(8, rect.right - MENU_WIDTH),
            top: openUp ? rect.top - menuHeight - 4 : rect.bottom + 4,
        });
    };

    useEffect(() => {
        if (!isOpen) return;
        const onPointerDown = (e) => {
            if (!menuRef.current?.contains(e.target) && !triggerRef.current?.contains(e.target)) close();
        };
        const onKeyDown = (e) => {
            if (e.key === 'Escape') {
                close();
                triggerRef.current?.querySelector('button')?.focus();
            }
        };
        document.addEventListener('mousedown', onPointerDown);
        document.addEventListener('keydown', onKeyDown);
        // Fixed menu would drift from its row on scroll/resize, so just close it.
        window.addEventListener('scroll', close, true);
        window.addEventListener('resize', close);
        menuRef.current?.querySelector('button')?.focus();
        return () => {
            document.removeEventListener('mousedown', onPointerDown);
            document.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('scroll', close, true);
            window.removeEventListener('resize', close);
        };
    }, [isOpen]);

    return (
        <>
            {/* Button doesn't forward refs, so anchor on a wrapper. */}
            <span ref={triggerRef} className="inline-flex">
                <Button
                    variant="ghost"
                    size="icon"
                    title="Actions"
                    aria-label="Row actions"
                    aria-haspopup="menu"
                    aria-expanded={isOpen}
                    active={isOpen}
                    onClick={toggle}
                >
                    <LuMoreVertical className="h-4 w-4" />
                </Button>
            </span>

            {isOpen && (
                <div
                    ref={menuRef}
                    role="menu"
                    style={{ top: position.top, left: position.left, width: MENU_WIDTH }}
                    className="fixed z-50 rounded-lg border border-gray-200 bg-white py-1 shadow-lg ring-1 ring-black/5"
                >
                    {actions.map(({ label, icon: Icon, onClick, danger }) => (
                        <button
                            key={label}
                            type="button"
                            role="menuitem"
                            onClick={() => {
                                close();
                                onClick();
                            }}
                            className={`flex w-full items-center gap-2 border-none bg-transparent px-3 py-2 text-left text-sm transition-colors focus:outline-none ${
                                danger
                                    ? 'text-red-600 hover:bg-red-50 focus:bg-red-50'
                                    : 'text-gray-700 hover:bg-gray-100 focus:bg-gray-100'
                            }`}
                        >
                            {Icon && <Icon className="h-4 w-4" />}
                            {label}
                        </button>
                    ))}
                </div>
            )}
        </>
    );
}
