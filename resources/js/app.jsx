import '../css/app.css';
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import Layout from './components/Layout';
import ProductCatalog from './components/ProductCatalog';
import {
    CpuIcon,
    MonitorIcon,
    HardDriveIcon,
    WrenchIcon,
    ShieldCheckIcon,
    ArrowRightIcon,
} from './components/Icons';

const categoryCards = [
    { id: 'processor', name: 'Processor', count: '6 Pilihan', icon: CpuIcon },
    { id: 'vga', name: 'VGA Card', count: '4 Pilihan', icon: MonitorIcon },
    { id: 'motherboard', name: 'Motherboard', count: '3 Pilihan', icon: HardDriveIcon },
    { id: 'builder', name: 'Rakit PC', count: 'Simulasi Online', icon: WrenchIcon, highlight: true },
];

function App() {
    const [activeView, setActiveView] = useState(
        () => document.getElementById('root')?.dataset.initialView || 'beranda'
    );

    return (
        <Layout>
            {({ onAddToCart, onOpenCart, onToggleWishlist }) => (
                <div className="w-full flex flex-col">
                    {/* View Switcher Bar */}
                    <div className="bg-[var(--surface-muted)] border-b border-[var(--border)] py-2.5 px-4 sm:px-8">
                        <div className="max-w-[1280px] mx-auto flex items-center justify-between">
                            <div className="flex items-center gap-1.5 p-1 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] shadow-2xs">
                                <a
                                    href="/katalog"
                                    className={`px-3.5 py-1.5 rounded-[var(--radius-sm)] text-xs font-semibold transition-colors ${
                                        activeView === 'katalog'
                                            ? 'bg-[var(--brand-600)] text-white shadow-xs'
                                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                    }`}
                                >
                                    Katalog Produk (Filter & Grid)
                                </a>
                                <a
                                    href="/"
                                    className={`px-3.5 py-1.5 rounded-[var(--radius-sm)] text-xs font-semibold transition-colors ${
                                        activeView === 'beranda'
                                            ? 'bg-[var(--brand-600)] text-white shadow-xs'
                                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                    }`}
                                >
                                    Beranda Showcase
                                </a>
                            </div>

                        </div>
                    </div>

                    {/* Active View Display */}
                    {activeView === 'katalog' ? (
                        <ProductCatalog
                            onAddToCart={onAddToCart}
                            onToggleWishlist={onToggleWishlist}
                        />
                    ) : activeView === 'pc-builder' ? (
                        <section className="max-w-[1280px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                            <div className="max-w-2xl mx-auto text-center rounded-[var(--radius-xl)] bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-card)] p-8 sm:p-12">
                                <WrenchIcon className="w-12 h-12 mx-auto text-[var(--brand-600)]" />
                                <h1 className="mt-5 text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
                                    PC Builder sedang disiapkan
                                </h1>
                                <p className="mt-3 text-sm sm:text-base text-[var(--text-secondary)]">
                                    Simulasi rakit PC belum tersedia. Sementara itu, Anda dapat melihat komponen yang ada di katalog.
                                </p>
                                <a
                                    href="/katalog"
                                    className="inline-flex items-center justify-center mt-6 px-5 py-3 rounded-[var(--radius-md)] bg-[var(--brand-600)] text-white text-sm font-semibold hover:bg-[var(--brand-700)] transition-colors"
                                >
                                    Buka katalog
                                </a>
                            </div>
                        </section>
                    ) : (
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
                                            Temukan beragam komponen komputer resmi dari distributor ternama dengan garansi penuh dan layanan konsultasi perakitan PC gratis.
                                        </p>

                                        <div className="flex flex-wrap items-center gap-3 pt-2">
                                            <button
                                                type="button"
                                                onClick={() => setActiveView('katalog')}
                                                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[var(--radius-md)] bg-[var(--brand-600)] text-white font-semibold text-sm hover:bg-[var(--brand-500)] transition-colors shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                                            >
                                                <span>Buka Katalog Hardware</span>
                                                <ArrowRightIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={onOpenCart}
                                                className="inline-flex items-center justify-center px-6 py-3 rounded-[var(--radius-md)] bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-colors border border-white/20"
                                            >
                                                Cek Keranjang Belanja
                                            </button>
                                        </div>
                                    </div>

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
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => setActiveView('katalog')}
                                                className={`group p-4 sm:p-5 rounded-[var(--radius-lg)] border transition-all duration-200 flex flex-col justify-between text-left ${
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
                                            </button>
                                        );
                                    })}
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
                                            onClick={() => setActiveView('katalog')}
                                            className="px-5 py-2.5 rounded-[var(--radius-md)] bg-[var(--brand-600)] text-white text-sm font-semibold hover:bg-[var(--brand-700)] transition-colors shadow-sm"
                                        >
                                            Buka Katalog Komponen →
                                        </button>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}
                </div>
            )}
        </Layout>
    );
}

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}