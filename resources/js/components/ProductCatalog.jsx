import React, { useState, useMemo } from 'react';
import productsData from '../mocks/products.json';
import ProductCard from './ProductCard';
import ProductFilterSidebar from './ProductFilterSidebar';
import {
    SearchIcon,
    SlidersHorizontalIcon,
    RotateCcwIcon,
    ChevronRightIcon,
    XIcon,
} from './Icons';

export default function ProductCatalog({
    onAddToCart,
    onToggleWishlist,
    wishlistItems = [],
    onQuickView,
    onSelectProduct,
}) {

    // Filter & Sort States
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedSockets, setSelectedSockets] = useState([]);
    const [selectedRamFactors, setSelectedRamFactors] = useState([]);
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [onlyInStock, setOnlyInStock] = useState(false);
    const [sortBy, setSortBy] = useState('popular');
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    // Categories list with counts
    const categoryOptions = useMemo(() => {
        const cats = [
            { id: 'all', name: 'Semua Kategori' },
            { id: 'processor', name: 'Processor' },
            { id: 'vga', name: 'VGA Card' },
            { id: 'motherboard', name: 'Motherboard' },
            { id: 'ram', name: 'RAM' },
            { id: 'storage', name: 'Storage SSD' },
            { id: 'psu', name: 'Power Supply' },
        ];

        return cats.map((c) => ({
            ...c,
            count:
                c.id === 'all'
                    ? productsData.length
                    : productsData.filter((p) => p.category === c.id).length,
        }));
    }, []);

    // Brand options with counts
    const brandOptions = useMemo(() => {
        const brandSet = new Set(productsData.map((p) => p.brand));
        return Array.from(brandSet).sort().map((b) => ({
            name: b,
            count: productsData.filter((p) => p.brand === b).length,
        }));
    }, []);

    // Socket CPU options with counts
    const socketOptions = useMemo(() => {
        const sockets = ['LGA1700', 'AM5', 'AM4'];
        return sockets.map((s) => ({
            name: s,
            count: productsData.filter((p) => p.cpuSocket === s).length,
        }));
    }, []);

    // RAM Form Factor options with counts
    const ramOptions = useMemo(() => {
        const factors = ['DDR5 DIMM', 'DDR4 DIMM', 'DDR5 SO-DIMM'];
        return factors.map((f) => ({
            name: f,
            count: productsData.filter((p) => p.ramFormFactor === f).length,
        }));
    }, []);

    // Filter Logic
    const filteredProducts = useMemo(() => {
        return productsData.filter((product) => {
            // Category
            if (selectedCategory !== 'all' && product.category !== selectedCategory) {
                return false;
            }

            // Brand
            if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
                return false;
            }

            // Socket CPU
            if (selectedSockets.length > 0 && !selectedSockets.includes(product.cpuSocket)) {
                return false;
            }

            // RAM Form Factor
            if (selectedRamFactors.length > 0 && !selectedRamFactors.includes(product.ramFormFactor)) {
                return false;
            }

            // Ready Stock
            if (onlyInStock && !product.inStock) {
                return false;
            }

            // Price range
            const min = priceRange.min !== '' ? Number(priceRange.min) : null;
            const max = priceRange.max !== '' ? Number(priceRange.max) : null;
            if (min !== null && product.price < min) return false;
            if (max !== null && product.price > max) return false;

            // Search query
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const matchName = product.name.toLowerCase().includes(q);
                const matchBrand = product.brand.toLowerCase().includes(q);
                const matchCat = (product.categoryName || product.category).toLowerCase().includes(q);
                const matchSpecs = product.specs?.some((s) => s.toLowerCase().includes(q));
                if (!matchName && !matchBrand && !matchCat && !matchSpecs) return false;
            }

            return true;
        });
    }, [
        selectedCategory,
        selectedBrands,
        selectedSockets,
        selectedRamFactors,
        onlyInStock,
        priceRange,
        searchQuery,
    ]);

    // Sorting Logic
    const sortedProducts = useMemo(() => {
        const list = [...filteredProducts];
        switch (sortBy) {
            case 'price-asc':
                return list.sort((a, b) => a.price - b.price);
            case 'price-desc':
                return list.sort((a, b) => b.price - a.price);
            case 'name-asc':
                return list.sort((a, b) => a.name.localeCompare(b.name));
            case 'name-desc':
                return list.sort((a, b) => b.name.localeCompare(a.name));
            case 'popular':
            default:
                // Prioritize in-stock and flagship/best sellers
                return list.sort((a, b) => (b.inStock ? 1 : 0) - (a.inStock ? 1 : 0));
        }
    }, [filteredProducts, sortBy]);

    // Handlers
    const handleToggleBrand = (brandName) => {
        setSelectedBrands((prev) =>
            prev.includes(brandName) ? prev.filter((b) => b !== brandName) : [...prev, brandName]
        );
    };

    const handleToggleSocket = (socketName) => {
        setSelectedSockets((prev) =>
            prev.includes(socketName) ? prev.filter((s) => s !== socketName) : [...prev, socketName]
        );
    };

    const handleToggleRamFactor = (factorName) => {
        setSelectedRamFactors((prev) =>
            prev.includes(factorName) ? prev.filter((f) => f !== factorName) : [...prev, factorName]
        );
    };

    const handleResetAllFilters = () => {
        setSearchQuery('');
        setSelectedCategory('all');
        setSelectedBrands([]);
        setSelectedSockets([]);
        setSelectedRamFactors([]);
        setPriceRange({ min: '', max: '' });
        setOnlyInStock(false);
    };

    const hasActiveFilters =
        selectedCategory !== 'all' ||
        selectedBrands.length > 0 ||
        selectedSockets.length > 0 ||
        selectedRamFactors.length > 0 ||
        priceRange.min !== '' ||
        priceRange.max !== '' ||
        onlyInStock ||
        searchQuery.trim() !== '';

    return (
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mb-4">
                <a href="/" className="hover:text-[var(--text-primary)] transition-colors">
                    Beranda
                </a>
                <ChevronRightIcon className="w-3 h-3 text-[var(--border-strong)]" />
                <span className="text-[var(--text-primary)] font-medium">Katalog Komponen PC</span>
            </nav>

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[var(--border)] gap-4 mb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
                        Katalog Produk Hardware
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">
                        Pilih komponen resmi bergaransi distributor untuk kebutuhan rakitan gaming & workstation Anda.
                    </p>
                </div>

                {/* Mobile Filter Trigger Button */}
                <div className="flex lg:hidden items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setIsMobileFilterOpen(true)}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-[var(--radius-md)] bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] text-xs font-semibold hover:bg-[var(--surface-muted)] transition-colors shadow-xs"
                    >
                        <SlidersHorizontalIcon className="w-4 h-4 text-[var(--brand-600)]" />
                        <span>Filter Hardware</span>
                        {hasActiveFilters && (
                            <span className="w-2 h-2 rounded-full bg-[var(--brand-600)]" />
                        )}
                    </button>
                </div>
            </div>

            {/* Main Content: Sidebar + Grid */}
            <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* 1. Sidebar Filter Multi-kategori */}
                <ProductFilterSidebar
                    categories={categoryOptions}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                    brands={brandOptions}
                    selectedBrands={selectedBrands}
                    onToggleBrand={handleToggleBrand}
                    cpuSockets={socketOptions}
                    selectedSockets={selectedSockets}
                    onToggleSocket={handleToggleSocket}
                    ramFormFactors={ramOptions}
                    selectedRamFactors={selectedRamFactors}
                    onToggleRamFactor={handleToggleRamFactor}
                    priceRange={priceRange}
                    onPriceRangeChange={setPriceRange}
                    onlyInStock={onlyInStock}
                    onToggleOnlyInStock={() => setOnlyInStock(!onlyInStock)}
                    onResetFilters={handleResetAllFilters}
                    totalProductsCount={productsData.length}
                    filteredCount={filteredProducts.length}
                    isMobileOpen={isMobileFilterOpen}
                    onCloseMobile={() => setIsMobileFilterOpen(false)}
                />

                {/* 2. Main Product Area */}
                <div className="flex-1 w-full min-w-0">
                    {/* Control Bar: Search input in catalog + Sort selector */}
                    <div className="bg-[var(--surface)] p-3.5 rounded-[var(--radius-lg)] border border-[var(--border)] shadow-[var(--shadow-card)] mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        {/* Search Inside Catalog */}
                        <div className="relative flex-1 max-w-md">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari nama produk, brand, atau spesifikasi..."
                                className="w-full text-xs py-2 pl-9 pr-8 rounded-[var(--radius-md)] bg-[var(--surface-muted)] border border-[var(--border)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:bg-[var(--surface)] focus:border-[var(--brand-500)] focus:outline-none"
                            />
                            <div className="absolute left-2.5 top-2.5 text-[var(--text-muted)] pointer-events-none">
                                <SearchIcon className="w-4 h-4" />
                            </div>
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-2.5 top-2.5 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                                    aria-label="Bersihkan pencarian"
                                >
                                    <XIcon className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        {/* Sort Selector */}
                        <div className="flex items-center gap-2 justify-end text-xs">
                            <span className="text-[var(--text-muted)] font-medium whitespace-nowrap">
                                Urutkan:
                            </span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="text-xs py-1.5 px-3 rounded-[var(--radius-md)] bg-[var(--surface-muted)] border border-[var(--border)] text-[var(--text-primary)] font-medium focus:bg-[var(--surface)] focus:border-[var(--brand-500)] focus:outline-none cursor-pointer"
                            >
                                <option value="popular">Paling Sesuai / Populer</option>
                                <option value="price-asc">Harga: Terendah ke Tertinggi</option>
                                <option value="price-desc">Harga: Tertinggi ke Terendah</option>
                                <option value="name-asc">Nama Produk (A - Z)</option>
                                <option value="name-desc">Nama Produk (Z - A)</option>
                            </select>
                        </div>
                    </div>

                    {/* Active Filter Chips / Pills */}
                    {hasActiveFilters && (
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            <span className="text-xs text-[var(--text-muted)] font-medium mr-1">
                                Filter Aktif:
                            </span>

                            {selectedCategory !== 'all' && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--brand-50)] text-[var(--brand-700)] border border-[var(--brand-100)]">
                                    <span>Kategori: {categoryOptions.find((c) => c.id === selectedCategory)?.name}</span>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedCategory('all')}
                                        className="hover:text-[var(--danger)]"
                                    >
                                        <XIcon className="w-3 h-3" />
                                    </button>
                                </span>
                            )}

                            {selectedBrands.map((b) => (
                                <span
                                    key={b}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--surface-muted)] text-[var(--text-primary)] border border-[var(--border)]"
                                >
                                    <span>Brand: {b}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleToggleBrand(b)}
                                        className="hover:text-[var(--danger)]"
                                    >
                                        <XIcon className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}

                            {selectedSockets.map((s) => (
                                <span
                                    key={s}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--surface-muted)] text-[var(--text-primary)] border border-[var(--border)]"
                                >
                                    <span>Socket: {s}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleToggleSocket(s)}
                                        className="hover:text-[var(--danger)]"
                                    >
                                        <XIcon className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}

                            {selectedRamFactors.map((r) => (
                                <span
                                    key={r}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--surface-muted)] text-[var(--text-primary)] border border-[var(--border)]"
                                >
                                    <span>RAM: {r}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleToggleRamFactor(r)}
                                        className="hover:text-[var(--danger)]"
                                    >
                                        <XIcon className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}

                            {onlyInStock && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--success-bg)] text-[var(--success)] border border-emerald-200 dark:border-emerald-900">
                                    <span>Ready Stock Saja</span>
                                    <button
                                        type="button"
                                        onClick={() => setOnlyInStock(false)}
                                        className="hover:text-[var(--danger)]"
                                    >
                                        <XIcon className="w-3 h-3" />
                                    </button>
                                </span>
                            )}

                            {(priceRange.min !== '' || priceRange.max !== '') && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--surface-muted)] text-[var(--text-primary)] border border-[var(--border)]">
                                    <span>
                                        Harga:{' '}
                                        {priceRange.min ? `Min ${priceRange.min}` : ''}{' '}
                                        {priceRange.max ? `Max ${priceRange.max}` : ''}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setPriceRange({ min: '', max: '' })}
                                        className="hover:text-[var(--danger)]"
                                    >
                                        <XIcon className="w-3 h-3" />
                                    </button>
                                </span>
                            )}

                            <button
                                type="button"
                                onClick={handleResetAllFilters}
                                className="text-xs text-[var(--danger)] hover:underline ml-1 font-semibold flex items-center gap-1"
                            >
                                <RotateCcwIcon className="w-3 h-3" />
                                <span>Hapus Semua</span>
                            </button>
                        </div>
                    )}

                    {/* Product Count Indicator */}
                    <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] mb-4 px-1">
                        <span>
                            Menampilkan <strong className="text-[var(--text-primary)]">{sortedProducts.length}</strong> dari{' '}
                            <strong>{productsData.length}</strong> total komponen
                        </span>
                    </div>

                    {/* Responsive Product Grid */}
                    {sortedProducts.length === 0 ? (
                        /* Empty State */
                        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-xl)] p-12 text-center flex flex-col items-center justify-center shadow-[var(--shadow-card)]">
                            <div className="w-16 h-16 rounded-full bg-[var(--surface-muted)] flex items-center justify-center text-[var(--text-muted)] mb-4">
                                <SearchIcon className="w-8 h-8" />
                            </div>
                            <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">
                                Tidak ada komponen yang cocok
                            </h3>
                            <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md mb-6 leading-relaxed">
                                Coba ubah rentang harga, hapus filter brand, atau ganti kata kunci pencarian Anda untuk menemukan produk hardware lainnya.
                            </p>
                            <button
                                type="button"
                                onClick={handleResetAllFilters}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-md)] bg-[var(--brand-600)] text-white text-xs font-semibold hover:bg-[var(--brand-700)] transition-colors shadow-xs"
                            >
                                <RotateCcwIcon className="w-3.5 h-3.5" />
                                <span>Reset Semua Filter</span>
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {sortedProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onAddToCart={onAddToCart}
                                    onToggleWishlist={onToggleWishlist}
                                    isWishlisted={wishlistItems.some((w) => w.id === product.id)}
                                    onQuickView={onQuickView}
                                    onSelectProduct={onSelectProduct}
                                />
                            ))}
                        </div>

                    )}
                </div>
            </div>
        </div>
    );
}
