import React, { useCallback, useEffect, useState } from 'react';
import { BoxIcon, CheckCircleIcon, CpuIcon, HardDriveIcon, ShieldCheckIcon } from './Icons';

const sections = [
    ['overview', 'Overview', CpuIcon],
    ['products', 'Kelola Produk', BoxIcon],
    ['orders', 'Pesanan Masuk', CheckCircleIcon],
    ['reports', 'Laporan Penjualan', HardDriveIcon],
    ['settings', 'Pengaturan Toko', ShieldCheckIcon],
];

const formatRupiah = (value) => `Rp ${Number(value || 0).toLocaleString('id-ID')}`;
const inputClass = 'mt-2 min-h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--brand-500)] focus:ring-2 focus:ring-[var(--brand-500)]/20';

function Metric({ label, value, help }) {
    return (
        <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
            <p className="text-sm font-semibold text-[var(--text-secondary)]">{label}</p>
            <p className="mt-3 text-2xl font-extrabold text-[var(--text-primary)]">{value}</p>
            {help && <p className="mt-2 text-xs text-[var(--text-muted)]">{help}</p>}
        </article>
    );
}

export default function VendorDashboard({ user, accessToken, section = 'overview', onNavigateSection, onNavigateToStorefront, onOpenAuth }) {
    const [store, setStore] = useState(null);
    const [metrics, setMetrics] = useState({});
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [notice, setNotice] = useState('');
    const [error, setError] = useState('');
    const [showProductForm, setShowProductForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const request = useCallback(async (url, options = {}) => {
        const response = await fetch(url, {
            ...options,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
                ...options.headers,
            },
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message || 'Permintaan tidak dapat diproses.');
        }
        return result;
    }, [accessToken]);

    const loadDashboard = useCallback(async () => {
        if (!accessToken || user?.role !== 'vendor') return;
        setIsLoading(true);
        setError('');
        try {
            const [dashboard, productResult, orderResult, categoryResult] = await Promise.all([
                request('/api/vendor/dashboard'),
                request('/api/vendor/products'),
                request('/api/vendor/orders'),
                fetch('/api/categories').then((response) => response.json()),
            ]);
            setStore(dashboard.store);
            setMetrics(dashboard.metrics);
            setProducts(productResult.data || []);
            setOrders(orderResult.data || []);
            setCategories(categoryResult.data || []);
        } catch (loadError) {
            setError(loadError.message);
        } finally {
            setIsLoading(false);
        }
    }, [accessToken, request, user?.role]);

    useEffect(() => {
        loadDashboard();
    }, [loadDashboard]);

    const saveProduct = async (event) => {
        event.preventDefault();
        setError('');
        const data = Object.fromEntries(new FormData(event.currentTarget).entries());
        try {
            const result = await request(editingProduct ? `/api/vendor/products/${editingProduct.id}` : '/api/vendor/products', {
                method: editingProduct ? 'PATCH' : 'POST',
                body: JSON.stringify({
                    ...data,
                    category_id: Number(data.category_id),
                    price: Number(data.price),
                    stock: Number(data.stock),
                    weight_grams: Number(data.weight_grams || 0),
                }),
            });
            const savedProduct = result.product || result.data;
            setProducts((current) => editingProduct
                ? current.map((item) => item.id === editingProduct.id ? savedProduct : item)
                : [savedProduct, ...current]);
            if (!editingProduct) setMetrics((current) => ({ ...current, active_products: Number(current.active_products || 0) + 1 }));
            setShowProductForm(false);
            setEditingProduct(null);
            setNotice(`${savedProduct.name} berhasil disimpan ke katalog.`);
            window.dispatchEvent(new Event('catalog-updated'));
        } catch (saveError) {
            setError(saveError.message);
        }
    };

    const toggleStock = async (product) => {
        const stock = product.stock > 0 ? 0 : 1;
        try {
            const result = await request(`/api/vendor/products/${product.id}`, {
                method: 'PATCH',
                body: JSON.stringify({ stock }),
            });
            setProducts((current) => current.map((item) => item.id === product.id ? result.data : item));
            setNotice(`Stok ${product.name} berhasil diperbarui.`);
        } catch (saveError) {
            setError(saveError.message);
        }
    };

    const deleteProduct = async (product) => {
        if (!window.confirm(`Hapus "${product.name}" dari katalog?`)) return;
        try {
            await request(`/api/vendor/products/${product.id}`, { method: 'DELETE' });
            setProducts((current) => current.filter((item) => item.id !== product.id));
            setNotice(`${product.name} dihapus dari katalog.`);
            window.dispatchEvent(new Event('catalog-updated'));
        } catch (deleteError) {
            setError(deleteError.message);
        }
    };

    const saveStore = async (event) => {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(event.currentTarget).entries());
        try {
            const result = await request('/api/vendor/store', { method: 'PATCH', body: JSON.stringify(data) });
            setStore(result.data);
            setNotice('Pengaturan toko berhasil disimpan.');
        } catch (saveError) {
            setError(saveError.message);
        }
    };

    const updateOrderStatus = async (order, status) => {
        try {
            const result = await request(`/api/vendor/orders/${order.id}/status`, {
                method: 'PATCH',
                body: JSON.stringify({ status }),
            });
            setOrders((current) => current.map((item) => item.id === order.id ? result.data : item));
            setNotice(`Status ${order.order_number} berhasil diperbarui.`);
        } catch (saveError) {
            setError(saveError.message);
        }
    };

    if (user?.role !== 'vendor') {
        return (
            <section className="mx-auto flex min-h-[65vh] max-w-2xl items-center px-4 text-center">
                <div className="w-full rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8">
                    <ShieldCheckIcon className="mx-auto h-10 w-10 text-[var(--brand-600)]" />
                    <h1 className="mt-4 text-2xl font-extrabold">Akun Vendor diperlukan</h1>
                    <p className="mt-2 text-sm text-[var(--text-secondary)]">Masuk atau buat akun Vendor untuk membuka toko dan menjual produk.</p>
                    <button type="button" onClick={() => onOpenAuth?.('register', 'vendor')} className="mt-5 rounded-xl bg-[var(--brand-600)] px-5 py-3 text-sm font-bold text-white">Daftar sebagai Vendor</button>
                </div>
            </section>
        );
    }

    const renderProducts = () => (
        <div className="space-y-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div><h2 className="text-2xl font-extrabold">Kelola Produk</h2><p className="text-sm text-[var(--text-secondary)]">Produk yang disimpan langsung tampil di katalog pelanggan.</p></div>
                <button type="button" onClick={() => { setEditingProduct(null); setShowProductForm((value) => !value); }} className="rounded-xl bg-[var(--brand-600)] px-5 py-3 text-sm font-bold text-white">{showProductForm ? 'Tutup form' : '+ Tambah produk'}</button>
            </div>
            {showProductForm && (
                <form key={editingProduct?.id || 'new'} onSubmit={saveProduct} className="grid gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:grid-cols-2">
                    <Field name="name" label="Nama produk" defaultValue={editingProduct?.name} required className="sm:col-span-2" />
                    <label className="text-sm font-semibold">Kategori<select name="category_id" defaultValue={editingProduct?.category_id || ''} required className={inputClass}><option value="">Pilih kategori</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
                    <Field name="brand" label="Merek" defaultValue={editingProduct?.brand} required />
                    <Field name="sku" label="SKU" defaultValue={editingProduct?.sku} />
                    <Field name="price" label="Harga" type="number" min="1" defaultValue={editingProduct?.price} required />
                    <Field name="stock" label="Stok" type="number" min="0" defaultValue={editingProduct?.stock} required />
                    <Field name="weight_grams" label="Berat (gram)" type="number" min="0" defaultValue={editingProduct?.weight_grams} />
                    <Field name="image_url" label="URL gambar" type="url" defaultValue={editingProduct?.image_url} className="sm:col-span-2" />
                    <label className="text-sm font-semibold sm:col-span-2">Deskripsi<textarea name="description" defaultValue={editingProduct?.description || ''} rows="4" className={`${inputClass} resize-y`} /></label>
                    <button className="rounded-xl bg-[var(--brand-600)] px-5 py-3 text-sm font-bold text-white sm:col-span-2">{editingProduct ? 'Simpan perubahan' : 'Terbitkan produk'}</button>
                </form>
            )}
            <div className="divide-y divide-[var(--border)] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
                {products.length === 0 && <p className="p-8 text-center text-sm text-[var(--text-secondary)]">Belum ada produk. Tambahkan produk pertama toko Anda.</p>}
                {products.map((product) => (
                    <article key={product.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div><p className="font-bold">{product.name}</p><p className="text-xs text-[var(--text-muted)]">{product.category?.name} · {formatRupiah(product.price)} · Stok {product.stock}</p></div>
                        <div className="flex flex-wrap gap-2"><button type="button" onClick={() => { setEditingProduct(product); setShowProductForm(true); }} className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-bold">Edit</button><button type="button" onClick={() => toggleStock(product)} className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-bold">{product.stock > 0 ? 'Kosongkan stok' : 'Aktifkan stok'}</button><button type="button" onClick={() => deleteProduct(product)} className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-bold text-rose-700">Hapus</button></div>
                    </article>
                ))}
            </div>
        </div>
    );

    const renderOrders = () => (
        <div className="space-y-5"><div><h2 className="text-2xl font-extrabold">Pesanan Masuk</h2><p className="text-sm text-[var(--text-secondary)]">Proses dan lacak pesanan yang berisi produk toko Anda.</p></div>
            {orders.length === 0 && <div className="rounded-2xl border border-dashed border-[var(--border)] p-10 text-center text-sm text-[var(--text-secondary)]">Belum ada pesanan.</div>}
            {orders.map((order) => <article key={order.id} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"><div className="flex flex-wrap justify-between gap-3"><div><p className="font-extrabold">{order.order_number}</p><p className="text-xs text-[var(--text-muted)]">{order.customer?.name} · {new Date(order.created_at).toLocaleDateString('id-ID')}</p></div><select value={order.status} onChange={(event) => updateOrderStatus(order, event.target.value)} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"><option value="pending" disabled>Menunggu</option><option value="processing">Diproses</option><option value="shipped">Dikirim</option><option value="completed">Selesai</option><option value="cancelled">Dibatalkan</option></select></div><div className="mt-4 space-y-2">{order.items.map((item) => <div key={item.id} className="flex justify-between text-sm"><span>{item.product_name} × {item.quantity}</span><strong>{formatRupiah(item.subtotal)}</strong></div>)}</div></article>)}
        </div>
    );

    const renderSettings = () => <form onSubmit={saveStore} className="grid gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:grid-cols-2"><div className="sm:col-span-2"><h2 className="text-2xl font-extrabold">Pengaturan Toko</h2><p className="text-sm text-[var(--text-secondary)]">Perbarui identitas, alamat, dan rekening pencairan.</p></div><Field name="store_name" label="Nama toko" defaultValue={store?.store_name} required /><Field name="store_phone" label="Nomor telepon" defaultValue={store?.store_phone} /><Field name="store_logo" label="URL logo" type="url" defaultValue={store?.store_logo} className="sm:col-span-2" /><label className="text-sm font-semibold sm:col-span-2">Deskripsi<textarea name="store_description" defaultValue={store?.store_description || ''} rows="4" className={inputClass} /></label><label className="text-sm font-semibold sm:col-span-2">Alamat toko<textarea name="store_address" defaultValue={store?.store_address || ''} rows="3" className={inputClass} /></label><Field name="bank_name" label="Nama bank" defaultValue={store?.bank_name} /><Field name="bank_account_number" label="Nomor rekening" defaultValue={store?.bank_account_number} /><Field name="bank_account_holder" label="Pemilik rekening" defaultValue={store?.bank_account_holder} className="sm:col-span-2" /><button className="rounded-xl bg-[var(--brand-600)] px-5 py-3 text-sm font-bold text-white sm:col-span-2">Simpan pengaturan</button></form>;

    const content = section === 'products' ? renderProducts() : section === 'orders' ? renderOrders() : section === 'settings' ? renderSettings() : (
        <div className="space-y-6"><section className="rounded-3xl bg-gradient-to-br from-[var(--brand-950)] to-[var(--brand-800)] p-7 text-white"><p className="text-xs font-bold uppercase tracking-widest text-amber-300">Vendor workspace</p><h2 className="mt-2 text-3xl font-extrabold">{store?.store_name || `Toko ${user.name}`}</h2><p className="mt-2 text-sm text-slate-200">Kelola katalog, pesanan, dan hasil penjualan Anda.</p></section><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Metric label="Penjualan kotor" value={formatRupiah(metrics.gross_sales)} /><Metric label="Pesanan baru" value={metrics.new_orders || 0} /><Metric label="Produk aktif" value={metrics.active_products || 0} /><Metric label="Produk terjual" value={metrics.products_sold || 0} /></div>{section === 'reports' && <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"><h3 className="font-bold">Ringkasan penjualan</h3><p className="mt-2 text-sm text-[var(--text-secondary)]">Angka di atas dihitung dari seluruh pesanan toko, kecuali pesanan yang dibatalkan.</p></div>}</div>
    );

    return <div className="min-h-screen bg-[var(--background)]"><header className="border-b border-[var(--border)] bg-[var(--surface)]"><div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-4"><strong>PC Store / Vendor</strong><button type="button" onClick={onNavigateToStorefront} className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-bold">Kembali ke toko</button></div></header><div className="mx-auto grid max-w-[1440px] lg:grid-cols-[250px_minmax(0,1fr)]"><aside className="border-b border-[var(--border)] bg-[var(--surface)] p-3 lg:min-h-[calc(100vh-4rem)] lg:border-b-0 lg:border-r lg:p-5"><nav className="flex gap-2 overflow-x-auto lg:block lg:space-y-1">{sections.map(([id, label, Icon]) => <button key={id} type="button" onClick={() => onNavigateSection(id)} className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold lg:w-full ${section === id ? 'bg-[var(--brand-50)] text-[var(--brand-700)]' : 'text-[var(--text-secondary)]'}`}><Icon className="h-4 w-4" />{label}</button>)}</nav></aside><main className="min-w-0 p-4 sm:p-6 lg:p-8">{isLoading ? <p className="text-sm text-[var(--text-secondary)]">Memuat data toko…</p> : <>{error && <p className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}{notice && <p className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</p>}{content}</>}</main></div></div>;
}

function Field({ label, className = '', ...props }) {
    return <label className={`text-sm font-semibold ${className}`}>{label}<input {...props} className={inputClass} /></label>;
}
