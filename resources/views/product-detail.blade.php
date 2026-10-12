@extends('layouts.app')

@section('content')
@php
    $product = $product ?? [
        'id' => 'cpu-1',
        'name' => 'Intel Core i9-14900K 24-Core Up to 6.0GHz Box',
        'categoryName' => 'Processor',
        'brand' => 'Intel',
        'price' => 9850000,
        'originalPrice' => 10500000,
        'stock' => 'Tersedia',
        'inStock' => true,
        'cpuSocket' => 'LGA1700',
        'tdp' => '125W - 253W',
        'chipset' => 'Intel Z790, B760',
        'warranty' => '3 Tahun Garansi Resmi Distributor',
        'description' => 'Processor flagship desktop generasi ke-14 Raptor Lake Refresh dari Intel dengan arsitektur hybrid revolusioner (8 P-Core + 16 E-Core). Mampu mencapai kecepatan thermal boost hingga 6.0 GHz.',
        'technicalSpecs' => [
            'CPU Socket' => 'LGA1700',
            'TDP / Daya' => '125 Watt (Base) / 253 Watt (Turbo)',
            'Chipset Kompatibel' => 'Intel Seri 600 & 700 (Z790, B760)',
            'Garansi Resmi' => '3 Tahun Garansi Resmi Distributor',
            'Jumlah Core' => '24 Core (8P + 16E)',
            'Jumlah Thread' => '32 Thread',
            'Max Turbo Frequency' => 'Hingga 6.0 GHz',
            'Intel Smart Cache' => '36 MB L3 Cache',
        ]
    ];

    $formattedPrice = 'Rp' . number_format($product['price'], 0, ',', '.');
    $formattedOriginalPrice = !empty($product['originalPrice']) ? 'Rp' . number_format($product['originalPrice'], 0, ',', '.') : null;
@endphp

<div class="space-y-8">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
        <a href="/" class="hover:text-[var(--text-primary)]">Beranda</a>
        <span>/</span>
        <a href="/katalog" class="hover:text-[var(--text-primary)]">Katalog</a>
        <span>/</span>
        <span class="text-[var(--text-primary)] font-semibold">{{ $product['name'] }}</span>
    </nav>

    <!-- Main Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Visual Gallery (5 Cols) -->
        <div class="lg:col-span-5 space-y-4">
            <div class="w-full aspect-square rounded-[var(--radius-xl)] bg-[var(--surface-muted)] border border-[var(--border)] flex items-center justify-center p-8 relative">
                <span class="absolute top-4 left-4 text-xs font-medium px-3 py-1 rounded-full bg-[var(--success-bg)] text-[var(--success)]">
                    {{ $product['stock'] }}
                </span>
                <svg class="w-24 h-24 text-[var(--brand-600)]/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <rect width="16" height="16" x="4" y="4" rx="2" /><rect width="6" height="6" x="9" y="9" rx="1" />
                    <path d="M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2" />
                </svg>
            </div>
        </div>

        <!-- Details (7 Cols) -->
        <div class="lg:col-span-7 space-y-6">
            <div>
                <span class="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--brand-50)] text-[var(--brand-700)] border border-[var(--brand-100)]">
                    {{ $product['brand'] }}
                </span>
                <h1 class="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] mt-2">
                    {{ $product['name'] }}
                </h1>
            </div>

            <!-- Price -->
            <div class="p-5 rounded-[var(--radius-xl)] bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-card)]">
                <span class="text-3xl font-extrabold text-[var(--brand-600)]">{{ $formattedPrice }}</span>
                @if ($formattedOriginalPrice)
                    <span class="text-sm text-[var(--text-muted)] line-through ml-3">{{ $formattedOriginalPrice }}</span>
                @endif
            </div>

            <!-- Spec Highlights -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div class="p-3 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)]">
                    <span class="text-[10px] text-[var(--text-muted)] block uppercase">CPU Socket</span>
                    <span class="font-bold text-[var(--text-primary)]">{{ $product['cpuSocket'] }}</span>
                </div>
                <div class="p-3 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)]">
                    <span class="text-[10px] text-[var(--text-muted)] block uppercase">TDP / Daya</span>
                    <span class="font-bold text-[var(--text-primary)]">{{ $product['tdp'] }}</span>
                </div>
                <div class="p-3 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)]">
                    <span class="text-[10px] text-[var(--text-muted)] block uppercase">Chipset</span>
                    <span class="font-bold text-[var(--text-primary)]">{{ $product['chipset'] }}</span>
                </div>
                <div class="p-3 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)]">
                    <span class="text-[10px] text-[var(--text-muted)] block uppercase">Garansi</span>
                    <span class="font-bold text-[var(--text-primary)] truncate block">{{ $product['warranty'] }}</span>
                </div>
            </div>

            <!-- CTAs -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button type="button" class="py-3 px-6 rounded-[var(--radius-md)] bg-[var(--brand-600)] text-white text-sm font-bold hover:bg-[var(--brand-700)] transition-colors">
                    + Tambah ke Keranjang
                </button>
                <a href="#pc-builder" class="py-3 px-6 rounded-[var(--radius-md)] bg-[var(--brand-50)] text-[var(--brand-700)] border border-[var(--brand-100)] text-sm font-bold hover:bg-[var(--brand-100)] transition-colors text-center">
                    Simulasi di PC Builder
                </a>
            </div>
        </div>
    </div>
</div>
@endsection
