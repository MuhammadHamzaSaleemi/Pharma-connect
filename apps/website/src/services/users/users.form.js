import { enumToOptions } from "../../lib/enumOptions";
import { USER_ROLE_VALUES, USER_STATUS_VALUES } from "./users.types";

// Same rule the API enforces in create-user.dto.ts.
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateName = (value) => (value.trim().length < 2 ? 'Name must be at least 2 characters' : '');
export const validateEmail = (value) => (EMAIL_REGEX.test(value) ? '' : 'Enter a valid email address');
// Empty is allowed here; `required` handles it on create, and on edit it means "keep the current password".
export const validatePassword = (value) =>
    !value || PASSWORD_REGEX.test(value)
        ? ''
        : 'Min 8 characters with an uppercase letter, a lowercase letter, a number and a special character (@$!%*?&)';

/**
 * @param {{ isEdit: boolean, isSuperAdmin: boolean }} options
 * Only a super admin may grant SUPER_ADMIN (the API enforces this too).
 */
export function getUserFormFields({ isEdit, isSuperAdmin }) {
    const roles = isSuperAdmin ? USER_ROLE_VALUES : USER_ROLE_VALUES.filter((role) => role !== 'SUPER_ADMIN');
    return [
        { name: 'name', label: 'Full Name', required: true, colSpan: 'half', placeholder: 'John Doe', validate: validateName },
        { name: 'email', label: 'Email', type: 'email', required: true, colSpan: 'half', placeholder: 'john@pharmaconnect.com', validate: validateEmail },
        { name: 'role', label: 'Role', type: 'select', required: true, colSpan: 'half', options: enumToOptions(roles) },
        { name: 'status', label: 'Status', type: 'select', required: true, colSpan: 'half', options: enumToOptions(USER_STATUS_VALUES) },
        {
            name: 'password',
            label: isEdit ? 'New Password (leave blank to keep current)' : 'Password',
            type: 'password',
            required: !isEdit,
            colSpan: 'full',
            placeholder: '••••••••',
            validate: validatePassword,
        },
    ];
}

// No default role: every role grants dashboard access, so it must be chosen deliberately.
export const userFormInitialValues = {
    status: 'ACTIVE',
};
