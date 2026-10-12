import '../css/app.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import Layout from './components/Layout';
import {
    CpuIcon,
    MonitorIcon,
    HardDriveIcon,
    WrenchIcon,
    ShieldCheckIcon,
    HeartIcon,
    CartIcon,
    ArrowRightIcon,
} from './components/Icons';

const sampleProducts = [
    {
        id: 'prod-1',
        name: 'Intel Core i5-14600K 14-Core Up to 5.3GHz LGA1700',
        category: 'Processor',
        brand: 'Intel',
        price: 5250000,
        stock: 'Tersedia',
        specs: '14 Cores (6P + 8E), 20 Threads, 24MB Cache',
    },
    {
        id: 'prod-2',
        name: 'AMD Ryzen 7 7800X3D 8-Core Up to 5.0GHz AM5',
        category: 'Processor',
        brand: 'AMD',
        price: 7350000,
        stock: 'Tersedia',
        specs: '8 Cores, 16 Threads, 3D V-Cache 96MB, 120W TDP',
    },
    {
        id: 'prod-3',
        name: 'ASUS Dual GeForce RTX 4070 SUPER OC Edition 12GB GDDR6X',
        category: 'VGA Card',
        brand: 'ASUS',
        price: 11200000,
        stock: 'Tersedia',
        specs: '12GB GDDR6X, DLSS 3, Axial-tech Fan Design',
    },
    {
        id: 'prod-4',
        name: 'MSI MAG B650 TOMAHAWK WIFI AM5 ATX Motherboard',
        category: 'Motherboard',
        brand: 'MSI',
        price: 3650000,
        stock: 'Tersedia',
        specs: 'DDR5, PCIe 4.0, Wi-Fi 6E, 2.5G LAN, 3x M.2',
    },
    {
        id: 'prod-5',
        name: 'Corsair Vengeance RGB 32GB (2x16GB) DDR5 6000MHz CL30',
        category: 'RAM',
        brand: 'Corsair',
        price: 2150000,
        stock: 'Tersedia',
        specs: 'Intel XMP 3.0 & AMD EXPO Supported, Ten-Zone RGB',
    },
    {
        id: 'prod-6',
        name: 'Samsung 990 PRO NVMe M.2 SSD 2TB PCIe 4.0',
        category: 'Storage SSD',
        brand: 'Samsung',
        price: 3100000,
        stock: 'Tersedia',
        specs: 'Up to 7,450 MB/s Read, 6,900 MB/s Write',
    },
];

const categoryCards = [
    { name: 'Processor', count: '45+ Produk', icon: CpuIcon, href: '#processor' },
    { name: 'VGA Card', count: '60+ Produk', icon: MonitorIcon, href: '#vga' },
    { name: 'Motherboard', count: '52+ Produk', icon: HardDriveIcon, href: '#motherboard' },
    { name: 'Rakit PC', count: 'Simulasi Online', icon: WrenchIcon, href: '#pc-builder', highlight: true },
];

function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(amount);
}

function HomePage() {
    return (
        <Layout>
            {({ onAddToCart, onOpenCart, onToggleWishlist }) => (
                <div className="space-y-12 pb-16">
                    {/* Hero Section */}
                    <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
                        <div className="relative overflow-hidden rounded-[var(--radius-xl)] bg-gradient-to-br from-[var(--brand-950)] via-[var(--brand-900)] to-[var(--brand-800)] text-white p-8 sm:p-12 lg:p-16 shadow-[var(--shadow-elevated)] border border-[var(--brand-800)]">
                            <div className="relative z-10 max-w-2xl space-y-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand-700)]/40 border border-[var(--brand-500)]/30 text-xs font-semibold text-[var(--brand-100)] backdrop-blur-xs">
                                    <ShieldCheckIcon className="w-4 h-4 text-emerald-400" />
                                    <span>Pusat Hardware PC Resmi & Tepercaya #1</span>
                                </div>

                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15]">
                                    Bangun PC Impian Anda dengan{' '}
                                    <span className="text-[var(--brand-500)] underline decoration-[var(--brand-500)]/30">
                                        Komponen Terbaik
                                    </span>
                                </h1>

                                <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                                    Pilih komponen favorit atau gunakan fitur simulasi PC Builder kami untuk memeriksa kompatibilitas processor, motherboard, dan kartu grafis secara otomatis.
                                </p>

                                <div className="flex flex-wrap items-center gap-3 pt-2">
                                    <a
                                        href="#pc-builder"
                                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[var(--radius-md)] bg-[var(--brand-600)] text-white font-semibold text-sm hover:bg-[var(--brand-500)] transition-colors shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                                    >
                                        <WrenchIcon className="w-4 h-4" />
                                        <span>Mulai Simulasi PC Builder</span>
                                    </a>
                                    <a
                                        href="#katalog"
                                        className="inline-flex items-center justify-center px-6 py-3 rounded-[var(--radius-md)] bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-colors border border-white/20"
                                    >
                                        Jelajahi Katalog Hardware
                                    </a>
                                </div>
                            </div>

                            {/* Background Pattern */}
                            <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-10 pointer-events-none hidden md:flex items-center justify-center">
                                <CpuIcon className="w-96 h-96 text-white" />
                            </div>
                        </div>
                    </section>

                    {/* Quick Category Cards */}
                    <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {categoryCards.map((cat, idx) => {
                                const IconComponent = cat.icon;
                                return (
                                    <a
                                        key={idx}
                                        href={cat.href}
                                        className={`group p-4 sm:p-5 rounded-[var(--radius-lg)] border transition-all duration-200 flex flex-col justify-between ${
                                            cat.highlight
                                                ? 'bg-[var(--brand-50)] dark:bg-[var(--surface-muted)] border-[var(--brand-500)] shadow-xs'
                                                : 'bg-[var(--surface)] border-[var(--border)] hover:border-[var(--brand-500)] shadow-[var(--shadow-card)]'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div
                                                className={`p-2.5 rounded-[var(--radius-md)] ${
                                                    cat.highlight
                                                        ? 'bg-[var(--brand-600)] text-white'
                                                        : 'bg-[var(--surface-muted)] text-[var(--brand-600)]'
                                                }`}
                                            >
                                                <IconComponent className="w-5 h-5" />
                                            </div>
                                            <ArrowRightIcon className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--brand-600)] group-hover:translate-x-1 transition-all" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm sm:text-base font-semibold text-[var(--text-primary)]">
                                                {cat.name}
                                            </h3>
                                            <span className="text-xs text-[var(--text-muted)]">{cat.count}</span>
                                        </div>
                                    </a>
                                );
                            })}
                        </div>
                    </section>

                    {/* Featured Hardware Products */}
                    <section id="katalog" className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-3 border-b border-[var(--border)] gap-2">
                            <div>
                                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-600)]">
                                    Katalog Unggulan
                                </span>
                                <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
                                    Hardware & Komponen Terbaru
                                </h2>
                            </div>
                            <span className="text-xs text-[var(--text-secondary)]">
                                Menampilkan 6 komponen pilihan dengan stok aktif
                            </span>
                        </div>

                        {/* Product Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {sampleProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="group rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--brand-500)] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-all duration-200 flex flex-col p-4 relative"
                                >
                                    {/* Badges & Wishlist Trigger */}
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-[var(--radius-sm)] bg-[var(--surface-muted)] text-[var(--text-secondary)] border border-[var(--border)]">
                                                {product.category}
                                            </span>
                                            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[var(--success-bg)] text-[var(--success)]">
                                                {product.stock}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={onToggleWishlist}
                                            className="p-1.5 rounded-full text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--surface-muted)] transition-colors"
                                            aria-label={`Tambah ${product.name} ke wishlist`}
                                        >
                                            <HeartIcon className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Product Visual Area */}
                                    <div className="w-full aspect-square rounded-[var(--radius-md)] bg-[var(--surface-muted)] flex items-center justify-center mb-4 group-hover:scale-[1.02] transition-transform duration-200">
                                        <CpuIcon className="w-16 h-16 text-[var(--brand-600)]/40" />
                                    </div>

                                    {/* Product Meta */}
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <span className="text-xs font-semibold text-[var(--text-muted)]">
                                                {product.brand}
                                            </span>
                                            <h3 className="text-sm font-semibold text-[var(--text-primary)] leading-snug line-clamp-2 mt-0.5">
                                                {product.name}
                                            </h3>
                                            <p className="text-xs text-[var(--text-secondary)] mt-1.5 line-clamp-2">
                                                {product.specs}
                                            </p>
                                        </div>

                                        <div className="pt-4 mt-4 border-t border-[var(--border)] flex items-center justify-between gap-3">
                                            <div>
                                                <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">
                                                    Harga Resmi
                                                </span>
                                                <span className="text-base font-bold text-[var(--brand-600)]">
                                                    {formatRupiah(product.price)}
                                                </span>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => onAddToCart(product)}
                                                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-[var(--radius-md)] bg-[var(--brand-600)] hover:bg-[var(--brand-700)] text-white text-xs font-medium transition-colors shadow-xs"
                                            >
                                                <CartIcon className="w-4 h-4" />
                                                <span>+ Keranjang</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* PC Builder Callout Banner */}
                    <section id="pc-builder" className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="rounded-[var(--radius-xl)] bg-[var(--surface)] border border-[var(--border)] p-8 sm:p-10 shadow-[var(--shadow-card)] flex flex-col lg:flex-row items-center justify-between gap-6">
                            <div className="space-y-2 max-w-xl text-center lg:text-left">
                                <span className="inline-block px-3 py-0.5 rounded-full text-xs font-semibold bg-[var(--brand-50)] text-[var(--brand-700)] border border-[var(--brand-100)]">
                                    Fitur Interaktif
                                </span>
                                <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                                    Simulasi Rakit PC Tanpa Ragu Kompatibilitas
                                </h2>
                                <p className="text-sm text-[var(--text-secondary)]">
                                    Pilih CPU, Motherboard, GPU, dan PSU yang sesuai. Sistem kalkulator kami akan memeriksa kebutuhan socket, form-factor, dan kapasitas daya watt secara cerdas.
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={onOpenCart}
                                    className="px-5 py-2.5 rounded-[var(--radius-md)] bg-[var(--surface-muted)] text-[var(--text-primary)] text-sm font-medium hover:bg-[var(--border)] transition-colors"
                                >
                                    Cek Keranjang Belanja
                                </button>
                                <a
                                    href="#simulasi"
                                    className="px-5 py-2.5 rounded-[var(--radius-md)] bg-[var(--brand-600)] text-white text-sm font-semibold hover:bg-[var(--brand-700)] transition-colors shadow-sm"
                                >
                                    Mulai Rakit Sekarang →
                                </a>
                            </div>
                        </div>
                    </section>
                </div>
            )}
        </Layout>
    );
}

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<HomePage />);
}