import React from 'react';
import {
    CpuIcon,
    ShieldCheckIcon,
    PhoneIcon,
    MailIcon,
    MapPinIcon,
    ArrowRightIcon,
} from './Icons';

export default function Footer() {
    return (
        <footer className="w-full bg-[var(--surface)] text-[var(--text-secondary)] border-t border-[var(--border)] mt-auto transition-colors">
            {/* Value Proposition Highlights */}
            <div className="border-b border-[var(--border)] bg-[var(--surface-muted)]">
                <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="flex items-start gap-3">
                            <div className="p-2.5 rounded-[var(--radius-md)] bg-[var(--brand-50)] text-[var(--brand-600)] border border-[var(--brand-100)] shrink-0">
                                <ShieldCheckIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                                    100% Produk Original
                                </h4>
                                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                                    Komponen resmi dari distributor dengan jaminan garansi.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="p-2.5 rounded-[var(--radius-md)] bg-[var(--brand-50)] text-[var(--brand-600)] border border-[var(--brand-100)] shrink-0">
                                <CpuIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                                    Simulasi PC Builder
                                </h4>
                                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                                    Cek kompatibilitas socket CPU, motherboard, daya PSU otomatis.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="p-2.5 rounded-[var(--radius-md)] bg-[var(--brand-50)] text-[var(--brand-600)] border border-[var(--brand-100)] shrink-0">
                                <PhoneIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                                    Konsultasi Gratis
                                </h4>
                                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                                    Diskusikan spesifikasi dan budget rakitan bersama tim teknisi.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="p-2.5 rounded-[var(--radius-md)] bg-[var(--brand-50)] text-[var(--brand-600)] border border-[var(--brand-100)] shrink-0">
                                <MapPinIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                                    Pengiriman Seluruh Nusantara
                                </h4>
                                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                                    Packing kayu berlapis, bubble wrap tebal, dan asuransi penuh.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer Links */}
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
                    {/* Brand Col */}
                    <div className="lg:col-span-2 space-y-4">
                        <a href="/" className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-[var(--radius-md)] bg-[var(--brand-600)] flex items-center justify-center text-white shadow-sm">
                                <CpuIcon className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-xl tracking-tight text-[var(--text-primary)]">
                                PC<span className="text-[var(--brand-600)]">STORE</span>
                            </span>
                        </a>
                        <p className="text-sm text-[var(--text-secondary)] max-w-sm leading-relaxed">
                            Destinasi utama pengadaan hardware komputer gaming, workstation kreator, dan solusi rakit PC kustom terpercaya dengan jaminan mutu terbaik.
                        </p>

                        <div className="pt-2 space-y-2 text-xs">
                            <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                                <PhoneIcon className="w-4 h-4 text-[var(--brand-600)] shrink-0" />
                                <span>WhatsApp CS: 0812-3456-7890 (Senin - Sabtu: 09:00 - 18:00 WIB)</span>
                            </div>
                            <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                                <MailIcon className="w-4 h-4 text-[var(--brand-600)] shrink-0" />
                                <span>Email Support: cs@pcstore.co.id</span>
                            </div>
                            <div className="flex items-start gap-2 text-[var(--text-secondary)]">
                                <MapPinIcon className="w-4 h-4 text-[var(--brand-600)] shrink-0 mt-0.5" />
                                <span>Jl. Komputer Raya No. 88, Gedung Tech Center Lt. 2, Jakarta Barat</span>
                            </div>
                        </div>
                    </div>

                    {/* Kategori Hardware */}
                    <div>
                        <h4 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-4">
                            Kategori Hardware
                        </h4>
                        <ul className="space-y-2.5 text-xs sm:text-sm">
                            <li>
                                <a href="#processor" className="hover:text-[var(--brand-600)] transition-colors">
                                    Processor Intel & AMD
                                </a>
                            </li>
                            <li>
                                <a href="#vga" className="hover:text-[var(--brand-600)] transition-colors">
                                    Kartu Grafis (VGA Card)
                                </a>
                            </li>
                            <li>
                                <a href="#motherboard" className="hover:text-[var(--brand-600)] transition-colors">
                                    Motherboard
                                </a>
                            </li>
                            <li>
                                <a href="#ram" className="hover:text-[var(--brand-600)] transition-colors">
                                    RAM DDR4 & DDR5
                                </a>
                            </li>
                            <li>
                                <a href="#storage" className="hover:text-[var(--brand-600)] transition-colors">
                                    Solid State Drive (SSD NVMe)
                                </a>
                            </li>
                            <li>
                                <a href="#psu" className="hover:text-[var(--brand-600)] transition-colors">
                                    Power Supply (PSU)
                                </a>
                            </li>
                            <li>
                                <a href="#casing" className="hover:text-[var(--brand-600)] transition-colors">
                                    Casing & Pendingin PC
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Layanan & Solusi */}
                    <div>
                        <h4 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-4">
                            Layanan & Fitur
                        </h4>
                        <ul className="space-y-2.5 text-xs sm:text-sm">
                            <li>
                                <a href="#pc-builder" className="hover:text-[var(--brand-600)] font-medium text-[var(--brand-600)] transition-colors flex items-center gap-1">
                                    <span>Simulasi PC Builder</span>
                                    <ArrowRightIcon className="w-3 h-3" />
                                </a>
                            </li>
                            <li>
                                <a href="#panduan-rakit" className="hover:text-[var(--brand-600)] transition-colors">
                                    Panduan Rakit Pemula
                                </a>
                            </li>
                            <li>
                                <a href="#cek-garansi" className="hover:text-[var(--brand-600)] transition-colors">
                                    Pengecekan Garansi Resmi
                                </a>
                            </li>
                            <li>
                                <a href="#tracking" className="hover:text-[var(--brand-600)] transition-colors">
                                    Lacak Status Pengiriman
                                </a>
                            </li>
                            <li>
                                <a href="#vendor" className="hover:text-[var(--brand-600)] transition-colors">
                                    Portal Mitra & Vendor
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Bantuan & Kebijakan */}
                    <div>
                        <h4 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-4">
                            Pusat Bantuan
                        </h4>
                        <ul className="space-y-2.5 text-xs sm:text-sm">
                            <li>
                                <a href="#cara-beli" className="hover:text-[var(--brand-600)] transition-colors">
                                    Cara Pembelian & Checkout
                                </a>
                            </li>
                            <li>
                                <a href="#metode-bayar" className="hover:text-[var(--brand-600)] transition-colors">
                                    Metode Pembayaran
                                </a>
                            </li>
                            <li>
                                <a href="#kebijakan-retur" className="hover:text-[var(--brand-600)] transition-colors">
                                    Ketentuan Retur & Tukar Baru
                                </a>
                            </li>
                            <li>
                                <a href="#faq" className="hover:text-[var(--brand-600)] transition-colors">
                                    Pertanyaan Umum (FAQ)
                                </a>
                            </li>
                            <li>
                                <a href="#kebijakan-privasi" className="hover:text-[var(--brand-600)] transition-colors">
                                    Kebijakan Privasi
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar: Copyright & Payment Badges */}
            <div className="border-t border-[var(--border)] bg-[var(--surface-muted)] py-6 text-xs text-[var(--text-muted)]">
                <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-center sm:text-left">
                        © 2026 PC Store. Hak Cipta Dilindungi. Seluruh merek dagang perangkat keras adalah milik masing-masing pemegang lisensi.
                    </p>

                    <div className="flex items-center gap-2">
                        <span className="font-medium text-[var(--text-secondary)]">Metode Pembayaran:</span>
                        <div className="flex items-center gap-1.5 font-mono text-[10px] font-semibold text-[var(--text-secondary)]">
                            <span className="px-1.5 py-0.5 rounded border border-[var(--border)] bg-[var(--surface)]">BCA</span>
                            <span className="px-1.5 py-0.5 rounded border border-[var(--border)] bg-[var(--surface)]">MANDIRI</span>
                            <span className="px-1.5 py-0.5 rounded border border-[var(--border)] bg-[var(--surface)]">BRI</span>
                            <span className="px-1.5 py-0.5 rounded border border-[var(--border)] bg-[var(--surface)]">QRIS</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
