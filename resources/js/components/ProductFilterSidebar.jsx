import React, { useState } from 'react';
import {
    FilterIcon,
    RotateCcwIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    CheckIcon,
    XIcon,
} from './Icons';

export default function ProductFilterSidebar({
    categories = [],
    selectedCategory = 'all',
    onSelectCategory,
    brands = [],
    selectedBrands = [],
    onToggleBrand,
    cpuSockets = [],
    selectedSockets = [],
    onToggleSocket,
    ramFormFactors = [],
    selectedRamFactors = [],
    onToggleRamFactor,
    priceRange = { min: '', max: '' },
    onPriceRangeChange,
    onlyInStock = false,
    onToggleOnlyInStock,
    onResetFilters,
    totalProductsCount = 0,
    filteredCount = 0,
    isMobileOpen = false,
    onCloseMobile,
}) {
    // Accordion expand/collapse states
    const [collapsed, setCollapsed] = useState({
        category: false,
        price: false,
        brand: false,
        socket: false,
        ram: false,
        stock: false,
    });

    const toggleSection = (section) => {
        setCollapsed((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    const formatNumber = (num) => {
        if (!num) return '';
        return new Intl.NumberFormat('id-ID').format(num);
    };

    const hasActiveFilters =
        selectedCategory !== 'all' ||
        selectedBrands.length > 0 ||
        selectedSockets.length > 0 ||
        selectedRamFactors.length > 0 ||
        priceRange.min !== '' ||
        priceRange.max !== '' ||
        onlyInStock;

    const quickPricePresets = [
        { label: '< Rp 3 Jt', min: '', max: 3000000 },
        { label: 'Rp 3 - 7 Jt', min: 3000000, max: 7000000 },
        { label: 'Rp 7 - 12 Jt', min: 7000000, max: 12000000 },
        { label: '> Rp 12 Jt', min: 12000000, max: '' },
    ];

    const filterContent = (
        <div className="space-y-6">
            {/* Header: Filter title & Reset CTA */}
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                <div className="flex items-center gap-2">
                    <FilterIcon className="w-4 h-4 text-[var(--brand-600)]" />
                    <h3 className="font-bold text-sm text-[var(--text-primary)]">
                        Filter Komponen
                    </h3>
                </div>

                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={onResetFilters}
                        className="text-xs text-[var(--brand-600)] hover:text-[var(--brand-800)] flex items-center gap-1 font-semibold transition-colors focus:outline-none"
                    >
                        <RotateCcwIcon className="w-3.5 h-3.5" />
                        <span>Reset</span>
                    </button>
                )}
            </div>

            {/* 1. Category Filter */}
            <div className="space-y-2">
                <button
                    type="button"
                    onClick={() => toggleSection('category')}
                    className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] py-1 focus:outline-none"
                >
                    <span>Kategori Hardware</span>
                    {collapsed.category ? (
                        <ChevronDownIcon className="w-4 h-4 text-[var(--text-muted)]" />
                    ) : (
                        <ChevronUpIcon className="w-4 h-4 text-[var(--text-muted)]" />
                    )}
                </button>

                {!collapsed.category && (
                    <div className="space-y-1 pt-1">
                        {categories.map((cat) => {
                            const isSelected = selectedCategory === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => onSelectCategory && onSelectCategory(cat.id)}
                                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-[var(--radius-sm)] text-xs font-medium transition-colors text-left focus:outline-none ${
                                        isSelected
                                            ? 'bg-[var(--brand-50)] text-[var(--brand-700)] font-semibold border border-[var(--brand-100)]'
                                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-muted)]'
                                    }`}
                                >
                                    <span>{cat.name}</span>
                                    {cat.count !== undefined && (
                                        <span className="text-[11px] text-[var(--text-muted)]">
                                            {cat.count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* 2. Brand Filter (Multi-checkbox) */}
            <div className="space-y-2 pt-2 border-t border-[var(--border)]">
                <button
                    type="button"
                    onClick={() => toggleSection('brand')}
                    className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] py-1 focus:outline-none"
                >
                    <span>Brand / Merek</span>
                    {collapsed.brand ? (
                        <ChevronDownIcon className="w-4 h-4 text-[var(--text-muted)]" />
                    ) : (
                        <ChevronUpIcon className="w-4 h-4 text-[var(--text-muted)]" />
                    )}
                </button>

                {!collapsed.brand && (
                    <div className="space-y-1.5 pt-1 max-h-48 overflow-y-auto pr-1">
                        {brands.map((b) => {
                            const isChecked = selectedBrands.includes(b.name);
                            return (
                                <label
                                    key={b.name}
                                    className="flex items-center justify-between px-2 py-1 rounded-[var(--radius-sm)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-muted)] cursor-pointer select-none transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => onToggleBrand && onToggleBrand(b.name)}
                                            className="rounded border-[var(--border)] text-[var(--brand-600)] focus:ring-[var(--brand-500)] w-4 h-4 cursor-pointer"
                                        />
                                        <span>{b.name}</span>
                                    </div>
                                    <span className="text-[11px] text-[var(--text-muted)]">
                                        {b.count}
                                    </span>
                                </label>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* 3. Price Range Filter */}
            <div className="space-y-2 pt-2 border-t border-[var(--border)]">
                <button
                    type="button"
                    onClick={() => toggleSection('price')}
                    className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] py-1 focus:outline-none"
                >
                    <span>Rentang Harga (Rp)</span>
                    {collapsed.price ? (
                        <ChevronDownIcon className="w-4 h-4 text-[var(--text-muted)]" />
                    ) : (
                        <ChevronUpIcon className="w-4 h-4 text-[var(--text-muted)]" />
                    )}
                </button>

                {!collapsed.price && (
                    <div className="space-y-3 pt-1">
                        {/* Preset Buttons */}
                        <div className="grid grid-cols-2 gap-1.5">
                            {quickPricePresets.map((preset, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() =>
                                        onPriceRangeChange &&
                                        onPriceRangeChange({ min: preset.min, max: preset.max })
                                    }
                                    className="px-2 py-1 text-[11px] font-medium rounded-[var(--radius-sm)] bg-[var(--surface-muted)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border)] border border-[var(--border)] transition-colors text-center"
                                >
                                    {preset.label}
                                </button>
                            ))}
                        </div>

                        {/* Min & Max Inputs */}
                        <div className="flex items-center gap-2">
                            <div className="flex-1">
                                <label className="text-[10px] text-[var(--text-muted)] font-medium block mb-0.5">
                                    Minimum
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={priceRange.min}
                                        onChange={(e) =>
                                            onPriceRangeChange &&
                                            onPriceRangeChange({
                                                ...priceRange,
                                                min: e.target.value,
                                            })
                                        }
                                        className="w-full text-xs py-1.5 px-2 rounded-[var(--radius-sm)] bg-[var(--surface-muted)] border border-[var(--border)] text-[var(--text-primary)] focus:bg-[var(--surface)] focus:border-[var(--brand-500)] focus:outline-none"
                                    />
                                </div>
                            </div>
                            <span className="text-[var(--text-muted)] mt-4">-</span>
                            <div className="flex-1">
                                <label className="text-[10px] text-[var(--text-muted)] font-medium block mb-0.5">
                                    Maksimum
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        placeholder="Tanpa Batas"
                                        value={priceRange.max}
                                        onChange={(e) =>
                                            onPriceRangeChange &&
                                            onPriceRangeChange({
                                                ...priceRange,
                                                max: e.target.value,
                                            })
                                        }
                                        className="w-full text-xs py-1.5 px-2 rounded-[var(--radius-sm)] bg-[var(--surface-muted)] border border-[var(--border)] text-[var(--text-primary)] focus:bg-[var(--surface)] focus:border-[var(--brand-500)] focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 4. Socket CPU Filter (Multi-checkbox) */}
            <div className="space-y-2 pt-2 border-t border-[var(--border)]">
                <button
                    type="button"
                    onClick={() => toggleSection('socket')}
                    className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] py-1 focus:outline-none"
                >
                    <span>Socket CPU</span>
                    {collapsed.socket ? (
                        <ChevronDownIcon className="w-4 h-4 text-[var(--text-muted)]" />
                    ) : (
                        <ChevronUpIcon className="w-4 h-4 text-[var(--text-muted)]" />
                    )}
                </button>

                {!collapsed.socket && (
                    <div className="space-y-1.5 pt-1">
                        {cpuSockets.map((s) => {
                            const isChecked = selectedSockets.includes(s.name);
                            return (
                                <label
                                    key={s.name}
                                    className="flex items-center justify-between px-2 py-1 rounded-[var(--radius-sm)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-muted)] cursor-pointer select-none transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() =>
                                                onToggleSocket && onToggleSocket(s.name)
                                            }
                                            className="rounded border-[var(--border)] text-[var(--brand-600)] focus:ring-[var(--brand-500)] w-4 h-4 cursor-pointer"
                                        />
                                        <span>Socket {s.name}</span>
                                    </div>
                                    <span className="text-[11px] text-[var(--text-muted)]">
                                        {s.count}
                                    </span>
                                </label>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* 5. Form Factor RAM Filter (Multi-checkbox) */}
            <div className="space-y-2 pt-2 border-t border-[var(--border)]">
                <button
                    type="button"
                    onClick={() => toggleSection('ram')}
                    className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] py-1 focus:outline-none"
                >
                    <span>Form Factor RAM</span>
                    {collapsed.ram ? (
                        <ChevronDownIcon className="w-4 h-4 text-[var(--text-muted)]" />
                    ) : (
                        <ChevronUpIcon className="w-4 h-4 text-[var(--text-muted)]" />
                    )}
                </button>

                {!collapsed.ram && (
                    <div className="space-y-1.5 pt-1">
                        {ramFormFactors.map((r) => {
                            const isChecked = selectedRamFactors.includes(r.name);
                            return (
                                <label
                                    key={r.name}
                                    className="flex items-center justify-between px-2 py-1 rounded-[var(--radius-sm)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-muted)] cursor-pointer select-none transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() =>
                                                onToggleRamFactor && onToggleRamFactor(r.name)
                                            }
                                            className="rounded border-[var(--border)] text-[var(--brand-600)] focus:ring-[var(--brand-500)] w-4 h-4 cursor-pointer"
                                        />
                                        <span>{r.name}</span>
                                    </div>
                                    <span className="text-[11px] text-[var(--text-muted)]">
                                        {r.count}
                                    </span>
                                </label>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* 6. Availability Checkbox */}
            <div className="pt-2 border-t border-[var(--border)]">
                <label className="flex items-center gap-2 px-2 py-1.5 rounded-[var(--radius-sm)] text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer select-none">
                    <input
                        type="checkbox"
                        checked={onlyInStock}
                        onChange={onToggleOnlyInStock}
                        className="rounded border-[var(--border)] text-[var(--brand-600)] focus:ring-[var(--brand-500)] w-4 h-4 cursor-pointer"
                    />
                    <span>Hanya tampilkan Ready Stock</span>
                </label>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 shrink-0 bg-[var(--surface)] p-5 rounded-[var(--radius-lg)] border border-[var(--border)] shadow-[var(--shadow-card)] h-fit sticky top-24">
                {filterContent}
            </aside>

            {/* Mobile Sheet / Drawer */}
            {isMobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-50 flex"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="filter-drawer-title"
                >
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
                        onClick={onCloseMobile}
                    />

                    {/* Drawer Content */}
                    <div className="relative w-4/5 max-w-sm bg-[var(--surface)] text-[var(--text-primary)] h-full shadow-2xl flex flex-col z-10 ml-auto">
                        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FilterIcon className="w-5 h-5 text-[var(--brand-600)]" />
                                <h2
                                    id="filter-drawer-title"
                                    className="font-bold text-base text-[var(--text-primary)]"
                                >
                                    Filter Produk
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={onCloseMobile}
                                className="p-1 rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                                aria-label="Tutup filter"
                            >
                                <XIcon className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-5">
                            {filterContent}
                        </div>

                        <div className="p-4 border-t border-[var(--border)] bg-[var(--surface-muted)] flex gap-2">
                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={onResetFilters}
                                    className="flex-1 py-2 px-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--border)] transition-colors"
                                >
                                    Reset
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={onCloseMobile}
                                className="flex-1 py-2 px-4 rounded-[var(--radius-md)] bg-[var(--brand-600)] text-white text-xs font-semibold hover:bg-[var(--brand-700)] transition-colors text-center"
                            >
                                Terapkan ({filteredCount} Produk)
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
