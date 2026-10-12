import React, { useState, useEffect, useMemo } from 'react';
import {
    XIcon,
    SearchIcon,
    CheckCircleIcon,
    CpuIcon,
    MonitorIcon,
    HardDriveIcon,
    BoxIcon,
} from './Icons';

export default function ComponentPickerModal({
    isOpen,
    onClose,
    slotTitle,
    category,
    products = [],
    selectedBuild = {},
    onSelectProduct,
}) {
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
            setSearchQuery('');
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    const formatRupiah = (val) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(val);
    };

    // Filter available products by active slot category and search query
    const availableProducts = useMemo(() => {
        let list = products.filter((p) => p.category === category);
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter(
                (p) =>
                    p.name.toLowerCase().includes(q) ||
                    p.brand.toLowerCase().includes(q) ||
                    p.specs?.some((s) => s.toLowerCase().includes(q))
            );
        }
        return list;
    }, [products, category, searchQuery]);

    // Check individual compatibility with current build
    const checkProductCompatibility = (product) => {
        let hasApplicableCheck = false;

        // 1. CPU vs Motherboard
        if (category === 'processor' && selectedBuild.motherboard) {
            hasApplicableCheck = true;
            if (!product.cpuSocket || !selectedBuild.motherboard.cpuSocket) {
                return {
                    isCompatible: null,
                    reason: 'Kecocokan socket belum dapat diperiksa karena data tidak lengkap',
                };
            }
            if (product.cpuSocket !== selectedBuild.motherboard.cpuSocket) {
                return {
                    isCompatible: false,
                    reason: `Socket CPU (${product.cpuSocket}) tidak cocok dengan Motherboard (${selectedBuild.motherboard.cpuSocket})`,
                };
            }
        }

        // 2. Motherboard vs CPU
        if (category === 'motherboard' && selectedBuild.cpu) {
            hasApplicableCheck = true;
            if (!product.cpuSocket || !selectedBuild.cpu.cpuSocket) {
                return {
                    isCompatible: null,
                    reason: 'Kecocokan socket belum dapat diperiksa karena data tidak lengkap',
                };
            }
            if (product.cpuSocket !== selectedBuild.cpu.cpuSocket) {
                return {
                    isCompatible: false,
                    reason: `Socket Motherboard (${product.cpuSocket}) tidak cocok dengan Processor (${selectedBuild.cpu.cpuSocket})`,
                };
            }
        }

        // 3. RAM vs Motherboard
        if (category === 'ram' && selectedBuild.motherboard) {
            const mbRam = selectedBuild.motherboard.ramFormFactor;
            hasApplicableCheck = true;
            if (!mbRam || !product.ramFormFactor) {
                return {
                    isCompatible: null,
                    reason: 'Kecocokan tipe RAM belum dapat diperiksa karena data tidak lengkap',
                };
            }
            if (mbRam && product.ramFormFactor && !mbRam.includes(product.ramFormFactor.replace(' DIMM', ''))) {
                return {
                    isCompatible: false,
                    reason: `Slot RAM Motherboard (${mbRam}) tidak cocok dengan tipe RAM (${product.ramFormFactor})`,
                };
            }
        }

        return hasApplicableCheck
            ? { isCompatible: true, reason: 'Cocok dengan komponen terpilih yang diperiksa' }
            : { isCompatible: null, reason: 'Belum ada pasangan komponen untuk diperiksa' };
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="picker-modal-title"
        >
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-2xl rounded-[var(--radius-xl)] bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] shadow-2xl z-10 overflow-hidden flex flex-col max-h-[85vh]">
                {/* Header */}
                <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--surface)]">
                    <div>
                        <span className="text-[11px] font-semibold text-[var(--brand-600)] uppercase tracking-wider block">
                            Pilih Komponen Rakitan
                        </span>
                        <h3 id="picker-modal-title" className="text-base font-bold text-[var(--text-primary)]">
                            Daftar {slotTitle}
                        </h3>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-muted)] transition-colors"
                        aria-label="Tutup pemilih komponen"
                    >
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Search Bar */}
                <div className="p-4 border-b border-[var(--border)] bg-[var(--surface-muted)]">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={`Cari ${slotTitle} berdasarkan nama, brand, atau spesifikasi...`}
                            className="w-full text-xs py-2 pl-9 pr-4 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--brand-500)]"
                        />
                        <div className="absolute left-3 top-2.5 text-[var(--text-muted)] pointer-events-none">
                            <SearchIcon className="w-4 h-4" />
                        </div>
                    </div>
                </div>

                {/* Product List */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-[var(--border)]">
                    {availableProducts.length === 0 ? (
                        <div className="text-center py-10 text-xs text-[var(--text-muted)]">
                            Tidak ada komponen yang cocok dengan pencarian Anda.
                        </div>
                    ) : (
                        availableProducts.map((product) => {
                            const { isCompatible, reason } = checkProductCompatibility(product);
                            return (
                                <div
                                    key={product.id}
                                    className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                                >
                                    <div className="flex-1 min-w-0 space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--brand-600)]">
                                                {product.brand}
                                            </span>
                                            {product.cpuSocket && (
                                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[var(--surface-muted)] border border-[var(--border)] text-[var(--text-secondary)]">
                                                    Socket {product.cpuSocket}
                                                </span>
                                            )}
                                            {product.ramFormFactor && (
                                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[var(--surface-muted)] border border-[var(--border)] text-[var(--text-secondary)]">
                                                    {product.ramFormFactor}
                                                </span>
                                            )}
                                        </div>

                                        <h4 className="text-xs sm:text-sm font-semibold text-[var(--text-primary)] leading-snug">
                                            {product.name}
                                        </h4>

                                        {/* Compatibility Notice Badge */}
                                        <div className="flex items-center gap-1.5 pt-0.5">
                                            {isCompatible === true ? (
                                                <span className="inline-flex items-center gap-1 text-[11px] text-[var(--success)] font-medium">
                                                    <CheckCircleIcon className="w-3.5 h-3.5 text-[var(--success)]" />
                                                    <span>{reason}</span>
                                                </span>
                                            ) : isCompatible === false ? (
                                                <span className="inline-flex items-center gap-1 text-[11px] text-[var(--danger)] font-medium bg-[var(--danger-bg)] px-2 py-0.5 rounded">
                                                    <span>⚠️ {reason}</span>
                                                </span>
                                            ) : (
                                                <span className="text-[11px] text-[var(--text-muted)]">{reason}</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Price & Select Button */}
                                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                                        <span className="text-sm font-bold text-[var(--brand-600)]">
                                            {formatRupiah(product.price)}
                                        </span>

                                        <button
                                            type="button"
                                            disabled={product.inStock === false}
                                            onClick={() => {
                                                onSelectProduct(product);
                                                onClose();
                                            }}
                                            className="px-3.5 py-1.5 rounded-[var(--radius-md)] bg-[var(--brand-600)] hover:bg-[var(--brand-700)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[var(--brand-600)] text-white text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)] shadow-2xs"
                                        >
                                            {product.inStock === false ? 'Stok Habis' : 'Pilih Komponen'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
