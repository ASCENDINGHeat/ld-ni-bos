import React, { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import {
    SearchIcon,
    HeartIcon,
    CartIcon,
    MenuIcon,
    XIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    CpuIcon,
    WrenchIcon,
    UserIcon,
    ShieldCheckIcon,
} from './Icons';

export default function Navbar({
    cartCount = 0,
    wishlistCount = 0,
    onOpenCart,
    onOpenWishlist,
    onSearchSubmit,
    categories = [
        { id: 'builder', name: 'Rakit PC', href: '/pc-builder', isHighlight: true },
        { id: 'processor', name: 'Processor', href: '#processor' },
        { id: 'vga', name: 'VGA Card', href: '#vga' },
        { id: 'motherboard', name: 'Motherboard', href: '#motherboard' },
        { id: 'ram', name: 'RAM', href: '#ram' },
        { id: 'storage', name: 'Storage SSD', href: '#storage' },
        { id: 'psu', name: 'Power Supply', href: '#psu' },
        { id: 'casing', name: 'Casing & Cooler', href: '#casing' },
    ],
}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        if (onSearchSubmit) {
            onSearchSubmit(searchQuery);
        }
    };

    return (
        <header className="sticky top-0 z-40 w-full bg-[var(--surface)] border-b border-[var(--border)] shadow-xs transition-colors">
            {/* Top Announcement Bar */}
            <div className="bg-[var(--brand-950)] text-white text-xs py-1.5 px-4 hidden sm:block">
                <div className="max-w-[1280px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="font-medium">
                            Promo Rakit PC Hemat: Bebas Biaya Perakitan & Cable Management Rapi!
                        </span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-300">
                        <span className="flex items-center gap-1">
                            <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-400" />
                            100% Produk Bergaransi Resmi
                        </span>
                        <a
                            href="/pc-builder"
                            className="text-amber-300 hover:text-white font-medium transition-colors"
                        >
                            Simulasi PC Builder →
                        </a>
                    </div>
                </div>
            </div>

            {/* Main Header Bar */}
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
                    {/* Left: Mobile Menu Trigger + Brand Logo */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Hamburger Button (Mobile) */}
                        <button
                            type="button"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-muted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)]"
                            aria-label={isMobileMenuOpen ? 'Tutup menu' : 'Buka menu navigasi'}
                            aria-expanded={isMobileMenuOpen}
                        >
                            {isMobileMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                        </button>

                        {/* Logo / Wordmark */}
                        <a href="/" className="flex items-center gap-2.5 group">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-[var(--radius-md)] bg-[var(--brand-600)] flex items-center justify-center text-white shadow-sm group-hover:bg-[var(--brand-700)] transition-colors">
                                <CpuIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-lg sm:text-xl tracking-tight text-[var(--text-primary)] leading-tight">
                                    PC<span className="text-[var(--brand-600)]">STORE</span>
                                </span>
                                <span className="text-[10px] text-[var(--text-muted)] tracking-wider uppercase font-semibold hidden sm:inline">
                                    Hardware & Custom Build
                                </span>
                            </div>
                        </a>
                    </div>

                    {/* Center: Search Bar (Desktop) */}
                    <div className="hidden lg:flex flex-1 max-w-xl mx-4">
                        <form onSubmit={handleSearch} className="w-full relative">
                            <div className="relative flex items-center w-full">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari processor, VGA card, motherboard, RAM..."
                                    className="w-full h-11 pl-11 pr-24 rounded-[var(--radius-md)] bg-[var(--surface-muted)] border border-[var(--border)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:bg-[var(--surface)] focus:border-[var(--brand-500)] focus:ring-2 focus:ring-[var(--brand-500)]/20 focus:outline-none transition-all"
                                    aria-label="Cari produk komponen PC"
                                />
                                <div className="absolute left-3.5 text-[var(--text-muted)] pointer-events-none">
                                    <SearchIcon className="w-5 h-5" />
                                </div>
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-20 text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1"
                                        aria-label="Hapus kata kunci"
                                    >
                                        <XIcon className="w-4 h-4" />
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    className="absolute right-1.5 h-8 px-4 rounded-[var(--radius-sm)] bg-[var(--brand-600)] text-white text-xs font-semibold hover:bg-[var(--brand-700)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)]"
                                >
                                    Cari
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right: Actions (Theme, Wishlist, Cart, Account) */}
                    <div className="flex items-center gap-1 sm:gap-2">
                        {/* Theme Toggle */}
                        <ThemeToggle />

                        {/* Wishlist Button */}
                        <button
                            type="button"
                            onClick={onOpenWishlist}
                            className="relative inline-flex items-center justify-center w-10 h-10 rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-muted)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)]"
                            aria-label={`Wishlist (${wishlistCount} barang favorit)`}
                            title="Favorit / Wishlist"
                        >
                            <HeartIcon className="w-5 h-5" />
                            {wishlistCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--danger)] text-white text-[10px] font-bold flex items-center justify-center leading-none shadow-xs">
                                    {wishlistCount}
                                </span>
                            )}
                        </button>

                        {/* Cart Drawer Trigger */}
                        <button
                            type="button"
                            onClick={onOpenCart}
                            className="relative inline-flex items-center justify-center h-10 px-3 rounded-[var(--radius-md)] bg-[var(--brand-50)] text-[var(--brand-700)] border border-[var(--brand-100)] hover:bg-[var(--brand-100)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)]"
                            aria-label={`Buka keranjang belanja, ${cartCount} barang`}
                            title="Buka Keranjang"
                        >
                            <div className="relative">
                                <CartIcon className="w-5 h-5" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--brand-600)] text-white text-[10px] font-bold flex items-center justify-center leading-none shadow-xs">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                            <span className="hidden md:inline-block ml-2 text-xs font-semibold">
                                Keranjang
                            </span>
                        </button>

                        {/* User / Account Button */}
                        <a
                            href="#akun"
                            className="hidden sm:inline-flex items-center justify-center w-10 h-10 rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-muted)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)]"
                            aria-label="Akun Pengguna"
                            title="Akun Saya"
                        >
                            <UserIcon className="w-5 h-5" />
                        </a>
                    </div>
                </div>

                {/* Mobile Search Bar (Row 2 on Small Screens) */}
                <div className="lg:hidden pb-3">
                    <form onSubmit={handleSearch} className="relative flex items-center">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari processor, VGA, casing..."
                            className="w-full h-10 pl-10 pr-20 rounded-[var(--radius-md)] bg-[var(--surface-muted)] border border-[var(--border)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:bg-[var(--surface)] focus:border-[var(--brand-500)] focus:ring-2 focus:ring-[var(--brand-500)]/20 focus:outline-none transition-all"
                            aria-label="Cari komponen di ponsel"
                        />
                        <div className="absolute left-3 text-[var(--text-muted)] pointer-events-none">
                            <SearchIcon className="w-4 h-4" />
                        </div>
                        <button
                            type="submit"
                            className="absolute right-1.5 h-7 px-3 rounded-[var(--radius-sm)] bg-[var(--brand-600)] text-white text-xs font-semibold hover:bg-[var(--brand-700)] transition-colors"
                        >
                            Cari
                        </button>
                    </form>
                </div>
            </div>

            {/* Desktop Category Navigation Bar */}
            <div className="hidden lg:block border-t border-[var(--border)] bg-[var(--surface)]">
                <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-11 text-sm">
                        {/* Categories Dropdown & Quick Links */}
                        <div className="flex items-center gap-1 xl:gap-2">
                            {/* All Categories Trigger */}
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-sm)] text-[var(--text-primary)] font-medium hover:bg-[var(--surface-muted)] transition-colors"
                                    aria-expanded={isCategoryDropdownOpen}
                                >
                                    <MenuIcon className="w-4 h-4 text-[var(--brand-600)]" />
                                    <span>Kategori Hardware</span>
                                    <ChevronDownIcon
                                        className={`w-3.5 h-3.5 transition-transform ${
                                            isCategoryDropdownOpen ? 'rotate-180' : ''
                                        }`}
                                    />
                                </button>

                                {/* Dropdown Menu */}
                                {isCategoryDropdownOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-30"
                                            onClick={() => setIsCategoryDropdownOpen(false)}
                                        />
                                        <div className="absolute left-0 mt-2 w-64 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-elevated)] py-2 z-40">
                                            {categories.map((cat) => (
                                                <a
                                                    key={cat.id}
                                                    href={cat.href}
                                                    onClick={() => setIsCategoryDropdownOpen(false)}
                                                    className="flex items-center justify-between px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--surface-muted)] hover:text-[var(--brand-600)] transition-colors"
                                                >
                                                    <span className={cat.isHighlight ? 'font-semibold text-[var(--brand-600)]' : ''}>
                                                        {cat.name}
                                                    </span>
                                                    <ChevronRightIcon className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                                                </a>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>

                            <span className="w-px h-4 bg-[var(--border)] mx-1" />

                            {/* Direct Category Links */}
                            {categories
                                .filter((c) => !c.isHighlight)
                                .slice(0, 6)
                                .map((cat) => (
                                    <a
                                        key={cat.id}
                                        href={cat.href}
                                        className="px-3 py-1.5 rounded-[var(--radius-sm)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-muted)] font-medium text-xs xl:text-sm transition-colors whitespace-nowrap"
                                    >
                                        {cat.name}
                                    </a>
                                ))}
                        </div>

                        {/* Right Highlight: PC Builder CTA */}
                        <div className="flex items-center gap-3">
                            <a
                                href="/pc-builder"
                                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[var(--radius-pill)] bg-[var(--brand-600)] text-white font-medium text-xs hover:bg-[var(--brand-700)] shadow-xs transition-colors"
                            >
                                <WrenchIcon className="w-3.5 h-3.5" />
                                <span>Simulasi PC Builder</span>
                                <span className="bg-amber-400 text-slate-950 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                                    NEW
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Horizontal Scrollable Categories */}
            <div className="lg:hidden border-t border-[var(--border)] bg-[var(--surface-muted)] py-2 px-4 overflow-x-auto scrollbar-none flex items-center gap-2 text-xs">
                {categories.map((cat) => (
                    <a
                        key={cat.id}
                        href={cat.href}
                        className={`shrink-0 px-3 py-1.5 rounded-[var(--radius-pill)] font-medium transition-colors ${
                            cat.isHighlight
                                ? 'bg-[var(--brand-600)] text-white shadow-xs'
                                : 'bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] hover:border-[var(--brand-500)]'
                        }`}
                    >
                        {cat.name}
                    </a>
                ))}
            </div>

            {/* Mobile Slide-in Drawer Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-50 flex" role="dialog" aria-modal="true">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />

                    {/* Drawer Content */}
                    <div className="relative w-4/5 max-w-xs bg-[var(--surface)] text-[var(--text-primary)] h-full shadow-2xl flex flex-col z-10">
                        {/* Header */}
                        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-[var(--radius-md)] bg-[var(--brand-600)] text-white flex items-center justify-center">
                                    <CpuIcon className="w-4 h-4" />
                                </div>
                                <span className="font-bold text-base">PC Store</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-1.5 rounded-[var(--radius-sm)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-muted)]"
                                aria-label="Tutup navigasi"
                            >
                                <XIcon className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Navigation Links */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {/* PC Builder Callout */}
                            <a
                                href="#pc-builder"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center justify-between p-3 rounded-[var(--radius-md)] bg-[var(--brand-50)] text-[var(--brand-700)] border border-[var(--brand-100)] font-medium text-sm"
                            >
                                <div className="flex items-center gap-2.5">
                                    <WrenchIcon className="w-5 h-5 text-[var(--brand-600)]" />
                                    <span>Rakit PC Sendiri (Builder)</span>
                                </div>
                                <ChevronRightIcon className="w-4 h-4" />
                            </a>

                            {/* Categories list */}
                            <div>
                                <h5 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                                    Kategori Komponen
                                </h5>
                                <div className="space-y-1">
                                    {categories
                                        .filter((c) => !c.isHighlight)
                                        .map((cat) => (
                                            <a
                                                key={cat.id}
                                                href={cat.href}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="flex items-center justify-between py-2 px-3 rounded-[var(--radius-sm)] text-sm text-[var(--text-primary)] hover:bg-[var(--surface-muted)] transition-colors"
                                            >
                                                <span>{cat.name}</span>
                                                <ChevronRightIcon className="w-4 h-4 text-[var(--text-muted)]" />
                                            </a>
                                        ))}
                                </div>
                            </div>

                            {/* Account & Service */}
                            <div className="pt-4 border-t border-[var(--border)]">
                                <h5 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                                    Layanan & Akun
                                </h5>
                                <div className="space-y-1">
                                    <a
                                        href="#akun"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-2.5 py-2 px-3 rounded-[var(--radius-sm)] text-sm text-[var(--text-primary)] hover:bg-[var(--surface-muted)]"
                                    >
                                        <UserIcon className="w-4 h-4 text-[var(--text-muted)]" />
                                        <span>Masuk / Akun Saya</span>
                                    </a>
                                    <a
                                        href="#bantuan"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-2.5 py-2 px-3 rounded-[var(--radius-sm)] text-sm text-[var(--text-primary)] hover:bg-[var(--surface-muted)]"
                                    >
                                        <ShieldCheckIcon className="w-4 h-4 text-[var(--text-muted)]" />
                                        <span>Cek Garansi & Servis</span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Footer in Drawer */}
                        <div className="p-4 border-t border-[var(--border)] bg-[var(--surface-muted)] text-xs text-[var(--text-secondary)]">
                            <p>CS WhatsApp: 0812-3456-7890</p>
                            <p className="text-[11px] text-[var(--text-muted)] mt-1">
                                Buka: Sen - Sab 09.00 - 18.00 WIB
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
