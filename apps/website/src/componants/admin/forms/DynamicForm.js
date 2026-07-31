'use client'
import React, { useState } from "react";
import Field from "../ui/Field";
import Button from "../ui/Button";

/**
 * Reusable, config-driven form. Pass a `fields` array describing each
 * field (same shape accepted by the Field component) and this renders,
 * validates (required-only), and manages submission for you.
 *
 * fields: Array<{ name, label, type, options?, required?, placeholder?, rows?, colSpan?: 'half'|'full' }>
 * initialValues: object keyed by field name
 * onSubmit: (values) => Promise<void> | void — throw/reject with an Error to show a form-level message
 */
export default function DynamicForm({
    fields,
    initialValues = {},
    onSubmit,
    onCancel,
    submitLabel = 'Save',
    cancelLabel = 'Cancel',
}) {
    const [values, setValues] = useState(() => {
        const defaults = {};
        fields.forEach((field) => {
            defaults[field.name] = initialValues[field.name] ?? (field.type === 'checkbox' ? false : '');
        });
        return defaults;
    });
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (name, value) => {
        setValues((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
    };

    const validate = () => {
        const nextErrors = {};
        fields.forEach((field) => {
            if (field.required && !values[field.name]) {
                nextErrors[field.name] = `${field.label} is required`;
            }
        });
        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setFormError('');
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            await onSubmit(values);
        } catch (error) {
            setFormError(error.message || 'Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
                <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{formError}</div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {fields.map((field) => (
                    <Field
                        key={field.name}
                        {...field}
                        value={values[field.name]}
                        onChange={handleChange}
                        error={errors[field.name]}
                        className={field.colSpan === 'full' ? 'sm:col-span-2' : ''}
                    />
                ))}
            </div>

            <div className="flex justify-end gap-2 pt-2">
                {onCancel && (
                    <Button type="button" variant="secondary" onClick={onCancel}>
                        {cancelLabel}
                    </Button>
                )}
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : submitLabel}
                </Button>
            </div>
        </form>
    );
}
