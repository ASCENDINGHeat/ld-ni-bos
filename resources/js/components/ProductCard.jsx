import React from 'react';
import {
    HeartIcon,
    CartIcon,
    CpuIcon,
    MonitorIcon,
    HardDriveIcon,
    CheckCircleIcon,
    EyeIcon,
} from './Icons';

export default function ProductCard({
    product,
    onAddToCart,
    onToggleWishlist,
    isWishlisted = false,
    onQuickView,
    onSelectProduct,
}) {

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
        ramFormFactor,
        specs = [],
        badge,
        image,
    } = product;

    const formatRupiah = (val) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(val);
    };

    // Render appropriate icon placeholder based on category
    const renderCategoryIcon = () => {
        switch (category) {
            case 'processor':
                return <CpuIcon className="w-12 h-12 text-[var(--brand-600)]/60" />;
            case 'vga':
                return <MonitorIcon className="w-12 h-12 text-[var(--brand-600)]/60" />;
            case 'motherboard':
            case 'storage':
            case 'ram':
            case 'psu':
            default:
                return <HardDriveIcon className="w-12 h-12 text-[var(--brand-600)]/60" />;
        }
    };

    const isOutOfStock = !inStock || stock.toLowerCase() === 'habis';

    const discountPercentage =
        originalPrice && originalPrice > price
            ? Math.round(((originalPrice - price) / originalPrice) * 100)
            : null;

    return (
        <div
            className={`group rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] transition-all duration-200 flex flex-col p-4 relative ${
                isOutOfStock
                    ? 'opacity-85'
                    : 'hover:border-[var(--brand-500)] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)]'
            }`}
        >
            {/* Top Bar: Badges & Wishlist Trigger */}
            <div className="flex items-center justify-between gap-2 mb-3 min-h-[26px]">
                <div className="flex flex-wrap items-center gap-1.5">
                    {/* Stock Status Badge */}
                    <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                            isOutOfStock
                                ? 'bg-[var(--danger-bg)] text-[var(--danger)]'
                                : stock === 'Stok Terbatas'
                                ? 'bg-[var(--warning-bg)] text-[var(--warning)]'
                                : 'bg-[var(--success-bg)] text-[var(--success)]'
                        }`}
                    >
                        {isOutOfStock ? 'Stok Habis' : stock}
                    </span>

                    {/* Promo/Feature Badge */}
                    {badge && !isOutOfStock && (
                        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-[var(--radius-sm)] bg-[var(--brand-50)] text-[var(--brand-700)] border border-[var(--brand-100)]">
                            {badge}
                        </span>
                    )}
                </div>

                {/* Top Right Action Buttons: Quick View & Wishlist */}
                <div className="flex items-center gap-1">
                    {onQuickView && (
                        <button
                            type="button"
                            onClick={() => onQuickView(product)}
                            className="p-1.5 rounded-full text-[var(--text-muted)] hover:text-[var(--brand-600)] hover:bg-[var(--surface-muted)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)]"
                            aria-label={`Lihat preview cepat ${name}`}
                            title="Quick View"
                        >
                            <EyeIcon className="w-4 h-4" />
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={() => onToggleWishlist && onToggleWishlist(product)}
                        className={`p-1.5 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)] ${
                            isWishlisted
                                ? 'text-[var(--danger)] bg-[var(--danger-bg)]'
                                : 'text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--surface-muted)]'
                        }`}
                        aria-label={
                            isWishlisted
                                ? `Hapus ${name} dari wishlist`
                                : `Simpan ${name} ke wishlist`
                        }
                        aria-pressed={isWishlisted}
                        title={isWishlisted ? 'Hapus dari wishlist' : 'Simpan ke wishlist'}
                    >
                        <HeartIcon
                            className="w-4 h-4"
                            fill={isWishlisted ? 'currentColor' : 'none'}
                        />
                    </button>
                </div>
            </div>

            {/* Product Image / Visual Area (1:1 Ratio) */}
            <div
                onClick={() => {
                    if (onSelectProduct) onSelectProduct(product);
                    else if (onQuickView) onQuickView(product);
                }}
                className="w-full aspect-square rounded-[var(--radius-md)] bg-[var(--surface-muted)] border border-[var(--border)] flex items-center justify-center p-3 mb-3.5 overflow-hidden group-hover:scale-[1.01] transition-transform duration-200 cursor-pointer relative"
                title="Klik untuk melihat detail produk"
            >
                {image ? (
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-contain"
                        loading="lazy"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center gap-2">
                        {renderCategoryIcon()}
                        <span className="text-[10px] font-mono font-medium uppercase text-[var(--text-muted)] px-2 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)]">
                            {brand}
                        </span>
                    </div>
                )}
            </div>

            {/* Product Information */}
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    {/* Category & Brand info */}
                    <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-semibold mb-1">
                        <span>{categoryName || category}</span>
                        <span>{brand}</span>
                    </div>

                    {/* Product Name */}
                    <h3
                        onClick={() => {
                            if (onSelectProduct) onSelectProduct(product);
                            else if (onQuickView) onQuickView(product);
                        }}
                        className="text-sm font-semibold text-[var(--text-primary)] leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-[var(--brand-600)] transition-colors cursor-pointer"
                        title="Klik untuk melihat detail produk"
                    >
                        {name}
                    </h3>


                    {/* Specifications Chips / Summary */}
                    <div className="mt-2 space-y-1">
                        {/* Hardware specific badges: Socket or RAM Form Factor */}
                        <div className="flex flex-wrap gap-1 mb-1">
                            {cpuSocket && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-[var(--surface-muted)] text-[var(--text-secondary)] border border-[var(--border)]">
                                    Socket {cpuSocket}
                                </span>
                            )}
                            {ramFormFactor && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-[var(--surface-muted)] text-[var(--text-secondary)] border border-[var(--border)]">
                                    {ramFormFactor}
                                </span>
                            )}
                        </div>

                        {/* Specs bullet preview */}
                        {Array.isArray(specs) && specs.length > 0 && (
                            <p className="text-xs text-[var(--text-secondary)] line-clamp-2">
                                {specs.slice(0, 2).join(' • ')}
                            </p>
                        )}
                    </div>
                </div>

                {/* Price and CTA Section */}
                <div className="pt-3.5 mt-3.5 border-t border-[var(--border)] flex items-end justify-between gap-2">
                    <div className="min-w-0">
                        {/* Original price / discount badge */}
                        {originalPrice && (
                            <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)] line-through">
                                <span>{formatRupiah(originalPrice)}</span>
                                {discountPercentage && (
                                    <span className="text-[10px] font-bold text-[var(--danger)] bg-[var(--danger-bg)] px-1 py-0.2 rounded">
                                        -{discountPercentage}%
                                    </span>
                                )}
                            </div>
                        )}
                        <div className="text-base sm:text-lg font-bold text-[var(--brand-600)] leading-tight truncate">
                            {formatRupiah(price)}
                        </div>
                    </div>

                    {/* Add to Cart CTA */}
                    <button
                        type="button"
                        onClick={() => onAddToCart && onAddToCart(product)}
                        disabled={isOutOfStock}
                        className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-[var(--radius-md)] text-xs font-semibold transition-all shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)] ${
                            isOutOfStock
                                ? 'bg-[var(--surface-muted)] text-[var(--text-muted)] border border-[var(--border)] cursor-not-allowed'
                                : 'bg-[var(--brand-600)] hover:bg-[var(--brand-700)] text-white shadow-xs active:scale-95'
                        }`}
                        aria-label={
                            isOutOfStock
                                ? `Stok ${name} habis`
                                : `Tambah ${name} ke keranjang`
                        }
                    >
                        <CartIcon className="w-3.5 h-3.5" />
                        <span>{isOutOfStock ? 'Habis' : '+ Keranjang'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
