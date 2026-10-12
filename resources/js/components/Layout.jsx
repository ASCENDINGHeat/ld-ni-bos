import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import WishlistModal from './WishlistModal';
import AuthModal from './AuthModal';
import { CheckCircleIcon } from './Icons';

export default function Layout({
    children,
    initialCartItems = [
        {
            id: 'item-1',
            name: 'Intel Core i5-14600K 14-Core Up to 5.3GHz LGA1700',
            category: 'Processor',
            price: 5250000,
            quantity: 1,
            image: null,
        },
        {
            id: 'item-2',
            name: 'ASUS Dual GeForce RTX 4070 SUPER OC Edition 12GB GDDR6X',
            category: 'VGA Card',
            price: 11200000,
            quantity: 1,
            image: null,
        },
    ],
    onSelectProduct,
    onOpenCatalog,
    onNavigateCategory,
    onViewCart,
    onNavigateToCheckout,
    currentUser,
    activeView,
    onAuthenticated,
    onLogout,
    onNavigateToAccount,
    onNavigateVendorDashboard,
    onNavigateToStorefront,
}) {
    const [cartItems, setCartItems] = useState(initialCartItems);
    const [wishlistItems, setWishlistItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isWishlistOpen, setIsWishlistOpen] = useState(false);
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [authMode, setAuthMode] = useState('login');
    const [authRole, setAuthRole] = useState('customer');
    const [toastMessage, setToastMessage] = useState('');

    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => {
            setToastMessage('');
        }, 3000);
    };

    const handleUpdateQuantity = (itemId, newQuantity) => {
        setCartItems((prev) =>
            prev.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item))
        );
    };

    const handleRemoveItem = (itemId) => {
        const item = cartItems.find((cartItem) => cartItem.id === itemId);
        if (!item || !window.confirm(`Hapus "${item.name}" dari keranjang?`)) return;

        setCartItems((prev) => prev.filter((item) => item.id !== itemId));
        showToast('Barang berhasil dihapus dari keranjang.');
    };

    const handleAddToCart = (product) => {
        const quantity = Math.max(1, Number(product.quantity) || 1);
        setCartItems((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { ...product, quantity }];
        });
        showToast(`"${product.name}" ditambahkan ke keranjang.`);
    };

    const handleAddMultipleToCart = (products) => {
        setCartItems((prev) => {
            let updated = [...prev];
            products.forEach((product) => {
                const existing = updated.find((item) => item.id === product.id);
                if (existing) {
                    updated = updated.map((item) =>
                        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                    );
                } else {
                    updated.push({ ...product, quantity: 1 });
                }
            });
            return updated;
        });
        showToast(`${products.length} komponen rakitan berhasil ditambahkan ke keranjang!`);
    };

    const handleToggleWishlist = (product) => {
        if (!product) return;

        const isWishlisted = wishlistItems.some((item) => item.id === product.id);
        setWishlistItems((prev) =>
            isWishlisted
                ? prev.filter((item) => item.id !== product.id)
                : [...prev, product]
        );
        showToast(
            isWishlisted
                ? `"${product.name}" dihapus dari wishlist.`
                : `"${product.name}" ditambahkan ke wishlist.`
        );
    };

    const handleSearchSubmit = (query) => {
        if (!query.trim()) return;
        showToast(`Mencari produk dengan kata kunci: "${query}"`);
    };

    const handleCheckout = () => {
        setIsCartOpen(false);
        onNavigateToCheckout?.();
    };

    const openAuth = (mode = 'login', role = 'customer') => {
        setAuthMode(mode);
        setAuthRole(role);
        setIsAuthOpen(true);
    };

    const handleLogout = async () => {
        try {
            await onLogout?.();
            showToast('Anda berhasil keluar dari akun.');
        } catch (error) {
            showToast(error.message || 'Gagal keluar dari akun. Silakan coba lagi.');
        }
    };

    const handleCompleteOrder = (order) => {
        setCartItems([]);
        showToast(`Pesanan simulasi ${order.orderNumber} berhasil dibuat.`);
    };

    const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <div className="min-h-screen flex flex-col overflow-x-clip bg-[var(--background)] text-[var(--text-primary)] antialiased transition-colors selection:bg-[var(--brand-500)] selection:text-white">
            {/* Toast Feedback */}
            {toastMessage && (
                <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-[var(--radius-md)] bg-slate-900 text-white text-sm shadow-xl border border-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <CheckCircleIcon className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{toastMessage}</span>
                </div>
            )}

            {activeView !== 'vendor-dashboard' && (
                <Navbar
                    cartCount={totalCartCount}
                    wishlistCount={wishlistItems.length}
                    currentUser={currentUser}
                    isVendorMode={false}
                    onOpenCart={() => setIsCartOpen(true)}
                    onViewCart={onViewCart}
                    onOpenWishlist={() => setIsWishlistOpen(true)}
                    onNavigateCategory={onNavigateCategory}
                    onSearchSubmit={handleSearchSubmit}
                    onOpenAuth={openAuth}
                    onLogout={handleLogout}
                    onNavigateToAccount={onNavigateToAccount}
                    onNavigateVendorDashboard={onNavigateVendorDashboard}
                    onNavigateToStorefront={onNavigateToStorefront}
                />
            )}

            <AuthModal
                isOpen={isAuthOpen}
                initialMode={authMode}
                initialRole={authRole}
                onClose={() => setIsAuthOpen(false)}
                onAuthenticated={onAuthenticated}
            />

            {/* Slide-out Cart Drawer */}
            <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                items={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onCheckout={handleCheckout}
            />

            <WishlistModal
                isOpen={isWishlistOpen}
                items={wishlistItems}
                onClose={() => setIsWishlistOpen(false)}
                onRemove={handleToggleWishlist}
                onOpenCatalog={() => {
                    setIsWishlistOpen(false);
                    onOpenCatalog?.();
                }}
                onSelectProduct={(product) => {
                    setIsWishlistOpen(false);
                    onSelectProduct?.(product);
                }}
            />

            {/* Main Content Area */}
            <main className="flex-1 w-full flex flex-col">
                {typeof children === 'function'
                    ? children({
                          onAddToCart: handleAddToCart,
                          onAddMultipleToCart: handleAddMultipleToCart,
                          onOpenCart: () => setIsCartOpen(true),
                          onCompleteOrder: handleCompleteOrder,
                          onNavigateToCheckout,
                          cartItems,
                          onUpdateQuantity: handleUpdateQuantity,
                          onRemoveCartItem: handleRemoveItem,
                          onToggleWishlist: handleToggleWishlist,
                          wishlistItems,
                          onShowToast: showToast,
                          onOpenAuth: openAuth,
                      })
                    : children}
            </main>


            {activeView !== 'vendor-dashboard' && <Footer />}
        </div>
    );
}
