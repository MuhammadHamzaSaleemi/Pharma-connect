'use client'
import React from "react";
import Select from "react-select";
import RichTextEditor from "./RichTextEditor";
import ImageUpload from "./ImageUpload";

// Kept in lockstep with the h-10 applied to native inputs/selects below so
// a react-select field sitting next to one lines up at exactly the same height.
function getSelectClassNames(error) {
    return {
        control: ({ isFocused }) =>
            `!flex !h-10 !items-center !rounded-md !border !bg-white !px-3 !shadow-sm ${
                isFocused ? '!border-blue-500 !ring-2 !ring-blue-500' : error ? '!border-red-400' : '!border-gray-300'
            }`,
        valueContainer: () => '!p-0',
        input: () => '!m-0 !p-0 !text-sm !text-gray-900',
        placeholder: () => '!m-0 !text-sm !text-gray-400',
        singleValue: () => '!m-0 !text-sm !text-gray-900',
        indicatorsContainer: () => '!h-full',
        indicatorSeparator: () => '!hidden',
        dropdownIndicator: () => '!p-0 !text-gray-400',
        clearIndicator: () => '!p-0 !text-gray-400',
        menu: () => '!z-20 !mt-1 !text-sm',
        option: ({ isFocused, isSelected }) =>
            `!px-3 !py-2 !text-sm ${isSelected ? '!bg-blue-600 !text-white' : isFocused ? '!bg-blue-50' : '!bg-white'}`,
    };
}

/**
 * Reusable form field. The `type` prop selects the input variant:
 * 'text' | 'number' | 'date' | 'textarea' | 'select' | 'searchselect' | 'checkbox' | 'richtext' | 'image' | 'imagefile'.
 *
 * Props:
 *   name, label, type, value, onChange(name, value), options ([{ label, value }]),
 *   placeholder, required, disabled, rows, error, className
 */
export default function Field({
    name,
    label,
    type = 'text',
    value,
    onChange,
    options = [],
    placeholder,
    required = false,
    disabled = false,
    rows = 4,
    error,
    className = '',
}) {
    const baseControlClasses = `w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        error ? 'border-red-400' : 'border-gray-300'
    } ${disabled ? 'bg-gray-100 text-gray-500' : 'bg-white text-gray-900'}`;
    // Single-line controls (input/select) get a fixed height so they always line up
    // with each other and with the react-select control; textarea sizes via `rows`.
    const singleLineControlClasses = `${baseControlClasses} h-10`;

    if (type === 'checkbox') {
        return (
            <div className={className}>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                        type="checkbox"
                        name={name}
                        checked={!!value}
                        disabled={disabled}
                        onChange={(event) => onChange(name, event.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    {label}
                </label>
                {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            </div>
        );
    }

    return (
        <div className={className}>
            <label htmlFor={name} className="mb-1 block text-sm font-medium text-gray-700">
                {label}
                {required && <span className="text-red-500"> *</span>}
            </label>

            {type === 'textarea' && (
                <textarea
                    id={name}
                    name={name}
                    rows={rows}
                    value={value ?? ''}
                    placeholder={placeholder}
                    disabled={disabled}
                    onChange={(event) => onChange(name, event.target.value)}
                    className={baseControlClasses}
                />
            )}

            {type === 'select' && (
                <select
                    id={name}
                    name={name}
                    value={value ?? ''}
                    disabled={disabled}
                    onChange={(event) => onChange(name, event.target.value)}
                    className={singleLineControlClasses}
                >
                    <option value="" disabled>{placeholder || 'Select...'}</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
            )}

            {type === 'searchselect' && (
                <Select
                    inputId={name}
                    options={options}
                    value={options.find((option) => option.value === value) || null}
                    onChange={(selected) => onChange(name, selected?.value ?? '')}
                    isDisabled={disabled}
                    placeholder={placeholder || 'Select...'}
                    classNames={getSelectClassNames(error)}
                    unstyled
                />
            )}

            {type === 'richtext' && (
                <RichTextEditor
                    value={value}
                    onChange={(html) => onChange(name, html)}
                    placeholder={placeholder}
                />
            )}

            {type === 'image' && (
                <ImageUpload
                    value={value}
                    onChange={(url) => onChange(name, url)}
                    disabled={disabled}
                />
            )}

            {type === 'imagefile' && (
                <ImageUpload
                    value={value}
                    onChange={(file) => onChange(name, file)}
                    disabled={disabled}
                    mode="file"
                />
            )}

            {!['textarea', 'select', 'searchselect', 'richtext', 'image', 'imagefile'].includes(type) && (
                <input
                    id={name}
                    name={name}
                    type={type}
                    value={value ?? ''}
                    placeholder={placeholder}
                    disabled={disabled}
                    onChange={(event) => onChange(name, event.target.value)}
                    className={singleLineControlClasses}
                />
            )}

            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}
