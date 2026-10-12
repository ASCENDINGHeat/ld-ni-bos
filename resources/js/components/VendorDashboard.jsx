import React, { useState } from 'react';
import {
    BoxIcon,
    CheckCircleIcon,
    CpuIcon,
    HardDriveIcon,
    MapPinIcon,
    ShieldCheckIcon,
    UserIcon,
} from './Icons';
import productsData from '../mocks/products.json';

const vendorSections = [
    { id: 'overview', label: 'Overview', icon: CpuIcon },
    { id: 'products', label: 'Kelola Produk', icon: BoxIcon },
    { id: 'orders', label: 'Pesanan Masuk', icon: CheckCircleIcon },
    { id: 'reports', label: 'Laporan Penjualan', icon: HardDriveIcon },
    { id: 'settings', label: 'Pengaturan Toko', icon: ShieldCheckIcon },
];

function MetricCard({ label, help }) {
    return (
        <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
            <p className="text-sm font-semibold text-[var(--text-secondary)]">{label}</p>
            <p className="mt-3 text-3xl font-extrabold text-[var(--text-primary)]">—</p>
            <p className="mt-2 text-xs leading-5 text-[var(--text-muted)]">{help}</p>
        </article>
    );
}

function EmptyPanel({ title, description }) {
    return (
        <div className="rounded-2xl border border-dashed border-[var(--border)] px-5 py-10 text-center">
            <p className="font-semibold text-[var(--text-primary)]">{title}</p>
            <p className="mx-auto mt-1 max-w-lg text-sm leading-6 text-[var(--text-secondary)]">{description}</p>
        </div>
    );
}

const productCategories = [
    { id: 'processor', label: 'Processor' },
    { id: 'vga', label: 'VGA Card' },
    { id: 'motherboard', label: 'Motherboard' },
    { id: 'ram', label: 'RAM' },
    { id: 'storage', label: 'Storage' },
    { id: 'power-supply', label: 'Power Supply' },
    { id: 'casing', label: 'Casing' },
    { id: 'cooling', label: 'Cooling' },
    { id: 'monitor', label: 'Monitor' },
];

function VendorProductForm({ onSubmit, onCancel }) {
    const [form, setForm] = useState({
        name: '',
        category: 'processor',
        price: '',
        stock: '',
        sku: '',
        description: '',
    });
    const [imageName, setImageName] = useState('');
    const [imageFile, setImageFile] = useState(null);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const category = productCategories.find((item) => item.id === form.category);

        onSubmit({
            ...form,
            id: `vendor-${Date.now()}`,
            price: Number(form.price),
            stock: Number(form.stock),
            categoryName: category.label,
            inStock: Number(form.stock) > 0,
            imageName,
            imageFile,
        });
    };

    const fieldClassName = 'mt-2 min-h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-3 text-base text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--brand-500)] focus:ring-2 focus:ring-[var(--brand-500)]/20 sm:text-sm';
    const labelClassName = 'block text-sm font-semibold text-[var(--text-primary)]';

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm sm:p-6"
        >
            <div className="mb-6">
                <h3 className="text-lg font-bold text-[var(--text-primary)]">Informasi produk</h3>
                <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                    Isi detail barang agar pelanggan mudah menemukan produk Anda.
                </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
                <label className={`${labelClassName} sm:col-span-2`}>
                    Nama produk <span className="text-rose-600">*</span>
                    <input
                        required
                        maxLength={120}
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Contoh: Processor Intel Core i5"
                        className={fieldClassName}
                    />
                </label>

                <label className={labelClassName}>
                    Kategori <span className="text-rose-600">*</span>
                    <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className={fieldClassName}
                    >
                        {productCategories.map((category) => (
                            <option key={category.id} value={category.id}>{category.label}</option>
                        ))}
                    </select>
                </label>

                <label className={labelClassName}>
                    SKU / Kode barang
                    <input
                        maxLength={40}
                        name="sku"
                        value={form.sku}
                        onChange={handleChange}
                        placeholder="Contoh: CPU-I5-001"
                        className={fieldClassName}
                    />
                </label>

                <label className={labelClassName}>
                    Harga jual (Rp) <span className="text-rose-600">*</span>
                    <input
                        required
                        min="1"
                        step="1"
                        type="number"
                        inputMode="numeric"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        placeholder="0"
                        className={fieldClassName}
                    />
                </label>

                <label className={labelClassName}>
                    Jumlah stok <span className="text-rose-600">*</span>
                    <input
                        required
                        min="0"
                        step="1"
                        type="number"
                        inputMode="numeric"
                        name="stock"
                        value={form.stock}
                        onChange={handleChange}
                        placeholder="0"
                        className={fieldClassName}
                    />
                </label>

                <label className={`${labelClassName} sm:col-span-2`}>
                    Deskripsi produk
                    <textarea
                        maxLength={1000}
                        rows="4"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Jelaskan kondisi, spesifikasi, dan garansi produk."
                        className={`${fieldClassName} min-h-28 resize-y`}
                    />
                </label>

                <label className={`${labelClassName} sm:col-span-2`}>
                    Foto produk
                    <span className="mt-2 flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-muted)] px-4 py-5 text-center transition hover:border-[var(--brand-500)]">
                        <span className="text-sm font-semibold text-[var(--text-primary)]">
                            {imageName || 'Pilih foto dari perangkat'}
                        </span>
                        <span className="mt-1 text-xs text-[var(--text-secondary)]">PNG, JPG atau WEBP</span>
                        <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            className="sr-only"
                            onChange={(event) => {
                                const file = event.target.files?.[0] || null;
                                setImageFile(file);
                                setImageName(file?.name || '');
                            }}
                        />
                    </span>
                </label>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 border-t border-[var(--border)] pt-5 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    onClick={onCancel}
                    className="min-h-12 rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-bold text-[var(--text-primary)] transition hover:bg-[var(--surface-muted)]"
                >
                    Batal
                </button>
                <button
                    type="submit"
                    className="min-h-12 rounded-xl bg-[var(--brand-600)] px-5 py-3 text-sm font-bold text-white transition hover:bg-[var(--brand-700)]"
                >
                    Tambahkan produk
                </button>
            </div>
        </form>
    );
}

function PerformancePanel() {
    return (
        <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h2 className="text-lg font-bold text-[var(--text-primary)]">Performa toko</h2>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">Ringkasan penjualan belum tersedia</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">Belum ada data</span>
            </div>
            <div className="mt-5 overflow-hidden rounded-xl bg-[var(--surface-muted)] p-3">
                <svg viewBox="0 0 640 190" role="img" aria-label="Grafik performa belum tersedia karena belum ada data penjualan" className="h-44 w-full">
                    {[35, 75, 115, 155].map((y) => (
                        <line key={y} x1="42" y1={y} x2="625" y2={y} stroke="currentColor" className="text-[var(--border)]" strokeDasharray="4 6" />
                    ))}
                    <line x1="42" y1="16" x2="42" y2="155" stroke="currentColor" className="text-[var(--border)]" />
                    <line x1="42" y1="155" x2="625" y2="155" stroke="currentColor" className="text-[var(--border)]" />
                    <text x="320" y="93" textAnchor="middle" fill="currentColor" className="text-sm font-medium text-[var(--text-muted)]">
                        Grafik akan muncul setelah data penjualan terhubung
                    </text>
                    <text x="42" y="178" fill="currentColor" className="text-[var(--text-muted)]" fontSize="11">Waktu</text>
                    <text x="8" y="25" fill="currentColor" className="text-[var(--text-muted)]" fontSize="11">Rp</text>
                </svg>
            </div>
        </article>
    );
}

function QuickStockPanel({ inventory, onToggleStock, onNavigateProducts }) {
    return (
        <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-lg font-bold text-[var(--text-primary)]">Kelola stok cepat</h2>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">Contoh katalog lokal; perubahan hanya pratinjau.</p>
                </div>
                {onNavigateProducts && (
                    <button type="button" onClick={onNavigateProducts} className="text-sm font-bold text-[var(--brand-700)] hover:underline">
                        Semua produk
                    </button>
                )}
            </div>
            <div className="divide-y divide-[var(--border)]">
                {inventory.map((product) => (
                    <div key={product.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                        <div className="min-w-0 flex-1">
                            <p className="line-clamp-1 text-sm font-semibold text-[var(--text-primary)]">{product.name}</p>
                            <p className="mt-1 text-xs text-[var(--text-muted)]">{product.categoryName}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                product.inStock ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                            }`}>
                                {product.inStock ? 'Tersedia' : 'Stok habis'}
                            </span>
                            <button
                                type="button"
                                onClick={() => onToggleStock(product.id)}
                                className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--surface-muted)]"
                                aria-label={`${product.inStock ? 'Tandai stok habis' : 'Tandai tersedia'}: ${product.name}`}
                            >
                                Ubah
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </article>
    );
}

export default function VendorDashboard({
    user,
    section = 'overview',
    onNavigateSection,
    onNavigateAccount,
    onNavigateToStorefront,
    onOpenAuth,
}) {
    const activeSection = vendorSections.some((item) => item.id === section) ? section : 'overview';
    const [showProductForm, setShowProductForm] = useState(false);
    const [productNotice, setProductNotice] = useState('');
    const [inventory, setInventory] = useState(() =>
        productsData
            .filter(
                (product, index, products) =>
                    products.findIndex((candidate) => candidate.category === product.category) === index
            )
            .slice(0, 5)
            .map((product) => ({ ...product }))
    );

    const handleToggleStock = (productId) => {
        setInventory((current) =>
            current.map((product) =>
                product.id === productId
                    ? {
                          ...product,
                          inStock: !product.inStock,
                          stock: product.inStock ? 0 : Math.max(Number(product.stock) || 1, 1),
                      }
                    : product
            )
        );
    };

    const handleAddProduct = (product) => {
        setInventory((current) => [product, ...current]);
        setShowProductForm(false);
        setProductNotice(`${product.name} berhasil ditambahkan ke pratinjau produk.`);
    };

    if (user?.role !== 'vendor') {
        return (
            <section className="mx-auto flex min-h-[65vh] w-full max-w-3xl items-center px-4 py-12">
                <div className="w-full rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-7 text-center shadow-sm sm:p-10">
                    <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--brand-50)] text-[var(--brand-700)]">
                        <ShieldCheckIcon className="h-7 w-7" />
                    </span>
                    <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-[var(--brand-700)]">Akses Vendor</p>
                    <h1 className="mt-2 text-2xl font-extrabold text-[var(--text-primary)]">
                        {user ? 'Akun Vendor diperlukan' : 'Masuk untuk membuka dashboard'}
                    </h1>
                    <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[var(--text-secondary)]">
                        {user
                            ? 'Akun ini terdaftar sebagai Customer. Gunakan akun Vendor terpisah untuk masuk ke ruang kerja penjual.'
                            : 'Dashboard vendor hanya tersedia untuk akun dengan peran Vendor. Masuk ke akun yang sudah terdaftar atau buat akun Vendor baru.'}
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                        {!user && (
                            <button
                                type="button"
                                onClick={() => onOpenAuth?.('login', 'vendor')}
                                className="rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-bold text-[var(--text-primary)] hover:bg-[var(--surface-muted)]"
                            >
                                Masuk sebagai Vendor
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => onOpenAuth?.('register', 'vendor')}
                            className="rounded-xl bg-[var(--brand-600)] px-5 py-3 text-sm font-bold text-white hover:bg-[var(--brand-700)]"
                        >
                            Daftar akun Vendor
                        </button>
                        <button
                            type="button"
                            onClick={onNavigateToStorefront}
                            className="rounded-xl px-5 py-3 text-sm font-bold text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]"
                        >
                            Kembali ke toko
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    const renderContent = () => {
        if (activeSection === 'products') {
            return (
                <div className="space-y-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h2 className="text-2xl font-extrabold text-[var(--text-primary)]">Kelola Produk</h2>
                            <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                                Tambah barang dan kelola ketersediaan produk toko Anda.
                            </p>
                        </div>
                        {!showProductForm && (
                            <button
                                type="button"
                                onClick={() => {
                                    setProductNotice('');
                                    setShowProductForm(true);
                                }}
                                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--brand-600)] px-5 py-3 text-sm font-bold text-white transition hover:bg-[var(--brand-700)] sm:w-auto"
                            >
                                <span aria-hidden="true" className="text-lg leading-none">+</span>
                                Tambah barang
                            </button>
                        )}
                    </div>
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                        Data produk dan stok hanya tersimpan sementara di halaman ini. Fitur simpan ke katalog belum terhubung ke server.
                    </div>
                    {productNotice && (
                        <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                            {productNotice}
                        </p>
                    )}
                    {showProductForm && (
                        <VendorProductForm
                            onSubmit={handleAddProduct}
                            onCancel={() => setShowProductForm(false)}
                        />
                    )}
                    <article className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
                        <div className="border-b border-[var(--border)] p-4 sm:p-5">
                            <h3 className="font-bold text-[var(--text-primary)]">Daftar barang</h3>
                            <p className="mt-1 text-sm text-[var(--text-secondary)]">{inventory.length} produk · pratinjau lokal</p>
                        </div>
                        <div className="divide-y divide-[var(--border)]">
                            {inventory.map((product) => (
                                <div key={product.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                                    <div className="min-w-0">
                                        <p className="break-words text-sm font-semibold text-[var(--text-primary)]">{product.name}</p>
                                        <p className="mt-1 text-xs text-[var(--text-muted)]">
                                            {product.categoryName}
                                            {product.sku ? ` · SKU ${product.sku}` : ''}
                                            {Number.isFinite(Number(product.price)) ? ` · Rp ${Number(product.price).toLocaleString('id-ID')}` : ''}
                                            {Number.isFinite(Number(product.stock)) ? ` · Stok ${product.stock}` : ''}
                                            {product.imageName ? ` · Foto ${product.imageName}` : ''}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between gap-3 sm:justify-end">
                                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                            product.inStock ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                                        }`}>
                                            {product.inStock ? 'Tersedia' : 'Stok habis'}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => handleToggleStock(product.id)}
                                            className="min-h-10 rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-bold text-[var(--text-primary)] transition hover:bg-[var(--surface-muted)]"
                                            aria-label={`${product.inStock ? 'Tandai stok habis' : 'Tandai tersedia'}: ${product.name}`}
                                        >
                                            Ubah stok
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </article>
                </div>
            );
        }

        if (activeSection === 'orders') {
            return (
                <div className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-extrabold text-[var(--text-primary)]">Pesanan Masuk</h2>
                        <p className="mt-1 text-sm text-[var(--text-secondary)]">Pantau dan tindak lanjuti pesanan pelanggan.</p>
                    </div>
                    <EmptyPanel
                        title="Belum ada pesanan untuk ditampilkan"
                        description="Daftar pesanan akan muncul di sini setelah layanan pesanan vendor tersedia."
                    />
                </div>
            );
        }

        if (activeSection === 'reports') {
            return (
                <div className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-extrabold text-[var(--text-primary)]">Laporan Penjualan</h2>
                        <p className="mt-1 text-sm text-[var(--text-secondary)]">Ringkasan performa berdasarkan data transaksi.</p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        <MetricCard label="Penjualan kotor" help="Belum ada sumber transaksi terhubung." />
                        <MetricCard label="Produk terjual" help="Akan dihitung dari pesanan yang diproses." />
                        <MetricCard label="Nilai pesanan rata-rata" help="Belum ada data untuk periode ini." />
                    </div>
                    <PerformancePanel />
                </div>
            );
        }

        if (activeSection === 'settings') {
            return (
                <div className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-extrabold text-[var(--text-primary)]">Pengaturan Toko</h2>
                        <p className="mt-1 text-sm text-[var(--text-secondary)]">Informasi toko, gudang, rekening, dan keamanan.</p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        {[
                            { title: 'Profil toko', detail: 'Nama, deskripsi, dan kontak toko', icon: UserIcon },
                            { title: 'Alamat gudang', detail: 'Alamat pengiriman dan pengambilan barang', icon: MapPinIcon },
                            { title: 'Rekening pencairan', detail: 'Informasi rekening untuk pencairan saldo', icon: HardDriveIcon },
                            { title: 'Keamanan akun', detail: 'Kata sandi dan otentikasi keamanan', icon: ShieldCheckIcon },
                        ].map(({ title, detail, icon: Icon }) => (
                            <button
                                key={title}
                                type="button"
                                onClick={onNavigateAccount}
                                className="flex items-start gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 text-left hover:border-[var(--brand-300)] hover:shadow-sm"
                            >
                                <span className="rounded-xl bg-[var(--brand-50)] p-3 text-[var(--brand-700)]"><Icon /></span>
                                <span>
                                    <span className="block font-bold text-[var(--text-primary)]">{title}</span>
                                    <span className="mt-1 block text-sm text-[var(--text-secondary)]">{detail}</span>
                                    <span className="mt-3 block text-xs font-bold text-[var(--brand-700)]">Buka pengaturan akun</span>
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                <section className="rounded-3xl bg-gradient-to-br from-[var(--brand-950)] via-[var(--brand-900)] to-[var(--brand-800)] p-6 text-white shadow-sm sm:p-8">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">Vendor workspace</p>
                    <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-extrabold sm:text-3xl">Selamat datang, {user?.name || 'Vendor'}</h2>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-200">
                                Kelola katalog dan operasional toko Anda dari satu tempat.
                            </p>
                        </div>
                        <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold">
                            Data dashboard belum terhubung
                        </span>
                    </div>
                </section>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <MetricCard label="Total penjualan" help="Nilai tampil setelah transaksi tersedia." />
                    <MetricCard label="Pesanan baru" help="Pesanan akan muncul setelah API terhubung." />
                    <MetricCard label="Produk aktif" help="Belum dihitung dari katalog vendor." />
                    <MetricCard label="Saldo tersedia" help="Informasi pencairan belum tersedia." />
                </div>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,1fr)]">
                    <PerformancePanel />
                    <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm sm:p-6">
                        <div className="mb-4">
                            <h2 className="text-lg font-bold text-[var(--text-primary)]">Status pesanan baru</h2>
                            <p className="mt-1 text-sm text-[var(--text-secondary)]">Tidak ada data transaksi masuk.</p>
                        </div>
                        <EmptyPanel
                            title="Belum ada pesanan baru"
                            description="Pesanan yang membutuhkan tindakan akan ditampilkan di sini."
                        />
                    </article>
                </div>
                <QuickStockPanel
                    inventory={inventory}
                    onToggleStock={handleToggleStock}
                    onNavigateProducts={() => onNavigateSection('products')}
                />
            </div>
        );
    };

    return (
        <div className="min-h-[calc(100vh-5rem)] bg-[var(--background)]">
            <header className="border-b border-[var(--border)] bg-[var(--surface)]">
                <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-600)] text-white"><CpuIcon /></span>
                        <div className="min-w-0">
                            <p className="truncate font-extrabold text-[var(--text-primary)]">PC Store <span className="font-medium text-[var(--text-muted)]">/ Vendor</span></p>
                            <p className="truncate text-xs text-[var(--text-secondary)]">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onNavigateToStorefront}
                        className="shrink-0 rounded-xl border border-[var(--border)] px-3 py-2 text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--surface-muted)] sm:px-4 sm:text-sm"
                    >
                        Kembali ke toko
                    </button>
                </div>
            </header>

            <div className="mx-auto grid w-full min-w-0 max-w-[1440px] grid-cols-1 lg:grid-cols-[250px_minmax(0,1fr)]">
                <aside className="w-full min-w-0 border-b border-[var(--border)] bg-[var(--surface)] p-3 lg:min-h-[calc(100vh-4rem)] lg:border-b-0 lg:border-r lg:p-5">
                    <p className="hidden px-3 pb-3 text-xs font-bold uppercase tracking-[0.14em] text-[var(--text-muted)] lg:block">Menu vendor</p>
                    <nav className="flex min-w-0 max-w-full gap-2 overflow-x-auto lg:block lg:space-y-1" aria-label="Navigasi dashboard vendor">
                        {vendorSections.map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                type="button"
                                onClick={() => onNavigateSection(id)}
                                aria-current={activeSection === id ? 'page' : undefined}
                                className={`flex min-w-0 shrink-0 items-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition lg:w-full lg:gap-3 ${
                                    activeSection === id
                                        ? 'bg-[var(--brand-50)] text-[var(--brand-700)]'
                                        : 'text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]'
                                }`}
                            >
                                <Icon className="h-4 w-4 shrink-0" />
                                <span className="whitespace-nowrap">{label}</span>
                            </button>
                        ))}
                    </nav>
                </aside>
                <div className="w-full min-w-0 p-4 sm:p-6 lg:p-8">
                    <div className="mx-auto w-full min-w-0 max-w-[1120px]">{renderContent()}</div>
                </div>
            </div>
        </div>
    );
}
