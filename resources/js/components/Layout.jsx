import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import WishlistModal from './WishlistModal';
import AuthModal from './AuthModal';
import { CheckCircleIcon } from './Icons';
import {
    getCart,
    addToCart as apiAddToCart,
    addMultipleToCart as apiAddMultipleToCart,
    updateCartItemQuantity as apiUpdateCartItem,
    removeCartItem as apiRemoveCartItem,
    clearCart as apiClearCart,
    getWishlist,
    toggleWishlist as apiToggleWishlist,
    getStoredToken,
} from '../services/api';

const GUEST_CART_KEY = 'ld_guest_cart';

function getStoredGuestCart() {
    try {
        const stored = localStorage.getItem(GUEST_CART_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

function setStoredGuestCart(items) {
    try {
        if (!items || items.length === 0) {
            localStorage.removeItem(GUEST_CART_KEY);
        } else {
            localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
        }
    } catch {
        // Ignore
    }
}

export default function Layout({
    children,
    initialCartItems = [],
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
    const [cartItems, setCartItems] = useState(() => {
        const token = getStoredToken();
        if (!token) {
            const guestItems = getStoredGuestCart();
            if (guestItems && guestItems.length > 0) {
                return guestItems;
            }
        }
        return initialCartItems;
    });
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

    // Synchronize Cart and Wishlist from Backend API when user is logged in
    useEffect(() => {
        const token = getStoredToken();
        if (currentUser || token) {
            const guestItems = getStoredGuestCart();
            if (guestItems && guestItems.length > 0) {
                // Sync any guest items accumulated before login
                apiAddMultipleToCart(guestItems)
                    .then((res) => {
                        setStoredGuestCart([]);
                        if (res && Array.isArray(res.items)) {
                            setCartItems(res.items);
                        } else {
                            getCart().then((cartData) => {
                                if (cartData?.items) setCartItems(cartData.items);
                            });
                        }
                    })
                    .catch(() => {
                        getCart().then((cartData) => {
                            if (cartData?.items) setCartItems(cartData.items);
                        });
                    });
            } else {
                getCart()
                    .then((cartData) => {
                        if (cartData && Array.isArray(cartData.items)) {
                            setCartItems(cartData.items);
                        }
                    })
                    .catch(() => {
                        // Graceful fallback to local cart if network error
                    });
            }

            getWishlist()
                .then((wishlistData) => {
                    if (Array.isArray(wishlistData)) {
                        setWishlistItems(wishlistData);
                    }
                })
                .catch(() => {
                    // Graceful fallback
                });
        }
    }, [currentUser]);

    const handleUpdateQuantity = async (itemId, newQuantity) => {
        const token = getStoredToken();
        const targetItem = cartItems.find((item) => item.id === itemId);

        if (token && targetItem && (typeof targetItem.cartItemId === 'number' || typeof targetItem.id === 'number')) {
            const cid = targetItem.cartItemId || targetItem.id;
            try {
                await apiUpdateCartItem(cid, newQuantity);
                const refreshed = await getCart();
                setCartItems(refreshed.items);
                return;
            } catch (err) {
                showToast(err.message || 'Gagal mengubah jumlah barang.');
                return;
            }
        }

        setCartItems((prev) => {
            const updated = prev.map((item) =>
                item.id === itemId ? { ...item, quantity: newQuantity } : item
            );
            if (!token) setStoredGuestCart(updated);
            return updated;
        });
    };

    const handleRemoveItem = async (itemId) => {
        const item = cartItems.find((cartItem) => cartItem.id === itemId);
        if (!item || !window.confirm(`Hapus "${item.name}" dari keranjang?`)) return;

        const token = getStoredToken();
        if (token && item && (typeof item.cartItemId === 'number' || typeof item.id === 'number')) {
            const cid = item.cartItemId || item.id;
            try {
                await apiRemoveCartItem(cid);
                const refreshed = await getCart();
                setCartItems(refreshed.items);
                showToast('Barang berhasil dihapus dari keranjang.');
                return;
            } catch (err) {
                showToast(err.message || 'Gagal menghapus barang dari keranjang.');
                return;
            }
        }

        setCartItems((prev) => {
            const updated = prev.filter((cartItem) => cartItem.id !== itemId);
            if (!token) setStoredGuestCart(updated);
            return updated;
        });
        showToast('Barang berhasil dihapus dari keranjang.');
    };

    const handleAddToCart = async (product) => {
        const quantity = Math.max(1, Number(product.quantity) || 1);
        const token = getStoredToken();
        const pId = product.productId || product.product_id || product.id || product.slug;

        if (token && pId) {
            try {
                const res = await apiAddToCart(pId, quantity);
                const refreshed = await getCart();
                setCartItems(refreshed.items);
                setIsCartOpen(true);
                showToast(res.message || `"${product.name}" ditambahkan ke keranjang.`);
                return;
            } catch (err) {
                showToast(err.message || 'Gagal menambahkan produk ke keranjang.');
                return;
            }
        }

        // Guest fallback
        setCartItems((prev) => {
            const existing = prev.find((item) => item.id === product.id || item.slug === product.slug);
            let updated;
            if (existing) {
                updated = prev.map((item) =>
                    (item.id === product.id || item.slug === product.slug)
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                updated = [...prev, { ...product, id: product.id || product.slug, quantity }];
            }
            setStoredGuestCart(updated);
            return updated;
        });
        setIsCartOpen(true);
        showToast(`"${product.name}" ditambahkan ke keranjang.`);
    };

    const handleAddMultipleToCart = async (products) => {
        if (!products || products.length === 0) return;

        const token = getStoredToken();

        if (token) {
            try {
                const res = await apiAddMultipleToCart(products);
                if (res && Array.isArray(res.items) && res.items.length > 0) {
                    setCartItems(res.items);
                } else {
                    const refreshed = await getCart();
                    setCartItems(refreshed.items);
                }
                setIsCartOpen(true);
                showToast(`${products.length} komponen rakitan berhasil ditambahkan ke keranjang!`);
                return;
            } catch (err) {
                showToast(err.message || 'Gagal menambahkan komponen ke keranjang.');
                return;
            }
        }

        // Guest fallback with localStorage persistence
        setCartItems((prev) => {
            let updated = [...prev];
            products.forEach((product) => {
                const pId = product.id || product.slug;
                const existing = updated.find((item) => item.id === pId || (product.slug && item.slug === product.slug));
                const qty = Math.max(1, Number(product.quantity) || 1);
                if (existing) {
                    updated = updated.map((item) =>
                        (item.id === pId || (product.slug && item.slug === product.slug))
                            ? { ...item, quantity: item.quantity + qty }
                            : item
                    );
                } else {
                    updated.push({
                        ...product,
                        id: pId,
                        price: Number(product.price) || 0,
                        quantity: qty,
                    });
                }
            });
            setStoredGuestCart(updated);
            return updated;
        });
        setIsCartOpen(true);
        showToast(`${products.length} komponen rakitan berhasil ditambahkan ke keranjang!`);
    };

    const handleToggleWishlist = async (product) => {
        if (!product) return;
        const token = getStoredToken();

        if (!token) {
            showToast('Silakan masuk ke akun Anda untuk menyimpan ke Wishlist.');
            openAuth('login');
            return;
        }

        try {
            const res = await apiToggleWishlist(product.id);
            const refreshed = await getWishlist();
            setWishlistItems(refreshed);
            showToast(
                res.message ||
                    (res.wishlisted
                        ? `"${product.name}" ditambahkan ke wishlist.`
                        : `"${product.name}" dihapus dari wishlist.`)
            );
        } catch (err) {
            showToast(err.message || 'Gagal memperbarui wishlist.');
        }
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
            setCartItems([]);
            setWishlistItems([]);
            setStoredGuestCart([]);
            showToast('Anda berhasil keluar dari akun.');
        } catch (error) {
            showToast(error.message || 'Gagal keluar dari akun. Silakan coba lagi.');
        }
    };

    const handleCompleteOrder = async (order) => {
        const token = getStoredToken();
        if (token) {
            try {
                await apiClearCart();
            } catch {
                // Ignore
            }
        }
        setCartItems([]);
        setStoredGuestCart([]);
        showToast(`Pesanan simulasi ${order.orderNumber} berhasil dibuat.`);
    };

    const totalCartCount = cartItems.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0);

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
