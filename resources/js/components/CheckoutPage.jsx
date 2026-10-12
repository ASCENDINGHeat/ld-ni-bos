import React, { useState } from 'react';
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    CartIcon,
    CheckCircleIcon,
    ChevronRightIcon,
    MinusIcon,
    PlusIcon,
    ShieldCheckIcon,
    TrashIcon,
} from './Icons';
import TransactionSuccessModal from './TransactionSuccessModal';

const shippingOptions = [
    { id: 'regular', label: 'Reguler', description: 'Estimasi 2–4 hari kerja', price: 20000 },
    { id: 'express', label: 'Ekspres', description: 'Estimasi 1–2 hari kerja', price: 35000 },
];

const paymentOptions = [
    { id: 'bank-transfer', label: 'Transfer Bank', description: 'BCA, Mandiri, BNI, atau BRI' },
    { id: 'e-wallet', label: 'E-Wallet', description: 'GoPay, OVO, atau QRIS' },
    { id: 'cod', label: 'Bayar di Tempat (COD)', description: 'Pembayaran saat pesanan diterima' },
];

const formatRupiah = (amount) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(amount);

const initialShippingDetails = {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    notes: '',
};

function FormField({ id, label, className = '', ...props }) {
    return (
        <label htmlFor={id} className={`block space-y-1.5 ${className}`}>
            <span className="text-sm font-semibold">{label}</span>
            <input
                id={id}
                name={id}
                className="min-h-11 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--brand-500)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]/20"
                {...props}
            />
        </label>
    );
}

export default function CheckoutPage({
    items = [],
    onUpdateQuantity,
    onRemoveItem,
    onBackToCart,
    onCompleteOrder,
    onReturnHome,
}) {
    const [shippingDetails, setShippingDetails] = useState(initialShippingDetails);
    const [shippingMethod, setShippingMethod] = useState('regular');
    const [paymentMethod, setPaymentMethod] = useState('bank-transfer');
    const [completedOrder, setCompletedOrder] = useState(null);

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const selectedShipping = shippingOptions.find((option) => option.id === shippingMethod);
    const selectedPayment = paymentOptions.find((option) => option.id === paymentMethod);
    const shippingCost =
        shippingMethod === 'regular' && subtotal >= 2000000 ? 0 : selectedShipping.price;
    const total = subtotal + shippingCost;

    const updateShippingDetail = (event) => {
        const { name, value } = event.target;
        setShippingDetails((previous) => ({ ...previous, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (items.length === 0) return;

        const order = {
            orderNumber: `PCS-${Date.now().toString().slice(-8)}`,
            items: items.map((item) => ({ ...item })),
            shippingDetails: { ...shippingDetails },
            shippingLabel: selectedShipping.label,
            shippingCost,
            paymentLabel: selectedPayment.label,
            subtotal,
            total,
        };
        onCompleteOrder(order);
        setCompletedOrder(order);
    };

    return (
        <>
            <section className="mx-auto w-full max-w-[1280px] space-y-6 px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
                <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                    <button type="button" onClick={onBackToCart} className="hover:text-[var(--brand-600)]">
                        Keranjang
                    </button>
                    <ChevronRightIcon className="h-3.5 w-3.5" />
                    <span className="font-semibold text-[var(--text-primary)]">Checkout</span>
                </nav>

                <header className="border-b border-[var(--border)] pb-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-[var(--brand-600)]">
                        Langkah terakhir
                    </p>
                    <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
                        Checkout Pesanan
                    </h1>
                    <p className="mt-2 text-sm text-[var(--text-secondary)]">
                        Lengkapi alamat pengiriman dan pilih metode pembayaran.
                    </p>
                </header>

                {items.length === 0 && !completedOrder ? (
                    <div className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
                        <CartIcon className="mx-auto h-10 w-10 text-[var(--text-muted)]" />
                        <h2 className="mt-3 font-bold">Belum ada barang untuk checkout</h2>
                        <p className="mt-1 text-sm text-[var(--text-secondary)]">
                            Tambahkan produk ke keranjang sebelum melanjutkan.
                        </p>
                        <button
                            type="button"
                            onClick={onBackToCart}
                            className="mt-5 rounded-[var(--radius-md)] bg-[var(--brand-600)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--brand-700)]"
                        >
                            Kembali ke Keranjang
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
                        <div className="space-y-5 lg:col-span-7">
                            <fieldset className="space-y-4 rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)] sm:p-6">
                                <legend className="px-1 text-base font-bold">Data Penerima & Pengiriman</legend>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <FormField
                                        id="fullName"
                                        label="Nama lengkap"
                                        autoComplete="name"
                                        value={shippingDetails.fullName}
                                        onChange={updateShippingDetail}
                                        required
                                    />
                                    <FormField
                                        id="phone"
                                        label="Nomor telepon"
                                        type="tel"
                                        autoComplete="tel"
                                        placeholder="08xxxxxxxxxx"
                                        value={shippingDetails.phone}
                                        onChange={updateShippingDetail}
                                        required
                                    />
                                    <FormField
                                        id="email"
                                        label="Email"
                                        type="email"
                                        autoComplete="email"
                                        className="sm:col-span-2"
                                        value={shippingDetails.email}
                                        onChange={updateShippingDetail}
                                        required
                                    />
                                    <label htmlFor="address" className="block space-y-1.5 sm:col-span-2">
                                        <span className="text-sm font-semibold">Alamat lengkap</span>
                                        <textarea
                                            id="address"
                                            name="address"
                                            rows="3"
                                            autoComplete="street-address"
                                            value={shippingDetails.address}
                                            onChange={updateShippingDetail}
                                            required
                                            className="w-full resize-y rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--text-primary)] focus:border-[var(--brand-500)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]/20"
                                        />
                                    </label>
                                    <FormField
                                        id="city"
                                        label="Kota / Kabupaten"
                                        autoComplete="address-level2"
                                        value={shippingDetails.city}
                                        onChange={updateShippingDetail}
                                        required
                                    />
                                    <FormField
                                        id="province"
                                        label="Provinsi"
                                        autoComplete="address-level1"
                                        value={shippingDetails.province}
                                        onChange={updateShippingDetail}
                                        required
                                    />
                                    <FormField
                                        id="postalCode"
                                        label="Kode pos"
                                        inputMode="numeric"
                                        autoComplete="postal-code"
                                        pattern="[0-9]{5}"
                                        title="Masukkan kode pos 5 digit"
                                        value={shippingDetails.postalCode}
                                        onChange={updateShippingDetail}
                                        required
                                    />
                                    <label htmlFor="notes" className="block space-y-1.5 sm:col-span-2">
                                        <span className="text-sm font-semibold">
                                            Catatan untuk kurir <span className="font-normal text-[var(--text-muted)]">(opsional)</span>
                                        </span>
                                        <textarea
                                            id="notes"
                                            name="notes"
                                            rows="2"
                                            value={shippingDetails.notes}
                                            onChange={updateShippingDetail}
                                            className="w-full resize-y rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--text-primary)] focus:border-[var(--brand-500)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]/20"
                                        />
                                    </label>
                                </div>
                            </fieldset>

                            <fieldset className="space-y-3 rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)] sm:p-6">
                                <legend className="px-1 text-base font-bold">Layanan Pengiriman</legend>
                                <p className="text-xs text-[var(--text-muted)]">
                                    Ongkos kirim berikut hanya estimasi untuk simulasi.
                                </p>
                                {shippingOptions.map((option) => {
                                    const price =
                                        option.id === 'regular' && subtotal >= 2000000
                                            ? 0
                                            : option.price;
                                    return (
                                        <label
                                            key={option.id}
                                            className={`flex cursor-pointer items-center gap-3 rounded-[var(--radius-md)] border p-3 ${
                                                shippingMethod === option.id
                                                    ? 'border-[var(--brand-500)] bg-[var(--brand-50)]'
                                                    : 'border-[var(--border)]'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="shippingMethod"
                                                value={option.id}
                                                checked={shippingMethod === option.id}
                                                onChange={() => setShippingMethod(option.id)}
                                                className="accent-[var(--brand-600)]"
                                            />
                                            <span className="min-w-0 flex-1">
                                                <span className="block text-sm font-semibold">{option.label}</span>
                                                <span className="block text-xs text-[var(--text-muted)]">{option.description}</span>
                                            </span>
                                            <span className="text-sm font-bold">
                                                {price === 0 ? 'Gratis' : formatRupiah(price)}
                                            </span>
                                        </label>
                                    );
                                })}
                            </fieldset>

                            <fieldset className="space-y-3 rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)] sm:p-6">
                                <legend className="px-1 text-base font-bold">Metode Pembayaran</legend>
                                <p className="text-xs text-[var(--text-muted)]">
                                    Pilihan ini untuk simulasi antarmuka; pembayaran belum terhubung.
                                </p>
                                {paymentOptions.map((option) => (
                                    <label
                                        key={option.id}
                                        className={`flex cursor-pointer items-center gap-3 rounded-[var(--radius-md)] border p-3 ${
                                            paymentMethod === option.id
                                                ? 'border-[var(--brand-500)] bg-[var(--brand-50)]'
                                                : 'border-[var(--border)]'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value={option.id}
                                            checked={paymentMethod === option.id}
                                            onChange={() => setPaymentMethod(option.id)}
                                            className="accent-[var(--brand-600)]"
                                        />
                                        <span>
                                            <span className="block text-sm font-semibold">{option.label}</span>
                                            <span className="block text-xs text-[var(--text-muted)]">{option.description}</span>
                                        </span>
                                    </label>
                                ))}
                            </fieldset>
                        </div>

                        <aside className="space-y-4 rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)] lg:sticky lg:top-36 lg:col-span-5">
                            <h2 className="text-base font-bold">Ringkasan Pesanan</h2>
                            <div className="max-h-72 space-y-3 overflow-y-auto">
                                {items.map((item) => (
                                    <article key={item.id} className="flex gap-3 border-b border-[var(--border)] pb-3">
                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius-sm)] bg-[var(--surface-muted)]">
                                            {item.image ? (
                                                <img src={item.image} alt="" className="h-full w-full object-contain" />
                                            ) : (
                                                <CartIcon className="h-5 w-5 text-[var(--brand-600)]" />
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="line-clamp-2 text-xs font-semibold">{item.name}</h3>
                                            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                                                <div className="flex h-8 items-center rounded border border-[var(--border)]">
                                                    <button
                                                        type="button"
                                                        onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                        disabled={item.quantity <= 1}
                                                        className="p-1.5 disabled:opacity-40"
                                                        aria-label={`Kurangi jumlah ${item.name}`}
                                                    >
                                                        <MinusIcon className="h-3.5 w-3.5" />
                                                    </button>
                                                    <span className="min-w-6 text-center text-xs">{item.quantity}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                                        className="p-1.5"
                                                        aria-label={`Tambah jumlah ${item.name}`}
                                                    >
                                                        <PlusIcon className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-xs font-bold">{formatRupiah(item.price * item.quantity)}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => onRemoveItem(item.id)}
                                                        className="rounded p-1 text-[var(--text-muted)] hover:text-[var(--danger)]"
                                                        aria-label={`Hapus ${item.name} dari keranjang`}
                                                    >
                                                        <TrashIcon className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>

                            <div className="space-y-3 border-y border-[var(--border)] py-4 text-sm">
                                <div className="flex justify-between gap-3">
                                    <span className="text-[var(--text-secondary)]">Subtotal ({itemCount} barang)</span>
                                    <span>{formatRupiah(subtotal)}</span>
                                </div>
                                <div className="flex justify-between gap-3">
                                    <span className="text-[var(--text-secondary)]">Pengiriman · {selectedShipping.label}</span>
                                    <span>{shippingCost === 0 ? 'Gratis' : formatRupiah(shippingCost)}</span>
                                </div>
                            </div>
                            <div className="flex justify-between gap-3 text-base font-extrabold">
                                <span>Total Pembayaran</span>
                                <span className="text-[var(--brand-600)]">{formatRupiah(total)}</span>
                            </div>
                            <p className="text-[11px] leading-relaxed text-[var(--text-muted)]">
                                Biaya pengiriman dan total ini merupakan simulasi, bukan tarif atau tagihan aktual.
                            </p>

                            <button
                                type="submit"
                                disabled={items.length === 0}
                                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--brand-600)] px-4 py-3 text-sm font-bold text-white hover:bg-[var(--brand-700)] disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)]"
                            >
                                <CheckCircleIcon className="h-4 w-4" />
                                Buat Pesanan Simulasi
                            </button>
                            <button
                                type="button"
                                onClick={onBackToCart}
                                className="inline-flex w-full items-center justify-center gap-2 py-2 text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                            >
                                <ArrowLeftIcon className="h-4 w-4" />
                                Kembali ke Keranjang
                            </button>
                            <div className="flex items-center justify-center gap-2 text-[11px] text-[var(--text-muted)]">
                                <ShieldCheckIcon className="h-4 w-4 text-[var(--success)]" />
                                Transaksi ini belum memproses pembayaran sungguhan
                            </div>
                        </aside>
                    </form>
                )}
            </section>

            {completedOrder && (
                <TransactionSuccessModal order={completedOrder} onClose={onReturnHome} />
            )}
        </>
    );
}
