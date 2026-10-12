@props([
    'product',
])

@php
    $id = $product['id'] ?? '';
    $name = $product['name'] ?? '';
    $category = $product['category'] ?? '';
    $categoryName = $product['categoryName'] ?? ucfirst($category);
    $brand = $product['brand'] ?? '';
    $price = $product['price'] ?? 0;
    $originalPrice = $product['originalPrice'] ?? null;
    $stock = $product['stock'] ?? 'Tersedia';
    $inStock = $product['inStock'] ?? true;
    $cpuSocket = $product['cpuSocket'] ?? null;
    $ramFormFactor = $product['ramFormFactor'] ?? null;
    $specs = $product['specs'] ?? [];
    $badge = $product['badge'] ?? null;
    $image = $product['image'] ?? null;

    $isOutOfStock = !$inStock || strtolower($stock) === 'habis';
    $formattedPrice = 'Rp' . number_format($price, 0, ',', '.');
    $formattedOriginalPrice = $originalPrice ? 'Rp' . number_format($originalPrice, 0, ',', '.') : null;
    $discount = ($originalPrice && $originalPrice > $price) ? round((($originalPrice - $price) / $originalPrice) * 100) : null;
@endphp

<div class="group rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] transition-all duration-200 flex flex-col p-4 relative {{ $isOutOfStock ? 'opacity-85' : 'hover:border-[var(--brand-500)] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)]' }}">
    <!-- Top Badges & Wishlist -->
    <div class="flex items-center justify-between gap-2 mb-3 min-h-[26px]">
        <div class="flex flex-wrap items-center gap-1.5">
            <span class="text-[11px] font-medium px-2 py-0.5 rounded-full {{ $isOutOfStock ? 'bg-[var(--danger-bg)] text-[var(--danger)]' : ($stock === 'Stok Terbatas' ? 'bg-[var(--warning-bg)] text-[var(--warning)]' : 'bg-[var(--success-bg)] text-[var(--success)]') }}">
                {{ $isOutOfStock ? 'Stok Habis' : $stock }}
            </span>
            @if ($badge && !$isOutOfStock)
                <span class="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-[var(--radius-sm)] bg-[var(--brand-50)] text-[var(--brand-700)] border border-[var(--brand-100)]">
                    {{ $badge }}
                </span>
            @endif
        </div>

        <button type="button" class="p-1.5 rounded-full text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--surface-muted)] transition-colors" aria-label="Simpan ke wishlist">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
        </button>
    </div>

    <!-- Product Visual (1:1 Ratio) -->
    <div class="w-full aspect-square rounded-[var(--radius-md)] bg-[var(--surface-muted)] border border-[var(--border)] flex items-center justify-center p-3 mb-3.5 overflow-hidden group-hover:scale-[1.01] transition-transform duration-200">
        @if ($image)
            <img src="{{ $image }}" alt="{{ $name }}" class="w-full h-full object-contain" loading="lazy">
        @else
            <div class="flex flex-col items-center justify-center gap-2">
                <svg class="w-12 h-12 text-[var(--brand-600)]/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <rect width="16" height="16" x="4" y="4" rx="2" />
                    <rect width="6" height="6" x="9" y="9" rx="1" />
                    <path d="M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2" />
                </svg>
                <span class="text-[10px] font-mono font-medium uppercase text-[var(--text-muted)] px-2 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)]">
                    {{ $brand }}
                </span>
            </div>
        @endif
    </div>

    <!-- Product Details -->
    <div class="flex-1 flex flex-col justify-between">
        <div>
            <div class="flex items-center justify-between text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-semibold mb-1">
                <span>{{ $categoryName }}</span>
                <span>{{ $brand }}</span>
            </div>

            <h3 class="text-sm font-semibold text-[var(--text-primary)] leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-[var(--brand-600)] transition-colors">
                {{ $name }}
            </h3>

            <div class="mt-2 space-y-1">
                <div class="flex flex-wrap gap-1 mb-1">
                    @if ($cpuSocket)
                        <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-[var(--surface-muted)] text-[var(--text-secondary)] border border-[var(--border)]">
                            Socket {{ $cpuSocket }}
                        </span>
                    @endif
                    @if ($ramFormFactor)
                        <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-[var(--surface-muted)] text-[var(--text-secondary)] border border-[var(--border)]">
                            {{ $ramFormFactor }}
                        </span>
                    @endif
                </div>

                @if (!empty($specs) && is_array($specs))
                    <p class="text-xs text-[var(--text-secondary)] line-clamp-2">
                        {{ implode(' • ', array_slice($specs, 0, 2)) }}
                    </p>
                @endif
            </div>
        </div>

        <!-- Price and CTA -->
        <div class="pt-3.5 mt-3.5 border-t border-[var(--border)] flex items-end justify-between gap-2">
            <div class="min-w-0">
                @if ($formattedOriginalPrice)
                    <div class="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)] line-through">
                        <span>{{ $formattedOriginalPrice }}</span>
                        @if ($discount)
                            <span class="text-[10px] font-bold text-[var(--danger)] bg-[var(--danger-bg)] px-1 py-0.2 rounded">
                                -{{ $discount }}%
                            </span>
                        @endif
                    </div>
                @endif
                <div class="text-base sm:text-lg font-bold text-[var(--brand-600)] leading-tight truncate">
                    {{ $formattedPrice }}
                </div>
            </div>

            <button
                type="button"
                {{ $isOutOfStock ? 'disabled' : '' }}
                class="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-[var(--radius-md)] text-xs font-semibold transition-all shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)] {{ $isOutOfStock ? 'bg-[var(--surface-muted)] text-[var(--text-muted)] border border-[var(--border)] cursor-not-allowed' : 'bg-[var(--brand-600)] hover:bg-[var(--brand-700)] text-white shadow-xs' }}"
            >
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                </svg>
                <span>{{ $isOutOfStock ? 'Habis' : '+ Keranjang' }}</span>
            </button>
        </div>
    </div>
</div>
