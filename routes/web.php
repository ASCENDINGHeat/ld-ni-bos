<?php

use Illuminate\Support\Facades\Route;

Route::view('/', 'app', ['initialView' => 'beranda'])->name('home');
Route::view('/katalog', 'app', ['initialView' => 'katalog'])->name('catalog');
Route::view('/pc-builder', 'app', ['initialView' => 'pc-builder'])->name('pc-builder');
Route::view('/keranjang', 'app', ['initialView' => 'cart'])->name('cart.index');
Route::view('/checkout', 'app', ['initialView' => 'checkout'])->name('checkout.index');
Route::view('/akun', 'app', ['initialView' => 'account'])->name('account.settings');
Route::view('/vendor/dashboard', 'app', [
    'initialView' => 'vendor-dashboard',
    'vendorSection' => 'overview',
])->name('vendor.dashboard');
Route::view('/vendor/products', 'app', [
    'initialView' => 'vendor-dashboard',
    'vendorSection' => 'products',
])->name('vendor.products');
Route::view('/vendor/orders', 'app', [
    'initialView' => 'vendor-dashboard',
    'vendorSection' => 'orders',
])->name('vendor.orders');
Route::view('/vendor/reports', 'app', [
    'initialView' => 'vendor-dashboard',
    'vendorSection' => 'reports',
])->name('vendor.reports');
Route::view('/vendor/settings', 'app', [
    'initialView' => 'vendor-dashboard',
    'vendorSection' => 'settings',
])->name('vendor.settings');
Route::get('/produk/{slug}', fn (string $slug) => view('app', [
    'initialView' => 'detail',
    'productSlug' => $slug,
]))
    ->where('slug', '[a-z0-9-]+')
    ->name('products.show');
