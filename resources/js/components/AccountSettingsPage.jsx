import React, { useState } from 'react';
import { ArrowRightIcon, MapPinIcon, ShieldCheckIcon, UserIcon } from './Icons';

const tabsByRole = {
    customer: [
        { id: 'profile', label: 'Profil' },
        { id: 'addresses', label: 'Alamat pengiriman' },
        { id: 'password', label: 'Ubah kata sandi' },
        { id: 'orders', label: 'Riwayat transaksi' },
    ],
    vendor: [
        { id: 'profile', label: 'Profil toko' },
        { id: 'addresses', label: 'Alamat gudang' },
        { id: 'payout', label: 'Rekening & pencairan' },
        { id: 'security', label: 'Otentikasi keamanan' },
    ],
};

function Field({ label, value = '', type = 'text', placeholder = '', readOnly = false }) {
    return (
        <label className="block space-y-1.5">
            <span className="text-sm font-semibold text-[var(--text-primary)]">{label}</span>
            <input
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--brand-500)] focus:ring-4 focus:ring-[var(--brand-500)]/10 read-only:bg-[var(--surface-muted)]"
                defaultValue={value}
                type={type}
                placeholder={placeholder}
                readOnly={readOnly}
            />
        </label>
    );
}

function TextAreaField({ label, value = '', placeholder = '' }) {
    return (
        <label className="block space-y-1.5">
            <span className="text-sm font-semibold text-[var(--text-primary)]">{label}</span>
            <textarea
                className="min-h-28 w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--brand-500)] focus:ring-4 focus:ring-[var(--brand-500)]/10"
                defaultValue={value}
                placeholder={placeholder}
            />
        </label>
    );
}

export default function AccountSettingsPage({ user, onOpenAuth }) {
    const role = user?.role === 'vendor' ? 'vendor' : 'customer';
    const tabs = user ? tabsByRole[role] : [];
    const [activeTab, setActiveTab] = useState(tabs[0]?.id || 'profile');
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [saveNotice, setSaveNotice] = useState('');

    if (!user) {
        return (
            <section className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
                    <div className="bg-gradient-to-br from-[var(--brand-950)] to-[var(--brand-800)] px-6 py-10 text-white sm:px-10">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">Pengaturan akun</p>
                        <h1 className="mt-2 text-3xl font-extrabold">Satu akun untuk belanja dan berjualan</h1>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200">
                            Masuk untuk melihat pengaturan sesuai peran Anda. Belum punya akun? Daftar sebagai Customer atau Vendor.
                        </p>
                    </div>
                    <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-10">
                        <article className="rounded-2xl border border-[var(--border)] p-5">
                            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--brand-50)] text-[var(--brand-700)]">
                                <UserIcon />
                            </span>
                            <h2 className="mt-4 text-lg font-bold text-[var(--text-primary)]">Masuk ke akun</h2>
                            <p className="mt-1 text-sm text-[var(--text-secondary)]">Kelola data profil, alamat, dan aktivitas akun.</p>
                            <button
                                type="button"
                                onClick={() => onOpenAuth('login', 'customer')}
                                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[var(--brand-600)] px-4 py-3 text-sm font-bold text-white hover:bg-[var(--brand-700)]"
                            >
                                Masuk <ArrowRightIcon />
                            </button>
                        </article>
                        <article className="rounded-2xl border border-[var(--border)] p-5">
                            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                                <ShieldCheckIcon />
                            </span>
                            <h2 className="mt-4 text-lg font-bold text-[var(--text-primary)]">Buat akun baru</h2>
                            <p className="mt-1 text-sm text-[var(--text-secondary)]">Pilih Customer untuk belanja atau Vendor untuk berjualan.</p>
                            <button
                                type="button"
                                onClick={() => onOpenAuth('register', 'customer')}
                                className="mt-5 inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-4 py-3 text-sm font-bold text-[var(--text-primary)] hover:bg-[var(--surface-muted)]"
                            >
                                Daftar <ArrowRightIcon />
                            </button>
                        </article>
                    </div>
                </div>
            </section>
        );
    }

    const handleDemoSave = (event) => {
        event.preventDefault();
        setSaveNotice('Belum tersimpan: endpoint penyimpanan pengaturan belum tersedia.');
    };

    const renderProfile = () => (
        <form className="space-y-5" onSubmit={handleDemoSave}>
            <div className="grid gap-4 sm:grid-cols-2">
                <Field label={role === 'vendor' ? 'Nama pemilik' : 'Nama lengkap'} value={user.name} />
                <Field label="Email akun" type="email" value={user.email} readOnly />
                {role === 'customer' ? (
                    <Field label="Nomor telepon" value={user.phone || ''} placeholder="+62..." />
                ) : (
                    <Field label="Nama toko" placeholder="Contoh: Nusantara PC" />
                )}
                {role === 'vendor' && <Field label="Nomor telepon toko" value={user.phone || ''} placeholder="+62..." />}
            </div>
            {role === 'vendor' && <TextAreaField label="Deskripsi toko" placeholder="Ceritakan produk dan layanan toko Anda" />}
            <button type="submit" className="rounded-xl bg-[var(--brand-600)] px-5 py-3 text-sm font-bold text-white hover:bg-[var(--brand-700)]">
                Simpan perubahan
            </button>
        </form>
    );

    const renderAddresses = () => (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-[var(--text-secondary)]">
                    {role === 'vendor' ? 'Alamat untuk pengambilan dan pengiriman stok.' : 'Alamat tujuan untuk pesanan Anda.'}
                </p>
                <button
                    type="button"
                    onClick={() => setShowAddressForm((show) => !show)}
                    className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-bold text-[var(--text-primary)] hover:bg-[var(--surface-muted)]"
                >
                    {showAddressForm ? 'Tutup form' : 'Tambah alamat'}
                </button>
            </div>
            {user.address && (
                <article className="flex items-start gap-3 rounded-2xl border border-[var(--border)] p-4">
                    <MapPinIcon className="mt-0.5 shrink-0 text-[var(--brand-600)]" />
                    <div>
                        <p className="text-sm font-bold text-[var(--text-primary)]">Alamat utama</p>
                        <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">{user.address}</p>
                    </div>
                </article>
            )}
            {showAddressForm && (
                <form className="grid gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-4 sm:grid-cols-2" onSubmit={handleDemoSave}>
                    <Field label="Label alamat" placeholder="Rumah / Gudang utama" />
                    <Field label="Nama penerima / PIC" placeholder="Nama lengkap" />
                    <div className="sm:col-span-2">
                        <TextAreaField label="Alamat lengkap" placeholder="Jalan, nomor, kelurahan, kecamatan, kota, kode pos" />
                    </div>
                    <div className="sm:col-span-2">
                        <button type="submit" className="rounded-xl bg-[var(--brand-600)] px-4 py-3 text-sm font-bold text-white hover:bg-[var(--brand-700)]">Simpan alamat</button>
                    </div>
                </form>
            )}
            {!user.address && !showAddressForm && (
                <div className="rounded-2xl border border-dashed border-[var(--border)] px-5 py-10 text-center text-sm text-[var(--text-secondary)]">
                    Belum ada alamat tersimpan. Tambahkan alamat untuk melengkapi profil.
                </div>
            )}
        </div>
    );

    const renderTabContent = () => {
        if (activeTab === 'profile') return renderProfile();
        if (activeTab === 'addresses') return renderAddresses();

        if (role === 'customer' && activeTab === 'password') {
            return (
                <form className="max-w-xl space-y-4" onSubmit={handleDemoSave}>
                    <Field label="Kata sandi saat ini" type="password" />
                    <Field label="Kata sandi baru" type="password" placeholder="Minimal 8 karakter" />
                    <Field label="Konfirmasi kata sandi baru" type="password" />
                    <button type="submit" className="rounded-xl bg-[var(--brand-600)] px-5 py-3 text-sm font-bold text-white hover:bg-[var(--brand-700)]">Perbarui kata sandi</button>
                </form>
            );
        }

        if (role === 'customer' && activeTab === 'orders') {
            return (
                <div className="rounded-2xl border border-dashed border-[var(--border)] px-5 py-12 text-center">
                    <p className="font-semibold text-[var(--text-primary)]">Riwayat transaksi belum tersedia</p>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">Data transaksi akan tampil setelah layanan pesanan terhubung.</p>
                </div>
            );
        }

        if (role === 'vendor' && activeTab === 'payout') {
            return (
                <form className="grid max-w-2xl gap-4 sm:grid-cols-2" onSubmit={handleDemoSave}>
                    <Field label="Nama bank" placeholder="Pilih / masukkan bank" />
                    <Field label="Nama pemilik rekening" placeholder="Sesuai buku tabungan" />
                    <div className="sm:col-span-2"><Field label="Nomor rekening" placeholder="Masukkan nomor rekening" /></div>
                    <div className="sm:col-span-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                        Data pencairan belum disimpan atau diverifikasi oleh server.
                    </div>
                    <button type="submit" className="rounded-xl bg-[var(--brand-600)] px-5 py-3 text-sm font-bold text-white hover:bg-[var(--brand-700)]">Simpan rekening</button>
                </form>
            );
        }

        if (role === 'vendor' && activeTab === 'security') {
            return (
                <div className="max-w-2xl space-y-4">
                    <div className="flex items-start gap-3 rounded-2xl border border-[var(--border)] p-4">
                        <ShieldCheckIcon className="mt-0.5 shrink-0 text-emerald-600" />
                        <div>
                            <p className="font-bold text-[var(--text-primary)]">Perlindungan akun</p>
                            <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">Gunakan kata sandi kuat. Pengaturan autentikasi dua faktor belum tersedia di layanan akun.</p>
                        </div>
                    </div>
                    <form className="space-y-4" onSubmit={handleDemoSave}>
                        <Field label="Kata sandi saat ini" type="password" />
                        <Field label="Kata sandi baru" type="password" placeholder="Minimal 8 karakter" />
                        <button type="submit" className="rounded-xl bg-[var(--brand-600)] px-5 py-3 text-sm font-bold text-white hover:bg-[var(--brand-700)]">Perbarui keamanan</button>
                    </form>
                </div>
            );
        }

        return null;
    };

    return (
        <section className="mx-auto w-full max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
            <div className="mb-7">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--brand-700)]">Akun {role === 'vendor' ? 'Vendor' : 'Customer'}</p>
                <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">Pengaturan akun</h1>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">Halo, {user.name}. Kelola informasi akun dan preferensi Anda.</p>
            </div>

            <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
                Tampilan pengaturan sudah tersedia, tetapi penyimpanan profil, alamat, rekening, kata sandi, dan transaksi belum terhubung ke API.
            </div>

            <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
                <nav className="flex gap-2 overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2 lg:block lg:space-y-1 lg:overflow-visible" aria-label="Menu pengaturan akun">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => {
                                setActiveTab(tab.id);
                                setSaveNotice('');
                            }}
                            className={`shrink-0 rounded-xl px-4 py-3 text-left text-sm font-semibold transition lg:w-full ${
                                activeTab === tab.id
                                    ? 'bg-[var(--brand-50)] text-[var(--brand-700)]'
                                    : 'text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]'
                            }`}
                            aria-current={activeTab === tab.id ? 'page' : undefined}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>

                <section className="min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm sm:p-7">
                    <h2 className="mb-5 text-xl font-bold text-[var(--text-primary)]">
                        {tabs.find((tab) => tab.id === activeTab)?.label}
                    </h2>
                    {saveNotice && (
                        <p className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-sm text-amber-900" role="status">
                            {saveNotice}
                        </p>
                    )}
                    {renderTabContent()}
                </section>
            </div>
        </section>
    );
}
