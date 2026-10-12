import React, { useEffect } from 'react';
import { ArrowRightIcon, HeartIcon, XIcon } from './Icons';

export default function WishlistModal({
    isOpen,
    items,
    onClose,
    onRemove,
    onSelectProduct,
    onOpenCatalog,
}) {
    useEffect(() => {
        if (!isOpen) return undefined;

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const formatRupiah = (value) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(value);

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="wishlist-modal-title"
        >
            <button
                type="button"
                className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
                onClick={onClose}
                aria-label="Tutup wishlist"
            />

            <section className="relative z-10 flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] shadow-2xl">
                <header className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4 sm:px-6">
                    <div className="flex items-center gap-2">
                        <HeartIcon className="h-5 w-5 text-[var(--danger)]" fill="currentColor" />
                        <div>
                            <h2 id="wishlist-modal-title" className="font-bold">
                                Wishlist Saya
                            </h2>
                            <p className="text-xs text-[var(--text-muted)]">
                                {items.length} produk favorit
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-[var(--radius-sm)] p-2 text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]"
                        aria-label="Tutup wishlist"
                    >
                        <XIcon className="h-5 w-5" />
                    </button>
                </header>

                <div className="flex-1 space-y-3 overflow-y-auto p-4 sm:p-5">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 py-10 text-center">
                            <HeartIcon className="h-10 w-10 text-[var(--text-muted)]" />
                            <div>
                                <h3 className="font-semibold">Wishlist masih kosong</h3>
                                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                                    Simpan produk favorit dari katalog, detail produk, atau Quick View.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={onOpenCatalog}
                                className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--brand-600)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--brand-700)]"
                            >
                                Buka Katalog
                                <ArrowRightIcon className="h-4 w-4" />
                            </button>
                        </div>
                    ) : (
                        items.map((product) => (
                            <article
                                key={product.id}
                                className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--border)] p-3 sm:flex-row sm:items-center"
                            >
                                {product.image ? (
                                    <img
                                        src={product.image}
                                        alt=""
                                        className="h-16 w-16 rounded-[var(--radius-md)] bg-[var(--surface-muted)] object-contain"
                                    />
                                ) : (
                                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--surface-muted)] text-[var(--brand-600)]">
                                        <HeartIcon className="h-6 w-6" />
                                    </div>
                                )}
                                <div className="min-w-0 flex-1">
                                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                                        {product.categoryName || product.category} · {product.brand}
                                    </p>
                                    <h3 className="mt-1 line-clamp-2 text-sm font-semibold">
                                        {product.name}
                                    </h3>
                                    <p className="mt-1 text-sm font-bold text-[var(--brand-600)]">
                                        {formatRupiah(product.price)}
                                    </p>
                                </div>
                                <div className="flex shrink-0 gap-2 sm:flex-col">
                                    <button
                                        type="button"
                                        onClick={() => onSelectProduct?.(product)}
                                        className="inline-flex items-center justify-center gap-1 rounded-[var(--radius-sm)] border border-[var(--border)] px-3 py-2 text-xs font-semibold hover:bg-[var(--surface-muted)]"
                                    >
                                        Lihat Produk
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onRemove(product)}
                                        className="rounded-[var(--radius-sm)] px-3 py-2 text-xs font-semibold text-[var(--danger)] hover:bg-[var(--danger-bg)]"
                                        aria-label={`Hapus ${product.name} dari wishlist`}
                                    >
                                        Hapus
                                    </button>
                                </div>
                            </article>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
}
