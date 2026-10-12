import React, { useState, useMemo } from 'react';
import productsData from '../mocks/products.json';
import ComponentSlot from './ComponentSlot';
import ComponentPickerModal from './ComponentPickerModal';
import {
    WrenchIcon,
    ZapIcon,
    CheckCircleIcon,
    RotateCcwIcon,
    ShareIcon,
    CartIcon,
    ShieldCheckIcon,
    CpuIcon,
    MonitorIcon,
    HardDriveIcon,
    BoxIcon,
    ArrowRightIcon,
} from './Icons';

export default function PCBuilderSimulation({
    initialSelectedProduct = null,
    onAddMultipleToCart,
    onOpenCart,
    onShowToast,
}) {
    // Selected Build State
    const [build, setBuild] = useState({
        cpu: null,
        motherboard: null,
        ram: null,
        vga: null,
        storage: null,
        psu: null,
        casing: null,
    });

    // Populate initialSelectedProduct if provided from external trigger
    React.useEffect(() => {
        if (initialSelectedProduct) {
            const slotMap = {
                processor: 'cpu',
                motherboard: 'motherboard',
                ram: 'ram',
                vga: 'vga',
                storage: 'storage',
                psu: 'psu',
                casing: 'casing',
            };
            const targetSlot = slotMap[initialSelectedProduct.category];
            if (targetSlot) {
                setBuild((prev) => ({
                    ...prev,
                    [targetSlot]: initialSelectedProduct,
                }));
            }
        }
    }, [initialSelectedProduct]);

    // Active Picker Modal State
    const [activePicker, setActivePicker] = useState(null); // { slotKey, category, title }


    const formatRupiah = (val) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(val);
    };

    // Slot Definitions
    const slots = [
        {
            key: 'cpu',
            title: 'Processor (CPU)',
            subtitle: 'Otak sistem komputasi',
            category: 'processor',
        },
        {
            key: 'motherboard',
            title: 'Motherboard',
            subtitle: 'Papan sirkuit utama & socket',
            category: 'motherboard',
        },
        {
            key: 'ram',
            title: 'Memori (RAM)',
            subtitle: 'Kecepatan multitasking DDR4/DDR5',
            category: 'ram',
        },
        {
            key: 'vga',
            title: 'Kartu Grafis (GPU / VGA)',
            subtitle: 'Performa visual & gaming',
            category: 'vga',
        },
        {
            key: 'storage',
            title: 'Penyimpanan (Storage SSD)',
            subtitle: 'Kecepatan boot & loading game',
            category: 'storage',
        },
        {
            key: 'psu',
            title: 'Power Supply (PSU)',
            subtitle: 'Suplai daya watt stabil',
            category: 'psu',
        },
        {
            key: 'casing',
            title: 'Casing PC',
            subtitle: 'Airflow & pelindung hardware',
            category: 'casing',
        },
    ];

    // Total Price Calculation
    const totalPrice = useMemo(() => {
        return Object.values(build).reduce((sum, item) => {
            return sum + (item ? item.price : 0);
        }, 0);
    }, [build]);

    // Estimated TDP / Power Consumption Calculation
    const powerMetrics = useMemo(() => {
        const powerComponents = [
            build.cpu,
            build.motherboard,
            build.ram,
            build.vga,
            build.storage,
        ].filter(Boolean);
        const hasCompletePowerData = powerComponents.every(
            (item) => typeof item.powerDraw === 'number'
        );
        const cpuPower = build.cpu?.powerDraw ?? 0;
        const gpuPower = build.vga?.powerDraw ?? 0;
        const systemPowerComponents = [build.motherboard, build.ram, build.storage].filter(Boolean);
        const hasCompleteSystemPowerData = systemPowerComponents.every(
            (item) => typeof item.powerDraw === 'number'
        );
        const systemBase = systemPowerComponents.reduce(
            (sum, item) => sum + (item.powerDraw ?? 0),
            0
        );
        const systemPowerDisplay =
            systemPowerComponents.length === 0
                ? '—'
                : hasCompleteSystemPowerData
                  ? `${systemBase} W`
                  : 'Data belum lengkap';
        const totalTdp = cpuPower + gpuPower + systemBase;
        const isEstimateAvailable = powerComponents.length > 0 && hasCompletePowerData;
        const recommendedPsu =
            isEstimateAvailable && totalTdp > 0 ? Math.ceil((totalTdp * 1.3) / 50) * 50 : 0;
        let selectedPsuWatt = build.psu?.psuCapacity || 0;

        return {
            totalTdp,
            recommendedPsu,
            selectedPsuWatt,
            cpuPower,
            gpuPower,
            systemBase,
            systemPowerDisplay,
            isEstimateAvailable,
        };
    }, [build]);

    // Compatibility Checks
    const compatibilityResults = useMemo(() => {
        const issues = [];
        const successes = [];
        const unknowns = [];

        // 1. CPU vs Motherboard Socket
        if (build.cpu && build.motherboard) {
            if (!build.cpu.cpuSocket || !build.motherboard.cpuSocket) {
                unknowns.push({
                    title: 'Socket CPU & Motherboard Belum Dapat Diperiksa',
                    detail: 'Informasi socket tidak tersedia untuk salah satu komponen.',
                });
            } else if (build.cpu.cpuSocket === build.motherboard.cpuSocket) {
                successes.push({
                    title: 'Socket CPU & Motherboard Kompatibel',
                    detail: `Keduanya menggunakan socket ${build.cpu.cpuSocket}.`,
                });
            } else {
                issues.push({
                    type: 'error',
                    title: 'Ketidakcocokan Socket Processor',
                    detail: `Processor (${build.cpu.cpuSocket}) tidak cocok dengan Motherboard (${build.motherboard.cpuSocket}).`,
                });
            }
        }

        // 2. RAM vs Motherboard Form Factor
        if (build.motherboard && build.ram) {
            const mbFormat = build.motherboard.ramFormFactor || '';
            const ramFormat = build.ram.ramFormFactor || '';
            if (!mbFormat || !ramFormat) {
                unknowns.push({
                    title: 'Tipe RAM Belum Dapat Diperiksa',
                    detail: 'Informasi tipe memori tidak tersedia untuk salah satu komponen.',
                });
            } else if (mbFormat.includes(ramFormat.replace(' DIMM', ''))) {
                successes.push({
                    title: 'Tipe Memori RAM Kompatibel',
                    detail: `Format memori ${ramFormat} cocok dengan slot Motherboard.`,
                });
            } else {
                issues.push({
                    type: 'error',
                    title: 'Ketidakcocokan Tipe RAM',
                    detail: `Motherboard mendukung ${mbFormat}, namun RAM yang dipilih adalah ${ramFormat}.`,
                });
            }
        }

        // 3. PSU Capacity vs Estimated TDP
        if (build.psu) {
            if (typeof build.psu.psuCapacity !== 'number' || !powerMetrics.isEstimateAvailable) {
                unknowns.push({
                    title: 'Kapasitas PSU Belum Dapat Diperiksa',
                    detail: 'Data kapasitas PSU atau estimasi daya komponen belum lengkap.',
                });
            } else if (build.psu.psuCapacity < powerMetrics.totalTdp) {
                issues.push({
                    type: 'error',
                    title: 'Kapasitas PSU Terlalu Rendah',
                    detail: `Daya PSU (${build.psu.psuCapacity}W) lebih kecil dari total konsumsi komponen (${powerMetrics.totalTdp}W).`,
                });
            } else if (build.psu.psuCapacity < powerMetrics.recommendedPsu) {
                issues.push({
                    type: 'warning',
                    title: 'Kapasitas PSU Mendekati Batas',
                    detail: `PSU ${build.psu.psuCapacity}W mencukupi, namun disarankan ${powerMetrics.recommendedPsu}W untuk keamanan jangka panjang.`,
                });
            } else {
                successes.push({
                    title: 'Kapasitas Daya PSU Memadai',
                    detail: `PSU ${build.psu.psuCapacity}W mencukupi kebutuhan ${powerMetrics.totalTdp}W dengan aman.`,
                });
            }
        }

        const hasErrors = issues.some((i) => i.type === 'error');
        const hasWarnings = issues.some((i) => i.type === 'warning');
        const hasCompleteBasicBuild = Boolean(
            build.cpu &&
                build.motherboard &&
                build.ram &&
                build.psu &&
                powerMetrics.isEstimateAvailable
        );

        return {
            issues,
            successes,
            unknowns,
            hasErrors,
            hasWarnings,
            isAllClear:
                hasCompleteBasicBuild &&
                !hasErrors &&
                !hasWarnings &&
                unknowns.length === 0,
        };
    }, [build, powerMetrics]);

    // Selected components count
    const selectedCount = Object.values(build).filter(Boolean).length;
    const progressPercent = Math.round((selectedCount / slots.length) * 100);

    // Handlers
    const handleOpenPicker = (slotKey, category) => {
        const slot = slots.find((s) => s.key === slotKey);
        setActivePicker({
            slotKey,
            category,
            title: slot ? slot.title : 'Komponen',
        });
    };

    const handleSelectProduct = (product) => {
        if (!activePicker) return;
        setBuild((prev) => ({
            ...prev,
            [activePicker.slotKey]: product,
        }));
    };

    const handleRemoveProduct = (slotKey) => {
        setBuild((prev) => ({
            ...prev,
            [slotKey]: null,
        }));
    };

    const handleResetBuild = () => {
        if (window.confirm('Apakah Anda yakin ingin mengatur ulang seluruh rakitan PC?')) {
            setBuild({
                cpu: null,
                motherboard: null,
                ram: null,
                vga: null,
                storage: null,
                psu: null,
                casing: null,
            });
            if (onShowToast) onShowToast('Seluruh slot rakitan telah diatur ulang.');
        }
    };

    const handleAddBuildToCart = () => {
        const selectedItems = Object.values(build).filter(Boolean);
        if (selectedItems.length === 0) {
            alert('Silakan pilih minimal 1 komponen sebelum menambahkannya ke keranjang.');
            return;
        }

        if (selectedItems.some((item) => item.inStock === false)) {
            if (onShowToast) {
                onShowToast('Rakitan memuat komponen yang stoknya habis. Ganti komponen tersebut sebelum melanjutkan.');
            } else {
                alert('Rakitan memuat komponen yang stoknya habis. Ganti komponen tersebut sebelum melanjutkan.');
            }
            return;
        }

        if (compatibilityResults.hasErrors) {
            const proceed = window.confirm(
                'Terdapat ketidakcocokan komponen pada rakitan ini. Apakah Anda tetap ingin memasukkannya ke keranjang belanja?'
            );
            if (!proceed) return;
        }

        if (onAddMultipleToCart) {
            onAddMultipleToCart(selectedItems);
        }
        if (onOpenCart) {
            onOpenCart();
        }
    };

    const handleShareBuild = () => {
        const lines = [
            '=== SPESIFIKASI RAKIT PC (PC STORE) ===',
            ...slots.map((s) => {
                const item = build[s.key];
                return `${s.title}: ${item ? `${item.name} (${formatRupiah(item.price)})` : 'Belum dipilih'}`;
            }),
            '----------------------------------------',
            `Estimasi Konsumsi Daya: ${powerMetrics.totalTdp} Watt (Rekomendasi PSU: ${powerMetrics.recommendedPsu}W)`,
            `Total Biaya: ${formatRupiah(totalPrice)}`,
            'Simulasi online di PC Store: https://pcstore.co.id/pc-builder',
        ];

        const text = lines.join('\n');
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
            if (onShowToast) {
                onShowToast('Ringkasan rakitan berhasil disalin ke clipboard!');
            } else {
                alert('Ringkasan rakitan berhasil disalin ke clipboard.');
            }
        }
    };

    // Quick presets
    const handleApplyPreset = (presetType) => {
        if (presetType === 'am5-gaming') {
            setBuild({
                cpu: productsData.find((p) => p.id === 'cpu-4') || null, // Ryzen 7 7800X3D
                motherboard: productsData.find((p) => p.id === 'mb-1') || null, // MSI B650 Tomahawk
                ram: productsData.find((p) => p.id === 'ram-1') || null, // Corsair 32GB DDR5
                vga: productsData.find((p) => p.id === 'vga-1') || null, // RTX 4070 SUPER
                storage: productsData.find((p) => p.id === 'ssd-1') || null, // 990 PRO 2TB
                psu: productsData.find((p) => p.id === 'psu-1') || null, // RM850e 850W
                casing: productsData.find((p) => p.id === 'casing-1') || null, // H5 Flow
            });
            if (onShowToast) onShowToast('Preset Rakitan "AM5 Esports Gaming" berhasil dimuat!');
        } else if (presetType === 'intel-value') {
            setBuild({
                cpu: productsData.find((p) => p.id === 'cpu-3') || null, // i5-14600K
                motherboard: productsData.find((p) => p.id === 'mb-2') || null, // B760M AORUS
                ram: productsData.find((p) => p.id === 'ram-2') || null, // FURY Beast DDR5
                vga: productsData.find((p) => p.id === 'vga-2') || null, // RTX 4060 Ti
                storage: productsData.find((p) => p.id === 'ssd-2') || null, // KC3000 1TB
                psu: productsData.find((p) => p.id === 'psu-2') || null, // A750GL 750W
                casing: productsData.find((p) => p.id === 'casing-2') || null, // 4000D Airflow
            });
            if (onShowToast) onShowToast('Preset Rakitan "Intel Gen 14 Balance" berhasil dimuat!');
        }
    };

    return (
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full space-y-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[var(--border)] gap-4">
                <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[var(--brand-50)] text-[var(--brand-700)] border border-[var(--brand-100)] text-xs font-semibold">
                        <WrenchIcon className="w-3.5 h-3.5 text-[var(--brand-600)]" />
                        <span>Simulasi Interaktif v1.2</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
                        Simulator Rakit PC (PC Builder)
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)]">
                        Pilih komponen hardware impian Anda. Sistem kami secara otomatis mengkalkulasi estimasi konsumsi daya (TDP), total harga, dan mengecek kompatibilitas socket & memori.
                    </p>
                </div>

                {/* Header CTA Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                    <button
                        type="button"
                        onClick={handleShareBuild}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-muted)] transition-colors shadow-2xs"
                        title="Salin rincian rakitan"
                    >
                        <ShareIcon className="w-4 h-4 text-[var(--brand-600)]" />
                        <span>Bagikan Rakitan</span>
                    </button>

                    <button
                        type="button"
                        onClick={handleResetBuild}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] text-xs font-semibold text-[var(--danger)] hover:bg-[var(--danger-bg)] transition-colors shadow-2xs"
                        title="Atur ulang seluruh slot"
                    >
                        <RotateCcwIcon className="w-3.5 h-3.5" />
                        <span>Reset</span>
                    </button>
                </div>
            </div>

            {/* Quick Presets Bar */}
            <div className="p-4 rounded-[var(--radius-lg)] bg-[var(--surface-muted)] border border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-[var(--text-primary)]">Inspirasi Rakitan Siap Pakai:</span>
                    <span className="text-[var(--text-muted)] hidden lg:inline">Pilih preset untuk memuat komponen otomatis</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <button
                        type="button"
                        onClick={() => handleApplyPreset('am5-gaming')}
                        className="px-3 py-1.5 rounded-[var(--radius-sm)] bg-[var(--surface)] text-[var(--text-primary)] hover:border-[var(--brand-500)] border border-[var(--border)] font-semibold transition-colors"
                    >
                        🔥 AMD AM5 Top Gaming
                    </button>
                    <button
                        type="button"
                        onClick={() => handleApplyPreset('intel-value')}
                        className="px-3 py-1.5 rounded-[var(--radius-sm)] bg-[var(--surface)] text-[var(--text-primary)] hover:border-[var(--brand-500)] border border-[var(--border)] font-semibold transition-colors"
                    >
                        ⚡ Intel Core Gen 14 Balance
                    </button>
                </div>
            </div>

            {/* Main Grid: Slots (Left 7 cols) & Summary (Right 5 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Component Slots (7 cols) */}
                <div className="lg:col-span-7 space-y-4">
                    {/* Progress Header */}
                    <div className="flex items-center justify-between pb-1 text-xs">
                        <span className="font-semibold text-[var(--text-primary)]">
                            Progres Komponen Terpilih: {selectedCount} dari {slots.length} ({progressPercent}%)
                        </span>
                        <span className="text-[var(--text-muted)]">
                            {slots.length - selectedCount} slot tersisa
                        </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-[var(--surface-muted)] rounded-full h-2 overflow-hidden border border-[var(--border)]">
                        <div
                            className="bg-[var(--brand-600)] h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>

                    {/* Slots List */}
                    <div className="space-y-3 pt-2">
                        {slots.map((slot) => (
                            <ComponentSlot
                                key={slot.key}
                                slotKey={slot.key}
                                title={slot.title}
                                subtitle={slot.subtitle}
                                category={slot.category}
                                selectedProduct={build[slot.key]}
                                onOpenPicker={handleOpenPicker}
                                onRemoveProduct={handleRemoveProduct}
                            />
                        ))}
                    </div>
                </div>

                {/* Right Column: Build Summary, Wattage Calculator & Compatibility (5 cols) */}
                <div className="lg:col-span-5 space-y-6 sticky top-24">
                    {/* 1. Compatibility Notice Box */}
                    <div
                        className={`p-5 rounded-[var(--radius-xl)] border shadow-[var(--shadow-card)] space-y-3 ${
                            compatibilityResults.hasErrors
                                ? 'bg-[var(--danger-bg)]/40 border-[var(--danger)] text-[var(--danger)]'
                                : compatibilityResults.hasWarnings
                                ? 'bg-[var(--warning-bg)]/40 border-[var(--warning)] text-[var(--warning)]'
                                : compatibilityResults.isAllClear
                                ? 'bg-[var(--success-bg)]/40 border-[var(--success)] text-[var(--success)]'
                                : 'bg-[var(--surface)] border-[var(--border)]'
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            {compatibilityResults.hasErrors ? (
                                <span className="text-base font-bold text-[var(--danger)]">
                                    ⚠️ Peringatan Kompatibilitas
                                </span>
                            ) : compatibilityResults.hasWarnings ? (
                                <span className="text-base font-bold text-[var(--warning)]">
                                    ⚠️ Perhatian Konfigurasi
                                </span>
                            ) : compatibilityResults.isAllClear ? (
                                <div className="flex items-center gap-1.5">
                                    <CheckCircleIcon className="w-5 h-5 text-[var(--success)]" />
                                    <span className="text-base font-bold text-[var(--success)]">
                                        Pemeriksaan Dasar Lolos
                                    </span>
                                </div>
                            ) : (
                                <span className="text-base font-bold text-[var(--text-primary)]">
                                    Pemeriksaan Kompatibilitas
                                </span>
                            )}
                        </div>

                        {/* Issue list */}
                        {compatibilityResults.issues.length > 0 && (
                            <div className="space-y-2 text-xs">
                                {compatibilityResults.issues.map((issue, idx) => (
                                    <div
                                        key={idx}
                                        className="p-2.5 rounded-[var(--radius-sm)] bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] space-y-0.5"
                                    >
                                        <span className="font-bold block text-[var(--danger)]">
                                            {issue.title}
                                        </span>
                                        <p className="text-[var(--text-secondary)]">{issue.detail}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Success list */}
                        {compatibilityResults.successes.length > 0 && (
                            <div className="space-y-1.5 text-xs text-[var(--text-secondary)]">
                                {compatibilityResults.successes.map((s, idx) => (
                                    <div key={idx} className="flex items-start gap-1.5">
                                        <CheckCircleIcon className="w-4 h-4 text-[var(--success)] shrink-0 mt-0.5" />
                                        <span>
                                            <strong className="text-[var(--text-primary)]">{s.title}:</strong>{' '}
                                            {s.detail}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {compatibilityResults.unknowns.map((unknown, idx) => (
                            <div
                                key={idx}
                                className="p-2.5 rounded-[var(--radius-sm)] bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--text-secondary)]"
                            >
                                <strong className="block text-[var(--text-primary)]">{unknown.title}</strong>
                                <span>{unknown.detail}</span>
                            </div>
                        ))}

                        {!compatibilityResults.isAllClear && (
                            <p className="text-xs text-[var(--text-muted)]">
                                Pemeriksaan dasar mencakup socket CPU, tipe RAM, dan estimasi kapasitas PSU. Pilih CPU, motherboard, RAM, dan PSU untuk melengkapinya; kecocokan fisik casing dan komponen lain tetap perlu diperiksa pada spesifikasi produk.
                            </p>
                        )}
                    </div>

                    {/* 2. TDP Power Consumption Calculator */}
                    <div className="p-5 rounded-[var(--radius-xl)] bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-card)] space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <ZapIcon className="w-4 h-4 text-amber-500" />
                                <h3 className="font-bold text-sm text-[var(--text-primary)]">
                                    Kalkulator Konsumsi Daya (TDP)
                                </h3>
                            </div>
                            <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                                {powerMetrics.isEstimateAvailable ? `~${powerMetrics.totalTdp} Watt` : 'Data belum lengkap'}
                            </span>
                        </div>

                        {/* Power Breakdown */}
                        <div className="space-y-2 text-xs">
                            <div className="flex justify-between text-[var(--text-secondary)]">
                                <span>Processor (CPU)</span>
                                <span className="font-medium text-[var(--text-primary)]">
                                    {build.cpu?.powerDraw === undefined ? '—' : `${powerMetrics.cpuPower} W`}
                                </span>
                            </div>
                            <div className="flex justify-between text-[var(--text-secondary)]">
                                <span>Kartu Grafis (GPU)</span>
                                <span className="font-medium text-[var(--text-primary)]">
                                    {build.vga?.powerDraw === undefined ? '—' : `${powerMetrics.gpuPower} W`}
                                </span>
                            </div>
                            <div className="flex justify-between text-[var(--text-secondary)]">
                                <span>Motherboard & Komponen Lain</span>
                                <span className="font-medium text-[var(--text-primary)]">
                                    {powerMetrics.systemPowerDisplay}
                                </span>
                            </div>
                            <div className="pt-2 border-t border-[var(--border)] flex justify-between font-semibold text-[var(--text-primary)]">
                                <span>Rekomendasi Daya PSU:</span>
                                <span className="text-[var(--brand-600)]">
                                    {powerMetrics.recommendedPsu
                                        ? `Minimal ${powerMetrics.recommendedPsu} Watt`
                                        : 'Belum dapat dihitung'}
                                </span>
                            </div>
                            <p className="text-[11px] text-[var(--text-muted)]">
                                Estimasi memakai data daya komponen terpilih, bukan pengukuran aktual; GPU yang belum dipilih tidak ikut dihitung. Ikuti juga rekomendasi PSU dari produsen.
                            </p>
                        </div>

                        {/* PSU Gauge */}
                        {build.psu && (
                            <div className="p-3 rounded-[var(--radius-md)] bg-[var(--surface-muted)] border border-[var(--border)] text-xs space-y-1.5">
                                <div className="flex justify-between items-center font-medium">
                                    <span>PSU Terpilih: {build.psu.psuCapacity}W</span>
                                    <span
                                        className={
                                            !powerMetrics.isEstimateAvailable
                                                ? 'text-[var(--text-muted)] font-bold'
                                                : build.psu.psuCapacity >= powerMetrics.recommendedPsu
                                                ? 'text-[var(--success)] font-bold'
                                                : 'text-[var(--danger)] font-bold'
                                        }
                                    >
                                        {powerMetrics.isEstimateAvailable && build.psu.psuCapacity
                                            ? `${Math.round((powerMetrics.totalTdp / build.psu.psuCapacity) * 100)}% Beban`
                                            : 'Belum dapat dihitung'}
                                    </span>
                                </div>
                                <div className="w-full bg-[var(--border)] rounded-full h-1.5 overflow-hidden">
                                    <div
                                        className={`h-1.5 rounded-full ${
                                            !powerMetrics.isEstimateAvailable
                                                ? 'bg-[var(--border)]'
                                                : build.psu.psuCapacity >= powerMetrics.recommendedPsu
                                                ? 'bg-[var(--success)]'
                                                : 'bg-[var(--danger)]'
                                        }`}
                                        style={{
                                            width: powerMetrics.isEstimateAvailable && build.psu.psuCapacity
                                                ? `${Math.min(100, (powerMetrics.totalTdp / build.psu.psuCapacity) * 100)}%`
                                                : '0%',
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 3. Build Cost & Checkout Box */}
                    <div className="p-5 rounded-[var(--radius-xl)] bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-card)] space-y-4">
                        <div className="space-y-1">
                            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] block">
                                Ringkasan Biaya Rakitan
                            </span>
                            <div className="text-3xl font-extrabold text-[var(--brand-600)]">
                                {formatRupiah(totalPrice)}
                            </div>
                            <span className="text-xs text-[var(--text-secondary)] block">
                                {selectedCount} komponen siap dirakit & dites
                            </span>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-[var(--border)]">
                            <button
                                type="button"
                                onClick={handleAddBuildToCart}
                                disabled={selectedCount === 0}
                                className="w-full py-3 px-4 rounded-[var(--radius-md)] bg-[var(--brand-600)] hover:bg-[var(--brand-700)] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)]"
                            >
                                <CartIcon className="w-4 h-4" />
                                <span>Tambah Seluruh Rakitan ke Keranjang</span>
                            </button>

                            <button
                                type="button"
                                onClick={handleShareBuild}
                                className="w-full py-2.5 px-4 rounded-[var(--radius-md)] bg-[var(--surface-muted)] hover:bg-[var(--border)] text-[var(--text-primary)] text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                            >
                                <ShareIcon className="w-3.5 h-3.5 text-[var(--brand-600)]" />
                                <span>Salin Ringkasan Komponen</span>
                            </button>
                        </div>

                        <div className="flex items-center justify-center gap-1.5 text-[11px] text-[var(--text-muted)] pt-1">
                            <ShieldCheckIcon className="w-3.5 h-3.5 text-[var(--success)]" />
                            <span>Bebas biaya perakitan profesional & cable management rapi</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Component Picker Modal */}
            <ComponentPickerModal
                isOpen={Boolean(activePicker)}
                onClose={() => setActivePicker(null)}
                slotTitle={activePicker?.title || ''}
                category={activePicker?.category || ''}
                products={productsData}
                selectedBuild={build}
                onSelectProduct={handleSelectProduct}
            />
        </div>
    );
}
