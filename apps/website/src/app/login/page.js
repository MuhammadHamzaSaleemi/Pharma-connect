'use client'
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { isAdminRole } from "../../lib/roles";

export default function Login(){
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            const data = await login(email, password);
            router.push(isAdminRole(data.role) ? '/dashboard' : '/');
        } catch (err) {
            setError(err.message || 'Unable to sign in');
        } finally {
            setIsSubmitting(false);
        }
    };

    return(
        <section className="bg-home d-flex align-items-center" style={{backgroundImage:"url('/images/hero/bg3.jpg')", backgroundPosition:'center'}}>
            <div className="bg-overlay bg-linear-gradient-2"></div>
            <div className="container">
                <div className="row">
                    <div className="col-lg-4 col-md-5 col-12">
                        <div className="p-4 bg-white rounded shadow-md mx-auto w-100" style={{maxWidth:'400px'}}>
                            <form onSubmit={handleSubmit}>
                                <Link href="/"><Image src='/images/logo.png' width={120} height={18} className="mb-4 d-block mx-auto" alt=""/></Link>
                                <h6 className="mb-3 text-uppercase fw-semibold">Please sign in</h6>

                                {error && <div className="alert alert-danger py-2 small">{error}</div>}

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Your Email</label>
                                    <input name="email" id="email" type="email" className="form-control" placeholder="example@website.com" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold" htmlFor="loginpass">Password</label>
                                    <input type="password" className="form-control" id="loginpass" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                                </div>

                                <div className="d-flex justify-content-between">
                                    <div className="mb-3">
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
                                            <label className="form-label form-check-label text-muted" htmlFor="flexCheckDefault">Remember me</label>
                                        </div>
                                    </div>
                                    <span className="forgot-pass text-muted small mb-0"><Link href="/reset-password" className="text-muted">Forgot password ?</Link></span>
                                </div>

                                <button className="btn btn-primary w-100" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Signing in...' : 'Sign in'}</button>

                                <div className="col-12 text-center mt-3">
                                    <span><span className="text-muted me-2 small">Dont have an account ?</span> <Link href="/signup" className="text-dark fw-semibold small">Sign Up</Link></span>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
