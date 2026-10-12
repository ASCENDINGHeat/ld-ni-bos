import '../css/app.css';
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Layout from './components/Layout';
import ProductCatalog from './components/ProductCatalog';
import ProductDetailPage from './components/ProductDetailPage';
import ProductQuickViewModal from './components/ProductQuickViewModal';
import PCBuilderSimulation from './components/PCBuilderSimulation';
import CartPage from './components/CartPage';
import CheckoutPage from './components/CheckoutPage';
import AccountSettingsPage from './components/AccountSettingsPage';
import VendorDashboard from './components/VendorDashboard';
import productsData from './mocks/products.json';
import {
    getStoredToken,
    setStoredToken,
    getStoredUser,
    setStoredUser,
    clearAuthStorage,
    getProductDetail,
    normalizeProduct,
} from './services/api';
import {
    CpuIcon,
    MonitorIcon,
    HardDriveIcon,
    WrenchIcon,
    ShieldCheckIcon,
    ArrowRightIcon,
} from './components/Icons';

const categoryCards = [
    { id: 'pc-siap-pakai', name: 'PC Siap Pakai', count: 'Rakitan Lengkap', icon: MonitorIcon, highlight: true },
    { id: 'processor', name: 'Processor', count: 'Intel & AMD Ryzen', icon: CpuIcon },
    { id: 'kartu-grafis', name: 'VGA / GPU', count: 'RTX 40 Series & RX', icon: MonitorIcon },
    { id: 'motherboard', name: 'Motherboard', count: 'AM5 & LGA1700', icon: HardDriveIcon },
    { id: 'builder', name: 'Rakit PC', count: 'Simulasi Online', icon: WrenchIcon, highlight: true },
];

function App() {
    const rootElement = document.getElementById('root');
    const [activeView, setActiveView] = useState(
        () => rootElement?.dataset.initialView || 'beranda'
    );
    const [vendorSection, setVendorSection] = useState(
        () => rootElement?.dataset.vendorSection || 'overview'
    );
    const [currentUser, setCurrentUser] = useState(() => getStoredUser());
    const [accessToken, setAccessToken] = useState(() => getStoredToken());
    const [selectedProduct, setSelectedProduct] = useState(() => {
        const slug = rootElement?.dataset.productSlug;
        if (!slug) return null;
        const mock = productsData.find((p) => p.slug === slug);
        return mock ? normalizeProduct(mock) : null;
    });
    const [builderProduct, setBuilderProduct] = useState(null);
    const [quickViewProduct, setQuickViewProduct] = useState(null);
    const [catalogNavigationKey, setCatalogNavigationKey] = useState(0);
    const [catalogCategory, setCatalogCategory] = useState(() => {
        const category = new URLSearchParams(window.location.search).get('category');
        return category || 'all';
    });

    // Validate stored token on mount
    useEffect(() => {
        const token = getStoredToken();
        if (token) {
            fetch('/api/user', {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => (res.ok ? res.json() : null))
                .then((data) => {
                    if (data?.data || data?.user || data?.id) {
                        const user = data.data || data.user || data;
                        setCurrentUser(user);
                        setStoredUser(user);
                    } else {
                        clearAuthStorage();
                        setCurrentUser(null);
                        setAccessToken(null);
                    }
                })
                .catch(() => {
                    // Network issue, keep existing offline user
                });
        }
    }, []);

    const navigateToView = (view, product = null, category = null, section = 'overview') => {
        const paths = {
            beranda: '/',
            katalog: '/katalog',
            'pc-builder': '/pc-builder',
            cart: '/keranjang',
            checkout: '/checkout',
            account: '/akun',
        };
        const vendorPaths = {
            overview: '/vendor/dashboard',
            products: '/vendor/products',
            orders: '/vendor/orders',
            reports: '/vendor/reports',
            settings: '/vendor/settings',
        };
        const basePath =
            view === 'detail' && product?.slug
                ? `/produk/${encodeURIComponent(product.slug)}`
                : view === 'vendor-dashboard'
                  ? vendorPaths[section] || vendorPaths.overview
                  : paths[view];

        if (!basePath) return;

        const path =
            view === 'katalog' && category && category !== 'all'
                ? `${basePath}?category=${encodeURIComponent(category)}`
                : basePath;

        if (view === 'detail') setSelectedProduct(product);
        if (view === 'pc-builder') setBuilderProduct(product);
        if (view === 'vendor-dashboard') setVendorSection(section);
        if (view === 'katalog') {
            setCatalogCategory(category || 'all');
            setCatalogNavigationKey((previous) => previous + 1);
        }

        setActiveView(view);
        window.history.pushState(
            { view, productSlug: product?.slug ?? null, category: category || 'all', section },
            '',
            path
        );
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        const loadCatalog = () => fetch('/api/products?per_page=100')
            .then((response) => response.ok ? response.json() : Promise.reject())
            .then((result) => {
                const serverProducts = (result.data || []).map((product) => ({
                    ...product,
                    category: product.category?.slug || 'other',
                    categoryName: product.category?.name || 'Lainnya',
                    inStock: product.is_in_stock,
                    stock: product.stock,
                    image: product.image_url,
                    gallery: (product.images || []).map((image) => ({ image })),
                    specs: Object.values(product.specifications || {}).map(String),
                    technicalSpecs: product.specifications || {},
                }));
                if (serverProducts.length > 0) setCatalogProducts(serverProducts);
            })
            .catch(() => {});

        loadCatalog();
        window.addEventListener('catalog-updated', loadCatalog);

        return () => window.removeEventListener('catalog-updated', loadCatalog);
    }, []);

    useEffect(() => {
        if (!accessToken) return;

        fetch('/api/user', { headers: { Accept: 'application/json', Authorization: `Bearer ${accessToken}` } })
            .then((response) => response.ok ? response.json() : Promise.reject())
            .then((result) => {
                setCurrentUser(result.data);
                localStorage.setItem('pc-store-user', JSON.stringify(result.data));
            })
            .catch(() => {
                setCurrentUser(null);
                setAccessToken(null);
                localStorage.removeItem('pc-store-user');
                localStorage.removeItem('pc-store-token');
            });
    }, [accessToken]);

    useEffect(() => {
        const productSlug = window.location.pathname.startsWith('/produk/')
            ? decodeURIComponent(window.location.pathname.replace('/produk/', ''))
            : null;
        if (productSlug) {
            setSelectedProduct(catalogProducts.find((product) => product.slug === productSlug) || null);
        }
    }, [catalogProducts]);

    useEffect(() => {
        const syncViewWithLocation = () => {
            const productSlug = window.location.pathname.match(/^\/produk\/([^/]+)$/)?.[1];

            if (productSlug) {
                getProductDetail(productSlug)
                    .then((prod) => {
                        if (prod) setSelectedProduct(prod);
                    })
                    .catch(() => {
                        const fallback = productsData.find((product) => product.slug === productSlug);
                        if (fallback) setSelectedProduct(normalizeProduct(fallback));
                    });
                setActiveView('detail');
                return;
            }

            const viewsByPath = {
                '/': 'beranda',
                '/katalog': 'katalog',
                '/pc-builder': 'pc-builder',
                '/keranjang': 'cart',
                '/checkout': 'checkout',
                '/akun': 'account',
            };

            const vendorSectionByPath = {
                '/vendor/dashboard': 'overview',
                '/vendor/products': 'products',
                '/vendor/orders': 'orders',
                '/vendor/reports': 'reports',
                '/vendor/settings': 'settings',
            };
            const currentVendorSection = vendorSectionByPath[window.location.pathname];
            const view = viewsByPath[window.location.pathname] || 'beranda';
            setActiveView(currentVendorSection ? 'vendor-dashboard' : view);
            if (currentVendorSection) setVendorSection(currentVendorSection);
            if (view === 'katalog') {
                const category = new URLSearchParams(window.location.search).get('category');
                setCatalogCategory(category || 'all');
            }
        };

        const handleLinkClick = (e) => {
            if (e.defaultPrevented) return;
            const anchor = e.target.closest('a');
            if (!anchor) return;
            const href = anchor.getAttribute('href');
            if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:')) {
                return;
            }

            const targetUrl = new URL(href, window.location.origin);
            if (targetUrl.origin !== window.location.origin) return;

            if (targetUrl.pathname === '/katalog') {
                e.preventDefault();
                navigateToView(
                    'katalog',
                    null,
                    targetUrl.searchParams.get('category') || 'all'
                );
                return;
            }

            const vendorSectionsByPath = {
                '/vendor/dashboard': 'overview',
                '/vendor/products': 'products',
                '/vendor/orders': 'orders',
                '/vendor/reports': 'reports',
                '/vendor/settings': 'settings',
            };
            if (vendorSectionsByPath[targetUrl.pathname]) {
                e.preventDefault();
                navigateToView(
                    'vendor-dashboard',
                    null,
                    null,
                    vendorSectionsByPath[targetUrl.pathname]
                );
                return;
            }

            if (
                targetUrl.pathname === '/' ||
                targetUrl.pathname === '/pc-builder' ||
                targetUrl.pathname === '/keranjang' ||
                targetUrl.pathname === '/checkout' ||
                targetUrl.pathname === '/akun'
            ) {
                e.preventDefault();
                const viewsByPath = {
                    '/': 'beranda',
                    '/pc-builder': 'pc-builder',
                    '/keranjang': 'cart',
                    '/checkout': 'checkout',
                    '/akun': 'account',
                };
                navigateToView(viewsByPath[targetUrl.pathname]);
            }
        };

        window.addEventListener('popstate', syncViewWithLocation);
        document.addEventListener('click', handleLinkClick);

        return () => {
            window.removeEventListener('popstate', syncViewWithLocation);
            document.removeEventListener('click', handleLinkClick);
        };
    }, []);

    const handleSelectProduct = (product) => {
        if (product?.slug) {
            getProductDetail(product.slug)
                .then((detail) => {
                    setSelectedProduct(detail || product);
                })
                .catch(() => {
                    setSelectedProduct(product);
                });
        } else {
            setSelectedProduct(product);
        }
        navigateToView('detail', product);
    };

    const handleBackToCatalog = () => {
        navigateToView('katalog');
    };

    const handleOpenQuickView = (product) => {
        if (product?.slug) {
            getProductDetail(product.slug)
                .then((detail) => {
                    setQuickViewProduct(detail || product);
                })
                .catch(() => {
                    setQuickViewProduct(product);
                });
        } else {
            setQuickViewProduct(product);
        }
    };

    const handleCloseQuickView = () => {
        setQuickViewProduct(null);
    };

    const handleOpenPCBuilder = (product) => {
        navigateToView('pc-builder', product);
    };

    const handleAuthenticated = ({ user, token }) => {
        setCurrentUser(user);
        setAccessToken(token);
        setStoredUser(user);
        setStoredToken(token);
        if (user.role === 'vendor') {
            navigateToView('vendor-dashboard');
        } else if (activeView === 'vendor-dashboard') {
            navigateToView('account');
        }
    };

    const handleLogout = async () => {
        const token = accessToken || getStoredToken();
        if (token) {
            try {
                await fetch('/api/logout', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
            } catch {
                // Ignore network error during logout
            }
        }

        setCurrentUser(null);
        setAccessToken(null);
        clearAuthStorage();
        if (window.location.pathname.startsWith('/vendor/')) {
            navigateToView('beranda');
        }
    };

    return (
        <Layout
            currentUser={currentUser}
            activeView={activeView}
            onAuthenticated={handleAuthenticated}
            onLogout={handleLogout}
            onSelectProduct={handleSelectProduct}
            onOpenCatalog={() => navigateToView('katalog')}
            onNavigateCategory={(category) => navigateToView('katalog', null, category)}
            onViewCart={() => navigateToView('cart')}
            onNavigateToCheckout={() => navigateToView('checkout')}
            onNavigateToAccount={() => navigateToView('account')}
            onNavigateVendorDashboard={() => navigateToView('vendor-dashboard')}
            onNavigateToStorefront={() => navigateToView('beranda')}
        >
            {({
                onAddToCart,
                onAddMultipleToCart,
                onOpenCart,
                onCompleteOrder,
                cartItems,
                onUpdateQuantity,
                onRemoveCartItem,
                onToggleWishlist,
                wishlistItems,
                onShowToast,
                onOpenAuth,
            }) => (
                <div className="w-full flex flex-col">
                    {/* Active View Display */}
                    {activeView === 'detail' && selectedProduct ? (
                        <ProductDetailPage
                            product={selectedProduct}
                            onBackToCatalog={handleBackToCatalog}
                            onAddToCart={onAddToCart}
                            onToggleWishlist={onToggleWishlist}
                            isWishlisted={wishlistItems.some(
                                (item) => item.id === selectedProduct.id
                            )}
                            onOpenPCBuilder={handleOpenPCBuilder}
                            onSelectProduct={handleSelectProduct}
                            relatedProducts={catalogProducts.filter(
                                (p) =>
                                    p.id !== selectedProduct.id &&
                                    (p.category === selectedProduct.category ||
                                        p.brand === selectedProduct.brand)
                            )}
                        />
                    ) : activeView === 'detail' ? (
                        <section className="max-w-[1280px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
                            <div className="max-w-xl mx-auto text-center rounded-[var(--radius-xl)] bg-[var(--surface)] border border-[var(--border)] p-8">
                                <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                                    Produk tidak ditemukan
                                </h1>
                                <p className="mt-2 text-sm text-[var(--text-secondary)]">
                                    Produk tersebut tidak tersedia di katalog saat ini.
                                </p>
                                <button
                                    type="button"
                                    onClick={handleBackToCatalog}
                                    className="inline-flex mt-5 px-5 py-3 rounded-[var(--radius-md)] bg-[var(--brand-600)] text-white text-sm font-semibold hover:bg-[var(--brand-700)] transition-colors"
                                >
                                    Kembali ke katalog
                                </button>
                            </div>
                        </section>
                    ) : activeView === 'katalog' ? (
                        <ProductCatalog
                            key={`${catalogCategory}-${catalogNavigationKey}`}
                            initialCategory={catalogCategory}
                            onAddToCart={onAddToCart}
                            onToggleWishlist={onToggleWishlist}
                            wishlistItems={wishlistItems}
                            onQuickView={handleOpenQuickView}
                            onSelectProduct={handleSelectProduct}
                            products={catalogProducts}
                        />
                    ) : activeView === 'pc-builder' ? (
                        <PCBuilderSimulation
                            initialSelectedProduct={builderProduct}
                            onAddMultipleToCart={onAddMultipleToCart}
                            onOpenCart={onOpenCart}
                            onShowToast={onShowToast}
                        />
                    ) : activeView === 'cart' ? (
                        <CartPage
                            items={cartItems}
                            onUpdateQuantity={onUpdateQuantity}
                            onRemoveItem={onRemoveCartItem}
                            onContinueShopping={() => navigateToView('katalog')}
                            onCheckout={() => navigateToView('checkout')}
                        />
                    ) : activeView === 'checkout' ? (
                        <CheckoutPage
                            items={cartItems}
                            onUpdateQuantity={onUpdateQuantity}
                            onRemoveItem={onRemoveCartItem}
                            onBackToCart={() => navigateToView('cart')}
                            onCompleteOrder={onCompleteOrder}
                            onReturnHome={() => navigateToView('beranda')}
                            accessToken={accessToken}
                        />
                    ) : activeView === 'account' ? (
                        <AccountSettingsPage
                            user={currentUser}
                            onOpenAuth={onOpenAuth}
                        />
                    ) : activeView === 'vendor-dashboard' ? (
                        <VendorDashboard
                            user={currentUser}
                            section={vendorSection}
                            onNavigateSection={(section) => navigateToView('vendor-dashboard', null, null, section)}
                            onNavigateAccount={() => navigateToView('account')}
                            onNavigateToStorefront={() => navigateToView('beranda')}
                            onOpenAuth={onOpenAuth}
                            accessToken={accessToken}
                        />
                    ) : (
                        <div className="space-y-12 pb-16">
                            {/* Hero Section */}
                            <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
                                <div className="relative overflow-hidden rounded-[var(--radius-xl)] bg-gradient-to-br from-[var(--brand-950)] via-[var(--brand-900)] to-[var(--brand-800)] text-white p-8 sm:p-12 lg:p-16 shadow-[var(--shadow-elevated)] border border-[var(--brand-800)]">
                                    <div className="relative z-10 max-w-2xl space-y-6">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand-700)]/40 border border-[var(--brand-500)]/30 text-xs font-semibold text-[var(--brand-100)] backdrop-blur-xs">
                                            <ShieldCheckIcon className="w-4 h-4 text-emerald-400" />
                                            <span>Pusat Hardware PC Resmi & Tepercaya #1</span>
                                        </div>

                                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15]">
                                            Bangun PC Impian Anda dengan{' '}
                                            <span className="text-[var(--brand-500)] underline decoration-[var(--brand-500)]/30">
                                                Komponen Terbaik
                                            </span>
                                        </h1>

                                        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                                            Pilihan PC rakitan siap pakai dan beragam komponen komputer resmi dari distributor ternama dengan garansi penuh.
                                        </p>

                                        <div className="flex flex-wrap items-center gap-3 pt-2">
                                            <button
                                                type="button"
                                                onClick={() => navigateToView('katalog')}
                                                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[var(--radius-md)] bg-[var(--brand-600)] text-white font-semibold text-sm hover:bg-[var(--brand-500)] transition-colors shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                                            >
                                                <span>Buka Katalog Hardware</span>
                                                <ArrowRightIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => navigateToView('katalog', null, 'pc-siap-pakai')}
                                                className="inline-flex items-center justify-center px-6 py-3 rounded-[var(--radius-md)] bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-colors border border-white/20"
                                            >
                                                Lihat PC Siap Pakai
                                            </button>
                                        </div>
                                    </div>

                                    <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-10 pointer-events-none hidden md:flex items-center justify-center">
                                        <CpuIcon className="w-96 h-96 text-white" />
                                    </div>
                                </div>
                            </section>

                            {/* Quick Category Cards */}
                            <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                                    {categoryCards.map((cat, idx) => {
                                        const IconComponent = cat.icon;
                                        return (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => {
                                                    if (cat.id === 'builder') {
                                                        navigateToView('pc-builder');
                                                    } else {
                                                        navigateToView('katalog', null, cat.id);
                                                    }
                                                }}
                                                className={`group p-4 sm:p-5 rounded-[var(--radius-lg)] border transition-all duration-200 flex flex-col justify-between text-left ${
                                                    cat.highlight
                                                        ? 'bg-[var(--brand-50)] dark:bg-[var(--surface-muted)] border-[var(--brand-500)] shadow-xs'
                                                        : 'bg-[var(--surface)] border-[var(--border)] hover:border-[var(--brand-500)] shadow-[var(--shadow-card)]'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between mb-3">
                                                    <div
                                                        className={`p-2.5 rounded-[var(--radius-md)] ${
                                                            cat.highlight
                                                                ? 'bg-[var(--brand-600)] text-white'
                                                                : 'bg-[var(--surface-muted)] text-[var(--brand-600)]'
                                                        }`}
                                                    >
                                                        <IconComponent className="w-5 h-5" />
                                                    </div>
                                                    <ArrowRightIcon className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--brand-600)] group-hover:translate-x-1 transition-all" />
                                                </div>
                                                <div>
                                                    <h3 className="text-sm sm:text-base font-semibold text-[var(--text-primary)]">
                                                        {cat.name}
                                                    </h3>
                                                    <span className="text-xs text-[var(--text-muted)]">{cat.count}</span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* PC Builder Callout Banner */}
                            <section id="pc-builder" className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="rounded-[var(--radius-xl)] bg-[var(--surface)] border border-[var(--border)] p-8 sm:p-10 shadow-[var(--shadow-card)] flex flex-col lg:flex-row items-center justify-between gap-6">
                                    <div className="space-y-2 max-w-xl text-center lg:text-left">
                                        <span className="inline-block px-3 py-0.5 rounded-full text-xs font-semibold bg-[var(--brand-50)] text-[var(--brand-700)] border border-[var(--brand-100)]">
                                            Fitur Interaktif
                                        </span>
                                        <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                                            Simulasi Rakit PC Tanpa Ragu Kompatibilitas
                                        </h2>
                                        <p className="text-sm text-[var(--text-secondary)]">
                                            Pilih CPU, Motherboard, GPU, dan PSU yang sesuai. Sistem kalkulator kami akan memeriksa kebutuhan socket, form-factor, dan kapasitas daya watt secara cerdas.
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => navigateToView('pc-builder')}
                                            className="px-5 py-2.5 rounded-[var(--radius-md)] bg-[var(--brand-600)] text-white text-sm font-semibold hover:bg-[var(--brand-700)] transition-colors shadow-sm"
                                        >
                                            Mulai Simulasi PC Builder →
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => navigateToView('katalog')}
                                            className="px-4 py-2.5 rounded-[var(--radius-md)] bg-[var(--surface-muted)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border)] text-sm font-medium transition-colors"
                                        >
                                            Katalog Komponen
                                        </button>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}

                    {/* Global Quick View Modal */}
                    <ProductQuickViewModal
                        isOpen={Boolean(quickViewProduct)}
                        product={quickViewProduct}
                        onClose={handleCloseQuickView}
                        onAddToCart={onAddToCart}
                        onToggleWishlist={onToggleWishlist}
                        isWishlisted={wishlistItems.some(
                            (item) => item.id === quickViewProduct?.id
                        )}
                        onOpenPCBuilder={handleOpenPCBuilder}
                        onViewFullDetail={handleSelectProduct}
                    />
                </div>
            )}
        </Layout>
    );
}

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}
