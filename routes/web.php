<?php

use Illuminate\Support\Facades\Route;

Route::view('/', 'app', ['initialView' => 'beranda'])->name('home');
Route::view('/katalog', 'app', ['initialView' => 'katalog'])->name('catalog');
Route::view('/pc-builder', 'app', ['initialView' => 'pc-builder'])->name('pc-builder');
