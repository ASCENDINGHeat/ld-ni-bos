import React from 'react';
import {
    ArrowRightIcon,
    CartIcon,
    ChevronRightIcon,
    MinusIcon,
    PlusIcon,
    ShieldCheckIcon,
    TrashIcon,
} from './Icons';

const formatRupiah = (amount) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(amount);

export default function CartPage({
    items = [],
    onUpdateQuantity,
    onRemoveItem,
    onContinueShopping,
    onCheckout,
}) {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <section className="mx-auto w-full max-w-[1280px] space-y-6 px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                <button type="button" onClick={onContinueShopping} className="hover:text-[var(--brand-600)]">
                    Katalog
                </button>
                <ChevronRightIcon className="h-3.5 w-3.5" />
                <span className="font-semibold text-[var(--text-primary)]">Keranjang Belanja</span>
            </nav>

            <header className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--border)] pb-5">
                <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[var(--brand-600)]">
                        Pesanan Anda
                    </p>
                    <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
                        Keranjang Belanja
                    </h1>
                </div>
                <p className="text-sm text-[var(--text-secondary)]">{itemCount} barang</p>
            </header>

            {items.length === 0 ? (
                <div className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] px-5 py-14 text-center shadow-[var(--shadow-card)]">
                    <CartIcon className="mx-auto h-12 w-12 text-[var(--text-muted)]" />
                    <h2 className="mt-4 text-lg font-bold">Keranjang Anda masih kosong</h2>
                    <p className="mx-auto mt-2 max-w-md text-sm text-[var(--text-secondary)]">
                        Jelajahi katalog untuk memilih komponen PC yang ingin Anda beli.
                    </p>
                    <button
                        type="button"
                        onClick={onContinueShopping}
                        className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-md)] bg-[var(--brand-600)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--brand-700)]"
                    >
                        Mulai Belanja
                        <ArrowRightIcon className="h-4 w-4" />
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
                    <div className="space-y-3 lg:col-span-8">
                        {items.map((item) => (
                            <article
                                key={item.id}
                                className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-card)] sm:flex-row sm:items-center"
                            >
                                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-muted)] p-2">
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} className="h-full w-full object-contain" />
                                    ) : (
                                        <CartIcon className="h-8 w-8 text-[var(--brand-600)]" />
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                                        {item.categoryName || item.category || 'Komponen PC'}
                                        {item.brand ? ` · ${item.brand}` : ''}
                                    </p>
                                    <h2 className="mt-1 line-clamp-2 font-semibold leading-snug">
                                        {item.name}
                                    </h2>
                                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-[var(--text-secondary)]">
                                        {item.cpuSocket && <span>Socket {item.cpuSocket}</span>}
                                        {item.ramFormFactor && <span>{item.ramFormFactor}</span>}
                                        {item.stock && <span>{item.stock}</span>}
                                    </div>
                                    <p className="mt-2 text-sm font-bold text-[var(--brand-600)]">
                                        {formatRupiah(item.price)}
                                        <span className="font-normal text-[var(--text-muted)]"> / unit</span>
                                    </p>
                                </div>
                                <div className="flex items-center justify-between gap-4 border-t border-[var(--border)] pt-3 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
                                    <div className="flex h-10 items-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)]">
                                        <button
                                            type="button"
                                            onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                            disabled={item.quantity <= 1}
                                            className="p-2.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-40"
                                            aria-label={`Kurangi jumlah ${item.name}`}
                                        >
                                            <MinusIcon className="h-4 w-4" />
                                        </button>
                                        <span className="min-w-8 text-center text-sm font-semibold" aria-label="Kuantitas">
                                            {item.quantity}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                            className="p-2.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                            aria-label={`Tambah jumlah ${item.name}`}
                                        >
                                            <PlusIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-bold">
                                            {formatRupiah(item.price * item.quantity)}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => onRemoveItem(item.id)}
                                            className="rounded-[var(--radius-sm)] p-2 text-[var(--text-muted)] hover:bg-[var(--danger-bg)] hover:text-[var(--danger)]"
                                            aria-label={`Hapus ${item.name} dari keranjang`}
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    <aside className="space-y-4 rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)] lg:sticky lg:top-36 lg:col-span-4">
                        <h2 className="text-base font-bold">Ringkasan Pesanan</h2>
                        <div className="space-y-3 border-y border-[var(--border)] py-4 text-sm">
                            <div className="flex justify-between gap-3 text-[var(--text-secondary)]">
                                <span>Subtotal ({itemCount} barang)</span>
                                <span className="font-medium text-[var(--text-primary)]">{formatRupiah(subtotal)}</span>
                            </div>
                            <div className="flex justify-between gap-3 text-[var(--text-secondary)]">
                                <span>Pengiriman</span>
                                <span>Dihitung saat checkout</span>
                            </div>
                        </div>
                        <div className="flex justify-between gap-3 text-base font-extrabold">
                            <span>Total sementara</span>
                            <span className="text-[var(--brand-600)]">{formatRupiah(subtotal)}</span>
                        </div>
                        <p className="text-xs leading-relaxed text-[var(--text-muted)]">
                            Ongkos kirim dan total akhir ditampilkan setelah Anda memilih alamat dan layanan pengiriman.
                        </p>
                        <button
                            type="button"
                            onClick={onCheckout}
                            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--brand-600)] px-4 py-3 text-sm font-bold text-white hover:bg-[var(--brand-700)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)]"
                        >
                            Lanjut ke Checkout
                            <ArrowRightIcon className="h-4 w-4" />
                        </button>
                        <div className="flex items-center justify-center gap-2 text-[11px] text-[var(--text-muted)]">
                            <ShieldCheckIcon className="h-4 w-4 text-[var(--success)]" />
                            Periksa kembali rincian sebelum melanjutkan
                        </div>
                        <button
                            type="button"
                            onClick={onContinueShopping}
                            className="w-full py-2 text-sm font-semibold text-[var(--brand-600)] hover:underline"
                        >
                            Lanjut Belanja
                        </button>
                    </aside>
                </div>
            )}
        </section>
    );
}
