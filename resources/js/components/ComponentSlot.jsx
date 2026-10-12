import React from 'react';
import {
    CpuIcon,
    MonitorIcon,
    HardDriveIcon,
    BoxIcon,
    TrashIcon,
    PlusIcon,
} from './Icons';

export default function ComponentSlot({
    slotKey,
    title,
    subtitle,
    category,
    selectedProduct,
    onOpenPicker,
    onRemoveProduct,
}) {
    const formatRupiah = (val) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(val);
    };

    const renderSlotIcon = () => {
        switch (category) {
            case 'processor':
                return <CpuIcon className="w-5 h-5 text-[var(--brand-600)]" />;
            case 'vga':
                return <MonitorIcon className="w-5 h-5 text-[var(--brand-600)]" />;
            case 'casing':
                return <BoxIcon className="w-5 h-5 text-[var(--brand-600)]" />;
            case 'motherboard':
            case 'ram':
            case 'storage':
            case 'psu':
            default:
                return <HardDriveIcon className="w-5 h-5 text-[var(--brand-600)]" />;
        }
    };

    return (
        <div
            className={`p-4 sm:p-5 rounded-[var(--radius-lg)] border transition-all duration-200 ${
                selectedProduct
                    ? 'bg-[var(--surface)] border-[var(--brand-500)] shadow-[var(--shadow-card)]'
                    : 'bg-[var(--surface)] border-[var(--border)] hover:border-[var(--brand-500)]/60'
            }`}
        >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Left: Slot Header & Product Details */}
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div
                        className={`p-2.5 rounded-[var(--radius-md)] shrink-0 mt-0.5 ${
                            selectedProduct
                                ? 'bg-[var(--brand-50)] text-[var(--brand-700)]'
                                : 'bg-[var(--surface-muted)] text-[var(--text-muted)]'
                        }`}
                    >
                        {renderSlotIcon()}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                                {title}
                            </span>
                            {subtitle && (
                                <span className="text-[11px] text-[var(--text-muted)] hidden md:inline">
                                    ({subtitle})
                                </span>
                            )}
                        </div>

                        {selectedProduct ? (
                            <div className="mt-1 space-y-1">
                                <h4 className="text-sm font-semibold text-[var(--text-primary)] leading-snug truncate">
                                    {selectedProduct.name}
                                </h4>

                                <div className="flex flex-wrap items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                                    {selectedProduct.cpuSocket && (
                                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-[var(--surface-muted)] text-[var(--text-secondary)] border border-[var(--border)]">
                                            Socket {selectedProduct.cpuSocket}
                                        </span>
                                    )}
                                    {selectedProduct.ramFormFactor && (
                                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-[var(--surface-muted)] text-[var(--text-secondary)] border border-[var(--border)]">
                                            {selectedProduct.ramFormFactor}
                                        </span>
                                    )}
                                    {selectedProduct.powerDraw !== undefined && (
                                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                            TDP: {selectedProduct.powerDraw}W
                                        </span>
                                    )}
                                    {selectedProduct.psuCapacity && (
                                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                            Kapasitas: {selectedProduct.psuCapacity}W
                                        </span>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <p className="text-xs text-[var(--text-muted)] mt-0.5">
                                Belum ada komponen yang dipilih untuk slot ini.
                            </p>
                        )}
                    </div>
                </div>

                {/* Right: Price & CTA Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-[var(--border)]">
                    {selectedProduct ? (
                        <div className="flex items-center gap-3">
                            <span className="text-sm sm:text-base font-bold text-[var(--brand-600)] whitespace-nowrap">
                                {formatRupiah(selectedProduct.price)}
                            </span>

                            <div className="flex items-center gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => onOpenPicker(slotKey, category)}
                                    className="px-3 py-1.5 rounded-[var(--radius-sm)] bg-[var(--surface-muted)] hover:bg-[var(--border)] text-xs font-semibold text-[var(--text-primary)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)]"
                                >
                                    Ganti
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onRemoveProduct(slotKey)}
                                    className="p-1.5 rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--surface-muted)] transition-colors"
                                    aria-label={`Hapus ${title} dari rakitan`}
                                    title="Hapus komponen"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => onOpenPicker(slotKey, category)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[var(--radius-md)] bg-[var(--brand-50)] text-[var(--brand-700)] border border-[var(--brand-100)] hover:bg-[var(--brand-100)] text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)]"
                        >
                            <PlusIcon className="w-3.5 h-3.5 text-[var(--brand-600)]" />
                            <span>Pilih {title}</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
