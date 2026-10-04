'use client'
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { isAdminRole } from "../../lib/roles";
import Button from "../componants/button";
import Icon from "../componants/msIcon";
import "../assets/css/tailwind.css";

// Icons must be in the Material Symbols subset in layout.js.
const HIGHLIGHTS = [
    { icon: "verified_user", title: "Verified listings", desc: "Every job and scholarship is reviewed before it goes live." },
    { icon: "work", title: "Pharma-focused roles", desc: "Openings across QA, medical affairs, sales and more." },
    { icon: "school", title: "Grow your career", desc: "Scholarships and guides for every stage." },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate({ email, password }) {
    const errors = {};
    if (!email.trim()) errors.email = "Email is required.";
    else if (!EMAIL_RE.test(email.trim())) errors.email = "Enter a valid email address.";
    if (!password) errors.password = "Password is required.";
    return errors;
}

function Field({ id, label, icon, error, children }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={id} className="text-sm font-semibold text-navy-surface">{label}</label>
            <div className="relative">
                <Icon
                    name={icon}
                    className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[20px] ${error ? "text-error" : "text-outline"}`}
                />
                {children}
            </div>
            {error && (
                <p id={`${id}-error`} className="flex items-center gap-1 text-xs font-medium text-error m-0">
                    <Icon name="info" className="text-[16px]" />
                    {error}
                </p>
            )}
        </div>
    );
}

const inputClass = (error) =>
    `w-full rounded-xl border bg-surface-card pl-10 pr-3 py-3 text-sm text-navy-surface placeholder:text-outline transition-colors focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:bg-surface-crisp disabled:text-outline ${
        error
            ? "border-error focus:border-error focus:ring-error/15"
            : "border-border-subtle hover:border-outline-variant focus:border-primary focus:ring-primary/15"
    }`;

export default function Login(){
    const router = useRouter();
    const { login } = useAuth();
    const [values, setValues] = useState({ email: '', password: '' });
    const [touched, setTouched] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [status, setStatus] = useState('idle'); // idle | submitting | success

    const errors = validate(values);
    const fieldError = (name) => touched[name] ? errors[name] : undefined;
    const busy = status !== 'idle';

    const onChange = (e) => {
        setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
        if (error) setError('');
    };
    const onBlur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setTouched({ email: true, password: true });
        if (Object.keys(errors).length) return;
        setError('');
        setStatus('submitting');
        try {
            const data = await login(values.email.trim(), values.password);
            setStatus('success');
            router.push(isAdminRole(data.role) ? '/dashboard' : '/');
        } catch (err) {
            setError(err.message || 'Unable to sign in');
            setStatus('idle');
        }
    };

    return(
        <main className="min-h-screen grid lg:grid-cols-2 bg-surface font-sans text-on-surface antialiased">
            {/* Brand panel: desktop only, so mobile goes straight to the form. */}
            <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-navy-deep p-space-3xl text-white">
                <div aria-hidden="true" className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/40 blur-3xl"></div>
                <div aria-hidden="true" className="absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-cyan-bright/20 blur-3xl"></div>

                <Link href="/" className="relative inline-flex w-fit rounded-lg bg-white px-3 py-2">
                    <Image src="/images/logo.png" width={100} height={40} alt="PharmaConnect" priority />
                </Link>

                <div className="relative max-w-md">
                    <h2 className="text-4xl font-extrabold leading-[1.15] tracking-tight m-0">
                        Your pharma career, <span className="text-primary-fixed-dim">connected.</span>
                    </h2>
                    <p className="mt-space-md text-base text-white/70 leading-relaxed">
                        Sign in to manage jobs, scholarships and blogs across PharmaConnect.
                    </p>
                    <ul className="mt-space-2xl flex flex-col gap-space-lg p-0 list-none">
                        {HIGHLIGHTS.map((h) => (
                            <li key={h.title} className="flex items-start gap-space-md">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-primary-fixed-dim">
                                    <Icon name={h.icon} className="text-[22px]" />
                                </span>
                                <span>
                                    <span className="block font-semibold">{h.title}</span>
                                    <span className="block text-sm text-white/60">{h.desc}</span>
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                <p className="relative text-xs text-white/40 m-0">© {new Date().getFullYear()} PharmaConnect</p>
            </aside>

            <section className="flex items-center justify-center px-gutter-mobile py-space-2xl sm:px-space-xl">
                <div className="w-full max-w-md">
                    <Link href="/" className="mb-space-xl inline-flex lg:hidden">
                        <Image src="/images/logo.png" width={100} height={40} alt="PharmaConnect" priority />
                    </Link>

                    <div className="rounded-2xl border border-border-subtle bg-surface-card p-space-lg shadow-sm sm:p-space-xl">
                        <h1 className="text-2xl font-extrabold tracking-tight text-navy-surface m-0">Welcome back</h1>
                        <p className="mt-1 mb-space-lg text-sm text-on-surface-variant">Sign in to your account to continue.</p>

                        {error && (
                            <div role="alert" className="mb-space-md flex items-start gap-2 rounded-xl border border-error/20 bg-error-container/60 px-3 py-2.5 text-sm text-on-error-container">
                                <Icon name="info" className="text-[18px] mt-px" />
                                <span>{error}</span>
                            </div>
                        )}
                        {status === 'success' && (
                            <div role="status" className="mb-space-md flex items-center gap-2 rounded-xl border border-verified-green/20 bg-verified-green/10 px-3 py-2.5 text-sm font-medium text-teal-clinical">
                                <Icon name="check_circle" className="text-[18px]" />
                                Signed in. Redirecting…
                            </div>
                        )}

                        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-space-md">
                            <Field id="email" label="Email address" icon="mail" error={fieldError('email')}>
                                <input
                                    id="email" name="email" type="email" autoComplete="email" inputMode="email"
                                    placeholder="you@example.com"
                                    value={values.email} onChange={onChange} onBlur={onBlur} disabled={busy}
                                    aria-invalid={!!fieldError('email')}
                                    aria-describedby={fieldError('email') ? 'email-error' : undefined}
                                    className={inputClass(fieldError('email'))}
                                />
                            </Field>

                            <Field id="password" label="Password" icon="lock" error={fieldError('password')}>
                                <input
                                    id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password"
                                    placeholder="Enter your password"
                                    value={values.password} onChange={onChange} onBlur={onBlur} disabled={busy}
                                    aria-invalid={!!fieldError('password')}
                                    aria-describedby={fieldError('password') ? 'password-error' : undefined}
                                    className={`${inputClass(fieldError('password'))} pr-11`}
                                />
                                <button
                                    type="button" onClick={() => setShowPassword((s) => !s)} disabled={busy}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword}
                                    className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-lg border-0 bg-transparent text-outline hover:text-navy-surface hover:bg-surface-container-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:opacity-50"
                                >
                                    <Icon name={showPassword ? 'visibility_off' : 'visibility'} className="text-[20px]" />
                                </button>
                            </Field>

                            <Button type="submit" size="lg" fullWidth disabled={busy} aria-busy={status === 'submitting'} className="mt-space-xs py-3">
                                {status === 'submitting' ? (
                                    <><Icon name="progress_activity" className="text-[18px] animate-spin" />Signing in…</>
                                ) : status === 'success' ? (
                                    <><Icon name="check" className="text-[18px]" />Signed in</>
                                ) : (
                                    <>Sign in<Icon name="arrow_forward" className="text-[18px]" /></>
                                )}
                            </Button>
                        </form>
                    </div>

                    <Link href="/" className="mt-space-lg flex items-center justify-center gap-1 text-sm font-medium text-on-surface-variant no-underline hover:text-primary">
                        <Icon name="home" className="text-[18px]" />
                        Back to home
                    </Link>
                </div>
            </section>
        </main>
    )
}
