@props([
    'cartCount' => 0,
    'wishlistCount' => 0,
])

<header class="sticky top-0 z-40 w-full bg-[var(--surface)] border-b border-[var(--border)] shadow-xs transition-colors">
    <!-- Announcement Bar -->
    <div class="bg-[var(--brand-950)] text-white text-xs py-1.5 px-4 hidden sm:block">
        <div class="max-w-[1280px] mx-auto flex items-center justify-between">
            <div class="flex items-center gap-2">
                <span class="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span class="font-medium">Garansi Resmi Distributor & Pengiriman Asuransi Penuh ke Seluruh Indonesia</span>
            </div>
            <div class="flex items-center gap-4 text-slate-300">
                <a href="#pc-builder" class="text-amber-300 hover:text-white font-medium transition-colors">
                    Simulasi PC Builder →
                </a>
            </div>
        </div>
    </div>

    <!-- Main Navigation Bar -->
    <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
            <!-- Logo & Brand -->
            <div class="flex items-center gap-3">
                <a href="/" class="flex items-center gap-2.5 group">
                    <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-[var(--radius-md)] bg-[var(--brand-600)] flex items-center justify-center text-white shadow-sm group-hover:bg-[var(--brand-700)] transition-colors">
                        <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <rect width="16" height="16" x="4" y="4" rx="2" />
                            <rect width="6" height="6" x="9" y="9" rx="1" />
                            <path d="M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2" />
                        </svg>
                    </div>
                    <div class="flex flex-col">
                        <span class="font-bold text-lg sm:text-xl tracking-tight text-[var(--text-primary)] leading-tight">
                            PC<span class="text-[var(--brand-600)]">STORE</span>
                        </span>
                        <span class="text-[10px] text-[var(--text-muted)] tracking-wider uppercase font-semibold hidden sm:inline">
                            Hardware & Custom Build
                        </span>
                    </div>
                </a>
            </div>

            <!-- Search Bar (Desktop) -->
            <div class="hidden lg:flex flex-1 max-w-xl mx-4">
                <form action="/search" method="GET" class="w-full relative">
                    <div class="relative flex items-center w-full">
                        <input
                            type="text"
                            name="q"
                            placeholder="Cari processor, VGA card, motherboard, RAM..."
                            class="w-full h-11 pl-11 pr-24 rounded-[var(--radius-md)] bg-[var(--surface-muted)] border border-[var(--border)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:bg-[var(--surface)] focus:border-[var(--brand-500)] focus:ring-2 focus:ring-[var(--brand-500)]/20 focus:outline-none transition-all"
                            aria-label="Cari produk komponen PC"
                        >
                        <div class="absolute left-3.5 text-[var(--text-muted)] pointer-events-none">
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                            </svg>
                        </div>
                        <button
                            type="submit"
                            class="absolute right-1.5 h-8 px-4 rounded-[var(--radius-sm)] bg-[var(--brand-600)] text-white text-xs font-semibold hover:bg-[var(--brand-700)] transition-colors"
                        >
                            Cari
                        </button>
                    </div>
                </form>
            </div>

            <!-- Right Actions -->
            <div class="flex items-center gap-1 sm:gap-2">
                <!-- Theme Toggle -->
                <button
                    type="button"
                    onclick="window.toggleTheme && window.toggleTheme()"
                    id="theme-toggle-btn"
                    class="relative inline-flex items-center justify-center w-10 h-10 rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-muted)] border border-[var(--border)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)]"
                    aria-label="Ganti tema"
                    title="Ganti tema tampilan"
                >
                    <svg class="w-5 h-5 hidden dark:block text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                    </svg>
                    <svg class="w-5 h-5 block dark:hidden text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                    </svg>
                </button>

                <!-- Wishlist Button -->
                <a
                    href="#wishlist"
                    class="relative inline-flex items-center justify-center w-10 h-10 rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-muted)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)]"
                    aria-label="Wishlist favorit"
                >
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </svg>
                    @if ($wishlistCount > 0)
                        <span class="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--danger)] text-white text-[10px] font-bold flex items-center justify-center">
                            {{ $wishlistCount }}
                        </span>
                    @endif
                </a>

                <!-- Cart Trigger Button -->
                <button
                    type="button"
                    class="relative inline-flex items-center justify-center h-10 px-3 rounded-[var(--radius-md)] bg-[var(--brand-50)] text-[var(--brand-700)] border border-[var(--brand-100)] hover:bg-[var(--brand-100)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)]"
                    aria-label="Keranjang belanja"
                >
                    <div class="relative">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
                            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                        </svg>
                        @if ($cartCount > 0)
                            <span class="absolute -top-2 -right-2.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--brand-600)] text-white text-[10px] font-bold flex items-center justify-center">
                                {{ $cartCount }}
                            </span>
                        @endif
                    </div>
                    <span class="hidden md:inline-block ml-2 text-xs font-semibold">Keranjang</span>
                </button>
            </div>
        </div>

        <!-- Mobile Search Bar -->
        <div class="lg:hidden pb-3">
            <form action="/search" method="GET" class="relative flex items-center">
                <input
                    type="text"
                    name="q"
                    placeholder="Cari processor, VGA, casing..."
                    class="w-full h-10 pl-10 pr-20 rounded-[var(--radius-md)] bg-[var(--surface-muted)] border border-[var(--border)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--brand-500)]"
                >
                <div class="absolute left-3 text-[var(--text-muted)] pointer-events-none">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                    </svg>
                </div>
                <button
                    type="submit"
                    class="absolute right-1.5 h-7 px-3 rounded-[var(--radius-sm)] bg-[var(--brand-600)] text-white text-xs font-semibold"
                >
                    Cari
                </button>
            </form>
        </div>
    </div>

    <!-- Category Nav Bar (Desktop) -->
    <div class="hidden lg:block border-t border-[var(--border)] bg-[var(--surface)]">
        <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-11 text-sm">
                <div class="flex items-center gap-2">
                    <a href="#processor" class="px-3 py-1.5 rounded-[var(--radius-sm)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-muted)] font-medium text-xs xl:text-sm">Processor</a>
                    <a href="#vga" class="px-3 py-1.5 rounded-[var(--radius-sm)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-muted)] font-medium text-xs xl:text-sm">VGA Card</a>
                    <a href="#motherboard" class="px-3 py-1.5 rounded-[var(--radius-sm)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-muted)] font-medium text-xs xl:text-sm">Motherboard</a>
                    <a href="#ram" class="px-3 py-1.5 rounded-[var(--radius-sm)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-muted)] font-medium text-xs xl:text-sm">RAM</a>
                    <a href="#storage" class="px-3 py-1.5 rounded-[var(--radius-sm)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-muted)] font-medium text-xs xl:text-sm">Storage SSD</a>
                    <a href="#psu" class="px-3 py-1.5 rounded-[var(--radius-sm)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-muted)] font-medium text-xs xl:text-sm">Power Supply</a>
                    <a href="#casing" class="px-3 py-1.5 rounded-[var(--radius-sm)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-muted)] font-medium text-xs xl:text-sm">Casing & Cooler</a>
                </div>
                <div>
                    <a href="#pc-builder" class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[var(--radius-pill)] bg-[var(--brand-600)] text-white font-medium text-xs hover:bg-[var(--brand-700)] transition-colors">
                        <span>Simulasi PC Builder</span>
                    </a>
                </div>
            </div>
        </div>
    </div>
</header>
