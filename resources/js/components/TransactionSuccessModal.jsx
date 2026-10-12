import React, { useEffect } from 'react';
import { CheckCircleIcon, XIcon } from './Icons';

export default function TransactionSuccessModal({ order, onClose }) {
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [onClose]);

    const formatRupiah = (amount) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(amount);

    return (
        <div
            className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="transaction-success-title"
        >
            <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" aria-hidden="true" />
            <section className="relative z-10 w-full max-w-md rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-6 text-center text-[var(--text-primary)] shadow-2xl sm:p-8">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-3 top-3 rounded-[var(--radius-sm)] p-2 text-[var(--text-muted)] hover:bg-[var(--surface-muted)]"
                    aria-label="Tutup konfirmasi pesanan"
                >
                    <XIcon className="h-5 w-5" />
                </button>
                <CheckCircleIcon className="mx-auto h-16 w-16 text-[var(--success)]" />
                <p className="mt-4 text-xs font-bold uppercase tracking-wider text-[var(--success)]">
                    Simulasi Checkout
                </p>
                <h2 id="transaction-success-title" className="mt-1 text-2xl font-extrabold">
                    Pesanan berhasil dibuat!
                </h2>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">
                    Rincian pesanan Anda sudah tercatat pada sesi demo ini.
                </p>
                <div className="mt-6 space-y-3 rounded-[var(--radius-lg)] bg-[var(--surface-muted)] p-4 text-left text-sm">
                    <div className="flex justify-between gap-3">
                        <span className="text-[var(--text-muted)]">Nomor pesanan</span>
                        <strong>{order.orderNumber}</strong>
                    </div>
                    <div className="flex justify-between gap-3">
                        <span className="text-[var(--text-muted)]">Pembayaran</span>
                        <strong className="text-right">{order.paymentLabel}</strong>
                    </div>
                    <div className="flex justify-between gap-3 border-t border-[var(--border)] pt-3">
                        <span className="font-semibold">Total simulasi</span>
                        <strong className="text-[var(--brand-600)]">{formatRupiah(order.total)}</strong>
                    </div>
                </div>
                <p className="mt-4 text-xs leading-relaxed text-[var(--text-muted)]">
                    Ini hanya konfirmasi prototipe. Pembayaran dan pengiriman belum diproses ke layanan nyata.
                </p>
                <button
                    type="button"
                    onClick={onClose}
                    className="mt-6 min-h-11 w-full rounded-[var(--radius-md)] bg-[var(--brand-600)] px-4 py-3 text-sm font-bold text-white hover:bg-[var(--brand-700)]"
                >
                    Kembali ke Beranda
                </button>
            </section>
        </div>
    );
}
