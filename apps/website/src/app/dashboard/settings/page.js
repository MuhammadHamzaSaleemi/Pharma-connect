'use client'
import React, { useEffect, useState } from "react";
import { LuCheckCircle2, LuKeyRound, LuUserCircle2, LuX } from "react-icons/lu";
import { useAuth } from "../../../context/AuthContext";
import DynamicForm from "../../../componants/admin/forms/DynamicForm";
import { getProfileFormFields, passwordFormFields } from "../../../services/auth/auth.form";
import { useChangePasswordMutation, useUpdateProfileMutation } from "../../../services/auth/auth.queries";
import { formatEnumLabel } from "../../../lib/enumOptions";

// Spacing uses arbitrary values: Bootstrap's !important p-/m-/gap-N utilities override Tailwind's.
function Section({ icon: Icon, title, description, children }) {
    return (
        <section className="flex h-full flex-col rounded-xl bg-white ring-1 ring-gray-200">
            <div className="flex items-start gap-[12px] px-[24px] py-[20px] [border-bottom:1px_solid_rgb(243_244_246)]">
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                    <h2 className="mb-0 text-base font-semibold text-gray-900">{title}</h2>
                    <p className="mb-0 mt-[2px] text-sm text-gray-500">{description}</p>
                </div>
            </div>
            <div className="flex-1 px-[24px] py-[20px]">{children}</div>
        </section>
    );
}

export default function AccountSettings() {
    const { user, accessToken } = useAuth();
    const updateProfileMutation = useUpdateProfileMutation(accessToken);
    const changePasswordMutation = useChangePasswordMutation(accessToken);
    const [notice, setNotice] = useState('');
    // Bumped after a password change to remount (and so clear) that form.
    const [passwordFormKey, setPasswordFormKey] = useState(0);

    useEffect(() => {
        if (!notice) return;
        const timer = setTimeout(() => setNotice(''), 4000);
        return () => clearTimeout(timer);
    }, [notice]);

    const handleSaveProfile = async ({ name, email, avatar, currentPassword }) => {
        const payload = { name: name.trim(), email: email.trim(), avatar: avatar || '' };
        if (currentPassword) payload.currentPassword = currentPassword;
        await updateProfileMutation.mutateAsync(payload);
        setNotice('Your profile was updated.');
    };

    const handleChangePassword = async (values) => {
        await changePasswordMutation.mutateAsync(values);
        setPasswordFormKey((key) => key + 1);
        setNotice('Your password was changed. Other devices have been signed out.');
    };

    return (
        <div className="flex flex-col gap-[24px]">
            {notice && (
                <div role="status" className="flex items-center gap-[8px] rounded-lg border border-green-200 bg-green-50 px-[16px] py-[12px] text-sm text-green-700">
                    <LuCheckCircle2 className="h-4 w-4 flex-shrink-0" />
                    <span className="flex-1">{notice}</span>
                    <button type="button" onClick={() => setNotice('')} aria-label="Dismiss" className="border-none bg-transparent p-0 text-green-700 hover:text-green-900">
                        <LuX className="h-4 w-4" />
                    </button>
                </div>
            )}

            <div className="flex items-center gap-[16px] rounded-xl bg-white px-[24px] py-[20px] ring-1 ring-gray-200">
                {user?.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.avatar} alt="" className="h-14 w-14 rounded-full object-cover ring-2 ring-gray-100" />
                ) : (
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-xl font-semibold text-white">
                        {user?.name?.charAt(0).toUpperCase()}
                    </span>
                )}
                <div className="min-w-0">
                    <p className="mb-0 truncate text-lg font-semibold text-gray-900">{user?.name}</p>
                    <p className="mb-0 truncate text-sm text-gray-500">{user?.email}</p>
                </div>
                <span className="ml-auto hidden rounded-full bg-blue-50 px-[10px] py-[2px] text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20 sm:inline-flex">
                    {user?.role && formatEnumLabel(user.role)}
                </span>
            </div>

            {/* Side by side from xl (two ~470px+ columns next to the sidebar); stacked below that. */}
            <div className="grid grid-cols-1 items-stretch gap-[24px] xl:grid-cols-2">
                <Section icon={LuUserCircle2} title="Personal Information" description="Update your name, email address and profile picture.">
                    {/* Keyed on the saved profile so the form re-seeds after a save. */}
                    <DynamicForm
                        key={`${user?.name}|${user?.email}|${user?.avatar}`}
                        fields={getProfileFormFields(user?.email ?? '')}
                        initialValues={{ name: user?.name, email: user?.email, avatar: user?.avatar }}
                        onSubmit={handleSaveProfile}
                        submitLabel="Save Changes"
                    />
                </Section>

                <Section icon={LuKeyRound} title="Change Password" description="Use at least 8 characters with upper and lower case letters, a number and a symbol.">
                    <DynamicForm
                        key={passwordFormKey}
                        fields={passwordFormFields}
                        onSubmit={handleChangePassword}
                        submitLabel="Update Password"
                    />
                </Section>
            </div>
        </div>
    );
}
