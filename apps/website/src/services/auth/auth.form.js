import { validateEmail, validateName, validatePassword } from "../users/users.form";

/**
 * Profile form for the signed-in user. `currentEmail` is needed because the
 * API asks for the current password only when the email actually changes.
 */
export function getProfileFormFields(currentEmail) {
    return [
        { name: 'avatar', label: 'Profile Picture', type: 'image', colSpan: 'full' },
        { name: 'name', label: 'Full Name', required: true, colSpan: 'half', placeholder: 'John Doe', validate: validateName },
        { name: 'email', label: 'Email', type: 'email', required: true, colSpan: 'half', placeholder: 'john@pharmaconnect.com', validate: validateEmail },
        {
            name: 'currentPassword',
            label: 'Current Password (only needed to change email)',
            type: 'password',
            colSpan: 'full',
            placeholder: '••••••••',
            validate: (value, values) =>
                values.email.trim() !== currentEmail && !value ? 'Enter your current password to change your email' : '',
        },
    ];
}

export const passwordFormFields = [
    { name: 'currentPassword', label: 'Current Password', type: 'password', required: true, colSpan: 'full', placeholder: '••••••••' },
    { name: 'newPassword', label: 'New Password', type: 'password', required: true, colSpan: 'half', placeholder: '••••••••', validate: validatePassword },
    {
        name: 'confirmNewPassword',
        label: 'Confirm New Password',
        type: 'password',
        required: true,
        colSpan: 'half',
        placeholder: '••••••••',
        validate: (value, values) => (value === values.newPassword ? '' : 'Passwords do not match'),
    },
];
