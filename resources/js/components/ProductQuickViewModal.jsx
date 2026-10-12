import React, { useEffect, useState } from 'react';
import {
    XIcon,
    CartIcon,
    HeartIcon,
    WrenchIcon,
    CpuIcon,
    MonitorIcon,
    HardDriveIcon,
    ShieldCheckIcon,
    PlusIcon,
    MinusIcon,
    ArrowRightIcon,
} from './Icons';

export default function ProductQuickViewModal({
    isOpen,
    product,
    onClose,
    onAddToCart,
    onToggleWishlist,
    isWishlisted = false,
    onOpenPCBuilder,
    onViewFullDetail,
}) {
    const [quantity, setQuantity] = useState(1);
    const [selectedGalleryIdx, setSelectedGalleryIdx] = useState(0);

    // Reset quantity and gallery index on product change
    useEffect(() => {
        if (product) {
            setQuantity(1);
            setSelectedGalleryIdx(0);
        }
    }, [product]);

    // Keyboard ESC listener & body scroll lock
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

    if (!isOpen || !product) return null;

    const {
        id,
        name,
        category,
        categoryName,
        brand,
        price,
        originalPrice,
        stock = 'Tersedia',
        inStock = true,
        cpuSocket,
        tdp,
        chipset,
        warranty,
        specs = [],
        badge,
        image,
        gallery = [],
    } = product;

    const formatRupiah = (val) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(val);
    };

    const isOutOfStock = !inStock || stock.toLowerCase() === 'habis';

    const discountPercentage =
        originalPrice && originalPrice > price
            ? Math.round(((originalPrice - price) / originalPrice) * 100)
            : null;

    const renderCategoryIcon = () => {
        switch (category) {
            case 'processor':
                return <CpuIcon className="w-16 h-16 text-[var(--brand-600)]/60" />;
            case 'vga':
                return <MonitorIcon className="w-16 h-16 text-[var(--brand-600)]/60" />;
            case 'motherboard':
            case 'storage':
            case 'ram':
            case 'psu':
            default:
                return <HardDriveIcon className="w-16 h-16 text-[var(--brand-600)]/60" />;
        }
    };

    const handleAddToCartClick = () => {
        if (onAddToCart && !isOutOfStock) {
            onAddToCart({ ...product, quantity });
            onClose();
        }
    };

    const handlePCBuilderClick = () => {
        if (onOpenPCBuilder) {
            onOpenPCBuilder(product);
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="quick-view-title"
        >
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-200"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal Dialog Content */}
            <div className="relative w-full max-w-3xl rounded-[var(--radius-xl)] bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] shadow-2xl z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
                {/* Header */}
                <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--surface)]">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-600)]">
                            Quick View
                        </span>
                        <span className="text-[var(--border)]">•</span>
                        <span className="text-xs text-[var(--text-muted)] font-medium">
                            {categoryName || category}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-muted)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)]"
                        aria-label="Tutup preview produk"
                    >
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Body (2 Columns on tablet/desktop) */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[80vh] overflow-y-auto">
                    {/* Left Column: Visual Gallery */}
                    <div className="space-y-3 flex flex-col">
                        {/* Main Image (1:1 Ratio) */}
                        <div className="w-full aspect-square rounded-[var(--radius-lg)] bg-[var(--surface-muted)] border border-[var(--border)] flex items-center justify-center p-6 relative overflow-hidden">
                            {/* Stock Badge overlay */}
                            <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                                <span
                                    className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full shadow-xs ${
                                        isOutOfStock
                                            ? 'bg-[var(--danger-bg)] text-[var(--danger)]'
                                            : stock === 'Stok Terbatas'
                                            ? 'bg-[var(--warning-bg)] text-[var(--warning)]'
                                            : 'bg-[var(--success-bg)] text-[var(--success)]'
                                    }`}
                                >
                                    {isOutOfStock ? 'Stok Habis' : stock}
                                </span>
                                {badge && (
                                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-[var(--radius-sm)] bg-[var(--brand-50)] text-[var(--brand-700)] border border-[var(--brand-100)] shadow-xs">
                                        {badge}
                                    </span>
                                )}
                            </div>

                            {image ? (
                                <img
                                    src={image}
                                    alt={name}
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center gap-2 text-center">
                                    {renderCategoryIcon()}
                                    <span className="text-xs font-semibold text-[var(--text-secondary)]">
                                        {gallery[selectedGalleryIdx]?.label || brand}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Thumbnails switcher */}
                        {gallery && gallery.length > 1 && (
                            <div className="flex items-center gap-2 overflow-x-auto pb-1">
                                {gallery.map((item, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setSelectedGalleryIdx(idx)}
                                        className={`px-3 py-1.5 rounded-[var(--radius-md)] text-xs font-medium border text-left transition-all shrink-0 ${
                                            selectedGalleryIdx === idx
                                                ? 'border-[var(--brand-600)] bg-[var(--brand-50)] text-[var(--brand-700)]'
                                                : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[var(--brand-500)]'
                                        }`}
                                    >
                                        Foto {idx + 1}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Guarantee note */}
                        <div className="p-3 rounded-[var(--radius-md)] bg-[var(--surface-muted)] border border-[var(--border)] flex items-start gap-2.5 text-xs text-[var(--text-secondary)]">
                            <ShieldCheckIcon className="w-4 h-4 text-[var(--success)] shrink-0 mt-0.5" />
                            <div>
                                <span className="font-semibold text-[var(--text-primary)] block">
                                    {warranty || 'Garansi Resmi Distributor'}
                                </span>
                                <span className="text-[11px] text-[var(--text-muted)]">
                                    Jaminan unit original 100% dengan serial number terverifikasi.
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Information & Actions */}
                    <div className="space-y-4 flex flex-col justify-between">
                        <div className="space-y-3">
                            <div>
                                <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                                    {brand}
                                </span>
                                <h2
                                    id="quick-view-title"
                                    className="text-lg font-bold text-[var(--text-primary)] leading-snug mt-0.5"
                                >
                                    {name}
                                </h2>
                            </div>

                            {/* Price */}
                            <div className="p-3.5 rounded-[var(--radius-md)] bg-[var(--surface-muted)] border border-[var(--border)]">
                                <span className="text-[11px] text-[var(--text-muted)] block mb-0.5">
                                    Harga Resmi Retail
                                </span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-extrabold text-[var(--brand-600)]">
                                        {formatRupiah(price)}
                                    </span>
                                    {originalPrice && (
                                        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] line-through">
                                            <span>{formatRupiah(originalPrice)}</span>
                                            {discountPercentage && (
                                                <span className="text-[10px] font-bold text-[var(--danger)] bg-[var(--danger-bg)] px-1.5 py-0.2 rounded">
                                                    -{discountPercentage}%
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Key Technical Specifications Table */}
                            <div className="space-y-1.5">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                                    Spesifikasi Utama
                                </h4>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    {cpuSocket && (
                                        <div className="p-2 rounded-[var(--radius-sm)] bg-[var(--surface-muted)] border border-[var(--border)]">
                                            <span className="text-[10px] text-[var(--text-muted)] block">
                                                CPU Socket
                                            </span>
                                            <span className="font-semibold text-[var(--text-primary)]">
                                                {cpuSocket}
                                            </span>
                                        </div>
                                    )}

                                    {tdp && (
                                        <div className="p-2 rounded-[var(--radius-sm)] bg-[var(--surface-muted)] border border-[var(--border)]">
                                            <span className="text-[10px] text-[var(--text-muted)] block">
                                                TDP / Daya
                                            </span>
                                            <span className="font-semibold text-[var(--text-primary)] truncate block">
                                                {tdp}
                                            </span>
                                        </div>
                                    )}

                                    {chipset && (
                                        <div className="p-2 rounded-[var(--radius-sm)] bg-[var(--surface-muted)] border border-[var(--border)]">
                                            <span className="text-[10px] text-[var(--text-muted)] block">
                                                Chipset
                                            </span>
                                            <span className="font-semibold text-[var(--text-primary)] truncate block">
                                                {chipset}
                                            </span>
                                        </div>
                                    )}

                                    {warranty && (
                                        <div className="p-2 rounded-[var(--radius-sm)] bg-[var(--surface-muted)] border border-[var(--border)]">
                                            <span className="text-[10px] text-[var(--text-muted)] block">
                                                Garansi
                                            </span>
                                            <span className="font-semibold text-[var(--text-primary)] truncate block">
                                                {warranty}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Summary points */}
                            {specs && specs.length > 0 && (
                                <ul className="text-xs text-[var(--text-secondary)] space-y-1 pl-4 list-disc">
                                    {specs.slice(0, 3).map((spec, sIdx) => (
                                        <li key={sIdx}>{spec}</li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Actions Section */}
                        <div className="space-y-3 pt-3 border-t border-[var(--border)]">
                            {/* Quantity & Wishlist Selector */}
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-[var(--text-secondary)]">
                                        Jumlah:
                                    </span>
                                    <div className="flex items-center border border-[var(--border)] rounded-[var(--radius-md)] bg-[var(--surface)]">
                                        <button
                                            type="button"
                                            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                            disabled={quantity <= 1 || isOutOfStock}
                                            className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                            aria-label="Kurangi kuantitas"
                                        >
                                            <MinusIcon className="w-3.5 h-3.5" />
                                        </button>
                                        <span className="px-3 text-xs font-semibold text-[var(--text-primary)] min-w-[28px] text-center">
                                            {quantity}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setQuantity((q) => q + 1)}
                                            disabled={isOutOfStock}
                                            className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-30 transition-colors"
                                            aria-label="Tambah kuantitas"
                                        >
                                            <PlusIcon className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => onToggleWishlist && onToggleWishlist(product)}
                                    aria-pressed={isWishlisted}
                                    aria-label={
                                        isWishlisted
                                            ? `Hapus ${name} dari wishlist`
                                            : `Simpan ${name} ke wishlist`
                                    }
                                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-[var(--radius-md)] border text-xs font-medium transition-colors ${
                                        isWishlisted
                                            ? 'border-[var(--danger)] text-[var(--danger)] bg-[var(--danger-bg)]'
                                            : 'border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--danger)] hover:bg-[var(--surface-muted)]'
                                    }`}
                                >
                                    <HeartIcon
                                        className="w-4 h-4"
                                        fill={isWishlisted ? 'currentColor' : 'none'}
                                    />
                                    <span>{isWishlisted ? 'Tersimpan' : 'Wishlist'}</span>
                                </button>
                            </div>

                            {/* Primary & Secondary Buttons */}
                            <div className="space-y-2">
                                <button
                                    type="button"
                                    onClick={handleAddToCartClick}
                                    disabled={isOutOfStock}
                                    className={`w-full py-2.5 px-4 rounded-[var(--radius-md)] text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)] ${
                                        isOutOfStock
                                            ? 'bg-[var(--surface-muted)] text-[var(--text-muted)] cursor-not-allowed border border-[var(--border)]'
                                            : 'bg-[var(--brand-600)] hover:bg-[var(--brand-700)] text-white'
                                    }`}
                                >
                                    <CartIcon className="w-4 h-4" />
                                    <span>
                                        {isOutOfStock ? 'Stok Habis' : `Tambah ke Keranjang (${quantity})`}
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    onClick={handlePCBuilderClick}
                                    className="w-full py-2.5 px-4 rounded-[var(--radius-md)] bg-[var(--brand-50)] text-[var(--brand-700)] border border-[var(--brand-100)] text-xs font-semibold hover:bg-[var(--brand-100)] transition-colors flex items-center justify-center gap-2"
                                >
                                    <WrenchIcon className="w-4 h-4 text-[var(--brand-600)]" />
                                    <span>Simulasi di PC Builder</span>
                                </button>
                            </div>

                            {/* Full detail page link */}
                            {onViewFullDetail && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        onViewFullDetail(product);
                                        onClose();
                                    }}
                                    className="w-full text-center text-xs text-[var(--brand-600)] hover:underline font-semibold flex items-center justify-center gap-1 pt-1"
                                >
                                    <span>Buka Halaman Spesifikasi Lengkap</span>
                                    <ArrowRightIcon className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
