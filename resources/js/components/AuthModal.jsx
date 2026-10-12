import React, { useEffect, useState } from 'react';
import { XIcon, ShieldCheckIcon } from './Icons';

export default function AuthModal({
    isOpen,
    onClose,
    onAuthenticated,
    initialMode = 'login',
    initialRole = 'customer',
}) {
    const [mode, setMode] = useState(initialMode);
    const [role, setRole] = useState(initialRole);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            setMode(initialMode);
            setRole(initialRole);
            setErrorMessage('');
            setFieldErrors({});
        }
    }, [initialMode, initialRole, isOpen]);

    useEffect(() => {
        if (!isOpen) return undefined;

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');
        setFieldErrors({});

        const formData = new FormData(event.currentTarget);
        const payload = Object.fromEntries(formData.entries());
        const endpoint = mode === 'register' ? '/api/register' : '/api/login';
        delete payload.account_role;

        if (mode === 'register') {
            payload.role = role;
            payload.password_confirmation = formData.get('password_confirmation');
        } else {
            payload.device_name = 'pc-store-web';
        }

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            let result;

            try {
                result = await response.json();
            } catch {
                setErrorMessage('Server memberikan respons yang tidak dapat dibaca. Silakan coba lagi.');
                return;
            }

            if (!response.ok) {
                if (response.status === 422 && result.errors) {
                    setFieldErrors(result.errors);
                    setErrorMessage('Periksa kembali data yang Anda masukkan.');
                } else {
                    setErrorMessage(result.message || 'Autentikasi gagal. Silakan coba kembali.');
                }
                return;
            }

            onAuthenticated({ user: result.user, token: result.token });
            onClose();
        } catch {
            setErrorMessage('Tidak dapat terhubung ke server. Periksa koneksi lalu coba lagi.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const fieldClassName =
        'w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--brand-500)] focus:ring-4 focus:ring-[var(--brand-500)]/10';

    return (
        <div
            className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm"
            role="presentation"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <section
                className="relative my-auto w-full max-w-lg rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl sm:p-8"
                role="dialog"
                aria-modal="true"
                aria-labelledby="auth-modal-title"
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-lg p-2 text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]"
                    aria-label="Tutup dialog"
                >
                    <XIcon />
                </button>

                <div className="mb-6 flex items-start gap-3 pr-8">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand-50)] text-[var(--brand-700)]">
                        <ShieldCheckIcon />
                    </span>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--brand-700)]">
                            PC Store Account
                        </p>
                        <h2 id="auth-modal-title" className="mt-1 text-2xl font-bold text-[var(--text-primary)]">
                            {mode === 'login' ? 'Selamat datang kembali' : 'Buat akun baru'}
                        </h2>
                        <p className="mt-1 text-sm text-[var(--text-secondary)]">
                            {mode === 'login'
                                ? 'Masuk untuk mengelola akun dan pesanan Anda.'
                                : 'Pilih jenis akun yang sesuai untuk memulai.'}
                        </p>
                    </div>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    {mode === 'register' && (
                        <>
                            <fieldset>
                                <legend className="mb-2 text-sm font-semibold text-[var(--text-primary)]">
                                    Daftar sebagai
                                </legend>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { value: 'customer', title: 'Customer', description: 'Pembeli produk' },
                                        { value: 'vendor', title: 'Vendor', description: 'Penjual hardware' },
                                    ].map((option) => (
                                        <label
                                            key={option.value}
                                            className={`cursor-pointer rounded-2xl border p-3 transition ${
                                                role === option.value
                                                    ? 'border-[var(--brand-500)] bg-[var(--brand-50)] ring-2 ring-[var(--brand-500)]/15'
                                                    : 'border-[var(--border)] hover:border-[var(--brand-300)]'
                                            }`}
                                        >
                                            <input
                                                className="sr-only"
                                                type="radio"
                                                name="account_role"
                                                value={option.value}
                                                checked={role === option.value}
                                                onChange={() => setRole(option.value)}
                                            />
                                            <span className="block text-sm font-bold text-[var(--text-primary)]">
                                                {option.title}
                                            </span>
                                            <span className="mt-0.5 block text-xs text-[var(--text-secondary)]">
                                                {option.description}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </fieldset>

                            <label className="block space-y-1.5">
                                <span className="text-sm font-medium text-[var(--text-primary)]">Nama lengkap</span>
                                <input className={fieldClassName} name="name" autoComplete="name" required />
                                {fieldErrors.name && <span className="text-xs text-rose-600">{fieldErrors.name[0]}</span>}
                            </label>
                        </>
                    )}

                    <label className="block space-y-1.5">
                        <span className="text-sm font-medium text-[var(--text-primary)]">Email</span>
                        <input
                            className={fieldClassName}
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                        />
                        {fieldErrors.email && <span className="text-xs text-rose-600">{fieldErrors.email[0]}</span>}
                    </label>

                    <label className="block space-y-1.5">
                        <span className="text-sm font-medium text-[var(--text-primary)]">Kata sandi</span>
                        <span className="relative block">
                            <input
                                className={`${fieldClassName} pr-20`}
                                name="password"
                                type={isPasswordVisible ? 'text' : 'password'}
                                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                                minLength={8}
                                required
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-3 text-xs font-semibold text-[var(--brand-700)]"
                                onClick={() => setIsPasswordVisible((visible) => !visible)}
                                aria-pressed={isPasswordVisible}
                            >
                                {isPasswordVisible ? 'Sembunyikan' : 'Tampilkan'}
                            </button>
                        </span>
                        {fieldErrors.password && <span className="text-xs text-rose-600">{fieldErrors.password[0]}</span>}
                    </label>

                    {mode === 'register' && (
                        <>
                            <label className="block space-y-1.5">
                                <span className="text-sm font-medium text-[var(--text-primary)]">Konfirmasi kata sandi</span>
                                <input
                                    className={fieldClassName}
                                    name="password_confirmation"
                                    type={isPasswordVisible ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    minLength={8}
                                    required
                                />
                            </label>
                            {fieldErrors.role && <p className="text-xs text-rose-600">{fieldErrors.role[0]}</p>}
                        </>
                    )}

                    {errorMessage && (
                        <p className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-700" role="alert">
                            {errorMessage}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex w-full items-center justify-center rounded-xl bg-[var(--brand-600)] px-4 py-3.5 text-sm font-bold text-white transition hover:bg-[var(--brand-700)] disabled:cursor-wait disabled:opacity-60"
                    >
                        {isSubmitting
                            ? 'Memproses...'
                            : mode === 'login'
                              ? 'Masuk'
                              : role === 'vendor'
                                ? 'Daftar sebagai Vendor'
                                : 'Daftar sebagai Customer'}
                    </button>
                </form>

                <p className="mt-5 text-center text-sm text-[var(--text-secondary)]">
                    {mode === 'login' ? 'Belum memiliki akun?' : 'Sudah memiliki akun?'}{' '}
                    <button
                        type="button"
                        onClick={() => {
                            setMode(mode === 'login' ? 'register' : 'login');
                            setErrorMessage('');
                            setFieldErrors({});
                        }}
                        className="font-bold text-[var(--brand-700)] hover:underline"
                    >
                        {mode === 'login' ? 'Daftar sekarang' : 'Masuk'}
                    </button>
                </p>
                <p className="mt-3 text-center text-xs text-[var(--text-muted)]">
                    Sesi login hanya aktif selama halaman ini terbuka; kredensial tidak disimpan di browser.
                </p>
            </section>
        </div>
    );
}
