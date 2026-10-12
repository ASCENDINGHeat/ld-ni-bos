import React, { useEffect, useRef } from 'react';
import { XIcon, TrashIcon, PlusIcon, MinusIcon, CartIcon, ArrowRightIcon, ShieldCheckIcon } from './Icons';

export default function CartDrawer({
    isOpen,
    onClose,
    items = [],
    onUpdateQuantity,
    onRemoveItem,
    onCheckout,
}) {
    const drawerRef = useRef(null);

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    const formatRupiah = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const freeShippingThreshold = 2000000;
    const progressToFreeShipping = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
    const amountLeftForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

    return (
        <div
            className={`fixed inset-0 z-50 transition-opacity duration-300 ${
                isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            aria-hidden={!isOpen}
            inert={!isOpen}
            aria-labelledby="cart-drawer-title"
            role="dialog"
            aria-modal="true"
        >
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Slide-out Drawer Panel */}
            <div
                ref={drawerRef}
                className={`fixed inset-y-0 right-0 max-w-full flex pl-10 transform transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="w-screen max-w-md bg-[var(--surface)] text-[var(--text-primary)] border-l border-[var(--border)] shadow-2xl flex flex-col">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--surface)]">
                        <div className="flex items-center gap-2">
                            <CartIcon className="w-5 h-5 text-[var(--brand-600)]" />
                            <h2 id="cart-drawer-title" className="text-lg font-semibold text-[var(--text-primary)]">
                                Keranjang Belanja
                            </h2>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--brand-50)] text-[var(--brand-700)] border border-[var(--brand-100)]">
                                {items.reduce((acc, i) => acc + i.quantity, 0)} item
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-2 rounded-[var(--radius-sm)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-muted)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)]"
                            aria-label="Tutup keranjang"
                        >
                            <XIcon className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Free shipping bar */}
                    {items.length > 0 && (
                        <div className="px-6 py-3 bg-[var(--surface-muted)] border-b border-[var(--border)] text-xs">
                            <div className="flex justify-between items-center mb-1.5">
                                <span className="font-medium text-[var(--text-secondary)]">
                                    {amountLeftForFreeShipping === 0
                                        ? '🎉 Selamat! Anda mendapatkan Bebas Ongkir'
                                        : `Tambah ${formatRupiah(amountLeftForFreeShipping)} lagi untuk Bebas Ongkir`}
                                </span>
                                <span className="font-semibold text-[var(--brand-600)]">{progressToFreeShipping}%</span>
                            </div>
                            <div className="w-full bg-[var(--border)] rounded-full h-1.5 overflow-hidden">
                                <div
                                    className="bg-[var(--brand-600)] h-1.5 rounded-full transition-all duration-300"
                                    style={{ width: `${progressToFreeShipping}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Items List / Empty State */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center py-12">
                                <div className="w-16 h-16 rounded-full bg-[var(--surface-muted)] flex items-center justify-center text-[var(--text-muted)] mb-4">
                                    <CartIcon className="w-8 h-8" />
                                </div>
                                <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">
                                    Keranjang Anda masih kosong
                                </h3>
                                <p className="text-sm text-[var(--text-secondary)] max-w-xs mb-6">
                                    Jelajahi berbagai komponen PC berkualitas tinggi dan rakit sistem impian Anda.
                                </p>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-[var(--radius-md)] bg-[var(--brand-600)] text-white text-sm font-medium hover:bg-[var(--brand-700)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)] focus-visible:ring-offset-2"
                                >
                                    Mulai Belanja
                                </button>
                            </div>
                        ) : (
                            <ul className="divide-y divide-[var(--border)]">
                                {items.map((item) => (
                                    <li key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                                        {/* Thumbnail with 1:1 ratio */}
                                        <div className="w-20 h-20 shrink-0 rounded-[var(--radius-md)] bg-[var(--surface-muted)] border border-[var(--border)] overflow-hidden flex items-center justify-center p-1.5">
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-contain"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="text-[var(--text-muted)] text-xs text-center font-mono">
                                                    PC PART
                                                </div>
                                            )}
                                        </div>

                                        {/* Info & Quantity controls */}
                                        <div className="flex-1 flex flex-col justify-between min-w-0">
                                            <div className="flex justify-between items-start gap-2">
                                                <div>
                                                    <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
                                                        {item.category || 'Komponen'}
                                                    </span>
                                                    <h4 className="text-sm font-medium text-[var(--text-primary)] line-clamp-2 leading-snug">
                                                        {item.name}
                                                    </h4>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => onRemoveItem && onRemoveItem(item.id)}
                                                    className="text-[var(--text-muted)] hover:text-[var(--danger)] transition-colors p-1 rounded-[var(--radius-sm)]"
                                                    aria-label={`Hapus ${item.name} dari keranjang`}
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-sm font-semibold text-[var(--brand-600)]">
                                                    {formatRupiah(item.price)}
                                                </span>

                                                {/* Stepper */}
                                                <div className="flex items-center border border-[var(--border)] rounded-[var(--radius-sm)] bg-[var(--surface)]">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            onUpdateQuantity &&
                                                            onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))
                                                        }
                                                        disabled={item.quantity <= 1}
                                                        className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                                        aria-label="Kurangi kuantitas"
                                                    >
                                                        <MinusIcon className="w-3.5 h-3.5" />
                                                    </button>
                                                    <span className="px-2 text-xs font-medium text-[var(--text-primary)] min-w-[24px] text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            onUpdateQuantity &&
                                                            onUpdateQuantity(item.id, item.quantity + 1)
                                                        }
                                                        className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                                                        aria-label="Tambah kuantitas"
                                                    >
                                                        <PlusIcon className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Footer */}
                    {items.length > 0 && (
                        <div className="p-6 border-t border-[var(--border)] bg-[var(--surface)] space-y-4">
                            <div className="space-y-1.5 text-sm">
                                <div className="flex justify-between text-[var(--text-secondary)]">
                                    <span>Subtotal</span>
                                    <span>{formatRupiah(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-[var(--text-secondary)]">
                                    <span>Estimasi Pengiriman</span>
                                    <span>
                                        {amountLeftForFreeShipping === 0 ? (
                                            <span className="text-[var(--success)] font-medium">Gratis</span>
                                        ) : (
                                            'Dihitung saat checkout'
                                        )}
                                    </span>
                                </div>
                                <div className="pt-2 border-t border-[var(--border)] flex justify-between font-semibold text-base text-[var(--text-primary)]">
                                    <span>Total Akhir</span>
                                    <span className="text-[var(--brand-600)]">{formatRupiah(subtotal)}</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <button
                                    type="button"
                                    onClick={onCheckout}
                                    className="w-full py-3 px-4 rounded-[var(--radius-md)] bg-[var(--brand-600)] text-white font-medium hover:bg-[var(--brand-700)] transition-colors flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)] focus-visible:ring-offset-2"
                                >
                                    <span>Lanjut ke Pembayaran</span>
                                    <ArrowRightIcon className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="w-full py-2.5 px-4 rounded-[var(--radius-md)] bg-[var(--surface-muted)] text-[var(--text-primary)] text-sm font-medium hover:bg-[var(--border)] transition-colors"
                                >
                                    Lanjut Belanja
                                </button>
                            </div>

                            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[var(--text-muted)] pt-1">
                                <ShieldCheckIcon className="w-3.5 h-3.5 text-[var(--success)]" />
                                <span>Transaksi aman, garansi resmi distributor 100%</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
