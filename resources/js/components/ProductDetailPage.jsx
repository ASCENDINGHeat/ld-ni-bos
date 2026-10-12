import React, { useState } from 'react';
import {
    HeartIcon,
    CartIcon,
    WrenchIcon,
    CpuIcon,
    MonitorIcon,
    HardDriveIcon,
    ShieldCheckIcon,
    PlusIcon,
    MinusIcon,
    ChevronRightIcon,
    ArrowLeftIcon,
    CheckCircleIcon,
    PhoneIcon,
    MapPinIcon,
} from './Icons';

export default function ProductDetailPage({
    product,
    onBackToCatalog,
    onAddToCart,
    onToggleWishlist,
    isWishlisted = false,
    onOpenPCBuilder,
    relatedProducts = [],
    onSelectProduct,
}) {
    const [quantity, setQuantity] = useState(1);
    const [selectedGalleryIdx, setSelectedGalleryIdx] = useState(0);
    const [activeTab, setActiveTab] = useState('specs'); // 'specs' | 'desc' | 'warranty'

    if (!product) return null;

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
        description,
        specs = [],
        technicalSpecs = {},
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
                return <CpuIcon className="w-24 h-24 text-[var(--brand-600)]/60" />;
            case 'vga':
                return <MonitorIcon className="w-24 h-24 text-[var(--brand-600)]/60" />;
            case 'motherboard':
            case 'storage':
            case 'ram':
            case 'psu':
            default:
                return <HardDriveIcon className="w-24 h-24 text-[var(--brand-600)]/60" />;
        }
    };

    const handleAddToCartClick = () => {
        if (onAddToCart && !isOutOfStock) {
            onAddToCart({ ...product, quantity });
        }
    };

    const handlePCBuilderClick = () => {
        if (onOpenPCBuilder) {
            onOpenPCBuilder(product);
        }
    };

    return (
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full space-y-8">
            {/* Top Navigation & Breadcrumbs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
                <nav className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] flex-wrap">
                    <button
                        type="button"
                        onClick={onBackToCatalog}
                        className="hover:text-[var(--text-primary)] transition-colors flex items-center gap-1 font-medium"
                    >
                        <span>Beranda</span>
                    </button>
                    <ChevronRightIcon className="w-3 h-3 text-[var(--border-strong)]" />
                    <button
                        type="button"
                        onClick={onBackToCatalog}
                        className="hover:text-[var(--text-primary)] transition-colors"
                    >
                        Katalog Hardware
                    </button>
                    <ChevronRightIcon className="w-3 h-3 text-[var(--border-strong)]" />
                    <span className="text-[var(--text-muted)] font-medium">
                        {categoryName || category}
                    </span>
                    <ChevronRightIcon className="w-3 h-3 text-[var(--border-strong)]" />
                    <span className="text-[var(--text-primary)] font-semibold truncate max-w-[200px] sm:max-w-xs">
                        {name}
                    </span>
                </nav>

                <button
                    type="button"
                    onClick={onBackToCatalog}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--brand-600)] hover:text-[var(--brand-800)] transition-colors self-start sm:self-auto"
                >
                    <ArrowLeftIcon className="w-3.5 h-3.5" />
                    <span>Kembali ke Katalog Produk</span>
                </button>
            </div>

            {/* Main Product Section: 2 Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                {/* Left Column: Visual Gallery (5 cols) */}
                <div className="lg:col-span-5 space-y-4 sticky top-24">
                    {/* Main Featured Image (1:1 Ratio) */}
                    <div className="w-full aspect-square rounded-[var(--radius-xl)] bg-[var(--surface-muted)] border border-[var(--border)] shadow-[var(--shadow-card)] flex items-center justify-center p-8 relative overflow-hidden group">
                        {/* Status Badges */}
                        <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2 z-10">
                            <span
                                className={`text-xs font-medium px-3 py-1 rounded-full shadow-xs ${
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
                                <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-[var(--radius-sm)] bg-[var(--brand-50)] text-[var(--brand-700)] border border-[var(--brand-100)] shadow-xs">
                                    {badge}
                                </span>
                            )}
                        </div>

                        {image ? (
                            <img
                                src={image}
                                alt={name}
                                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-3 text-center">
                                {renderCategoryIcon()}
                                <div className="space-y-0.5">
                                    <span className="text-xs font-mono font-semibold uppercase px-2.5 py-1 rounded bg-[var(--surface)] border border-[var(--border)] text-[var(--text-secondary)]">
                                        {brand} OFFICIAL
                                    </span>
                                    <p className="text-xs text-[var(--text-muted)] pt-1">
                                        {gallery[selectedGalleryIdx]?.label || 'Tampak Depan Kemasan Resmi'}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Thumbnail gallery selector */}
                    {gallery && gallery.length > 0 && (
                        <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                            {gallery.map((item, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setSelectedGalleryIdx(idx)}
                                    className={`px-3 py-2 rounded-[var(--radius-md)] text-xs font-medium border text-left transition-all shrink-0 ${
                                        selectedGalleryIdx === idx
                                            ? 'border-[var(--brand-600)] bg-[var(--brand-50)] text-[var(--brand-700)] font-semibold shadow-xs'
                                            : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[var(--brand-500)]'
                                    }`}
                                >
                                    <span>Sudut {idx + 1}</span>
                                    <span className="text-[10px] text-[var(--text-muted)] block truncate max-w-[120px]">
                                        {item.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Trust Guarantees */}
                    <div className="p-4 rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] space-y-3 shadow-xs">
                        <div className="flex items-start gap-3 text-xs">
                            <ShieldCheckIcon className="w-5 h-5 text-[var(--brand-600)] shrink-0" />
                            <div>
                                <span className="font-bold text-[var(--text-primary)] block">
                                    100% Original & Garansi Distributor Resmi
                                </span>
                                <span className="text-[var(--text-secondary)]">
                                    Unit asli bersegel hologram dari importir resmi Indonesia.
                                </span>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 text-xs pt-2 border-t border-[var(--border)]">
                            <CheckCircleIcon className="w-5 h-5 text-emerald-500 shrink-0" />
                            <div>
                                <span className="font-bold text-[var(--text-primary)] block">
                                    Garansi Tukar Baru 7 Hari
                                </span>
                                <span className="text-[var(--text-secondary)]">
                                    Ganti unit baru bila terdapat cacat pabrik saat pertama diterima.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Information, Pricing, Specs & CTAs (7 cols) */}
                <div className="lg:col-span-7 space-y-6">
                    {/* Brand & Title */}
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--brand-50)] text-[var(--brand-700)] border border-[var(--brand-100)]">
                                {brand}
                            </span>
                            <span className="text-xs text-[var(--text-muted)] font-medium">
                                Kategori: {categoryName || category}
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] leading-tight tracking-tight">
                            {name}
                        </h1>
                    </div>

                    {/* Price Card */}
                    <div className="p-5 rounded-[var(--radius-xl)] bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-card)] space-y-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                            Harga Resmi Toko
                        </span>
                        <div className="flex items-baseline gap-3">
                            <span className="text-3xl sm:text-4xl font-extrabold text-[var(--brand-600)]">
                                {formatRupiah(price)}
                            </span>
                            {originalPrice && (
                                <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] line-through">
                                    <span>{formatRupiah(originalPrice)}</span>
                                    {discountPercentage && (
                                        <span className="text-xs font-bold text-[var(--danger)] bg-[var(--danger-bg)] px-2 py-0.5 rounded-full">
                                            Hemat {discountPercentage}%
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] pt-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>
                                {isOutOfStock
                                    ? 'Stok saat ini kosong'
                                    : 'Stok siap dikirim hari ini untuk pesanan sebelum 15:00 WIB'}
                            </span>
                        </div>
                    </div>

                    {/* Core Specifications Highlight Cards */}
                    <div className="space-y-2">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                            Highlight Spesifikasi Hardware
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                            {/* Socket */}
                            <div className="p-3 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] shadow-2xs">
                                <span className="text-[10px] text-[var(--text-muted)] font-semibold uppercase block">
                                    CPU Socket
                                </span>
                                <span className="text-sm font-bold text-[var(--text-primary)] block mt-0.5 truncate">
                                    {cpuSocket || '-'}
                                </span>
                            </div>

                            {/* TDP */}
                            <div className="p-3 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] shadow-2xs">
                                <span className="text-[10px] text-[var(--text-muted)] font-semibold uppercase block">
                                    TDP / Daya
                                </span>
                                <span className="text-sm font-bold text-[var(--text-primary)] block mt-0.5 truncate">
                                    {tdp || '-'}
                                </span>
                            </div>

                            {/* Chipset */}
                            <div className="p-3 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] shadow-2xs">
                                <span className="text-[10px] text-[var(--text-muted)] font-semibold uppercase block">
                                    Chipset
                                </span>
                                <span className="text-sm font-bold text-[var(--text-primary)] block mt-0.5 truncate">
                                    {chipset || '-'}
                                </span>
                            </div>

                            {/* Garansi */}
                            <div className="p-3 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] shadow-2xs">
                                <span className="text-[10px] text-[var(--text-muted)] font-semibold uppercase block">
                                    Garansi
                                </span>
                                <span className="text-sm font-bold text-[var(--text-primary)] block mt-0.5 truncate">
                                    {warranty || 'Garansi Resmi'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Short Description */}
                    {description && (
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                            {description}
                        </p>
                    )}

                    {/* Purchasing Controls & Primary CTAs */}
                    <div className="p-5 rounded-[var(--radius-xl)] bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-card)] space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            {/* Quantity Selector */}
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-semibold text-[var(--text-secondary)]">
                                    Kuantitas:
                                </span>
                                <div className="flex items-center border border-[var(--border)] rounded-[var(--radius-md)] bg-[var(--surface-muted)]">
                                    <button
                                        type="button"
                                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                        disabled={quantity <= 1 || isOutOfStock}
                                        className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                        aria-label="Kurangi kuantitas"
                                    >
                                        <MinusIcon className="w-4 h-4" />
                                    </button>
                                    <span className="px-4 text-sm font-bold text-[var(--text-primary)] min-w-[36px] text-center">
                                        {quantity}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setQuantity((q) => q + 1)}
                                        disabled={isOutOfStock}
                                        className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-30 transition-colors"
                                        aria-label="Tambah kuantitas"
                                    >
                                        <PlusIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Wishlist Button */}
                            <button
                                type="button"
                                onClick={() => onToggleWishlist && onToggleWishlist(product)}
                                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-md)] border text-xs font-semibold transition-colors ${
                                    isWishlisted
                                        ? 'border-[var(--danger)] text-[var(--danger)] bg-[var(--danger-bg)]'
                                        : 'border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--danger)] hover:bg-[var(--surface-muted)]'
                                }`}
                            >
                                <HeartIcon
                                    className="w-4 h-4"
                                    fill={isWishlisted ? 'currentColor' : 'none'}
                                />
                                <span>{isWishlisted ? 'Tersimpan di Wishlist' : 'Simpan ke Wishlist'}</span>
                            </button>
                        </div>

                        {/* Dual Action CTA Buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                            {/* Add to Cart CTA */}
                            <button
                                type="button"
                                onClick={handleAddToCartClick}
                                disabled={isOutOfStock}
                                className={`py-3 px-6 rounded-[var(--radius-md)] text-sm font-bold transition-all flex items-center justify-center gap-2.5 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)] ${
                                    isOutOfStock
                                        ? 'bg-[var(--surface-muted)] text-[var(--text-muted)] cursor-not-allowed border border-[var(--border)]'
                                        : 'bg-[var(--brand-600)] hover:bg-[var(--brand-700)] text-white active:scale-98'
                                }`}
                            >
                                <CartIcon className="w-5 h-5" />
                                <span>
                                    {isOutOfStock ? 'Stok Produk Habis' : `Tambah ke Keranjang (${quantity})`}
                                </span>
                            </button>

                            {/* PC Builder CTA */}
                            <button
                                type="button"
                                onClick={handlePCBuilderClick}
                                className="py-3 px-6 rounded-[var(--radius-md)] bg-[var(--brand-50)] text-[var(--brand-700)] border border-[var(--brand-100)] text-sm font-bold hover:bg-[var(--brand-100)] transition-colors flex items-center justify-center gap-2.5"
                            >
                                <WrenchIcon className="w-5 h-5 text-[var(--brand-600)]" />
                                <span>Simulasi di PC Builder</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* In-depth Tabs Section */}
            <div className="pt-6 border-t border-[var(--border)] space-y-6">
                {/* Tab Navigation Header */}
                <div className="flex items-center gap-2 border-b border-[var(--border)] overflow-x-auto">
                    <button
                        type="button"
                        onClick={() => setActiveTab('specs')}
                        className={`pb-3 px-4 text-sm font-bold transition-colors border-b-2 whitespace-nowrap focus:outline-none ${
                            activeTab === 'specs'
                                ? 'border-[var(--brand-600)] text-[var(--brand-600)]'
                                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                    >
                        Spesifikasi Lengkap
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('desc')}
                        className={`pb-3 px-4 text-sm font-bold transition-colors border-b-2 whitespace-nowrap focus:outline-none ${
                            activeTab === 'desc'
                                ? 'border-[var(--brand-600)] text-[var(--brand-600)]'
                                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                    >
                        Deskripsi & Fitur
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('warranty')}
                        className={`pb-3 px-4 text-sm font-bold transition-colors border-b-2 whitespace-nowrap focus:outline-none ${
                            activeTab === 'warranty'
                                ? 'border-[var(--brand-600)] text-[var(--brand-600)]'
                                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                    >
                        Garansi & Layanan Purnajual
                    </button>
                </div>

                {/* Tab 1: Spesifikasi Lengkap Table */}
                {activeTab === 'specs' && (
                    <div className="bg-[var(--surface)] rounded-[var(--radius-xl)] border border-[var(--border)] overflow-hidden shadow-[var(--shadow-card)]">
                        <div className="p-4 bg-[var(--surface-muted)] border-b border-[var(--border)] flex items-center justify-between">
                            <h3 className="text-sm font-bold text-[var(--text-primary)]">
                                Lembar Spesifikasi Teknis {brand}
                            </h3>
                            <span className="text-xs text-[var(--text-muted)] font-mono">
                                Verifikasi Resmi
                            </span>
                        </div>
                        <div className="divide-y divide-[var(--border)]">
                            {Object.entries(technicalSpecs).length > 0 ? (
                                Object.entries(technicalSpecs).map(([specKey, specVal], idx) => (
                                    <div
                                        key={specKey}
                                        className={`grid grid-cols-1 sm:grid-cols-3 p-3.5 text-xs ${
                                            idx % 2 === 0 ? 'bg-[var(--surface)]' : 'bg-[var(--surface-muted)]/50'
                                        }`}
                                    >
                                        <span className="font-semibold text-[var(--text-secondary)]">
                                            {specKey}
                                        </span>
                                        <span className="sm:col-span-2 font-medium text-[var(--text-primary)] mt-0.5 sm:mt-0">
                                            {specVal}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="p-6 text-center text-xs text-[var(--text-muted)]">
                                    Spesifikasi terperinci sedang diperbarui oleh distributor.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Tab 2: Deskripsi & Fitur */}
                {activeTab === 'desc' && (
                    <div className="bg-[var(--surface)] rounded-[var(--radius-xl)] border border-[var(--border)] p-6 space-y-4 shadow-[var(--shadow-card)]">
                        <h3 className="text-base font-bold text-[var(--text-primary)]">
                            Ringkasan Arsitektur & Performa
                        </h3>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                            {description || 'Informasi deskripsi produk hardware komputer resmi.'}
                        </p>
                        {specs && specs.length > 0 && (
                            <div className="pt-3 border-t border-[var(--border)] space-y-2">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                                    Keunggulan Utama:
                                </h4>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[var(--text-secondary)]">
                                    {specs.map((s, idx) => (
                                        <li key={idx} className="flex items-center gap-2">
                                            <CheckCircleIcon className="w-4 h-4 text-[var(--success)] shrink-0" />
                                            <span>{s}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {/* Tab 3: Garansi & Layanan */}
                {activeTab === 'warranty' && (
                    <div className="bg-[var(--surface)] rounded-[var(--radius-xl)] border border-[var(--border)] p-6 space-y-4 shadow-[var(--shadow-card)]">
                        <h3 className="text-base font-bold text-[var(--text-primary)]">
                            Informasi Garansi Resmi Distributor
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[var(--text-secondary)]">
                            <div className="p-4 rounded-[var(--radius-md)] bg-[var(--surface-muted)] border border-[var(--border)] space-y-1.5">
                                <span className="font-bold text-[var(--text-primary)] block">
                                    Masa Garansi: {warranty || '3 Tahun'}
                                </span>
                                <p>
                                    Meliputi kerusakan fungsi hardware akibat cacat perakitan pabrik. Serial number unit terdaftar resmi di distributor Indonesia.
                                </p>
                            </div>
                            <div className="p-4 rounded-[var(--radius-md)] bg-[var(--surface-muted)] border border-[var(--border)] space-y-1.5">
                                <span className="font-bold text-[var(--text-primary)] block">
                                    Pusat Klaim & Service Center
                                </span>
                                <p>
                                    Dapat diklaim langsung melalui toko PC Store atau dibawa ke service center distributor terdekat di kota Anda dengan membawa bukti pembelian.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Related Components Section */}
            {relatedProducts && relatedProducts.length > 0 && (
                <div className="pt-8 border-t border-[var(--border)] space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-[var(--brand-600)]">
                                Rekomendasi Rakitan
                            </span>
                            <h3 className="text-lg font-bold text-[var(--text-primary)]">
                                Komponen yang Sering Dirakit Bersama
                            </h3>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {relatedProducts.slice(0, 4).map((rel) => (
                            <button
                                key={rel.id}
                                type="button"
                                onClick={() => onSelectProduct && onSelectProduct(rel)}
                                className="group p-4 rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--brand-500)] text-left transition-all shadow-[var(--shadow-card)]"
                            >
                                <span className="text-[10px] font-semibold uppercase text-[var(--text-muted)]">
                                    {rel.categoryName || rel.category}
                                </span>
                                <h4 className="text-xs font-semibold text-[var(--text-primary)] line-clamp-2 mt-1 group-hover:text-[var(--brand-600)]">
                                    {rel.name}
                                </h4>
                                <span className="text-xs font-bold text-[var(--brand-600)] block mt-2">
                                    {formatRupiah(rel.price)}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
